"use client";

import { useEffect, useState } from "react";
import AnalysisForm from "@/components/AnalysisForm";
import CategoryTabs from "@/components/CategoryTabs";
import LoadingModal from "@/components/LoadingModal";
import SkeletonCategories from "@/components/SkeletonCategories";
import SellersPanel from "@/components/SellersPanel";
import RecoPage from "@/components/RecoPage";
import HomeScreen from "@/components/HomeScreen";
import RecommandationsMenu from "@/components/RecommandationsMenu";
import AdminPage from "@/components/AdminPage";
import { FICHES } from "@/lib/recommandations";
import SuiviProvider, { useSuivi } from "@/components/SuiviProvider";
import LoginGate from "@/components/LoginGate";
import { getCachedAnalysis, setCachedAnalysis } from "@/lib/cache";
import { EXAMPLE_INPUT, EXAMPLE_RESULT } from "@/lib/exampleResult";
import type { AnalysisInput, AnalysisResult } from "@/lib/types";

type Volet = string;

/** Volets affichés sur une seule page, sans défilement. */
const PLEIN_ECRAN = new Set(["vendeurs"]);

function Application() {
  const [result, setResult] = useState<AnalysisResult | null>(EXAMPLE_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState("");
  const [volet, setVolet] = useState<Volet>("accueil");
  const { utilisateur, pret, deconnecter } = useSuivi();

  // à chaque nouvelle connexion (y compris une reconnexion après "Changer"),
  // on revient systématiquement au menu principal plutôt que de garder le
  // volet où se trouvait la session précédente. Ne dépend volontairement que
  // de la clé d'identité, pas de l'objet complet : une simple mise à jour de
  // progression ne doit pas renvoyer l'utilisateur à l'accueil.
  useEffect(() => {
    const cle = utilisateur?.cle;
    if (!cle) return;
    const t = setTimeout(() => setVolet("accueil"), 0);
    return () => clearTimeout(t);
  }, [utilisateur?.cle]);

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
          <div className="flex min-w-0 flex-1 items-center">
            {volet !== "accueil" && (
              <button
                type="button"
                onClick={() => setVolet("accueil")}
                className="flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M13 8H3.5M7.5 3.5 3 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Menu principal
              </button>
            )}
          </div>

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
            <button
              type="button"
              onClick={() => setVolet("admin")}
              title="Administration"
              aria-label="Administration"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-[var(--surface-hover)] ${
                volet === "admin" ? "text-[var(--accent-blue)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                <path d="M19.4 13.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4.5a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H10.5a1.65 1.65 0 0 0 1-1.51V4.5a2 2 0 1 1 4 0v.09c0 .67.39 1.27 1 1.51.59.25 1.27.12 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V10c.24.6.84 1 1.51 1h.09a2 2 0 1 1 0 4h-.09c-.67 0-1.27.4-1.51 1Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div key={volet} className="animate-fade-in-up flex min-h-0 flex-1 flex-col">
        {volet === "accueil" && <HomeScreen onNavigate={setVolet} />}
        {volet === "recommandations" && (
          <RecommandationsMenu progression={utilisateur.progression} onNavigate={setVolet} />
        )}
        {volet === "vendeurs" && <SellersPanel />}
        {volet === "admin" && <AdminPage />}

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
