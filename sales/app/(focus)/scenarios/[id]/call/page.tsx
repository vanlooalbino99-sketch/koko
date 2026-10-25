import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/server/db';
import { format } from '@/lib/i18n';
import { getScenario } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { voxData } from '@/lib/server/vox';
import type { Locale } from '@/lib/domain';
import { voiceName } from '@/lib/voice/catalog';
import { configuredVoices } from '@/lib/voice/voices';
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
  const { t, locale } = await getI18n();
  const db = await getDb();
  const detail = await getScenario(db, auth, (await params).id);
  if (!detail || detail.scenario.status !== 'active') notFound();
  const voice = await voiceName(detail.content.voiceId ?? configuredVoices()[detail.scenario.language as Locale]);
  return <CallRoomLoader data={await voxData(db, auth, t, locale, detail, voice)} />;
}
