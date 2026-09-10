import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}

export default function Card({ children, className = "", title, subtitle, action }: CardProps) {
  return (
    <div
      className={`card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-wide text-[var(--foreground)]">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={title || action ? "p-5 pt-4" : "p-5"}>{children}</div>
    </div>
  );
}
