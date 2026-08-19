import Anthropic from "@anthropic-ai/sdk";
import { computeNegotiationFloor } from "./negotiation";
import type { AIGeneratedContent, AnalysisInput, MarketAnalysis } from "./types";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 6500;

const SYSTEM_PROMPT = `Tu es le moteur de génération d'annonces d'un outil interne pour agents immobiliers en France.
On te fournit des données de marché déjà calculées (tension, tendance) et une fiche du bien dont certains champs
peuvent être absents (non renseignés par l'agent).

RÈGLE ABSOLUE : tu ne dois JAMAIS inventer un chiffre ou une caractéristique du bien qui n'est pas explicitement
fournie (pas de piscine, jardin, DPE, nombre de pièces, distance de proximité, etc. si ce n'est pas mentionné).
Si une information manque, tu omets purement la phrase, la ligne ou la section correspondante — jamais de
mention "[non renseigné]" ou de crochets, jamais de placeholder.

Ta seule tâche est d'appeler l'outil "submit_analysis" avec :
1. Un score d'attractivité (0-100) cohérent avec la tension du marché et les atouts réellement fournis.
2. Quatre annonces distinctes (Instagram, TikTok, Facebook, Web), chacune avec :
   - "title" : le titre/accroche.
   - "description" : le texte complet, normalement rédigé (phrases, espaces, sauts de ligne "\\n" corrects —
     c'est un texte prêt à être copié-collé tel quel, jamais de mot collé à un autre).
   - "highlights" : une sélection CIBLÉE des passages les plus déterminants extraits MOT POUR MOT de
     "description" (recopie exactement la sous-chaîne, ne reformule pas ; respecte le nombre indiqué pour chaque
     plateforme, ne le dépasse pas), chacun avec "reason" : une explication PRÉCISE (20 à 30 mots, jamais vague)
     de pourquoi cet élément précis, écrit précisément comme ça, placé précisément à cet endroit, sert l'annonce.
     Priorise, dans l'ordre : (1) les titres de section en majuscules (structure/lisibilité/SEO), (2) les 2-3
     données chiffrées les plus déterminantes (surface, prix, ville en premier), (3) une ou deux tournures de
     phrase clés (accroche, appel à l'action). Chaque "reason" doit toucher, quand c'est pertinent : l'intérêt
     SEO/indexation, l'intérêt comportemental pour l'utilisateur, et pourquoi c'est précisément à CET endroit et
     sous CETTE forme que ça fonctionne. Les highlights ne modifient pas le texte, ils servent uniquement à le
     surligner ensuite à l'affichage.
3. Une stratégie de vente ("strategy") : 4 à 6 recommandations concrètes et actionnables, SPÉCIFIQUES à ce bien
   précis et à son marché (pas de conseils génériques copiables sur n'importe quelle annonce). Base-toi sur les
   atouts réellement fournis, le type de bien, la tension du marché et la tendance de prix pour dire par exemple
   quel type d'acheteur cibler en priorité, quel canal privilégier, quel argument mettre en avant en premier,
   quel timing de mise en marché adopter, comment gérer une éventuelle négociation vu la tension du marché.
4. Un ordre de photos optimal ("visual") : détermine, à partir des atouts RÉELLEMENT fournis uniquement (jamais
   d'invention), quelle est la photo la plus vendeuse à mettre en premier (ex : piscine ou vue si fournies et
   remarquables, sinon la pièce de vie principale), puis un enchaînement logique de photos qui suit les usages
   de l'immobilier (pièce de vie / atout extérieur fort, cuisine, chambres, salle de bain, extérieur secondaire,
   pièces annexes). N'inclus JAMAIS une photo d'un élément non confirmé dans la fiche (pas de photo de piscine
   si piscine n'est pas fournie). Donne aussi un nombre de photos recommandé pour l'annonce.
5. Un argumentaire ("argumentaire") pour l'agent, en deux parties :
   - "objections" : 4 à 6 objections ou questions RÉALISTES qu'un acheteur pourrait poser sur CE bien précis
     (prix, absence d'un équipement, travaux à prévoir, pourquoi le vendeur vend, DPE, proximité, etc. — base-toi
     sur ce qui est fourni ET sur ce qui est notablement absent), chacune avec une réponse courte, concrète et
     convaincante que l'agent peut utiliser telle quelle en visite ou au téléphone.
   - "negotiationPoints" : 3 à 5 arguments concrets pour défendre le prix face à une tentative de négociation à
     la baisse, cohérents avec la marge de négociation déjà calculée fournie ci-dessous (ne la contredis pas),
     basés sur la tension du marché, la tendance des prix et les atouts réels du bien.

TON PAR PLATEFORME :

- Instagram : visuel, accrocheur, storytelling court, emojis avec parcimonie, 3 à 5 hashtags immobiliers
  pertinents à la fin de la description.

- TikTok : accroche immédiate dès les 5 premiers mots, ton dynamique et actuel, phrases très courtes, pensé pour
  une légende de vidéo (visite, avant/après...), 2-3 hashtags à la fin, emojis ponctuels.

- Facebook : ton convivial et local, un peu plus développé qu'Instagram, orienté partage (invite à taguer un
  proche ou partager), emojis modérés.

- Web (Le Bon Coin, SeLoger et portails généralistes) : AUCUN emoji, texte long, factuel et structuré, orienté
  mots-clés de recherche. C'est l'annonce la plus complète et la plus longue des quatre. Reproduis EXACTEMENT
  cette structure (le titre suit le format donné, la description contient les sauts de ligne "\\n\\n" indiqués) :

  Titre : "[Type de bien] à vendre [Ville] [surface] m² – [X] chambres avec [caractéristique clé]"
  (omets "[X] chambres" si inconnu, omets "avec [caractéristique clé]" si aucun atout notable n'est fourni)

  Description (dans cet ordre, une section entière est omise si elle n'aurait aucune ligne de données réelles) :

  DESCRIPTION DU BIEN

  Un premier paragraphe suivant ce modèle : "Idéalement située à [Ville] ([département ou code postal si
  fourni]), cette [maison/cet appartement] à vendre de [surface] m² habitables séduit par ses volumes généreux
  et son cadre de vie familial. Ce bien se compose de [X] chambres[, d'un bureau (idéal télétravail, chambre
  d'amis, ou activité indépendante) uniquement si un bureau/pièce bonus est fourni], d'une cuisine
  [équipée/ouverte, selon les infos fournies, sinon omettre l'adjectif] et d'un salon/séjour[traversant,
  uniquement si un accès extérieur direct est fourni] [de [X] m² si la surface du salon est fournie]."
  Un second paragraphe court, toujours inclus : "Une [maison/un appartement] [X chambres si connu] à [Ville]
  avec de beaux volumes, qui répond aux critères des familles en quête d'espace et de fonctionnalité sur le
  secteur."

  EQUIPEMENTS ET ANNEXES

  Une ligne "Label : valeur" par info fournie, dans cet ordre si disponible :
  Nombre de chambres : [X]
  Salle(s) de bain : [X]
  WC : [X]
  Garage : [simple si 1 place, double si 2 places ou plus], pouvant accueillir [X] véhicule(s)
  Dépendances : présentes (si outbuildings fourni ; ne précise jamais le type si non détaillé)
  Autres : [liste séparée par des virgules parmi jardin / terrasse / piscine, uniquement ceux marqués présents]

  ENVIRONNEMENT ET PROXIMITES

  Une ligne par info fournie :
  Écoles à [X] minutes
  Gare et transports en commun à [X] minutes
  Commerces et centre-ville à [X] minutes
  [Nom de l'axe routier] à [X] minutes

  INFORMATIONS FINANCIERES

  Une ligne par info fournie :
  Prix hors honoraires : [prix hors honoraires] euros (si non fourni, utilise "Prix : [prix demandé] euros" à la
  place)
  Honoraires charge acquéreur : [X]% TTC
  Référence agence : [référence agence]
  Référence annonce : [référence annonce]
  Diagnostic réalisé le : [date]
  Dépenses énergie estimées par an : entre [min] et [max] euros

  Termine toujours par : "[Type de bien] à vendre à [Ville] - un bien rare sur le secteur, à découvrir sans
  tarder. Contactez-nous pour organiser une visite."

Réponds uniquement en français.`;

function highlightSchema(countHint: string) {
  return {
    type: "array" as const,
    description: `Liste EXHAUSTIVE de passages recopiés mot pour mot depuis \`description\` (sous-chaîne exacte) : ${countHint}. Inclut systématiquement chaque titre de section en majuscules ET chaque donnée factuelle, pas seulement quelques exemples symboliques.`,
    items: {
      type: "object" as const,
      properties: {
        phrase: { type: "string", description: "Sous-chaîne exacte présente dans `description`, courte (1 à 8 mots)." },
        reason: {
          type: "string",
          description:
            "Explication précise et détaillée (20 à 35 mots) : intérêt SEO/indexation, intérêt comportemental pour l'utilisateur, et pourquoi c'est précisément à cet endroit et sous cette forme (majuscule, chiffre isolé, début de phrase...) que ça fonctionne.",
        },
      },
      required: ["phrase", "reason"],
    },
  };
}

function platformSchema(titleDescription: string, descriptionDescription: string, highlightCountHint: string) {
  return {
    type: "object" as const,
    properties: {
      title: { type: "string", description: titleDescription },
      description: { type: "string", description: descriptionDescription },
      highlights: highlightSchema(highlightCountHint),
    },
    required: ["title", "description", "highlights"],
  };
}

const STRATEGY_SCHEMA = {
  type: "object" as const,
  properties: {
    points: {
      type: "array" as const,
      description:
        "4 à 6 recommandations stratégiques concrètes et actionnables pour optimiser la vente de ce bien précis (ciblage acheteur, canal à privilégier, argument à mettre en avant, timing, négociation...), basées sur ses atouts réels et le contexte de marché fourni. Jamais de conseil générique.",
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string", description: "Titre court de la recommandation (≤ 8 mots)." },
          description: {
            type: "string",
            description:
              "Explication concrète et actionnable (25 à 45 mots), spécifique à ce bien et à son marché local, pas un conseil générique applicable à n'importe quelle annonce.",
          },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["points"],
};

const VISUAL_SCHEMA = {
  type: "object" as const,
  properties: {
    recommendedPhotoCount: {
      type: "string",
      description: "Nombre de photos recommandé pour l'annonce, ex : '8 à 12 photos'.",
    },
    photos: {
      type: "array" as const,
      description:
        "Ordre optimal des photos à publier, en commençant par l'atout le plus vendeur réellement fourni. Utilise uniquement des sujets confirmés par la fiche du bien, jamais un élément non fourni.",
      items: {
        type: "object" as const,
        properties: {
          order: { type: "integer", description: "Position dans l'ordre de publication, à partir de 1." },
          subject: { type: "string", description: "Sujet de la photo (ex : 'Salon', 'Piscine et extérieur', 'Cuisine équipée')." },
          reason: { type: "string", description: "Pourquoi cette photo à cette position précise (≤ 20 mots)." },
        },
        required: ["order", "subject", "reason"],
      },
    },
  },
  required: ["recommendedPhotoCount", "photos"],
};

const ARGUMENTAIRE_SCHEMA = {
  type: "object" as const,
  properties: {
    objections: {
      type: "array" as const,
      description:
        "4 à 6 objections/questions réalistes qu'un acheteur pourrait avoir sur CE bien précis, avec une réponse courte et convaincante prête à l'emploi pour l'agent.",
      items: {
        type: "object" as const,
        properties: {
          objection: { type: "string", description: "L'objection ou la question telle qu'un acheteur pourrait la formuler (≤ 20 mots)." },
          response: {
            type: "string",
            description: "Réponse courte et convaincante (25 à 45 mots), spécifique à ce bien, jamais générique.",
          },
        },
        required: ["objection", "response"],
      },
    },
    negotiationPoints: {
      type: "array" as const,
      description:
        "3 à 5 arguments concrets à utiliser par l'agent pour défendre le prix face à une tentative de négociation, cohérents avec la marge de négociation déjà calculée fournie dans le message.",
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string", description: "Titre court de l'argument (≤ 8 mots)." },
          description: { type: "string", description: "Explication concrète (25 à 40 mots)." },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["objections", "negotiationPoints"],
};

const TOOL_SCHEMA = {
  name: "submit_analysis",
  description: "Retourne le score d'attractivité, les 4 annonces (Instagram, TikTok, Facebook, Web), la stratégie de vente et l'ordre de photos.",
  input_schema: {
    type: "object" as const,
    properties: {
      attractivityScore: {
        type: "integer",
        description: "Score d'attractivité du bien sur 100, cohérent avec le type de bien, ses atouts et la tension du marché fournis.",
        minimum: 0,
        maximum: 100,
      },
      marketing: {
        type: "object" as const,
        properties: {
          instagram: platformSchema(
            "Titre/accroche court et percutant, max 60 caractères.",
            "Post Instagram complet : storytelling court, chaleureux, vendeur, hashtags à la fin.",
            "environ 4 à 6 passages, couvrant le titre, les 2-3 données chiffrées les plus importantes et les hashtags"
          ),
          tiktok: platformSchema(
            "Légende très courte façon accroche vidéo, max 60 caractères.",
            "Légende TikTok complète : phrases très courtes, ton dynamique, hashtags à la fin.",
            "environ 3 à 5 passages, couvrant l'accroche, la donnée chiffrée clé et les hashtags"
          ),
          facebook: platformSchema(
            "Titre/accroche conviviale, max 65 caractères.",
            "Post Facebook complet : ton local et convivial, orienté partage.",
            "environ 4 à 6 passages, couvrant le titre, les données chiffrées clés et l'appel au partage"
          ),
          leboncoin: platformSchema(
            "Titre factuel : [Type] à vendre [Ville] [surface] m² – [X] chambres avec [atout clé], max 90 caractères.",
            "Annonce Web longue et structurée (DESCRIPTION DU BIEN en 2 paragraphes / EQUIPEMENTS ET ANNEXES / ENVIRONNEMENT ET PROXIMITES / INFORMATIONS FINANCIERES avec sauts de ligne \\n\\n entre sections), aucun emoji, sections vides omises. Suit précisément la structure donnée dans le system prompt.",
            "environ 8 à 12 passages : CHAQUE titre de section en majuscules + les données les plus importantes (surface, ville, prix, 2-3 équipements clés) + les tournures clés des 2 paragraphes de description. Ne surligne pas chaque ligne individuellement si le bien a beaucoup de données fournies — priorise les plus déterminantes."
          ),
        },
        required: ["instagram", "tiktok", "facebook", "leboncoin"],
      },
      strategy: STRATEGY_SCHEMA,
      visual: VISUAL_SCHEMA,
      argumentaire: ARGUMENTAIRE_SCHEMA,
    },
    required: ["attractivityScore", "marketing", "strategy", "visual", "argumentaire"],
  },
};

function yesNo(v: boolean | undefined): string | undefined {
  if (v === undefined) return undefined;
  return v ? "Oui" : "Non";
}

function buildDetailLines(input: AnalysisInput): string[] {
  const lines: string[] = [];
  const add = (label: string, value: string | number | undefined) => {
    if (value !== undefined && value !== "") lines.push(`${label} : ${value}`);
  };

  add("Quartier / secteur", input.neighborhood);
  add("Département / code postal", input.postalCode);
  add("Surface terrain", input.landSurface !== undefined ? `${input.landSurface} m²` : undefined);
  add("Nombre de pièces total", input.totalRooms);
  add("Nombre de chambres", input.bedrooms);
  add("Bureau / pièce bonus", yesNo(input.hasBonusRoom));
  add("Usage suggéré du bureau/pièce bonus", input.bonusRoomUsage);
  add("Cuisine américaine / ouverte", yesNo(input.openKitchen));
  add("Cuisine équipée", yesNo(input.equippedKitchen));
  add("Surface salon/séjour", input.livingRoomSurface !== undefined ? `${input.livingRoomSurface} m²` : undefined);
  add("Accès extérieur direct depuis le salon", yesNo(input.directOutdoorAccess));
  add("Nombre de salles de bain", input.bathrooms);
  add("Nombre de WC", input.toilets);
  add("Jardin", yesNo(input.garden));
  add("Surface jardin", input.gardenSurface !== undefined ? `${input.gardenSurface} m²` : undefined);
  add("Terrasse", yesNo(input.terrace));
  add("Piscine", yesNo(input.pool));
  add("Garage", yesNo(input.garage));
  add("Nombre de véhicules au garage", input.garageSpaces);
  add("Dépendances (cave, atelier, abri)", yesNo(input.outbuildings));
  add("Année de construction / rénovation", input.constructionYear);
  add("DPE", input.dpe);
  add("Diagnostic réalisé le", input.diagnosticDate);
  if (input.energyCostMin !== undefined || input.energyCostMax !== undefined) {
    lines.push(`Dépenses énergie estimées : ${input.energyCostMin ?? "?"} - ${input.energyCostMax ?? "?"} €/an`);
  }
  add("Écoles/collège/lycée à", input.schoolMinutes !== undefined ? `${input.schoolMinutes} min` : undefined);
  add("Gare/transports en commun à", input.transitMinutes !== undefined ? `${input.transitMinutes} min` : undefined);
  add("Commerces/centre-ville à", input.shopsMinutes !== undefined ? `${input.shopsMinutes} min` : undefined);
  add("Nom axe routier à proximité", input.roadAccessName);
  add("Axe routier à", input.roadAccessMinutes !== undefined ? `${input.roadAccessMinutes} min` : undefined);
  add("Prix hors honoraires", input.priceExcludingFees !== undefined ? `${input.priceExcludingFees} €` : undefined);
  add("Honoraires charge acquéreur", input.feesPercent !== undefined ? `${input.feesPercent}%` : undefined);
  add("Référence agence", input.agencyRef);
  add("Référence annonce", input.listingRef);
  add("Vue dégagée", yesNo(input.clearView));
  add("Calme / pas de vis-à-vis", yesNo(input.quiet));
  add("Récemment rénové", yesNo(input.recentlyRenovated));
  add("Fibre optique", yesNo(input.fiber));

  return lines;
}

function buildUserMessage(input: AnalysisInput, analysis: MarketAnalysis): string {
  const negotiationFloor = computeNegotiationFloor(input.userPrice, analysis.marketTension);

  const lines = [
    `Ville : ${analysis.city}${analysis.isEstimatedCity ? " (ville non référencée, moyenne nationale utilisée)" : ""}`,
    `Région : ${analysis.region}`,
    `Type de bien : ${input.propertyType}`,
    `Surface habitable : ${input.surface} m²`,
    `Prix demandé : ${input.userPrice} €`,
    `Tendance annuelle du marché local : ${analysis.yearlyTrendPct > 0 ? "+" : ""}${analysis.yearlyTrendPct}%`,
    `Tension du marché local : ${analysis.marketTension}/100`,
    `Marge de négociation déjà calculée : jusqu'à ${negotiationFloor.discountPct}% de baisse acceptable, soit un prix plancher d'environ ${negotiationFloor.floorPrice} € (ne contredis pas ce chiffre dans "negotiationPoints").`,
  ];

  const detailLines = buildDetailLines(input);
  if (detailLines.length > 0) {
    lines.push("", "Caractéristiques du bien renseignées par l'agent (utilise-les si pertinent) :", ...detailLines);
  }

  lines.push("", "Rédige uniquement via l'outil submit_analysis.");

  return lines.join("\n");
}

export async function generateListingContent(
  input: AnalysisInput,
  analysis: MarketAnalysis
): Promise<AIGeneratedContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY manquante dans l'environnement serveur.");
  }

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.6,
    system: SYSTEM_PROMPT,
    tools: [TOOL_SCHEMA],
    tool_choice: { type: "tool", name: "submit_analysis" },
    messages: [{ role: "user", content: buildUserMessage(input, analysis) }],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("Réponse IA tronquée (limite de tokens atteinte). Réessaie, ou simplifie la fiche du bien.");
  }

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Réponse IA invalide : pas de bloc tool_use.");
  }

  return toolUse.input as AIGeneratedContent;
}
