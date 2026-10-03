"use client";

import { createContext, useCallback, useContext, useRef, useState, useSyncExternalStore } from "react";

export interface Utilisateur {
  cle: string;
  prenom: string;
  nom: string;
  premiere: string;
  derniere: string;
  connexions: number;
  progression: Record<string, number>;
}

interface Contexte {
  utilisateur: Utilisateur | null;
  pret: boolean;
  archivage: boolean;
  connecter: (prenom: string, nom: string) => Promise<void>;
  deconnecter: () => void;
  signaler: (page: string, pourcentage: number) => void;
}

const STOCKAGE = "squale-suivi-v1";

/* L'identité est conservée dans localStorage et lue via useSyncExternalStore :
   c'est l'API prévue pour s'abonner à une source extérieure à React, et elle
   évite de déclencher un rendu en cascade depuis un effet. */

const abonnes = new Set<() => void>();
let bruteEnCache: string | null = null;
let valeurEnCache: Utilisateur | null = null;

function lireStockage(): Utilisateur | null {
  let brute: string | null = null;
  try {
    brute = localStorage.getItem(STOCKAGE);
  } catch {
    return null;
  }
  // on ne reparse que si la chaîne a changé, pour renvoyer une référence stable
  if (brute !== bruteEnCache) {
    bruteEnCache = brute;
    try {
      const u = brute ? (JSON.parse(brute) as Utilisateur) : null;
      valeurEnCache = u?.cle ? u : null;
    } catch {
      valeurEnCache = null;
    }
  }
  return valeurEnCache;
}

function ecrireStockage(u: Utilisateur | null): void {
  try {
    if (u) localStorage.setItem(STOCKAGE, JSON.stringify(u));
    else localStorage.removeItem(STOCKAGE);
  } catch {
    // stockage indisponible : la session reste valable jusqu'au rechargement
  }
  abonnes.forEach((f) => f());
}

function sabonner(f: () => void): () => void {
  abonnes.add(f);
  window.addEventListener("storage", f);
  return () => {
    abonnes.delete(f);
    window.removeEventListener("storage", f);
  };
}

const SuiviContext = createContext<Contexte | null>(null);

export function useSuivi(): Contexte {
  const ctx = useContext(SuiviContext);
  if (!ctx) throw new Error("useSuivi doit être utilisé dans un SuiviProvider.");
  return ctx;
}

export default function SuiviProvider({ children }: { children: React.ReactNode }) {
  const utilisateur = useSyncExternalStore(sabonner, lireStockage, () => null);
  // faux pendant le rendu serveur et l'hydratation, vrai ensuite
  const pret = useSyncExternalStore(
    sabonner,
    () => true,
    () => false
  );
  const [archivage, setArchivage] = useState(false);

  // dernier pourcentage envoyé par page, pour ne pas inonder le serveur
  const envoye = useRef<Record<string, number>>({});

  const memoriser = useCallback((u: Utilisateur | null) => {
    ecrireStockage(u);
  }, []);

  const connecter = useCallback(
    async (prenom: string, nom: string) => {
      const reponse = await fetch("/api/suivi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connexion", prenom, nom }),
      });
      if (!reponse.ok) {
        const corps = await reponse.json().catch(() => null);
        throw new Error(corps?.error ?? "Connexion impossible.");
      }
      const data = (await reponse.json()) as { utilisateur: Utilisateur; archivage: boolean };
      envoye.current = { ...data.utilisateur.progression };
      setArchivage(data.archivage);
      memoriser(data.utilisateur);
    },
    [memoriser]
  );

  const deconnecter = useCallback(() => {
    envoye.current = {};
    memoriser(null);
  }, [memoriser]);

  const signaler = useCallback(
    (page: string, pourcentage: number) => {
      if (!utilisateur) return;
      const arrondi = Math.min(100, Math.max(0, Math.round(pourcentage)));
      const deja = utilisateur.progression[page] ?? 0;
      if (arrondi <= deja) return;

      // mise à jour optimiste, pour que la barre réagisse tout de suite
      memoriser({ ...utilisateur, progression: { ...utilisateur.progression, [page]: arrondi } });

      // on n'appelle le serveur que par paliers de 10 %, et toujours à 100 %
      const dernier = envoye.current[page] ?? 0;
      if (arrondi < 100 && arrondi - dernier < 10) return;
      envoye.current[page] = arrondi;

      fetch("/api/suivi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "progression", cle: utilisateur.cle, page, pourcentage: arrondi }),
        keepalive: true,
      }).catch(() => {
        // hors ligne : la progression locale reste, elle repartira au prochain palier
        envoye.current[page] = dernier;
      });
    },
    [utilisateur, memoriser]
  );

  return (
    <SuiviContext.Provider value={{ utilisateur, pret, archivage, connecter, deconnecter, signaler }}>
      {children}
    </SuiviContext.Provider>
  );
}
