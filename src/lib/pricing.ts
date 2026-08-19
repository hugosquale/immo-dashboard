import { getCityMarketData } from "./cityData";
import type { AnalysisInput, MarketAnalysis } from "./types";

export function computeMarketAnalysis(input: AnalysisInput): MarketAnalysis {
  const { data: city, isEstimated } = getCityMarketData(input.city);
  const pricePerM2Local = input.propertyType === "maison" ? city.pricePerM2House : city.pricePerM2Apartment;

  return {
    city: city.name,
    region: city.region,
    isEstimatedCity: isEstimated,
    pricePerM2Local: Math.round(pricePerM2Local),
    marketTension: city.tensionScore,
    yearlyTrendPct: city.yearlyTrendPct,
  };
}
