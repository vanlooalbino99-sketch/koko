import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Target, User } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { getDb } from '@/lib/db/client';
import { format } from '@/lib/i18n';
import { getScenario } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { voiceQuota } from '@/lib/simulations/service';
import { voiceProviderFromEnv } from '@/lib/voice/provider';
import { CallRoomLoader } from './call-room-loader';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const detail = await getScenario(await getDb(), auth, (await params).id);
  return { title: detail ? format(t.call.title, { title: detail.scenario.title }) : undefined };
}

export default async function CallPage({ params }: Props) {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const c = t.call;
  const db = await getDb();
  const detail = await getScenario(db, auth, (await params).id);
  if (!detail || detail.scenario.status !== 'active') notFound();
  const { scenario, content } = detail;
  const configured = voiceProviderFromEnv() !== null;
  const quota = await voiceQuota(db, auth);
  const remainingMinutes = Math.floor(quota.remainingSeconds / 60);

  return (
    <div className="grid gap-6">
      <Link href={`/scenarios/${scenario.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> {c.back}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{scenario.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {c.startText} {configured && format(c.remaining, { n: remainingMinutes })}
        </p>
      </div>

      <Card className="grid gap-4 sm:grid-cols-2">
        <CardTitle className="sm:col-span-2">{c.briefTitle}</CardTitle>
        <div className="flex gap-3">
          <Target className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{c.yourGoal}</p>
            <p className="mt-1 text-sm">{content.objective}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <User className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{c.youKnow}</p>
            <p className="mt-1 text-sm">
              {content.prospect.name}, {content.prospect.role} · {content.prospect.company}
            </p>
            {content.prospect.publicProfile && <p className="mt-1 text-sm text-muted-foreground">{content.prospect.publicProfile}</p>}
          </div>
        </div>
      </Card>

      {!configured ? (
        <FormAlert message={c.notConfigured} />
      ) : remainingMinutes < 1 ? (
        <FormAlert message={c.quotaExceeded} />
      ) : (
        <CallRoomLoader
          scenarioId={scenario.id}
          prospectName={content.prospect.name}
          labels={{
            start: c.start,
            connecting: c.connecting,
            prospectSpeaking: c.prospectSpeaking,
            listening: c.listening,
            interrupted: c.interrupted,
            mute: c.mute,
            unmute: c.unmute,
            muted: c.muted,
            hangUp: c.hangUp,
            ended: c.ended,
            saving: c.saving,
            live: c.live,
            liveEmpty: c.liveEmpty,
            you: c.you,
            micHint: c.micHint,
            errors: {
              not_configured: c.notConfigured,
              quota_exceeded: c.quotaExceeded,
              provider_error: c.providerError,
              not_found: c.notFound,
              mic_denied: c.micDenied,
              connection: c.connectionError,
            },
          }}
        />
      )}
    </div>
  );
}
