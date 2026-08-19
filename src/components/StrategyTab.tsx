import Card from "./Card";
import type { StrategyContent } from "@/lib/types";

export default function StrategyTab({ strategy }: { strategy: StrategyContent }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {strategy.points.map((point, i) => (
        <Card key={i}>
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue-soft)] text-sm font-semibold text-[var(--accent-blue)]">
              {i + 1}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">{point.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{point.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
