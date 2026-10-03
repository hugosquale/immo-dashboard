import type { ReactNode } from "react";

/* Icônes dessinées dans un repère 0–24, posées ensuite à l'échelle voulue.
   Volontairement détaillées (dégradés, pastilles, reflets) plutôt que de
   simples traits, pour l'aspect « nœud d'agent » façon n8n. */

/** Puce « AI » avec ses pistes de circuit : l'agent qui part chercher. */
export const AiChipIcon: ReactNode = (
  <>
    {/* pistes, tracées avant la puce pour passer dessous */}
    <g stroke="url(#chipGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.6 7V3h-3.3" />
      <path d="M13.9 7V3h2.5" />
      <path d="M7 10.6H2.6V7.5" />
      <path d="M7 13.5H2.6v2.4" />
      <path d="M17 10.6h4.4V7.5" />
      <path d="M17 13.5h4.4v2.4" />
      <path d="M10.6 17v4h-3.3" />
      <path d="M13.9 17v4h2.5" />
    </g>

    {/* nœuds au bout des pistes */}
    <g fill="url(#chipGrad)">
      {[
        [7.3, 3],
        [16.4, 3],
        [2.6, 7.5],
        [21.4, 7.5],
        [2.6, 15.9],
        [21.4, 15.9],
        [7.3, 21],
        [16.4, 21],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.85" />
      ))}
    </g>

    {/* corps de la puce */}
    <rect x="7" y="7" width="10" height="10" rx="2.6" fill="url(#chipGrad)" />
    <text
      x="12"
      y="12"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="5.4"
      fontWeight="700"
      fill="#ffffff"
      letterSpacing="0.2"
    >
      AI
    </text>
  </>
);

/** WhatsApp avec une pastille de notification rouge. */
export const WhatsAppIcon: ReactNode = (
  <>
    <path
      d="M11.6 3a8.9 8.9 0 0 0-7.7 13.4l-1.2 4.3 4.4-1.2A8.9 8.9 0 1 0 11.6 3Z"
      fill="url(#waGrad)"
    />
    <path
      d="M8.7 7.7c-.15-.35-.3-.36-.45-.37h-.4c-.14 0-.36.05-.55.26-.19.21-.72.7-.72 1.72 0 1.01.74 1.99.84 2.13.1.14 1.43 2.29 3.53 3.12 1.75.69 2.1.55 2.48.52.38-.04 1.23-.5 1.4-.99.17-.49.17-.9.12-.99-.05-.09-.19-.14-.4-.24l-1.4-.68c-.19-.09-.33-.14-.47.07l-.5.63c-.1.14-.21.15-.4.05-.19-.09-.93-.35-1.77-1.1-.65-.58-1.1-1.3-1.23-1.51-.12-.21-.01-.33.09-.43l.35-.42c.1-.13.13-.22.2-.36.06-.14.03-.26-.02-.36L8.7 7.7Z"
      fill="#ffffff"
    />
    {/* pastille de notification */}
    <circle cx="18.6" cy="5.4" r="4.2" fill="#ff3b30" stroke="#ffffff" strokeWidth="1.3" />
    <path d="M18.6 3.7v3.4M16.9 5.4h3.4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

/** Maison avec un cœur : l'acheteur à qui le bien correspond. */
export const HouseHeartIcon: ReactNode = (
  <>
    <path d="M2.8 11 12 3.4 21.2 11" stroke="#0055b4" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.1 9.6v10.4h13.8V9.6" fill="url(#houseGrad)" stroke="#0071e3" strokeWidth="1.5" strokeLinejoin="round" />
    <path
      d="M12 18.1c-2.5-1.7-4-3.1-4-4.8a2.1 2.1 0 0 1 4-.85 2.1 2.1 0 0 1 4 .85c0 1.7-1.5 3.1-4 4.8Z"
      fill="#ff3b5c"
    />
    <path d="M10.4 13.4a1.4 1.4 0 0 1 1-.9" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" opacity="0.8" fill="none" />
  </>
);

/** Œil : la visite du bien. */
export const EyeIcon: ReactNode = (
  <>
    <path
      d="M1.9 12S5.9 5.4 12 5.4 22.1 12 22.1 12 18.1 18.6 12 18.6 1.9 12 1.9 12Z"
      fill="url(#eyeGrad)"
      stroke="#0055b4"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3.9" fill="#0071e3" />
    <circle cx="12" cy="12" r="1.7" fill="#04264d" />
    <circle cx="13.4" cy="10.5" r="0.85" fill="#ffffff" />
    <path d="M4.6 7.6 6.4 9M19.4 7.6 17.6 9" stroke="#0071e3" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </>
);

/** Dégradés utilisés par les icônes, à inclure une fois dans les <defs> du SVG. */
export const IconGradients: ReactNode = (
  <>
    <linearGradient id="chipGrad" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stopColor="#4aa6ff" />
      <stop offset="60%" stopColor="#0071e3" />
      <stop offset="100%" stopColor="#0050ab" />
    </linearGradient>
    <linearGradient id="waGrad" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stopColor="#5cf07f" />
      <stop offset="100%" stopColor="#1faf46" />
    </linearGradient>
    <linearGradient id="houseGrad" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stopColor="#eaf3ff" />
      <stop offset="100%" stopColor="#cfe4ff" />
    </linearGradient>
    <radialGradient id="eyeGrad" cx="0.5" cy="0.5" r="0.6">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="100%" stopColor="#dceaff" />
    </radialGradient>
  </>
);

/* ---- Petites icônes des bandeaux, sous chaque encart ---- */

/** Réseaux et site, pour l'étape 1. */
export const FacebookIcon: ReactNode = (
  <>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#1877f2" />
    <path
      d="M14.6 12.6h2.1l.4-2.9h-2.5V7.9c0-.8.3-1.4 1.5-1.4h1.1V3.9c-.6-.1-1.4-.2-2.2-.2-2.3 0-3.8 1.4-3.8 3.9v2.1H8.8v2.9h2.4v7.4h3.4v-7.4Z"
      fill="#ffffff"
    />
  </>
);

export const InstagramIcon: ReactNode = (
  <>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#igGrad)" />
    <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#ffffff" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="2.9" fill="none" stroke="#ffffff" strokeWidth="1.7" />
    <circle cx="16.1" cy="7.9" r="1.05" fill="#ffffff" />
  </>
);

export const LinkedInIcon: ReactNode = (
  <>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#0a66c2" />
    <circle cx="7.1" cy="7.2" r="1.7" fill="#ffffff" />
    <rect x="5.7" y="10" width="2.8" height="8.4" rx="0.5" fill="#ffffff" />
    <path
      d="M11 10h2.7v1.2a3 3 0 0 1 2.6-1.4c2 0 3.2 1.3 3.2 3.7v4.9h-2.8v-4.4c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8v4.3H11V10Z"
      fill="#ffffff"
    />
  </>
);

export const WebsiteIcon: ReactNode = (
  <>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#webGrad)" />
    <circle cx="12" cy="12" r="6.6" fill="none" stroke="#ffffff" strokeWidth="1.5" />
    <path
      d="M5.4 12h13.2M12 5.4c1.9 2 2.9 4.3 2.9 6.6s-1 4.6-2.9 6.6c-1.9-2-2.9-4.3-2.9-6.6s1-4.6 2.9-6.6Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.5"
    />
  </>
);

/** Silhouette de profil, avec une pastille d'état optionnelle. */
export function ProfileIcon({ badge }: { badge: "check" | "cross" | "heart" | "none" }) {
  return (
    <>
      <circle cx="12" cy="8.2" r="3.7" fill="#8e99a8" />
      <path d="M4.4 21.5c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6Z" fill="#8e99a8" />
      {badge === "check" && (
        <>
          <circle cx="18.6" cy="18.4" r="5.1" fill="#13ab5e" stroke="#ffffff" strokeWidth="1.5" />
          <path
            d="m16.4 18.4 1.6 1.6 3-3.1"
            stroke="#ffffff"
            strokeWidth="1.7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {badge === "cross" && (
        <>
          <circle cx="18.6" cy="18.4" r="5.1" fill="#f4356a" stroke="#ffffff" strokeWidth="1.5" />
          <path
            d="m16.8 16.6 3.6 3.6M20.4 16.6l-3.6 3.6"
            stroke="#ffffff"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </>
      )}
      {badge === "heart" && (
        <>
          <circle cx="18.6" cy="18.4" r="5.1" fill="#ffffff" stroke="#f4356a" strokeWidth="1.3" />
          <path
            d="M18.6 21c-1.9-1.3-3-2.3-3-3.5a1.6 1.6 0 0 1 3-.65 1.6 1.6 0 0 1 3 .65c0 1.2-1.1 2.2-3 3.5Z"
            fill="#f4356a"
          />
        </>
      )}
    </>
  );
}

/** Dégradés supplémentaires pour les icônes de bandeau. */
export const BadgeGradients: ReactNode = (
  <>
    <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stopColor="#ffd521" />
      <stop offset="30%" stopColor="#f50000" />
      <stop offset="65%" stopColor="#b900b4" />
      <stop offset="100%" stopColor="#5b6def" />
    </linearGradient>
    <linearGradient id="webGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4aa6ff" />
      <stop offset="100%" stopColor="#0050ab" />
    </linearGradient>
  </>
);

/** Vignette de bien, avec une pastille d'état optionnelle — pendant de ProfileIcon. */
export function HomeBadgeIcon({ badge }: { badge: "check" | "cross" | "heart" | "none" }) {
  return (
    <>
      <path d="M2.6 10.4 12 3.1l9.4 7.3" stroke="#8e99a8" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.2v11.3h14V9.2" fill="#8e99a8" />
      {badge === "check" && (
        <>
          <circle cx="18.6" cy="18.4" r="5.1" fill="#13ab5e" stroke="#ffffff" strokeWidth="1.5" />
          <path d="m16.4 18.4 1.6 1.6 3-3.1" stroke="#ffffff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {badge === "cross" && (
        <>
          <circle cx="18.6" cy="18.4" r="5.1" fill="#f4356a" stroke="#ffffff" strokeWidth="1.5" />
          <path d="m16.8 16.6 3.6 3.6M20.4 16.6l-3.6 3.6" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
      {badge === "heart" && (
        <>
          <circle cx="18.6" cy="18.4" r="5.1" fill="#ffffff" stroke="#f4356a" strokeWidth="1.3" />
          <path d="M18.6 21c-1.9-1.3-3-2.3-3-3.5a1.6 1.6 0 0 1 3-.65 1.6 1.6 0 0 1 3 .65c0 1.2-1.1 2.2-3 3.5Z" fill="#f4356a" />
        </>
      )}
    </>
  );
}
