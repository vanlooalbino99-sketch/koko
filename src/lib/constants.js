// Référentiels métier — identiques à la v3 pour rester compatibles avec les données existantes.

export const STORAGE_KEY = 'blackstart-data-v1';
export const UI_KEY = 'blackstart-ui-v4';
export const LEGACY_UI_KEY = 'blackstart-ui-v3';

/* Statuts du pipeline (ordre = progression commerciale). */
export const STATUTS = {
  a_appeler: { label: 'À appeler', short: 'À appeler', tone: 'blue', stage: 0 },
  injoignable: { label: 'Injoignable', short: 'Injoignable', tone: 'orange', stage: 0 },
  rdv_pris: { label: 'RDV pris', short: 'RDV', tone: 'sky', stage: 1 },
  audit_realise: { label: 'Audit réalisé', short: 'Audit', tone: 'violet', stage: 2 },
  proposition_envoyee: { label: 'Proposition envoyée', short: 'Proposition', tone: 'indigo', stage: 3 },
  client_signe: { label: 'Client actif', short: 'Client', tone: 'emerald', stage: 4 },
  resilie: { label: 'Résilié', short: 'Résilié', tone: 'rose', stage: -1 },
  perdu: { label: 'Perdu / Refus', short: 'Perdu', tone: 'slate', stage: -1 },
};
export const STATUT_ORDER = ['a_appeler', 'injoignable', 'rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe', 'resilie', 'perdu'];
export const PIPELINE_COLUMNS = ['a_appeler', 'injoignable', 'rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe', 'perdu'];
export const CLOSED_STATUTS = ['client_signe', 'perdu', 'resilie'];

export const DEVIS_STATUTS = {
  brouillon: { label: 'Brouillon', tone: 'slate' },
  envoye: { label: 'Envoyé', tone: 'sky' },
  accepte: { label: 'Accepté', tone: 'emerald' },
  refuse: { label: 'Refusé', tone: 'rose' },
  expire: { label: 'Expiré', tone: 'orange' },
};

export const FACTURE_STATUTS = {
  a_payer: { label: 'À payer', tone: 'amber' },
  payee: { label: 'Payée', tone: 'emerald' },
  annulee: { label: 'Annulée', tone: 'slate' },
};

export const TVA_RATES = [0, 5.5, 10, 20];

export const SECTEURS = ['Immobilier', 'Artisans / BTP', 'Santé & bien-être', 'Commerce / e-commerce', 'Services B2B', 'Autre'];
export const CANAUX = ['Cold calling', 'Réseau Orange Pro', 'LinkedIn', 'Terrain', 'Recommandation', 'Partenaire'];

export const PRIORITES = {
  haute: { label: 'Chaud', tone: 'rose', rank: 3 },
  moyenne: { label: 'Tiède', tone: 'amber', rank: 2 },
  basse: { label: 'Froid', tone: 'sky', rank: 1 },
};

/* Résultats d'appel → statut + délai de relance par défaut (jours). */
export const OUTCOMES = [
  { id: 'injoignable', label: 'Injoignable', statut: 'injoignable', relanceDays: 2, tone: 'orange' },
  { id: 'rappel', label: 'À rappeler plus tard', statut: 'a_appeler', relanceDays: 5, tone: 'blue' },
  { id: 'rdv_pris', label: 'RDV obtenu', statut: 'rdv_pris', relanceDays: 3, tone: 'sky' },
  { id: 'audit_realise', label: 'Audit réalisé', statut: 'audit_realise', relanceDays: 3, tone: 'violet' },
  { id: 'proposition_envoyee', label: 'Proposition envoyée', statut: 'proposition_envoyee', relanceDays: 5, tone: 'indigo' },
  { id: 'client_signe', label: 'Client signé 🎉', statut: 'client_signe', relanceDays: 30, tone: 'emerald' },
  { id: 'perdu', label: 'Perdu / Refus', statut: 'perdu', relanceDays: null, tone: 'slate' },
];

export const TASK_PRIORITES = {
  haute: { label: 'Haute', tone: 'rose', rank: 3 },
  moyenne: { label: 'Moyenne', tone: 'amber', rank: 2 },
  basse: { label: 'Basse', tone: 'sky', rank: 1 },
};

export const DEFAULT_SCRIPT = [
  {
    title: "1. Contrôle de l'état — 4 premières secondes",
    subtitle: 'Ton, rythme, posture',
    points: [
      "Sourire avant de composer — ça s'entend dans la voix.",
      'Débit dynamique, assuré, jamais hésitant sur les 3 premiers mots.',
      "Phrase d'ouverture : « Bonjour [Prénom], [Votre nom] de Blackstart AI. »",
      'Ne jamais demander la permission de parler — affirmer, puis enchaîner.',
    ],
  },
  {
    title: '2. Accroche & Rapport',
    subtitle: 'Créer la ligne droite',
    points: [
      "« J'aide les [secteur] à ne plus perdre de clients quand la ligne est occupée. »",
      'Une seule idée, pas un pitch complet — juste assez pour justifier la question suivante.',
      "Transition immédiate vers une question ouverte — ne jamais laisser un silence après l'accroche.",
    ],
  },
  {
    title: '3. Renseignement — Questions ouvertes',
    subtitle: 'Faire parler, pas vendre',
    points: [
      "« Aujourd'hui, quand un client appelle en dehors des horaires, que se passe-t-il ? »",
      '« Vous diriez que vous ratez combien de demandes par semaine ? »',
      "Écouter la réponse à 100% — c'est elle qui devient votre argument de closing.",
    ],
  },
  {
    title: '4. La Boucle — traitement des objections',
    subtitle: 'Reconnaître, isoler, revenir sur la ligne',
    points: [
      'Principe : jamais dévier. Chaque objection ramène vers le même point de closing.',
      '« Je comprends. C\'est justement pour ça que [contre-argument]. » — puis reposer la question de closing.',
      "« Pas le temps » → « L'audit ne prend que 20 min, gratuit. Mardi ou jeudi ? »",
      "« Pas de budget » → « L'audit ne coûte rien — vous déciderez après avoir vu le chiffrage. »",
      "« Envoyez une doc » → « Une doc générique ne dira pas ce que ça donne chez vous — 20 min suffisent. »",
    ],
  },
  {
    title: '5. Les 3 Dix — avant de closer',
    subtitle: 'Le prospect doit être à 10/10 sur les 3',
    points: [
      '① Le produit — logique + émotion : voit-il concrètement le gain ?',
      '② Vous — vous fait-il confiance, vous en particulier ?',
      "③ L'entreprise — croit-il en Blackstart AI comme partenaire fiable ?",
      'Si un des 3 est en dessous de 10 → revenir en boucle avant de closer, ne jamais forcer.',
    ],
  },
  {
    title: '6. Closing — prise de RDV',
    subtitle: 'Langage assumé, jamais hésitant',
    points: [
      "« Je vous propose mardi 9h ou jeudi 17h pour l'audit — qu'est-ce qui vous arrange ? »",
      'Ne jamais dire « voudriez-vous » — toujours affirmer et laisser le choix entre deux options.',
      "Confirmer l'e-mail, remercier, raccrocher — ne pas sur-vendre après le oui.",
    ],
  },
];

export const DEFAULT_TEMPLATES = [
  {
    id: 'premier_contact',
    label: 'Premier contact',
    subject: '{entreprise} — Blackstart AI, ne perdez plus un appel',
    body: `Bonjour {contact},

Je me permets de vous contacter au sujet de la gestion de vos appels entrants chez {entreprise}.

Blackstart AI aide les entreprises du secteur {secteur} à ne plus manquer un client quand la ligne est occupée ou en dehors des horaires d'ouverture.

Seriez-vous disponible pour un audit gratuit de 20 minutes cette semaine ?

Cordialement,
{expediteur}`,
  },
  {
    id: 'relance_rdv',
    label: 'Relance après appel',
    subject: 'Suite à notre échange — {entreprise}',
    body: `Bonjour {contact},

Merci pour notre échange téléphonique. Comme convenu, je reviens vers vous au sujet de {entreprise}.

N'hésitez pas à me contacter si vous avez la moindre question d'ici notre prochain point.

Cordialement,
{expediteur}`,
  },
  {
    id: 'confirmation_rdv',
    label: 'Confirmation de RDV',
    subject: 'Confirmation de votre audit — {entreprise}',
    body: `Bonjour {contact},

Je vous confirme notre rendez-vous pour l'audit gratuit de {entreprise}{rdv}.

Cet échange de 20 minutes nous permettra d'identifier précisément vos besoins et de vous chiffrer une solution adaptée.

À très bientôt,
{expediteur}`,
  },
  {
    id: 'envoi_devis',
    label: 'Envoi de devis',
    subject: 'Votre devis Blackstart AI — {entreprise}',
    body: `Bonjour {contact},

Suite à notre échange, veuillez trouver ci-joint le devis établi pour {entreprise}.

Je reste à votre disposition pour toute question ou ajustement.

Cordialement,
{expediteur}`,
  },
  {
    id: 'relance_devis',
    label: 'Relance devis sans réponse',
    subject: 'Votre devis {entreprise} — toujours disponible',
    body: `Bonjour {contact},

Je me permets de revenir vers vous au sujet du devis transmis récemment pour {entreprise}.

Il reste valable et je suis disponible pour en discuter ou l'ajuster si besoin.

Cordialement,
{expediteur}`,
  },
  {
    id: 'envoi_facture',
    label: 'Envoi de facture',
    subject: 'Votre facture Blackstart AI — {entreprise}',
    body: `Bonjour {contact},

Veuillez trouver ci-joint votre facture. Vous pouvez la régler directement via le lien de paiement ci-dessous.

{paiement}

Merci pour votre confiance,
{expediteur}`,
  },
  {
    id: 'libre',
    label: 'Message libre',
    subject: '{entreprise}',
    body: `Bonjour {contact},

`,
  },
];

export const TEMPLATE_VARS = ['entreprise', 'contact', 'secteur', 'ville', 'expediteur', 'rdv', 'paiement'];

/* Recherche de leads via l'API officielle — suggestions d'activités. */
export const API_SUGGESTIONS = ['agence immobilière', 'plombier', 'électricien', 'cabinet dentaire', 'kinésithérapeute', 'expert-comptable', 'restaurant', 'menuisier'];

/* Import CSV — champs cibles + détection automatique des en-têtes. */
export const IMPORT_FIELDS = [
  { id: 'ignore', label: 'Ignorer cette colonne' },
  { id: 'entreprise', label: 'Entreprise *' },
  { id: 'secteur', label: 'Secteur' },
  { id: 'contact', label: 'Contact' },
  { id: 'telephone', label: 'Téléphone' },
  { id: 'email', label: 'Email' },
  { id: 'ville', label: 'Ville' },
  { id: 'canal', label: 'Canal' },
  { id: 'notes', label: 'Notes' },
];
export const IMPORT_DETECT = [
  { keys: ['entreprise', 'société', 'societe', 'company', 'nom', 'raison sociale', 'denomination', 'dénomination'], field: 'entreprise' },
  { keys: ['secteur', 'activité', 'activite', 'category', 'catégorie'], field: 'secteur' },
  { keys: ['contact', 'interlocuteur', 'responsable', 'dirigeant'], field: 'contact' },
  { keys: ['téléphone', 'telephone', 'tel', 'phone', 'mobile'], field: 'telephone' },
  { keys: ['email', 'e-mail', 'mail', 'courriel'], field: 'email' },
  { keys: ['ville', 'commune', 'city'], field: 'ville' },
  { keys: ['canal', 'source'], field: 'canal' },
  { keys: ['note', 'notes', 'commentaire', 'remarque'], field: 'notes' },
];

export const DEFAULT_SETTINGS = {
  targetCallsWeek: 175,
  targetRdvWeek: 10,
  targetCaMonth: 5000,
  targetMrr: 3000,
  workStart: 8,
  workEnd: 19,
  theme: { accent: '#387CD5', bg: '#0A1220', hover: '#387CD5', text: '#EAF1FB', selection: '#387CD5', gauge: '#2868BC' },
};

export const DEFAULT_COMPANY = {
  nom: 'Blackstart AI',
  adresse: '',
  siret: '',
  ein: '',
  tvaIntra: '',
  email: '',
  telephone: '',
  site: '',
  expediteur: '',
  iban: '',
  bic: '',
  mentions: 'Paiement à 30 jours. Pénalités de retard : 3 fois le taux d\'intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 €.',
  paymentLinks: { payoneer: '', stripe: '', paypal: '' },
};
