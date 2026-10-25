import Link from 'next/link';
import { ArrowLeft, Gauge, History, House, Library, PlusCircle, Settings } from 'lucide-react';
import { BrandMark } from '@/components/brand';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { SettingsNav, type SettingsNavItem } from '@/components/shell/settings-nav';
import type { AuthContext } from '@/lib/auth/service';
import { can, type Locale } from '@/lib/domain';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// Cadre clair des réglages : rail d'icônes, barre de titre, sous-navigation et panneau de contenu.
export function SettingsShell({ auth, t, locale, children }: { auth: AuthContext; t: Dictionary; locale: Locale; children: React.ReactNode }) {
  const rail = [
    { href: '/dashboard', label: t.nav.home, icon: House },
    { href: '/scenarios', label: t.nav.scenarios, icon: Library },
    { href: '/simulations', label: t.nav.history, icon: History },
    ...(can(auth.role, 'scenario:create') ? [{ href: '/scenarios/new', label: t.nav.create, icon: PlusCircle }] : []),
    ...(auth.user.isPlatformAdmin ? [{ href: '/admin', label: 'Admin', icon: Gauge }] : []),
  ];
  const sections: SettingsNavItem[] = [
    { href: '/settings', label: t.nav.profile, icon: 'profile' },
    { href: '/settings/organization', label: t.nav.organization, icon: 'organization' },
    ...(can(auth.role, 'team:view') ? [{ href: '/team', label: t.nav.team, icon: 'team' as const }] : []),
    { href: '/billing', label: t.nav.billingUsage, icon: 'billing' },
    { href: '/settings/account', label: t.nav.accountSettings, icon: 'account' },
  ];
  const railLink = 'grid justify-items-center gap-1 rounded-xl px-1 py-2 text-[10px] leading-tight text-[#3d4048] transition-colors hover:bg-white';
  return (
    <div className="theme-settings min-h-dvh md:grid md:grid-cols-[72px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col items-center gap-5 px-1.5 py-4 md:flex">
        <Link href="/dashboard" aria-label={t.nav.dashboard}>
          <BrandMark className="size-8" />
        </Link>
        <nav aria-label={t.common.appName} className="grid w-full gap-1.5">
          {rail.map((item) => (
            <Link key={item.href} href={item.href} className={railLink}>
              <item.icon className="size-[19px]" aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          ))}
          <span aria-current="page" className={cn(railLink, 'text-primary hover:bg-transparent')}>
            <span className="grid size-8 place-items-center rounded-lg bg-[#eaf1ff]">
              <Settings className="size-[19px]" aria-hidden="true" />
            </span>
            {t.nav.settings}
          </span>
        </nav>
      </aside>
      <div className="grid min-w-0 content-start gap-3 p-2 sm:p-3 md:pl-0">
        <header className="flex h-16 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_1px_2px_rgb(20_24_40/0.04)] sm:px-6">
          <Link
            href="/dashboard"
            aria-label={t.nav.dashboard}
            className="grid size-9 place-items-center rounded-full border border-border md:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
          <p className="text-lg font-semibold tracking-tight">{t.settings.title}</p>
          <div className="ml-auto flex items-center gap-2.5">
            <LanguageSwitch locale={locale} label={t.common.language} />
            <span
              title={`${auth.user.name} · ${auth.organization.name}`}
              className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,#ffb38a,#f0628a)] text-xs font-semibold text-white"
            >
              {initials(auth.user.name)}
            </span>
          </div>
        </header>
        <div className="grid min-h-[calc(100dvh-100px)] content-start gap-3 rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgb(20_24_40/0.04)] sm:p-3 md:grid-cols-[206px_minmax(0,1fr)]">
          <SettingsNav title={t.settings.title} label={t.nav.settingsSections} items={sections} />
          <main id="contenu" className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
