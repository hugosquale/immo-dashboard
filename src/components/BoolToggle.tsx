"use client";

interface BoolToggleProps {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  includeUnknown?: boolean;
}

export default function BoolToggle({ label, value, onChange, includeUnknown = true }: BoolToggleProps) {
  function select(next: boolean | undefined) {
    onChange(value === next ? undefined : next);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => select(true)}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
            value === true
              ? "border-[var(--accent-green)] bg-[var(--accent-green-soft)] text-[var(--accent-green)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-strong)]"
          }`}
        >
          Oui
        </button>
        <button
          type="button"
          onClick={() => select(false)}
          className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
            value === false
              ? "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]"
              : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-strong)]"
          }`}
        >
          Non
        </button>
        {includeUnknown && (
          <button
            type="button"
            onClick={() => select(undefined)}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
              value === undefined
                ? "border-[var(--border-strong)] bg-[var(--surface-hover)] text-[var(--foreground)]"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-strong)]"
            }`}
          >
            Aucune info
          </button>
        )}
      </div>
    </div>
  );
}
