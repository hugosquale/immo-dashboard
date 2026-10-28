/* Détail de "Chers vendeurs" : les slides originales du support, telles
   quelles (pages 2 à 6 du PDF — la page 1 est omise car elle duplique ce
   qui est déjà affiché sur l'écran principal). */

const SLIDES = [
  { src: "/vendeurs-detail/slide-2.png", alt: "Étape 1 sur 4 — Elle trouve les gens qui veulent acheter dans la zone" },
  { src: "/vendeurs-detail/slide-3.png", alt: "Étape 2 sur 4 — Elle envoie à l'agence les meilleurs acheteurs" },
  { src: "/vendeurs-detail/slide-4.png", alt: "Étape 3 sur 4 — On regarde qui aime votre bien" },
  { src: "/vendeurs-detail/slide-5.png", alt: "Étape 4 sur 4 — On les fait visiter" },
  { src: "/vendeurs-detail/slide-6.png", alt: "C'est vendu !" },
];

export default function SellersDetailPage() {
  return (
    <div className="tech-grid relative min-h-full flex-1">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="animate-fade-in-up overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--card-shadow)]"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.src} alt={slide.alt} className="block w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
