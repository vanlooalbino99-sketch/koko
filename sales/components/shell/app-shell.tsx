import Link from 'next/link';
import { LogOut, Menu, Plus, Search } from 'lucide-react';
import { logOutAction } from '@/app/actions/auth';
import { Brand } from '@/components/brand';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { NavLinks, type NavGroup } from '@/components/shell/nav-links';
import { Button } from '@/components/ui/button';
import type { AuthContext } from '@/lib/auth/service';
import { can, type Locale } from '@/lib/domain';
import type { Dictionary } from '@/lib/i18n';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AppShell({ auth, t, locale, children }: { auth: AuthContext; t: Dictionary; locale: Locale; children: React.ReactNode }) {
  const groups: NavGroup[] = [
    {
      title: t.nav.training,
      items: [
        { href: '/dashboard', label: t.nav.dashboard, icon: 'dashboard' },
        { href: '/scenarios', label: t.nav.scenarios, icon: 'scenarios' },
        { href: '/simulations', label: t.nav.history, icon: 'history' },
        ...(can(auth.role, 'scenario:create') ? [{ href: '/scenarios/new', label: t.nav.newScenario, icon: 'new' as const }] : []),
      ],
    },
    {
      title: t.nav.account,
      items: [
        { href: '/settings', label: t.nav.settings, icon: 'settings' },
        ...(can(auth.role, 'team:view') ? [{ href: '/team', label: t.nav.team, icon: 'team' as const }] : []),
        { href: '/billing', label: t.nav.billing, icon: 'billing' },
        ...(auth.user.isPlatformAdmin ? [{ href: '/admin', label: t.nav.admin, icon: 'admin' as const }] : []),
      ],
    },
  ];
  const account = (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-3">
      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
        {initials(auth.user.name)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-medium">{auth.user.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {t.enums.role[auth.role]} · {auth.organization.name}
        </span>
      </span>
      <form action={logOutAction}>
        <Button type="submit" variant="ghost" size="icon" className="size-8" aria-label={t.common.logout} title={t.common.logout}>
          <LogOut />
        </Button>
      </form>
    </div>
  );
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-border bg-surface/60 px-4 py-5 lg:flex">
        <Link href="/dashboard" className="px-1">
          <Brand name={t.common.appName} sub={t.common.brand} />
        </Link>
        <div className="flex-1">
          <NavLinks groups={groups} />
        </div>
        {account}
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <details className="group lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-border" aria-label={t.nav.openMenu}>
              <Menu className="size-4" aria-hidden="true" />
            </summary>
            <div className="fixed inset-x-0 top-[65px] z-30 grid max-h-[calc(100dvh-65px)] gap-6 overflow-y-auto border-b border-border bg-background p-4">
              <NavLinks groups={groups} />
              {account}
            </div>
          </details>
          <Link href="/dashboard" className="lg:hidden" aria-label={t.nav.dashboard}>
            <Brand name={t.common.appName} sub={t.common.brand} />
          </Link>
          <form action="/scenarios" className="relative ml-auto hidden w-full max-w-sm sm:block lg:ml-0">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              name="q"
              type="search"
              placeholder={t.nav.search}
              aria-label={t.nav.search}
              className="h-10 w-full rounded-lg border border-border bg-surface pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitch locale={locale} label={t.common.language} />
            {can(auth.role, 'scenario:create') && (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/scenarios/new">
                  <Plus /> {t.nav.newScenario}
                </Link>
              </Button>
            )}
          </div>
        </header>
        <main id="contenu" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
