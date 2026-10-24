import { AppShell } from '@/components/shell/app-shell';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  return (
    <AppShell auth={auth} t={t} locale={locale}>
      {children}
    </AppShell>
  );
}
