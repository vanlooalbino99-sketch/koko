import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { updateScenarioAction } from '@/app/actions/scenarios';
import { scenarioFormProps, valuesFrom } from '@/components/scenarios/form-props';
import { ScenarioForm } from '@/components/scenarios/scenario-form';
import { getDb } from '@/lib/db/client';
import type { ScenarioContent } from '@/lib/scenarios/content';
import { getScenario } from '@/lib/scenarios/service';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.form.editTitle };
}

export default async function EditScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { auth } = await requireOnboarded();
  const { t } = await getI18n();
  const detail = await getScenario(await getDb(), auth, (await params).id);
  // Seuls les scénarios privés de l'organisation, pour un rôle autorisé (qui voit alors le contenu complet).
  if (!detail || !detail.canEdit || !detail.showsHidden) notFound();
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.form.editTitle}</h1>
        <p className="mt-1 text-muted-foreground">{t.form.editSubtitle}</p>
      </div>
      <ScenarioForm
        action={updateScenarioAction}
        id={detail.scenario.id}
        initial={valuesFrom(detail.scenario, detail.content as ScenarioContent)}
        {...scenarioFormProps(t)}
      />
    </div>
  );
}
