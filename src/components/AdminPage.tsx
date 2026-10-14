"use client";

import { useState } from "react";

interface Utilisateur {
  cle: string;
  prenom: string;
  nom: string;
  premiere: string;
  derniere: string;
  connexions: number;
  progression: Record<string, number>;
  toutesLues: boolean;
}

interface Page {
  cle: string;
  titre: string;
}

type Etat = "mot-de-passe" | "liste";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function PastilleProgression({ valeur }: { valeur: number }) {
  const lu = valeur >= 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${valeur}%`, background: lu ? "var(--accent-green)" : "var(--accent-blue)" }}
        />
      </div>
      <span className={`w-9 text-right text-xs font-semibold tabular-nums ${lu ? "text-[var(--accent-green)]" : "text-[var(--muted)]"}`}>
        {valeur}%
      </span>
    </div>
  );
}

export default function AdminPage() {
  const [etat, setEtat] = useState<Etat>("mot-de-passe");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [clients, setClients] = useState<Utilisateur[]>([]);
  const [source, setSource] = useState<"sheets" | "memoire">("memoire");

  async function chargerClients() {
    try {
      const r = await fetch("/api/admin/clients");
      if (r.ok) {
        const data = await r.json();
        setPages(data.pages);
        setClients(data.clients);
        setSource(data.source);
        setEtat("liste");
      } else {
        setEtat("mot-de-passe");
      }
    } catch {
      setEtat("mot-de-passe");
    }
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!motDePasse.trim() || envoi) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse }),
      });
      if (!r.ok) {
        const corps = await r.json().catch(() => null);
        setErreur(corps?.error ?? "Connexion impossible.");
        return;
      }
      setMotDePasse("");
      await chargerClients();
    } catch {
      setErreur("Connexion impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  async function deconnecter() {
    await fetch("/api/admin/auth", { method: "DELETE" }).catch(() => {});
    setClients([]);
    setMotDePasse("");
    setEtat("mot-de-passe");
  }

  return (
    <div className="tech-grid relative min-h-full flex-1">
      <div className="relative mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="animate-fade-in-up mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-blue)]/20 bg-[var(--accent-blue-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent-blue)]">
            Administration
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-[42px]">
            Suivi des clients
          </h1>
        </header>

        {etat === "mot-de-passe" && (
          <div className="glow-card animate-fade-in-up mx-auto w-full max-w-sm">
            <form onSubmit={soumettre} className="gradient-panel flex flex-col gap-4 rounded-[23px] p-7 sm:p-8">
              <p className="text-center text-sm leading-relaxed text-[var(--muted)]">
                Entrez le mot de passe administrateur pour accéder au suivi.
              </p>
              <input
                type="password"
                autoFocus
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5 text-[15px] text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
              />
              <button type="submit" disabled={!motDePasse.trim() || envoi} className="btn-primary rounded-xl px-6 py-3.5 text-sm font-bold">
                {envoi ? "Connexion…" : "Accéder au suivi"}
              </button>
              {erreur && <p className="text-center text-xs text-[var(--danger)]">{erreur}</p>}
            </form>
          </div>
        )}

        {etat === "liste" && (
          <div className="stagger-children flex flex-col gap-5">
            {source === "memoire" && (
              <p className="rounded-xl border border-[var(--warning)]/25 bg-[var(--warning-soft)] px-4 py-3 text-xs leading-relaxed text-[var(--warning)]">
                Google Sheets n&apos;est pas configuré : ces données sont stockées en mémoire seulement et seront
                perdues au redémarrage du serveur.
              </p>
            )}

            {clients.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--muted)]">Aucune connexion enregistrée pour l&apos;instant.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {clients.map((c) => (
                  <div key={c.cle} className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[15px] font-bold text-[var(--foreground)]">
                          {c.prenom} {c.nom}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {c.connexions} connexion{c.connexions > 1 ? "s" : ""} · dernière le {formatDate(c.derniere)}
                        </p>
                      </div>
                      {c.toutesLues ? (
                        <span className="shrink-0 rounded-full bg-[var(--accent-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent-green)]">
                          Tout lu
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                          En cours
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {pages.map((p) => (
                        <div key={p.cle} className="flex items-center justify-between gap-3">
                          <span className="truncate text-xs text-[var(--muted)]">{p.titre}</span>
                          <PastilleProgression valeur={c.progression[p.cle] ?? 0} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <button type="button" onClick={chargerClients} className="text-xs font-semibold text-[var(--accent-blue)] hover:underline">
                Actualiser
              </button>
              <button type="button" onClick={deconnecter} className="btn-ghost rounded-lg px-3 py-1.5 text-xs font-semibold">
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
