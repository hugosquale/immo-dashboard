/* Maquette de téléphone affichant un flux de nouveaux acheteurs qui défile.
   Coordonnées exprimées dans le repère du schéma (1600 × 900). */

export const PHONE_X = 1290;
export const PHONE_Y = 150;
export const PHONE_W = 300;
export const PHONE_H = 630;

const SCREEN_X = PHONE_X + 12;
const SCREEN_W = PHONE_W - 24;
const LIST_Y = PHONE_Y + 62;
const LIST_H = PHONE_H - 78;

const CARD_X = SCREEN_X + 10;
const CARD_W = SCREEN_W - 20;
const CARD_H = 86;
const PITCH = 98;

export type Etat = "valide" | "neutre" | "refuse";

export interface FeedItem {
  nom: string;
  souhait: string;
  etat: Etat;
}

const ACHETEURS: FeedItem[] = [
  { nom: "Camille Perrot", souhait: "Maison 120 m² · 320 000 € · solvable", etat: "valide" },
  { nom: "Julien Marchand", souhait: "Appart. 70 m² · 240 000 € · prêt validé", etat: "valide" },
  { nom: "Sofia Bensaïd", souhait: "Maison 140 m² · 390 000 € · avec jardin", etat: "neutre" },
  { nom: "Thomas Lefèvre", souhait: "Appart. 85 m² · 265 000 € · solvable", etat: "valide" },
  { nom: "Léa Fontaine", souhait: "Maison 110 m² · 305 000 € · hors zone", etat: "refuse" },
  { nom: "Marc Delaunay", souhait: "Maison 160 m² · 450 000 € · solvable", etat: "valide" },
  { nom: "Inès Chevalier", souhait: "Appart. 60 m² · 195 000 € · à étudier", etat: "neutre" },
  { nom: "Paul Rivière", souhait: "Maison 130 m² · 340 000 € · prêt validé", etat: "valide" },
];

const CYCLE = ACHETEURS.length * PITCH;

function Notification({ a, y, label, glyphe }: { a: FeedItem; y: number; label: string; glyphe: "profil" | "bien" }) {
  return (
    <g>
      <rect x={CARD_X} y={y} width={CARD_W} height={CARD_H} rx={16} fill="#ffffff" stroke="#e2eaf4" strokeWidth="1.2" />

      {/* pastille de l'application */}
      <rect x={CARD_X + 12} y={y + 14} width={30} height={30} rx={10} fill="url(#badgeGrad)" />
      <g transform={`translate(${CARD_X + 19} ${y + 21}) scale(0.7)`} fill="#ffffff">
        {glyphe === "profil" ? (
          <>
            <circle cx="12" cy="8.2" r="3.7" />
            <path d="M4.4 21.5c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6Z" />
          </>
        ) : (
          <>
            <path d="M1.8 10.6 12 2.6l10.2 8" stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.6 9.2v12h14.8v-12" />
          </>
        )}
      </g>

      <text x={CARD_X + 52} y={y + 26} fontSize="9.5" fontWeight="700" fill="#0071e3" letterSpacing="0.4">
        {label}
      </text>
      <text x={CARD_X + 52} y={y + 47} fontSize="14.5" fontWeight="700" fill="#1d1d1f">
        {a.nom}
      </text>
      <text x={CARD_X + 52} y={y + 68} fontSize="11" fill="#6e6e73">
        {a.souhait}
      </text>

      {a.etat === "valide" && (
        <g transform={`translate(${CARD_X + CARD_W - 32} ${y + 12})`}>
          <circle cx="10" cy="10" r="9.5" fill="#13ab5e" />
          <path d="m5.8 10.2 2.9 2.9 5.4-5.6" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {a.etat === "refuse" && (
        <g transform={`translate(${CARD_X + CARD_W - 32} ${y + 12})`}>
          <circle cx="10" cy="10" r="9.5" fill="#f4356a" />
          <path d="m6.6 6.6 6.8 6.8M13.4 6.6l-6.8 6.8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export default function PhoneFeed({
  titre = "Nouveaux acheteurs",
  label = "NOUVEL ACHETEUR QUALIFIÉ",
  items = ACHETEURS,
  glyphe = "profil",
}: {
  titre?: string;
  label?: string;
  items?: FeedItem[];
  glyphe?: "profil" | "bien";
} = {}) {
  return (
    <g>
      {/* halo */}
      <rect
        className="node-halo"
        x={PHONE_X - 9}
        y={PHONE_Y - 9}
        width={PHONE_W + 18}
        height={PHONE_H + 18}
        rx={44}
        fill="url(#nodeBlue)"
      />

      {/* coque */}
      <rect x={PHONE_X} y={PHONE_Y} width={PHONE_W} height={PHONE_H} rx={38} fill="url(#phoneBody)" />
      <rect
        x={PHONE_X + 4}
        y={PHONE_Y + 4}
        width={PHONE_W - 8}
        height={PHONE_H - 8}
        rx={34}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="1.5"
      />

      {/* écran */}
      <rect x={SCREEN_X} y={PHONE_Y + 12} width={SCREEN_W} height={PHONE_H - 24} rx={28} fill="#eef4fb" />

      {/* encoche */}
      <rect x={PHONE_X + PHONE_W / 2 - 42} y={PHONE_Y + 16} width={84} height={20} rx={10} fill="#12161c" />

      <text x={SCREEN_X + 16} y={PHONE_Y + 54} fontSize="15" fontWeight="700" fill="#1d1d1f">
        {titre}
      </text>

      {/* flux défilant, rogné à la zone d'écran */}
      <clipPath id={`phoneClip-${titre.replace(/\W/g, "")}`}>
        <rect x={SCREEN_X} y={LIST_Y} width={SCREEN_W} height={LIST_H} rx={4} />
      </clipPath>
      <g clipPath={`url(#phoneClip-${titre.replace(/\W/g, "")})`}>
        <g className="notif-scroll">
          {items.map((a, i) => (
            <Notification key={`a${i}`} a={a} y={LIST_Y + 8 + i * PITCH} label={label} glyphe={glyphe} />
          ))}
          {/* copie, pour que la boucle soit continue */}
          {items.map((a, i) => (
            <Notification key={`b${i}`} a={a} y={LIST_Y + 8 + (i + items.length) * PITCH} label={label} glyphe={glyphe} />
          ))}
        </g>
      </g>

      {/* dégradés de fondu en haut et en bas de la liste */}
      <rect x={SCREEN_X} y={LIST_Y} width={SCREEN_W} height={26} fill="url(#fadeTop)" />
      <rect x={SCREEN_X} y={LIST_Y + LIST_H - 26} width={SCREEN_W} height={26} fill="url(#fadeBottom)" />
    </g>
  );
}

export const PhoneGradients = (
  <>
    <linearGradient id="phoneBody" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stopColor="#3a4250" />
      <stop offset="45%" stopColor="#1d222b" />
      <stop offset="100%" stopColor="#0d1015" />
    </linearGradient>
    <linearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#eef4fb" />
      <stop offset="100%" stopColor="#eef4fb" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#eef4fb" stopOpacity="0" />
      <stop offset="100%" stopColor="#eef4fb" />
    </linearGradient>
  </>
);

export { CYCLE };
