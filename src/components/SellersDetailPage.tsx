import type { ReactNode } from "react";

/* Version détaillée des 4 étapes du schéma "Chers vendeurs", pour les
   personnes qui veulent plus d'exemples et de détail. Mêmes profils
   fictifs que la maquette d'origine — exemples illustratifs, données
   fictives, comme rappelé en bas de chaque section. */

const GRAD = {
  bleu: "linear-gradient(145deg, #5cb0ff 0%, #0d7bec 45%, #0043a0 100%)",
  vert: "linear-gradient(145deg, #4ce08d 0%, #13ab5e 45%, #046b3c 100%)",
  rose: "linear-gradient(145deg, #ff93b4 0%, #f4356a 45%, #a50f42 100%)",
  gris: "linear-gradient(145deg, #a4aebd 0%, #616c7c 45%, #333b46 100%)",
};

function Puce({ children, ton = "neutre" }: { children: ReactNode; ton?: "neutre" | "vert" | "bleu" | "rouge" }) {
  const classes = {
    neutre: "bg-[var(--surface-2)] text-[var(--muted)]",
    vert: "bg-[var(--accent-green-soft)] text-[var(--accent-green)]",
    bleu: "bg-[var(--accent-blue-soft)] text-[var(--accent-blue)]",
    rouge: "bg-[var(--danger-soft)] text-[var(--danger)]",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes[ton]}`}>{children}</span>
  );
}

function EtapeHeader({ n, grad, titre, accent }: { n: number; grad: string; titre: string; accent: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.4)]"
        style={{ background: grad }}
      >
        {n}
      </span>
      <h2 className="text-xl font-bold leading-snug tracking-tight text-[var(--foreground)] sm:text-2xl">
        {titre} <span className="text-[var(--accent-blue)]">{accent}</span>
      </h2>
    </div>
  );
}

function Carte({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`card-lift rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Icônes simples, auto-suffisantes ---------- */

function IconLoupe() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" />
    </svg>
  );
}
function IconMaison() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11 12 3.8 20.5 11" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}
function IconEuro() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 8.3a4 4 0 1 0 0 7.4M8 11h6M8 13.5h5" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="12" cy="12" r="10" opacity="0.12" />
      <path d="M14.6 12.6h2.1l.4-2.9h-2.5V7.9c0-.8.3-1.4 1.5-1.4h1.1V3.9c-.6-.1-1.4-.2-2.2-.2-2.3 0-3.8 1.4-3.8 3.9v2.1H8.8v2.9h2.4v7.4h3.4v-7.4Z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.3" cy="7.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="7.1" cy="7.2" r="1.7" />
      <rect x="5.7" y="10" width="2.8" height="8.4" rx="0.5" />
      <path d="M11 10h2.7v1.2a3 3 0 0 1 2.6-1.4c2 0 3.2 1.3 3.2 3.7v4.9h-2.8v-4.4c0-1.1-.4-1.8-1.4-1.8-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8v4.3H11V10Z" />
    </svg>
  );
}
function IconCalendrier() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

function Activite({
  icone,
  titre,
  source,
  temps,
}: {
  icone: ReactNode;
  titre: string;
  source: string;
  temps: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-blue-soft)] text-[var(--accent-blue)]">
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">{titre}</p>
        <p className="text-xs text-[var(--muted)]">{source}</p>
      </div>
      <span className="shrink-0 text-xs text-[var(--muted-2)]">{temps}</span>
    </div>
  );
}

/* ---------- Étape 1 ---------- */

function SectionEtape1() {
  return (
    <section>
      <EtapeHeader n={1} grad={GRAD.bleu} titre="Elle trouve les gens qui veulent acheter" accent="dans la zone" />
      <p className="mb-6 text-[15px] leading-relaxed text-[var(--muted)]">
        Elle les repère grâce à ce qu&apos;ils font en ligne, en croisant plus de 2 000 données.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[var(--muted-2)]">
            Ce qu&apos;ils font en ligne
          </p>
          <div className="flex flex-col gap-2">
            <Activite icone={<IconLoupe />} titre="Recherche « maison 220 m² Montbrison »" source="14 fois en 10 jours" temps="il y a 2 h" />
            <Activite icone={<IconMaison />} titre="Consulte 23 annonces de maisons 200–230 m²" source="Portails immobiliers" temps="hier" />
            <Activite icone={<IconEuro />} titre="Simule un prêt à 330 000 €" source="Simulateur de crédit en ligne" temps="hier" />
            <Activite icone={<IconFacebook />} titre={'Rejoint le groupe « Vivre à Montbrison »'} source="Facebook" temps="il y a 3 j" />
            <Activite icone={<IconInstagram />} titre={'Enregistre 9 posts « maison avec jardin »'} source="Instagram" temps="il y a 4 j" />
            <Activite icone={<IconLinkedIn />} titre="Nouveau poste à Saint-Étienne" source="LinkedIn · depuis septembre" temps="il y a 6 sem." />
          </div>
          <div className="mt-4 rounded-xl border border-[var(--accent-blue)]/20 bg-[var(--accent-blue-soft)] px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[var(--accent-blue)]">2 000+</p>
            <p className="text-xs text-[var(--muted)]">données croisées pour chaque profil</p>
          </div>
        </div>

        <Carte className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Puce ton="vert">✓ Acheteur détecté</Puce>
            <span className="text-xs text-[var(--muted)]">Montbrison · zone couverte</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue)] text-sm font-bold text-white">
              CP
            </span>
            <div>
              <p className="text-base font-bold text-[var(--foreground)]">Camille Perrot</p>
              <p className="text-xs text-[var(--muted)]">34 ans · vit à Saint-Étienne</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--muted-2)]">Projet</p>
              <p className="font-semibold text-[var(--foreground)]">Maison</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--muted-2)]">Surface</p>
              <p className="font-semibold text-[var(--foreground)]">220 m²</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--muted-2)]">Budget</p>
              <p className="font-semibold text-[var(--foreground)]">330 000 €</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-[var(--muted-2)]">Zone</p>
              <p className="font-semibold text-[var(--foreground)]">Montbrison +15 km</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
            <span className="text-2xl font-bold text-[var(--accent-blue)]">94</span>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">Intention d&apos;achat très forte</p>
              <div className="mt-1 flex gap-1.5">
                <Puce ton="bleu">Recherche active</Puce>
                <Puce ton="vert">Prêt simulé</Puce>
              </div>
            </div>
          </div>
        </Carte>
      </div>
    </section>
  );
}

/* ---------- Étape 2 ---------- */

function CarteMatch({ nom, ville, cherche, budget, pourcentage, tags }: { nom: string; ville: string; cherche: string; budget: string; pourcentage: number; tags: string[] }) {
  return (
    <Carte className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-bold text-[var(--foreground)]">{nom}</p>
        <p className="text-xs text-[var(--muted)]">Acheteur·se · {ville}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-[var(--muted-2)]">Recherche</p>
        <p className="text-lg font-bold text-[var(--foreground)]">{cherche}</p>
        <p className="text-xs text-[var(--muted)]">{budget}</p>
      </div>
      <div className="rounded-xl bg-[var(--accent-green-soft)] px-3 py-2 text-center text-sm font-bold text-[var(--accent-green)]">
        ✓ {pourcentage} % de correspondance
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Puce key={t}>{t}</Puce>
        ))}
      </div>
    </Carte>
  );
}

function SectionEtape2() {
  return (
    <section>
      <EtapeHeader n={2} grad={GRAD.vert} titre="Elle envoie à l'agence" accent="les meilleurs acheteurs" />
      <p className="mb-6 text-[15px] leading-relaxed text-[var(--muted)]">
        Des gens qui cherchent exactement le bien du vendeur, ou ce qui s&apos;en rapproche le plus.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <CarteMatch nom="Camille Perrot" ville="Montbrison" cherche="220 m²" budget="Maison · budget 330 000 €" pourcentage={98} tags={["Montbrison", "4 chambres", "Jardin"]} />
        <CarteMatch nom="Julien Marchand" ville="Saint-Étienne" cherche="200 m²" budget="Maison · budget 315 000 €" pourcentage={89} tags={["Zone élargie", "Budget OK", "Un peu plus grand"]} />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0d1015]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-green)] text-white">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3.6 5.4-4 4-2-2 .9-.9 1.1 1.1 3.1-3.1.9.9Z" /></svg>
          </span>
          <p className="text-xs font-semibold text-white/80">WhatsApp · Squale AI</p>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="rounded-xl bg-[#1d222b] p-3">
            <p className="text-sm font-semibold text-white">🏡 Nouvel acheteur trouvé</p>
            <p className="mt-1 text-xs text-white/70">Camille Perrot · Montbrison — cherche 220 m² · budget 330 000 €</p>
            <p className="mt-1 text-xs font-semibold text-[var(--accent-green)]">✅ Correspond à votre mandat (98 %)</p>
          </div>
          <div className="rounded-xl bg-[#1d222b] p-3">
            <p className="text-sm font-semibold text-white">🏡 Nouvel acheteur trouvé</p>
            <p className="mt-1 text-xs text-white/70">Julien Marchand · 200 m² · 315 000 €</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Étape 3 ---------- */

const PROFILS_ETAPE_3: Array<{
  init: string;
  nom: string;
  bien: string;
  profil: string;
  financement: string;
  budget: string;
  match: number;
  statut: "ok" | "attente" | "non";
}> = [
  { init: "CP", nom: "Camille Perrot", bien: "Maison 220 m²", profil: "Couple", financement: "Prêt validé", budget: "330 000 €", match: 98, statut: "ok" },
  { init: "JM", nom: "Julien Marchand", bien: "Maison 200 m²", profil: "Seul", financement: "Prêt validé", budget: "315 000 €", match: 89, statut: "ok" },
  { init: "TL", nom: "Thomas Lefèvre", bien: "Maison 210 m²", profil: "Famille", financement: "Apport 85 k€", budget: "325 000 €", match: 86, statut: "ok" },
  { init: "SB", nom: "Sofia Bensaïd", bien: "Maison 215 m²", profil: "Couple", financement: "En cours", budget: "340 000 €", match: 84, statut: "attente" },
  { init: "LF", nom: "Léa Fontaine", bien: "Maison 190 m²", profil: "Seule", financement: "Non financé", budget: "300 000 €", match: 71, statut: "non" },
  { init: "MD", nom: "Marc Delaunay", bien: "Maison 230 m²", profil: "Couple", financement: "Hors zone", budget: "310 000 €", match: 52, statut: "non" },
];

function SectionEtape3() {
  return (
    <section>
      <EtapeHeader n={3} grad={GRAD.rose} titre="On regarde" accent="qui aime votre bien" />
      <p className="mb-6 text-[15px] leading-relaxed text-[var(--muted)]">
        Qui est solvable, qui a son financement, couple ou seul… puis on fait matcher.
      </p>

      <div className="grid gap-5 lg:grid-cols-[180px_1fr_220px]">
        <div className="flex flex-row gap-3 lg:flex-col">
          {[
            { n: 12, label: "acheteurs détectés", ton: "gris" as const },
            { n: 8, label: "dans la zone et le budget", ton: "bleu" as const },
            { n: 5, label: "financement validé", ton: "vert" as const },
            { n: 3, label: "match parfait", ton: "rose" as const },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-2xl p-4 text-white"
              style={{ background: s.ton === "gris" ? GRAD.gris : s.ton === "bleu" ? GRAD.bleu : s.ton === "vert" ? GRAD.vert : GRAD.rose }}
            >
              <p className="text-2xl font-bold">{s.n}</p>
              <p className="text-xs opacity-90">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wide text-[var(--muted-2)]">
                <th className="px-4 py-3 font-semibold">Acheteur</th>
                <th className="px-3 py-3 font-semibold">Financement</th>
                <th className="px-3 py-3 font-semibold">Budget</th>
                <th className="px-3 py-3 font-semibold">Match</th>
              </tr>
            </thead>
            <tbody>
              {PROFILS_ETAPE_3.map((p) => (
                <tr key={p.init} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[var(--foreground)]">{p.nom}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {p.bien} · {p.profil}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <Puce ton={p.financement === "Prêt validé" ? "vert" : p.financement === "En cours" ? "bleu" : "rouge"}>
                      {p.financement}
                    </Puce>
                  </td>
                  <td className="px-3 py-3 text-[var(--foreground)]">{p.budget}</td>
                  <td className="px-3 py-3">
                    <span className={`font-bold ${p.statut === "ok" ? "text-[var(--accent-green)]" : p.statut === "attente" ? "text-[var(--warning)]" : "text-[var(--danger)]"}`}>
                      {p.match} %
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Carte className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue)]">
              <IconMaison />
            </span>
            <svg viewBox="0 0 16 16" className="h-5 w-5 text-[var(--danger)]" fill="currentColor"><path d="M8 14c-3-2-5-3.8-5-6.1A2.9 2.9 0 0 1 8 6.3a2.9 2.9 0 0 1 5 1.6c0 2.3-2 4.1-5 6.1Z" /></svg>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-blue)] text-sm font-bold text-white">
              CP
            </span>
          </div>
          <p className="text-3xl font-bold text-[var(--danger)]">98 %</p>
          <ul className="flex flex-col gap-1.5 text-left text-xs text-[var(--foreground)]">
            <li>✓ 220 m² voulus · 225 m² dispo</li>
            <li>✓ Budget 330 000 € couvre le prix</li>
            <li>✓ Prêt déjà validé</li>
            <li>✓ Projet immédiat, couple</li>
          </ul>
        </Carte>
      </div>
    </section>
  );
}

/* ---------- Étape 4 ---------- */

function SectionEtape4() {
  return (
    <section>
      <EtapeHeader n={4} grad={GRAD.gris} titre="On" accent="les fait visiter" />
      <p className="mb-6 text-[15px] leading-relaxed text-[var(--muted)]">
        Des acheteurs déjà qualifiés : parfois avant même que l&apos;annonce soit en ligne.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <Carte className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <IconCalendrier /> Samedi 31 octobre
          </div>
          <p className="text-xs text-[var(--muted)]">Visites organisées · Maison 225 m², Montbrison</p>
          {[
            { h: "10:00", nom: "Camille Perrot", d: "Couple · prêt validé" },
            { h: "11:00", nom: "Julien Marchand", d: "Seul · prêt validé" },
            { h: "14:30", nom: "Thomas Lefèvre", d: "Famille · apport 85 k€" },
          ].map((v) => (
            <div key={v.h} className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--foreground)]">{v.h}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{v.nom}</p>
                  <p className="text-xs text-[var(--muted)]">{v.d}</p>
                </div>
              </div>
              <Puce ton="vert">✓ Confirmée</Puce>
            </div>
          ))}
        </Carte>

        <Carte>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[var(--muted-2)]">Pourquoi ça transforme</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <p className="font-semibold text-[var(--foreground)]">Budget déjà validé</p>
              <p className="text-xs text-[var(--muted)]">Pas de visite « pour voir »</p>
            </li>
            <li>
              <p className="font-semibold text-[var(--foreground)]">Un projet qui colle au bien</p>
              <p className="text-xs text-[var(--muted)]">Surface, zone, critères</p>
            </li>
            <li>
              <p className="font-semibold text-[var(--foreground)]">Une envie déjà confirmée</p>
              <p className="text-xs text-[var(--muted)]">Avant même d&apos;entrer</p>
            </li>
            <li>
              <p className="font-semibold text-[var(--foreground)]">Visite en avant-première</p>
              <p className="text-xs text-[var(--muted)]">Sans attendre la mise en ligne</p>
            </li>
          </ul>
        </Carte>
      </div>

      <div className="mt-5 flex items-center justify-between overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5">
        {["Visite", "Offre", "Compromis", "C'est vendu !"].map((etape, i, arr) => (
          <div key={etape} className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
                  i === arr.length - 1 ? "bg-[var(--danger)]" : "bg-[var(--accent-green)]"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-xs font-semibold text-[var(--foreground)]">{etape}</span>
            </div>
            {i < arr.length - 1 && <span className="h-0.5 w-10 bg-[var(--border-strong)] sm:w-16" />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SellersDetailPage() {
  return (
    <div className="tech-grid relative min-h-full flex-1">
      <div className="relative mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="stagger-children flex flex-col gap-16">
          <SectionEtape1 />
          <SectionEtape2 />
          <SectionEtape3 />
          <SectionEtape4 />
        </div>

        <div className="glow-card animate-fade-in-up mt-16">
          <div className="rounded-[23px] bg-gradient-to-br from-[#0a84ff] via-[#0071e3] to-[#0050ab] px-8 py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Résultat</p>
            <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">C&apos;est vendu !</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
              Les bons acheteurs, repérés, qualifiés et amenés jusqu&apos;à la visite.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--muted-2)]">Exemples illustratifs · données fictives</p>
      </div>
    </div>
  );
}
