import type { Metadata } from 'next';
import { SignupForm } from '../auth-forms';
import { getI18n } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.signupTitle };
}

export default async function SignupPage() {
  const { t } = await getI18n();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t.auth.signupTitle}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t.auth.signupSubtitle}</p>
      <SignupForm
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
