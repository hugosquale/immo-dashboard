export default function LoadingModal({ streamedContent }: { streamedContent: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className="animate-fade-in-up w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--card-shadow-hover)]">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--surface-2)] border-t-[var(--accent-blue)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Analyse en cours</h2>
            <p className="text-xs text-[var(--muted)]">La machine réfléchit…</p>
          </div>

          {streamedContent && (
            <div className="max-h-48 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <p className="text-sm leading-relaxed text-[var(--foreground)]">
                {streamedContent}
                <span className="ml-0.5 animate-pulse text-[var(--accent-blue)]">▊</span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="h-2 w-2 animate-bounce rounded-full"
                style={{
                  background: delay === 150 ? "var(--accent-green)" : "var(--accent-blue)",
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
