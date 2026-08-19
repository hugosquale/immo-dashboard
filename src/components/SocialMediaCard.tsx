"use client";

import { useState } from "react";
import Card from "./Card";
import PlatformPanels from "./PlatformPanels";
import { InstagramIcon, TikTokIcon, FacebookIcon } from "./PlatformIcons";
import type { AIGeneratedContent } from "@/lib/types";

type PlatformKey = "instagram" | "tiktok" | "facebook";

const TABS: { key: PlatformKey; label: string; Icon: typeof InstagramIcon }[] = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
];

export default function SocialMediaCard({ marketing }: { marketing: AIGeneratedContent["marketing"] }) {
  const [active, setActive] = useState<PlatformKey>("instagram");

  return (
    <Card title="Réseaux sociaux" subtitle="Contenu prêt à publier, adapté à chaque plateforme">
      <div className="flex gap-2 border-b border-[var(--border)] pb-3">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              active === key
                ? "bg-[var(--accent-blue-soft)] text-[var(--accent-blue)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <PlatformPanels content={marketing[active]} />
      </div>
    </Card>
  );
}
