import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { getDb } from '@/lib/db/client';
import type { Family } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
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

export default async function SimulationPage({ params }: Props) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const h = t.history;
  const db = await getDb();
  const id = (await params).id;
  let sim = await getSimulation(db, auth, id);
  if (!sim) notFound();
  const provider = voiceProviderFromEnv();
  if (provider && ['connecting', 'in_progress', 'processing'].includes(sim.status)) {
    await syncSimulation(db, provider, sim).catch(() => undefined);
    sim = (await getSimulation(db, auth, id))!;
  }
  const pending = ['connecting', 'in_progress', 'processing'].includes(sim.status);
  const transcript = sim.transcript ?? [];
  const interruptions = transcript.filter((turn) => turn.interrupted).length;

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

      {pending && (
        <>
          <FormAlert tone="success" message={h.processing} />
          <AutoRefresh simulationId={sim.id} status={sim.status} />
        </>
      )}
      {sim.status === 'failed' && <FormAlert message={h.failed} />}
      {sim.status === 'cancelled' && <FormAlert message={h.cancelled} />}

      {sim.status === 'completed' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,20rem)]">
          <Card>
            <CardTitle>{h.transcript}</CardTitle>
            {transcript.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{h.transcriptEmpty}</p>
            ) : (
              <ol className="mt-4 grid gap-3">
                {transcript.map((turn, i) => (
                  <li key={i} className={cn('grid gap-0.5', turn.role === 'seller' && 'justify-items-end text-right')}>
                    <span className="text-xs text-muted-foreground">
                      {turn.role === 'seller' ? t.call.you : sim.prospectName} · <span className="tabular-nums">{clock(turn.at)}</span>
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
            )}
          </Card>
          <Card className="grid content-start gap-3 border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              <CardTitle>{t.history.score}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">{h.analysisSoon}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
