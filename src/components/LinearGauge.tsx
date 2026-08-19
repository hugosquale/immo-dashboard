interface LinearGaugeProps {
  value: number;
  lowLabel: string;
  midLabel: string;
  highLabel: string;
}

export default function LinearGauge({ value, lowLabel, midLabel, highLabel }: LinearGaugeProps) {
  const pct = Math.min(100, Math.max(0, value));
  const zone = pct < 35 ? lowLabel : pct < 65 ? midLabel : highLabel;
  const color = pct < 35 ? "var(--accent-blue)" : pct < 65 ? "var(--accent-green)" : "var(--warning)";

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold leading-none text-[var(--foreground)]">{Math.round(pct)}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ color, background: `color-mix(in srgb, ${color} 16%, transparent)` }}
        >
          {zone}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--surface-2)]">
        <div
          className="h-1.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
