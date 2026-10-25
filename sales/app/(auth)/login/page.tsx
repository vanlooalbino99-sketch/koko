import type { Metadata } from 'next';
import { LoginForm } from '../auth-forms';
import { safeNext } from '@/lib/forms';
import { getI18n } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.loginTitle };
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { t } = await getI18n();
  const { next } = await searchParams;
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t.auth.loginTitle}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.auth.loginSubtitle}</p>
      <LoginForm
        next={safeNext(next) ?? undefined}
        labels={{
          name: t.auth.name,
          email: t.auth.email,
          password: t.auth.password,
          passwordHint: t.auth.passwordHint,
          submit: t.auth.login,
          switchText: t.auth.toSignup,
        }}
      />
    </>
  );
}
