import type { Locale } from '../domain.ts';
import type { ScenarioContent, ScenarioMeta } from './content.ts';

// Catalogue public : contenu produit (pas des données de démonstration), synchronisé à chaque démarrage
// par catalog-sync.ts. Modifier une entrée crée une nouvelle version ; l'historique reste intact.
export type CatalogEntry = { slug: string; meta: ScenarioMeta; content: ScenarioContent };

type Bilingual = {
  key: string;
  shared: Omit<ScenarioMeta, 'title' | 'summary' | 'industry' | 'language'> & {
    personality: ScenarioContent['prospect']['personality'];
    decisionPower: ScenarioContent['prospect']['decisionPower'];
    skillWeights: ScenarioContent['skillWeights'];
  };
  text: Record<Locale, Omit<ScenarioContent, 'skillWeights' | 'prospect'> & {
    title: string;
    summary: string;
    industry: string;
    prospect: Omit<ScenarioContent['prospect'], 'personality' | 'decisionPower'>;
  }>;
};

const ENTRIES: Bilingual[] = [
  {
    key: 'cold-call-ai-receptionist',
    shared: {
      family: 'cold_call',
      difficulty: 'beginner',
      channel: 'phone',
      estimatedMinutes: 5,
      personality: 'busy',
      decisionPower: 'decider',
      skillWeights: { opening: 5, questioning: 3, needs_discovery: 3, objection_handling: 4, closing: 5, clarity: 3 },
    },
    text: {
      fr: {
        title: 'Appel à froid : standard téléphonique IA pour un plombier',
        summary: "Obtenir un rendez-vous de démonstration avec un artisan débordé qui rate des appels pendant ses chantiers.",
        industry: 'Artisanat du bâtiment',
        objective: 'Décrocher un rendez-vous de démonstration de 20 minutes avec une date et une heure précises.',
        context: "Vous appelez sans rendez-vous préalable, un mardi à 8 h 15, juste avant le départ de l'équipe sur les chantiers.",
        offer: {
          name: 'Assistant téléphonique IA Blackstart',
          description: "Répond aux appels 24 h/24, prend les demandes d'intervention, fixe les rendez-vous et envoie un résumé par SMS.",
          price: '149 € HT par mois, sans engagement',
        },
        prospect: {
          name: 'Marc Lefèvre',
          role: 'Gérant',
          company: 'Plomberie Lefèvre',
          companySize: '8 salariés',
          publicProfile: "Entreprise de plomberie et chauffage à Lyon depuis 2009, bonnes notes Google, site internet ancien.",
        },
        need: "Ne plus perdre les appels de clients pendant les interventions, surtout les urgences.",
        budget: "N'a rien prévu ; accepte une dépense mensuelle si elle se rembourse avec un ou deux chantiers.",
        objections: [
          "Je n'ai pas le temps, je pars sur un chantier.",
          'Envoyez-moi plutôt un mail.',
          'Mes clients veulent parler à un humain, pas à un robot.',
        ],
        constraints: ['Dispose de 3 minutes au maximum si rien ne retient son attention.'],
        hiddenFacts: [
          'Il estime rater une dizaine d\'appels par semaine.',
          'Sa femme gère le téléphone à mi-temps et veut arrêter en janvier.',
          'Un concurrent lui a proposé un secrétariat externalisé à 300 € par mois.',
        ],
        successCriteria: [
          'Accroche claire en moins de 30 secondes.',
          'Au moins deux questions sur les appels manqués.',
          'Rendez-vous fixé avec un jour et une heure.',
        ],
        endConditions: [
          "Raccroche poliment si le vendeur récite un argumentaire sans poser de question pendant plus d'une minute.",
          'Accepte le rendez-vous si le vendeur a relié l\'offre aux appels manqués et proposé un créneau précis.',
        ],
      },
      en: {
        title: 'Cold call: AI receptionist for a plumbing business',
        summary: 'Book a demo with a busy tradesman who misses calls while on job sites.',
        industry: 'Building trades',
        objective: 'Book a 20-minute demo meeting with a specific date and time.',
        context: 'You call with no prior contact on a Tuesday at 8:15 am, just before the crew leaves for job sites.',
        offer: {
          name: 'Blackstart AI phone assistant',
          description: 'Answers calls 24/7, takes service requests, books appointments and texts a summary.',
          price: '$159 per month, no commitment',
        },
        prospect: {
          name: 'Mark Lewis',
          role: 'Owner',
          company: 'Lewis Plumbing',
          companySize: '8 employees',
          publicProfile: 'Plumbing and heating company in Denver since 2009, good Google reviews, outdated website.',
        },
        need: 'Stop losing customer calls during jobs, especially emergencies.',
        budget: 'Nothing planned; would accept a monthly cost if one or two jobs pay for it.',
        objections: [
          "I don't have time, I'm heading to a job.",
          'Just send me an email.',
          'My customers want to talk to a human, not a robot.',
        ],
        constraints: ['Gives 3 minutes at most unless something catches his interest.'],
        hiddenFacts: [
          'He estimates he misses about ten calls a week.',
          'His wife answers the phone part-time and wants to stop in January.',
          'A competitor offered him an answering service for $320 a month.',
        ],
        successCriteria: [
          'Clear opener in under 30 seconds.',
          'At least two questions about missed calls.',
          'Meeting booked with a day and a time.',
        ],
        endConditions: [
          'Politely hangs up if the seller pitches for more than a minute without asking a question.',
          'Accepts the meeting if the seller ties the offer to missed calls and proposes a specific slot.',
        ],
      },
    },
  },
  {
    key: 'discovery-scheduling-saas',
    shared: {
      family: 'discovery',
      difficulty: 'intermediate',
      channel: 'video',
      estimatedMinutes: 12,
      personality: 'analytical',
      decisionPower: 'committee',
      skillWeights: { questioning: 5, needs_discovery: 5, qualification: 4, reformulation: 4, active_listening: 4, closing: 3 },
    },
    text: {
      fr: {
        title: "Découverte : logiciel de planning pour un groupe de restaurants",
        summary: "Comprendre les vrais problèmes d'une associée méthodique avant de parler du produit.",
        industry: 'Restauration',
        objective: "Identifier trois problèmes chiffrés, le processus de décision et convenir d'une prochaine étape datée.",
        context: "Rendez-vous visio de 15 minutes obtenu après un formulaire rempli sur votre site.",
        offer: {
          name: 'PlanningPro',
          description: 'Plannings du personnel, échanges de créneaux, pointage et export vers la paie.',
          price: '6 € par salarié et par mois',
        },
        prospect: {
          name: 'Sophie Martin',
          role: 'Associée, en charge des ressources humaines',
          company: 'Groupe Les Tables',
          companySize: '4 restaurants, 85 salariés',
          publicProfile: 'A rempli le formulaire avec le message « on perd trop de temps sur les plannings ».',
        },
        need: 'Réduire le temps passé sur les plannings et les erreurs de paie.',
        budget: "Pas de montant annoncé ; toute dépense au-delà de 400 € par mois passe par son associé.",
        objections: [
          'Vous pouvez me montrer directement le logiciel ?',
          'On a déjà regardé deux outils, ils se ressemblent tous.',
        ],
        constraints: ['Répond précisément aux questions précises, vaguement aux questions vagues.'],
        hiddenFacts: [
          'Les plannings sont faits sur Excel, 6 heures par semaine et par restaurant.',
          'Le turnover atteint 40 % par an, en partie à cause des changements de planning de dernière minute.',
          'Un cinquième restaurant ouvre en mars et la décision doit être prise avant février.',
          'Son associé Paul signe tout achat ; il veut un retour sur investissement chiffré.',
        ],
        successCriteria: [
          'Au moins trois problèmes découverts, dont un chiffré en heures ou en euros.',
          'Le rôle de Paul dans la décision est identifié.',
          "L'échéance de mars est découverte.",
          'Une prochaine étape avec Paul est fixée.',
        ],
        endConditions: ["Met fin à l'échange si le vendeur fait une démo complète sans l'avoir questionnée."],
      },
      en: {
        title: 'Discovery: scheduling software for a restaurant group',
        summary: 'Understand the real problems of a methodical partner before talking about the product.',
        industry: 'Restaurants',
        objective: 'Uncover three quantified problems and the decision process, then agree on a dated next step.',
        context: 'A 15-minute video call booked after she filled in a form on your website.',
        offer: {
          name: 'PlanningPro',
          description: 'Staff schedules, shift swaps, time clock and payroll export.',
          price: '$6 per employee per month',
        },
        prospect: {
          name: 'Sophie Martin',
          role: 'Partner, in charge of HR',
          company: 'The Tables Group',
          companySize: '4 restaurants, 85 employees',
          publicProfile: 'Filled in the form with the message "we waste too much time on schedules".',
        },
        need: 'Spend less time on schedules and make fewer payroll mistakes.',
        budget: 'No figure given; anything above $450 a month needs her partner\'s approval.',
        objections: ['Can you just show me the software?', "We've looked at two tools already, they all look the same."],
        constraints: ['Answers precise questions precisely and vague questions vaguely.'],
        hiddenFacts: [
          'Schedules are built in Excel: 6 hours a week per restaurant.',
          'Staff turnover is 40% a year, partly due to last-minute schedule changes.',
          'A fifth restaurant opens in March and the decision must be made before February.',
          'Her partner Paul signs every purchase and wants a quantified return on investment.',
        ],
        successCriteria: [
          'At least three problems uncovered, one quantified in hours or money.',
          "Paul's role in the decision is identified.",
          'The March deadline is uncovered.',
          'A next step including Paul is booked.',
        ],
        endConditions: ['Ends the call if the seller runs a full demo without asking her anything.'],
      },
    },
  },
  {
    key: 'objections-website-redesign',
    shared: {
      family: 'objection_handling',
      difficulty: 'intermediate',
      channel: 'phone',
      estimatedMinutes: 10,
      personality: 'price_sensitive',
      decisionPower: 'decider',
      skillWeights: { objection_handling: 5, value_proposition: 5, active_listening: 3, reformulation: 3, negotiation: 3, closing: 3 },
    },
    text: {
      fr: {
        title: 'Objections de prix : refonte de site pour un cabinet d\'architectes',
        summary: 'Défendre un devis de 6 500 € face à une gérante qui compare avec un freelance à 2 000 €.',
        industry: 'Architecture',
        objective: 'Traiter les objections sans baisser le prix de plus de 10 % et obtenir un accord de principe.',
        context: 'Vous avez envoyé le devis il y a trois jours ; elle vous rappelle pour en discuter.',
        offer: {
          name: 'Refonte du site et référencement local',
          description: 'Site sur mesure, galerie de projets, pages par type de projet, référencement local pendant 6 mois.',
          price: '6 500 € HT',
        },
        prospect: {
          name: 'Claire Dubois',
          role: 'Architecte, gérante',
          company: 'Atelier Dubois Architectes',
          companySize: '5 personnes',
          publicProfile: 'Cabinet spécialisé en rénovation de maisons anciennes, site datant de 2016.',
        },
        need: 'Recevoir des demandes de particuliers qualifiés plutôt que de dépendre du bouche-à-oreille.',
        budget: 'Pensait dépenser 3 000 € ; peut aller plus haut si le résultat est démontré.',
        objections: [
          "C'est trop cher, un freelance m'a proposé 2 000 €.",
          'Ce n\'est pas le bon moment, on a beaucoup de chantiers.',
          'On a déjà un site, il fonctionne.',
        ],
        constraints: ['Ne signe rien pendant l\'appel ; peut donner un accord de principe.'],
        hiddenFacts: [
          'Le site actuel n\'a généré aucune demande en 2025.',
          'Elle a perdu un projet de 80 000 € : le client a trouvé le site « pas sérieux ».',
          'Elle peut payer en trois fois sans problème.',
        ],
        successCriteria: [
          'Chaque objection est reformulée avant d\'y répondre.',
          'La valeur est reliée au projet perdu ou aux demandes manquantes.',
          'Remise éventuelle de 10 % au maximum, en échange d\'une contrepartie.',
          'Accord de principe et date de signature.',
        ],
        endConditions: ['Accepte le principe si la valeur dépasse clairement le prix pour elle.'],
      },
      en: {
        title: 'Price objections: website redesign for an architecture firm',
        summary: 'Defend a $7,000 quote against an owner comparing it with a $2,000 freelancer.',
        industry: 'Architecture',
        objective: 'Handle the objections without cutting the price by more than 10% and get agreement in principle.',
        context: 'You sent the quote three days ago; she calls you back to discuss it.',
        offer: {
          name: 'Website redesign and local SEO',
          description: 'Custom website, project gallery, pages per project type, six months of local SEO.',
          price: '$7,000',
        },
        prospect: {
          name: 'Claire Dubois',
          role: 'Architect, owner',
          company: 'Dubois Architecture Studio',
          companySize: '5 people',
          publicProfile: 'Firm specialized in renovating old houses, website built in 2016.',
        },
        need: 'Get qualified enquiries from homeowners instead of relying on word of mouth.',
        budget: 'Expected to spend $3,000; can go higher if results are demonstrated.',
        objections: [
          "It's too expensive, a freelancer offered $2,000.",
          "It's not the right time, we have lots of projects.",
          'We already have a website and it works.',
        ],
        constraints: ['Will not sign during the call; can give agreement in principle.'],
        hiddenFacts: [
          'The current website generated zero enquiries in 2025.',
          'She lost an $85,000 project because the client found the website "unprofessional".',
          'She can easily pay in three installments.',
        ],
        successCriteria: [
          'Each objection is rephrased before being answered.',
          'Value is tied to the lost project or the missing enquiries.',
          'Any discount is 10% at most, traded for something in return.',
          'Agreement in principle and a signing date.',
        ],
        endConditions: ['Agrees in principle if the value clearly outweighs the price for her.'],
      },
    },
  },
  {
    key: 'closing-sales-training',
    shared: {
      family: 'closing',
      difficulty: 'expert',
      channel: 'video',
      estimatedMinutes: 15,
      personality: 'undecided',
      decisionPower: 'committee',
      skillWeights: { closing: 5, negotiation: 4, objection_handling: 4, qualification: 3, value_proposition: 3, silence_management: 3 },
    },
    text: {
      fr: {
        title: 'Closing : programme de formation pour une équipe de 12 commerciaux',
        summary: 'Conclure avec un directeur commercial hésitant qui doit convaincre son directeur financier.',
        industry: 'Distribution B2B',
        objective: 'Obtenir un engagement ferme : bon de commande ou réunion de signature avec le directeur financier.',
        context: "Troisième rendez-vous. La proposition a été envoyée la semaine dernière ; il dit « on y réfléchit ».",
        offer: {
          name: 'Programme Closing 90 jours',
          description: '6 ateliers en présentiel, coaching individuel, simulations IA illimitées pendant 3 mois.',
          price: '18 000 € HT pour 12 personnes',
        },
        prospect: {
          name: 'Thomas Bernard',
          role: 'Directeur commercial',
          company: 'Distrimat',
          companySize: '140 salariés',
          publicProfile: 'Distributeur de matériel électrique ; objectifs commerciaux manqués deux trimestres de suite.',
        },
        need: 'Améliorer le taux de transformation des rendez-vous en commandes, passé de 28 % à 19 %.',
        budget: 'Budget formation disponible, mais le directeur financier doit valider au-delà de 15 000 €.',
        objections: [
          'Il faut que j\'en parle au directeur financier.',
          'Un concurrent propose une formation en ligne à 7 000 €.',
          'Je ne suis pas sûr que mes commerciaux vont adhérer.',
        ],
        constraints: ['Ne prend pas de décision seul ; teste la solidité du vendeur.'],
        hiddenFacts: [
          'Le budget formation 2026 doit être engagé avant le 31 décembre, sinon il est perdu.',
          'Le directeur financier veut un retour sur investissement chiffré sur 12 mois.',
          'Deux commerciaux seniors sont démotivés et pourraient partir.',
          'L\'offre concurrente est uniquement en ligne, sans coaching.',
        ],
        successCriteria: [
          'Le vendeur fait chiffrer le coût de la baisse de transformation.',
          'Le critère du directeur financier est découvert et traité.',
          'Silence tenu après une question de closing.',
          'Engagement ferme et daté obtenu.',
        ],
        endConditions: ['Accepte une réunion de signature si le retour sur investissement est chiffré avec lui.'],
      },
      en: {
        title: 'Closing: training program for a team of 12 sales reps',
        summary: 'Close a hesitant sales director who must convince his CFO.',
        industry: 'B2B distribution',
        objective: 'Get a firm commitment: a purchase order or a signing meeting with the CFO.',
        context: 'Third meeting. The proposal was sent last week; he says "we are thinking about it".',
        offer: {
          name: '90-day Closing Program',
          description: 'Six in-person workshops, one-to-one coaching, unlimited AI simulations for three months.',
          price: '$19,500 for 12 people',
        },
        prospect: {
          name: 'Thomas Bernard',
          role: 'Sales director',
          company: 'Distrimat',
          companySize: '140 employees',
          publicProfile: 'Electrical equipment distributor; missed its sales targets two quarters in a row.',
        },
        need: 'Raise the meeting-to-order conversion rate, which fell from 28% to 19%.',
        budget: 'Training budget is available, but the CFO must approve anything above $16,000.',
        objections: [
          'I need to talk to the CFO.',
          'A competitor offers an online course for $7,500.',
          "I'm not sure my reps will buy into it.",
        ],
        constraints: ['Does not decide alone; tests how solid the seller is.'],
        hiddenFacts: [
          'The 2026 training budget must be committed before December 31 or it is lost.',
          'The CFO wants a quantified 12-month return on investment.',
          'Two senior reps are demotivated and might leave.',
          'The competing offer is online only, with no coaching.',
        ],
        successCriteria: [
          'The seller gets him to quantify the cost of the conversion drop.',
          "The CFO's criterion is uncovered and addressed.",
          'Silence held after a closing question.',
          'A firm, dated commitment is obtained.',
        ],
        endConditions: ['Agrees to a signing meeting if the return on investment is quantified together.'],
      },
    },
  },
  {
    key: 'qualification-maintenance-software',
    shared: {
      family: 'qualification',
      difficulty: 'beginner',
      channel: 'phone',
      estimatedMinutes: 8,
      personality: 'friendly',
      decisionPower: 'influencer',
      skillWeights: { qualification: 5, questioning: 4, needs_discovery: 3, active_listening: 3, clarity: 3, closing: 2 },
    },
    text: {
      fr: {
        title: 'Qualification : demande entrante pour un logiciel de maintenance',
        summary: "Qualifier un responsable sympathique mais qui n'est pas le décideur.",
        industry: 'Industrie',
        objective: 'Qualifier le besoin, le budget, le décideur et le délai, puis décider de la suite.',
        context: 'Il a téléchargé votre livre blanc hier et accepte un appel de 10 minutes.',
        offer: {
          name: 'MaintiQ',
          description: 'Logiciel de maintenance préventive : interventions, stocks de pièces, alertes.',
          price: 'À partir de 390 € HT par mois',
        },
        prospect: {
          name: 'Julien Moreau',
          role: 'Responsable maintenance',
          company: 'Plastiforme',
          companySize: 'Usine de 210 salariés',
          publicProfile: 'Fabricant de pièces plastiques pour l\'automobile.',
        },
        need: 'Arrêter de suivre les interventions sur papier et réduire les pannes imprévues.',
        budget: 'Ne connaît pas le budget ; « ça dépendra du directeur ».',
        objections: ['Je me renseigne juste pour l\'instant.', 'Je ne sais pas qui décidera.'],
        constraints: ['Parle volontiers et part dans les détails techniques si on le laisse faire.'],
        hiddenFacts: [
          'Le directeur d\'usine décide ; il valide les achats en comité le premier lundi du mois.',
          'Une panne a arrêté une ligne 3 jours le mois dernier.',
          'Le projet ne démarrera pas avant six mois.',
        ],
        successCriteria: [
          'Besoin, budget, décideur et délai abordés.',
          'Le vendeur recentre l\'échange quand il s\'égare.',
          'Une suite adaptée est proposée, incluant le directeur d\'usine.',
        ],
        endConditions: ['Termine l\'appel après 10 minutes.'],
      },
      en: {
        title: 'Qualification: inbound lead for maintenance software',
        summary: 'Qualify a friendly manager who is not the decision maker.',
        industry: 'Manufacturing',
        objective: 'Qualify need, budget, decision maker and timeline, then decide on the next step.',
        context: 'He downloaded your white paper yesterday and accepted a 10-minute call.',
        offer: {
          name: 'MaintiQ',
          description: 'Preventive maintenance software: work orders, spare parts stock, alerts.',
          price: 'From $420 per month',
        },
        prospect: {
          name: 'Jason Moore',
          role: 'Maintenance manager',
          company: 'Plastiform',
          companySize: 'Plant with 210 employees',
          publicProfile: 'Manufacturer of plastic parts for the automotive industry.',
        },
        need: 'Stop tracking work orders on paper and reduce unplanned downtime.',
        budget: 'Does not know the budget; "it will depend on the plant manager".',
        objections: ["I'm just looking for now.", "I don't know who will decide."],
        constraints: ['Talks freely and goes into technical details if allowed to.'],
        hiddenFacts: [
          'The plant manager decides; purchases are approved at a committee on the first Monday of each month.',
          'A breakdown stopped a production line for 3 days last month.',
          'The project will not start for six months.',
        ],
        successCriteria: [
          'Need, budget, decision maker and timeline are covered.',
          'The seller steers the call back when it drifts.',
          'A fitting next step is proposed, including the plant manager.',
        ],
        endConditions: ['Ends the call after 10 minutes.'],
      },
    },
  },
  {
    key: 'negotiation-annual-contract',
    shared: {
      family: 'negotiation',
      difficulty: 'expert',
      channel: 'video',
      estimatedMinutes: 15,
      personality: 'skeptical',
      decisionPower: 'decider',
      skillWeights: { negotiation: 5, value_proposition: 4, objection_handling: 4, silence_management: 3, reformulation: 3, closing: 4 },
    },
    text: {
      fr: {
        title: 'Négociation : renouvellement d\'un contrat annuel',
        summary: 'Un client exige 20 % de remise et menace de partir ; préserver la valeur du contrat.',
        industry: 'Logiciel marketing',
        objective: 'Renouveler le contrat avec 10 % de remise au maximum, chaque concession obtenue contre une contrepartie.',
        context: 'Le contrat expire dans 30 jours. Le client a demandé ce rendez-vous « pour parler du prix ».',
        offer: {
          name: 'Automatisation marketing, offre Business',
          description: 'Emailing, scénarios automatisés, 50 000 contacts, support prioritaire.',
          price: '24 000 € HT par an',
        },
        prospect: {
          name: 'Nadia Rousseau',
          role: 'Directrice marketing',
          company: 'Maison Verdier',
          companySize: '320 salariés',
          publicProfile: 'Cliente depuis 3 ans, utilisation en hausse de 30 % cette année.',
        },
        need: 'Tenir un budget marketing réduit sans perdre ses campagnes automatisées.',
        budget: 'Son budget logiciel baisse de 10 % en 2026.',
        objections: [
          'Sans 20 % de remise, on passe chez votre concurrent.',
          'Vos prix ont augmenté deux fois en trois ans.',
          'Le support a été lent cet été.',
        ],
        constraints: ['Teste les nerfs du vendeur ; respecte la fermeté polie.'],
        hiddenFacts: [
          'Changer d\'outil lui coûterait 3 mois de migration et une prestation d\'environ 15 000 €.',
          'Elle a besoin du nouveau module de SMS pour une campagne en mars.',
          'Un engagement sur deux ans est acceptable pour elle.',
        ],
        successCriteria: [
          'Le vendeur ne cède rien sans contrepartie (durée, paiement annuel, étude de cas).',
          'Le coût du changement est rendu visible.',
          'Remise finale de 10 % au maximum.',
          'Accord explicite sur les termes.',
        ],
        endConditions: ['Accepte un accord équilibré ; met fin à l\'échange si le vendeur cède 20 % immédiatement.'],
      },
      en: {
        title: 'Negotiation: annual contract renewal',
        summary: 'A client demands a 20% discount and threatens to leave; protect the value of the contract.',
        industry: 'Marketing software',
        objective: 'Renew the contract with at most a 10% discount, every concession traded for something.',
        context: 'The contract ends in 30 days. The client asked for this meeting "to talk about price".',
        offer: {
          name: 'Marketing automation, Business plan',
          description: 'Email marketing, automated journeys, 50,000 contacts, priority support.',
          price: '$26,000 per year',
        },
        prospect: {
          name: 'Nadia Ross',
          role: 'Marketing director',
          company: 'Verdier Home',
          companySize: '320 employees',
          publicProfile: 'Client for 3 years, usage up 30% this year.',
        },
        need: 'Stay within a reduced marketing budget without losing automated campaigns.',
        budget: 'Her software budget drops by 10% in 2026.',
        objections: [
          'Without a 20% discount, we switch to your competitor.',
          'Your prices went up twice in three years.',
          'Support was slow this summer.',
        ],
        constraints: ["Tests the seller's nerves; respects polite firmness."],
        hiddenFacts: [
          'Switching would cost her 3 months of migration and about $16,000 in services.',
          'She needs the new SMS module for a campaign in March.',
          'A two-year commitment is acceptable to her.',
        ],
        successCriteria: [
          'The seller gives nothing without something in return (term, annual payment, case study).',
          'The cost of switching is made visible.',
          'Final discount of 10% at most.',
          'Explicit agreement on the terms.',
        ],
        endConditions: ['Accepts a balanced deal; ends the call if the seller gives 20% right away.'],
      },
    },
  },
  {
    key: 'follow-up-silent-quote',
    shared: {
      family: 'follow_up',
      difficulty: 'beginner',
      channel: 'phone',
      estimatedMinutes: 6,
      personality: 'busy',
      decisionPower: 'decider',
      skillWeights: { opening: 4, questioning: 4, active_listening: 3, objection_handling: 3, closing: 5, clarity: 3 },
    },
    text: {
      fr: {
        title: 'Relance : devis sans réponse depuis 10 jours',
        summary: 'Relancer un dirigeant pressé sans le braquer et découvrir ce qui bloque.',
        industry: 'Immobilier',
        objective: 'Découvrir le vrai frein et obtenir une date de décision.',
        context: 'Devis envoyé il y a 10 jours après un bon premier rendez-vous ; deux e-mails sans réponse.',
        offer: {
          name: 'Génération de leads vendeurs',
          description: 'Campagnes locales et prise de rendez-vous avec des propriétaires vendeurs.',
          price: '1 200 € HT par mois, engagement de 3 mois',
        },
        prospect: {
          name: 'Laurent Petit',
          role: 'Directeur d\'agence',
          company: 'Petit Immobilier',
          companySize: '2 agences, 9 conseillers',
          publicProfile: 'Agence indépendante à Bordeaux ; recrute des conseillers sur LinkedIn.',
        },
        need: 'Rentrer davantage de mandats de vente.',
        budget: 'Le montant ne pose pas de problème s\'il voit des rendez-vous rapidement.',
        objections: ['Je n\'ai pas eu le temps de regarder.', 'Rappelez-moi le mois prochain.'],
        constraints: ['Décroche entre deux visites ; agacé par les relances génériques.'],
        hiddenFacts: [
          'Il compare avec une autre agence de prospection, moins chère de 200 €.',
          'Il craint que ses conseillers ne rappellent pas les leads assez vite.',
        ],
        successCriteria: [
          'La relance apporte une information nouvelle, pas seulement « avez-vous vu le devis ».',
          'Le frein réel est découvert.',
          'Une date de décision est obtenue.',
        ],
        endConditions: ['Raccroche au bout de 2 minutes si la relance est générique.'],
      },
      en: {
        title: 'Follow-up: quote unanswered for 10 days',
        summary: 'Follow up with a busy director without irritating him and find out what is blocking.',
        industry: 'Real estate',
        objective: 'Uncover the real blocker and get a decision date.',
        context: 'Quote sent 10 days ago after a good first meeting; two emails unanswered.',
        offer: {
          name: 'Seller lead generation',
          description: 'Local campaigns and booked appointments with homeowners who want to sell.',
          price: '$1,300 per month, 3-month commitment',
        },
        prospect: {
          name: 'Larry Pettit',
          role: 'Agency director',
          company: 'Pettit Realty',
          companySize: '2 offices, 9 agents',
          publicProfile: 'Independent agency in Austin; recruiting agents on LinkedIn.',
        },
        need: 'Win more listings.',
        budget: 'The amount is fine if he sees meetings quickly.',
        objections: ["I haven't had time to look at it.", 'Call me back next month.'],
        constraints: ['Picks up between viewings; annoyed by generic follow-ups.'],
        hiddenFacts: [
          'He is comparing with another lead-generation agency that is $200 cheaper.',
          'He worries his agents will not call leads back fast enough.',
        ],
        successCriteria: [
          'The follow-up brings something new, not just "did you see the quote".',
          'The real blocker is uncovered.',
          'A decision date is obtained.',
        ],
        endConditions: ['Hangs up after 2 minutes if the follow-up is generic.'],
      },
    },
  },
  {
    key: 'demo-crm-small-business',
    shared: {
      family: 'demo',
      difficulty: 'intermediate',
      channel: 'video',
      estimatedMinutes: 12,
      personality: 'skeptical',
      decisionPower: 'decider',
      skillWeights: { needs_discovery: 4, value_proposition: 5, objection_handling: 4, clarity: 4, active_listening: 3, closing: 4 },
    },
    text: {
      fr: {
        title: 'Démonstration : CRM pour une PME qui a déjà échoué avec un CRM',
        summary: 'Adapter la démo à deux besoins concrets d\'un dirigeant sceptique.',
        industry: 'Négoce B2B',
        objective: 'Faire une démonstration ciblée sur ses besoins et obtenir un essai de 14 jours avec son équipe.',
        context: 'Démo prévue de 20 minutes ; il a prévenu : « on a déjà essayé un CRM, personne ne l\'a utilisé ».',
        offer: {
          name: 'Blackstart CRM',
          description: 'Pipeline visuel, relances automatiques, appels et e-mails suivis, application mobile.',
          price: '39 € HT par utilisateur et par mois',
        },
        prospect: {
          name: 'Philippe Garnier',
          role: 'Dirigeant',
          company: 'Garnier Fournitures',
          companySize: '35 salariés, 6 commerciaux',
          publicProfile: 'Grossiste en fournitures de bureau pour entreprises.',
        },
        need: 'Voir où en sont les affaires de ses commerciaux sans leur demander chaque lundi.',
        budget: 'Prêt à payer si l\'équipe l\'utilise vraiment.',
        objections: [
          'On a déjà essayé un CRM, personne ne l\'a utilisé.',
          'Mes commerciaux détestent saisir des données.',
          'C\'est encore un abonnement de plus.',
        ],
        constraints: ['Coupe la parole si la démo devient une visite guidée de toutes les fonctions.'],
        hiddenFacts: [
          'L\'ancien CRM a échoué parce qu\'il fallait 12 champs pour créer une affaire.',
          'Il a perdu un gros client l\'an dernier faute de relance.',
          'Son meilleur commercial est prêt à tester.',
        ],
        successCriteria: [
          'Deux besoins découverts avant de montrer l\'écran.',
          'La démo montre seulement ce qui répond à ces besoins.',
          'L\'objection d\'adoption est traitée avec un plan concret.',
          'Essai de 14 jours accepté avec une date de point.',
        ],
        endConditions: ['Accepte l\'essai si la démo a répondu à ses deux besoins.'],
      },
      en: {
        title: 'Demo: CRM for a small business that already failed with a CRM',
        summary: 'Tailor the demo to two concrete needs of a skeptical owner.',
        industry: 'B2B wholesale',
        objective: 'Run a demo focused on his needs and get a 14-day trial with his team.',
        context: 'A 20-minute demo is booked; he warned you: "we tried a CRM before, nobody used it".',
        offer: {
          name: 'Blackstart CRM',
          description: 'Visual pipeline, automatic follow-ups, tracked calls and emails, mobile app.',
          price: '$42 per user per month',
        },
        prospect: {
          name: 'Phil Garner',
          role: 'Owner',
          company: 'Garner Supplies',
          companySize: '35 employees, 6 sales reps',
          publicProfile: 'Office supplies wholesaler for businesses.',
        },
        need: 'See where his reps\' deals stand without asking them every Monday.',
        budget: 'Willing to pay if the team actually uses it.',
        objections: [
          'We tried a CRM before, nobody used it.',
          'My reps hate entering data.',
          "It's yet another subscription.",
        ],
        constraints: ['Interrupts if the demo turns into a tour of every feature.'],
        hiddenFacts: [
          'The old CRM failed because creating a deal took 12 fields.',
          'He lost a big client last year because nobody followed up.',
          'His best rep is ready to try it.',
        ],
        successCriteria: [
          'Two needs uncovered before sharing the screen.',
          'The demo shows only what answers those needs.',
          'The adoption objection is handled with a concrete plan.',
          '14-day trial accepted with a review date.',
        ],
        endConditions: ['Accepts the trial if the demo answered his two needs.'],
      },
    },
  },
];

export const CATALOG: CatalogEntry[] = ENTRIES.flatMap((entry) =>
  (['fr', 'en'] as const).map((language) => {
    const t = entry.text[language];
    const { title, summary, industry, prospect, ...rest } = t;
    const { personality, decisionPower, skillWeights, ...meta } = entry.shared;
    return {
      slug: `${entry.key}-${language}`,
      meta: { ...meta, title, summary, industry, language },
      content: { ...rest, prospect: { ...prospect, personality, decisionPower }, skillWeights },
    };
  }),
);
