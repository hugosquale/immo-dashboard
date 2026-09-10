"use client";

import { useState } from "react";
import Card from "./Card";

interface Platform {
  key: string;
  label: string;
  initials: string;
  color: string;
}

const PLATFORMS: Platform[] = [
  { key: "seloger", label: "SeLoger", initials: "SL", color: "#e2001a" },
  { key: "site", label: "Votre site", initials: "VS", color: "var(--accent-blue)" },
  { key: "leboncoin", label: "Le Bon Coin", initials: "LBC", color: "#ff6e14" },
  { key: "autre", label: "Autre", initials: "···", color: "var(--muted-2)" },
];

const PERF_BEFORE = 53;
const PERF_AFTER = 77;

function PlatformMark({ platform }: { platform: Platform }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
        style={{ background: platform.color }}
      >
        {platform.initials}
      </div>
      <span className="text-xs font-medium text-[var(--foreground)]">{platform.label}</span>
    </div>
  );
}

export default function BoostAiTab() {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValidUrl = /^https?:\/\/.+\..+/i.test(url.trim());

  function handleBoost() {
    if (!isValidUrl) return;
    setSubmitted(true);
  }

  return (
    <div className="stagger-children flex flex-col gap-5">
      <Card
        title="Booster une annonce existante"
        subtitle="Collez le lien de votre annonce en ligne pour la faire réécrire et optimiser par l'IA"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="boost-url" className="text-xs font-medium text-[var(--muted)]">
              URL de l&apos;annonce
            </label>
            <input
              id="boost-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://www.seloger.com/annonces/..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setSubmitted(false);
              }}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
            />
            {url.trim() !== "" && !isValidUrl && (
              <p className="text-[11px] text-[var(--danger)]">Entrez une URL valide (commençant par https://).</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleBoost}
            disabled={!isValidUrl}
            className="btn-primary w-full rounded-xl px-6 py-5 text-lg font-bold"
          >
            Booster avec l&apos;IA
          </button>

          {submitted && (
            <div className="flex flex-col gap-1 text-center">
              <p className="text-xs">
                <span className="text-[var(--danger)]">
                  Nous vérifions que ce mandat vient bien de Squale Immobilier,
                </span>{" "}
                <span className="text-[var(--accent-green)]">
                  votre annonce sera boostée d&apos;ici les prochains jours si c&apos;est le cas.
                </span>
              </p>
              <p className="text-xs text-[var(--muted)]">Merci de prévenir votre ingénieur.</p>
            </div>
          )}

          <div className="border-t border-[var(--border)] pt-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">
              Plateformes prises en charge
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {PLATFORMS.map((p) => (
                <PlatformMark key={p.key} platform={p} />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 px-4 py-3">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">
          Performance de l&apos;annonce
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-[11px] text-[var(--muted)]">Avant</span>
            <div className="h-1 flex-1 rounded-full bg-[var(--surface)]">
              <div className="animate-gauge h-1 rounded-full bg-[var(--warning)]" style={{ width: `${PERF_BEFORE}%` }} />
            </div>
            <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-[var(--warning)]">
              {PERF_BEFORE}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-[11px] text-[var(--muted)]">Après</span>
            <div className="h-1 flex-1 rounded-full bg-[var(--surface)]">
              <div className="animate-gauge h-1 rounded-full bg-[var(--accent-green)]" style={{ width: `${PERF_AFTER}%` }} />
            </div>
            <span className="w-9 shrink-0 text-right text-[11px] font-semibold text-[var(--accent-green)]">
              {PERF_AFTER}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
