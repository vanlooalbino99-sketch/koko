import type { Metadata } from 'next';
import Link from 'next/link';
import { leaveOrganizationAction, switchOrganizationAction } from '@/app/actions/team';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAlert } from '@/components/ui/field';
import { getDb } from '@/lib/db/client';
import { can, type Role } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
import { listMembers, listMyOrganizations, type TeamErrorCode } from '@/lib/organization/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { RenameForm } from './rename-form';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.settings.organizationTitle };
}

export default async function OrganizationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const st = t.settings;
  const db = await getDb();
  const [members, spaces] = await Promise.all([listMembers(db, auth), listMyOrganizations(db, auth.user.id)]);
  const { error } = await searchParams;
  const errorMessage = error && error in t.team.errors ? t.team.errors[error as TeamErrorCode] : undefined;
  return (
    <SettingsPanel
      title={st.organizationTitle}
      subtitle={st.organizationSubtitle}
      actions={
        can(auth.role, 'team:view') && (
          <Button asChild variant="outline" size="sm">
            <Link href="/team">{st.manageTeam}</Link>
          </Button>
        )
      }
    >
      <FormAlert message={errorMessage} />

      {can(auth.role, 'organization:edit') && <RenameForm name={auth.organization.name} labels={{ name: st.organizationName, submit: st.rename }} />}
      <dl className="grid gap-3 text-sm sm:grid-cols-[200px_1fr]">
        <dt className="text-muted-foreground">{st.organizationTitle}</dt>
        <dd>{auth.organization.name}</dd>
        <dt className="text-muted-foreground">{st.organizationKind}</dt>
        <dd>{auth.organization.kind === 'team' ? st.kindTeam : st.kindPersonal}</dd>
        <dt className="text-muted-foreground">{t.dashboard.plan}</dt>
        <dd>{t.enums.plan[auth.organization.plan as 'free'] ?? auth.organization.plan}</dd>
        <dt className="text-muted-foreground">{t.dashboard.role}</dt>
        <dd>{t.enums.role[auth.role]}</dd>
      </dl>

      {spaces.length > 1 && (
        <Card className="p-4 sm:p-5">
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

      <div>
        <h2 className="mb-3 text-sm font-semibold">{st.membersTitle}</h2>
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
      </div>
    </SettingsPanel>
  );
}
