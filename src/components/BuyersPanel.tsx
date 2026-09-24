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
    title: "Elle trouve les biens qui vont se vendre dans la zone.",
    body: "Notre IA repère les propriétaires prêts à vendre, en croisant plus de 2 000 données (estimations, signaux…).",
    icon: RobotIcon,
    badges: { kind: "social" },
    illustration: <ScanIllustration label="SCAN DES BIENS" />,
  },
  {
    n: 2,
    grad: "nodeGreen",
    title: "Elle nous envoie les meilleurs biens.",
    body: "On reçoit une notification pour chaque bien qui entre dans votre budget.",
    icon: WhatsAppIcon,
    badges: { kind: "biens", etats: ["check", "check", "cross", "check"] },
    illustration: (
      <NotifIllustration
        items={[
          { titre: "Nouveau bien détecté", detail: "Montbrison · maison 120 m²", badge: true },
          { titre: "Bien à vendre bientôt", detail: "Saint-Étienne · 295 000 €", badge: false },
        ]}
      />
    ),
  },
  {
    n: 3,
    grad: "nodeRose",
    title: "On garde ceux qui collent à vos critères",
    body: "On compare chaque bien à votre projet, et on ne retient que ceux qui cochent vraiment toutes vos cases.",
    icon: HouseHeartIcon,
    badges: { kind: "biens", etats: ["none", "heart", "none", "none"] },
    illustration: <MatchIllustration gauche="profil" gaucheLabel="Vos critères" droiteLabel="Le bien" />,
  },
  {
    n: 4,
    grad: "nodeGrey",
    title: "On vous les fait visiter",
    body: "On vous emmène voir ces biens, parfois avant même que l'annonce soit en ligne.",
    icon: EyeIcon,
    badges: { kind: "texte", texte: "C'est acheté !" },
    illustration: <VisitIllustration label="VOTRE VISITE" />,
  },
];

const BIENS: FeedItem[] = [
  { nom: "Maison 120 m²", souhait: "Montbrison · 320 000 € · 4 ch.", etat: "valide" },
  { nom: "Appartement 78 m²", souhait: "Saint-Étienne · 245 000 € · balcon", etat: "valide" },
  { nom: "Maison 145 m²", souhait: "Sury-le-Comtal · 398 000 € · piscine", etat: "neutre" },
  { nom: "Appartement 85 m²", souhait: "Andrézieux · 268 000 € · garage", etat: "valide" },
  { nom: "Maison 110 m²", souhait: "Boën-sur-Lignon · hors secteur", etat: "refuse" },
  { nom: "Maison 160 m²", souhait: "Savigneux · 455 000 € · terrain", etat: "valide" },
  { nom: "Appartement 62 m²", souhait: "Montbrison · 189 000 € · à revoir", etat: "neutre" },
  { nom: "Maison 132 m²", souhait: "Champdieu · 342 000 € · rénovée", etat: "valide" },
];

export default function BuyersPanel() {
  return (
    <FlowDiagram
      titreDebut="Les bons vendeurs"
      titreAccent="trouvés grâce à notre IA"
      steps={STEPS}
      phone={{ titre: "Nouveaux biens", label: "NOUVEAU BIEN DISPONIBLE", items: BIENS, glyphe: "bien" }}
    />
  );
}
