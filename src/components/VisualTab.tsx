import Card from "./Card";
import type { VisualContent } from "@/lib/types";

export default function VisualTab({ visual }: { visual: VisualContent }) {
  return (
    <Card title="Ordre optimal des photos" subtitle={`Nombre de photos recommandé : ${visual.recommendedPhotoCount}`}>
      <ol className="flex flex-col gap-3">
        {visual.photos.map((photo) => (
          <li
            key={photo.order}
            className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-green-soft)] text-sm font-semibold text-[var(--accent-green)]">
              {photo.order}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{photo.subject}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{photo.reason}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
