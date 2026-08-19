import Card from "./Card";
import RadialScore from "./RadialScore";
import LinearGauge from "./LinearGauge";
import BeforeAfterCard from "./BeforeAfterCard";
import type { AnalysisResult } from "@/lib/types";

export default function KpiSidebar({ result }: { result: AnalysisResult }) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <Card title="Score d'attractivité">
        <div className="flex items-center gap-3">
          <RadialScore score={result.attractivityScore} color="var(--accent-blue)" />
          <span className="text-xs text-[var(--muted)]">/ 100</span>
        </div>
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">
            Tension du marché
          </p>
          <LinearGauge value={result.marketTension} lowLabel="Détendu" midLabel="Équilibré" highLabel="Tendu" />
        </div>
      </Card>

      <BeforeAfterCard attractivityScore={result.attractivityScore} marketTension={result.marketTension} />
    </div>
  );
}
