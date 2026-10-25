import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Change } from '@/components/cockpit/change';
import { AreaWave, Bars, Bubbles, DotMatrix, DottedLine, FunnelFlow, Gauge, HEX_COLORS, HexHealth, PLAN_COLORS, PlanDonut, rolling, TrendLine } from '@/components/cockpit/charts';
import { GlassTorus } from '@/components/cockpit/glass-torus';
import { InsightSpark } from '@/components/cockpit/insight-spark';
import { card, CardTitle, KpiCard, LiveBadge, ViewAll } from '@/components/cockpit/panel';
import { ParticleWave } from '@/components/cockpit/particle-wave';
import { PeriodMenu } from '@/components/cockpit/period-menu';
import { platformReport } from '@/lib/billing/admin';
import { cockpit, PERIODS, type Period, type RiskFactor } from '@/lib/billing/cockpit';
import { billingProviderFromEnv } from '@/lib/billing/stripe';
import { getDb } from '@/lib/db/client';
import type { Family } from '@/lib/domain';
import { format, timeAgo } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { robots: { index: false } };

type Props = { searchParams: Promise<{ period?: string; accounts?: string }> };

const DAY = 86_400_000;

// Étiquettes « facteur de risque » de la maquette : rouge, orange encadré, vert, gris.
const RISK_TONE: Record<RiskFactor, string> = {
  past_due: 'bg-[#f0506e]/15 text-[#ff5a76]',
  inactive: 'bg-[#f0506e]/15 text-[#ff5a76]',
  declining: 'border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#ff9f2e]',
  quota: 'bg-[#2fd07a]/12 text-[#3fdc85]',
  none: 'border border-white/10 bg-white/5 text-[#c9cdd8]',
};

function healthTone(score: number) {
  return score >= 80 ? 'bg-[#2fd07a]/12 text-[#3fdc85]' : score >= 50 ? 'bg-[#f59e0b]/12 text-[#ff9f2e]' : 'bg-[#f0506e]/15 text-[#ff5a76]';
}

// Page de l'éditeur uniquement : pour tout autre compte, elle n'existe pas.
export default async function AdminPage({ searchParams }: Props) {
  const { auth } = await requireOnboarded();
  if (!auth.user.isPlatformAdmin) notFound();
  const { t, locale } = await getI18n();
  const a = t.admin;
  const params = await searchParams;
  const requested = Number(params.period);
  const days: Period = (PERIODS as readonly number[]).includes(requested) ? (requested as Period) : 30;
  const db = await getDb();
  const provider = billingProviderFromEnv();
  const now = new Date();
  const [prices, invoices] = provider
    ? await Promise.all([
        provider.prices().catch(() => null),
        provider.paidInvoices(new Date(now.getTime() - 2 * days * DAY)).catch((err) => {
          console.error('[cockpit] factures', err instanceof Error ? err.message : err);
          return null;
        }),
      ])
    : [null, null];
  const [c, costs] = await Promise.all([cockpit(db, { days, now, prices, invoices }), platformReport(db, now)]);

  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const n = (v: number) => new Intl.NumberFormat(tag).format(v);
  const pct = (v: number) => `${new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }).format(v)} %`;
  const money = (cents: number, currency = 'eur') =>
    new Intl.NumberFormat(tag, { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
  const short = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' });
  const vs = `vs ${short.format(new Date(c.since.getTime() - days * DAY))} – ${short.format(new Date(c.since.getTime() - DAY))}`;
  const ago = (d: Date | null) => (d ? timeAgo(d, now, tag) : a.never);
  const periodPill = <PeriodMenu path="/admin" current={days} periods={PERIODS} labels={a.periods} short={t.dashboard.periodsShort} srLabel={a.period} compact />;
  const funnelValues = [c.funnel.signups, c.funnel.onboarded, c.funnel.called, c.funnel.paying];
  const funnelKeys = ['signups', 'onboarded', 'called', 'paying'] as const;
  const mrrSegments = (['pro', 'team'] as const).map((key) => ({ key, value: c.mrr.byPlan[key] }));
  const maxScenario = Math.max(1, ...c.topScenarios.map((s) => s.n));
  const showAll = params.accounts === 'all';
  const accounts = showAll ? c.accounts : c.accounts.slice(0, 8);

  return (
    <div className="grid gap-2.5">
      <h1 className="sr-only">{a.title}</h1>

      {/* Indicateurs */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.6fr_1.15fr_1.08fr_0.98fr_0.94fr_0.9fr]">
        <KpiCard
          title={a.revenue}
          badge={<LiveBadge label={a.live} />}
          value={c.revenue ? money(c.revenue.total, c.revenue.currency) : <span className="text-[#9aa1b2]">{a.none}</span>}
          big
          delta={
            c.revenue ? (
              <Change value={c.revenue.total} previous={c.revenue.previous} label={vs} tag={tag} />
            ) : (
              <p className="text-[11.5px] text-[#9aa1b2]">{a.revenueNone}</p>
            )
          }
          bleed
        >
          <ParticleWave values={c.revenue ? c.revenue.byDay : []} label={a.revenueChart} />
        </KpiCard>

        <KpiCard title={a.activeAccounts} value={n(c.activeAccounts.value)} delta={<Change value={c.activeAccounts.value} previous={c.activeAccounts.previous} label={vs} tag={tag} />}>
          <DotMatrix values={c.callsGrid} label={a.activeChart} />
        </KpiCard>

        <KpiCard title={a.mrr} value={money(c.mrr.value)} delta={<Change value={c.mrr.value} previous={c.mrr.previous} label={format(a.mrrHint, { n: c.mrr.subscribers })} tag={tag} />} bleed>
          <AreaWave values={c.mrr.series} label={a.mrrChart} />
        </KpiCard>

        <KpiCard
          title={a.conversion}
          value={c.conversion.value === null ? a.none : pct(c.conversion.value)}
          delta={<Change value={c.conversion.value} previous={c.conversion.previous} label={format(a.conversionHint, { n: c.conversion.signups })} points tag={tag} />}
        >
          <DottedLine values={c.conversion.signupsByDay} label={a.conversionChart} />
        </KpiCard>

        <KpiCard
          title={a.churn}
          value={c.churn.value === null ? a.none : pct(c.churn.value)}
          delta={<p className="text-[11.5px] text-[#9aa1b2]">{format(a.churnHint, { n: c.churn.canceled })}</p>}
        >
          <Bars values={c.subscribersBars} label={a.churnChart} />
        </KpiCard>

        <KpiCard
          title={a.score}
          value={c.score.value === null ? a.none : c.score.value}
          delta={<Change value={c.score.value} previous={c.score.previous} label={format(a.scoreHint, { n: c.score.n })} points tag={tag} />}
        >
          <Gauge value={c.score.value} label={a.score} />
        </KpiCard>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[1.15fr_1.45fr_1fr]">
        <section className={cn(card, 'bs-rise')}>
          <CardTitle action={periodPill}>{a.mrrByPlan}</CardTitle>
          <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
            <div className="w-[46%] max-w-[230px] shrink-0">
              <PlanDonut segments={mrrSegments} center={money(c.mrr.value)} caption={a.mrrTotal} />
            </div>
            {c.mrr.value === 0 ? (
              <p className="text-[13px] text-[#9aa1b2]">{a.mrrEmpty}</p>
            ) : (
              <ul className="grid w-full flex-1 gap-4 text-[13px]">
                {mrrSegments.map((s) => (
                  <li key={s.key} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5">
                    <span aria-hidden="true" className="mt-1 size-2.5 rounded-full" style={{ background: PLAN_COLORS[s.key] }} />
                    <span className="min-w-0">
                      <span className="block truncate text-[#eef0f5]">{t.enums.plan[s.key]}</span>
                      <span className="mt-1 block text-[12px] text-[#9aa1b2] tabular-nums">{money(s.value)}</span>
                    </span>
                    <span className="self-end text-[12px] text-[#c9cdd8] tabular-nums">{pct(c.mrr.value ? (s.value / c.mrr.value) * 100 : 0)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className={cn(card, 'bs-rise flex flex-col')}>
          <CardTitle>{a.funnel}</CardTitle>
          <ol className="mt-4 grid grid-cols-4 text-center">
            {funnelKeys.map((key, i) => (
              <li key={key} className="grid min-w-0 justify-items-center gap-1.5 px-1">
                <p className="max-w-full truncate text-[12px] text-[#d3d7e1]">
                  {i + 1}. {a.funnelSteps[key]}
                </p>
                <p className="text-[21px] leading-none font-semibold tabular-nums">{n(funnelValues[i])}</p>
                <span className="mt-1 rounded-md border border-[#c9cdd8]/50 px-2.5 py-1 text-[11.5px] text-[#eef0f5] tabular-nums">
                  {pct(i === 0 ? (funnelValues[0] ? 100 : 0) : funnelValues[i - 1] ? (funnelValues[i] / funnelValues[i - 1]) * 100 : 0)}
                </span>
              </li>
            ))}
          </ol>
          <FunnelFlow values={funnelValues} label={a.funnel} />
          <p className="mt-3 flex items-center justify-between rounded-lg border border-border px-4 py-3 text-[12.5px] text-[#9aa1b2]">
            {a.funnelRate}
            <span className="font-medium text-[#3fe0b5] tabular-nums">{pct(c.funnel.signups ? (c.funnel.paying / c.funnel.signups) * 100 : 0)}</span>
          </p>
        </section>

        <section className={cn(card, 'bs-rise')}>
          <CardTitle>{a.health}</CardTitle>
          <div className="mt-2 grid justify-items-center">
            <HexHealth facets={c.facets.map((f) => ({ label: a.facets[f.key], value: f.value }))} center={c.health} caption={a.healthCenter} />
          </div>
          <ul className="mt-3 grid gap-1.5 text-[12px]">
            {c.facets.map((f, i) => (
              <li key={f.key} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2.5 text-[#d3d7e1]">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ background: HEX_COLORS[i % HEX_COLORS.length] }} />
                  <span className="truncate">{a.facets[f.key]}</span>
                </span>
                <span className="text-[#c9cdd8] tabular-nums">{f.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.07fr_1.27fr]">
        <section className={cn(card, 'bs-rise')}>
          <CardTitle action={periodPill}>{a.topScenarios}</CardTitle>
          {c.topScenarios.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#9aa1b2]">{a.empty}</p>
          ) : (
            <>
              <p className="mt-2 text-right text-[11px] text-[#9aa1b2]">{a.calls}</p>
              <ul className="mt-1.5 grid gap-3">
                {c.topScenarios.map((s, i) => (
                  <li key={s.id} className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_40px] items-center gap-3 text-[12.5px]">
                    <span className="truncate text-[#d3d7e1]" title={s.title}>
                      {s.title}
                    </span>
                    <span aria-hidden="true" className="h-[3px] rounded-full">
                      <span className="bs-grow-x block h-full rounded-full bg-[#5c55f0]" style={{ width: `${(s.n / maxScenario) * 100}%`, animationDelay: `${i * 80}ms` }} />
                    </span>
                    <span className="text-right text-[#d3d7e1] tabular-nums">{n(s.n)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className={cn(card, 'bs-rise')}>
          <CardTitle muted>{a.families}</CardTitle>
          {c.families.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#9aa1b2]">{a.empty}</p>
          ) : (
            <>
              <Bubbles items={c.families.map((f) => ({ label: t.enums.family[f.family as Family] ?? f.family, value: f.n }))} />
              <p className="sr-only">{c.families.map((f) => `${t.enums.family[f.family as Family] ?? f.family} : ${f.n}`).join(', ')}</p>
            </>
          )}
        </section>

        <section className={cn(card, 'bs-rise')}>
          <CardTitle>{a.activity}</CardTitle>
          {c.activity.length === 0 ? (
            <p className="mt-3 text-[13px] text-[#9aa1b2]">{a.activityEmpty}</p>
          ) : (
            <ul className="mt-4 grid gap-4">
              {c.activity.slice(0, 5).map((e) => (
                <li key={e.id} className="flex min-w-0 items-center justify-between gap-3 text-[12px]">
                  <span className="min-w-0 truncate text-[#d3d7e1]">
                    {e.organization ?? '—'} · {a.actions[e.action as keyof typeof a.actions] ?? e.action}
                  </span>
                  <span className="shrink-0 text-[11.5px] text-[#9aa1b2]">{ago(e.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(card, 'bs-rise relative flex min-h-[200px] overflow-hidden border-[#3a3b7a]/50 bg-[linear-gradient(135deg,#25274d,#222448_60%,#272a55)]')}>
          <div className="relative z-10 flex min-w-0 flex-1 flex-col pr-2">
            <h2 className="flex items-center gap-2.5 text-[15px] font-medium">
              <InsightSpark /> {a.insight}
            </h2>
            <p className="mt-5 max-w-[34ch] text-[12.5px] leading-relaxed text-[#cfd2e6]">
              {c.insight.ready
                ? format(a.insightText, { k: c.insight.threshold, a: c.insight.engagedRate, b: c.insight.othersRate })
                : format(a.insightWaiting, { k: c.insight.threshold, min: c.insight.min, engaged: c.insight.engaged, others: c.insight.others })}
            </p>
            <a href="#risk-title" className="mt-auto block pt-4 pl-3 text-[12.5px] text-[#d9d6ff] hover:text-white">
              {a.insightLink}
              {'\u00a0'}
              <ArrowRight className="inline size-3.5 align-[-2px]" aria-hidden="true" />
            </a>
          </div>
          <GlassTorus className="w-[44%] max-w-[190px] shrink-0 self-center" />
        </section>
      </div>

      <section aria-labelledby="risk-title" className={cn(card, 'bs-rise overflow-x-auto')}>
        <CardTitle id="risk-title" action={!showAll && c.accounts.length > accounts.length && <ViewAll href={`/admin?period=${days}&accounts=all#risk-title`}>{a.viewAll}</ViewAll>}>
          {a.risk}
        </CardTitle>
        {accounts.length === 0 ? (
          <p className="mt-3 text-[13px] text-[#9aa1b2]">{a.riskEmpty}</p>
        ) : (
          <table className="mt-3 w-full min-w-[800px] text-[12px]">
            <thead className="text-left text-[10.5px] tracking-[0.04em] text-[#c9cdd8] uppercase">
              <tr className="border-b border-[#9aa1b2]/70">
                <th className="px-3 py-2 font-medium">{a.cols.account}</th>
                <th className="py-2 font-medium">{a.cols.health}</th>
                <th className="py-2 font-medium">{a.cols.trend}</th>
                <th className="py-2 font-medium">{a.cols.last}</th>
                <th className="py-2 font-medium">{a.cols.usage}</th>
                <th className="py-2 font-medium">{a.cols.mrr}</th>
                <th className="py-2 font-medium">{a.cols.risk}</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((row) => {
                const recent = row.weekly[4] + row.weekly[5];
                const earlier = row.weekly[2] + row.weekly[3];
                return (
                  <tr key={row.id}>
                    <td className="max-w-[240px] truncate px-3 py-2.5 text-[#eef0f5]">
                      {row.name}
                      <span className="ml-2 text-[11px] text-[#9aa1b2]">{t.enums.plan[row.plan]}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums', healthTone(row.health))}>{row.health}</span>
                    </td>
                    <td className="py-2.5">
                      <TrendLine values={rolling(row.daily, 7)} tone={recent > earlier ? 'up' : recent < earlier ? 'down' : 'flat'} />
                    </td>
                    <td className="py-2.5 text-[#d3d7e1]">{ago(row.lastActivity)}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2.5">
                        <span aria-hidden="true" className="h-1 w-20 rounded-full bg-[#e9ecf4]">
                          <span className="bs-grow-x block h-full rounded-full bg-[linear-gradient(90deg,#4c7dff,#5ff0d6)]" style={{ width: `${row.usage}%` }} />
                        </span>
                        <span className="text-[#d3d7e1] tabular-nums">{row.usage} %</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-[#d3d7e1] tabular-nums">{row.mrr ? money(row.mrr) : a.none}</td>
                    <td className="py-2.5">
                      <span className={cn('rounded px-1.5 py-0.5 text-[11px]', RISK_TONE[row.risk])}>{a.risks[row.risk]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className={cn(card, 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4')} aria-label={a.costsTitle}>
        <p className="text-[12.5px] text-[#9aa1b2] sm:col-span-2 lg:col-span-4">{a.costsTitle}</p>
        <p className="text-[12.5px]">
          <span className="block text-[#9aa1b2]">{a.voiceTitle}</span>
          <span className="text-[17px] font-semibold tabular-nums">
            {n(costs.usage.minutesThisMonth)} / {n(costs.usage.monthlyMinutes)}
          </span>
        </p>
        <p className="text-[12.5px]">
          <span className="block text-[#9aa1b2]">{a.analysesTitle}</span>
          <span className="text-[17px] font-semibold tabular-nums">
            {n(costs.usage.analysesToday)} / {n(costs.usage.dailyAnalyses)}
          </span>
        </p>
        <p className="text-[12.5px]">
          <span className="block text-[#9aa1b2]">{a.elevenCost}</span>
          <span className="text-[17px] font-semibold tabular-nums">{n(costs.providerCost)}</span>
        </p>
        <p className="text-[12.5px]">
          <span className="block text-[#9aa1b2]">{a.tokens}</span>
          <span className="text-[17px] font-semibold tabular-nums">
            {n(costs.analyses.inputTokens)} / {n(costs.analyses.outputTokens)}
          </span>
        </p>
      </section>
    </div>
  );
}
