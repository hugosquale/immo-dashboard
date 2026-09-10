function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

export default function SkeletonKpiSidebar() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <Block className="h-3.5 w-32" />
        <Block className="mt-4 h-[68px] w-[68px] rounded-full" />
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <Block className="h-2.5 w-24" />
          <Block className="mt-2.5 h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
