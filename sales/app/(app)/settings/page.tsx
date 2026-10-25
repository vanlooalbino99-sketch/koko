import type { Metadata } from 'next';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logOutAction } from '@/app/actions/auth';
import { leaveOrganizationAction, switchOrganizationAction } from '@/app/actions/team';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { getDb } from '@/lib/db/client';
import { can, type Experience, type Persona, type Role, type Skill } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
import { listMembers, listMyOrganizations, type TeamErrorCode } from '@/lib/organization/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { RenameForm } from './rename-form';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.settings.title };
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { auth, profile } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const st = t.settings;
  const db = await getDb();
  const [members, spaces] = await Promise.all([listMembers(db, auth), listMyOrganizations(db, auth.user.id)]);
  const { error } = await searchParams;
  const errorMessage = error && error in t.team.errors ? t.team.errors[error as TeamErrorCode] : undefined;
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{st.title}</h1>
      <FormAlert message={errorMessage} />

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

      {spaces.length > 1 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{st.workspacesTitle}</CardTitle>
              <CardDescription className="mt-1">{st.workspacesText}</CardDescription>
            </div>
          </CardHeader>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {spaces.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <span>
                  <span className="block font-medium">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.kind === 'team' ? st.kindTeam : st.kindPersonal} · {t.enums.role[s.role as Role]}
                  </span>
                </span>
                {s.id === auth.organization.id ? (
                  <Badge variant="outline">{st.currentWorkspace}</Badge>
                ) : (
                  <form action={switchOrganizationAction}>
                    <input type="hidden" name="organization" value={s.id} />
                    <Button type="submit" variant="outline" size="sm">
                      {st.openWorkspace}
                    </Button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          {auth.role !== 'owner' && (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer list-none text-muted-foreground hover:text-destructive">{st.leave}</summary>
              <p className="mt-2 text-xs text-muted-foreground">{st.leaveText}</p>
              <form action={leaveOrganizationAction} className="mt-2">
                <Button type="submit" variant="outline" size="sm" className="border-destructive/40 text-destructive">
                  {st.leave} · {auth.organization.name}
                </Button>
              </form>
            </details>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{st.organizationTitle}</CardTitle>
          {can(auth.role, 'team:view') && (
            <Button asChild variant="outline" size="sm">
              <Link href="/team">{st.manageTeam}</Link>
            </Button>
          )}
        </CardHeader>
        {can(auth.role, 'organization:edit') && (
          <div className="mb-5">
            <RenameForm name={auth.organization.name} labels={{ name: st.organizationName, submit: st.rename }} />
          </div>
        )}
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
