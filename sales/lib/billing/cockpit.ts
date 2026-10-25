import { and, count, desc, eq, gte, inArray, isNotNull, lt, sql } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import {
  auditLog,
  billingAccounts,
  creditDebits,
  memberships,
  organizations,
  scenarios,
  scenarioVersions,
  simulationAnalyses,
  simulations,
  userProfiles,
  users,
} from '../db/schema.ts';
import { toCsv } from '../csv.ts';
import { monthStart, platformUsage } from './credits.ts';
import { DEFAULT_PRICES, grantsAccess, planLimits, type PaidPlan, type Plan } from './plans.ts';
import type { PaidInvoice, PlanPrice } from './stripe.ts';

// Cockpit de l'éditeur : chiffres de toute la plateforme sur une période (7, 30 ou 90 jours), comparés à la
// période précédente de même durée. Tout vient de la base (ou de Stripe pour l'encaissé) : rien n'est estimé.

export const PERIODS = [7, 30, 90] as const;
export type Period = (typeof PERIODS)[number];

const DAY = 86_400_000;
// Seuils des comptes à risque.
const INACTIVE_DAYS = 14;
const USAGE_ALERT = 0.9;
// Pour l'enseignement « à retenir » : nombre d'appels qui distingue les comptes engagés, taille minimale des groupes.
const ENGAGED_CALLS = 3;
const INSIGHT_MIN = 10;

export type Delta = { value: number; previous: number };
export type RiskFactor = 'past_due' | 'inactive' | 'declining' | 'quota' | 'none';
export type AccountRow = {
  id: string;
  name: string;
  plan: Plan;
  health: number;
  weekly: number[];
  lastActivity: Date | null;
  usage: number;
  mrr: number;
  callsInPeriod: number;
  risk: RiskFactor;
};
export type HealthFacet = { key: 'analyses' | 'calls' | 'voice' | 'quota' | 'payments'; value: number };

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Une case par jour de la période, du plus ancien au plus récent.
function daysOf(since: Date, days: number) {
  return Array.from({ length: days }, (_, i) => dayKey(new Date(since.getTime() + i * DAY)));
}

function series(keys: string[], rows: { day: string; n: number }[]) {
  const map = new Map(rows.map((r) => [r.day, r.n]));
  return keys.map((k) => map.get(k) ?? 0);
}

const dayOf = (column: unknown) => sql<string>`to_char(date_trunc('day', ${column} at time zone 'UTC'), 'YYYY-MM-DD')`;

// Prix mensuel d'un abonnement (centimes) : prix Stripe s'ils sont lus, sinon prix de lancement de l'application.
function monthlyPrice(plan: PaidPlan, seats: number, prices: Record<PaidPlan, PlanPrice> | null) {
  const unit = prices?.[plan].amount ?? DEFAULT_PRICES[plan].amount;
  return plan === 'team' ? unit * seats : unit;
}

export async function cockpit(
  db: Db,
  opts: { days: Period; now?: Date; prices: Record<PaidPlan, PlanPrice> | null; invoices: PaidInvoice[] | null },
) {
  const now = opts.now ?? new Date();
  const days = opts.days;
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * DAY);
  const before = new Date(since.getTime() - days * DAY);
  const keys = daysOf(since, days);

  const completedBetween = (from: Date, to: Date) =>
    and(eq(simulations.status, 'completed'), gte(simulations.createdAt, from), lt(simulations.createdAt, to));

  const [
    usage,
    callsByDay,
    [activeNow],
    [activePrev],
    subscriptions,
    [canceled],
    newOrgs,
    prevOrgs,
    [score],
    [scorePrev],
    [funnel],
    topScenarios,
    families,
    [analysisRates],
    [callRates],
    activity,
  ] = await Promise.all([
    platformUsage(db, now),
    db
      .select({ day: dayOf(simulations.createdAt), n: count() })
      .from(simulations)
      .where(completedBetween(since, now))
      .groupBy(sql`1`),
    db.select({ n: sql<number>`count(distinct ${simulations.organizationId})`.mapWith(Number) }).from(simulations).where(completedBetween(since, now)),
    db.select({ n: sql<number>`count(distinct ${simulations.organizationId})`.mapWith(Number) }).from(simulations).where(completedBetween(before, since)),
    db
      .select({
        organizationId: billingAccounts.organizationId,
        plan: billingAccounts.plan,
        status: billingAccounts.status,
        seats: billingAccounts.seats,
        createdAt: billingAccounts.createdAt,
      })
      .from(billingAccounts)
      .where(isNotNull(billingAccounts.plan)),
    db
      .select({ n: count() })
      .from(billingAccounts)
      .where(and(eq(billingAccounts.status, 'canceled'), gte(billingAccounts.updatedAt, since))),
    db.select({ id: organizations.id, createdAt: organizations.createdAt }).from(organizations).where(gte(organizations.createdAt, since)),
    db
      .select({ id: organizations.id })
      .from(organizations)
      .where(and(gte(organizations.createdAt, before), lt(organizations.createdAt, since))),
    db
      .select({ avg: sql<number | null>`round(avg(${simulations.overallScore}))`.mapWith((v) => (v === null ? null : Number(v))), n: count() })
      .from(simulations)
      .where(and(completedBetween(since, now), isNotNull(simulations.overallScore))),
    db
      .select({ avg: sql<number | null>`round(avg(${simulations.overallScore}))`.mapWith((v) => (v === null ? null : Number(v))) })
      .from(simulations)
      .where(and(completedBetween(before, since), isNotNull(simulations.overallScore))),
    db
      .select({
        signups: count(),
        onboarded: sql<number>`count(${userProfiles.userId})`.mapWith(Number),
        called: sql<number>`count(*) filter (where exists (select 1 from ${simulations} s where s.user_id = ${users.id} and s.status = 'completed'))`.mapWith(Number),
        paying: sql<number>`count(*) filter (where exists (select 1 from ${memberships} m join ${billingAccounts} b on b.organization_id = m.organization_id where m.user_id = ${users.id} and b.plan is not null and b.status in ('active', 'trialing', 'past_due')))`.mapWith(Number),
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .where(gte(users.createdAt, since)),
    db
      .select({ id: scenarios.id, title: scenarios.title, n: count() })
      .from(simulations)
      .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
      .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
      .where(completedBetween(since, now))
      .groupBy(scenarios.id, scenarios.title)
      .orderBy(desc(count()))
      .limit(5),
    db
      .select({ family: scenarios.family, n: count() })
      .from(simulations)
      .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
      .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
      .where(completedBetween(since, now))
      .groupBy(scenarios.family)
      .orderBy(desc(count())),
    db
      .select({
        completed: sql<number>`count(*) filter (where ${simulationAnalyses.status} = 'completed')`.mapWith(Number),
        failed: sql<number>`count(*) filter (where ${simulationAnalyses.status} = 'failed' and ${simulationAnalyses.attempts} >= 3)`.mapWith(Number),
      })
      .from(simulationAnalyses)
      .where(gte(simulationAnalyses.createdAt, since)),
    db
      .select({
        completed: sql<number>`count(*) filter (where ${simulations.status} = 'completed')`.mapWith(Number),
        failed: sql<number>`count(*) filter (where ${simulations.status} = 'failed')`.mapWith(Number),
      })
      .from(simulations)
      .where(gte(simulations.createdAt, since)),
    db
      .select({
        id: auditLog.id,
        action: auditLog.action,
        createdAt: auditLog.createdAt,
        organization: organizations.name,
        metadata: auditLog.metadata,
      })
      .from(auditLog)
      .leftJoin(organizations, eq(organizations.id, auditLog.organizationId))
      .where(inArray(auditLog.action, ['user.signup', 'billing.subscription_synced', 'billing.subscription_changed', 'invitation.accepted', 'scenario.created', 'member.left']))
      .orderBy(desc(auditLog.createdAt))
      .limit(6),
  ]);

  // Abonnements payants en cours : MRR par offre.
  const active = subscriptions.filter((s) => grantsAccess(s.status) && (s.plan === 'pro' || s.plan === 'team'));
  const mrrByPlan: Record<PaidPlan, number> = { pro: 0, team: 0 };
  for (const s of active) mrrByPlan[s.plan as PaidPlan] += monthlyPrice(s.plan as PaidPlan, s.seats, opts.prices);
  const mrr = mrrByPlan.pro + mrrByPlan.team;
  const mrrPrevious = active
    .filter((s) => s.createdAt < since)
    .reduce((n, s) => n + monthlyPrice(s.plan as PaidPlan, s.seats, opts.prices), 0);
  // Base des abonnés actuels au fil de la période (date de souscription).
  const mrrSeries = keys.map((k) =>
    active.filter((s) => dayKey(s.createdAt) <= k).reduce((n, s) => n + monthlyPrice(s.plan as PaidPlan, s.seats, opts.prices), 0),
  );

  // Conversion : part des espaces créés sur la période qui ont aujourd'hui un abonnement payant.
  const paidOrgs = new Set(active.map((s) => s.organizationId));
  const conversion = (orgs: { id: string }[]) => (orgs.length ? Math.round((1000 * orgs.filter((o) => paidOrgs.has(o.id)).length) / orgs.length) / 10 : null);
  const signupsByDay = series(
    keys,
    Object.entries(
      newOrgs.reduce<Record<string, number>>((acc, o) => {
        const k = dayKey(o.createdAt);
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
      }, {}),
    ).map(([day, n]) => ({ day, n })),
  );

  // Résiliations : abonnements passés à « canceled » sur la période, rapportés aux abonnés de la période.
  const churnBase = active.length + canceled.n;
  const churn = churnBase ? Math.round((1000 * canceled.n) / churnBase) / 10 : null;

  // Encaissé : factures Stripe payées sur la période (null sans Stripe).
  const paid = opts.invoices?.filter((i) => i.paidAt >= since) ?? null;
  const revenue = paid
    ? {
        total: paid.reduce((n, i) => n + i.amount, 0),
        previous: (opts.invoices ?? []).filter((i) => i.paidAt >= before && i.paidAt < since).reduce((n, i) => n + i.amount, 0),
        currency: paid[0]?.currency ?? 'eur',
        byDay: keys.map((k) => paid.filter((i) => dayKey(i.paidAt) === k).reduce((n, i) => n + i.amount, 0)),
      }
    : null;

  // Santé de la plateforme : cinq taux entre 0 et 100.
  const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 100);
  const facets: HealthFacet[] = [
    { key: 'analyses', value: pct(analysisRates.completed, analysisRates.completed + analysisRates.failed) },
    { key: 'calls', value: pct(callRates.completed, callRates.completed + callRates.failed) },
    { key: 'voice', value: Math.max(0, 100 - pct(usage.minutesThisMonth, usage.monthlyMinutes)) },
    { key: 'quota', value: Math.max(0, 100 - pct(usage.analysesToday, usage.dailyAnalyses)) },
    { key: 'payments', value: pct(active.filter((s) => s.status !== 'past_due').length, active.length) },
  ];
  const health = Math.round(facets.reduce((n, f) => n + f.value, 0) / facets.length);

  const accounts = await accountRows(db, now, since, opts.prices, subscriptions);
  const insight = await engagementInsight(db, paidOrgs);

  return {
    since,
    days,
    keys,
    revenue,
    activeAccounts: { value: activeNow.n, previous: activePrev.n } satisfies Delta,
    callsByDay: series(keys, callsByDay),
    mrr: { value: mrr, previous: mrrPrevious, byPlan: mrrByPlan, series: mrrSeries, subscribers: active.length },
    conversion: { value: conversion(newOrgs), previous: conversion(prevOrgs), signupsByDay, signups: newOrgs.length },
    churn: { value: churn, canceled: canceled.n },
    score: { value: score.avg, previous: scorePrev.avg, n: score.n },
    funnel,
    topScenarios,
    families,
    facets,
    health,
    activity,
    accounts,
    insight,
  };
}

export type Cockpit = Awaited<ReturnType<typeof cockpit>>;

// Comptes à surveiller : santé calculée sur l'activité réelle, le paiement et la consommation du mois.
async function accountRows(
  db: Db,
  now: Date,
  since: Date,
  prices: Record<PaidPlan, PlanPrice> | null,
  subscriptions: { organizationId: string; plan: string | null; status: string | null; seats: number }[],
): Promise<AccountRow[]> {
  const sixWeeks = new Date(now.getTime() - 42 * DAY);
  const [orgs, weekly, last, period, credits] = await Promise.all([
    db
      .select({ id: organizations.id, name: organizations.name, plan: organizations.plan })
      .from(organizations)
      .where(
        sql`exists (select 1 from ${simulations} s where s.organization_id = ${organizations.id} and s.status = 'completed') or exists (select 1 from ${billingAccounts} b where b.organization_id = ${organizations.id} and b.plan is not null)`,
      )
      .limit(500),
    db
      .select({
        organizationId: simulations.organizationId,
        week: sql<number>`floor(extract(epoch from (${now.toISOString()}::timestamptz - ${simulations.createdAt})) / ${7 * 86400})`.mapWith(Number),
        n: count(),
      })
      .from(simulations)
      .where(and(eq(simulations.status, 'completed'), gte(simulations.createdAt, sixWeeks)))
      .groupBy(simulations.organizationId, sql`2`),
    db
      .select({ organizationId: simulations.organizationId, at: sql<Date>`max(${simulations.createdAt})`.mapWith((v) => new Date(v)) })
      .from(simulations)
      .where(eq(simulations.status, 'completed'))
      .groupBy(simulations.organizationId),
    db
      .select({ organizationId: simulations.organizationId, n: count() })
      .from(simulations)
      .where(and(eq(simulations.status, 'completed'), gte(simulations.createdAt, since)))
      .groupBy(simulations.organizationId),
    db
      .select({ organizationId: creditDebits.organizationId, used: sql<number>`coalesce(sum(${creditDebits.credits}), 0)`.mapWith(Number) })
      .from(creditDebits)
      .where(gte(creditDebits.createdAt, monthStart(now)))
      .groupBy(creditDebits.organizationId),
  ]);
  const lastBy = new Map(last.map((r) => [r.organizationId, r.at]));
  const periodBy = new Map(period.map((r) => [r.organizationId, r.n]));
  const usedBy = new Map(credits.map((r) => [r.organizationId, r.used]));
  const subBy = new Map(subscriptions.map((s) => [s.organizationId, s]));

  const rows = orgs.map((org): AccountRow => {
    const sub = subBy.get(org.id);
    const paying = sub && grantsAccess(sub.status) && (sub.plan === 'pro' || sub.plan === 'team');
    // Six semaines, de la plus ancienne à la plus récente.
    const weeklyCalls = Array.from({ length: 6 }, (_, i) => weekly.find((w) => w.organizationId === org.id && w.week === 5 - i)?.n ?? 0);
    const lastActivity = lastBy.get(org.id) ?? null;
    const limits = planLimits(org.plan as Plan, sub?.seats ?? 1);
    const usage = limits.monthlyCredits ? Math.min(1, (usedBy.get(org.id) ?? 0) / limits.monthlyCredits) : 0;
    const inactive = !lastActivity || now.getTime() - lastActivity.getTime() >= INACTIVE_DAYS * DAY;
    const recent = weeklyCalls[4] + weeklyCalls[5];
    const earlier = weeklyCalls[2] + weeklyCalls[3];
    const declining = !inactive && earlier > 0 && recent < earlier / 2;
    const pastDue = sub?.status === 'past_due';
    const quota = usage >= USAGE_ALERT;
    let health = 100;
    if (pastDue) health -= 35;
    if (inactive) health -= 40;
    if (declining) health -= 20;
    if (quota) health -= 15;
    return {
      id: org.id,
      name: org.name,
      plan: org.plan as Plan,
      health: Math.max(0, health),
      weekly: weeklyCalls,
      lastActivity,
      usage: Math.round(usage * 100),
      mrr: paying ? monthlyPrice(sub.plan as PaidPlan, sub.seats, prices) : 0,
      callsInPeriod: periodBy.get(org.id) ?? 0,
      risk: pastDue ? 'past_due' : inactive ? 'inactive' : declining ? 'declining' : quota ? 'quota' : 'none',
    };
  });
  // Les plus fragiles d'abord, à santé égale les comptes qui rapportent le plus.
  return rows.sort((a, b) => a.health - b.health || b.mrr - a.mrr);
}

// À retenir : les espaces qui ont fait au moins trois appels se convertissent-ils davantage ? Calculé sur tous les
// espaces, affiché seulement si chaque groupe compte assez d'espaces pour que la comparaison ait un sens.
async function engagementInsight(db: Db, paidOrgs: Set<string>) {
  const rows = await db
    .select({
      id: organizations.id,
      calls: sql<number>`(select count(*) from ${simulations} s where s.organization_id = ${organizations.id} and s.status = 'completed')`.mapWith(Number),
    })
    .from(organizations)
    .limit(5000);
  const engaged = rows.filter((r) => r.calls >= ENGAGED_CALLS);
  const others = rows.filter((r) => r.calls < ENGAGED_CALLS);
  const rate = (list: typeof rows) => (list.length ? Math.round((100 * list.filter((r) => paidOrgs.has(r.id)).length) / list.length) : 0);
  return {
    ready: engaged.length >= INSIGHT_MIN && others.length >= INSIGHT_MIN,
    engaged: engaged.length,
    others: others.length,
    engagedRate: rate(engaged),
    othersRate: rate(others),
    threshold: ENGAGED_CALLS,
    min: INSIGHT_MIN,
  };
}

// Export CSV des comptes (cellules protégées contre l'injection de formules).
export function accountsCsv(rows: AccountRow[], header: string[]) {
  return toCsv([
    header,
    ...rows.map((r) => [
      r.name,
      r.plan,
      r.health,
      r.lastActivity ? r.lastActivity.toISOString().slice(0, 10) : '',
      r.callsInPeriod,
      `${r.usage}%`,
      (r.mrr / 100).toFixed(2),
      r.risk,
    ]),
  ]);
}
