'use server';

import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db/client';
import { echo, fieldErrorsFrom, type FormState } from '@/lib/forms';
import { OnboardingSchema, saveProfile } from '@/lib/profile/service';
import { getI18n, requireAuth } from '@/lib/server/context';

export async function saveOnboardingAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAuth();
  const { t } = await getI18n();
  const parsed = OnboardingSchema.safeParse({
    persona: formData.get('persona'),
    experience: formData.get('experience'),
    goals: formData.getAll('goals'),
    offerName: formData.get('offerName') ?? '',
    offerDescription: formData.get('offerDescription') ?? '',
    idealCustomer: formData.get('idealCustomer') ?? '',
    averageDeal: formData.get('averageDeal') ?? '',
    organizationName: formData.get('organizationName') ?? '',
  });
  if (!parsed.success) {
    return {
      error: t.common.errorValidation,
      fieldErrors: fieldErrorsFrom(parsed.error, (issue) => (issue.path[0] === 'goals' ? t.onboarding.goalsError : t.common.required)),
      values: echo(formData),
    };
  }
  await saveProfile(await getDb(), auth, parsed.data);
  redirect('/dashboard');
}
