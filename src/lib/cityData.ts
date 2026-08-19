/**
 * Table de référence prix/m² par ville (estimations 2025, ordre de grandeur).
 * Sert de base au raisonnement de l'IA — pas une source officielle (DVF/notaires),
 * à rafraîchir périodiquement. Le but est d'éviter un appel réseau par analyse.
 */
export interface CityMarketData {
  name: string;
  region: string;
  pricePerM2Apartment: number;
  pricePerM2House: number;
  /** Évolution annuelle moyenne constatée, en % */
  yearlyTrendPct: number;
  /** Tension du marché locale, 0 (détendu) à 100 (très tendu) */
  tensionScore: number;
}

export const CITY_DATA: CityMarketData[] = [
  { name: "Paris", region: "Île-de-France", pricePerM2Apartment: 9700, pricePerM2House: 9200, yearlyTrendPct: -1.2, tensionScore: 78 },
  { name: "Marseille", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 3450, pricePerM2House: 3800, yearlyTrendPct: 3.8, tensionScore: 66 },
  { name: "Lyon", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 4950, pricePerM2House: 5200, yearlyTrendPct: 0.4, tensionScore: 70 },
  { name: "Toulouse", region: "Occitanie", pricePerM2Apartment: 3650, pricePerM2House: 3900, yearlyTrendPct: 1.8, tensionScore: 64 },
  { name: "Nice", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 4950, pricePerM2House: 5600, yearlyTrendPct: 1.1, tensionScore: 68 },
  { name: "Nantes", region: "Pays de la Loire", pricePerM2Apartment: 3900, pricePerM2House: 4100, yearlyTrendPct: 0.6, tensionScore: 62 },
  { name: "Montpellier", region: "Occitanie", pricePerM2Apartment: 3650, pricePerM2House: 3950, yearlyTrendPct: 2.5, tensionScore: 65 },
  { name: "Strasbourg", region: "Grand Est", pricePerM2Apartment: 3350, pricePerM2House: 3600, yearlyTrendPct: 1.3, tensionScore: 60 },
  { name: "Bordeaux", region: "Nouvelle-Aquitaine", pricePerM2Apartment: 4550, pricePerM2House: 4900, yearlyTrendPct: -0.8, tensionScore: 63 },
  { name: "Lille", region: "Hauts-de-France", pricePerM2Apartment: 3450, pricePerM2House: 3200, yearlyTrendPct: 1.9, tensionScore: 61 },
  { name: "Rennes", region: "Bretagne", pricePerM2Apartment: 3750, pricePerM2House: 3900, yearlyTrendPct: 1.5, tensionScore: 63 },
  { name: "Reims", region: "Grand Est", pricePerM2Apartment: 2650, pricePerM2House: 2500, yearlyTrendPct: 2.2, tensionScore: 52 },
  { name: "Le Havre", region: "Normandie", pricePerM2Apartment: 2150, pricePerM2House: 2100, yearlyTrendPct: 1.7, tensionScore: 45 },
  { name: "Saint-Étienne", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 1350, pricePerM2House: 1500, yearlyTrendPct: 2.8, tensionScore: 38 },
  { name: "Toulon", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 3350, pricePerM2House: 3700, yearlyTrendPct: 2.9, tensionScore: 58 },
  { name: "Grenoble", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 2950, pricePerM2House: 3300, yearlyTrendPct: 0.9, tensionScore: 56 },
  { name: "Dijon", region: "Bourgogne-Franche-Comté", pricePerM2Apartment: 2750, pricePerM2House: 2900, yearlyTrendPct: 1.4, tensionScore: 53 },
  { name: "Angers", region: "Pays de la Loire", pricePerM2Apartment: 2950, pricePerM2House: 3000, yearlyTrendPct: 1.6, tensionScore: 55 },
  { name: "Nîmes", region: "Occitanie", pricePerM2Apartment: 2250, pricePerM2House: 2400, yearlyTrendPct: 2.1, tensionScore: 47 },
  { name: "Villeurbanne", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 4250, pricePerM2House: 4400, yearlyTrendPct: 0.7, tensionScore: 66 },
  { name: "Clermont-Ferrand", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 2350, pricePerM2House: 2500, yearlyTrendPct: 1.9, tensionScore: 50 },
  { name: "Le Mans", region: "Pays de la Loire", pricePerM2Apartment: 1950, pricePerM2House: 2000, yearlyTrendPct: 2.0, tensionScore: 44 },
  { name: "Aix-en-Provence", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 5250, pricePerM2House: 6100, yearlyTrendPct: 0.9, tensionScore: 69 },
  { name: "Brest", region: "Bretagne", pricePerM2Apartment: 2450, pricePerM2House: 2400, yearlyTrendPct: 2.3, tensionScore: 48 },
  { name: "Tours", region: "Centre-Val de Loire", pricePerM2Apartment: 2750, pricePerM2House: 2850, yearlyTrendPct: 1.5, tensionScore: 54 },
  { name: "Limoges", region: "Nouvelle-Aquitaine", pricePerM2Apartment: 1650, pricePerM2House: 1750, yearlyTrendPct: 1.8, tensionScore: 38 },
  { name: "Amiens", region: "Hauts-de-France", pricePerM2Apartment: 2350, pricePerM2House: 2200, yearlyTrendPct: 1.7, tensionScore: 45 },
  { name: "Annecy", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 5750, pricePerM2House: 6400, yearlyTrendPct: 1.2, tensionScore: 74 },
  { name: "Perpignan", region: "Occitanie", pricePerM2Apartment: 2150, pricePerM2House: 2300, yearlyTrendPct: 2.4, tensionScore: 46 },
  { name: "Boulogne-Billancourt", region: "Île-de-France", pricePerM2Apartment: 7950, pricePerM2House: 8300, yearlyTrendPct: -0.6, tensionScore: 71 },
  { name: "Metz", region: "Grand Est", pricePerM2Apartment: 2250, pricePerM2House: 2100, yearlyTrendPct: 1.3, tensionScore: 46 },
  { name: "Besançon", region: "Bourgogne-Franche-Comté", pricePerM2Apartment: 2250, pricePerM2House: 2300, yearlyTrendPct: 1.6, tensionScore: 47 },
  { name: "Orléans", region: "Centre-Val de Loire", pricePerM2Apartment: 2550, pricePerM2House: 2650, yearlyTrendPct: 1.4, tensionScore: 51 },
  { name: "Mulhouse", region: "Grand Est", pricePerM2Apartment: 1600, pricePerM2House: 1550, yearlyTrendPct: 1.5, tensionScore: 36 },
  { name: "Rouen", region: "Normandie", pricePerM2Apartment: 2550, pricePerM2House: 2500, yearlyTrendPct: 1.6, tensionScore: 49 },
  { name: "Caen", region: "Normandie", pricePerM2Apartment: 2950, pricePerM2House: 2850, yearlyTrendPct: 1.7, tensionScore: 52 },
  { name: "Nancy", region: "Grand Est", pricePerM2Apartment: 2550, pricePerM2House: 2450, yearlyTrendPct: 1.2, tensionScore: 48 },
  { name: "Argenteuil", region: "Île-de-France", pricePerM2Apartment: 3850, pricePerM2House: 4000, yearlyTrendPct: 0.8, tensionScore: 57 },
  { name: "Montreuil", region: "Île-de-France", pricePerM2Apartment: 5550, pricePerM2House: 5900, yearlyTrendPct: 0.5, tensionScore: 65 },
  { name: "Saint-Denis", region: "Île-de-France", pricePerM2Apartment: 4250, pricePerM2House: 4400, yearlyTrendPct: 1.1, tensionScore: 60 },
  { name: "Avignon", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 2650, pricePerM2House: 2900, yearlyTrendPct: 2.0, tensionScore: 50 },
  { name: "Poitiers", region: "Nouvelle-Aquitaine", pricePerM2Apartment: 2250, pricePerM2House: 2350, yearlyTrendPct: 1.5, tensionScore: 47 },
  { name: "Versailles", region: "Île-de-France", pricePerM2Apartment: 7250, pricePerM2House: 7600, yearlyTrendPct: -0.3, tensionScore: 68 },
  { name: "Pau", region: "Nouvelle-Aquitaine", pricePerM2Apartment: 2350, pricePerM2House: 2450, yearlyTrendPct: 1.6, tensionScore: 46 },
  { name: "La Rochelle", region: "Nouvelle-Aquitaine", pricePerM2Apartment: 4350, pricePerM2House: 4700, yearlyTrendPct: 2.6, tensionScore: 67 },
  { name: "Biarritz", region: "Nouvelle-Aquitaine", pricePerM2Apartment: 6850, pricePerM2House: 7900, yearlyTrendPct: 1.8, tensionScore: 72 },
  { name: "Cannes", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 5950, pricePerM2House: 6800, yearlyTrendPct: 1.0, tensionScore: 66 },
  { name: "Antibes", region: "Provence-Alpes-Côte d'Azur", pricePerM2Apartment: 4950, pricePerM2House: 5700, yearlyTrendPct: 1.3, tensionScore: 63 },
  { name: "Chambéry", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 3250, pricePerM2House: 3450, yearlyTrendPct: 1.4, tensionScore: 55 },
  { name: "Annemasse", region: "Auvergne-Rhône-Alpes", pricePerM2Apartment: 4650, pricePerM2House: 5000, yearlyTrendPct: 2.2, tensionScore: 70 },
];

export const NATIONAL_FALLBACK: CityMarketData = {
  name: "Moyenne nationale",
  region: "France",
  pricePerM2Apartment: 3100,
  pricePerM2House: 2650,
  yearlyTrendPct: 1.4,
  tensionScore: 45,
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export function findCity(name: string): CityMarketData | undefined {
  const target = normalize(name);
  return CITY_DATA.find((city) => normalize(city.name) === target);
}

export function searchCities(query: string, limit = 8): CityMarketData[] {
  const target = normalize(query);
  if (!target) return [];
  return CITY_DATA.filter((city) => normalize(city.name).includes(target)).slice(0, limit);
}

export function getCityMarketData(name: string): { data: CityMarketData; isEstimated: boolean } {
  const match = findCity(name);
  if (match) return { data: match, isEstimated: false };
  return { data: { ...NATIONAL_FALLBACK, name: name || NATIONAL_FALLBACK.name }, isEstimated: true };
}
