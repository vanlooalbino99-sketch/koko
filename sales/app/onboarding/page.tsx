import type { Metadata } from 'next';
import Link from 'next/link';
import { Brand } from '@/components/brand';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { EXPERIENCES, PERSONAS, SKILLS } from '@/lib/domain';
import { getCurrentProfile, getI18n, requireAuth } from '@/lib/server/context';
import { OnboardingForm } from './onboarding-form';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.onboarding.title };
}

export default async function OnboardingPage() {
  const auth = await requireAuth();
  const profile = await getCurrentProfile();
  const { t, locale } = await getI18n();
  const o = t.onboarding;
  return (
    <div className="glow min-h-dvh">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href={profile ? '/dashboard' : '/onboarding'}>
          <Brand name={t.common.appName} sub={t.common.brand} />
        </Link>
        <LanguageSwitch locale={locale} label={t.common.language} />
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-4 pb-16">
        <h1 className="text-3xl font-semibold tracking-tight">{o.title}</h1>
        <p className="mt-2 text-muted-foreground">{o.subtitle}</p>
        <OnboardingForm
          canRenameOrganization={auth.role === 'owner'}
          initial={{
            persona: profile?.persona,
            experience: profile?.experience,
            goals: profile?.goals ?? [],
            offerName: profile?.offerName ?? '',
            offerDescription: profile?.offerDescription ?? '',
            idealCustomer: profile?.idealCustomer ?? '',
            averageDeal: profile?.averageDeal ?? '',
            organizationName: auth.organization.kind === 'team' ? auth.organization.name : '',
          }}
          personas={PERSONAS.map((p) => ({ value: p, label: t.enums.persona[p], hint: t.enums.personaHint[p] }))}
          experiences={EXPERIENCES.map((e) => ({ value: e, label: t.enums.experience[e] }))}
          skills={SKILLS.map((s) => ({ value: s, label: t.enums.skill[s] }))}
          labels={{
            personaQuestion: o.personaQuestion,
            experienceQuestion: o.experienceQuestion,
            goalsQuestion: o.goalsQuestion,
            goalsError: o.goalsError,
            offerTitle: o.offerTitle,
            offerHint: o.offerHint,
            offerName: o.offerName,
            offerDescription: o.offerDescription,
            idealCustomer: o.idealCustomer,
            averageDeal: o.averageDeal,
            organizationName: o.organizationName,
            submit: o.submit,
            optional: t.common.optional,
          }}
        />
      </main>
    </div>
  );
}
