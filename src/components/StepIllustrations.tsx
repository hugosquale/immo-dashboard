/* Illustrations dessinées sous chaque étape.
   Chacune occupe un <svg> imbriqué de 293 × 210, donc les coordonnées
   ci-dessous sont locales et indépendantes de la position dans le schéma. */

const W = 293;
const H = 210;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="19" fill="url(#illuBg)" stroke="#cfe4ff" strokeWidth="1.5" />
      {children}
    </>
  );
}

/** 1 — Un radar qui balaie et repère des acheteurs. */
export function ScanIllustration({ label = "SCAN DE LA ZONE" }: { label?: string } = {}) {
  const cx = 146;
  const cy = 100;
  const dots: Array<[number, number, boolean]> = [
    [96, 62, false],
    [198, 70, true],
    [116, 144, true],
    [208, 138, false],
    [146, 40, false],
    [72, 108, true],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={275} height={(275 * H) / W}>
      <Frame>
        {[34, 58, 82].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#c3ddff" strokeWidth="1.3" />
        ))}
        <path d={`M${cx - 88} ${cy}h176M${cx} ${cy - 88}v176`} stroke="#dbeaff" strokeWidth="1.1" />

        {/* faisceau qui tourne */}
        <g className="radar-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path d={`M${cx} ${cy} L${cx} ${cy - 82} A82 82 0 0 1 ${cx + 71} ${cy - 41} Z`} fill="url(#sweepGrad)" />
        </g>

        {dots.map(([dx, dy, hot], k) =>
          hot ? (
            <g key={k}>
              <circle cx={dx} cy={dy} r="10" fill="#0d7bec" opacity="0.18" />
              <circle cx={dx} cy={dy} r="5.5" fill="#0d7bec" stroke="#ffffff" strokeWidth="1.6" />
            </g>
          ) : (
            <circle key={k} cx={dx} cy={dy} r="4" fill="#b9c7d8" />
          )
        )}

        <circle cx={cx} cy={cy} r="5" fill="#0043a0" />
        <text x={cx} y={193} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0071e3" letterSpacing="2">
          {label}
        </text>
      </Frame>
    </svg>
  );
}

/** 2 — Deux notifications WhatsApp d'acheteurs trouvés. */
export interface NotifCard {
  titre: string;
  detail: string;
  badge: boolean;
}

const NOTIF_DEFAUT: NotifCard[] = [
  { titre: "Nouvel acheteur trouvé", detail: "Montbrison · budget 320 000 €", badge: true },
  { titre: "Acheteur qualifié", detail: "Saint-Étienne · prêt validé", badge: false },
];

export function NotifIllustration({ items = NOTIF_DEFAUT }: { items?: NotifCard[] } = {}) {
  const cards = items.slice(0, 2).map((c, k) => ({ ...c, y: 30 + k * 80 }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={275} height={(275 * H) / W}>
      <Frame>
        {cards.map((c) => (
          <g key={c.y}>
            <rect x="18" y={c.y} width="257" height="68" rx="16" fill="#ffffff" stroke="#dbe7f5" strokeWidth="1.4" />
            <circle cx="52" cy={c.y + 34} r="18" fill="url(#waGrad)" />
            {/* combiné, centré dans la pastille : la glyphe tient dans une boîte 0–24,
                on la recale donc sur son centre avant de l'agrandir */}
            <g transform={`translate(${52 - 14.4} ${c.y + 34 - 12.1}) scale(1.2)`}>
              <path
                d="M6.6 3.5h3l1.5 3.7-1.9 1.1a11 11 0 0 0 4.9 4.9l1.1-1.9 3.7 1.5v3a1.65 1.65 0 0 1-1.75 1.6A14.6 14.6 0 0 1 5 5.25 1.65 1.65 0 0 1 6.6 3.5Z"
                fill="#ffffff"
              />
            </g>
            {c.badge && <circle cx="66" cy={c.y + 20} r="6.5" fill="#ff3b30" stroke="#ffffff" strokeWidth="1.6" />}
            <text x="84" y={c.y + 29} fontSize="14" fontWeight="700" fill="#1d1d1f">
              {c.titre}
            </text>
            <text x="84" y={c.y + 48} fontSize="12" fill="#6e6e73">
              {c.detail}
            </text>
          </g>
        ))}
      </Frame>
    </svg>
  );
}

/** 3 — Le bien et l'acheteur qui « matchent », façon appli de rencontre. */
export function MatchIllustration({
  gaucheLabel = "Votre bien",
  droiteLabel = "Acheteur",
  gauche = "maison",
}: { gaucheLabel?: string; droiteLabel?: string; gauche?: "maison" | "profil" } = {}) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={275} height={(275 * H) / W}>
      <Frame>
        {/* carte du bien */}
        <rect x="24" y="36" width="104" height="122" rx="18" fill="#eaf3ff" stroke="#bcd9ff" strokeWidth="1.5" />
        {gauche === "maison" ? (
          <g transform="translate(52 66) scale(2.1)" stroke="#0071e3" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.4 10 12 2.6 21.6 10" />
            <path d="M4.8 8.6V19h14.4V8.6" />
            <rect x="10" y="13" width="4" height="6" />
          </g>
        ) : (
          <g fill="#0071e3">
            <circle cx="76" cy="80" r="15" />
            <path d="M53 122c0-12.7 10.3-23 23-23s23 10.3 23 23Z" />
          </g>
        )}
        <text x="76" y="146" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#0071e3">
          {gaucheLabel}
        </text>

        {/* carte de l'acheteur */}
        <rect x="165" y="36" width="104" height="122" rx="18" fill="#f4f7fb" stroke="#d3dfec" strokeWidth="1.5" />
        {gauche === "maison" ? (
          <g fill="#8e99a8">
            <circle cx="217" cy="80" r="15" />
            <path d="M194 122c0-12.7 10.3-23 23-23s23 10.3 23 23Z" />
          </g>
        ) : (
          <g transform="translate(193 66) scale(2.1)" stroke="#6e6e73" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.4 10 12 2.6 21.6 10" />
            <path d="M4.8 8.6V19h14.4V8.6" />
            <rect x="10" y="13" width="4" height="6" />
          </g>
        )}
        <text x="217" y="146" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#6e6e73">
          {droiteLabel}
        </text>

        {/* cœur du match */}
        <circle cx="146.5" cy="97" r="29" fill="#ffffff" stroke="#f4356a" strokeWidth="2" />
        <path
          d="M146.5 111c-10.5-7.2-16.5-12.6-16.5-19.3a8.7 8.7 0 0 1 16.5-3.6 8.7 8.7 0 0 1 16.5 3.6c0 6.7-6 12.1-16.5 19.3Z"
          fill="#f4356a"
        />
        <text x="146.5" y="190" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f4356a" letterSpacing="3">
          MATCH
        </text>
      </Frame>
    </svg>
  );
}

/** 4 — L'agent fait visiter le bien à l'acheteur. */
export function VisitIllustration({ label = "VISITE DU BIEN" }: { label?: string } = {}) {
  const ground = 178;
  const person = (cx: number, color: string, headColor: string) => (
    <>
      <path d={`M${cx - 23} ${ground}v-30a23 23 0 0 1 46 0v30Z`} fill={color} />
      <circle cx={cx} cy={ground - 46} r="15" fill={headColor} />
    </>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={275} height={(275 * H) / W}>
      <Frame>
        {/* la maison, en arrière-plan */}
        <path d="M58 92 146.5 30 235 92" stroke="#bcd9ff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="76" y="88" width="141" height="90" rx="6" fill="#f0f6ff" stroke="#cfe4ff" strokeWidth="1.5" />
        <rect x="96" y="112" width="30" height="26" rx="4" fill="#dbeaff" stroke="#bcd9ff" strokeWidth="1.2" />
        <rect x="170" y="112" width="30" height="26" rx="4" fill="#dbeaff" stroke="#bcd9ff" strokeWidth="1.2" />

        {/* sol */}
        <path d={`M30 ${ground}h233`} stroke="#cfe4ff" strokeWidth="2.5" strokeLinecap="round" />

        {/* l'agent, avec sa pochette */}
        {person(112, "#0d7bec", "#f0c9a4")}
        <rect x="128" y="138" width="20" height="26" rx="3" fill="#ffffff" stroke="#0043a0" strokeWidth="1.5" />
        <path d="M132 146h12M132 152h12" stroke="#0043a0" strokeWidth="1.4" strokeLinecap="round" />

        {/* l'acheteur */}
        {person(188, "#8e99a8", "#e8b894")}

        <text x={146.5} y={200} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0071e3" letterSpacing="1.5">
          {label}
        </text>
      </Frame>
    </svg>
  );
}

/** Dégradés propres aux illustrations. */
export const IllustrationGradients = (
  <>
    <linearGradient id="illuBg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="100%" stopColor="#f2f8ff" />
    </linearGradient>
    <linearGradient id="sweepGrad" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stopColor="#0d7bec" stopOpacity="0.45" />
      <stop offset="100%" stopColor="#0d7bec" stopOpacity="0" />
    </linearGradient>
  </>
);
