const LIEN_RECHARGE = "https://whop.com/checkout/plan_QNCPJN4IbMF7d";

export default function RechargePage() {
  return (
    <div className="tech-grid relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
      <div className="glow-card animate-fade-in-up w-full max-w-md">
        <div className="gradient-panel rounded-[23px] p-8 text-center sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-blue)]/20 bg-[var(--accent-blue-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent-blue)]">
            Recharge
          </span>
          <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl">
            Recharger mes coups d&apos;énergie
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-[var(--muted)]">
            Merci de bien prévenir mon ingénieur avant de faire la recharge.
          </p>
          <a
            href={LIEN_RECHARGE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8 inline-flex w-full items-center justify-center rounded-xl px-8 py-4 text-base font-bold"
          >
            Recharger
          </a>
        </div>
      </div>
    </div>
  );
}
