import type { Metadata } from 'next';
import { LogOut } from 'lucide-react';
import { logOutAction } from '@/app/actions/auth';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { Button } from '@/components/ui/button';
import { format } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.settings.accountTitle };
}

export default async function AccountPage() {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const st = t.settings;
  return (
    <SettingsPanel title={st.accountTitle} subtitle={st.accountSubtitle}>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/60 p-4">
        <p className="text-sm">
          <span className="block font-medium">{auth.user.name}</span>
          <span className="block text-muted-foreground">{format(st.signedInAs, { email: auth.user.email })}</span>
        </p>
        <form action={logOutAction}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut /> {t.common.logout}
          </Button>
        </form>
      </div>
    </SettingsPanel>
  );
}
