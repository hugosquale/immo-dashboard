import { FICHES } from "@/lib/recommandations";

export default function RecommandationsMenu({
  progression,
  onNavigate,
}: {
  progression: Record<string, number>;
  onNavigate: (volet: string) => void;
}) {
  return (
    <div className="tech-grid relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
      <div className="relative flex w-full max-w-3xl flex-col items-center">
        <header className="animate-fade-in-up mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
            Recommandations Squale
          </p>
          <h1 className="text-2xl font-bold leading-tight text-[var(--foreground)] sm:text-3xl">
            Le guide de l&apos;agent
          </h1>
        </header>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {FICHES.map((f, i) => {
            const lu = (progression[f.cle] ?? 0) >= 100;
            return (
              <button
                key={f.cle}
                type="button"
                onClick={() => onNavigate(f.cle)}
                className="glow-card animate-fade-in-up group text-left"
                style={{ animationDelay: `${0.06 * i}s` }}
              >
                <div className="gradient-panel flex h-full flex-col gap-3 rounded-[23px] p-6 transition-transform duration-300 group-hover:-translate-y-0.5 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-blue-soft)] text-base font-bold text-[var(--accent-blue)]">
                      {i + 1}
                    </span>
                    {lu ? (
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--accent-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent-green)]">
                        <svg viewBox="0 0 16 16" className="h-3 w-3">
                          <circle cx="8" cy="8" r="7.2" fill="currentColor" />
                          <path d="m5 8.2 2.2 2.2L11.2 6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Lu
                      </span>
                    ) : (
                      <svg
                        viewBox="0 0 16 16"
                        className="mt-2 h-4 w-4 shrink-0 text-[var(--muted-2)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent-blue)]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold leading-snug tracking-tight text-[var(--foreground)] sm:text-lg">
                      {f.onglet}
                    </h2>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">{f.accroche}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
