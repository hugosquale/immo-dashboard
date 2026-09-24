import type { ReactNode } from "react";
import {
  IconGradients,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WebsiteIcon,
  ProfileIcon,
  HomeBadgeIcon,
  BadgeGradients,
} from "./StepIcons";
import { IllustrationGradients } from "./StepIllustrations";
import PhoneFeed, { PhoneGradients, PHONE_X, type FeedItem } from "./PhoneFeed";

/* Schéma de flux dessiné dans un repère 1600 × 900 (16/9).
   Tout est en SVG pour que l'ensemble — texte compris — se mette à l'échelle
   du conteneur sans jamais déborder du format. */

const VB_W = 1600;
const VB_H = 900;

export const NODE_W = 275;
const STEP_X = 315; // largeur du nœud + écart
const FIRST_X = 30;

const NODE_Y = 220;
const NODE_H = 290;

const BADGE_Y = 524;
const BADGE_H = 52;

const ICON_TILE = 76;
const ICON_Y = 126;

const ILLU_Y = 598;

export type EtatPastille = "check" | "cross" | "heart" | "none";

export type Badges =
  | { kind: "social" }
  | { kind: "profils"; etats: EtatPastille[] }
  | { kind: "biens"; etats: EtatPastille[] }
  | { kind: "texte"; texte: string };

export interface Step {
  n: number;
  /** Identifiant du dégradé de fond de l'encart. */
  grad: string;
  title: string;
  body: string;
  icon: ReactNode;
  badges: Badges;
  illustration: ReactNode;
}

export interface FlowDiagramProps {
  titreDebut: string;
  titreAccent: string;
  steps: Step[];
  phone: { titre: string; label: string; items: FeedItem[]; glyphe?: "profil" | "bien" };
}

const nodeX = (i: number) => FIRST_X + i * STEP_X;
const MID_Y = NODE_Y + NODE_H / 2;

function FlowNode({ step, i }: { step: Step; i: number }) {
  const x = nodeX(i);
  const cx = x + NODE_W / 2;
  return (
    <g>
      {/* icône posée au-dessus de l'encart, sans cadre ni fond */}
      <g transform={`translate(${cx - 28.8} ${ICON_Y + ICON_TILE / 2 - 28.8}) scale(2.4)`}>{step.icon}</g>

      <rect
        className="node-halo"
        x={x - 7}
        y={NODE_Y - 7}
        width={NODE_W + 14}
        height={NODE_H + 14}
        rx={29}
        fill={`url(#${step.grad})`}
        style={{ animationDelay: `${i * 0.5}s` }}
      />
      <rect x={x} y={NODE_Y} width={NODE_W} height={NODE_H} rx={24} fill={`url(#${step.grad})`} />
      <rect x={x} y={NODE_Y} width={NODE_W} height={NODE_H} rx={24} fill="url(#glossGrad)" />
      <rect
        x={x}
        y={NODE_Y}
        width={NODE_W}
        height={NODE_H}
        rx={24}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.35}
        strokeWidth={1.5}
      />

      <text
        x={x + NODE_W - 22}
        y={NODE_Y + 58}
        textAnchor="end"
        fontSize={44}
        fontWeight={700}
        fill="#ffffff"
        opacity={0.35}
      >
        {step.n}
      </text>

      <foreignObject x={x + 22} y={NODE_Y + 26} width={NODE_W - 78} height={118}>
        <div style={{ fontSize: 19.5, lineHeight: 1.25, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.01em" }}>
          {step.title}
        </div>
      </foreignObject>

      <foreignObject x={x + 22} y={NODE_Y + 152} width={NODE_W - 44} height={126}>
        <div style={{ fontSize: 16.5, lineHeight: 1.5, color: "rgba(255,255,255,0.88)" }}>{step.body}</div>
      </foreignObject>
    </g>
  );
}

/** Bandeau de petites icônes intercalé entre l'encart et son illustration. */
function StepBadges({ step, i }: { step: Step; i: number }) {
  const x = nodeX(i);
  const cy = BADGE_Y + BADGE_H / 2;
  const slot = (k: number) => x + (NODE_W * (k + 0.5)) / 4;
  const ICON = 30;
  const place = (k: number) => `translate(${slot(k) - ICON / 2} ${cy - ICON / 2}) scale(${ICON / 24})`;

  if (step.badges.kind === "social") {
    const socials = [FacebookIcon, InstagramIcon, LinkedInIcon, WebsiteIcon];
    return (
      <g>
        {socials.map((icon, k) => (
          <g key={k} transform={place(k)}>
            {icon}
          </g>
        ))}
      </g>
    );
  }

  if (step.badges.kind === "profils" || step.badges.kind === "biens") {
    const Glyph = step.badges.kind === "profils" ? ProfileIcon : HomeBadgeIcon;
    return (
      <g>
        {step.badges.etats.map((etat, k) => (
          <g key={k} transform={place(k)}>
            <Glyph badge={etat} />
          </g>
        ))}
      </g>
    );
  }

  return (
    <text x={x + NODE_W / 2} y={cy + 10} textAnchor="middle" fontSize={28} fontWeight={700} fill="#333b46">
      {step.badges.texte}
    </text>
  );
}

export default function FlowDiagram({ titreDebut, titreAccent, steps, phone }: FlowDiagramProps) {
  return (
    <div className="tech-grid relative flex h-full min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-8">
      <div className="animate-fade-in-up relative flex h-full w-full max-w-[1400px] items-center justify-center">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full" role="img">
          <title>{`${titreDebut} ${titreAccent}`}</title>

          <defs>
            <linearGradient id="nodeBlue" x1="0" y1="0" x2="0.65" y2="1">
              <stop offset="0%" stopColor="#5cb0ff" />
              <stop offset="45%" stopColor="#0d7bec" />
              <stop offset="100%" stopColor="#0043a0" />
            </linearGradient>
            <linearGradient id="nodeGreen" x1="0" y1="0" x2="0.65" y2="1">
              <stop offset="0%" stopColor="#4ce08d" />
              <stop offset="45%" stopColor="#13ab5e" />
              <stop offset="100%" stopColor="#046b3c" />
            </linearGradient>
            <linearGradient id="nodeRose" x1="0" y1="0" x2="0.65" y2="1">
              <stop offset="0%" stopColor="#ff93b4" />
              <stop offset="45%" stopColor="#f4356a" />
              <stop offset="100%" stopColor="#a50f42" />
            </linearGradient>
            <linearGradient id="nodeGrey" x1="0" y1="0" x2="0.65" y2="1">
              <stop offset="0%" stopColor="#a4aebd" />
              <stop offset="45%" stopColor="#616c7c" />
              <stop offset="100%" stopColor="#333b46" />
            </linearGradient>
            {/* voile lumineux posé en haut de chaque encart, pour le relief */}
            <linearGradient id="glossGrad" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d9dff" />
              <stop offset="55%" stopColor="#0071e3" />
              <stop offset="100%" stopColor="#0055b4" />
            </linearGradient>
            <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d9dff" />
              <stop offset="100%" stopColor="#0055b4" />
            </linearGradient>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 1 L9 5 L0 9 z" fill="#0071e3" />
            </marker>
            {IconGradients}
            {BadgeGradients}
            {IllustrationGradients}
            {PhoneGradients}
          </defs>

          <text x={VB_W / 2} y={95} textAnchor="middle" fontSize={46} fontWeight={700} fill="#1d1d1f">
            {titreDebut} <tspan fill="url(#titleGrad)">{titreAccent}</tspan>
          </text>

          {/* Liens horizontaux entre les étapes */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              className="flow-link"
              x1={nodeX(i) + NODE_W + 6}
              y1={MID_Y}
              x2={i === 3 ? PHONE_X - 12 : nodeX(i + 1) - 10}
              y2={MID_Y}
              stroke="#0071e3"
              strokeWidth={3}
              strokeLinecap="round"
              markerEnd="url(#arrow)"
            />
          ))}

          {steps.map((step, i) => (
            <FlowNode key={step.n} step={step} i={i} />
          ))}
          {steps.map((step, i) => (
            <StepBadges key={`b${step.n}`} step={step} i={i} />
          ))}
          {steps.map((step, i) => (
            <g key={`i${step.n}`} transform={`translate(${nodeX(i)} ${ILLU_Y})`}>
              {step.illustration}
            </g>
          ))}

          <PhoneFeed titre={phone.titre} label={phone.label} items={phone.items} glyphe={phone.glyphe} />
        </svg>
      </div>
    </div>
  );
}
