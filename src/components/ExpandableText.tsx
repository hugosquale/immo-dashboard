"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ExpandableTextProps {
  children: ReactNode;
  className?: string;
}

export default function ExpandableText({ children, className = "" }: ExpandableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <div>
      <p ref={ref} className={`${className} ${!expanded ? "line-clamp-[10]" : ""}`}>
        {children}
      </p>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="btn-primary mt-3 w-full rounded-lg py-3 text-sm font-semibold"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}
