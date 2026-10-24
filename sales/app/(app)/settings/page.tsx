import type { Metadata } from 'next';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logOutAction } from '@/app/actions/auth';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDb } from '@/lib/db/client';
import type { Experience, Persona, Role, Skill } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
import { listMembers } from '@/lib/organization/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.settings.title };
}

export default async function SettingsPage() {
  const { auth, profile } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const st = t.settings;
  const members = await listMembers(await getDb(), auth);
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{st.title}</h1>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{st.profileTitle}</CardTitle>
            <CardDescription className="mt-1">{st.profileText}</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/onboarding">{st.profileEdit}</Link>
          </Button>
        </CardHeader>
        <dl className="grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
          <dt className="text-muted-foreground">{t.onboarding.personaQuestion}</dt>
          <dd>{t.enums.persona[profile.persona as Persona]}</dd>
          <dt className="text-muted-foreground">{t.onboarding.experienceQuestion}</dt>
          <dd>{t.enums.experience[profile.experience as Experience]}</dd>
          <dt className="text-muted-foreground">{t.dashboard.focusTitle}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {profile.goals.map((g) => (
              <Badge key={g} variant="outline" className="border-teal/30 bg-teal/10 text-foreground">
                {t.enums.skill[g as Skill]}
              </Badge>
            ))}
          </dd>
          {profile.offerName && (
            <>
              <dt className="text-muted-foreground">{t.onboarding.offerName}</dt>
              <dd>{profile.offerName}</dd>
            </>
          )}
        </dl>
      </Card>

      <Card>
        <CardHeader className="mb-0 items-center">
          <CardTitle>{st.languageTitle}</CardTitle>
          <LanguageSwitch locale={locale} label={st.languageTitle} />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{st.organizationTitle}</CardTitle>
        </CardHeader>
        <dl className="grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
          <dt className="text-muted-foreground">{t.settings.organizationTitle}</dt>
          <dd>{auth.organization.name}</dd>
          <dt className="text-muted-foreground">{st.organizationKind}</dt>
          <dd>{auth.organization.kind === 'team' ? st.kindTeam : st.kindPersonal}</dd>
          <dt className="text-muted-foreground">{t.dashboard.plan}</dt>
          <dd>{t.enums.plan[auth.organization.plan as 'free'] ?? auth.organization.plan}</dd>
          <dt className="text-muted-foreground">{t.dashboard.role}</dt>
          <dd>{t.enums.role[auth.role]}</dd>
        </dl>
        <h3 className="mt-6 mb-3 text-sm font-semibold">{st.membersTitle}</h3>
        {members === null ? (
          <p className="text-sm text-muted-foreground">{st.membersHidden}</p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border">
            {members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <span>
                  <span className="block font-medium">{m.name}</span>
                  <span className="block text-xs text-muted-foreground">{m.email}</span>
                </span>
                <span className="text-right text-xs text-muted-foreground">
                  <span className="block text-foreground">{t.enums.role[m.role as Role]}</span>
                  {format(st.joined, { date: formatDate(m.joinedAt, locale) })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader className="mb-0 items-center">
          <div>
            <CardTitle>{st.accountTitle}</CardTitle>
            <CardDescription className="mt-1">{format(st.signedInAs, { email: auth.user.email })}</CardDescription>
          </div>
          <form action={logOutAction}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut /> {t.common.logout}
            </Button>
          </form>
        </CardHeader>
      </Card>
    </div>
  );
}
