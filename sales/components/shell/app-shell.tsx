import { Suspense } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { AccountMenu } from '@/components/shell/account-menu';
import { NavLinks, type NavGroup } from '@/components/shell/nav-links';
import { SearchBox } from '@/components/shell/search-box';
import { TopActions } from '@/components/shell/top-actions';
import { Wordmark } from '@/components/shell/wordmark';
import type { AuthContext } from '@/lib/auth/service';
import { can, type Locale } from '@/lib/domain';
import type { Dictionary } from '@/lib/i18n';

// Coque de l'espace d'entraînement, copiée de la maquette « RevenuePulse » : barre latérale et zone principale en
// deux panneaux arrondis, recherche ⌘K en haut, période et export à droite sur le tableau de bord et le cockpit.
export function AppShell({ auth, t, locale, children }: { auth: AuthContext; t: Dictionary; locale: Locale; children: React.ReactNode }) {
  const groups: NavGroup[] = [
    { title: null, items: [{ href: '/dashboard', label: t.nav.overview, icon: 'dashboard' }] },
    {
      title: t.nav.training,
      items: [
        { href: '/scenarios', label: t.nav.scenarios, icon: 'scenarios' },
        { href: '/simulations', label: t.nav.history, icon: 'history' },
        ...(can(auth.role, 'scenario:create') ? [{ href: '/scenarios/new', label: t.nav.newScenario, icon: 'new' as const }] : []),
      ],
    },
    ...(can(auth.role, 'team:view') ? [{ title: t.nav.teamGroup, items: [{ href: '/team', label: t.nav.team, icon: 'team' as const }] }] : []),
    {
      title: t.nav.settingsGroup,
      items: [
        { href: '/settings', label: t.nav.settings, icon: 'settings' },
        { href: '/billing', label: t.nav.billing, icon: 'billing' },
        ...(auth.user.isPlatformAdmin ? [{ href: '/admin', label: t.nav.admin, icon: 'admin' as const }] : []),
      ],
    },
  ];
  const account = (
    <AccountMenu
      name={auth.user.name}
      detail={`${t.enums.role[auth.role]} · ${auth.organization.name}`}
      locale={locale}
      labels={{ menu: t.nav.accountMenu, language: t.common.language, logout: t.common.logout }}
    />
  );
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  return (
    <div className="theme-pulse min-h-dvh lg:grid lg:grid-cols-[214px_minmax(0,1fr)] lg:gap-2.5 lg:p-2.5">
      <aside className="sticky top-2.5 hidden h-[calc(100dvh-20px)] flex-col gap-6 rounded-2xl bg-[var(--panel)] px-3 py-5 lg:flex">
        <Link href="/dashboard" className="px-2">
          <Wordmark brand={t.common.brand} />
        </Link>
        <div className="flex-1 overflow-y-auto">
          <NavLinks groups={groups} />
        </div>
        {account}
      </aside>
      <div className="min-w-0 bg-[var(--panel)] lg:rounded-2xl">
        <header className="sticky top-0 z-20 flex items-center gap-3 bg-[var(--panel)]/90 px-4 py-3 backdrop-blur sm:px-5 lg:top-2.5 lg:rounded-t-2xl">
          <details className="group lg:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-border" aria-label={t.nav.openMenu}>
              <Menu className="size-4" aria-hidden="true" />
            </summary>
            <div className="fixed inset-x-0 top-[60px] z-30 grid max-h-[calc(100dvh-60px)] gap-6 overflow-y-auto border-b border-border bg-[var(--panel)] p-4">
              <NavLinks groups={groups} />
              {account}
            </div>
          </details>
          <Link href="/dashboard" className="lg:hidden" aria-label={t.nav.overview}>
            <Wordmark brand={t.common.brand} />
          </Link>
          <div className="hidden flex-1 sm:block">
            <SearchBox label={t.nav.searchShort} />
          </div>
          <div className="ml-auto">
            <Suspense>
              <TopActions
                tag={tag}
                labels={{
                  periods: t.dashboard.periods,
                  period: t.dashboard.period,
                  export: t.dashboard.export,
                  newScenario: can(auth.role, 'scenario:create') ? t.nav.newScenario : null,
                }}
              />
            </Suspense>
          </div>
        </header>
        <main id="contenu" className="mx-auto w-full max-w-[1600px] px-4 pt-1 pb-5 sm:px-5">
          {children}
        </main>
      </div>
    </div>
  );
}
