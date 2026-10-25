import type { Metadata } from 'next';
import { SignupForm } from '../auth-forms';
import { safeNext } from '@/lib/forms';
import { getI18n } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.signupTitle };
}

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string; email?: string }> }) {
  const { t } = await getI18n();
  const params = await searchParams;
  const email = typeof params.email === 'string' && params.email.length <= 254 ? params.email : undefined;
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t.auth.signupTitle}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.auth.signupSubtitle}</p>
      <SignupForm
        next={safeNext(params.next) ?? undefined}
        email={email}
        labels={{
          name: t.auth.name,
          email: t.auth.email,
          password: t.auth.password,
          passwordHint: t.auth.passwordHint,
          submit: t.auth.signup,
          switchText: t.auth.toLogin,
          terms: t.auth.terms,
        }}
      />
    </>
  );
}
