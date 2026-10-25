import type { Metadata } from 'next';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { logOutAction } from '@/app/actions/auth';
import { acceptInvitationAction } from '@/app/actions/team';
import { AuthFrame } from '@/components/shell/auth-frame';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/field';
import { getDb } from '@/lib/db/client';
import { format } from '@/lib/i18n';
import { inspectInvitation } from '@/lib/organization/invitations';
import type { TeamErrorCode } from '@/lib/organization/service';
import { getAuth, getI18n } from '@/lib/server/context';

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.invite.title, robots: { index: false } };
}

export default async function InvitePage({ params, searchParams }: Props) {
  const { token } = await params;
  const { error } = await searchParams;
  const { t } = await getI18n();
  const iv = t.invite;
  const [view, auth] = await Promise.all([inspectInvitation(await getDb(), token), getAuth()]);
  const path = `/invite/${token}`;
  const errorMessage = error && error in t.team.errors ? t.team.errors[error as TeamErrorCode] : undefined;

  if (!view || view.status !== 'valid') {
    const message = !view ? iv.invalid : view.status === 'expired' ? t.team.errors.expired : t.team.errors.used;
    return (
      <AuthFrame>
        <h1 className="text-2xl font-semibold tracking-tight">{iv.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link href={auth ? '/dashboard' : '/login'}>{auth ? t.nav.dashboard : t.auth.login}</Link>
        </Button>
      </AuthFrame>
    );
  }

  const role = t.enums.role[view.role].toLowerCase();
  const intro = view.inviterName
    ? format(iv.text, { inviter: view.inviterName, org: view.organizationName, role })
    : format(iv.textAnonymous, { org: view.organizationName, role });
  const signupHref = `/signup?next=${encodeURIComponent(path)}&email=${encodeURIComponent(view.email)}`;

  return (
    <AuthFrame>
      <span aria-hidden="true" className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
        <Users className="size-5" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{format(iv.heading, { org: view.organizationName })}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
      <p className="mt-1 text-xs text-muted-foreground">{format(iv.forEmail, { email: view.email })}</p>
      <p className="mt-4 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground">{iv.privacy}</p>
      <div className="mt-6 grid gap-3">
        <FormAlert message={errorMessage} />
        {!auth ? (
          <>
            <Button asChild size="lg">
              <Link href={signupHref}>{iv.signup}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/login?next=${encodeURIComponent(path)}`}>{iv.login}</Link>
            </Button>
          </>
        ) : auth.user.email !== view.email ? (
          <>
            <FormAlert message={format(iv.wrongAccount, { current: auth.user.email, email: view.email })} />
            <form action={logOutAction}>
              <input type="hidden" name="next" value={path} />
              <Button type="submit" variant="outline" size="lg" className="w-full">
                {t.common.logout}
              </Button>
            </form>
          </>
        ) : (
          <form action={acceptInvitationAction}>
            <input type="hidden" name="token" value={token} />
            <Button type="submit" size="lg" className="w-full">
              {iv.accept}
            </Button>
          </form>
        )}
      </div>
    </AuthFrame>
  );
}
