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

type Etat = "ferme" | "mot-de-passe" | "liste";

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

export default function AdminPanel() {
  const [etat, setEtat] = useState<Etat>("ferme");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [clients, setClients] = useState<Utilisateur[]>([]);
  const [source, setSource] = useState<"sheets" | "memoire">("memoire");
  const [chargement, setChargement] = useState(false);

  async function chargerClients() {
    setChargement(true);
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
    } finally {
      setChargement(false);
    }
  }

  async function ouvrir() {
    setErreur(null);
    setEtat("mot-de-passe");
    await chargerClients();
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
    setEtat("ferme");
  }

  function fermer() {
    setEtat("ferme");
    setErreur(null);
    setMotDePasse("");
  }

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        title="Administration"
        aria-label="Administration"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 13.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4.5a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10.5a1.65 1.65 0 0 0 1-1.51V4.5a2 2 0 1 1 4 0v.09c0 .67.39 1.27 1 1.51.59.25 1.27.12 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10c.24.6.84 1 1.51 1h.09a2 2 0 1 1 0 4h-.09c-.67 0-1.27.4-1.51 1Z" />
        </svg>
      </button>

      {etat !== "ferme" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm" onClick={fermer}>
          <div
            className="glow-card animate-fade-in-up w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gradient-panel max-h-[80vh] overflow-y-auto rounded-[23px] p-7 sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-blue)]/20 bg-[var(--accent-blue-soft)] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent-blue)]">
                    Administration
                  </span>
                  <h2 className="mt-3 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
                    Suivi des clients
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={fermer}
                  aria-label="Fermer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4"><path d="m3 3 10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                </button>
              </div>

              {etat === "mot-de-passe" && (
                <form onSubmit={soumettre} className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {chargement ? "Vérification en cours…" : "Entrez le mot de passe administrateur pour accéder au suivi."}
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
              )}

              {etat === "liste" && (
                <div className="flex flex-col gap-5">
                  {source === "memoire" && (
                    <p className="rounded-xl border border-[var(--warning)]/25 bg-[var(--warning-soft)] px-4 py-3 text-xs leading-relaxed text-[var(--warning)]">
                      Google Sheets n&apos;est pas configuré : ces données sont stockées en mémoire seulement et
                      seront perdues au redémarrage du serveur.
                    </p>
                  )}

                  {clients.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[var(--muted)]">Aucune connexion enregistrée pour l&apos;instant.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {clients.map((c) => (
                        <div key={c.cle} className="card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
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
        </div>
      )}
    </>
  );
}
