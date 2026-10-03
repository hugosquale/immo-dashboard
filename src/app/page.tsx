"use client";

import { useState } from "react";
import AnalysisForm from "@/components/AnalysisForm";
import CategoryTabs from "@/components/CategoryTabs";
import LoadingModal from "@/components/LoadingModal";
import SkeletonCategories from "@/components/SkeletonCategories";
import SellersPanel from "@/components/SellersPanel";
import BuyersPanel from "@/components/BuyersPanel";
import RecoPage from "@/components/RecoPage";
import { FICHES } from "@/lib/recommandations";
import SuiviProvider, { useSuivi } from "@/components/SuiviProvider";
import LoginGate from "@/components/LoginGate";
import { getCachedAnalysis, setCachedAnalysis } from "@/lib/cache";
import { EXAMPLE_INPUT, EXAMPLE_RESULT } from "@/lib/exampleResult";
import type { AnalysisInput, AnalysisResult } from "@/lib/types";

type Volet = string;

/** Volets affichés sur une seule page, sans défilement. */
const PLEIN_ECRAN = new Set(["vendeurs", "acheteurs"]);

const VOLETS: { key: Volet; label: string }[] = [
  { key: "vendeurs", label: "Chers vendeurs" },
  { key: "acheteurs", label: "Chers acheteurs" },
  { key: "analyse", label: "Analyse avancée" },
];

const ONGLETS_RECO = FICHES.map((f) => ({ key: f.cle, complet: f.onglet, court: f.ongletCourt }));

function Application() {
  const [result, setResult] = useState<AnalysisResult | null>(EXAMPLE_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [volet, setVolet] = useState<Volet>("vendeurs");
  const { utilisateur, pret, deconnecter } = useSuivi();

  async function handleAnalyze(input: AnalysisInput) {
    setError(null);
    setIsLoading(true);
    setResult(null);
    setStreamedContent("");

    const cached = getCachedAnalysis(input);
    if (cached) {
      setTimeout(() => {
        setResult(cached);
        setIsLoading(false);
        setStreamedContent("");
      }, 5000);
      return;
    }

    try {
      const res = await fetch("/api/analyze?stream=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "L'analyse a échoué.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Pas de stream disponible.");

      const decoder = new TextDecoder();
      let fullJson = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            if (jsonStr === "[DONE]") continue;

            try {
              const data = JSON.parse(jsonStr);
              if (data.chunk) {
                fullJson += data.chunk;
                setStreamedContent(fullJson.slice(0, 200) + (fullJson.length > 200 ? "..." : ""));
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      const data: AnalysisResult = JSON.parse(fullJson);
      setResult(data);
      setCachedAnalysis(input, data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setIsLoading(false);
      setStreamedContent("");
    }
  }

  if (!pret) return <div className="min-h-screen bg-white" />;
  if (!utilisateur) return <LoginGate />;

  return (
    <div
      className={`flex w-full flex-col ${
        PLEIN_ECRAN.has(volet) ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {volet === "analyse" ? (
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-[url('/bg-squale.jpg')] bg-cover bg-center bg-no-repeat"
        />
      ) : (
        <div aria-hidden className="fixed inset-0 -z-10 bg-white" />
      )}

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-6 px-5 sm:px-8">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {VOLETS.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setVolet(v.key)}
                className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  volet === v.key
                    ? "btn-primary"
                    : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                {v.label}
              </button>
            ))}

            <span aria-hidden className="mx-2 h-6 w-px shrink-0 bg-[var(--border)]" />

            {ONGLETS_RECO.map((v) => {
              const actif = volet === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVolet(v.key)}
                  title={`Recommandations Squale (${v.complet})`}
                  className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    actif
                      ? "btn-primary"
                      : "border-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Recommandations Squale{" "}
                  <span className={actif ? "" : "opacity-70"}>({actif ? v.complet : v.court})</span>
                  {(utilisateur.progression[v.key] ?? 0) >= 100 && (
                    <svg viewBox="0 0 16 16" className="ml-1.5 inline-block h-3.5 w-3.5 align-[-2px]" aria-label="lu">
                      <circle cx="8" cy="8" r="7.2" fill={actif ? "#ffffff" : "var(--accent-green)"} />
                      <path
                        d="m5 8.2 2.2 2.2L11.2 6"
                        stroke={actif ? "var(--accent-blue)" : "#ffffff"}
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 border-l border-[var(--border)] pl-4">
            <span className="hidden text-sm font-semibold text-[var(--foreground)] sm:inline">
              {utilisateur.prenom} {utilisateur.nom}
            </span>
            <button
              type="button"
              onClick={deconnecter}
              title="Changer d'utilisateur"
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            >
              Changer
            </button>
          </div>
        </div>
      </header>

      <div key={volet} className="animate-fade-in-up flex min-h-0 flex-1 flex-col">
        {volet === "vendeurs" && <SellersPanel />}
        {volet === "acheteurs" && <BuyersPanel />}

        {FICHES.map((f) => volet === f.cle && <RecoPage key={f.cle} fiche={f} />)}

        {volet === "analyse" && (
          <div className="flex flex-1 flex-col lg:flex-row">
            <main className="order-2 min-w-0 flex-1 p-6 lg:order-1 lg:p-8">
              <div className="mx-auto w-full max-w-4xl">
                {isLoading && (
                  <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent-blue)]" />
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Analyse en cours… la machine réfléchit
                      </p>
                    </div>
                  </div>
                )}
                <div className="animate-fade-in-up rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] sm:p-8">
                  {isLoading ? <SkeletonCategories /> : result && <CategoryTabs result={result} />}
                </div>
              </div>
            </main>

            <aside className="order-1 w-full shrink-0 border-b border-[var(--border)] bg-[var(--surface)] lg:order-2 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-full lg:max-w-[360px] lg:overflow-y-auto lg:border-b-0 lg:border-l">
              <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} initialInput={EXAMPLE_INPUT} error={error} />
            </aside>
          </div>
        )}
      </div>

      {isLoading && <LoadingModal streamedContent={streamedContent} />}
    </div>
  );
}

export default function Home() {
  return (
    <SuiviProvider>
      <Application />
    </SuiviProvider>
  );
}
