import Card from "./Card";
import PlatformPanels from "./PlatformPanels";
import { LeBonCoinIcon } from "./PlatformIcons";
import type { PlatformContent } from "@/lib/types";

export default function LeBonCoinCard({ content }: { content: PlatformContent }) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <LeBonCoinIcon className="h-4 w-4 text-[var(--accent-green)]" />
          Web (Le Bon Coin, SeLoger...)
        </span>
      }
      subtitle="Annonce longue et structurée, orientée recherche"
    >
      <PlatformPanels content={content} />
    </Card>
  );
}
