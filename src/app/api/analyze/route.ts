import { NextRequest, NextResponse } from "next/server";
import { computeMarketAnalysis } from "@/lib/pricing";
import { generateListingContent } from "@/lib/claude";
import type { AnalysisInput, PropertyDetails, AnalysisResult } from "@/lib/types";

function optStr(v: unknown, maxLen: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (!t || t.length > maxLen) return undefined;
  return t;
}

function optNum(v: unknown, min: number, max: number): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < min || n > max) return undefined;
  return n;
}

function optBool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function parseDetails(b: Record<string, unknown>): PropertyDetails {
  const dpeRaw = optStr(b.dpe, 1)?.toUpperCase();
  return {
    neighborhood: optStr(b.neighborhood, 80),
    postalCode: optStr(b.postalCode, 10),

    landSurface: optNum(b.landSurface, 0, 1_000_000),
    totalRooms: optNum(b.totalRooms, 0, 50),
    bedrooms: optNum(b.bedrooms, 0, 50),
    hasBonusRoom: optBool(b.hasBonusRoom),
    bonusRoomUsage: optStr(b.bonusRoomUsage, 120),

    openKitchen: optBool(b.openKitchen),
    equippedKitchen: optBool(b.equippedKitchen),

    livingRoomSurface: optNum(b.livingRoomSurface, 0, 2000),
    directOutdoorAccess: optBool(b.directOutdoorAccess),

    bathrooms: optNum(b.bathrooms, 0, 50),
    toilets: optNum(b.toilets, 0, 50),

    garden: optBool(b.garden),
    gardenSurface: optNum(b.gardenSurface, 0, 100_000),
    terrace: optBool(b.terrace),
    pool: optBool(b.pool),
    garage: optBool(b.garage),
    garageSpaces: optNum(b.garageSpaces, 0, 20),
    outbuildings: optBool(b.outbuildings),

    constructionYear: optNum(b.constructionYear, 1700, new Date().getFullYear() + 1),
    dpe: dpeRaw && "ABCDEFG".includes(dpeRaw) ? dpeRaw : undefined,
    diagnosticDate: optStr(b.diagnosticDate, 20),
    energyCostMin: optNum(b.energyCostMin, 0, 1_000_000),
    energyCostMax: optNum(b.energyCostMax, 0, 1_000_000),

    schoolMinutes: optNum(b.schoolMinutes, 0, 180),
    transitMinutes: optNum(b.transitMinutes, 0, 180),
    shopsMinutes: optNum(b.shopsMinutes, 0, 180),
    roadAccessName: optStr(b.roadAccessName, 60),
    roadAccessMinutes: optNum(b.roadAccessMinutes, 0, 180),

    priceExcludingFees: optNum(b.priceExcludingFees, 0, 100_000_000),
    feesPercent: optNum(b.feesPercent, 0, 100),
    agencyRef: optStr(b.agencyRef, 80),
    listingRef: optStr(b.listingRef, 80),

    clearView: optBool(b.clearView),
    quiet: optBool(b.quiet),
    recentlyRenovated: optBool(b.recentlyRenovated),
    fiber: optBool(b.fiber),
  };
}

function validateInput(body: unknown): AnalysisInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const city = typeof b.city === "string" ? b.city.trim() : "";
  const propertyType = b.propertyType;
  const surface = Number(b.surface);
  const userPrice = Number(b.userPrice);

  if (!city || city.length > 80) return null;
  if (propertyType !== "maison" && propertyType !== "appartement") return null;
  if (!Number.isFinite(surface) || surface <= 0 || surface > 5000) return null;
  if (!Number.isFinite(userPrice) || userPrice <= 0 || userPrice > 100_000_000) return null;

  return { city, propertyType, surface, userPrice, ...parseDetails(b) };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const input = validateInput(body);
  if (!input) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  try {
    const analysis = computeMarketAnalysis(input);
    const generated = await generateListingContent(input, analysis);

    const result: AnalysisResult = {
      ...analysis,
      ...generated,
      input,
      generatedAt: new Date().toISOString(),
    };

    const isStream = request.nextUrl.searchParams.get("stream") === "true";
    if (isStream) {
      return new NextResponse(streamResult(result), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/analyze] erreur:", error);
    return NextResponse.json({ error: "Échec de l'analyse. Réessaie dans un instant." }, { status: 502 });
  }
}

function streamResult(result: AnalysisResult): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const jsonStr = JSON.stringify(result);
      const chunkSize = 50;

      for (let i = 0; i < jsonStr.length; i += chunkSize) {
        const chunk = jsonStr.slice(i, i + chunkSize);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}
