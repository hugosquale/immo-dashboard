function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

export default function SkeletonKpiSidebar() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <Block className="h-3 w-24" />
          <Block className="mt-3 h-10 w-full" />
        </div>
      ))}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <Block className="h-4 w-40" />
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Block key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
