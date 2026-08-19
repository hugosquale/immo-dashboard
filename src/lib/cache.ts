import type { AnalysisInput, AnalysisResult } from "./types";

const CACHE_PREFIX = "immo-dashboard:analysis:";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  result: AnalysisResult;
  cachedAt: number;
}

export function buildCacheKey(input: AnalysisInput): string {
  const normalized: Record<string, unknown> = {};
  for (const key of Object.keys(input).sort()) {
    const value = (input as unknown as Record<string, unknown>)[key];
    if (value === undefined || value === "") continue;
    normalized[key] = typeof value === "string" ? value.trim().toLowerCase() : value;
  }
  return `${CACHE_PREFIX}${JSON.stringify(normalized)}`;
}

export function getCachedAnalysis(input: AnalysisInput): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(buildCacheKey(input));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      window.localStorage.removeItem(buildCacheKey(input));
      return null;
    }
    return entry.result;
  } catch {
    return null;
  }
}

export function setCachedAnalysis(input: AnalysisInput, result: AnalysisResult): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { result, cachedAt: Date.now() };
    window.localStorage.setItem(buildCacheKey(input), JSON.stringify(entry));
  } catch {
    // localStorage plein ou indisponible : on ignore silencieusement, le cache est un bonus.
  }
}
