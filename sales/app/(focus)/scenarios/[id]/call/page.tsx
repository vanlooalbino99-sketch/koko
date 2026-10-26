import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/server/db';
import { format } from '@/lib/i18n';
import { getScenario } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { voxData } from '@/lib/server/vox';
import { prepareDrill, type DrillRequest } from '@/lib/simulations/service';
import type { Locale } from '@/lib/domain';
import { voiceName } from '@/lib/voice/catalog';
import { configuredVoices } from '@/lib/voice/voices';
import { CallRoomLoader } from './call-room-loader';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ exercice?: string; moment?: string; reprise?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const detail = await getScenario(await getDb(), auth, (await params).id);
  return { title: detail ? format(t.call.title, { title: detail.scenario.title }) : undefined };
}

export default async function CallPage({ params, searchParams }: Props) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const db = await getDb();
  const detail = await getScenario(db, auth, (await params).id);
  if (!detail || detail.scenario.status !== 'active') notFound();
  const voice = await voiceName(detail.content.voiceId ?? configuredVoices()[detail.scenario.language as Locale]);
  // ?exercice=<appel>&moment=<n> rejoue un moment d'un appel ; ?reprise=<appel> reprend un appel coupé.
  const q = await searchParams;
  const ref: DrillRequest | null = q.exercice
    ? { kind: 'moment', from: q.exercice, moment: Number(q.moment ?? 0) }
    : q.reprise
      ? { kind: 'resume', from: q.reprise }
      : null;
  const drill = ref && (await prepareDrill(db, auth, detail.scenario.id, ref));
  return (
    <CallRoomLoader
      key={ref ? `${ref.kind}:${ref.from}:${'moment' in ref ? ref.moment : ''}` : 'appel'}
      data={await voxData(db, auth, t, locale, detail, voice, drill ? { ref, data: drill } : null)}
    />
  );
}
