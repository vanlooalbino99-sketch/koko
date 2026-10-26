// Offres et limites. 1 crédit = 1 minute de simulation, analyse comprise.
// Les quantités se règlent par variables d'environnement ; les prix affichés viennent de Stripe.

// Essai gratuit, trois offres mensuelles et l'offre Entreprise, sur devis (hors Stripe).
export const PLANS = ['free', 'standard', 'advanced', 'premium'] as const;
export type Plan = (typeof PLANS)[number];
export const PAID_PLANS = ['standard', 'advanced', 'premium'] as const;
export type PaidPlan = (typeof PAID_PLANS)[number];
export function isOneOfPaid(value: string | null | undefined): value is PaidPlan {
  return (PAID_PLANS as readonly string[]).includes(value ?? '');
}

// Mise en avant sur la page des offres.
export const RECOMMENDED_PLAN: PaidPlan = 'advanced';

// Même prix affiché dans les deux monnaies : en euros en français, en dollars américains en anglais.
export const CURRENCIES = ['eur', 'usd'] as const;
export type Currency = (typeof CURRENCIES)[number];
export function currencyFor(locale: 'fr' | 'en'): Currency {
  return locale === 'en' ? 'usd' : 'eur';
}

// Durée maximale d'un appel, quel que soit le scénario : borne le coût d'une seule simulation.
export const MAX_CALL_MINUTES = 15;

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}

export type PlanLimits = {
  // Crédits (minutes) : du mois civil pour les offres payantes, de tout l'essai pour l'offre gratuite.
  monthlyCredits: number;
  // Essai : nombre d'appels possibles en tout ; null pour les offres payantes.
  trialCalls: number | null;
  // Durée maximale d'un appel de cette offre.
  maxCallMinutes: number;
  // Membres de l'espace, invitations en attente comprises.
  seats: number;
  // Appels simultanés dans l'organisation.
  concurrentCalls: number;
  // Scénarios privés actifs ; null = sans limite.
  privateScenarios: number | null;
  // Invitations, rôles et tableau de l'équipe.
  teamSpace: boolean;
};

export function planLimits(plan: Plan): PlanLimits {
  if (plan === 'standard') {
    return {
      monthlyCredits: envInt('PLAN_STANDARD_MINUTES', 60),
      trialCalls: null,
      maxCallMinutes: MAX_CALL_MINUTES,
      seats: 1,
      concurrentCalls: 1,
      privateScenarios: 5,
      teamSpace: false,
    };
  }
  if (plan === 'advanced') {
    return {
      monthlyCredits: envInt('PLAN_ADVANCED_MINUTES', 150),
      trialCalls: null,
      maxCallMinutes: MAX_CALL_MINUTES,
      seats: 1,
      concurrentCalls: 1,
      privateScenarios: null,
      teamSpace: false,
    };
  }
  if (plan === 'premium') {
    const seats = Math.max(2, envInt('PLAN_PREMIUM_SEATS', 10));
    return {
      monthlyCredits: envInt('PLAN_PREMIUM_MINUTES', 300),
      trialCalls: null,
      maxCallMinutes: MAX_CALL_MINUTES,
      seats,
      concurrentCalls: Math.min(seats, 3),
      privateScenarios: null,
      teamSpace: true,
    };
  }
  // Essai : 2 appels de 5 minutes, une seule fois.
  const calls = envInt('TRIAL_CALLS', 2);
  const minutes = Math.max(1, envInt('TRIAL_CALL_MINUTES', 5));
  return {
    monthlyCredits: calls * minutes,
    trialCalls: calls,
    maxCallMinutes: minutes,
    seats: 1,
    concurrentCalls: 1,
    privateScenarios: 3,
    teamSpace: false,
  };
}

// Accès illimité offert (organizations.unlimited) : les droits de Premium, sans plafond de minutes. Le plafond technique
// d'un appel et les garde-fous de la plateforme restent en place.
export const UNLIMITED_CREDITS = 1_000_000;
export function unlimitedLimits(): PlanLimits {
  return { ...planLimits('premium'), monthlyCredits: UNLIMITED_CREDITS };
}

// Garde-fous de la plateforme, au-dessus de toutes les organisations : ils protègent la facture
// ElevenLabs et Anthropic de l'éditeur si l'usage s'emballe.
export function platformLimits() {
  return {
    monthlyMinutes: envInt('PLATFORM_MONTHLY_MINUTES', 250),
    dailyAnalyses: envInt('PLATFORM_DAILY_ANALYSES', 100),
  };
}

// Prix créés dans Stripe si aucun identifiant de prix n'est fourni (en centimes, TTC), le même montant en euros
// et en dollars. Une clé de recherche par offre et par monnaie.
export const DEFAULT_PRICES: Record<PaidPlan, { amount: number; name: string }> = {
  standard: { amount: envInt('PLAN_STANDARD_PRICE_CENTS', 2999), name: 'Blackstart Sales Intelligence · Standard' },
  advanced: { amount: envInt('PLAN_ADVANCED_PRICE_CENTS', 5999), name: 'Blackstart Sales Intelligence · Avancé' },
  premium: { amount: envInt('PLAN_PREMIUM_PRICE_CENTS', 7999), name: 'Blackstart Sales Intelligence · Premium' },
};

export function lookupKey(plan: PaidPlan, currency: Currency): string {
  return `bs_sales_${plan}_monthly_${currency}`;
}

// Abonnement Stripe qui ouvre les droits de l'offre. past_due garde l'accès pendant les relances de paiement.
export function grantsAccess(status: string | null | undefined): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}
