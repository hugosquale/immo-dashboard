"use client";

import { useState, type ReactNode } from "react";

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  filledCount?: number;
  children: ReactNode;
}

export default function AccordionSection({ title, defaultOpen = false, filledCount = 0, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {title}
          {filledCount > 0 && (
            <span className="rounded-full bg-[var(--accent-blue-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent-blue)]">
              {filledCount}
            </span>
          )}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-3 pb-4">{children}</div>}
    </div>
  );
}
