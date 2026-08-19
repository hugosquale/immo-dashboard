function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export interface NegotiationFloor {
  floorPrice: number;
  discountPct: number;
}

/**
 * Marge de négociation raisonnable, calculée déterministiquement (zéro appel IA) à
 * partir du prix demandé et de la tension du marché : plus le marché est tendu,
 * plus le vendeur a de leviers pour refuser une grosse décote.
 */
export function computeNegotiationFloor(userPrice: number, marketTension: number): NegotiationFloor {
  const discountPct = clamp(10 - marketTension / 10, 2, 10);
  const floorPrice = Math.round((userPrice * (1 - discountPct / 100)) / 100) * 100;
  return { floorPrice, discountPct: Math.round(discountPct * 10) / 10 };
}
