"use client";

import Card from "./Card";
import type { AnalysisResult } from "@/lib/types";

function formatEuro(v: number): string {
  return `${v.toLocaleString("fr-FR")} €`;
}

function yesNo(v: boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return v ? "Oui" : "Non";
}

interface FactItem {
  label: string;
  value?: string;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted-2)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function FactSection({ title, facts }: { title: string; facts: FactItem[] }) {
  const visible = facts.filter((f): f is { label: string; value: string } => !!f.value);
  if (visible.length === 0) return null;
  return (
    <div className="border-t border-[var(--border)] pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">{title}</p>
      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {visible.map((f, i) => (
          <Fact key={i} label={f.label} value={f.value} />
        ))}
      </div>
    </div>
  );
}

export default function VisitSheetTab({ result }: { result: AnalysisResult }) {
  const { input, marketing, visual, attractivityScore, marketTension, yearlyTrendPct } = result;
  const pricePerM2 = Math.round(input.userPrice / input.surface);
  const topFeatures = visual.photos.map((p) => p.subject);
  const addressParts = [input.neighborhood, input.postalCode].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold"
        >
          Imprimer la fiche
        </button>
      </div>

      <div id="visit-sheet-print">
        <Card>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Fiche de visite</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--foreground)]">{marketing.leboncoin.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {input.city}
                {addressParts ? ` · ${addressParts}` : ""}
              </p>
            </div>

            {topFeatures.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">
                  Points forts à montrer en priorité
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {topFeatures.map((feature, i) => (
                    <li
                      key={i}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--foreground)]"
                    >
                      {i + 1}. {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <FactSection
              title="Informations générales"
              facts={[
                { label: "Type de bien", value: input.propertyType === "maison" ? "Maison" : "Appartement" },
                { label: "Ville", value: input.city },
                { label: "Quartier / secteur", value: input.neighborhood },
                { label: "Code postal", value: input.postalCode },
                { label: "Surface habitable", value: `${input.surface} m²` },
                { label: "Surface terrain", value: input.landSurface !== undefined ? `${input.landSurface} m²` : undefined },
                { label: "Nombre de pièces", value: input.totalRooms !== undefined ? String(input.totalRooms) : undefined },
                { label: "Nombre de chambres", value: input.bedrooms !== undefined ? String(input.bedrooms) : undefined },
                { label: "Bureau / pièce bonus", value: yesNo(input.hasBonusRoom) },
                { label: "Usage suggéré du bureau", value: input.bonusRoomUsage },
                { label: "Année de construction / rénovation", value: input.constructionYear !== undefined ? String(input.constructionYear) : undefined },
              ]}
            />

            <FactSection
              title="Cuisine"
              facts={[
                { label: "Cuisine américaine / ouverte", value: yesNo(input.openKitchen) },
                { label: "Cuisine équipée", value: yesNo(input.equippedKitchen) },
              ]}
            />

            <FactSection
              title="Salon / séjour"
              facts={[
                { label: "Surface", value: input.livingRoomSurface !== undefined ? `${input.livingRoomSurface} m²` : undefined },
                { label: "Accès extérieur direct", value: yesNo(input.directOutdoorAccess) },
              ]}
            />

            <FactSection
              title="Sanitaires"
              facts={[
                { label: "Salle(s) de bain", value: input.bathrooms !== undefined ? String(input.bathrooms) : undefined },
                { label: "WC", value: input.toilets !== undefined ? String(input.toilets) : undefined },
              ]}
            />

            <FactSection
              title="Extérieur & annexes"
              facts={[
                { label: "Jardin", value: yesNo(input.garden) },
                { label: "Surface jardin", value: input.gardenSurface !== undefined ? `${input.gardenSurface} m²` : undefined },
                { label: "Terrasse", value: yesNo(input.terrace) },
                { label: "Piscine", value: yesNo(input.pool) },
                { label: "Garage", value: yesNo(input.garage) },
                { label: "Places de garage", value: input.garageSpaces !== undefined ? String(input.garageSpaces) : undefined },
                { label: "Dépendances", value: yesNo(input.outbuildings) },
              ]}
            />

            <FactSection
              title="État & performance"
              facts={[
                { label: "DPE", value: input.dpe },
                { label: "Diagnostic réalisé le", value: input.diagnosticDate },
                {
                  label: "Dépenses énergie estimées",
                  value:
                    input.energyCostMin !== undefined || input.energyCostMax !== undefined
                      ? `${input.energyCostMin ?? "?"} - ${input.energyCostMax ?? "?"} €/an`
                      : undefined,
                },
              ]}
            />

            <FactSection
              title="Proximités"
              facts={[
                { label: "Écoles / collège / lycée", value: input.schoolMinutes !== undefined ? `${input.schoolMinutes} min` : undefined },
                { label: "Gare / transports en commun", value: input.transitMinutes !== undefined ? `${input.transitMinutes} min` : undefined },
                { label: "Commerces / centre-ville", value: input.shopsMinutes !== undefined ? `${input.shopsMinutes} min` : undefined },
                {
                  label: "Axe routier",
                  value:
                    input.roadAccessName && input.roadAccessMinutes !== undefined
                      ? `${input.roadAccessName} à ${input.roadAccessMinutes} min`
                      : input.roadAccessName,
                },
              ]}
            />

            <FactSection
              title="Informations financières"
              facts={[
                { label: "Prix demandé", value: formatEuro(input.userPrice) },
                { label: "Prix / m²", value: formatEuro(pricePerM2) },
                { label: "Prix hors honoraires", value: input.priceExcludingFees !== undefined ? formatEuro(input.priceExcludingFees) : undefined },
                { label: "Honoraires charge acquéreur", value: input.feesPercent !== undefined ? `${input.feesPercent}% TTC` : undefined },
                { label: "Référence agence", value: input.agencyRef },
                { label: "Référence annonce", value: input.listingRef },
              ]}
            />

            <FactSection
              title="Autres atouts"
              facts={[
                { label: "Vue dégagée", value: yesNo(input.clearView) },
                { label: "Calme / pas de vis-à-vis", value: yesNo(input.quiet) },
                { label: "Récemment rénové", value: yesNo(input.recentlyRenovated) },
                { label: "Fibre optique", value: yesNo(input.fiber) },
              ]}
            />

            <FactSection
              title="Contexte marché"
              facts={[
                { label: "Score d'attractivité", value: `${attractivityScore} / 100` },
                { label: "Tension du marché local", value: `${marketTension} / 100` },
                { label: "Tendance annuelle des prix", value: `${yearlyTrendPct > 0 ? "+" : ""}${yearlyTrendPct}%` },
              ]}
            />

            <div className="border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
              {input.agencyRef && <span>Réf. agence : {input.agencyRef}</span>}
              {input.agencyRef && input.listingRef && " · "}
              {input.listingRef && <span>Réf. annonce : {input.listingRef}</span>}
              {!input.agencyRef && !input.listingRef && <span>Contactez-nous pour organiser une visite.</span>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
