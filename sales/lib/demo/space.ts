import { createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { and, eq, inArray, sql, type SQL } from 'drizzle-orm';
import { hashToken } from '../auth/service.ts';
import { connectPglite, connectPostgres, getDb as getMainDb, MIGRATIONS_FOLDER, type Db } from '../db/client.ts';
import {
  billingAccounts,
  creditDebits,
  invitations,
  memberships,
  missions,
  organizations,
  scenarioVersions,
  scenarios,
  sessions,
  simulationAnalyses,
  simulations,
  userProfiles,
  users,
  type TranscriptTurn,
} from '../db/schema.ts';
import { finalizeAnalysis, scenariosForSkills } from '../analysis/service.ts';
import { syncCatalog } from '../scenarios/catalog-sync.ts';
import type { ClaudeAnalysis } from '../analysis/schema.ts';
import type { Role, Skill } from '../domain.ts';

// Espace de démonstration : une équipe fictive (« Horizon Conseil ») avec ses appels, ses rapports et ses
// missions, séparée des vraies données et en lecture seule. Aucun chiffre de cet espace n'entre dans les
// statistiques de la plateforme.
//
// En production, il vit dans le schéma Postgres « demo » de la base, à côté des vraies tables sans s'y mêler. Les
// visites le lisent avec le rôle bs_demo_app, qui ne peut que lire et dont le chemin de recherche pointe sur ce
// schéma : même adresse que DATABASE_URL, avec ce rôle et son mot de passe DEMO_DATABASE_PASSWORD. Ailleurs, sans
// ce mot de passe, une base PGlite en mémoire fait l'affaire : elle pèse près de 700 Mo, trop pour la production.
export const DEMO_COOKIE = 'bs_demo';
export const DEMO_READER = 'bs_demo_app';

export function demoDatabaseUrl(): string | null {
  const main = process.env.DATABASE_URL;
  const password = process.env.DEMO_DATABASE_PASSWORD;
  if (!main || !password) return null;
  const url = new URL(main);
  // Le pooler de Supabase attend « rôle.projet » : seul le rôle change.
  url.username = url.username.replace(/^[^.]+/, DEMO_READER);
  url.password = encodeURIComponent(password);
  return url.toString();
}

export function demoSpaceEnabled(): boolean {
  return demoDatabaseUrl() !== null || process.env.NODE_ENV !== 'production';
}

const DAY = 86_400_000;

type Template = {
  slug: string;
  minutes: number;
  transcript: [TranscriptTurn['role'], string][];
  analysis: ClaudeAnalysis;
};

const T = (role: 'seller' | 'prospect', text: string): [TranscriptTurn['role'], string] => [role, text];

// Quatre appels types écrits à la main. Les citations reprennent mot pour mot les répliques du vendeur.
const TEMPLATES: Template[] = [
  {
    slug: 'cold-call-ai-receptionist-fr',
    minutes: 5,
    transcript: [
      T('prospect', 'Plomberie Lefèvre, bonjour.'),
      T('seller', "Bonjour monsieur Lefèvre, Camille de Blackstart. Beaucoup de plombiers lyonnais perdent des appels pendant leurs interventions. Je peux vous prendre trente secondes ?"),
      T('prospect', 'Trente secondes, je pars sur un chantier.'),
      T('seller', 'Merci. Quand vous êtes sous un évier, qui répond au téléphone ?'),
      T('prospect', "Personne, ou ma femme quand elle est au bureau. Sinon ça sonne dans le vide."),
      T('seller', "Et combien d'appels vous ratez comme ça, à peu près, par semaine ?"),
      T('prospect', "Une dizaine. Des fois des urgences, les gens appellent le suivant sur Google."),
      T('seller', 'Une dizaine par semaine, dont des urgences : ça fait combien de chantiers perdus par mois, selon vous ?'),
      T('prospect', 'Deux ou trois, facilement. Mais envoyez-moi plutôt un mail.'),
      T('seller', "Je vous l'envoie, promis. Notre assistant décroche à votre place, prend la demande et vous envoie un SMS avec le nom, l'adresse et l'urgence. C'est 149 euros par mois, sans engagement."),
      T('prospect', 'Mes clients veulent parler à un humain, pas à un robot.'),
      T('seller', "Je comprends. La plupart préfèrent une réponse tout de suite plutôt que la messagerie, et c'est vous qui rappelez avec toutes les infos. Je vous propose quinze minutes de démonstration jeudi à 8 h, avant vos chantiers ?"),
      T('prospect', "Jeudi 8 h, ça peut aller. Pas plus d'un quart d'heure."),
      T('seller', 'Parfait, jeudi 8 h, quinze minutes. Je vous envoie l’invitation et le mail tout de suite. Bonne journée monsieur Lefèvre.'),
    ],
    analysis: {
      summary:
        "Appel court et efficace : l'accroche est claire et le rendez-vous est fixé à jeudi 8 h. Deux informations importantes n'ont pas été cherchées : qui gère le téléphone à partir de janvier et l'offre concurrente.",
      outcome: 'next_step_won',
      skills: [
        { skill: 'opening', score: 74, justification: "Accroche en une phrase, centrée sur un problème du métier, avec une demande de permission.", evidence: [{ turn: 1, quote: 'Beaucoup de plombiers lyonnais perdent des appels pendant leurs interventions' }] },
        { skill: 'questioning', score: 70, justification: 'Trois questions courtes et ouvertes qui font parler le prospect de ses appels manqués.', evidence: [{ turn: 5, quote: "combien d'appels vous ratez comme ça" }, { turn: 7, quote: 'ça fait combien de chantiers perdus par mois' }] },
        { skill: 'needs_discovery', score: 60, justification: "Le volume d'appels manqués est chiffré, mais la situation de sa femme au bureau n'est pas creusée.", evidence: [{ turn: 3, quote: 'qui répond au téléphone' }] },
        { skill: 'objection_handling', score: 64, justification: "L'objection du robot est bien retournée ; la demande de mail est acceptée trop vite.", evidence: [{ turn: 11, quote: 'La plupart préfèrent une réponse tout de suite plutôt que la messagerie' }] },
        { skill: 'closing', score: 80, justification: 'Proposition précise (jour, heure, durée) puis reformulation de l’accord.', evidence: [{ turn: 11, quote: 'quinze minutes de démonstration jeudi à 8 h' }] },
        { skill: 'clarity', score: 76, justification: "L'offre et le prix tiennent en deux phrases simples.", evidence: [{ turn: 9, quote: "C'est 149 euros par mois, sans engagement" }] },
      ],
      successCriteria: [
        { criterion: 'Accroche claire en moins de 30 secondes.', met: true, evidence: 'Le problème est posé dès la première réplique.' },
        { criterion: 'Au moins deux questions sur les appels manqués.', met: true, evidence: 'Qui répond, combien par semaine, combien de chantiers perdus.' },
        { criterion: 'Rendez-vous fixé avec un jour et une heure.', met: true, evidence: 'Jeudi 8 h, quinze minutes.' },
      ],
      hiddenFacts: [
        { fact: "Il estime rater une dizaine d'appels par semaine.", uncovered: true, howToUncover: '' },
        { fact: 'Sa femme gère le téléphone à mi-temps et veut arrêter en janvier.', uncovered: false, howToUncover: 'Et votre femme, elle compte continuer à gérer le téléphone ?' },
        { fact: 'Un concurrent lui a proposé un secrétariat externalisé à 300 € par mois.', uncovered: false, howToUncover: 'Vous avez déjà regardé des solutions pour ne plus rater ces appels ?' },
      ],
      objections: [
        { objection: "Je n'ai pas le temps, je pars sur un chantier.", handling: 'well', comment: 'Trente secondes demandées et respectées.' },
        { objection: 'Envoyez-moi plutôt un mail.', handling: 'partly', comment: 'Accepté sans transformer la demande en question.' },
        { objection: 'Mes clients veulent parler à un humain.', handling: 'well', comment: 'Réponse centrée sur ce que vivent ses clients.' },
      ],
      strengths: ["Accroche courte et tournée vers le prospect.", 'Le coût du problème est chiffré par le prospect lui-même.', 'Rendez-vous précis, reformulé avant de raccrocher.'],
      improvements: [
        { turn: 9, said: "Je vous l'envoie, promis.", better: "Avec plaisir. Pour que ce mail vous serve vraiment : qui gère le téléphone aujourd'hui quand vous êtes en intervention ?", why: 'Accepter le mail trop vite met fin à la découverte.' },
      ],
      focusSkills: ['needs_discovery', 'objection_handling'],
    },
  },
  {
    slug: 'discovery-scheduling-saas-fr',
    minutes: 11,
    transcript: [
      T('seller', "Bonjour Sophie, merci pour votre demande. Vous écriviez que vous perdez trop de temps sur les plannings : qu'est-ce qui se passe concrètement chaque semaine ?"),
      T('prospect', 'Chaque responsable de salle fait son planning sur Excel, puis ça change tout le temps.'),
      T('seller', 'Combien de temps ça prend, par restaurant ?'),
      T('prospect', 'Je dirais six heures par semaine. Et derrière, la paie est souvent fausse.'),
      T('seller', 'Six heures par restaurant, sur quatre restaurants : vingt-quatre heures par semaine. Et ces erreurs de paie, quelles conséquences pour vous ?'),
      T('prospect', "Des salariés mécontents. Notre turnover est autour de 40 %, et les changements de dernière minute n'aident pas."),
      T('seller', "Si je résume : vingt-quatre heures de planning par semaine, des erreurs de paie et un turnover de 40 %. C'est bien ça ?"),
      T('prospect', 'Exactement.'),
      T('seller', 'Qui d’autre que vous participera à la décision ?'),
      T('prospect', 'Mon associé, Paul. Il signe tous les achats et il voudra des chiffres.'),
      T('seller', 'Et vous avez une échéance en tête ?'),
      T('prospect', 'On ouvre un cinquième restaurant en mars. Il faudrait que ce soit réglé avant.'),
      T('seller', 'Je vous propose une démonstration avec Paul, avec le calcul du temps gagné sur vos quatre restaurants. Mardi 14 h, ça vous irait à tous les deux ?'),
      T('prospect', 'Je lui demande, mais mardi devrait aller.'),
    ],
    analysis: {
      summary:
        'Bonne découverte : trois problèmes sont identifiés, dont un chiffré à vingt-quatre heures par semaine, et Paul est repéré comme décideur. La démonstration avec lui reste à confirmer.',
      outcome: 'next_step_won',
      skills: [
        { skill: 'questioning', score: 72, justification: 'Questions ouvertes qui partent du message du prospect et vont vers le concret.', evidence: [{ turn: 0, quote: "qu'est-ce qui se passe concrètement chaque semaine" }] },
        { skill: 'needs_discovery', score: 74, justification: 'Temps perdu, erreurs de paie et turnover sont découverts ; la conséquence financière reste floue.', evidence: [{ turn: 4, quote: 'Et ces erreurs de paie, quelles conséquences pour vous' }] },
        { skill: 'qualification', score: 68, justification: "Le décideur et l'échéance sont trouvés, le budget n'est pas abordé.", evidence: [{ turn: 8, quote: 'Qui d’autre que vous participera à la décision' }] },
        { skill: 'reformulation', score: 78, justification: 'Résumé chiffré et validé par le prospect avant de passer à la suite.', evidence: [{ turn: 6, quote: 'Si je résume : vingt-quatre heures de planning par semaine' }] },
        { skill: 'active_listening', score: 70, justification: 'Le vendeur reprend les mots du prospect et fait le calcul à sa place.', evidence: [{ turn: 4, quote: 'Six heures par restaurant, sur quatre restaurants' }] },
        { skill: 'closing', score: 62, justification: 'Prochaine étape proposée avec Paul, mais non confirmée pendant l’appel.', evidence: [{ turn: 12, quote: 'Mardi 14 h, ça vous irait à tous les deux' }] },
      ],
      successCriteria: [
        { criterion: 'Au moins trois problèmes découverts, dont un chiffré.', met: true, evidence: 'Plannings, paie, turnover ; 24 h par semaine.' },
        { criterion: 'Le rôle de Paul dans la décision est identifié.', met: true, evidence: 'Il signe tous les achats.' },
        { criterion: "L'échéance de mars est découverte.", met: true, evidence: 'Ouverture du cinquième restaurant.' },
        { criterion: 'Une prochaine étape avec Paul est fixée.', met: false, evidence: 'Mardi 14 h proposé, à confirmer.' },
      ],
      hiddenFacts: [
        { fact: 'Plannings sur Excel, 6 heures par semaine et par restaurant.', uncovered: true, howToUncover: '' },
        { fact: 'Turnover de 40 % par an.', uncovered: true, howToUncover: '' },
        { fact: 'Cinquième restaurant en mars, décision avant février.', uncovered: true, howToUncover: '' },
        { fact: 'Paul veut un retour sur investissement chiffré.', uncovered: false, howToUncover: 'De quels chiffres Paul aura besoin pour dire oui ?' },
      ],
      objections: [
        { objection: 'Vous pouvez me montrer directement le logiciel ?', handling: 'not_raised', comment: '' },
        { objection: 'On a déjà regardé deux outils.', handling: 'not_raised', comment: '' },
      ],
      strengths: ['Le coût du problème est calculé avec le prospect.', 'Reformulation validée avant de qualifier.', 'Décideur et échéance trouvés.'],
      improvements: [
        { turn: 12, said: 'Mardi 14 h, ça vous irait à tous les deux ?', better: 'On bloque mardi 14 h maintenant et vous transférez l’invitation à Paul, ou vous préférez que je l’appelle directement ?', why: 'Une étape « à confirmer » glisse souvent : mieux vaut la verrouiller pendant l’appel.' },
      ],
      focusSkills: ['closing', 'qualification'],
    },
  },
  {
    slug: 'objections-website-redesign-fr',
    minutes: 9,
    transcript: [
      T('prospect', "Honnêtement, 6 500 euros c'est trop cher. Un freelance m'a proposé 2 000 euros."),
      T('seller', 'Si je comprends bien, vous trouvez l’écart important par rapport au devis du freelance. Qu’est-ce qu’il comprend exactement ?'),
      T('prospect', 'Un site neuf, avec mes photos. Le référencement, je ne sais pas.'),
      T('seller', 'Et votre site actuel, il vous a apporté combien de demandes cette année ?'),
      T('prospect', 'Aucune, pour être franche. Tout vient du bouche-à-oreille.'),
      T('seller', 'Le problème n’est donc pas d’avoir un site, c’est qu’il ne vous apporte aucun client. Un seul projet de rénovation, c’est combien pour vous ?'),
      T('prospect', 'Entre 40 000 et 80 000 euros. On en a d’ailleurs perdu un parce que le client trouvait le site pas sérieux.'),
      T('seller', 'Un projet perdu à cause du site, c’est plus de dix fois le prix de la refonte. Notre offre inclut six mois de référencement local pour que les particuliers vous trouvent.'),
      T('prospect', "D'accord, mais ce n'est pas le bon moment, on a beaucoup de chantiers."),
      T('seller', 'Justement, vous n’aurez presque rien à faire : deux rendez-vous d’une heure. Je peux vous faire 5 % si on signe avant la fin du mois.'),
      T('prospect', 'Je vais réfléchir et je vous redis la semaine prochaine.'),
      T('seller', 'Très bien, je vous rappelle mardi prochain.'),
    ],
    analysis: {
      summary:
        "La valeur est bien reliée au projet perdu, mais la remise est offerte sans contrepartie et l'appel se termine sur un « je vais réfléchir » sans date de décision.",
      outcome: 'postponed',
      skills: [
        { skill: 'objection_handling', score: 66, justification: "L'objection du prix est reformulée et retournée ; celle du timing est traitée par une remise.", evidence: [{ turn: 1, quote: 'vous trouvez l’écart important par rapport au devis du freelance' }] },
        { skill: 'value_proposition', score: 72, justification: 'Le prix est comparé à la valeur d’un seul projet perdu.', evidence: [{ turn: 7, quote: 'c’est plus de dix fois le prix de la refonte' }] },
        { skill: 'active_listening', score: 68, justification: 'Le vendeur rebondit sur le projet perdu au lieu de dérouler son argumentaire.', evidence: [{ turn: 5, quote: 'c’est qu’il ne vous apporte aucun client' }] },
        { skill: 'reformulation', score: 70, justification: 'Deux reformulations utiles, aucune sur l’objection du timing.', evidence: [{ turn: 1, quote: 'Si je comprends bien' }] },
        { skill: 'negotiation', score: 48, justification: 'Remise proposée spontanément, sans rien demander en échange.', evidence: [{ turn: 9, quote: 'Je peux vous faire 5 % si on signe avant la fin du mois' }] },
        { skill: 'closing', score: 50, justification: 'Pas de date de décision ni d’accord de principe.', evidence: [{ turn: 11, quote: 'je vous rappelle mardi prochain' }] },
      ],
      successCriteria: [
        { criterion: 'Chaque objection est reformulée avant d’y répondre.', met: false, evidence: 'L’objection du timing ne l’est pas.' },
        { criterion: 'La valeur est reliée au projet perdu ou aux demandes manquantes.', met: true, evidence: 'Plus de dix fois le prix de la refonte.' },
        { criterion: 'Remise de 10 % au maximum, en échange d’une contrepartie.', met: false, evidence: '5 % sans contrepartie.' },
        { criterion: 'Accord de principe et date de signature.', met: false, evidence: 'Rappel mardi, sans engagement.' },
      ],
      hiddenFacts: [
        { fact: 'Le site actuel n’a généré aucune demande en 2025.', uncovered: true, howToUncover: '' },
        { fact: 'Elle a perdu un projet de 80 000 € à cause du site.', uncovered: true, howToUncover: '' },
        { fact: 'Elle peut payer en trois fois.', uncovered: false, howToUncover: 'Si on étalait le paiement, est-ce que ça changerait quelque chose pour vous ?' },
      ],
      objections: [
        { objection: "C'est trop cher, un freelance m'a proposé 2 000 €.", handling: 'well', comment: 'Reformulée puis ramenée à la valeur.' },
        { objection: "Ce n'est pas le bon moment.", handling: 'partly', comment: 'Traitée par une remise au lieu d’une question.' },
        { objection: 'On a déjà un site, il fonctionne.', handling: 'not_raised', comment: '' },
      ],
      strengths: ['Le projet perdu devient l’argument central.', 'Questions avant de défendre le prix.'],
      improvements: [
        { turn: 9, said: 'Je peux vous faire 5 % si on signe avant la fin du mois.', better: 'Si le timing est le vrai frein, on peut démarrer en janvier. Qu’est-ce qui vous permettrait de décider cette semaine ?', why: 'Une remise sans contrepartie fait douter du prix.' },
        { turn: 11, said: 'Très bien, je vous rappelle mardi prochain.', better: 'D’accord. Pour mardi, qu’est-ce qui doit être clair pour que vous puissiez dire oui ?', why: 'Un rappel sans critère de décision mène souvent à un nouveau report.' },
      ],
      focusSkills: ['negotiation', 'closing', 'objection_handling'],
    },
  },
  {
    slug: 'closing-sales-training-fr',
    minutes: 14,
    transcript: [
      T('seller', 'Thomas, on a vu que votre taux de transformation est passé de 28 % à 19 %. Combien de commandes ça représente sur un trimestre ?'),
      T('prospect', 'À peu près quarante commandes de moins. Disons 600 000 euros de chiffre d’affaires.'),
      T('seller', 'Le programme coûte 18 000 euros. Si on récupère seulement un point de transformation, il est remboursé en quelques semaines.'),
      T('prospect', 'Sur le papier, oui. Mais il faut que j’en parle au directeur financier.'),
      T('seller', 'Bien sûr. Qu’est-ce qu’il regardera en premier pour valider ?'),
      T('prospect', 'Le retour sur investissement sur douze mois. Et il a vu une formation en ligne à 7 000 euros.'),
      T('seller', 'La formation en ligne ne comprend pas de coaching individuel. Vos deux commerciaux seniors, ce sont eux qui ont le plus besoin d’être suivis, non ?'),
      T('prospect', 'C’est vrai, ils sont un peu démotivés en ce moment.'),
      T('seller', 'Je vous prépare le calcul sur douze mois pour votre directeur financier. Si les chiffres lui conviennent, on démarre en janvier ?'),
      T('prospect', '…'),
      T('seller', 'On peut aussi commencer par un premier atelier en décembre, si c’est plus simple.'),
      T('prospect', 'Envoyez-moi le calcul, je le présente jeudi.'),
    ],
    analysis: {
      summary:
        'Le coût de la baisse de transformation est chiffré et le critère du directeur financier est découvert. Le silence après la question de closing est rompu trop tôt, et l’échéance budgétaire du 31 décembre n’est pas trouvée.',
      outcome: 'postponed',
      skills: [
        { skill: 'closing', score: 58, justification: 'Bonne question de closing conditionnelle, abandonnée au premier silence.', evidence: [{ turn: 8, quote: 'Si les chiffres lui conviennent, on démarre en janvier' }] },
        { skill: 'negotiation', score: 64, justification: 'Le prix est défendu par la valeur, sans remise.', evidence: [{ turn: 2, quote: 'il est remboursé en quelques semaines' }] },
        { skill: 'objection_handling', score: 70, justification: 'L’offre concurrente est traitée par la différence de coaching.', evidence: [{ turn: 6, quote: 'La formation en ligne ne comprend pas de coaching individuel' }] },
        { skill: 'qualification', score: 66, justification: 'Le critère du directeur financier est trouvé ; pas l’échéance budgétaire.', evidence: [{ turn: 4, quote: 'Qu’est-ce qu’il regardera en premier pour valider' }] },
        { skill: 'value_proposition', score: 74, justification: 'Le coût du problème est chiffré par le prospect.', evidence: [{ turn: 0, quote: 'Combien de commandes ça représente sur un trimestre' }] },
        { skill: 'silence_management', score: 40, justification: 'Le vendeur relance après quelques secondes de silence.', evidence: [{ turn: 10, quote: 'On peut aussi commencer par un premier atelier en décembre' }] },
      ],
      successCriteria: [
        { criterion: 'Le vendeur fait chiffrer le coût de la baisse de transformation.', met: true, evidence: '600 000 € par trimestre.' },
        { criterion: 'Le critère du directeur financier est découvert et traité.', met: true, evidence: 'Retour sur investissement sur douze mois.' },
        { criterion: 'Silence tenu après une question de closing.', met: false, evidence: 'Relance immédiate avec une autre option.' },
        { criterion: 'Engagement ferme et daté obtenu.', met: false, evidence: 'Présentation jeudi, sans décision.' },
      ],
      hiddenFacts: [
        { fact: 'Le budget formation doit être engagé avant le 31 décembre.', uncovered: false, howToUncover: 'Votre budget formation 2026 doit être engagé avant une date précise ?' },
        { fact: 'Le directeur financier veut un ROI chiffré sur 12 mois.', uncovered: true, howToUncover: '' },
        { fact: 'Deux commerciaux seniors sont démotivés.', uncovered: true, howToUncover: '' },
        { fact: 'L’offre concurrente est uniquement en ligne.', uncovered: true, howToUncover: '' },
      ],
      objections: [
        { objection: 'Il faut que j’en parle au directeur financier.', handling: 'well', comment: 'Transformée en question sur ses critères.' },
        { objection: 'Un concurrent propose une formation à 7 000 €.', handling: 'well', comment: 'Différence claire : le coaching.' },
        { objection: 'Je ne suis pas sûr que mes commerciaux vont adhérer.', handling: 'not_raised', comment: '' },
      ],
      strengths: ['Le prix est comparé au chiffre d’affaires perdu.', 'Objection du directeur financier transformée en critère.', 'Pas de remise accordée.'],
      improvements: [
        { turn: 10, said: 'On peut aussi commencer par un premier atelier en décembre, si c’est plus simple.', better: '(Se taire et laisser Thomas répondre à la question précédente.)', why: 'Relancer pendant le silence offre une porte de sortie au prospect.' },
      ],
      focusSkills: ['silence_management', 'closing'],
    },
  },
];

// Membres de l'équipe fictive : niveau de départ, progression sur la période, nombre d'appels.
const TEAM: { name: string; role: Role; email: string; level: number; growth: number; calls: number }[] = [
  { name: 'Camille Roux', role: 'owner', email: 'camille.roux', level: -4, growth: 22, calls: 26 },
  { name: 'Hugo Lefort', role: 'manager', email: 'hugo.lefort', level: 8, growth: 6, calls: 9 },
  { name: 'Inès Moreau', role: 'member', email: 'ines.moreau', level: 2, growth: 14, calls: 15 },
  { name: 'Lucas Girard', role: 'member', email: 'lucas.girard', level: -10, growth: 10, calls: 12 },
  { name: 'Sarah Benali', role: 'member', email: 'sarah.benali', level: -2, growth: 18, calls: 8 },
];
const DOMAIN = 'horizon-conseil.invalid';

// Hasard déterministe : la même démo à chaque construction.
function prng(seed: string) {
  let h = createHash('sha256').update(seed).digest().readUInt32LE(0);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let x = Math.imul(h ^ (h >>> 15), 1 | h);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (n: number) => Math.max(15, Math.min(96, Math.round(n)));

function transcriptOf(template: Template, seconds: number): TranscriptTurn[] {
  const words = template.transcript.map(([, text]) => text.split(/\s+/).length);
  const total = words.reduce((a, b) => a + b, 0);
  let at = 2;
  return template.transcript.map(([role, text], i) => {
    const turn = { role, text, at: Math.round(at) };
    at += (words[i] / total) * (seconds - 6);
    return turn;
  });
}

export async function seedDemoSpace(db: Db, now = new Date()): Promise<{ token: string; organizationId: string }> {
  const rand = prng('blackstart-demo');
  const [org] = await db.insert(organizations).values({ name: 'Horizon Conseil', kind: 'team', plan: 'premium' }).returning({ id: organizations.id });
  const members = await db
    .insert(users)
    .values(
      TEAM.map((m, i) => ({
        email: `${m.email}@${DOMAIN}`,
        name: m.name,
        // Aucun mot de passe utilisable : on n'entre dans la démo que par le bouton de la page publique.
        passwordHash: '!demo',
        locale: 'fr',
        lastLoginAt: new Date(now.getTime() - (i + 1) * 3_600_000 * (1 + rand() * 20)),
        createdAt: new Date(now.getTime() - 75 * DAY),
      })),
    )
    .returning({ id: users.id, email: users.email });
  const idOf = (email: string) => members.find((u) => u.email === `${email}@${DOMAIN}`)!.id;
  await db.insert(memberships).values(TEAM.map((m) => ({ organizationId: org.id, userId: idOf(m.email), role: m.role, createdAt: new Date(now.getTime() - 70 * DAY) })));
  await db.insert(userProfiles).values(
    TEAM.map((m) => ({
      userId: idOf(m.email),
      persona: m.role === 'owner' ? ('agency' as const) : ('team' as const),
      experience: m.level > 0 ? 'intermediate' : 'beginner',
      goals: ['closing', 'objection_handling', 'needs_discovery'],
      offerName: 'Accompagnement commercial Horizon',
      offerDescription: 'Prospection et closing pour les PME de services.',
      idealCustomer: 'Dirigeants de PME de 5 à 150 salariés',
      averageDeal: '6 000 €',
    })),
  );
  await db.insert(billingAccounts).values({
    organizationId: org.id,
    stripeCustomerId: 'cus_demo_horizon',
    stripeSubscriptionId: 'sub_demo_horizon',
    plan: 'premium',
    status: 'active',
    currency: 'eur',
    currentPeriodEnd: new Date(now.getTime() + 18 * DAY),
  });

  // Scénarios du catalogue utilisés par les appels, et exercices conseillés après chacun.
  const rows = await db
    .select({ id: scenarios.id, slug: scenarios.slug, difficulty: scenarios.difficulty, versionId: scenarioVersions.id, weights: scenarioVersions.content })
    .from(scenarios)
    .innerJoin(scenarioVersions, and(eq(scenarioVersions.scenarioId, scenarios.id), eq(scenarioVersions.version, scenarios.currentVersion)))
    .where(inArray(scenarios.slug, TEMPLATES.map((t) => t.slug)));
  const bySlug = new Map(rows.map((r) => [r.slug!, r]));
  const recommended = new Map<string, string[]>();
  for (const t of TEMPLATES) {
    const s = bySlug.get(t.slug)!;
    recommended.set(t.slug, await scenariosForSkills(db, org.id, t.analysis.focusSkills, 'fr', s.id, s.difficulty));
  }

  for (const m of TEAM) {
    const userId = idOf(m.email);
    for (let i = 0; i < m.calls; i++) {
      const progress = m.calls === 1 ? 1 : i / (m.calls - 1);
      const createdAt = new Date(now.getTime() - (58 * (1 - progress) + rand() * 1.5) * DAY - rand() * 8 * 3_600_000);
      const template = TEMPLATES[Math.floor(rand() * TEMPLATES.length)];
      const scenario = bySlug.get(template.slug)!;
      const failed = rand() < 0.06;
      const seconds = Math.round(template.minutes * 60 * (0.75 + rand() * 0.5));
      const base = { organizationId: org.id, userId, scenarioVersionId: scenario.versionId, createdAt, startedAt: createdAt };
      if (failed) {
        await db.insert(simulations).values({ ...base, status: 'failed', endReason: 'error', errorMessage: 'connection_lost', durationSeconds: 0 });
        continue;
      }
      const transcript = transcriptOf(template, seconds);
      const shift = m.level + (progress - 0.5) * m.growth;
      const analysis: ClaudeAnalysis = {
        ...template.analysis,
        skills: template.analysis.skills.map((s) => ({ ...s, score: clamp(s.score + shift + (rand() - 0.5) * 12) })),
      };
      const result = {
        ...finalizeAnalysis(analysis, scenario.weights.skillWeights as Partial<Record<Skill, number>>, transcript),
        recommendedScenarioIds: recommended.get(template.slug)!,
        locale: 'fr' as const,
      };
      const [sim] = await db
        .insert(simulations)
        .values({
          ...base,
          status: 'completed',
          endedAt: new Date(createdAt.getTime() + seconds * 1000),
          durationSeconds: seconds,
          endReason: rand() < 0.7 ? 'user' : 'agent',
          transcript,
          overallScore: result.overallScore,
          markers: rand() < 0.3 ? [Math.round(seconds * 0.3), Math.round(seconds * 0.7)] : [],
        })
        .returning({ id: simulations.id });
      await db.insert(simulationAnalyses).values({ simulationId: sim.id, status: 'completed', model: 'demo', result, attempts: 1, createdAt, updatedAt: createdAt });
      await db.insert(creditDebits).values({ organizationId: org.id, userId, simulationId: sim.id, credits: Math.ceil(seconds / 60), createdAt });
    }
  }

  const scenarioId = (slug: string) => bySlug.get(slug)!.id;
  await db.insert(missions).values([
    { organizationId: org.id, scenarioId: scenarioId('closing-sales-training-fr'), assigneeId: idOf('lucas.girard'), assignedBy: idOf('hugo.lefort'), dueAt: new Date(now.getTime() + 4 * DAY), note: 'Tenir le silence après la question de closing.', createdAt: new Date(now.getTime() - 2 * DAY) },
    { organizationId: org.id, scenarioId: scenarioId('objections-website-redesign-fr'), assigneeId: idOf('sarah.benali'), assignedBy: idOf('camille.roux'), dueAt: new Date(now.getTime() + 2 * DAY), note: 'Pas de remise sans contrepartie.', createdAt: new Date(now.getTime() - 1 * DAY) },
    { organizationId: org.id, scenarioId: scenarioId('discovery-scheduling-saas-fr'), assigneeId: idOf('ines.moreau'), assignedBy: idOf('camille.roux'), dueAt: new Date(now.getTime() - 3 * DAY), note: 'Trouver le décideur avant de proposer une démo.', createdAt: new Date(now.getTime() - 20 * DAY) },
  ]);
  await db.insert(invitations).values({
    organizationId: org.id,
    email: `julien.petit@${DOMAIN}`,
    role: 'member',
    tokenHash: hashToken(randomBytes(24).toString('base64url')),
    invitedBy: idOf('camille.roux'),
    expiresAt: new Date(now.getTime() + 5 * DAY),
  });

  // Une seule session, partagée par tous les visiteurs : celle de Camille, la responsable de l'équipe.
  const token = randomBytes(32).toString('base64url');
  await db.insert(sessions).values({ tokenHash: hashToken(token), userId: idOf('camille.roux'), organizationId: org.id, expiresAt: new Date(now.getTime() + 30 * DAY) });
  return { token, organizationId: org.id };
}

// Reconstruit chaque jour pour que les dates restent récentes.
const REBUILD_MS = DAY;
// À changer quand les données fictives changent : le schéma demo est alors reconstruit au démarrage suivant.
const SEED_VERSION = 2;

type Rows = { rows: Record<string, unknown>[] };
const rows = async (db: Db, query: SQL) => ((await db.execute(query)) as unknown as Rows).rows;

// Les migrations de la vraie base, rejouées dans le schéma demo.
function migrationStatements(): string[] {
  const journal = JSON.parse(readFileSync(join(MIGRATIONS_FOLDER, 'meta', '_journal.json'), 'utf8')) as { entries: { tag: string }[] };
  return journal.entries.flatMap(({ tag }) =>
    readFileSync(join(MIGRATIONS_FOLDER, `${tag}.sql`), 'utf8')
      .split('--> statement-breakpoint')
      .map((statement) => statement.trim().replaceAll('"public".', ''))
      // Pas de sécurité par ligne ici : le rôle de lecture n'est pas propriétaire des tables, elle lui cacherait tout.
      .filter((statement) => statement && !/ROW LEVEL SECURITY/i.test(statement)),
  );
}

// Construit le schéma demo (tables, catalogue, équipe fictive) s'il manque, s'il a plus d'un jour ou si les
// migrations ou les données ont changé. Le verrou évite deux constructions en même temps. Vrai s'il a été reconstruit.
export async function refreshDemoSchema(db: Db, now = new Date()): Promise<boolean> {
  const statements = migrationStatements();
  const version = createHash('sha256').update(`${SEED_VERSION}\n${statements.join('\n')}`).digest('hex').slice(0, 16);
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('blackstart-demo-schema'))`);
    const [present] = await rows(tx, sql`select to_regclass('demo.demo_meta') is not null as present`);
    if (present?.present) {
      const [built] = await rows(tx, sql`select version, built_at from demo.demo_meta`);
      if (built?.version === version && now.getTime() - new Date(built.built_at as string).getTime() < REBUILD_MS) return false;
    }
    await tx.execute(sql`drop schema if exists demo cascade`);
    await tx.execute(sql`create schema demo`);
    await tx.execute(sql`set local search_path to demo`);
    for (const statement of statements) await tx.execute(sql.raw(statement));
    await syncCatalog(tx);
    const { token } = await seedDemoSpace(tx, now);
    await tx.execute(sql`create table demo_meta (version text not null, built_at timestamptz not null, token text not null)`);
    await tx.execute(sql`insert into demo_meta values (${version}, ${now.toISOString()}, ${token})`);
    await tx.execute(
      sql.raw(`do $$ begin if exists (select from pg_roles where rolname = '${DEMO_READER}') then
        grant usage on schema demo to ${DEMO_READER};
        grant select on all tables in schema demo to ${DEMO_READER};
      end if; end $$`),
    );
    return true;
  });
}

export type DemoSpace = { db: Db; token: string };

const holder = globalThis as typeof globalThis & {
  __bsDemoReader?: Promise<Db>;
  __bsDemoRefresh?: Promise<unknown>;
  __bsDemoSpace?: { builtAt: number; space: Promise<DemoSpace & { close: () => Promise<void> }> };
};

function refresh(): Promise<unknown> {
  holder.__bsDemoRefresh ??= getMainDb()
    .then((db) => refreshDemoSchema(db))
    .catch((error) => console.error('[demo] espace démo non reconstruit', error instanceof Error ? error.message : error))
    .finally(() => delete holder.__bsDemoRefresh);
  return holder.__bsDemoRefresh;
}

// Base de la visite de démo.
export function demoDb(): Promise<Db> {
  const url = demoDatabaseUrl();
  if (!url) return localSpace().then((space) => space.db);
  holder.__bsDemoReader ??= connectPostgres(url, 2).then(
    (r) => r.db,
    (error) => {
      delete holder.__bsDemoReader;
      throw error;
    },
  );
  return holder.__bsDemoReader;
}

// La base et la session de Camille, partagée par tous les visiteurs.
export async function demoSpace(): Promise<DemoSpace> {
  if (!demoDatabaseUrl()) return localSpace();
  const db = await demoDb();
  const read = async () => (await rows(db, sql`select token, built_at from demo_meta`).catch(() => []))[0];
  let meta = await read();
  if (!meta) {
    await refresh();
    meta = await read();
    if (!meta) throw new Error('Espace démo indisponible.');
  } else if (Date.now() - new Date(meta.built_at as string).getTime() > REBUILD_MS) {
    void refresh();
  }
  return { db, token: meta.token as string };
}

// Hors production : base PGlite en mémoire, en lecture seule, reconstruite chaque jour.
function localSpace() {
  const current = holder.__bsDemoSpace;
  if (current && Date.now() - current.builtAt < REBUILD_MS) return current.space;
  // L'ancienne base est fermée un peu plus tard, le temps que les requêtes en cours se terminent.
  void current?.space.then((old) => setTimeout(() => void old.close(), 120_000).unref(), () => undefined);
  const space = (async () => {
    const { db, close } = await connectPglite();
    try {
      const { token } = await seedDemoSpace(db);
      // Lecture seule : aucune requête de la visite ne peut rien écrire, même par un chemin oublié.
      await db.execute(sql`set session characteristics as transaction read only`);
      return { db, token, close };
    } catch (error) {
      await close();
      throw error;
    }
  })();
  holder.__bsDemoSpace = { builtAt: Date.now(), space };
  space.catch(() => {
    if (holder.__bsDemoSpace?.space === space) delete holder.__bsDemoSpace;
  });
  return space;
}
