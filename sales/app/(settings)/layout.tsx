import { DemoLayer } from '@/components/demo/demo-layer';
import { SettingsShell } from '@/components/shell/settings-shell';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  return (
    <SettingsShell auth={auth} t={t} locale={locale}>
      {children}
      <DemoLayer auth={auth} t={t} />
    </SettingsShell>
  );
}
