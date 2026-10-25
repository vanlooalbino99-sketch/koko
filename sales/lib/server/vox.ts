import 'server-only';
import type { VoxNavItem, VoxStatic } from '@/components/vox/vox-screen';
import type { AuthContext } from '@/lib/auth/service';
import { creditStatus } from '@/lib/billing/credits';
import type { Db } from '@/lib/db/client';
import { can, type Difficulty, type Family, type Locale } from '@/lib/domain';
import { format, type Dictionary } from '@/lib/i18n';
import type { ScenarioDetail } from '@/lib/scenarios/service';
import { listSimulations } from '@/lib/simulations/service';
import { voiceProviderFromEnv } from '@/lib/voice/provider';

// Données de l'écran d'appel. Seuls des champs visibles par l'apprenant sont copiés : jamais les faits
// cachés ni les conditions de fin du scénario.
export async function voxData(
  db: Db,
  auth: AuthContext,
  t: Dictionary,
  locale: Locale,
  detail: ScenarioDetail,
  voiceName: string | null,
): Promise<VoxStatic> {
  const c = t.call;
  const { scenario, content } = detail;
  const configured = voiceProviderFromEnv() !== null;
  const [credits, recents] = await Promise.all([creditStatus(db, auth.organization), listSimulations(db, auth, 5)]);

  const nav: VoxNavItem[] = [
    { href: '/scenarios', label: t.nav.scenarios, icon: 'scenarios' },
    { href: '/simulations', label: t.nav.history, icon: 'history' },
    { href: '/dashboard', label: t.nav.dashboard, icon: 'dashboard' },
    ...(can(auth.role, 'scenario:create') ? [{ href: '/scenarios/new', label: t.nav.newScenario, icon: 'new' as const }] : []),
  ];
  const more: VoxNavItem[] = [
    { href: '/settings', label: t.nav.settings, icon: 'settings' },
    ...(can(auth.role, 'team:view') ? [{ href: '/team', label: t.nav.team, icon: 'team' as const }] : []),
    { href: '/billing', label: t.nav.billing, icon: 'billing' },
    ...(auth.user.isPlatformAdmin ? [{ href: '/admin', label: t.nav.admin, icon: 'admin' as const }] : []),
  ];
  const plans: Record<string, string> = t.enums.plan;
  const statuses: Record<string, string> = t.enums.status;

  return {
    appName: t.common.appName,
    nav,
    more,
    recents: recents.map((r) => ({
      id: r.id,
      title: r.scenarioTitle,
      meta: [
        r.durationSeconds ? format(c.recentMinutes, { n: Math.max(1, Math.round(r.durationSeconds / 60)) }) : null,
        r.overallScore !== null ? format(c.recentScore, { n: r.overallScore }) : r.status !== 'completed' ? (statuses[r.status] ?? r.status) : null,
      ]
        .filter(Boolean)
        .join(' · '),
    })),
    user: { name: auth.user.name, plan: plans[auth.organization.plan] ?? auth.organization.plan },
    scenario: {
      id: scenario.id,
      family: scenario.family,
      familyLabel: t.enums.family[scenario.family as Family],
      language: scenario.language as Locale,
      estimatedMinutes: scenario.estimatedMinutes,
      objective: content.objective,
      context: content.context,
      chips: [
        t.enums.difficulty[scenario.difficulty as Difficulty],
        t.enums.personality[content.prospect.personality],
        t.enums.decisionPower[content.prospect.decisionPower],
      ],
      prospect: {
        name: content.prospect.name,
        role: content.prospect.role,
        company: content.prospect.company,
        publicProfile: content.prospect.publicProfile,
      },
      offer: { name: content.offer.name, price: content.offer.price },
    },
    voiceName,
    remaining: configured ? format(c.remaining, { n: credits.remaining }) : null,
    blocked: auth.demo
      ? { message: t.demo.callBlocked, link: { href: '/demo', label: t.demo.callBlockedLink } }
      : !configured
        ? { message: c.notConfigured }
        : credits.remaining < 1
          ? { message: c.quotaExceeded, link: { href: '/billing', label: c.upgrade } }
          : null,
    locale,
    labels: c,
  };
}
