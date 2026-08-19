import { computeMarketAnalysis } from "./pricing";
import type { AnalysisInput, AnalysisResult } from "./types";

/**
 * Bien fictif affiché par défaut au chargement de la page, pour que le dashboard
 * ne soit jamais vide au premier coup d'œil. Aucun appel API : le score et les
 * textes marketing sont écrits à la main (dans le style attendu de Claude Haiku),
 * seules les données de marché (tension, tendance, courbe) sont recalculées
 * réellement via computeMarketAnalysis.
 */
export const EXAMPLE_INPUT: AnalysisInput = {
  city: "Versailles",
  propertyType: "appartement",
  surface: 68,
  userPrice: 520000,
  neighborhood: "Notre-Dame",
  postalCode: "78000",
  totalRooms: 3,
  bedrooms: 2,
  equippedKitchen: true,
  bathrooms: 1,
  terrace: true,
  schoolMinutes: 5,
  transitMinutes: 8,
  shopsMinutes: 3,
  roadAccessName: "A13",
  roadAccessMinutes: 10,
  priceExcludingFees: 500000,
  feesPercent: 4,
  agencyRef: "VER245",
  listingRef: "2026-VER-045",
};

export const EXAMPLE_RESULT: AnalysisResult = {
  ...computeMarketAnalysis(EXAMPLE_INPUT),
  input: EXAMPLE_INPUT,
  generatedAt: "2026-01-01T09:00:00.000Z",
  attractivityScore: 76,
  marketing: {
    instagram: {
      title: "Appartement lumineux à Versailles ✨",
      description:
        "Coup de cœur assuré pour cet appartement de 68 m² à Versailles, à deux pas du château ! 3 pièces dont 2 chambres, cuisine équipée et une terrasse pour profiter du soleil. Un cadre de vie rare, entre histoire et modernité. À découvrir sans attendre ! 🏛️✨ #Versailles #Immobilier #AppartementVersailles #IleDeFrance #TerrasseVersailles",
      highlights: [
        {
          phrase: "68 m² à Versailles",
          reason:
            "La surface et la ville arrivent dès les 6 premiers mots : ce sont les deux critères que l'algorithme Instagram et l'œil de l'utilisateur captent en premier lors du scroll, avant même de lire la suite.",
        },
        {
          phrase: "à deux pas du château",
          reason:
            "Ancrage géographique précis et évocateur : renforce le SEO local (recherches \"appartement Versailles château\") tout en valorisant émotionnellement le bien par association avec un lieu prestigieux connu de tous.",
        },
        {
          phrase: "2 chambres",
          reason:
            "Chiffre isolé et lisible en un coup d'œil : répond directement au filtre \"nombre de chambres\" que les utilisateurs Instagram immobilier recherchent en priorité avant de cliquer sur \"en savoir plus\".",
        },
        {
          phrase: "cuisine équipée",
          reason:
            "Mot-clé technique recherché tel quel par les acheteurs sur les moteurs et dans les commentaires : le mentionner littéralement (plutôt que \"belle cuisine\") maximise la correspondance avec leurs recherches.",
        },
        {
          phrase: "une terrasse pour profiter du soleil",
          reason:
            "L'atout extérieur n'est pas juste cité (\"terrasse\") mais associé à un bénéfice concret (\"profiter du soleil\") : déclenche la projection émotionnelle, plus efficace qu'une simple liste de caractéristiques.",
        },
        {
          phrase: "À découvrir sans attendre !",
          reason:
            "Appel à l'action court et impératif placé juste avant les hashtags : formulation simple à lire instantanément sur mobile, crée un sentiment d'urgence qui pousse au clic ou au message privé.",
        },
        {
          phrase: "#Versailles #Immobilier #AppartementVersailles",
          reason:
            "Hashtags en fin de texte, format standard Instagram : place le post dans les recherches par hashtag géographique et thématique sans alourdir la lecture du texte principal.",
        },
      ],
    },
    tiktok: {
      title: "68m² à Versailles, coup de cœur direct 🏛️",
      description:
        "Un appart à Versailles avec terrasse ? Oui, ça existe 👀 68 m², 2 chambres, cuisine équipée. Le genre de bien qui part vite. #Versailles #ImmoTikTok #Terrasse",
      highlights: [
        {
          phrase: "Un appart à Versailles avec terrasse ?",
          reason:
            "Question posée dès le premier mot : ce format capte l'attention avant que le pouce ne continue de scroller, technique d'accroche typique de TikTok où on a moins d'une seconde pour retenir l'utilisateur.",
        },
        {
          phrase: "Oui, ça existe 👀",
          reason:
            "Réponse courte et familière qui crée une rupture de rythme après la question : imite le ton conversationnel attendu sur TikTok plutôt qu'un discours commercial classique.",
        },
        {
          phrase: "68 m², 2 chambres, cuisine équipée",
          reason:
            "Les trois données les plus recherchées condensées en une seule ligne télégraphique : format lisible en une fraction de seconde, adapté à la lecture rapide pendant le visionnage d'une vidéo courte.",
        },
        {
          phrase: "Le genre de bien qui part vite",
          reason:
            "Urgence perçue sans donner de chiffre précis (pas de mensonge sur un délai) : pousse à l'action immédiate, ton typique de TikTok où la rareté perçue génère l'engagement.",
        },
        {
          phrase: "#Versailles #ImmoTikTok #Terrasse",
          reason:
            "Trois hashtags seulement, volontairement peu nombreux : sur TikTok un excès de hashtags nuit à la portée de l'algorithme, mieux vaut cibler la ville, la communauté immo et l'atout clé.",
        },
      ],
    },
    facebook: {
      title: "Bel appartement à Versailles avec terrasse",
      description:
        "Vous cherchez un appartement à Versailles avec du cachet ? Ce 68 m² de 3 pièces, avec 2 chambres, cuisine équipée et terrasse, pourrait bien être celui qu'il vous faut. Proche des écoles et des transports, idéal pour une famille. Vous connaissez quelqu'un que ça pourrait intéresser ? N'hésitez pas à partager ! 😊",
      highlights: [
        {
          phrase: "Vous cherchez un appartement à Versailles avec du cachet ?",
          reason:
            "Question d'ouverture qui interpelle directement le lecteur (\"Vous\") : sur Facebook, ce ton conversationnel génère plus de commentaires et de partages qu'une simple description à la troisième personne.",
        },
        {
          phrase: "68 m² de 3 pièces, avec 2 chambres",
          reason:
            "Les données chiffrées regroupées en milieu de première phrase, après l'accroche émotionnelle : Facebook favorise un texte qui capte d'abord, informe ensuite, contrairement à LeBonCoin qui informe dès le titre.",
        },
        {
          phrase: "Proche des écoles et des transports",
          reason:
            "Critère familial rassurant formulé simplement, sans chiffre : le public Facebook local (souvent des familles du quartier) recherche ce type de repère pratique plus que des minutes précises.",
        },
        {
          phrase: "idéal pour une famille",
          reason:
            "Phrase courte qui nomme explicitement la cible : aide l'algorithme Facebook à montrer le post aux bons profils (parents, groupes locaux familiaux) et aide le lecteur à se projeter immédiatement.",
        },
        {
          phrase: "Vous connaissez quelqu'un que ça pourrait intéresser ? N'hésitez pas à partager !",
          reason:
            "Appel direct au partage formulé comme une question simple : c'est le levier principal de portée organique sur Facebook, bien plus efficace qu'un simple \"partagez ce post\" impersonnel.",
        },
      ],
    },
    leboncoin: {
      title: "Appartement à vendre Versailles 68 m² – 2 chambres avec terrasse",
      description:
        "DESCRIPTION DU BIEN\n\nIdéalement situé à Versailles (78000), cet appartement à vendre de 68 m² habitables séduit par ses volumes généreux et son cadre de vie familial. Ce bien se compose de 2 chambres, d'une cuisine équipée et d'un salon/séjour traversant.\n\nUn appartement 2 chambres à Versailles avec de beaux volumes, qui répond aux critères des familles en quête d'espace et de fonctionnalité sur le secteur.\n\nEQUIPEMENTS ET ANNEXES\n\nNombre de chambres : 2\nSalle(s) de bain : 1\nAutres : terrasse\n\nENVIRONNEMENT ET PROXIMITES\n\nÉcoles à 5 minutes\nGare et transports en commun à 8 minutes\nCommerces et centre-ville à 3 minutes\nA13 à 10 minutes\n\nINFORMATIONS FINANCIERES\n\nPrix hors honoraires : 500 000 euros\nHonoraires charge acquéreur : 4% TTC\nRéférence agence : VER245\nRéférence annonce : 2026-VER-045\n\nAppartement à vendre à Versailles - un bien rare sur le secteur, à découvrir sans tarder. Contactez-nous pour organiser une visite.",
      highlights: [
        {
          phrase: "DESCRIPTION DU BIEN",
          reason:
            "Titre de section en majuscules : crée une rupture visuelle immédiate qui signale le début du texte descriptif. Sur un portail où les utilisateurs comparent des dizaines d'annonces, ces repères en majuscules permettent de scanner la structure en 2 secondes avant de lire en détail.",
        },
        {
          phrase: "Idéalement situé à Versailles",
          reason:
            "La ville apparaît dès le premier mot du corps de texte, juste après le titre qui la contient déjà : cette répétition immédiate renforce le signal géographique pour l'indexation et confirme instantanément au lecteur qu'il est au bon endroit.",
        },
        {
          phrase: "(78000)",
          reason:
            "Le code postal entre parenthèses juste après la ville, sans alourdir la phrase : les moteurs de recherche et les filtres de portails immobiliers indexent aussi par code postal, un critère que le nom de ville seul ne couvre pas.",
        },
        {
          phrase: "68 m² habitables",
          reason:
            "La surface est isolée avec l'adjectif \"habitables\" (précision technique attendue en immobilier) en tout début de paragraphe : c'est le deuxième filtre le plus utilisé après la ville sur les portails comme LeBonCoin ou SeLoger.",
        },
        {
          phrase: "2 chambres",
          reason:
            "Chiffre simple placé tôt dans la phrase plutôt que noyé en fin de paragraphe : les acheteurs qui filtrent par nombre de chambres doivent pouvoir confirmer ce critère en lisant seulement les 30 premiers mots.",
        },
        {
          phrase: "cuisine équipée",
          reason:
            "Terme technique standard du secteur, utilisé tel quel plutôt qu'une formulation vague comme \"belle cuisine\" : correspond mot pour mot aux requêtes tapées par les acheteurs et aux filtres \"cuisine équipée\" des portails.",
        },
        {
          phrase: "Un appartement 2 chambres à Versailles avec de beaux volumes",
          reason:
            "Ce second paragraphe répète volontairement type de bien, nombre de chambres et ville : cette redondance maîtrisée renforce la densité de mots-clés pour le SEO sans être perçue comme du bourrage grâce à une formulation différente du premier paragraphe.",
        },
        {
          phrase: "EQUIPEMENTS ET ANNEXES",
          reason:
            "Deuxième titre de section en majuscules, qui marque le passage du texte narratif à une liste de données factuelles : ce changement de registre annoncé visuellement aide l'œil à basculer en mode \"comparaison de critères\" plutôt qu'en mode lecture.",
        },
        {
          phrase: "Nombre de chambres : 2",
          reason:
            "Format \"Label : valeur\" strict et répété sur chaque ligne de cette section : cette structure ultra-simple est à la fois plus facile à scanner pour un humain pressé et plus facile à extraire pour un algorithme d'indexation structurée.",
        },
        {
          phrase: "Salle(s) de bain : 1",
          reason:
            "Ligne dédiée à une seule donnée plutôt que fusionnée dans une phrase : permet à l'acheteur de repérer instantanément ce critère précis sans avoir à relire tout un paragraphe, gain de temps décisif dans une recherche multi-annonces.",
        },
        {
          phrase: "Autres : terrasse",
          reason:
            "Ligne \"fourre-tout\" qui ne liste que les atouts réellement fournis (ici la terrasse) : évite d'inventer jardin ou piscine non renseignés tout en gardant la structure de la section intacte même avec peu de données.",
        },
        {
          phrase: "ENVIRONNEMENT ET PROXIMITES",
          reason:
            "Troisième titre en majuscules : sépare clairement les caractéristiques intrinsèques du bien (sections précédentes) de son environnement, une distinction que les acheteurs utilisent pour prioriser leurs critères de choix.",
        },
        {
          phrase: "Écoles à 5 minutes",
          reason:
            "Distance chiffrée en minutes plutôt qu'en mètres ou \"à proximité\" : c'est l'unité que les familles utilisent mentalement pour évaluer un trajet quotidien, un chiffre concret rassure bien plus qu'une formulation vague.",
        },
        {
          phrase: "Gare et transports en commun à 8 minutes",
          reason:
            "Critère décisif pour les acheteurs sans voiture ou souhaitant limiter leur dépendance à celle-ci : la mention explicite \"transports en commun\" correspond aux recherches filtrées par accessibilité sur les portails.",
        },
        {
          phrase: "A13 à 10 minutes",
          reason:
            "Le nom de l'axe routier est cité explicitement plutôt qu'un vague \"autoroute à proximité\" : les acheteurs qui travaillent sur Paris ou la petite couronne recherchent précisément cette référence pour évaluer leur trajet domicile-travail.",
        },
        {
          phrase: "INFORMATIONS FINANCIERES",
          reason:
            "Dernier titre en majuscules, volontairement positionné en fin d'annonce après la découverte du bien : place la question du prix après l'attachement émotionnel créé par la description, tout en la rendant facile à retrouver d'un coup d'œil pour qui cherche directement le prix.",
        },
        {
          phrase: "Prix hors honoraires : 500 000 euros",
          reason:
            "Le prix est isolé sur sa propre ligne avec la mention \"hors honoraires\" explicite : évite toute ambiguïté sur ce qui est inclus, un point de friction fréquent qui peut faire perdre la confiance d'un acheteur s'il découvre des frais après coup.",
        },
        {
          phrase: "Honoraires charge acquéreur : 4% TTC",
          reason:
            "Complète immédiatement la ligne de prix par le taux d'honoraires : cette transparence immédiate, plutôt que cachée dans les mentions légales, est un signal de confiance qui différencie l'annonce de celles qui restent vagues sur ce point.",
        },
        {
          phrase: "Référence annonce : 2026-VER-045",
          reason:
            "Référence unique en toute fin de section financière : permet à un acheteur ou à l'agence de retrouver instantanément ce bien précis par téléphone ou email, évite toute confusion avec une autre annonce similaire du même secteur.",
        },
        {
          phrase: "Contactez-nous pour organiser une visite.",
          reason:
            "Phrase de clôture courte et directe en impératif de politesse : formulation simple plutôt qu'un discours commercial long, car à ce stade de l'annonce l'acheteur intéressé veut une action claire, pas un argumentaire supplémentaire.",
        },
      ],
    },
  },
  strategy: {
    points: [
      {
        title: "Cibler les jeunes actifs et petites familles",
        description:
          "Avec 2 chambres, des écoles à 5 min et la gare à 8 min, ce bien correspond à un profil de jeunes couples ou petites familles cherchant à s'installer sans voiture indispensable. Oriente les visuels et le discours vers ce public.",
      },
      {
        title: "Mettre la terrasse en avant partout",
        description:
          "C'est le seul atout extérieur confirmé sur ce bien : il doit apparaître en premier sur chaque plateforme (photo principale, premier mot de l'accroche) pour se démarquer des annonces d'appartements sans extérieur sur le secteur.",
      },
      {
        title: "Profiter de la tension du marché pour un prix ferme",
        description:
          "Avec une tension de 68/100 (marché tendu) à Versailles, la marge de négociation des acheteurs est structurellement plus faible : il est cohérent de tenir le prix affiché plutôt que d'anticiper une décote en amont.",
      },
      {
        title: "Prioriser les portails avant les réseaux sociaux",
        description:
          "Sur un marché tendu avec peu de biens 2 chambres avec terrasse, l'annonce Web (Le Bon Coin, SeLoger) capte déjà les acheteurs activement en recherche ; les réseaux sociaux servent surtout à élargir la visibilité au-delà des chercheurs actifs.",
      },
      {
        title: "Publier tôt dans la semaine",
        description:
          "Pour un bien orienté familles actives, une mise en ligne en début de semaine laisse le temps aux acheteurs de programmer une visite le week-end suivant, moment où la disponibilité pour visiter est la plus forte.",
      },
    ],
  },
  visual: {
    recommendedPhotoCount: "6 à 10 photos",
    photos: [
      {
        order: 1,
        subject: "Terrasse",
        reason: "Seul atout extérieur confirmé : c'est ce qui différencie le plus ce bien des autres annonces du secteur, à montrer en premier.",
      },
      {
        order: 2,
        subject: "Salon / séjour",
        reason: "Pièce de vie principale : donne le ton de l'ambiance générale du logement juste après l'atout différenciant.",
      },
      {
        order: 3,
        subject: "Cuisine équipée",
        reason: "Équipement confirmé et recherché : rassure sur le confort immédiat sans travaux à prévoir.",
      },
      {
        order: 4,
        subject: "Chambre principale",
        reason: "Première pièce de nuit : permet à l'acheteur de se projeter dans l'usage quotidien du bien.",
      },
      {
        order: 5,
        subject: "Deuxième chambre",
        reason: "Confirme la capacité familiale ou bureau/chambre d'amis mise en avant dans le titre de l'annonce.",
      },
      {
        order: 6,
        subject: "Salle de bain",
        reason: "Pièce technique attendue en fin de visite virtuelle, après les pièces de vie et de nuit.",
      },
    ],
  },
  argumentaire: {
    objections: [
      {
        objection: "Pourquoi le prix est-il plus élevé que la moyenne du quartier ?",
        response:
          "Le bien dispose d'une terrasse privée, rare sur ce type d'appartement à Versailles, et se situe dans le quartier recherché de Notre-Dame, à seulement 5 minutes des écoles.",
      },
      {
        objection: "Une seule salle de bain, est-ce suffisant pour une famille ?",
        response:
          "Pour un 2 chambres de cette taille, une salle de bain reste standard sur le marché versaillais ; la configuration convient parfaitement à un couple ou une petite famille.",
      },
      {
        objection: "Y a-t-il des travaux à prévoir ?",
        response:
          "Aucun travaux majeur n'est signalé sur ce bien : la cuisine équipée permet une entrée immédiate sans investissement supplémentaire à prévoir.",
      },
      {
        objection: "Le bien a-t-il une place de parking ou un garage ?",
        response:
          "Aucune place n'est incluse, mais la proximité immédiate de la gare (8 minutes) réduit fortement la dépendance à la voiture au quotidien.",
      },
    ],
    negotiationPoints: [
      {
        title: "Marché tendu, marge limitée",
        description:
          "Avec une tension de 68/100 à Versailles, la demande dépasse l'offre sur ce type de bien : la marge de négociation réaliste ne dépasse pas 3 à 4%.",
      },
      {
        title: "Rareté de la terrasse",
        description:
          "Peu d'appartements 2 chambres avec terrasse sont disponibles actuellement à Versailles, ce qui justifie le maintien du prix affiché face à une offre concurrente.",
      },
      {
        title: "Emplacement recherché",
        description:
          "Le quartier Notre-Dame et la proximité immédiate des transports et écoles sont des critères que peu de biens concurrents réunissent à ce prix.",
      },
    ],
  },
};
