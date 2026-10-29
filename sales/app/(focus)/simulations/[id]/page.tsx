import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BarChart3,
  Check,
  ClipboardList,
  Clock,
  DoorOpen,
  Ear,
  FileText,
  Filter,
  Flag,
  Gem,
  Handshake,
  Hourglass,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
  MessageSquare,
  Mic,
  Phone,
  RefreshCw,
  Repeat,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { regenerateAnalysisAction } from '@/app/actions/simulations';
import { StatusBadge } from '@/app/(app)/simulations/status';
import {
  ScoreDial,
  ScoreOverTime,
  SkillRadarLight,
  Sparkline,
  TIER_COLORS,
  TierDonut,
  TrendGlyph,
  Trophy,
} from '@/components/report/charts';
import { ScenarioCard } from '@/components/scenarios/scenario-card';
import { ToneTag } from '@/components/vox/vox-screen';
import { Badge } from '@/components/ui/badge';
import { FormAlert } from '@/components/ui/field';
import { BENCHMARK_MIN, scenarioBenchmark, TIERS, tierOf } from '@/lib/analysis/benchmark';
import { analyzerFromEnv } from '@/lib/analysis/claude';
import type { AnalysisResult } from '@/lib/analysis/schema';
import { canReanalyze, getAnalysis } from '@/lib/analysis/service';
import { platformUsage } from '@/lib/billing/credits';
import { getDb } from '@/lib/server/db';
import type { TranscriptTurn } from '@/lib/db/schema';
import type { Family, Locale, Skill } from '@/lib/domain';
import { format, formatDate, type Dictionary } from '@/lib/i18n';
import { annotate, speechReport, TALK_TARGET } from '@/lib/live/speech';
import { listScenariosByIds } from '@/lib/scenarios/service';
import { scheduleAnalysis } from '@/lib/server/analysis';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { getSimulation, listSimulations, syncSimulation } from '@/lib/simulations/service';
import { voiceProviderFromEnv } from '@/lib/voice/provider';
import { cn } from '@/lib/utils';
import { AutoRefresh } from './auto-refresh';
import { PrintButton, RecordingPlayer } from './report-client';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> };

const TABS = ['overview', 'skills', 'analysis', 'questions', 'recommendations', 'speech', 'objections', 'recording'] as const;
type Tab = (typeof TABS)[number];
const TAB_ICONS: Record<Tab, typeof FileText> = {
  overview: FileText,
  skills: Target,
  analysis: BarChart3,
  questions: MessageSquare,
  recommendations: Lightbulb,
  speech: Mic,
  objections: ShieldAlert,
  recording: Video,
};

const SKILL_ICONS: Record<Skill, typeof FileText> = {
  opening: DoorOpen,
  active_listening: Ear,
  questioning: MessageCircleQuestion,
  needs_discovery: Search,
  qualification: Filter,
  reformulation: Repeat,
  value_proposition: Gem,
  objection_handling: ShieldCheck,
  silence_management: Hourglass,
  negotiation: Handshake,
  closing: Flag,
  clarity: Sparkles,
};

const OUTCOME_TONE: Record<AnalysisResult['outcome'], string> = {
  next_step_won: 'border-teal/30 bg-teal/5 text-teal',
  postponed: 'border-warning/30 bg-warning/5 text-warning',
  lost: 'border-destructive/30 bg-destructive/5 text-destructive',
  unclear: 'text-muted-foreground',
};

const HANDLING_TONE: Record<AnalysisResult['objections'][number]['handling'], string> = {
  well: 'border-teal/30 bg-teal/5 text-teal',
  partly: 'border-warning/30 bg-warning/5 text-warning',
  poorly: 'border-destructive/30 bg-destructive/5 text-destructive',
  not_raised: 'text-muted-foreground',
};

const FEEDBACK_TONE = {
  excellent: 'border-teal/30 bg-teal/10 text-teal',
  good: 'border-teal/25 bg-white text-teal',
  average: 'border-destructive/25 bg-destructive/5 text-destructive',
  poor: 'border-destructive/30 bg-destructive/10 text-destructive',
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auth } = await requireOnboarded();
  const sim = await getSimulation(await getDb(), auth, (await params).id);
  return { title: sim?.scenarioTitle };
}

// Suffixe ordinal du centile : 72e, 1er ; 72nd, 1st.
function ordinal(n: number, locale: Locale) {
  if (locale === 'fr') return n === 1 ? 'er' : 'e';
  const rule = new Intl.PluralRules('en-US', { type: 'ordinal' }).select(n);
  return { one: 'st', two: 'nd', few: 'rd', other: 'th', zero: 'th', many: 'th' }[rule];
}

function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function Panel({ title, className, children, actions }: { title?: string; className?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className={cn('rounded-2xl border border-border bg-white p-5 shadow-[0_1px_2px_rgb(30_20_80/0.04)]', className)}>
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
  ) : (
    <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
  );
}

function Transcript({ turns, prospectName, t, language }: { turns: TranscriptTurn[]; prospectName: string; t: Dictionary; language: Locale }) {
  if (turns.length === 0) return <p className="text-sm text-muted-foreground">{t.history.transcriptEmpty}</p>;
  return (
    <ol className="grid gap-3">
      {turns.map((turn, i) => (
        <li key={i} id={`turn-${i}`} className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-3 text-[14.5px] leading-relaxed">
          <span className="pt-0.5 text-xs text-muted-foreground tabular-nums">{clock(turn.at)}</span>
          <p className={turn.role === 'seller' ? 'text-foreground' : 'text-muted-foreground'}>
            <span className="mr-2 text-[11px] font-semibold tracking-wide uppercase">{turn.role === 'seller' ? t.call.you : prospectName}</span>
            {turn.role === 'seller'
              ? annotate(turn.text, language).map((p, k) =>
                  p.mark === 'filler' ? (
                    <span key={k} className="underline decoration-dotted underline-offset-4">
                      {p.text}
                    </span>
                  ) : p.mark ? (
                    <mark key={k} className={cn('rounded px-0.5 text-foreground', p.mark === 'hedge' ? 'bg-[#f5c591]/50' : 'bg-[#ef6f87]/25')}>
                      {p.text}
                    </mark>
                  ) : p.question ? (
                    <mark key={k} className="rounded bg-[#22a884]/15 px-0.5 text-foreground">
                      {p.text}
                    </mark>
                  ) : (
                    <span key={k}>{p.text}</span>
                  ),
                )
              : (
                  <>
                    <ToneTag tones={turn.tones} labels={t.call.tones} />
                    {turn.text}
                  </>
                )}
            {turn.interrupted && <span className="ml-1 text-warning">…</span>}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default async function SimulationPage({ params, searchParams }: Props) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const h = t.history;
  const r = t.report;
  const db = await getDb();
  const id = (await params).id;
  const requested = (await searchParams).tab;
  const tab: Tab = TABS.includes(requested as Tab) ? (requested as Tab) : 'overview';
  let sim = await getSimulation(db, auth, id);
  if (!sim) notFound();
  const provider = voiceProviderFromEnv();
  if (provider && ['connecting', 'in_progress', 'processing'].includes(sim.status)) {
    await syncSimulation(db, provider, sim).catch(() => undefined);
    sim = (await getSimulation(db, auth, id))!;
  }
  if (sim.status === 'completed') await scheduleAnalysis(sim.id);
  const analysis = sim.status === 'completed' ? await getAnalysis(db, sim.id) : null;
  const result = analysis?.status === 'completed' ? (analysis.result as AnalysisResult) : null;
  const analyzerReady = analyzerFromEnv() !== null;
  const regenerating = analysis?.status === 'failed' && analysis.error === 'regenerate';
  // Plafond quotidien de la plateforme atteint : l'analyse attend le lendemain.
  const saturated = sim.status === 'completed' && analyzerReady && (await platformUsage(db)).analysisSaturated;
  const deferred = saturated && (!analysis || regenerating);
  const waitingForAnalysis =
    sim.status === 'completed' &&
    analyzerReady &&
    !deferred &&
    (!analysis || analysis.status === 'running' || (analysis.status === 'failed' && analysis.attempts < 3));
  const pending = ['connecting', 'in_progress', 'processing'].includes(sim.status) || waitingForAnalysis;
  const transcript = sim.transcript ?? [];
  const language = sim.scenarioLanguage as Locale;
  const skillLabel = (skill: string) => t.enums.skill[skill as Skill] ?? skill;
  const href = (to: Tab) => (to === 'overview' ? `/simulations/${sim.id}` : `/simulations/${sim.id}?tab=${to}`);

  const button =
    'inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-3.5 text-sm font-medium shadow-[0_1px_2px_rgb(30_20_80/0.06)] hover:bg-surface-2 disabled:opacity-50';

  return (
    <div className="theme-light min-h-dvh bg-[radial-gradient(80%_60%_at_50%_0%,#ece8fb,transparent_70%)] px-2 py-3 sm:px-6 sm:py-8 print:p-0">
      <article className="relative mx-auto max-w-[1240px] rounded-[22px] border border-[#e2ddf5] bg-[#fcfcfe] shadow-[0_24px_70px_-36px_rgb(76_52_170/0.45)] ring-[6px] ring-[#ebe7fa]/70 print:border-0 print:shadow-none print:ring-0">
        <Link
          href="/simulations"
          aria-label={r.close}
          title={r.close}
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground print:hidden"
        >
          <X className="size-4" aria-hidden="true" />
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4 px-5 pt-6 sm:px-7 sm:pt-7 lg:flex-nowrap">
          <div className="flex min-w-0 flex-1 gap-3">
            <FileText className="mt-1 size-6 shrink-0 text-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="text-[19px] font-semibold tracking-tight">{r.title}</h1>
              <p className="mt-0.5 truncate text-sm text-muted-foreground" title={sim.scenarioTitle}>
                {format(r.by, { name: auth.user.name, scenario: sim.scenarioTitle, date: formatDate(sim.createdAt, locale) })}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <StatusBadge status={sim.status} t={t} />
                <span>{t.enums.family[sim.scenarioFamily as Family]}</span>
                {sim.status === 'completed' && sim.endReason && <span>· {h.endedBy[sim.endReason as keyof typeof h.endedBy]}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:shrink-0 lg:pr-8 print:hidden">
            <Link href={href(tab)} className={button}>
              <RefreshCw className="size-4" aria-hidden="true" /> {r.refresh}
            </Link>
            {result && (
              <form action={regenerateAnalysisAction}>
                <input type="hidden" name="simulation" value={sim.id} />
                <button type="submit" className={button} disabled={!analyzerReady || saturated || !canReanalyze(analysis)} title={r.regenerateHint}>
                  <RotateCcw className="size-4" aria-hidden="true" /> {r.regenerate}
                </button>
              </form>
            )}
            <PrintButton label={r.print} className={button} />
            {provider && (
              <Link href={`/scenarios/${sim.scenarioId}/call`} className={button}>
                <Phone className="size-4" aria-hidden="true" /> {h.retry}
              </Link>
            )}
          </div>
        </header>

        {sim.drill && (
          <p className="mx-5 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-teal/30 bg-teal/10 px-4 py-2.5 text-sm sm:mx-7 print:hidden">
            <span>{sim.drill.kind === 'moment' ? r.drillBanner : r.resumedBanner}</span>
            <Link href={`/simulations/${sim.drill.fromSimulationId}`} className="text-primary underline-offset-2 hover:underline">
              {r.drillOrigin}
            </Link>
            {sim.drill.kind === 'moment' && provider && (
              <Link
                href={`/scenarios/${sim.scenarioId}/call?${new URLSearchParams({ exercice: sim.drill.fromSimulationId, moment: String(sim.drill.moment ?? 0) })}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {r.drillAgain}
              </Link>
            )}
          </p>
        )}

        {result && (
          <nav aria-label={r.tabsLabel} className="mt-5 overflow-x-auto border-b border-border px-3 sm:px-5 print:hidden">
            <ul className="flex min-w-max gap-1">
              {TABS.map((key) => {
                const Icon = TAB_ICONS[key];
                const active = key === tab;
                return (
                  <li key={key}>
                    <Link
                      href={href(key)}
                      scroll={false}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative mb-2 inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] transition-colors',
                        active ? 'bg-[#efeafe] font-medium text-primary' : 'text-[#43465a] hover:bg-surface-2',
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {r.tabs[key]}
                      {active && <span aria-hidden="true" className="absolute inset-x-3 -bottom-2 h-[2.5px] rounded-full bg-primary" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <div className="grid gap-5 px-3 py-5 sm:px-6 sm:py-6">
          {pending && <AutoRefresh simulationId={sim.id} status={sim.status} analysis={analysis?.status ?? null} />}
          {['connecting', 'in_progress', 'processing'].includes(sim.status) && <FormAlert tone="success" message={h.processing} />}
          {sim.status === 'failed' && <FormAlert message={h.failed} />}
          {sim.status === 'cancelled' && <FormAlert message={h.cancelled} />}

          {sim.status === 'completed' && !result && (
            <Panel className="flex items-start gap-3 border-primary/25 bg-[#f7f4ff]">
              {waitingForAnalysis ? (
                <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              )}
              <p className="text-sm" role="status">
                {!analyzerReady
                  ? r.notConfigured
                  : deferred
                    ? r.deferred
                    : analysis?.status === 'insufficient'
                      ? r.insufficient
                      : analysis?.status === 'failed' && !regenerating
                        ? analysis.attempts < 3
                          ? r.failed
                          : r.failedFinal
                        : r.analyzing}
              </p>
            </Panel>
          )}

          {result &&
            (await (async () => {
              switch (tab) {
                case 'overview':
                  return <Overview />;
                case 'skills':
                  return <SkillsTab />;
                case 'analysis':
                  return <AnalysisTab />;
                case 'questions':
                  return <QuestionsTab />;
                case 'recommendations':
                  return <RecommendationsTab />;
                case 'speech':
                  return <SpeechTab />;
                case 'objections':
                  return <ObjectionsTab />;
                case 'recording':
                  return <RecordingTab />;
              }
            })())}

          {sim.status === 'completed' && !result && (
            <Panel title={h.transcript}>
              <Transcript turns={transcript} prospectName={sim.prospectName} t={t} language={language} />
            </Panel>
          )}
        </div>
      </article>
    </div>
  );

  // ─── Onglets ───────────────────────────────────────────────────────────────

  async function Overview() {
    const res = result!;
    const current = sim!;
    const [benchmark, history] = await Promise.all([
      scenarioBenchmark(db, current.scenarioId, current.id, res.overallScore),
      listSimulations(db, auth, 50),
    ]);
    const scored = history
      .filter((s) => s.overallScore !== null)
      .slice(0, 8)
      .reverse();
    const strengths = res.skills.filter((s) => s.score >= 70).length;
    const weak = res.skills.filter((s) => s.score < 50).length;
    const tiers = TIERS.map((tier) => ({ key: tier.key, count: res.skills.filter((s) => tierOf(s.score) === tier.key).length }));
    const total = res.skills.length;
    const insights = [
      res.strengths[0] && { icon: TrendingUp, tone: 'bg-[#e6f6f0] text-teal', text: res.strengths[0] },
      res.focusSkills.length > 0 && {
        icon: Target,
        tone: 'bg-[#fdf0e3] text-warning',
        text: format(r.insightFocus, { skills: res.focusSkills.map(skillLabel).join(', ') }),
      },
      res.improvements[0] && { icon: MessageSquare, tone: 'bg-[#efeafe] text-primary', text: res.improvements[0].why },
    ].filter(Boolean) as { icon: typeof FileText; tone: string; text: string }[];
    const kpi = 'flex items-start justify-between gap-3 rounded-2xl border border-border bg-white p-5 shadow-[0_1px_2px_rgb(30_20_80/0.04)]';
    const durationText = current.durationSeconds != null ? clock(current.durationSeconds) : '—';

    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.55fr_1fr_1fr_1fr_1fr]">
          <section
            aria-labelledby="report-title"
            className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#7b5cf5,#5a34db)] p-5 text-white shadow-[0_14px_30px_-16px_rgb(90_52_219/0.8)] sm:col-span-2 xl:col-span-1"
          >
            <span aria-hidden="true" className="absolute -top-10 -right-8 size-32 rounded-full bg-white/10" />
            <h2 id="report-title" className="relative text-[15px] font-medium">
              {r.overall}
            </h2>
            <div className="relative mt-3 flex items-center gap-3">
              <div className="relative grid shrink-0 place-items-center" data-tip={`${t.charts.overall}\n${res.overallScore} / 100\n${r.tierLabel[tierOf(res.overallScore)]}`}>
                <ScoreDial score={res.overallScore} size={84} />
                <span className="absolute grid justify-items-center leading-none">
                  <span className="text-[24px] font-semibold tabular-nums">{res.overallScore}</span>
                  <span className="mt-0.5 text-[10px] opacity-80">/100</span>
                </span>
              </div>
              <p className="w-[86px] shrink-0 text-[13px] leading-snug opacity-95">{r.tierLabel[tierOf(res.overallScore)]}</p>
              <div className="min-w-0 flex-1">
                <Sparkline
                  values={scored.map((s) => s.overallScore!)}
                  tips={scored.map((s) => `${formatDate(s.createdAt, locale)}${s.id === current.id ? ` · ${t.charts.thisCall}` : ''}\n${s.overallScore} / 100`)}
                />
              </div>
            </div>
          </section>

          <section className={kpi}>
            <div>
              <h2 className="text-sm font-medium text-primary">{r.percentile}</h2>
              {benchmark.percentile !== null ? (
                <>
                  <p className="mt-2 text-[30px] leading-none font-semibold tabular-nums">
                    {benchmark.percentile}
                    <sup className="ml-0.5 text-[15px] font-semibold">{ordinal(benchmark.percentile, locale)}</sup>
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{format(r.percentileText, { n: benchmark.percentile })}</p>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">{format(r.percentileWaiting, { n: benchmark.n, min: BENCHMARK_MIN })}</p>
              )}
            </div>
            <TrendGlyph />
          </section>

          <section className={kpi}>
            <div>
              <h2 className="text-sm font-medium text-teal">{r.strengthsCount}</h2>
              <p className="mt-2 text-[30px] leading-none font-semibold tabular-nums">{strengths}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.strengthsText}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e6f6f0] text-teal">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
          </section>

          <section className={kpi}>
            <div>
              <h2 className="text-sm font-medium">{r.improveCount}</h2>
              <p className="mt-2 text-[30px] leading-none font-semibold tabular-nums">{weak}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.improveText}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#fdf0e3] text-[#e08a1e]">
              <Zap className="size-5" aria-hidden="true" />
            </span>
          </section>

          <section className={kpi}>
            <div>
              <h2 className="text-sm font-medium">{r.duration}</h2>
              <p className="mt-2 text-[30px] leading-none font-semibold tabular-nums">{durationText}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.durationUnit}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e8eefc] text-[#3f5bd8]">
              <Clock className="size-5" aria-hidden="true" />
            </span>
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
          <Panel
            title={r.skillOverview}
            actions={
              <span className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-[2.5px] w-5 rounded bg-primary" /> {r.yourScore}
                </span>
                {Object.keys(benchmark.skillAverages).length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-[#9a9cb0]" /> {r.averageScore}
                  </span>
                )}
              </span>
            }
          >
            <SkillRadarLight
              label={r.skillsTitle}
              axes={res.skills.map((s) => ({ label: skillLabel(s.skill), score: s.score, average: benchmark.skillAverages[s.skill] }))}
              tips={res.skills.map((s) =>
                [
                  skillLabel(s.skill),
                  format(t.charts.you, { n: s.score }),
                  typeof benchmark.skillAverages[s.skill] === 'number' ? format(t.charts.others, { n: Math.round(benchmark.skillAverages[s.skill]!) }) : '',
                ]
                  .filter(Boolean)
                  .join('\n'),
              )}
            />
            {Object.keys(benchmark.skillAverages).length === 0 && (
              <p className="text-center text-xs text-muted-foreground">{format(r.averageWaiting, { min: BENCHMARK_MIN })}</p>
            )}
          </Panel>

          <Panel title={r.breakdown}>
            <div className="grid grid-cols-[minmax(0,1fr)_56px_minmax(96px,auto)] items-center gap-x-4 pb-2 text-xs text-muted-foreground">
              <span />
              <span className="text-right">{r.scoreCol}</span>
              <span>{r.feedbackCol}</span>
            </div>
            <ul className="grid gap-3.5">
              {res.skills.map((s) => {
                const Icon = SKILL_ICONS[s.skill as Skill] ?? Sparkles;
                const tier = tierOf(s.score);
                return (
                  <li key={s.skill} className="grid grid-cols-[minmax(0,1fr)_56px_minmax(96px,auto)] items-center gap-x-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          'grid size-9 shrink-0 place-items-center rounded-lg',
                          s.score >= 60 ? 'bg-[#e6f6f0] text-teal' : 'bg-[#efeafe] text-primary',
                        )}
                      >
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium">{skillLabel(s.skill)}</p>
                        <div className="mt-1.5 h-[5px] rounded-full bg-[#efedf5]">
                          <div
                            className={cn('h-full rounded-full', s.score >= 60 ? 'bg-[#22a884]' : 'bg-[#7b5cf5]')}
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className={cn('text-right text-sm font-semibold tabular-nums', s.score < 40 && 'text-destructive')}>{s.score}%</span>
                    <span className={cn('justify-self-start rounded-md border px-2 py-0.5 text-[11.5px]', FEEDBACK_TONE[tier])}>{r.feedback[tier]}</span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title={r.scoreOverTime}>
            {scored.length >= 2 ? (
              <ScoreOverTime
                label={r.scoreOverTime}
                points={scored.map((s) => ({
                  label: new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' }).format(s.createdAt),
                  score: s.overallScore!,
                  current: s.id === current.id,
                }))}
                tips={scored.map((s) => `${formatDate(s.createdAt, locale)}${s.id === current.id ? ` · ${t.charts.thisCall}` : ''}\n${s.overallScore} / 100`)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{r.scoreOverTimeEmpty}</p>
            )}
          </Panel>

          <Panel title={r.byCategory}>
            <div className="flex items-center gap-4">
              <div className="w-[42%] max-w-[150px] shrink-0">
                <TierDonut segments={tiers} total={total} caption={r.totalSkills} labels={r.tierRange} />
              </div>
              <ul className="grid flex-1 gap-3 text-[12.5px] whitespace-nowrap">
                {tiers.map((tier) => (
                  <li key={tier.key} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ background: TIER_COLORS[tier.key] }} />
                      {r.tierRange[tier.key]}
                    </span>
                    <span className="font-medium tabular-nums">
                      {tier.count} ({total ? Math.round((tier.count / total) * 100) : 0}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel title={r.insights}>
            <ul className="grid gap-2.5">
              {insights.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-surface-2 p-3 text-[13.5px] leading-snug">
                  <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', item.tone)}>
                    <item.icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="pt-0.5">{item.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-[linear-gradient(90deg,#f8f6ff,#f3effe)] p-5">
          <div className="flex max-w-3xl gap-3">
            <ClipboardList className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] font-semibold">{r.summary}</h2>
                <Badge variant="outline" className={OUTCOME_TONE[res.outcome]}>
                  {r.outcome[res.outcome]}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#3f4155]">{res.summary}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.overallHint}</p>
            </div>
          </div>
          <Trophy />
        </section>
      </>
    );
  }

  function SkillsTab() {
    const res = result!;
    return (
      <section className="grid gap-4 md:grid-cols-2">
        {res.skills.map((s) => (
          <Panel key={s.skill} className="grid content-start gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-semibold">{skillLabel(s.skill)}</h2>
              <span className="text-sm text-muted-foreground tabular-nums">
                <span className="text-lg font-semibold text-foreground">{s.score}</span>/100 · {format(r.weight, { n: res.weights[s.skill] ?? 0 })}
              </span>
            </div>
            <div className="h-[5px] rounded-full bg-[#efedf5]">
              <div className={cn('h-full rounded-full', s.score >= 60 ? 'bg-[#22a884]' : 'bg-[#7b5cf5]')} style={{ width: `${s.score}%` }} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.justification}</p>
            {s.evidence.length > 0 && (
              <div className="grid gap-1.5">
                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{r.evidence}</p>
                {s.evidence.map((e, i) => (
                  <blockquote key={i} className="border-l-2 border-primary/50 pl-3 text-sm">
                    « {e.quote} »{' '}
                    <Link href={`${href('recording')}#turn-${e.turn}`} className="text-xs text-muted-foreground hover:text-primary">
                      {format(r.turnAt, { t: clock(transcript[e.turn]?.at ?? 0) })}
                    </Link>
                  </blockquote>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </section>
    );
  }

  function AnalysisTab() {
    const res = result!;
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title={r.criteriaTitle}>
          <ul className="grid gap-3">
            {res.successCriteria.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <Mark ok={c.met} />
                <span>
                  {c.criterion}
                  <span className="block text-xs text-muted-foreground">{c.evidence}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={r.hiddenTitle}>
          <ul className="grid gap-3">
            {res.hiddenFacts.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <Mark ok={f.uncovered} />
                <span>
                  {f.fact} <span className="text-xs text-muted-foreground">· {f.uncovered ? r.hiddenFound : r.hiddenMissed}</span>
                  {!f.uncovered && <span className="block text-xs text-muted-foreground">{format(r.hiddenHow, { q: f.howToUncover })}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={r.strengthsTitle}>
          <ul className="grid gap-2">
            {res.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" /> {s}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  function QuestionsTab() {
    const speech = speechReport(transcript, sim!.durationSeconds, language);
    const open = speech.questions.filter((q) => q.open).length;
    return (
      <Panel title={r.questionsAsked}>
        {speech.questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{r.questionsEmpty}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{format(r.questionsHint, { open, closed: speech.questions.length - open })}</p>
            <ol className="mt-4 grid gap-2.5">
              {speech.questions.map((q, i) => (
                <li key={i} className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-border bg-white p-3 text-sm">
                  <span className="text-xs text-muted-foreground tabular-nums">{clock(q.at)}</span>
                  <span>{q.text}</span>
                  <span
                    className={cn(
                      'rounded-md border px-2 py-0.5 text-[11.5px]',
                      q.open ? 'border-teal/30 bg-teal/10 text-teal' : 'border-border bg-surface-2 text-muted-foreground',
                    )}
                  >
                    {q.open ? r.openQ : r.closedQ}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </Panel>
    );
  }

  async function RecommendationsTab() {
    const res = result!;
    const recommended = await listScenariosByIds(db, auth, res.recommendedScenarioIds);
    return (
      <>
        {res.improvements.length > 0 && (
          <Panel title={r.improvementsTitle} className="grid gap-4">
            {res.improvements.map((imp, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-border bg-surface-2/60 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{r.youSaid}</p>
                  <p className="mt-1 text-sm">« {imp.said} »</p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-teal uppercase">{r.better}</p>
                  <p className="mt-1 text-sm">« {imp.better} »</p>
                </div>
                <p className="text-sm text-muted-foreground md:col-span-2">{imp.why}</p>
                {provider && (
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2 print:hidden">
                    <Link href={`/scenarios/${sim!.scenarioId}/call?${new URLSearchParams({ exercice: sim!.id, moment: String(i) })}`} className={button}>
                      <Repeat className="size-4" aria-hidden="true" /> {r.drillButton}
                    </Link>
                    <span className="text-xs text-muted-foreground">{r.drillHint}</span>
                  </div>
                )}
              </div>
            ))}
          </Panel>
        )}
        <section aria-labelledby="next-title" className="grid gap-3">
          <div>
            <h2 id="next-title" className="text-lg font-semibold">
              {r.nextTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{format(r.nextHint, { skills: res.focusSkills.map(skillLabel).join(', ') })}</p>
          </div>
          {recommended.length === 0 ? (
            <p className="text-sm text-muted-foreground">{r.nextEmpty}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {recommended.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} t={t} />
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  function SpeechTab() {
    const speech = speechReport(transcript, sim!.durationSeconds, language);
    const max = Math.max(1, ...speech.fillers.map((f) => f.count));
    const tile = (label: string, value: string, hint?: string) => (
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-[26px] leading-none font-semibold tabular-nums">{value}</p>
        {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
      </div>
    );
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tile(r.talkRatio, speech.talkRatio === null ? '—' : `${speech.talkRatio} %`, format(r.talkRatioHint, { min: TALK_TARGET.min, max: TALK_TARGET.max }))}
          {tile(r.pace, speech.wordsPerMinute === null ? '—' : `${speech.wordsPerMinute}`, r.paceUnit)}
          {tile(r.longest, format(r.secondsShort, { n: speech.longestMonologueSeconds }))}
          {tile(r.interruptions, String(speech.interruptions))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel title={r.fillers}>
            {speech.fillerTotal === 0 ? (
              <p className="text-sm text-muted-foreground">{r.fillersNone}</p>
            ) : (
              <ul className="grid gap-2.5">
                {speech.fillers
                  .filter((f) => f.count > 0)
                  .map((f) => (
                    <li key={f.key} className="grid grid-cols-[120px_minmax(0,1fr)_32px] items-center gap-3 text-sm">
                      <span>{f.label}</span>
                      <span aria-hidden="true" className="h-[6px] rounded-full bg-[#efedf5]">
                        <span className="block h-full rounded-full bg-[#7b5cf5]" style={{ width: `${(f.count / max) * 100}%` }} />
                      </span>
                      <span className="text-right tabular-nums">{f.count}</span>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>
          <Panel>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{r.hedges}</dt>
                <dd className="font-semibold tabular-nums">{speech.hedges}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{r.concessions}</dt>
                <dd className="font-semibold tabular-nums">{speech.concessions}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{r.questionsAsked}</dt>
                <dd className="font-semibold tabular-nums">{speech.questions.length}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">{r.speechHint}</p>
          </Panel>
        </div>
      </>
    );
  }

  function ObjectionsTab() {
    const res = result!;
    return (
      <Panel title={r.objectionsTitle}>
        <ul className="grid gap-3">
          {res.objections.map((o, i) => (
            <li key={i} className="grid gap-1 rounded-xl border border-border bg-white p-4 text-sm">
              <span className="flex flex-wrap items-center gap-2 font-medium">
                {o.objection}
                <Badge variant="outline" className={HANDLING_TONE[o.handling]}>
                  {r.handling[o.handling]}
                </Badge>
              </span>
              <span className="text-muted-foreground">{o.comment}</span>
            </li>
          ))}
        </ul>
      </Panel>
    );
  }

  function RecordingTab() {
    const current = sim!;
    return (
      <>
        <Panel title={r.tabs.recording}>
          <RecordingPlayer
            src={`/api/simulations/${current.id}/audio`}
            markers={(current.markers ?? []).map((at) => ({ at, label: format(r.goTo, { t: clock(at) }) }))}
            labels={{ missing: r.recordingMissing, markers: r.markers, markersEmpty: r.markersEmpty }}
          />
        </Panel>
        <Panel title={h.transcript}>
          <Transcript turns={transcript} prospectName={current.prospectName} t={t} language={language} />
        </Panel>
      </>
    );
  }
}
