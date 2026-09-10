"use client";

import { useState } from "react";
import AnalysisForm from "@/components/AnalysisForm";
import CategoryTabs from "@/components/CategoryTabs";
import LoadingModal from "@/components/LoadingModal";
import SkeletonCategories from "@/components/SkeletonCategories";
import { getCachedAnalysis, setCachedAnalysis } from "@/lib/cache";
import { EXAMPLE_INPUT, EXAMPLE_RESULT } from "@/lib/exampleResult";
import type { AnalysisInput, AnalysisResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(EXAMPLE_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamedContent, setStreamedContent] = useState("");

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

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[url('/bg-squale.jpg')] bg-cover bg-center bg-no-repeat"
      />

      <main className="order-2 min-w-0 flex-1 p-6 lg:order-1 lg:p-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="animate-fade-in-up mb-6 flex justify-center">
            <img src="/logonoir.png" alt="Squale AI" className="h-6 w-auto" />
          </div>
          {isLoading && (
            <div className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent-blue)]" />
                <p className="text-sm font-medium text-[var(--foreground)]">Analyse en cours… la machine réfléchit</p>
              </div>
            </div>
          )}
          <div className="animate-fade-in-up rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] sm:p-8">
            {isLoading ? <SkeletonCategories /> : result && <CategoryTabs result={result} />}
          </div>
        </div>
      </main>

      <aside className="order-1 w-full shrink-0 border-b border-[var(--border)] bg-[var(--surface)] lg:order-2 lg:sticky lg:top-0 lg:h-screen lg:w-full lg:max-w-[360px] lg:overflow-y-auto lg:border-b-0 lg:border-l">
        <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} initialInput={EXAMPLE_INPUT} error={error} />
      </aside>

      {isLoading && <LoadingModal streamedContent={streamedContent} />}
    </div>
  );
}
