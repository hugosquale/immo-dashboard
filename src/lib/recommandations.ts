/* Contenu des fiches « Recommandation Squale ».
   Séparé du rendu pour que les textes restent faciles à relire et à modifier. */

export type Bloc =
  | { type: "liste"; icone: string; titre: string; items: string[] }
  | { type: "etapes"; icone: string; titre: string; items: string[] }
  | { type: "citations"; icone: string; titre: string; items: string[] }
  | { type: "eviter"; icone: string; titre: string; items: string[] }
  | { type: "qr"; icone: string; titre: string; items: { q: string; r: string }[] }
  | { type: "encadre"; icone: string; titre: string; texte: string }
  | { type: "script"; icone: string; titre: string; texte: string; note?: string };

export interface Fiche {
  cle: string;
  /** Ce qui s'affiche entre parenthèses après « Recommandations Squale ». */
  onglet: string;
  /** Version abrégée, utilisée dans la barre tant que l'onglet n'est pas actif. */
  ongletCourt: string;
  titre: string;
  accroche: string;
  blocs: Bloc[];
}

export const FICHES: Fiche[] = [
  {
    cle: "reco-appel",
    onglet: "Appelez le vendeur",
    ongletCourt: "Appelez…",
    titre: "Appelez le vendeur",
    accroche: "Règles d'appel — nouveau vendeur",
    blocs: [
      {
        type: "liste",
        icone: "⏱",
        titre: "Réactivité",
        items: [
          "Rappelez dans les minutes qui suivent la notification WhatsApp. Si vous êtes en rendez-vous, rappelez juste après.",
          "Plus vous attendez, moins le vendeur se souvient du formulaire qu'il a rempli, et plus il est froid.",
        ],
      },
      {
        type: "liste",
        icone: "📋",
        titre: "Avant d'appeler (30 secondes)",
        items: [
          "Relisez la notification : nom, prénom, type de bien, localisation.",
          "Le vendeur a déjà indiqué qu'il a un projet de vente à moins de 6 mois, qu'il est intéressé par votre approche et qu'il souhaite être appelé. Vous n'êtes pas en démarchage à froid.",
        ],
      },
      {
        type: "liste",
        icone: "🔁",
        titre: "Si pas de réponse",
        items: [
          "Rappelez 2 à 3 fois sur 48 h, à des horaires différents (midi, fin de journée).",
          "Laissez ensuite un SMS court : « Bonjour [Prénom], [Votre prénom] de [Agence], vous avez demandé à être rappelé pour votre projet de vente. Quand êtes-vous disponible ? »",
        ],
      },
      {
        type: "liste",
        icone: "🎯",
        titre: "Objectif de l'appel",
        items: [
          "Pas de vente par téléphone. Objectif : confirmer le projet, qualifier rapidement et fixer un rendez-vous physique (estimation).",
        ],
      },
      {
        type: "liste",
        icone: "✅",
        titre: "Après l'appel",
        items: ["Notez le résultat (RDV pris, à rappeler, pas de projet) pour garder une trace."],
      },
      {
        type: "script",
        icone: "📞",
        titre: "Script d'ouverture",
        texte:
          "Bonjour [Prénom], [Votre prénom] de [Agence] à [Ville]. Vous avez rempli un formulaire en ligne il y a peu parce que vous envisagez de vendre votre [type de bien] à [localisation], et vous avez souhaité être rappelé. J'ai bien le bon moment ?",
        note: "Suite de l'appel : se référer au discours de différenciation qui vous sera communiqué.",
      },
    ],
  },
  {
    cle: "reco-discours",
    onglet: "Discours différenciant IA",
    ongletCourt: "Discours…",
    titre: "Discours différenciant IA",
    accroche: "Discours à adopter — vendeur",
    blocs: [
      {
        type: "script",
        icone: "🎯",
        titre: "Message clé",
        texte:
          "Notre agence a intégré l'IA en interne pour trouver des acheteurs plus rapidement et plus efficacement.",
      },
      {
        type: "liste",
        icone: "💪",
        titre: "Ce que vous devez faire passer",
        items: [
          "Vous n'êtes pas une agence qui attend que les acheteurs arrivent : vous les recherchez activement grâce à l'IA.",
          "Vous combinez la technologie ET votre expertise terrain. L'IA trouve, vous accompagnez.",
          "Vous vous démarquez des agences qui travaillent comme il y a 10 ans.",
        ],
      },
      {
        type: "citations",
        icone: "💬",
        titre: "Formulations à utiliser",
        items: [
          "Nous utilisons l'IA pour identifier des acheteurs qui cherchent exactement ce type de bien.",
          "L'IA nous permet d'aller chercher des acheteurs, pas seulement d'attendre qu'ils appellent.",
          "Vous bénéficiez de la technologie, mais vous gardez un interlocuteur humain qui connaît votre quartier.",
        ],
      },
      {
        type: "eviter",
        icone: "🚫",
        titre: "À éviter",
        items: [
          "Le jargon technique (algorithme, data, scraping…).",
          "Promettre un délai ou un prix de vente garanti.",
          "Dénigrer les autres agences. Contentez-vous de dire ce que vous faites de différent.",
        ],
      },
      {
        type: "encadre",
        icone: "💡",
        titre: "Pourquoi ça marche",
        texte:
          "Les vendeurs sont friands des agences qui intègrent l'IA : cela rassure, rend l'agence moderne et donne confiance dans sa capacité à trouver un acheteur vite. Utilisez-le systématiquement, à chaque appel et à chaque rendez-vous, en plus de votre propre expertise.",
      },
    ],
  },
  {
    cle: "reco-rdv",
    onglet: "Rendez-vous physique",
    ongletCourt: "Rendez-vous…",
    titre: "Rendez-vous physique",
    accroche: "Rendez-vous vendeur — ce qu'il faut prévoir",
    blocs: [
      {
        type: "liste",
        icone: "🧰",
        titre: "À préparer avant",
        items: [
          "Une étude de marché locale : prix au m² récents dans le quartier, ventes comparables, délais de vente.",
          "Votre présentation d'agence (méthode, résultats, avis clients).",
          "Le guide « Comment l'IA trouve votre acheteur » fourni par Squale, en version imprimée ou sur tablette.",
          "Votre Squale Assistant, ouvert sur les onglets « Chers vendeurs » et « Chers acheteurs », prêt à être montré en direct.",
        ],
      },
      {
        type: "etapes",
        icone: "🖥",
        titre: "À montrer",
        items: [
          "Comment fonctionne la recherche d'acheteurs : l'IA identifie des acheteurs potentiels, ils sont qualifiés (projet, budget, secteur, délai), puis vous les recevez.",
          "L'onglet « Chers vendeurs » du Squale Assistant : pour montrer au vendeur, concrètement, comment on trouve l'acheteur de son bien.",
          "L'onglet « Chers acheteurs » : pour montrer que des acheteurs qualifiés existent déjà et sont recherchés activement.",
          "Votre plan d'action pour SON bien : où il sera diffusé, quel profil d'acheteur est visé, quel suivi vous lui proposez.",
        ],
      },
      {
        type: "etapes",
        icone: "🪜",
        titre: "Déroulé conseillé",
        items: [
          "Visite du bien et écoute du projet (motivations, délai, attentes).",
          "Présentation de votre méthode + démonstration via les onglets « Chers vendeurs » et « Chers acheteurs ».",
          "Estimation argumentée (avec les comparables).",
          "Proposition de mandat et prochaines étapes.",
        ],
      },
      {
        type: "encadre",
        icone: "🎯",
        titre: "Objectif",
        texte: "Repartir avec un mandat signé, ou une date précise de décision et de rappel.",
      },
    ],
  },
  {
    cle: "reco-outil",
    onglet: "Comprendre l'outil",
    ongletCourt: "Comprendre…",
    titre: "Comprendre l'outil et répondre aux questions",
    accroche: "Bien comprendre comment fonctionne l'outil",
    blocs: [
      {
        type: "etapes",
        icone: "🧠",
        titre: "Ce que vous devez savoir (pour être crédible à l'oral)",
        items: [
          "L'IA analyse les données de nombreuses plateformes (réseaux sociaux, Google…) et le comportement des internautes pour repérer des vendeurs potentiels.",
          "Ces vendeurs passent par un formulaire de qualification : projet de vente réel, type de bien, délai inférieur à 6 mois, superficie, localisation.",
          "Le vendeur confirme qu'il est intéressé par vos services et qu'il souhaite être rappelé, puis laisse lui-même ses coordonnées.",
          "Vous recevez une notification WhatsApp avec nom, prénom, type de bien, localisation et téléphone.",
          "Le même système existe pour les acheteurs, avec une notification séparée.",
        ],
      },
      {
        type: "encadre",
        icone: "⚖️",
        titre: "Conformité",
        texte:
          "Le vendeur a fait lui-même la démarche de demander à être appelé et a saisi ses coordonnées. Les preuves sont archivées côté Squale en cas de souci.",
      },
      {
        type: "qr",
        icone: "💬",
        titre: "Réponses aux questions fréquentes",
        items: [
          {
            q: "Comment avez-vous eu mon contact ?",
            r: "Vous avez rempli un formulaire en ligne en indiquant vouloir être rappelé pour votre projet de vente.",
          },
          {
            q: "Je ne me souviens pas d'avoir fait ça.",
            r: "Pas de souci, c'était un court questionnaire sur votre projet de vente. Si le projet n'est pas d'actualité, je ne vous dérange pas plus.",
          },
          {
            q: "Je n'ai pas encore décidé de vendre.",
            r: "Je comprends. On peut faire un point rapide sur la valeur de votre bien, sans engagement.",
          },
          {
            q: "Je vois déjà d'autres agences.",
            r: "Très bien. Ce qui nous distingue, c'est que nous utilisons l'IA pour aller chercher activement des acheteurs. Je peux vous montrer comment.",
          },
        ],
      },
      {
        type: "etapes",
        icone: "📈",
        titre: "Les 3 leviers de performance",
        items: [
          "Réactivité au rappel (quelques minutes).",
          "Discours IA + votre expertise.",
          "Secteur : plus la zone est dense, plus il y a de prospects. C'est normal, ne vous découragez pas.",
        ],
      },
      {
        type: "encadre",
        icone: "🗓",
        titre: "Attentes réalistes",
        texte:
          "Les résultats se construisent sur l'année et suivent les fluctuations du marché. Ne jugez pas l'outil sur le premier mois.",
      },
    ],
  },
];
