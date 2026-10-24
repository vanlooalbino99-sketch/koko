'use client';

import { useActionState, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { saveOnboardingAction } from '@/app/actions/onboarding';
import { Button } from '@/components/ui/button';
import { Field, FormAlert } from '@/components/ui/field';
import { Input, Textarea } from '@/components/ui/input';
import { initialFormState } from '@/lib/forms';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string; hint?: string };

const MAX_GOALS = 5;

export function OnboardingForm({
  initial,
  personas,
  experiences,
  skills,
  labels,
  canRenameOrganization,
}: {
  initial: {
    persona?: string;
    experience?: string;
    goals: string[];
    offerName: string;
    offerDescription: string;
    idealCustomer: string;
    averageDeal: string;
    organizationName: string;
  };
  personas: Option[];
  experiences: Option[];
  skills: Option[];
  labels: Record<
    | 'personaQuestion'
    | 'experienceQuestion'
    | 'goalsQuestion'
    | 'goalsError'
    | 'offerTitle'
    | 'offerHint'
    | 'offerName'
    | 'offerDescription'
    | 'idealCustomer'
    | 'averageDeal'
    | 'organizationName'
    | 'submit'
    | 'optional',
    string
  >;
  canRenameOrganization: boolean;
}) {
  const [state, action, pending] = useActionState(saveOnboardingAction, initialFormState);
  const [persona, setPersona] = useState(initial.persona ?? '');
  const [goals, setGoals] = useState<string[]>(initial.goals);
  const errors = state.fieldErrors ?? {};
  const v = (key: keyof typeof initial) => {
    const echoed = state.values?.[key];
    return typeof echoed === 'string' ? echoed : (initial[key] as string);
  };

  return (
    <form action={action} className="mt-8 grid gap-8" noValidate>
      <FormAlert message={state.error} />
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-sm font-medium">{labels.personaQuestion}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {personas.map((p) => (
            <label
              key={p.value}
              className={cn(
                'flex cursor-pointer gap-3 rounded-xl border bg-surface p-4 transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40',
                persona === p.value ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-input',
              )}
            >
              <input
                type="radio"
                name="persona"
                value={p.value}
                required
                className="sr-only"
                checked={persona === p.value}
                onChange={() => setPersona(p.value)}
              />
              <span>
                <span className="block text-sm font-medium">{p.label}</span>
                <span className="block text-xs text-muted-foreground">{p.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.persona && <p className="text-xs text-destructive">{errors.persona}</p>}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">{labels.experienceQuestion}</legend>
        <div className="flex flex-wrap gap-2">
          {experiences.map((e) => (
            <label
              key={e.value}
              className="cursor-pointer rounded-full border border-border bg-surface px-4 py-2 text-sm transition-colors has-[:checked]:border-primary/60 has-[:checked]:bg-primary/15 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40"
            >
              <input type="radio" name="experience" value={e.value} defaultChecked={initial.experience === e.value} required className="sr-only" />
              {e.label}
            </label>
          ))}
        </div>
        {errors.experience && <p className="mt-2 text-xs text-destructive">{errors.experience}</p>}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          {labels.goalsQuestion} <span className="text-muted-foreground">· {goals.length}/{MAX_GOALS}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => {
            const checked = goals.includes(s.value);
            const disabled = !checked && goals.length >= MAX_GOALS;
            return (
              <label
                key={s.value}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40',
                  checked ? 'border-teal/60 bg-teal/10 text-foreground' : 'border-border bg-surface text-muted-foreground hover:text-foreground',
                  disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <input
                  type="checkbox"
                  name="goals"
                  value={s.value}
                  checked={checked}
                  disabled={disabled}
                  className="sr-only"
                  onChange={() => setGoals((g) => (checked ? g.filter((x) => x !== s.value) : [...g, s.value]))}
                />
                {checked && <Check className="size-3.5 text-teal" aria-hidden="true" />}
                {s.label}
              </label>
            );
          })}
        </div>
        {errors.goals && <p className="mt-2 text-xs text-destructive">{labels.goalsError}</p>}
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-border bg-surface/60 p-5">
        <legend className="px-1 text-sm font-medium">{labels.offerTitle}</legend>
        <p className="-mt-1 text-xs text-muted-foreground">{labels.offerHint}</p>
        {(persona === 'team' || persona === 'agency') && canRenameOrganization && (
          <Field id="organizationName" label={labels.organizationName}>
            {(p) => <Input {...p} name="organizationName" defaultValue={v('organizationName')} maxLength={80} />}
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="offerName" label={labels.offerName}>
            {(p) => <Input {...p} name="offerName" defaultValue={v('offerName')} maxLength={120} />}
          </Field>
          <Field id="averageDeal" label={labels.averageDeal}>
            {(p) => <Input {...p} name="averageDeal" defaultValue={v('averageDeal')} maxLength={80} />}
          </Field>
        </div>
        <Field id="offerDescription" label={labels.offerDescription}>
          {(p) => <Textarea {...p} name="offerDescription" defaultValue={v('offerDescription')} maxLength={600} rows={2} />}
        </Field>
        <Field id="idealCustomer" label={labels.idealCustomer}>
          {(p) => <Input {...p} name="idealCustomer" defaultValue={v('idealCustomer')} maxLength={300} />}
        </Field>
      </fieldset>

      <Button type="submit" size="lg" disabled={pending} className="justify-self-start">
        {pending && <Loader2 className="animate-spin" />} {labels.submit}
      </Button>
    </form>
  );
}
