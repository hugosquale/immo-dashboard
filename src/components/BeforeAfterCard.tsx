import Card from "./Card";
import { computeBeforeAfter } from "@/lib/beforeAfter";

function severityColor(score: number): string {
  return score < 35 ? "var(--danger)" : "var(--warning)";
}

export default function BeforeAfterCard({ attractivityScore, marketTension }: { attractivityScore: number; marketTension: number }) {
  const rows = computeBeforeAfter(attractivityScore, marketTension);
  const avgDelta = Math.round(rows.reduce((sum, r) => sum + (r.after - r.before), 0) / rows.length);

  return (
    <Card title="Avant / après optimisation IA" subtitle="Score d'attractivité estimé sans l'IA vs avec Référencement, Stratégie et Attractivité du bien optimisés">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--danger)]">
            Avant · sans l&apos;IA
          </p>
          <div className="flex flex-col gap-3">
            {rows.map((row) => {
              const color = severityColor(row.before);
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--foreground)]">{row.label}</span>
                    <span className="font-semibold" style={{ color }}>
                      {row.before}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface)]">
                    <div className="h-1.5 rounded-full" style={{ width: `${row.before}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--accent-green)]/25 bg-[var(--accent-green-soft)] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-green)]">
            Après · optimisé par l&apos;IA
          </p>
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--foreground)]">{row.label}</span>
                  <span className="font-semibold text-[var(--accent-green)]">{row.after}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface)]">
                  <div className="h-1.5 rounded-full bg-[var(--accent-green)]" style={{ width: `${row.after}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        En moyenne,{" "}
        <span className="font-semibold text-[var(--accent-green)]">+{avgDelta} points d&apos;attractivité</span> grâce
        à l&apos;optimisation IA.
      </p>
    </Card>
  );
}
