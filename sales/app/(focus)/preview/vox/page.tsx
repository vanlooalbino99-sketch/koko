import { notFound } from 'next/navigation';
import { getDb } from '@/lib/server/db';
import { getScenario, listScenarios } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { voxData } from '@/lib/server/vox';
import { VoxPreview } from './vox-preview';

export const dynamic = 'force-dynamic';

// Aperçu de l'écran d'appel en pleine conversation, pour les captures des tests de bout en bout : le bac à
// sable des tests ne peut pas ouvrir de vraie liaison audio. Introuvable (404) hors de BS_PREVIEW=1.
export default async function VoxPreviewPage() {
  if (process.env.BS_PREVIEW !== '1') notFound();
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const db = await getDb();
  const catalog = await listScenarios(db, auth, { scope: 'catalog', language: 'fr', family: 'cold_call' });
  const scenario = catalog.find((s) => /plombier/i.test(s.title)) ?? catalog[0];
  const detail = scenario && (await getScenario(db, auth, scenario.id));
  if (!detail) notFound();
  return <VoxPreview data={await voxData(db, auth, t, locale, detail, 'Thomas')} />;
}
