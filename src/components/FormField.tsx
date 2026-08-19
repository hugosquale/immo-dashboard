"use client";

interface FormFieldProps {
  label: string;
  type?: "text" | "number" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
}

export default function FormField({ label, type = "text", value, onChange, placeholder, suffix }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--muted)]">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-2)] focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue-soft)]"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-2)]">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
