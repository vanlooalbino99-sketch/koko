'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db/client';
import { SKILLS } from '@/lib/domain';
import { echo, fieldErrorsFrom, type FormState } from '@/lib/forms';
import { ScenarioInputSchema, splitLines } from '@/lib/scenarios/content';
import { format } from '@/lib/i18n';
import { archiveScenario, createScenario, ForbiddenError, PlanLimitError, updateScenario } from '@/lib/scenarios/service';
import { getI18n, requireAuth } from '@/lib/server/context';
import { listVoices } from '@/lib/voice/catalog';

function text(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === 'string' ? v : '';
}

// Le formulaire est à plat (« prospect.name ») ; on reconstruit l'objet attendu par le schéma.
function readScenario(formData: FormData) {
  return {
    meta: {
      title: text(formData, 'title'),
      summary: text(formData, 'summary'),
      industry: text(formData, 'industry'),
      family: text(formData, 'family'),
      difficulty: text(formData, 'difficulty'),
      language: text(formData, 'language'),
      channel: text(formData, 'channel'),
      estimatedMinutes: Number(text(formData, 'estimatedMinutes')),
    },
    content: {
      objective: text(formData, 'objective'),
      context: text(formData, 'context'),
      offer: { name: text(formData, 'offer.name'), description: text(formData, 'offer.description'), price: text(formData, 'offer.price') },
      prospect: {
        name: text(formData, 'prospect.name'),
        role: text(formData, 'prospect.role'),
        company: text(formData, 'prospect.company'),
        companySize: text(formData, 'prospect.companySize'),
        personality: text(formData, 'prospect.personality'),
        decisionPower: text(formData, 'prospect.decisionPower'),
        publicProfile: text(formData, 'prospect.publicProfile'),
      },
      voiceId: text(formData, 'voiceId').trim() || undefined,
      need: text(formData, 'need'),
      budget: text(formData, 'budget'),
      objections: splitLines(formData.get('objections')),
      constraints: splitLines(formData.get('constraints')),
      hiddenFacts: splitLines(formData.get('hiddenFacts')),
      successCriteria: splitLines(formData.get('successCriteria')),
      endConditions: splitLines(formData.get('endConditions')),
      skillWeights: Object.fromEntries(
        SKILLS.map((s) => [s, Number(text(formData, `weight.${s}`) || 0)] as const).filter(([, w]) => w > 0),
      ),
    },
  };
}

function invalid(error: import('zod').ZodError, formData: FormData, t: Awaited<ReturnType<typeof getI18n>>['t']): FormState {
  return {
    error: t.common.errorValidation,
    // « meta.title » et « content.prospect.name » deviennent les noms des champs du formulaire.
    fieldErrors: Object.fromEntries(
      Object.entries(
        fieldErrorsFrom(error, (issue) => (issue.message === 'skill_weights_empty' ? t.form.skillWeightsError : t.common.required)),
      ).map(([k, v]) => [k.replace(/^(meta|content)\./, ''), v]),
    ),
    values: echo(formData),
  };
}

// Une voix choisie doit exister dans le compte ElevenLabs (quand la liste est disponible).
async function unknownVoice(voiceId: string | undefined) {
  if (!voiceId) return false;
  const voices = await listVoices();
  return voices.length > 0 && !voices.some((v) => v.id === voiceId);
}

export async function createScenarioAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAuth();
  const { t } = await getI18n();
  const parsed = ScenarioInputSchema.safeParse(readScenario(formData));
  if (!parsed.success) return invalid(parsed.error, formData, t);
  if (await unknownVoice(parsed.data.content.voiceId)) return { fieldErrors: { voiceId: t.form.voiceUnknown }, values: echo(formData) };
  let id: string;
  try {
    id = await createScenario(await getDb(), auth, parsed.data);
  } catch (err) {
    if (err instanceof ForbiddenError) return { error: t.form.forbidden, values: echo(formData) };
    if (err instanceof PlanLimitError) return { error: format(t.form.planLimit, { n: err.limit }), values: echo(formData) };
    throw err;
  }
  revalidatePath('/scenarios');
  redirect(`/scenarios/${id}?saved=created`);
}

export async function updateScenarioAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAuth();
  const { t } = await getI18n();
  const id = text(formData, '$id');
  const parsed = ScenarioInputSchema.safeParse(readScenario(formData));
  if (!parsed.success) return invalid(parsed.error, formData, t);
  if (await unknownVoice(parsed.data.content.voiceId)) return { fieldErrors: { voiceId: t.form.voiceUnknown }, values: echo(formData) };
  try {
    await updateScenario(await getDb(), auth, id, parsed.data);
  } catch (err) {
    if (err instanceof ForbiddenError) return { error: t.form.forbidden, values: echo(formData) };
    throw err;
  }
  revalidatePath('/scenarios');
  redirect(`/scenarios/${id}?saved=updated`);
}

export async function archiveScenarioAction(formData: FormData) {
  const auth = await requireAuth();
  const id = text(formData, 'id');
  await archiveScenario(await getDb(), auth, id);
  revalidatePath('/scenarios');
  redirect('/scenarios?scope=private&saved=archived');
}
