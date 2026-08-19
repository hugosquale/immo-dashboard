"use client";

import { useMemo, useState } from "react";
import { searchCities } from "@/lib/cityData";
import AccordionSection from "./AccordionSection";
import BoolToggle from "./BoolToggle";
import FormField from "./FormField";
import type { AnalysisInput, PropertyType } from "@/lib/types";

interface AnalysisFormProps {
  onAnalyze: (input: AnalysisInput) => void;
  isLoading: boolean;
  initialInput?: AnalysisInput;
  error?: string | null;
}

interface DetailsState {
  neighborhood: string;
  postalCode: string;
  landSurface: string;
  totalRooms: string;
  bedrooms: string;
  hasBonusRoom: boolean | undefined;
  bonusRoomUsage: string;
  openKitchen: boolean | undefined;
  equippedKitchen: boolean | undefined;
  livingRoomSurface: string;
  directOutdoorAccess: boolean | undefined;
  bathrooms: string;
  toilets: string;
  garden: boolean | undefined;
  gardenSurface: string;
  terrace: boolean | undefined;
  pool: boolean | undefined;
  garage: boolean | undefined;
  garageSpaces: string;
  outbuildings: boolean | undefined;
  constructionYear: string;
  dpe: string;
  diagnosticDate: string;
  energyCostMin: string;
  energyCostMax: string;
  schoolMinutes: string;
  transitMinutes: string;
  shopsMinutes: string;
  roadAccessName: string;
  roadAccessMinutes: string;
  priceExcludingFees: string;
  feesPercent: string;
  agencyRef: string;
  listingRef: string;
  clearView: boolean | undefined;
  quiet: boolean | undefined;
  recentlyRenovated: boolean | undefined;
  fiber: boolean | undefined;
}

const initialDetails: DetailsState = {
  neighborhood: "",
  postalCode: "",
  landSurface: "",
  totalRooms: "",
  bedrooms: "",
  hasBonusRoom: undefined,
  bonusRoomUsage: "",
  openKitchen: undefined,
  equippedKitchen: undefined,
  livingRoomSurface: "",
  directOutdoorAccess: undefined,
  bathrooms: "",
  toilets: "",
  garden: undefined,
  gardenSurface: "",
  terrace: undefined,
  pool: undefined,
  garage: undefined,
  garageSpaces: "",
  outbuildings: undefined,
  constructionYear: "",
  dpe: "",
  diagnosticDate: "",
  energyCostMin: "",
  energyCostMax: "",
  schoolMinutes: "",
  transitMinutes: "",
  shopsMinutes: "",
  roadAccessName: "",
  roadAccessMinutes: "",
  priceExcludingFees: "",
  feesPercent: "",
  agencyRef: "",
  listingRef: "",
  clearView: undefined,
  quiet: undefined,
  recentlyRenovated: undefined,
  fiber: undefined,
};

const isSet = (v: string | boolean | undefined) => v !== undefined && v !== "";

function toNum(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toStr(v: string): string | undefined {
  const t = v.trim();
  return t === "" ? undefined : t;
}

function detailsFromInput(input: AnalysisInput): DetailsState {
  const numStr = (v: number | undefined) => (v !== undefined ? String(v) : "");
  const str = (v: string | undefined) => v ?? "";
  return {
    neighborhood: str(input.neighborhood),
    postalCode: str(input.postalCode),
    landSurface: numStr(input.landSurface),
    totalRooms: numStr(input.totalRooms),
    bedrooms: numStr(input.bedrooms),
    hasBonusRoom: input.hasBonusRoom,
    bonusRoomUsage: str(input.bonusRoomUsage),
    openKitchen: input.openKitchen,
    equippedKitchen: input.equippedKitchen,
    livingRoomSurface: numStr(input.livingRoomSurface),
    directOutdoorAccess: input.directOutdoorAccess,
    bathrooms: numStr(input.bathrooms),
    toilets: numStr(input.toilets),
    garden: input.garden,
    gardenSurface: numStr(input.gardenSurface),
    terrace: input.terrace,
    pool: input.pool,
    garage: input.garage,
    garageSpaces: numStr(input.garageSpaces),
    outbuildings: input.outbuildings,
    constructionYear: numStr(input.constructionYear),
    dpe: str(input.dpe),
    diagnosticDate: str(input.diagnosticDate),
    energyCostMin: numStr(input.energyCostMin),
    energyCostMax: numStr(input.energyCostMax),
    schoolMinutes: numStr(input.schoolMinutes),
    transitMinutes: numStr(input.transitMinutes),
    shopsMinutes: numStr(input.shopsMinutes),
    roadAccessName: str(input.roadAccessName),
    roadAccessMinutes: numStr(input.roadAccessMinutes),
    priceExcludingFees: numStr(input.priceExcludingFees),
    feesPercent: numStr(input.feesPercent),
    agencyRef: str(input.agencyRef),
    listingRef: str(input.listingRef),
    clearView: input.clearView,
    quiet: input.quiet,
    recentlyRenovated: input.recentlyRenovated,
    fiber: input.fiber,
  };
}

export default function AnalysisForm({ onAnalyze, isLoading, initialInput, error }: AnalysisFormProps) {
  const [city, setCity] = useState(initialInput?.city ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType>(initialInput?.propertyType ?? "appartement");
  const [surface, setSurface] = useState(initialInput ? String(initialInput.surface) : "");
  const [userPrice, setUserPrice] = useState(initialInput ? String(initialInput.userPrice) : "");
  const [touched, setTouched] = useState(false);
  const [details, setDetails] = useState<DetailsState>(() =>
    initialInput ? detailsFromInput(initialInput) : initialDetails
  );

  const suggestions = useMemo(() => (city.trim().length >= 2 ? searchCities(city) : []), [city]);

  const surfaceValue = Number(surface);
  const priceValue = Number(userPrice);
  const isValid = city.trim().length > 0 && surfaceValue > 0 && priceValue > 0;

  function update<K extends keyof DetailsState>(key: K, value: DetailsState[K]) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  const counts = {
    localisation: [details.neighborhood, details.postalCode].filter(isSet).length,
    surfaces: [details.landSurface, details.totalRooms, details.bedrooms, details.hasBonusRoom].filter(isSet).length,
    cuisine: [details.openKitchen, details.equippedKitchen].filter(isSet).length,
    salon: [details.livingRoomSurface, details.directOutdoorAccess].filter(isSet).length,
    sanitaires: [details.bathrooms, details.toilets].filter(isSet).length,
    exterieur: [details.garden, details.terrace, details.pool, details.garage, details.outbuildings].filter(isSet)
      .length,
    etat: [details.constructionYear, details.dpe, details.diagnosticDate, details.energyCostMin, details.energyCostMax]
      .filter(isSet).length,
    proximites: [
      details.schoolMinutes,
      details.transitMinutes,
      details.shopsMinutes,
      details.roadAccessName,
      details.roadAccessMinutes,
    ].filter(isSet).length,
    financier: [details.priceExcludingFees, details.feesPercent, details.agencyRef, details.listingRef].filter(isSet)
      .length,
    atouts: [details.clearView, details.quiet, details.recentlyRenovated, details.fiber].filter(isSet).length,
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid || isLoading) return;

    onAnalyze({
      city: city.trim(),
      propertyType,
      surface: surfaceValue,
      userPrice: priceValue,

      neighborhood: toStr(details.neighborhood),
      postalCode: toStr(details.postalCode),

      landSurface: toNum(details.landSurface),
      totalRooms: toNum(details.totalRooms),
      bedrooms: toNum(details.bedrooms),
      hasBonusRoom: details.hasBonusRoom,
      bonusRoomUsage: details.hasBonusRoom ? toStr(details.bonusRoomUsage) : undefined,

      openKitchen: details.openKitchen,
      equippedKitchen: details.equippedKitchen,

      livingRoomSurface: toNum(details.livingRoomSurface),
      directOutdoorAccess: details.directOutdoorAccess,

      bathrooms: toNum(details.bathrooms),
      toilets: toNum(details.toilets),

      garden: details.garden,
      gardenSurface: details.garden ? toNum(details.gardenSurface) : undefined,
      terrace: details.terrace,
      pool: details.pool,
      garage: details.garage,
      garageSpaces: details.garage ? toNum(details.garageSpaces) : undefined,
      outbuildings: details.outbuildings,

      constructionYear: toNum(details.constructionYear),
      dpe: toStr(details.dpe),
      diagnosticDate: toStr(details.diagnosticDate),
      energyCostMin: toNum(details.energyCostMin),
      energyCostMax: toNum(details.energyCostMax),

      schoolMinutes: toNum(details.schoolMinutes),
      transitMinutes: toNum(details.transitMinutes),
      shopsMinutes: toNum(details.shopsMinutes),
      roadAccessName: toStr(details.roadAccessName),
      roadAccessMinutes: toNum(details.roadAccessMinutes),

      priceExcludingFees: toNum(details.priceExcludingFees),
      feesPercent: toNum(details.feesPercent),
      agencyRef: toStr(details.agencyRef),
      listingRef: toStr(details.listingRef),

      clearView: details.clearView,
      quiet: details.quiet,
      recentlyRenovated: details.recentlyRenovated,
      fiber: details.fiber,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-6 p-6">

      <div className="relative flex flex-col gap-1.5">
        <label htmlFor="city" className="text-xs font-medium text-[var(--muted)]">
          Ville
        </label>
        <input
          id="city"
          type="text"
          autoComplete="off"
          placeholder="Ex : Lyon"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
        />
        {touched && !city.trim() && <p className="text-[11px] text-[var(--danger)]">Ce champ est requis.</p>}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-lg">
            {suggestions.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  onMouseDown={() => {
                    setCity(s.name);
                    setShowSuggestions(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                >
                  <span>{s.name}</span>
                  <span className="text-[11px] text-[var(--muted-2)]">{s.region}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--muted)]">Type de bien</span>
        <div className="grid grid-cols-2 gap-2">
          {(["appartement", "maison"] as PropertyType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPropertyType(type)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition ${
                propertyType === type
                  ? "border-[var(--accent-blue)] bg-[var(--accent-blue-soft)] text-[var(--foreground)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-strong)]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="surface" className="text-xs font-medium text-[var(--muted)]">
          Surface habitable (m²)
        </label>
        <input
          id="surface"
          type="number"
          min={1}
          step="any"
          placeholder="Ex : 75"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
        />
        {touched && !(surfaceValue > 0) && <p className="text-[11px] text-[var(--danger)]">Surface invalide.</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="userPrice" className="text-xs font-medium text-[var(--muted)]">
          Prix estimé (€)
        </label>
        <input
          id="userPrice"
          type="number"
          min={1}
          step="any"
          placeholder="Ex : 340000"
          value={userPrice}
          onChange={(e) => setUserPrice(e.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
        />
        {touched && !(priceValue > 0) && <p className="text-[11px] text-[var(--danger)]">Prix invalide.</p>}
      </div>

      <div className="-mx-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 px-4">
        <p className="pt-3 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-2)]">
          Fiche bien détaillée (optionnelle)
        </p>

        <AccordionSection title="Localisation" filledCount={counts.localisation}>
          <FormField label="Quartier / secteur" value={details.neighborhood} onChange={(v) => update("neighborhood", v)} placeholder="Ex : Presqu'île" />
          <FormField label="Département / code postal" value={details.postalCode} onChange={(v) => update("postalCode", v)} placeholder="Ex : 69002" />
        </AccordionSection>

        <AccordionSection title="Surfaces & pièces" filledCount={counts.surfaces}>
          <FormField label="Surface terrain" type="number" suffix="m²" value={details.landSurface} onChange={(v) => update("landSurface", v)} />
          <FormField label="Nombre de pièces total" type="number" value={details.totalRooms} onChange={(v) => update("totalRooms", v)} />
          <FormField label="Nombre de chambres" type="number" value={details.bedrooms} onChange={(v) => update("bedrooms", v)} />
          <BoolToggle label="Bureau / pièce bonus" value={details.hasBonusRoom} onChange={(v) => update("hasBonusRoom", v)} includeUnknown={false} />
          {details.hasBonusRoom && (
            <FormField label="Usage suggéré" value={details.bonusRoomUsage} onChange={(v) => update("bonusRoomUsage", v)} placeholder="Ex : bureau, dressing…" />
          )}
        </AccordionSection>

        <AccordionSection title="Cuisine" filledCount={counts.cuisine}>
          <BoolToggle label="Cuisine américaine / ouverte" value={details.openKitchen} onChange={(v) => update("openKitchen", v)} includeUnknown={false} />
          <BoolToggle label="Cuisine équipée" value={details.equippedKitchen} onChange={(v) => update("equippedKitchen", v)} includeUnknown={false} />
        </AccordionSection>

        <AccordionSection title="Salon / séjour" filledCount={counts.salon}>
          <FormField label="Surface" type="number" suffix="m²" value={details.livingRoomSurface} onChange={(v) => update("livingRoomSurface", v)} />
          <BoolToggle label="Accès extérieur direct (terrasse/jardin)" value={details.directOutdoorAccess} onChange={(v) => update("directOutdoorAccess", v)} includeUnknown={false} />
        </AccordionSection>

        <AccordionSection title="Sanitaires" filledCount={counts.sanitaires}>
          <FormField label="Nombre de salles de bain" type="number" value={details.bathrooms} onChange={(v) => update("bathrooms", v)} />
          <FormField label="Nombre de WC" type="number" value={details.toilets} onChange={(v) => update("toilets", v)} />
        </AccordionSection>

        <AccordionSection title="Extérieur & annexes" filledCount={counts.exterieur}>
          <BoolToggle label="Jardin" value={details.garden} onChange={(v) => update("garden", v)} />
          {details.garden && (
            <FormField label="Surface jardin" type="number" suffix="m²" value={details.gardenSurface} onChange={(v) => update("gardenSurface", v)} />
          )}
          <BoolToggle label="Terrasse" value={details.terrace} onChange={(v) => update("terrace", v)} />
          <BoolToggle label="Piscine" value={details.pool} onChange={(v) => update("pool", v)} />
          <BoolToggle label="Garage" value={details.garage} onChange={(v) => update("garage", v)} />
          {details.garage && (
            <FormField label="Nombre de véhicules" type="number" value={details.garageSpaces} onChange={(v) => update("garageSpaces", v)} placeholder="Ex : 1" />
          )}
          <BoolToggle label="Dépendances (cave, atelier, abri)" value={details.outbuildings} onChange={(v) => update("outbuildings", v)} />
        </AccordionSection>

        <AccordionSection title="État & performance" filledCount={counts.etat}>
          <FormField label="Année de construction / rénovation" type="number" value={details.constructionYear} onChange={(v) => update("constructionYear", v)} placeholder="Ex : 1998" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--muted)]">DPE (lettre)</label>
            <select
              value={details.dpe}
              onChange={(e) => update("dpe", e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
            >
              <option value="">Non renseigné</option>
              {["A", "B", "C", "D", "E", "F", "G"].map((letter) => (
                <option key={letter} value={letter}>
                  {letter}
                </option>
              ))}
            </select>
          </div>
          <FormField label="Diagnostic réalisé le" type="date" value={details.diagnosticDate} onChange={(v) => update("diagnosticDate", v)} />
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Dépenses énergie min" type="number" suffix="€/an" value={details.energyCostMin} onChange={(v) => update("energyCostMin", v)} />
            <FormField label="Dépenses énergie max" type="number" suffix="€/an" value={details.energyCostMax} onChange={(v) => update("energyCostMax", v)} />
          </div>
        </AccordionSection>

        <AccordionSection title="Proximités" filledCount={counts.proximites}>
          <FormField label="Écoles / collège / lycée" type="number" suffix="min" value={details.schoolMinutes} onChange={(v) => update("schoolMinutes", v)} placeholder="Ex : 5" />
          <FormField label="Gare / transports en commun" type="number" suffix="min" value={details.transitMinutes} onChange={(v) => update("transitMinutes", v)} placeholder="Ex : 8" />
          <FormField label="Commerces / centre-ville" type="number" suffix="min" value={details.shopsMinutes} onChange={(v) => update("shopsMinutes", v)} placeholder="Ex : 3" />
          <FormField label="Axe routier (nom)" value={details.roadAccessName} onChange={(v) => update("roadAccessName", v)} placeholder="Ex : A13" />
          <FormField label="Axe routier (temps)" type="number" suffix="min" value={details.roadAccessMinutes} onChange={(v) => update("roadAccessMinutes", v)} placeholder="Ex : 10" />
        </AccordionSection>

        <AccordionSection title="Financier" filledCount={counts.financier}>
          <FormField label="Prix hors honoraires" type="number" suffix="€" value={details.priceExcludingFees} onChange={(v) => update("priceExcludingFees", v)} />
          <FormField label="Honoraires charge acquéreur" type="number" suffix="%" value={details.feesPercent} onChange={(v) => update("feesPercent", v)} />
          <FormField label="Référence agence" value={details.agencyRef} onChange={(v) => update("agencyRef", v)} />
          <FormField label="Référence annonce" value={details.listingRef} onChange={(v) => update("listingRef", v)} />
        </AccordionSection>

        <AccordionSection title="Autres atouts" filledCount={counts.atouts}>
          <BoolToggle label="Vue dégagée" value={details.clearView} onChange={(v) => update("clearView", v)} />
          <BoolToggle label="Calme / pas de vis-à-vis" value={details.quiet} onChange={(v) => update("quiet", v)} />
          <BoolToggle label="Récemment rénové" value={details.recentlyRenovated} onChange={(v) => update("recentlyRenovated", v)} />
          <BoolToggle label="Fibre optique" value={details.fiber} onChange={(v) => update("fiber", v)} />
        </AccordionSection>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-blue)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Analyse en cours…
          </>
        ) : (
          "Analyser"
        )}
      </button>
      {error && <p className="text-center text-xs text-[var(--danger)]">{error}</p>}
    </form>
  );
}
