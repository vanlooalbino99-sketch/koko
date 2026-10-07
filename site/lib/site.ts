// Contenu du site : coordonnées, services, chiffres, témoignages.
// TEXTES PROVISOIRES — tout ce qui s'affiche sur le site est ici : remplacez-les sans toucher aux pages.

export const site = {
  name: 'Blackstart AI',
  shortName: 'Blackstart',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/$/, ''),
  tagline: 'Ne perdez plus jamais un appel client.',
  description:
    "Blackstart AI installe des assistants téléphoniques et des automatisations IA pour les entreprises locales : chaque appel est décroché, chaque demande qualifiée, chaque rendez-vous pris, 24 h/24.",
  email: 'bonjour@blackstart.fr',
  phone: '+33 4 00 00 00 00',
  phoneDisplay: '04 00 00 00 00',
  address: { street: '1 place de la République', postalCode: '69002', city: 'Lyon', country: 'FR' },
  hours: 'Du lundi au vendredi, 9 h – 18 h',
  socials: { linkedin: 'https://www.linkedin.com/company/blackstart-ai' },
  locale: 'fr_FR',
} as const;

export const nav = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/offres', label: 'Offres' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
] as const;

export type Service = {
  slug: string;
  icon: 'phone' | 'calendar' | 'message' | 'chart';
  title: string;
  summary: string;
  description: string;
  features: string[];
  price: string;
};

export const services: Service[] = [
  {
    slug: 'assistant-telephonique',
    icon: 'phone',
    title: 'Assistant téléphonique IA',
    summary: 'Un standard qui décroche à chaque appel, même le soir et le week-end.',
    description:
      "Votre assistant répond avec votre ton, renseigne vos clients, filtre les démarchages et vous transmet un résumé clair de chaque appel. Plus aucun client ne tombe sur la messagerie.",
    features: ['Réponse 24 h/24, 7 j/7', 'Voix naturelle, à votre image', 'Résumé de chaque appel par SMS ou e-mail', 'Transfert vers vous en cas d’urgence'],
    price: 'à partir de 149 € / mois',
  },
  {
    slug: 'prise-de-rendez-vous',
    icon: 'calendar',
    title: 'Prise de rendez-vous automatique',
    summary: 'Vos clients réservent seuls, votre agenda se remplit sans un coup de fil.',
    description:
      "Au téléphone, sur votre site ou par SMS, l’IA propose vos créneaux libres, confirme et envoie les rappels. Les absences baissent et votre équipe se concentre sur son métier.",
    features: ['Synchronisé avec votre agenda', 'Confirmations et rappels automatiques', 'Annulation et report en autonomie', 'Moins de rendez-vous manqués'],
    price: 'à partir de 99 € / mois',
  },
  {
    slug: 'relances-automatisees',
    icon: 'message',
    title: 'Relances et suivi client',
    summary: 'Devis, avis Google, relances : les messages partent au bon moment.',
    description:
      "Des scénarios simples relancent les devis en attente, demandent un avis après chaque intervention et réveillent les clients inactifs, par SMS ou e-mail.",
    features: ['Relance des devis non signés', 'Collecte d’avis Google', 'Messages personnalisés', 'Tableau de suivi des résultats'],
    price: 'à partir de 79 € / mois',
  },
  {
    slug: 'audit-et-strategie',
    icon: 'chart',
    title: 'Audit et accompagnement',
    summary: 'On mesure ce que vous perdez aujourd’hui, puis on le corrige avec vous.',
    description:
      "En 20 minutes, nous chiffrons les appels et demandes que vous manquez. Nous installons ensuite la solution, formons votre équipe et suivons les résultats chaque mois.",
    features: ['Audit gratuit de 20 minutes', 'Installation clé en main', 'Formation de votre équipe', 'Point mensuel sur les résultats'],
    price: 'Audit offert',
  },
];

export const stats = [
  { value: '62 %', label: 'des appels manqués ne rappellent jamais' },
  { value: '24/7', label: 'votre standard toujours joignable' },
  { value: '< 1 s', label: 'pour décrocher, à chaque appel' },
  { value: '14 j', label: 'pour être opérationnel' },
] as const;

export const steps = [
  { title: 'Audit gratuit', text: 'En 20 minutes, nous mesurons les appels et demandes que vous perdez aujourd’hui.' },
  { title: 'Mise en place', text: 'Nous configurons l’assistant à votre image, avec vos horaires, vos services et vos tarifs.' },
  { title: 'Mise en service', text: 'Votre ligne est redirigée, votre équipe est formée, rien ne change pour vos clients.' },
  { title: 'Suivi mensuel', text: 'Chaque mois, un point sur les appels traités, les rendez-vous pris et les améliorations.' },
] as const;

export const sectors = ['Immobilier', 'Artisans et BTP', 'Santé et bien-être', 'Commerce', 'Services aux entreprises'] as const;

export const testimonials = [
  { quote: 'Avant, on ratait les appels pendant les chantiers. Aujourd’hui chaque demande arrive résumée sur mon téléphone.', name: 'Julien M.', role: 'Plombier, Villeurbanne' },
  { quote: 'Les patients prennent rendez-vous le soir, sans appeler. Le secrétariat respire enfin.', name: 'Dr Sophie B.', role: 'Cabinet dentaire, Lyon' },
  { quote: 'Mise en place en deux semaines, et des mandats signés grâce à des appels qu’on aurait perdus.', name: 'Marc D.', role: 'Agence immobilière, Lyon' },
] as const;

export const values = [
  { title: 'Concret', text: 'Des résultats mesurés en appels décrochés et en rendez-vous pris, pas en promesses.' },
  { title: 'Proche', text: 'Une équipe joignable, qui connaît votre métier et vos clients.' },
  { title: 'Transparent', text: 'Des tarifs clairs, sans engagement longue durée, et vos données restent les vôtres.' },
] as const;

export const faq = [
  { q: 'Mes clients sauront-ils qu’ils parlent à une IA ?', a: 'L’assistant se présente comme l’assistant de votre entreprise. Il transfère vers vous dès qu’une demande le nécessite.' },
  { q: 'Faut-il changer de numéro ?', a: 'Non. Vos appels sont simplement redirigés vers l’assistant quand vous ne décrochez pas, ou en permanence, selon votre choix.' },
  { q: 'Combien de temps pour démarrer ?', a: 'Environ deux semaines entre l’audit et la mise en service, formation comprise.' },
  { q: 'Y a-t-il un engagement ?', a: 'Les offres sont mensuelles et résiliables à tout moment.' },
] as const;

// Offres et tarifs (page /offres et aperçu sur l'accueil). Montants en euros, utilisés aussi par le CRM.
export type Pack = {
  slug: string;
  name: string;
  pitch: string;
  audience?: string[];
  features: string[];
  /** Mise en place : montant (pour le CRM) et libellé affiché. */
  setup: number;
  setupLabel: string;
  monthly: number;
  monthlyLabel: string;
  featured?: boolean;
};

export const packs: Pack[] = [
  {
    slug: 'business-starter',
    name: 'Business Starter',
    pitch: 'Une présence en ligne professionnelle, prête à recevoir vos clients.',
    audience: ['Artisans', 'Consultants', 'Coaches', 'Petites entreprises'],
    features: ['Site web professionnel', 'Formulaire de contact', 'Prise de rendez-vous', 'Google Maps', 'Optimisation mobile', 'Hébergement', 'SSL', 'Intégration CRM'],
    setup: 990, setupLabel: '990 €',
    monthly: 49, monthlyLabel: '49 €',
  },
  {
    slug: 'acquisition-pro',
    name: 'Acquisition Pro',
    pitch: 'Pour les entreprises qui veulent générer des leads.',
    features: ['Site web premium', 'Système de prise de RDV', 'CRM', 'Pipeline commercial', 'E-mails automatiques', 'Dashboard commercial', 'Synchronisation calendrier'],
    setup: 1990, setupLabel: '1 990 €',
    monthly: 99, monthlyLabel: '99 €',
  },
  {
    slug: 'scale',
    name: 'Scale',
    pitch: 'Toute la machine commerciale : chaque lead qualifié, relancé et suivi jusqu’à la signature.',
    features: ['Site premium', 'CRM complet', 'Pipeline commercial', 'Qualification de leads', 'Automatisation des e-mails', 'Relances automatiques', 'Reporting dirigeant', 'Tableau de bord', 'Gestion des commerciaux'],
    setup: 3490, setupLabel: '3 490 €',
    monthly: 199, monthlyLabel: '199 €',
    featured: true,
  },
  {
    slug: 'entreprise',
    name: 'Entreprise',
    pitch: 'Pour les PME qui veulent un outil taillé sur mesure.',
    features: ['CRM sur mesure', 'Multi-utilisateurs', 'Gestion clients', 'Gestion des devis', 'Signature électronique', 'Facturation', 'Reporting avancé', 'Formation', 'Support prioritaire'],
    setup: 5000, setupLabel: '5 000 € à 15 000 €',
    monthly: 299, monthlyLabel: '299 à 499 €',
  },
];

/** Libellé d'une offre dans le formulaire de RDV et dans le CRM. */
export const packLabel = (p: Pack) => `Pack ${p.name} (${p.setupLabel} + ${p.monthlyLabel}/mois)`;

// Offre en abonnement, bientôt disponible : le CRM Blackstart prêt à l'emploi, sans développement spécifique.
export const saas = {
  includes: ['CRM', 'Agenda', 'Pipeline', 'E-mails', 'Prise de RDV'],
  plans: [
    { name: 'Solo', price: '49 €' },
    { name: 'Pro', price: '99 €' },
    { name: 'Business', price: '199 €' },
  ],
};
