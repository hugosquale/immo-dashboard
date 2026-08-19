export interface BeforeAfterRow {
  label: string;
  before: number;
  after: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Estimation déterministe (aucun appel IA) de ce que serait le score d'attractivité
 * par catégorie sans optimisation ("avant") vs avec la stratégie/description/visuel
 * générés par l'outil ("après" = proche du score IA réel). Le calcul se base sur le
 * score d'attractivité global et la tension du marché : sur un marché moins tendu,
 * une annonce non optimisée souffre davantage, donc l'écart "avant/après" est plus
 * marqué — c'est l'inverse sur un marché très tendu où même une annonce faible se
 * vend, donc l'optimisation apporte proportionnellement moins.
 */
export function computeBeforeAfter(attractivityScore: number, marketTension: number): BeforeAfterRow[] {
  const tensionGapBoost = clamp((65 - marketTension) * 0.25, -8, 10);

  const categories: { label: string; offset: number; baseGap: number }[] = [
    { label: "Référencement", offset: 3, baseGap: 30 },
    { label: "Stratégie", offset: 0, baseGap: 24 },
    { label: "Attractivité du bien", offset: -2, baseGap: 27 },
    { label: "Score global", offset: 0, baseGap: 22 },
  ];

  return categories.map(({ label, offset, baseGap }) => {
    const after = Math.round(clamp(attractivityScore + offset, 45, 97));
    const gap = clamp(baseGap + tensionGapBoost, 12, 42);
    const before = Math.round(clamp(after - gap, 12, after - 8));
    return { label, before, after };
  });
}
