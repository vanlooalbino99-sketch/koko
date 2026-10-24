// Offres et limites. 1 crédit = 1 minute de simulation, analyse comprise (plan de la phase 1).
// Les quantités se règlent par variables d'environnement ; les prix affichés viennent de Stripe.

export const PLANS = ['free', 'pro', 'team'] as const;
export type Plan = (typeof PLANS)[number];
export const PAID_PLANS = ['pro', 'team'] as const;
export type PaidPlan = (typeof PAID_PLANS)[number];

// Une équipe compte au moins deux sièges ; au-delà de vingt, c'est un devis.
export const TEAM_MIN_SEATS = 2;
export const TEAM_MAX_SEATS = 20;

// Durée maximale d'un appel, quel que soit le scénario : borne le coût d'une seule simulation.
export const MAX_CALL_MINUTES = 15;

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}

export type PlanLimits = {
  // Crédits du mois civil pour toute l'organisation.
  monthlyCredits: number;
  seats: number;
  // Appels simultanés dans l'organisation.
  concurrentCalls: number;
  // Scénarios privés actifs ; null = sans limite.
  privateScenarios: number | null;
  // Invitations, rôles et tableau de l'équipe.
  teamSpace: boolean;
};

export function planLimits(plan: Plan, seats = 1): PlanLimits {
  if (plan === 'pro') {
    return {
      monthlyCredits: envInt('PLAN_PRO_MINUTES', 60),
      seats: 1,
      concurrentCalls: 1,
      privateScenarios: null,
      teamSpace: false,
    };
  }
  if (plan === 'team') {
    const n = Math.min(TEAM_MAX_SEATS, Math.max(TEAM_MIN_SEATS, seats));
    return {
      monthlyCredits: envInt('PLAN_TEAM_MINUTES_PER_SEAT', 60) * n,
      seats: n,
      concurrentCalls: Math.min(n, 5),
      privateScenarios: null,
      teamSpace: true,
    };
  }
  return {
    monthlyCredits: envInt('PLAN_FREE_MINUTES', envInt('VOICE_FREE_MONTHLY_MINUTES', 15)),
    seats: 1,
    concurrentCalls: 1,
    privateScenarios: 3,
    teamSpace: false,
  };
}

// Garde-fous de la plateforme, au-dessus de toutes les organisations : ils protègent la facture
// ElevenLabs et Anthropic de l'éditeur si l'usage s'emballe.
export function platformLimits() {
  return {
    monthlyMinutes: envInt('PLATFORM_MONTHLY_MINUTES', 250),
    dailyAnalyses: envInt('PLATFORM_DAILY_ANALYSES', 100),
  };
}

// Prix créés dans Stripe si aucun identifiant de prix n'est fourni (en centimes, TTC).
export const DEFAULT_PRICES: Record<PaidPlan, { lookupKey: string; amount: number; name: string }> = {
  pro: {
    lookupKey: 'bs_sales_pro_monthly',
    amount: envInt('PLAN_PRO_PRICE_CENTS', 2900),
    name: 'Blackstart Sales Intelligence · Pro',
  },
  team: {
    lookupKey: 'bs_sales_team_seat_monthly',
    amount: envInt('PLAN_TEAM_SEAT_PRICE_CENTS', 2500),
    name: 'Blackstart Sales Intelligence · Équipe (par siège)',
  },
};

// Abonnement Stripe qui ouvre les droits de l'offre. past_due garde l'accès pendant les relances de paiement.
export function grantsAccess(status: string | null | undefined): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}
