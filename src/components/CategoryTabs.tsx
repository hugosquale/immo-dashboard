"use client";

import { useState } from "react";
import LeBonCoinCard from "./LeBonCoinCard";
import SocialMediaCard from "./SocialMediaCard";
import StrategyTab from "./StrategyTab";
import VisualTab from "./VisualTab";
import ArgumentaireTab from "./ArgumentaireTab";
import VisitSheetTab from "./VisitSheetTab";
import BoostAiTab from "./BoostAiTab";
import type { AnalysisResult } from "@/lib/types";

type Category = "boostIA" | "description" | "strategie" | "visuel" | "argumentaire" | "fiche";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "boostIA", label: "Booster avec l'IA" },
  { key: "description", label: "Description" },
  { key: "strategie", label: "Stratégie" },
  { key: "visuel", label: "Visuel" },
  { key: "argumentaire", label: "Argumentaire" },
  { key: "fiche", label: "Fiche de visite" },
];

export default function CategoryTabs({ result }: { result: AnalysisResult }) {
  const [active, setActive] = useState<Category>("description");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              active === c.key
                ? "btn-primary"
                : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div key={active} className="animate-fade-in-up">
        {active === "boostIA" && <BoostAiTab />}
        {active === "description" && (
          <div className="flex flex-col gap-5">
            <LeBonCoinCard content={result.marketing.leboncoin} />
            <SocialMediaCard marketing={result.marketing} />
          </div>
        )}
        {active === "strategie" && <StrategyTab strategy={result.strategy} />}
        {active === "visuel" && <VisualTab visual={result.visual} />}
        {active === "argumentaire" && (
          <ArgumentaireTab
            argumentaire={result.argumentaire}
            userPrice={result.input.userPrice}
            marketTension={result.marketTension}
          />
        )}
        {active === "fiche" && <VisitSheetTab result={result} />}
      </div>
    </div>
  );
}
