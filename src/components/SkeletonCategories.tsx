function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

function PlatformBlock() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <Block className="h-4 w-40" />
      <div className="mt-4 flex gap-2">
        <Block className="h-8 w-24" />
        <Block className="h-8 w-24" />
        <Block className="h-8 w-24" />
      </div>
      <Block className="mt-4 h-4 w-1/3" />
      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Block className="h-28 w-full" />
        <Block className="h-28 w-full" />
      </div>
    </div>
  );
}

export default function SkeletonCategories() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} className="h-10 w-full" />
        ))}
      </div>

      <PlatformBlock />
      <PlatformBlock />
    </div>
  );
}
