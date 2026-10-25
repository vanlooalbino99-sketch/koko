import Link from 'next/link';
import { Brand } from '@/components/brand';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { getI18n } from '@/lib/server/context';

// Cadre des pages hors de l'application : connexion, inscription, invitation.
export async function AuthFrame({ children }: { children: React.ReactNode }) {
  const { t, locale } = await getI18n();
  return (
    <div className="glow flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/">
          <Brand name={t.common.appName} sub={t.common.brand} />
        </Link>
        <LanguageSwitch locale={locale} label={t.common.language} />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:pt-0">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface/90 p-6 shadow-2xl shadow-black/40 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
