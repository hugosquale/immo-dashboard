"use client";

import { useEffect, useRef, useState } from "react";
import type { Bloc, Fiche } from "@/lib/recommandations";
import { useSuivi } from "./SuiviProvider";

function IconTile({ icone, ton = "bleu" }: { icone: string; ton?: "bleu" | "rouge" }) {
  const fond =
    ton === "rouge"
      ? "bg-[var(--danger-soft)] ring-[var(--danger)]/20"
      : "bg-[var(--accent-blue-soft)] ring-[var(--accent-blue)]/15";
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ring-1 ${fond}`}>
      {icone}
    </span>
  );
}

function Carte({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`card-lift rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}

function Entete({ icone, titre, ton }: { icone: string; titre: string; ton?: "bleu" | "rouge" }) {
  return (
    <div className="mb-5 flex items-center gap-3.5">
      <IconTile icone={icone} ton={ton} />
      <h2 className="text-lg font-bold leading-snug tracking-tight text-[var(--foreground)] sm:text-xl">{titre}</h2>
    </div>
  );
}

function RenduBloc({ bloc }: { bloc: Bloc }) {
  if (bloc.type === "liste") {
    return (
      <Carte>
        <Entete icone={bloc.icone} titre={bloc.titre} />
        <ul className="flex flex-col gap-3.5">
          {bloc.items.map((t, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-blue)]" />
              <p className="text-[15px] leading-relaxed text-[var(--muted)]">{t}</p>
            </li>
          ))}
        </ul>
      </Carte>
    );
  }

  if (bloc.type === "etapes") {
    return (
      <Carte>
        <Entete icone={bloc.icone} titre={bloc.titre} />
        <ol className="flex flex-col gap-4">
          {bloc.items.map((t, i) => (
            <li key={i} className="flex gap-4">
              <span className="icon-badge flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white">
                {i + 1}
              </span>
              <p className="pt-0.5 text-[15px] leading-relaxed text-[var(--muted)]">{t}</p>
            </li>
          ))}
        </ol>
      </Carte>
    );
  }

  if (bloc.type === "citations") {
    return (
      <Carte>
        <Entete icone={bloc.icone} titre={bloc.titre} />
        <div className="flex flex-col gap-3">
          {bloc.items.map((t, i) => (
            <p
              key={i}
              className="rounded-2xl border-l-[3px] border-[var(--accent-blue)] bg-[var(--accent-blue-soft)] px-5 py-3.5 text-[15px] font-medium italic leading-relaxed text-[var(--foreground)]"
            >
              «&nbsp;{t}&nbsp;»
            </p>
          ))}
        </div>
      </Carte>
    );
  }

  if (bloc.type === "eviter") {
    return (
      <Carte className="border-[var(--danger)]/25 bg-[var(--danger-soft)]">
        <Entete icone={bloc.icone} titre={bloc.titre} ton="rouge" />
        <ul className="flex flex-col gap-3.5">
          {bloc.items.map((t, i) => (
            <li key={i} className="flex gap-3.5">
              <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-[var(--danger)]">
                <circle cx="8" cy="8" r="7.2" fill="currentColor" />
                <path d="m5.4 5.4 5.2 5.2M10.6 5.4l-5.2 5.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <p className="text-[15px] leading-relaxed text-[var(--foreground)]">{t}</p>
            </li>
          ))}
        </ul>
      </Carte>
    );
  }

  if (bloc.type === "qr") {
    return (
      <Carte>
        <Entete icone={bloc.icone} titre={bloc.titre} />
        <div className="flex flex-col gap-4">
          {bloc.items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5">
              <p className="mb-3 text-[15px] font-semibold leading-snug text-[var(--foreground)]">
                «&nbsp;{it.q}&nbsp;»
              </p>
              <div className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-[var(--accent-blue)]" aria-hidden>
                  <svg viewBox="0 0 16 16" className="h-4 w-4">
                    <path
                      d="M3 8h9M8.5 4.5 12.5 8l-4 3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-[15px] italic leading-relaxed text-[var(--muted)]">«&nbsp;{it.r}&nbsp;»</p>
              </div>
            </div>
          ))}
        </div>
      </Carte>
    );
  }

  if (bloc.type === "encadre") {
    return (
      <section className="glow-card">
        <div className="rounded-[23px] bg-gradient-to-br from-[#0a84ff] via-[#0071e3] to-[#0050ab] p-6 sm:p-7">
          <div className="mb-4 flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl ring-1 ring-white/25">
              {bloc.icone}
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{bloc.titre}</h2>
          </div>
          <p className="text-[15px] leading-relaxed text-white/90">{bloc.texte}</p>
        </div>
      </section>
    );
  }

  // script
  return (
    <section className="glow-card">
      <div className="gradient-panel relative overflow-hidden rounded-[23px] p-6 sm:p-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-10 select-none text-[160px] font-bold leading-none text-[var(--accent-blue)] opacity-[0.07]"
        >
          ”
        </span>
        <div className="relative">
          <Entete icone={bloc.icone} titre={bloc.titre} />
          <p className="text-[17px] font-medium italic leading-relaxed text-[var(--foreground)] sm:text-lg">
            «&nbsp;{bloc.texte}&nbsp;»
          </p>
          {bloc.note && (
            <p className="mt-5 border-t border-[var(--border)] pt-4 text-[13.5px] leading-relaxed text-[var(--muted-2)]">
              {bloc.note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Bandeau collant indiquant la progression de lecture de la fiche. */
function BarreLecture({ pourcentage }: { pourcentage: number }) {
  const lu = pourcentage >= 100;
  return (
    <div className="sticky top-16 z-20 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-5 py-2.5 sm:px-8">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${pourcentage}%`, background: lu ? "var(--accent-green)" : "var(--accent-blue)" }}
          />
        </div>
        {lu ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent-green-soft)] px-3 py-1 text-xs font-bold text-[var(--accent-green)]">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
              <circle cx="8" cy="8" r="7.2" fill="currentColor" />
              <path d="m5 8.2 2.2 2.2L11.2 6" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Validé · 100 %
          </span>
        ) : (
          <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--muted)]">
            Lecture : {pourcentage} %
          </span>
        )}
      </div>
    </div>
  );
}

export default function RecoPage({ fiche }: { fiche: Fiche }) {
  const { utilisateur, signaler } = useSuivi();
  // mesure locale du défilement ; la valeur affichée ne redescend jamais
  // sous la progression déjà enregistrée pour cet utilisateur
  const [mesure, setMesure] = useState(0);
  const pourcentage = Math.max(mesure, utilisateur?.progression[fiche.cle] ?? 0);

  // on garde la dernière version de `signaler` sans relancer l'effet de mesure
  const signalerRef = useRef(signaler);
  useEffect(() => {
    signalerRef.current = signaler;
  }, [signaler]);

  useEffect(() => {
    // on repart du haut, sinon la position héritée de la page précédente
    // pourrait valider la fiche sans que personne ne l'ait lue
    window.scrollTo(0, 0);

    let atteint = 0;
    const mesurer = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      // page plus courte que l'écran : tout est visible d'emblée
      const brut = max <= 8 ? 100 : ((window.scrollY + 4) / max) * 100;
      const valeur = Math.min(100, Math.max(0, Math.round(brut)));
      if (valeur > atteint) {
        atteint = valeur;
        setMesure((p) => Math.max(p, valeur));
        signalerRef.current(fiche.cle, valeur);
      }
    };

    // laisse la mise en page se stabiliser avant la première mesure
    const t = setTimeout(mesurer, 250);
    window.addEventListener("scroll", mesurer, { passive: true });
    window.addEventListener("resize", mesurer);
    // filet de sécurité : certains contextes n'émettent pas d'événement de
    // défilement (contenu chargé tardivement, défilement programmatique,
    // inertie sur mobile). Une mesure périodique garantit le suivi.
    const minuteur = setInterval(mesurer, 500);
    return () => {
      clearTimeout(t);
      clearInterval(minuteur);
      window.removeEventListener("scroll", mesurer);
      window.removeEventListener("resize", mesurer);
    };
  }, [fiche.cle]);

  return (
    <div className="tech-grid relative min-h-full flex-1">
      <BarreLecture pourcentage={pourcentage} />
      <div className="relative mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="animate-fade-in-up mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-blue)]/20 bg-[var(--accent-blue-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent-blue)]">
            Recommandations Squale
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-[42px]">
            <span className="bg-gradient-to-r from-[#3d9dff] via-[#0071e3] to-[#0055b4] bg-clip-text text-transparent">
              {fiche.titre}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">{fiche.accroche}</p>
        </header>

        <div className="stagger-children flex flex-col gap-5">
          {fiche.blocs.map((bloc, i) => (
            <RenduBloc key={i} bloc={bloc} />
          ))}
        </div>
      </div>
    </div>
  );
}
