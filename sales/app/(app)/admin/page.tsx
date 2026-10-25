import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowDownRight, ArrowUpRight, CalendarDays, ChevronDown, Sparkles, Upload } from 'lucide-react';
import {
  AreaWave,
  Bubbles,
  DotGrid,
  DottedLine,
  DotWave,
  FunnelFlow,
  GlassRing,
  HalfGauge,
  HealthRing,
  PLAN_COLORS,
  PlanDonut,
  SubscriptionBars,
  TrendLine,
} from '@/components/cockpit/charts';
import { platformReport } from '@/lib/billing/admin';
import { cockpit, PERIODS, type Period, type RiskFactor } from '@/lib/billing/cockpit';
import { billingProviderFromEnv } from '@/lib/billing/stripe';
import { getDb } from '@/lib/db/client';
import type { Family } from '@/lib/domain';
import { format } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { robots: { index: false } };

type Props = { searchParams: Promise<{ period?: string }> };

const RISK_TONE: Record<RiskFactor, string> = {
  past_due: 'bg-[#f06b8f]/15 text-[#ff8fab]',
  inactive: 'bg-[#f5a524]/15 text-[#ffc15e]',
  declining: 'bg-[#f5a524]/15 text-[#ffc15e]',
  quota: 'bg-[#4c7dff]/15 text-[#8fb0ff]',
  none: 'bg-white/5 text-muted-foreground',
};

function healthTone(score: number) {
  return score >= 80 ? 'bg-[#3fe0b5]/15 text-[#5ff0c6]' : score >= 50 ? 'bg-[#f5a524]/15 text-[#ffc15e]' : 'bg-[#f06b8f]/15 text-[#ff8fab]';
}

// Écart en pourcentage avec la période précédente (rien si elle était vide : un écart infini ne dit rien).
function Change({ value, previous, label, points, tag }: { value: number | null; previous: number | null; label: string; points?: boolean; tag: string }) {
  if (value === null || previous === null || (!points && previous === 0)) return <p className="text-[11.5px] text-muted-foreground">{label}</p>;
  const diff = points ? Math.round((value - previous) * 10) / 10 : Math.round(((value - previous) / previous) * 1000) / 10;
  const up = diff >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
      <span className={cn('inline-flex items-center gap-0.5 font-medium', up ? 'text-[#3fe0b5]' : 'text-[#ff8fab]')}>
        <Icon className="size-3.5" aria-hidden="true" />
        {new Intl.NumberFormat(tag).format(Math.abs(diff))}
        {points ? ' pt' : ' %'}
      </span>
      {label}
    </p>
  );
}

// Page de l'éditeur uniquement : pour tout autre compte, elle n'existe pas.
export default async function AdminPage({ searchParams }: Props) {
  const { auth } = await requireOnboarded();
  if (!auth.user.isPlatformAdmin) notFound();
  const { t, locale } = await getI18n();
  const a = t.admin;
  const requested = Number((await searchParams).period);
  const days: Period = (PERIODS as readonly number[]).includes(requested) ? (requested as Period) : 30;
  const db = await getDb();
  const provider = billingProviderFromEnv();
  const now = new Date();
  const [prices, invoices] = provider
    ? await Promise.all([
        provider.prices().catch(() => null),
        provider.paidInvoices(new Date(now.getTime() - 2 * days * 86_400_000)).catch((err) => {
          console.error('[cockpit] factures', err instanceof Error ? err.message : err);
          return null;
        }),
      ])
    : [null, null];
  const [c, costs] = await Promise.all([cockpit(db, { days, now, prices, invoices }), platformReport(db, now)]);

  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const n = (v: number) => new Intl.NumberFormat(tag).format(v);
  const money = (cents: number, currency = 'eur') =>
    new Intl.NumberFormat(tag, { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
  const range = `${new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' }).format(c.since)} – ${new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' }).format(now)}`;
  const rtf = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' });
  const ago = (d: Date | null) => {
    if (!d) return a.never;
    const minutes = Math.round((d.getTime() - now.getTime()) / 60_000);
    if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
    return rtf.format(Math.round(hours / 24), 'day');
  };
  const vs = a.vsPrevious;
  const card = 'min-w-0 rounded-xl border border-border bg-surface p-4';
  const kpiTitle = 'text-[13px] font-medium text-[#d9dce6]';
  const kpiValue = 'mt-2 text-[22px] leading-none font-semibold tracking-tight tabular-nums';
  const funnelValues = [c.funnel.signups, c.funnel.onboarded, c.funnel.called, c.funnel.paying];
  const funnelKeys = ['signups', 'onboarded', 'called', 'paying'] as const;
  const mrrSegments = (['pro', 'team'] as const).map((key) => ({ key, value: c.mrr.byPlan[key] }));
  const maxScenario = Math.max(1, ...c.topScenarios.map((s) => s.n));
  const accounts = c.accounts.slice(0, 8);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{a.title}</h1>
          <p className="text-[13px] text-muted-foreground">{a.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <details className="group relative">
            <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px]">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">{a.period} : </span>
              {range}
              <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </summary>
            <ul className="absolute right-0 z-20 mt-1 grid min-w-44 gap-0.5 rounded-lg border border-border bg-surface-2 p-1 shadow-xl">
              {PERIODS.map((p) => (
                <li key={p}>
                  <a
                    href={`/admin?period=${p}`}
                    aria-current={p === days ? 'true' : undefined}
                    className={cn('block rounded-md px-3 py-1.5 text-[13px] hover:bg-white/5', p === days && 'text-primary')}
                  >
                    {a.periods[`d${p}`]}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <a
            href={`/api/admin/export?period=${days}`}
            download
            className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-white hover:bg-primary/90"
          >
            <Upload className="size-4" aria-hidden="true" /> {a.export}
          </a>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.35fr_1fr_1fr_1fr_1fr_0.95fr]">
        <section className={cn(card, 'grid content-between gap-2')}>
          <div className="flex items-start justify-between gap-2">
            <h2 className={kpiTitle}>{a.revenue}</h2>
            <span className="rounded-full border border-[#3fe0b5]/30 bg-[#3fe0b5]/10 px-2 py-0.5 text-[10.5px] text-[#5ff0c6]">● {a.live}</span>
          </div>
          {c.revenue ? (
            <>
              <p className={cn(kpiValue, 'text-[26px]')}>{money(c.revenue.total, c.revenue.currency)}</p>
              <Change value={c.revenue.total} previous={c.revenue.previous} label={vs} tag={tag} />
              <DotWave values={c.revenue.byDay} label={a.revenueChart} />
            </>
          ) : (
            <>
              <p className={cn(kpiValue, 'text-[26px] text-muted-foreground')}>{a.none}</p>
              <p className="text-[11.5px] text-muted-foreground">{a.revenueNone}</p>
              <DotWave values={c.callsByDay.map(() => 0)} label={a.revenueChart} />
            </>
          )}
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{a.activeAccounts}</h2>
          <p className={kpiValue}>{n(c.activeAccounts.value)}</p>
          <Change value={c.activeAccounts.value} previous={c.activeAccounts.previous} label={vs} tag={tag} />
          <DotGrid values={c.callsByDay} label={a.activeChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{a.mrr}</h2>
          <p className={kpiValue}>{money(c.mrr.value)}</p>
          <Change value={c.mrr.value} previous={c.mrr.previous} label={format(a.mrrHint, { n: c.mrr.subscribers })} tag={tag} />
          <AreaWave values={c.mrr.series} label={a.mrrChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{a.conversion}</h2>
          <p className={kpiValue}>{c.conversion.value === null ? a.none : `${n(c.conversion.value)} %`}</p>
          <Change value={c.conversion.value} previous={c.conversion.previous} label={format(a.conversionHint, { n: c.conversion.signups })} points tag={tag} />
          <DottedLine values={c.conversion.signupsByDay} label={a.conversionChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{a.churn}</h2>
          <p className={kpiValue}>{c.churn.value === null ? a.none : `${n(c.churn.value)} %`}</p>
          <p className="text-[11.5px] text-muted-foreground">{format(a.churnHint, { n: c.churn.canceled })}</p>
          <SubscriptionBars active={c.mrr.subscribers} canceled={c.churn.canceled} label={a.churnChart} />
        </section>

        <section className={cn(card, 'grid content-between gap-2')}>
          <h2 className={kpiTitle}>{a.score}</h2>
          <p className={kpiValue}>{c.score.value === null ? a.none : c.score.value}</p>
          <Change value={c.score.value} previous={c.score.previous} label={format(a.scoreHint, { n: c.score.n })} points tag={tag} />
          <HalfGauge value={c.score.value} label={a.score} />
        </section>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_1.45fr_1fr]">
        <section className={card}>
          <h2 className="text-[14px] font-semibold">{a.mrrByPlan}</h2>
          {c.mrr.value === 0 && <p className="mt-3 text-[13px] text-muted-foreground">{a.mrrEmpty}</p>}
          <div className="mt-3 flex items-center gap-4">
            <div className="w-[46%] shrink-0">
              <PlanDonut segments={mrrSegments} center={money(c.mrr.value)} caption={a.mrrTotal} />
            </div>
            <ul className="grid flex-1 gap-3 text-[13px]">
              {mrrSegments.map((s) => (
                <li key={s.key} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-2">
                  <span aria-hidden="true" className="mt-1.5 size-2 rounded-full" style={{ background: PLAN_COLORS[s.key] }} />
                  <span>
                    {t.enums.plan[s.key]}
                    <span className="block text-[12px] text-muted-foreground tabular-nums">{money(s.value)}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">{c.mrr.value ? Math.round((s.value / c.mrr.value) * 100) : 0} %</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{a.funnel}</h2>
          <ol className="mt-3 grid grid-cols-4 gap-2">
            {funnelKeys.map((key, i) => (
              <li key={key} className="min-w-0">
                <p className="truncate text-[12px] text-muted-foreground">
                  {i + 1}. {a.funnelSteps[key]}
                </p>
                <p className="mt-0.5 text-[18px] font-semibold tabular-nums">{n(funnelValues[i])}</p>
                <span className="mt-1 inline-block rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[11px] tabular-nums">
                  {n(c.funnel.signups ? Math.round((funnelValues[i] / c.funnel.signups) * 1000) / 10 : 0)} %
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-3">
            <FunnelFlow values={funnelValues} label={a.funnel} />
          </div>
          <p className="mt-2 flex justify-between border-t border-border pt-2 text-[12px] text-muted-foreground">
            {a.funnelRate}
            <span className="font-medium text-[#3fe0b5] tabular-nums">{n(c.funnel.signups ? Math.round((c.funnel.paying / c.funnel.signups) * 1000) / 10 : 0)} %</span>
          </p>
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{a.health}</h2>
          <div className="mt-2 grid justify-items-center">
            <HealthRing facets={c.facets.map((f) => ({ label: a.facets[f.key], value: f.value }))} center={c.health} caption={a.healthCenter} />
          </div>
          <ul className="mt-2 grid gap-1.5 text-[12.5px]">
            {c.facets.map((f) => (
              <li key={f.key} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span aria-hidden="true" className={cn('size-2 rounded-full', f.value >= 85 ? 'bg-[#3fe0b5]' : f.value >= 60 ? 'bg-[#4c7dff]' : 'bg-[#7b6cff]')} />
                  {a.facets[f.key]}
                </span>
                <span className="tabular-nums">{f.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_0.85fr_1fr_1fr]">
        <section className={card}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14px] font-semibold">{a.topScenarios}</h2>
            <span className="text-[11.5px] text-muted-foreground">{a.calls}</span>
          </div>
          {c.topScenarios.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">{a.empty}</p>
          ) : (
            <ul className="mt-3 grid gap-2.5">
              {c.topScenarios.map((s) => (
                <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_88px_40px] items-center gap-2 text-[12.5px]">
                  <span className="truncate" title={s.title}>
                    {s.title}
                  </span>
                  <span aria-hidden="true" className="h-1.5 rounded-full bg-white/5">
                    <span className="block h-full rounded-full bg-[linear-gradient(90deg,#7b6cff,#4c7dff)]" style={{ width: `${(s.n / maxScenario) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums">{n(s.n)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{a.families}</h2>
          {c.families.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">{a.empty}</p>
          ) : (
            <>
              <Bubbles items={c.families.map((f) => ({ label: t.enums.family[f.family as Family] ?? f.family, value: f.n }))} />
              <p className="sr-only">{c.families.map((f) => `${t.enums.family[f.family as Family] ?? f.family} : ${f.n}`).join(', ')}</p>
            </>
          )}
        </section>

        <section className={card}>
          <h2 className="text-[14px] font-semibold">{a.activity}</h2>
          {c.activity.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted-foreground">{a.activityEmpty}</p>
          ) : (
            <ul className="mt-3 grid gap-2.5">
              {c.activity.map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 text-[12.5px]">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{e.organization ?? '—'}</span>
                    <span className="block truncate text-muted-foreground">{a.actions[e.action as keyof typeof a.actions] ?? e.action}</span>
                  </span>
                  <span className="shrink-0 text-[11.5px] text-muted-foreground">{ago(e.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(card, 'relative overflow-hidden bg-[radial-gradient(120%_100%_at_100%_100%,#2b2468,#16171d_60%)]')}>
          <h2 className="flex items-center gap-2 text-[14px] font-semibold">
            <Sparkles className="size-4 text-[#a99dff]" aria-hidden="true" /> {a.insight}
          </h2>
          <p className="relative z-10 mt-3 max-w-[62%] text-[13px] leading-relaxed text-[#d9dce6]">
            {c.insight.ready
              ? format(a.insightText, { k: c.insight.threshold, a: c.insight.engagedRate, b: c.insight.othersRate })
              : format(a.insightWaiting, { k: c.insight.threshold, min: c.insight.min, engaged: c.insight.engaged, others: c.insight.others })}
          </p>
          <a href="#risk-title" className="relative z-10 mt-3 inline-block text-[12.5px] text-[#a99dff] hover:underline">
            {a.insightLink} →
          </a>
          <div className="absolute right-2 bottom-1">
            <GlassRing />
          </div>
        </section>
      </div>

      <section aria-labelledby="risk-title" className={cn(card, 'overflow-x-auto')}>
        <h2 id="risk-title" className="text-[14px] font-semibold">
          {a.risk}
        </h2>
        {accounts.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted-foreground">{a.riskEmpty}</p>
        ) : (
          <table className="mt-3 w-full min-w-[760px] text-[12.5px]">
            <thead className="text-left text-[11px] tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="py-2 font-medium">{a.cols.account}</th>
                <th className="py-2 font-medium">{a.cols.health}</th>
                <th className="py-2 font-medium">{a.cols.trend}</th>
                <th className="py-2 font-medium">{a.cols.last}</th>
                <th className="py-2 font-medium">{a.cols.usage}</th>
                <th className="py-2 text-right font-medium">{a.cols.mrr}</th>
                <th className="py-2 pl-6 font-medium">{a.cols.risk}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {accounts.map((row) => {
                const recent = row.weekly[4] + row.weekly[5];
                const earlier = row.weekly[2] + row.weekly[3];
                return (
                  <tr key={row.id}>
                    <td className="max-w-[220px] truncate py-2.5 pr-3 font-medium">
                      {row.name}
                      <span className="ml-2 text-[11px] font-normal text-muted-foreground">{t.enums.plan[row.plan]}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={cn('rounded-md px-2 py-0.5 text-[11.5px] font-semibold tabular-nums', healthTone(row.health))}>{row.health}</span>
                    </td>
                    <td className="py-2.5">
                      <TrendLine values={row.weekly} tone={recent > earlier ? 'up' : recent < earlier ? 'down' : 'flat'} />
                    </td>
                    <td className="py-2.5 text-muted-foreground">{ago(row.lastActivity)}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-1.5 w-20 rounded-full bg-white/5">
                          <span className="block h-full rounded-full bg-[linear-gradient(90deg,#7b6cff,#4c7dff)]" style={{ width: `${row.usage}%` }} />
                        </span>
                        <span className="tabular-nums">{row.usage} %</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">{row.mrr ? money(row.mrr) : a.none}</td>
                    <td className="py-2.5 pl-6">
                      <span className={cn('rounded-md px-2 py-0.5 text-[11.5px]', RISK_TONE[row.risk])}>{a.risks[row.risk]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className={cn(card, 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4')} aria-label={a.costsTitle}>
        <p className="text-[12.5px] text-muted-foreground sm:col-span-2 lg:col-span-4">{a.costsTitle}</p>
        <p className="text-[12.5px]">
          <span className="block text-muted-foreground">{a.voiceTitle}</span>
          <span className="text-[17px] font-semibold tabular-nums">
            {n(costs.usage.minutesThisMonth)} / {n(costs.usage.monthlyMinutes)}
          </span>
        </p>
        <p className="text-[12.5px]">
          <span className="block text-muted-foreground">{a.analysesTitle}</span>
          <span className="text-[17px] font-semibold tabular-nums">
            {n(costs.usage.analysesToday)} / {n(costs.usage.dailyAnalyses)}
          </span>
        </p>
        <p className="text-[12.5px]">
          <span className="block text-muted-foreground">{a.elevenCost}</span>
          <span className="text-[17px] font-semibold tabular-nums">{n(costs.providerCost)}</span>
        </p>
        <p className="text-[12.5px]">
          <span className="block text-muted-foreground">{a.tokens}</span>
          <span className="text-[17px] font-semibold tabular-nums">
            {n(costs.analyses.inputTokens)} / {n(costs.analyses.outputTokens)}
          </span>
        </p>
      </section>
    </div>
  );
}

