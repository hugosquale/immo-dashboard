import CopyButton from "./CopyButton";
import ExpandableText from "./ExpandableText";
import { splitWithHighlights } from "@/lib/highlight";
import type { PlatformContent } from "@/lib/types";

export default function PlatformPanels({ content }: { content: PlatformContent }) {
  const chunks = splitWithHighlights(content.description, content.highlights);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold leading-snug text-[var(--foreground)]">{content.title}</h4>
        <CopyButton text={`${content.title}\n\n${content.description}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">
            À copier-coller
          </p>
          <ExpandableText className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
            {content.description}
          </ExpandableText>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted-2)]">
            Pourquoi ça marche
          </p>
          <ExpandableText className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
            {chunks.map((chunk, i) =>
              chunk.highlight ? (
                <span key={i}>
                  <strong className="font-semibold not-italic text-[var(--foreground)]">{chunk.text}</strong>
                  {chunk.reason && (
                    <em className="ml-1 text-[11px] italic text-[var(--accent-blue)]">({chunk.reason})</em>
                  )}
                </span>
              ) : (
                <span key={i}>{chunk.text}</span>
              )
            )}
          </ExpandableText>
        </div>
      </div>
    </div>
  );
}
