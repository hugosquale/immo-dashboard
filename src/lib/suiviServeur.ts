/* Lecture et écriture du suivi de lecture, dans le Google Sheet.
   Tant que le compte de service n'est pas configuré, un stockage en mémoire
   prend le relais : l'application reste utilisable, mais rien n'est archivé
   et tout est perdu au redémarrage du serveur. */

import { FICHES } from "./recommandations";
import { cleIdentite, rapprocher, type Connu } from "./identite";
import {
  ONGLET_UTILISATEURS,
  ONGLET_JOURNAL,
  ajouterLigne,
  ecrireLigne,
  initialiser,
  lire,
  sheetsConfigure,
} from "./sheets";

export interface Utilisateur {
  cle: string;
  prenom: string;
  nom: string;
  premiere: string;
  derniere: string;
  connexions: number;
  /** Pourcentage lu, par clé de fiche. */
  progression: Record<string, number>;
}

const PAGES = FICHES.map((f) => f.cle);
const TITRES = FICHES.map((f) => f.onglet);

const ENTETES = [
  "Clé",
  "Prénom",
  "Nom",
  "Première connexion",
  "Dernière connexion",
  "Nb connexions",
  ...TITRES.map((t) => `${t} (%)`),
  "Toutes lues",
];

const memoire = new Map<string, Utilisateur>();

function toutesLues(p: Record<string, number>): boolean {
  return PAGES.every((c) => (p[c] ?? 0) >= 100);
}

function enLigne(u: Utilisateur): (string | number)[] {
  return [
    u.cle,
    u.prenom,
    u.nom,
    u.premiere,
    u.derniere,
    u.connexions,
    ...PAGES.map((c) => u.progression[c] ?? 0),
    toutesLues(u.progression) ? "OUI" : "NON",
  ];
}

/** Renvoie les utilisateurs du Sheet, avec le numéro de ligne de chacun. */
async function charger(): Promise<Map<string, { u: Utilisateur; ligne: number }>> {
  const resultat = new Map<string, { u: Utilisateur; ligne: number }>();

  if (!sheetsConfigure()) {
    memoire.forEach((u, cle) => resultat.set(cle, { u, ligne: 0 }));
    return resultat;
  }

  await initialiser(ENTETES);
  const lignes = await lire(`${ONGLET_UTILISATEURS}!A2:Z`);

  lignes.forEach((l, i) => {
    if (!l[0]) return;
    const progression: Record<string, number> = {};
    PAGES.forEach((c, k) => {
      progression[c] = Number(l[6 + k] ?? 0) || 0;
    });
    resultat.set(l[0], {
      ligne: i + 2,
      u: {
        cle: l[0],
        prenom: l[1] ?? "",
        nom: l[2] ?? "",
        premiere: l[3] ?? "",
        derniere: l[4] ?? "",
        connexions: Number(l[5] ?? 0) || 0,
        progression,
      },
    });
  });
  return resultat;
}

async function enregistrer(u: Utilisateur, ligne: number): Promise<void> {
  if (!sheetsConfigure()) {
    memoire.set(u.cle, u);
    return;
  }
  if (ligne > 0) await ecrireLigne(ONGLET_UTILISATEURS, ligne, enLigne(u));
  else await ajouterLigne(ONGLET_UTILISATEURS, enLigne(u));
}

async function journal(
  u: Utilisateur,
  saisie: string,
  evenement: string,
  page = "",
  pourcentage: number | string = ""
): Promise<void> {
  if (!sheetsConfigure()) return;
  await ajouterLigne(ONGLET_JOURNAL, [
    new Date().toISOString(),
    u.cle,
    u.prenom,
    u.nom,
    saisie,
    evenement,
    page,
    pourcentage,
  ]);
}

/** Connexion : rapproche d'un utilisateur connu, ou en crée un. */
export async function connecter(prenom: string, nom: string): Promise<{ utilisateur: Utilisateur; rapproche: boolean }> {
  const tous = await charger();
  const connus: Connu[] = [...tous.values()].map(({ u }) => ({ cle: u.cle, prenom: u.prenom, nom: u.nom }));

  const trouve = rapprocher(prenom, nom, connus);
  const saisie = `${prenom} ${nom}`.trim();
  const maintenant = new Date().toISOString();

  if (trouve) {
    const entree = tous.get(trouve.cle)!;
    const u: Utilisateur = { ...entree.u, derniere: maintenant, connexions: entree.u.connexions + 1 };
    await enregistrer(u, entree.ligne);
    await journal(u, saisie, "connexion");
    return { utilisateur: u, rapproche: trouve.cle !== cleIdentite(prenom, nom) };
  }

  const u: Utilisateur = {
    cle: cleIdentite(prenom, nom),
    prenom: prenom.trim(),
    nom: nom.trim(),
    premiere: maintenant,
    derniere: maintenant,
    connexions: 1,
    progression: Object.fromEntries(PAGES.map((c) => [c, 0])),
  };
  await enregistrer(u, 0);
  await journal(u, saisie, "première connexion");
  return { utilisateur: u, rapproche: false };
}

/** Enregistre une progression de lecture. Ne redescend jamais le pourcentage déjà atteint. */
export async function progresser(cle: string, page: string, pourcentage: number): Promise<Utilisateur | null> {
  if (!PAGES.includes(page)) return null;

  const tous = await charger();
  const entree = tous.get(cle);
  if (!entree) return null;

  const avant = entree.u.progression[page] ?? 0;
  const apres = Math.min(100, Math.max(avant, Math.round(pourcentage)));
  if (apres === avant) return entree.u;

  const u: Utilisateur = { ...entree.u, progression: { ...entree.u.progression, [page]: apres } };

  if (sheetsConfigure() && entree.ligne > 0) {
    // une seule cellule à écrire dans le cas courant
    await ecrireLigne(ONGLET_UTILISATEURS, entree.ligne, enLigne(u));
  } else {
    await enregistrer(u, entree.ligne);
  }

  // on ne journalise que le franchissement des 100 %, pour ne pas noyer l'historique
  if (avant < 100 && apres >= 100) {
    const titre = TITRES[PAGES.indexOf(page)];
    await journal(u, "", "fiche lue en entier", titre, 100);
    if (toutesLues(u.progression)) {
      await journal(u, "", "toutes les recommandations lues", "", "");
    }
  }
  return u;
}

export { PAGES, ENTETES };
export const archivageActif = sheetsConfigure;
