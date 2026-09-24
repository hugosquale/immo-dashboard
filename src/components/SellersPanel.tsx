import FlowDiagram, { type Step } from "./FlowDiagram";
import { RobotIcon, WhatsAppIcon, HouseHeartIcon, EyeIcon } from "./StepIcons";
import {
  ScanIllustration,
  NotifIllustration,
  MatchIllustration,
  VisitIllustration,
} from "./StepIllustrations";
import type { FeedItem } from "./PhoneFeed";

const STEPS: Step[] = [
  {
    n: 1,
    grad: "nodeBlue",
    title: "Elle trouve les gens qui veulent acheter dans la zone.",
    body: "Notre IA les repère grâce à ce qu'ils font en ligne, en croisant plus de 2 000 données (recherches, comportement…).",
    icon: RobotIcon,
    badges: { kind: "social" },
    illustration: <ScanIllustration />,
  },
  {
    n: 2,
    grad: "nodeGreen",
    title: "Elle nous envoie les meilleurs acheteurs.",
    body: "On reçoit une notification pour chaque acheteur qualifié.",
    icon: WhatsAppIcon,
    badges: { kind: "profils", etats: ["check", "check", "cross", "check"] },
    illustration: <NotifIllustration />,
  },
  {
    n: 3,
    grad: "nodeRose",
    title: "On regarde qui aime votre bien",
    body: "On compare votre bien avec tous ces acheteurs, et on garde ceux pour qui il est parfait.",
    icon: HouseHeartIcon,
    badges: { kind: "profils", etats: ["none", "heart", "none", "none"] },
    illustration: <MatchIllustration />,
  },
  {
    n: 4,
    grad: "nodeGrey",
    title: "On les fait visiter",
    body: "On invite ces acheteurs à venir voir votre bien, parfois avant même que l'annonce soit en ligne.",
    icon: EyeIcon,
    badges: { kind: "texte", texte: "C'est vendu !" },
    illustration: <VisitIllustration />,
  },
];

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

export default function SellersPanel() {
  return (
    <FlowDiagram
      titreDebut="Les bons acheteurs"
      titreAccent="trouvés grâce à notre IA"
      steps={STEPS}
      phone={{ titre: "Nouveaux acheteurs", label: "NOUVEL ACHETEUR QUALIFIÉ", items: ACHETEURS }}
    />
  );
}
