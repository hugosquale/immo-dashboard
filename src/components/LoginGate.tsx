"use client";

import { useState } from "react";
import { useSuivi } from "./SuiviProvider";

export default function LoginGate() {
  const { connecter } = useSuivi();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const valide = prenom.trim().length > 0 && nom.trim().length > 0;

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!valide || envoi) return;
    setErreur(null);
    setEnvoi(true);
    try {
      await connecter(prenom, nom);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  const champ =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5 text-[15px] text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]";

  return (
    <div className="tech-grid relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="glow-card animate-fade-in-up relative w-full max-w-md">
        <form onSubmit={soumettre} className="gradient-panel rounded-[23px] p-7 sm:p-9">
          <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-[28px]">
            Pour vous connecter, entrez votre{" "}
            <span className="bg-gradient-to-r from-[#3d9dff] to-[#0055b4] bg-clip-text text-transparent">
              nom et prénom
            </span>
          </h1>
          <p className="mt-3 text-center text-sm leading-relaxed text-[var(--muted)]">
            Votre lecture des recommandations est enregistrée sous votre nom.
          </p>

          <div className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prenom" className="text-xs font-medium text-[var(--muted)]">
                Prénom
              </label>
              <input
                id="prenom"
                autoComplete="given-name"
                autoFocus
                placeholder="Ex : Michel"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className={champ}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="nom" className="text-xs font-medium text-[var(--muted)]">
                Nom
              </label>
              <input
                id="nom"
                autoComplete="family-name"
                placeholder="Ex : Dupont"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={champ}
              />
            </div>

            <button type="submit" disabled={!valide || envoi} className="btn-primary mt-2 rounded-xl px-6 py-4 text-base font-bold">
              {envoi ? "Connexion…" : "Accéder à Squale Assistant"}
            </button>

            {erreur && <p className="text-center text-xs text-[var(--danger)]">{erreur}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
