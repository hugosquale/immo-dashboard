import type { ReactNode } from "react";

/* Icônes des 4 catégories, dans un repère 0–24, en blanc sur la pastille
   dégradée de chaque carte. */

const RadarIcon: ReactNode = (
  <>
    <circle cx="12" cy="12" r="8.5" opacity="0.35" />
    <circle cx="12" cy="12" r="5" opacity="0.6" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <path d="M12 12 18.5 6.5" />
  </>
);

const GaugeIcon: ReactNode = (
  <>
    <path d="M4 15.5a8 8 0 1 1 16 0" />
    <path d="M12 15.5 16 10" />
    <path d="M4 19h16" opacity="0.4" />
  </>
);

const ChecklistIcon: ReactNode = (
  <>
    <rect x="5" y="3.3" width="14" height="17.4" rx="2.3" />
    <path d="M9 2.4h6a1 1 0 0 1 1 1v1.3H8V3.4a1 1 0 0 1 1-1Z" fill="currentColor" stroke="none" opacity="0.5" />
    <path d="m8.3 10.3 1.7 1.7 3.2-3.4" stroke="#ffffff" />
    <path d="M14.7 10h3.6M8.3 15.3h10" stroke="#ffffff" opacity="0.75" />
  </>
);

interface Carte {
  cle: string;
  titre: string;
  accroche: string;
  icone: ReactNode;
  grad: string;
}

const CARTES: Carte[] = [
  {
    cle: "vendeurs",
    titre: "Chers vendeurs",
    accroche: "Les bons acheteurs, trouvés grâce à notre IA.",
    icone: RadarIcon,
    grad: "linear-gradient(145deg, #5cb0ff 0%, #0d7bec 45%, #0043a0 100%)",
  },
  {
    cle: "analyse",
    titre: "Analyse avancée",
    accroche: "Contenus marketing, stratégie et argumentaire générés en un clic.",
    icone: GaugeIcon,
    grad: "linear-gradient(145deg, #ff93b4 0%, #f4356a 45%, #a50f42 100%)",
  },
  {
    cle: "recommandations",
    titre: "Recommandations Squale",
    accroche: "Le guide de l'agent : appel, discours, rendez-vous, conformité.",
    icone: ChecklistIcon,
    grad: "linear-gradient(145deg, #a4aebd 0%, #616c7c 45%, #333b46 100%)",
  },
];

function CarteCategorie({ carte, onClick, delai }: { carte: Carte; onClick: () => void; delai: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glow-card animate-fade-in-up group text-left"
      style={{ animationDelay: `${delai}s` }}
    >
      <div className="gradient-panel flex h-full flex-col gap-4 rounded-[23px] p-6 transition-transform duration-300 group-hover:-translate-y-0.5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)]"
            style={{ background: carte.grad }}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {carte.icone}
            </svg>
          </div>
          <svg
            viewBox="0 0 16 16"
            className="mt-2 h-4 w-4 shrink-0 text-[var(--muted-2)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent-blue)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)] sm:text-xl">{carte.titre}</h2>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--muted)]">{carte.accroche}</p>
        </div>
      </div>
    </button>
  );
}

export default function HomeScreen({ onNavigate }: { onNavigate: (volet: string) => void }) {
  return (
    <div className="tech-grid relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
      <div className="relative flex w-full max-w-4xl flex-col items-center">
        <header className="animate-fade-in-up mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
            Squale Assistant
          </p>
          <h1 className="text-2xl font-bold leading-tight text-[var(--foreground)] sm:text-3xl">
            Par où commencer ?
          </h1>
        </header>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
          {CARTES.map((carte, i) => (
            <CarteCategorie key={carte.cle} carte={carte} onClick={() => onNavigate(carte.cle)} delai={0.06 * i} />
          ))}
        </div>
      </div>
    </div>
  );
}
