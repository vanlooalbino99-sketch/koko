import { SettingsSkeleton } from '@/components/shell/page-skeleton';
import { getI18n } from '@/lib/server/context';

// Squelette affiché dès le clic. Seulement sur les pages qui ne répondent jamais « introuvable » : au-dessus d'une
// page qui peut répondre 404, il ferait partir la réponse en 200 avant que la page ne le sache.
export default async function Loading() {
  const { t } = await getI18n();
  return <SettingsSkeleton label={t.common.loading} />;
}
