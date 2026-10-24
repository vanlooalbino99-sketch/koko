import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Loader2, Phone, Sparkles, X } from 'lucide-react';
import { ScoreRing } from '@/components/charts/score-trend';
import { SkillRadar } from '@/components/charts/skill-radar';
import { ScenarioCard } from '@/components/scenarios/scenario-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { analyzerFromEnv } from '@/lib/analysis/claude';
import type { AnalysisResult } from '@/lib/analysis/schema';
import { getAnalysis } from '@/lib/analysis/service';
import { getDb } from '@/lib/db/client';
import type { TranscriptTurn } from '@/lib/db/schema';
import type { Family, Skill } from '@/lib/domain';
import { format, formatDate, type Dictionary } from '@/lib/i18n';
import { listScenariosByIds } from '@/lib/scenarios/service';
import { scheduleAnalysis } from '@/lib/server/analysis';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { getSimulation, syncSimulation } from '@/lib/simulations/service';
import { voiceProviderFromEnv } from '@/lib/voice/provider';
import { cn } from '@/lib/utils';
import { StatusBadge, duration } from '../status';
import { AutoRefresh } from './auto-refresh';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auth } = await requireOnboarded();
  const sim = await getSimulation(await getDb(), auth, (await params).id);
  return { title: sim?.scenarioTitle };
}

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const OUTCOME_TONE: Record<AnalysisResult['outcome'], string> = {
  next_step_won: 'border-teal/30 text-teal',
  postponed: 'border-warning/30 text-warning',
  lost: 'border-destructive/30 text-destructive',
  unclear: 'text-muted-foreground',
};

const HANDLING_TONE: Record<AnalysisResult['objections'][number]['handling'], string> = {
  well: 'border-teal/30 text-teal',
  partly: 'border-warning/30 text-warning',
  poorly: 'border-destructive/30 text-destructive',
  not_raised: 'text-muted-foreground',
};

function Transcript({ turns, prospectName, t }: { turns: TranscriptTurn[]; prospectName: string; t: Dictionary }) {
  if (turns.length === 0) return <p className="mt-4 text-sm text-muted-foreground">{t.history.transcriptEmpty}</p>;
  return (
    <ol className="mt-4 grid gap-3">
      {turns.map((turn, i) => (
        <li key={i} id={`turn-${i}`} className={cn('grid gap-0.5', turn.role === 'seller' && 'justify-items-end text-right')}>
          <span className="text-xs text-muted-foreground">
            {turn.role === 'seller' ? t.call.you : prospectName} · <span className="tabular-nums">{clock(turn.at)}</span>
          </span>
          <span
            className={cn(
              'max-w-[90%] rounded-xl px-3 py-2 text-sm',
              turn.role === 'seller' ? 'bg-primary/20' : 'bg-surface-2',
              turn.interrupted && 'border border-warning/40',
            )}
          >
            {turn.text}
            {turn.interrupted && <span className="ml-1 text-warning">…</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
  ) : (
    <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
  );
}

export default async function SimulationPage({ params }: Props) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const h = t.history;
  const r = t.report;
  const db = await getDb();
  const id = (await params).id;
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
  const waitingForAnalysis =
    sim.status === 'completed' &&
    analyzerReady &&
    (!analysis || analysis.status === 'running' || (analysis.status === 'failed' && analysis.attempts < 3));
  const pending = ['connecting', 'in_progress', 'processing'].includes(sim.status) || waitingForAnalysis;
  const transcript = sim.transcript ?? [];
  const interruptions = transcript.filter((turn) => turn.interrupted).length;
  const recommended = result ? await listScenariosByIds(db, auth, result.recommendedScenarioIds) : [];
  const skillLabel = (skill: string) => t.enums.skill[skill as Skill] ?? skill;

  return (
    <div className="grid gap-6">
      <Link href="/simulations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {h.title}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <StatusBadge status={sim.status} t={t} />
            <span>{t.enums.family[sim.scenarioFamily as Family]}</span>
            <span>·</span>
            <span>{formatDate(sim.createdAt, locale)}</span>
            {sim.durationSeconds != null && (
              <>
                <span>·</span>
                <span className="tabular-nums">{duration(sim.durationSeconds, h.seconds, format)}</span>
              </>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            <Link href={`/scenarios/${sim.scenarioId}`} className="hover:text-primary">
              {sim.scenarioTitle}
            </Link>
          </h1>
          {sim.status === 'completed' && (
            <p className="mt-1 text-sm text-muted-foreground">
              {sim.endReason && h.endedBy[sim.endReason as keyof typeof h.endedBy]} · {format(h.interruptions, { n: interruptions })}
            </p>
          )}
        </div>
        {provider && (
          <Button asChild variant="outline">
            <Link href={`/scenarios/${sim.scenarioId}/call`}>
              <Phone /> {h.retry}
            </Link>
          </Button>
        )}
      </div>

      {pending && <AutoRefresh simulationId={sim.id} status={sim.status} analysis={analysis?.status ?? null} />}
      {['connecting', 'in_progress', 'processing'].includes(sim.status) && <FormAlert tone="success" message={h.processing} />}
      {sim.status === 'failed' && <FormAlert message={h.failed} />}
      {sim.status === 'cancelled' && <FormAlert message={h.cancelled} />}

      {sim.status === 'completed' && !result && (
        <Card className="flex items-start gap-3 border-primary/30 bg-primary/5">
          {waitingForAnalysis ? (
            <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
          ) : (
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          )}
          <p className="text-sm" role="status">
            {!analyzerReady
              ? r.notConfigured
              : analysis?.status === 'insufficient'
                ? r.insufficient
                : analysis?.status === 'failed'
                  ? analysis.attempts < 3
                    ? r.failed
                    : r.failedFinal
                  : r.analyzing}
          </p>
        </Card>
      )}

      {result && (
        <>
          <section aria-labelledby="report-title" className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
            <Card className="grid content-start justify-items-start gap-4">
              <h2 id="report-title" className="text-sm font-medium text-muted-foreground">
                {r.overall}
              </h2>
              <div className="flex items-center gap-4">
                <ScoreRing score={result.overallScore} size={88} />
                <span className="text-4xl font-semibold tabular-nums">{result.overallScore}</span>
              </div>
              <Badge variant="outline" className={OUTCOME_TONE[result.outcome]}>
                {r.outcome[result.outcome]}
              </Badge>
              <p className="text-sm leading-relaxed">{result.summary}</p>
              <p className="text-xs text-muted-foreground">{r.overallHint}</p>
            </Card>
            <Card>
              <CardTitle>{r.skillsTitle}</CardTitle>
              <CardDescription className="mt-1">{r.skillsHint}</CardDescription>
              <SkillRadar title={r.skillsTitle} skills={result.skills.map((s) => ({ label: skillLabel(s.skill), score: s.score }))} />
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {result.skills.map((s) => (
              <Card key={s.skill} className="grid content-start gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-medium">{skillLabel(s.skill)}</h3>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    <span className="text-lg font-semibold text-foreground">{s.score}</span>/100 · {format(r.weight, { n: result.weights[s.skill] ?? 0 })}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-2">
                  <div
                    className={cn('h-1.5 rounded-full', s.score >= 70 ? 'bg-teal' : s.score >= 45 ? 'bg-warning' : 'bg-destructive')}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.justification}</p>
                {s.evidence.length > 0 && (
                  <div className="grid gap-1.5">
                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{r.evidence}</p>
                    {s.evidence.map((e, i) => (
                      <blockquote key={i} className="border-l-2 border-primary/50 pl-3 text-sm">
                        « {e.quote} »{' '}
                        <a href={`#turn-${e.turn}`} className="text-xs text-muted-foreground hover:text-primary">
                          {format(r.turnAt, { t: clock(transcript[e.turn]?.at ?? 0) })}
                        </a>
                      </blockquote>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </section>

          {result.improvements.length > 0 && (
            <Card className="grid gap-4">
              <CardTitle>{r.improvementsTitle}</CardTitle>
              {result.improvements.map((imp, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-border p-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{r.youSaid}</p>
                    <p className="mt-1 text-sm">« {imp.said} »</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-teal uppercase">{r.better}</p>
                    <p className="mt-1 text-sm">« {imp.better} »</p>
                  </div>
                  <p className="text-sm text-muted-foreground md:col-span-2">{imp.why}</p>
                </div>
              ))}
            </Card>
          )}

          <section className="grid gap-4 lg:grid-cols-3">
            <Card className="grid content-start gap-3">
              <CardTitle>{r.criteriaTitle}</CardTitle>
              <ul className="grid gap-3">
                {result.successCriteria.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Mark ok={c.met} />
                    <span>
                      {c.criterion}
                      <span className="block text-xs text-muted-foreground">{c.evidence}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="grid content-start gap-3">
              <CardTitle>{r.hiddenTitle}</CardTitle>
              <ul className="grid gap-3">
                {result.hiddenFacts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Mark ok={f.uncovered} />
                    <span>
                      {f.fact} <span className="text-xs text-muted-foreground">· {f.uncovered ? r.hiddenFound : r.hiddenMissed}</span>
                      {!f.uncovered && <span className="block text-xs text-muted-foreground">{format(r.hiddenHow, { q: f.howToUncover })}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="grid content-start gap-3">
              <CardTitle>{r.objectionsTitle}</CardTitle>
              <ul className="grid gap-3">
                {result.objections.map((o, i) => (
                  <li key={i} className="grid gap-1 text-sm">
                    <span className="flex flex-wrap items-center gap-2">
                      {o.objection}
                      <Badge variant="outline" className={HANDLING_TONE[o.handling]}>
                        {r.handling[o.handling]}
                      </Badge>
                    </span>
                    <span className="text-xs text-muted-foreground">{o.comment}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {result.strengths.length > 0 && (
            <Card className="grid gap-3">
              <CardTitle>{r.strengthsTitle}</CardTitle>
              <ul className="grid gap-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" /> {s}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <section aria-labelledby="next-title" className="grid gap-3">
            <div>
              <h2 id="next-title" className="text-lg font-semibold">
                {r.nextTitle}
              </h2>
              <p className="text-sm text-muted-foreground">{format(r.nextHint, { skills: result.focusSkills.map(skillLabel).join(', ') })}</p>
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
      )}

      {sim.status === 'completed' &&
        (result ? (
          <details className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <summary className="cursor-pointer text-sm font-medium">{r.transcriptToggle}</summary>
            <Transcript turns={transcript} prospectName={sim.prospectName} t={t} />
          </details>
        ) : (
          <Card>
            <CardTitle>{h.transcript}</CardTitle>
            <Transcript turns={transcript} prospectName={sim.prospectName} t={t} />
          </Card>
        ))}
    </div>
  );
}
