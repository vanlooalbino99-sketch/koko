import type { Metadata } from 'next';
import { createScenarioAction } from '@/app/actions/scenarios';
import { emptyValues, scenarioFormProps } from '@/components/scenarios/form-props';
import { ScenarioForm } from '@/components/scenarios/scenario-form';
import { FormAlert } from '@/components/ui/field';
import { can } from '@/lib/domain';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.form.newTitle };
}

export default async function NewScenarioPage() {
  const { auth, profile } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const initial = {
    ...emptyValues(locale),
    'offer.name': profile.offerName ?? '',
    'offer.description': profile.offerDescription ?? '',
    'offer.price': profile.averageDeal ?? '',
  };
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.form.newTitle}</h1>
        <p className="mt-1 text-muted-foreground">{t.form.newSubtitle}</p>
      </div>
      {can(auth.role, 'scenario:create') ? (
        <ScenarioForm action={createScenarioAction} initial={initial} {...scenarioFormProps(t)} />
      ) : (
        <FormAlert message={t.form.forbidden} />
      )}
    </div>
  );
}
