import type { MarketingHighlight } from "./types";

export interface TextChunk {
  text: string;
  highlight: boolean;
  reason?: string;
}

/**
 * Recherche chaque `phrase` dans `description` (sensible à la casse, puis
 * insensible en repli) et retourne le texte découpé en morceaux plain/highlight
 * dans l'ordre d'apparition. Les phrases introuvables ou qui se chevauchent
 * sont ignorées sans casser le rendu.
 */
export function splitWithHighlights(description: string, highlights: MarketingHighlight[]): TextChunk[] {
  const lowerDescription = description.toLowerCase();

  const matches: { start: number; end: number; reason: string }[] = [];
  for (const h of highlights) {
    if (!h.phrase) continue;
    let index = description.indexOf(h.phrase);
    if (index === -1) index = lowerDescription.indexOf(h.phrase.toLowerCase());
    if (index === -1) continue;
    matches.push({ start: index, end: index + h.phrase.length, reason: h.reason });
  }

  matches.sort((a, b) => a.start - b.start);

  const nonOverlapping: typeof matches = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start >= cursor) {
      nonOverlapping.push(m);
      cursor = m.end;
    }
  }

  const chunks: TextChunk[] = [];
  let pos = 0;
  for (const m of nonOverlapping) {
    if (m.start > pos) chunks.push({ text: description.slice(pos, m.start), highlight: false });
    chunks.push({ text: description.slice(m.start, m.end), highlight: true, reason: m.reason });
    pos = m.end;
  }
  if (pos < description.length) chunks.push({ text: description.slice(pos), highlight: false });

  return chunks;
}
