export type PropertyType = "maison" | "appartement";

/**
 * Champs optionnels de la fiche bien. `boolean | undefined` sert aussi pour les
 * cases "Oui / Non / Aucune info" : undefined = non renseigné.
 */
export interface PropertyDetails {
  // Localisation
  neighborhood?: string;
  postalCode?: string;

  // Surfaces & pièces
  landSurface?: number;
  totalRooms?: number;
  bedrooms?: number;
  hasBonusRoom?: boolean;
  bonusRoomUsage?: string;

  // Cuisine
  openKitchen?: boolean;
  equippedKitchen?: boolean;

  // Salon / séjour
  livingRoomSurface?: number;
  directOutdoorAccess?: boolean;

  // Sanitaires
  bathrooms?: number;
  toilets?: number;

  // Extérieur & annexes
  garden?: boolean;
  gardenSurface?: number;
  terrace?: boolean;
  pool?: boolean;
  garage?: boolean;
  garageSpaces?: number;
  outbuildings?: boolean;

  // État & performance
  constructionYear?: number;
  dpe?: string;
  diagnosticDate?: string;
  energyCostMin?: number;
  energyCostMax?: number;

  // Proximités (distances en minutes)
  schoolMinutes?: number;
  transitMinutes?: number;
  shopsMinutes?: number;
  roadAccessName?: string;
  roadAccessMinutes?: number;

  // Financier
  priceExcludingFees?: number;
  feesPercent?: number;
  agencyRef?: string;
  listingRef?: string;

  // Autres atouts
  clearView?: boolean;
  quiet?: boolean;
  recentlyRenovated?: boolean;
  fiber?: boolean;
}

export interface AnalysisInput extends PropertyDetails {
  city: string;
  propertyType: PropertyType;
  surface: number;
  userPrice: number;
}

export interface MarketAnalysis {
  city: string;
  region: string;
  isEstimatedCity: boolean;
  pricePerM2Local: number;
  marketTension: number;
  yearlyTrendPct: number;
}

/**
 * Un passage clé de la description, à surligner dans l'affichage annoté.
 * `phrase` doit être une sous-chaîne exacte de `description` (recherchée côté
 * frontend pour construire l'affichage annoté sans dupliquer le texte).
 */
export interface MarketingHighlight {
  phrase: string;
  reason: string;
}

export interface PlatformContent {
  title: string;
  description: string;
  highlights: MarketingHighlight[];
}

export interface StrategyPoint {
  title: string;
  description: string;
}

export interface StrategyContent {
  points: StrategyPoint[];
}

export interface VisualPhoto {
  order: number;
  subject: string;
  reason: string;
}

export interface VisualContent {
  recommendedPhotoCount: string;
  photos: VisualPhoto[];
}

export interface ObjectionPoint {
  objection: string;
  response: string;
}

export interface NegotiationPoint {
  title: string;
  description: string;
}

export interface ArgumentaireContent {
  objections: ObjectionPoint[];
  negotiationPoints: NegotiationPoint[];
}

export interface AIGeneratedContent {
  attractivityScore: number;
  marketing: {
    instagram: PlatformContent;
    tiktok: PlatformContent;
    facebook: PlatformContent;
    leboncoin: PlatformContent;
  };
  strategy: StrategyContent;
  visual: VisualContent;
  argumentaire: ArgumentaireContent;
}

export interface AnalysisResult extends MarketAnalysis, AIGeneratedContent {
  input: AnalysisInput;
  generatedAt: string;
}
