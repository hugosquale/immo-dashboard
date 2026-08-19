import Card from "./Card";
import { computeNegotiationFloor } from "@/lib/negotiation";
import type { ArgumentaireContent } from "@/lib/types";

interface ArgumentaireTabProps {
  argumentaire: ArgumentaireContent;
  userPrice: number;
  marketTension: number;
}

export default function ArgumentaireTab({ argumentaire, userPrice, marketTension }: ArgumentaireTabProps) {
  const floor = computeNegotiationFloor(userPrice, marketTension);

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Marge de négociation"
        subtitle="Calculée à partir du prix demandé et de la tension du marché (aucun appel IA)"
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <div>
            <span className="text-xs text-[var(--muted)]">Prix demandé</span>
            <p className="text-lg font-bold text-[var(--foreground)]">{userPrice.toLocaleString("fr-FR")} €</p>
          </div>
          <div>
            <span className="text-xs text-[var(--muted)]">Baisse acceptable max</span>
            <p className="text-lg font-bold text-[var(--warning)]">-{floor.discountPct}%</p>
          </div>
          <div>
            <span className="text-xs text-[var(--muted)]">Prix plancher conseillé</span>
            <p className="text-lg font-bold text-[var(--accent-green)]">{floor.floorPrice.toLocaleString("fr-FR")} €</p>
          </div>
        </div>
      </Card>

      <Card title="Arguments de négociation" subtitle="À utiliser si l'acheteur tente de faire baisser le prix">
        <div className="flex flex-col gap-3">
          {argumentaire.negotiationPoints.map((point, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">{point.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{point.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Objections des acheteurs" subtitle="Questions probables et réponses prêtes à l'emploi">
        <div className="flex flex-col gap-4">
          {argumentaire.objections.map((item, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <p className="flex items-start gap-2 text-sm font-semibold text-[var(--foreground)]">
                <span className="text-[var(--accent-blue)]">Q.</span>
                {item.objection}
              </p>
              <p className="mt-1.5 flex items-start gap-2 text-sm leading-relaxed text-[var(--muted)]">
                <span className="text-[var(--accent-green)]">R.</span>
                {item.response}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
