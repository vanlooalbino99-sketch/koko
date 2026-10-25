'use client';

import { useActionState, useRef, useState } from 'react';
import { Loader2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FormAlert } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { initialFormState, type FormState } from '@/lib/forms';

type Option = { value: string; label: string };
export type VoiceOption = { id: string; name: string; previewUrl: string | null; hint: string };
export type ScenarioFormValues = Record<string, string>;
export type ScenarioFormLabels = Record<string, string>;

export function ScenarioForm({
  action,
  id,
  initial,
  labels,
  options,
  skills,
  voices = [],
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  id?: string;
  initial: ScenarioFormValues;
  labels: ScenarioFormLabels;
  options: Record<'family' | 'difficulty' | 'language' | 'channel' | 'personality' | 'decisionPower', Option[]>;
  skills: Option[];
  voices?: VoiceOption[];
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const errors = state.fieldErrors ?? {};
  const value = (name: string) => {
    const echoed = state.values?.[name];
    return typeof echoed === 'string' ? echoed : (initial[name] ?? '');
  };
  // Chaque champ texte du formulaire : même structure, nom « à plat » identique au chemin du schéma.
  const text = (name: string, label: string, opts: { area?: boolean; rows?: number; hint?: string; max?: number; required?: boolean } = {}) => (
    <Field id={name} label={label} hint={opts.hint} error={errors[name]}>
      {(p) =>
        opts.area ? (
          <Textarea {...p} name={name} rows={opts.rows ?? 3} defaultValue={value(name)} maxLength={opts.max} required={opts.required} />
        ) : (
          <Input {...p} name={name} defaultValue={value(name)} maxLength={opts.max} required={opts.required} />
        )
      }
    </Field>
  );
  const select = (name: keyof typeof options, label: string, field: string = name) => (
    <Field id={field} label={label} error={errors[field]}>
      {(p) => (
        <Select {...p} name={field} defaultValue={value(field)} required>
          {options[name].map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      )}
    </Field>
  );
  const section = (title: string, children: React.ReactNode) => (
    <fieldset className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      {id && <input type="hidden" name="$id" value={id} />}
      <FormAlert message={state.error} />
      {section(
        labels.sectionGeneral,
        <>
          {text('title', labels.title, { max: 120, required: true })}
          {text('summary', labels.summary, { max: 400, required: true })}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {select('family', labels.family)}
            {select('difficulty', labels.difficulty)}
            {select('language', labels.language)}
            {select('channel', labels.channel)}
            {text('industry', labels.industry, { max: 80, required: true })}
            <Field id="estimatedMinutes" label={labels.estimatedMinutes} error={errors.estimatedMinutes}>
              {(p) => <Input {...p} name="estimatedMinutes" type="number" min={2} max={30} defaultValue={value('estimatedMinutes')} required />}
            </Field>
          </div>
          {text('objective', labels.objective, { area: true, rows: 2, max: 600, required: true })}
          {text('context', labels.context, { area: true, rows: 2, max: 1500 })}
        </>,
      )}
      {section(
        labels.sectionOffer,
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text('offer.name', labels.offerName, { max: 120, required: true })}
            {text('offer.price', labels.offerPrice, { max: 120 })}
          </div>
          {text('offer.description', labels.offerDescription, { area: true, rows: 2, max: 800 })}
        </>,
      )}
      {section(
        labels.sectionProspect,
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text('prospect.name', labels.prospectName, { max: 80, required: true })}
            {text('prospect.role', labels.prospectRole, { max: 120, required: true })}
            {text('prospect.company', labels.prospectCompany, { max: 120, required: true })}
            {text('prospect.companySize', labels.companySize, { max: 80 })}
            {select('personality', labels.personality, 'prospect.personality')}
            {select('decisionPower', labels.decisionPower, 'prospect.decisionPower')}
          </div>
          {text('prospect.publicProfile', labels.publicProfile, { area: true, rows: 2, max: 800 })}
          <VoiceField voices={voices} initial={value('voiceId')} error={errors.voiceId} labels={labels} />
        </>,
      )}
      {section(
        labels.sectionSituation,
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text('need', labels.need, { area: true, rows: 3, max: 800, required: true })}
            {text('budget', labels.budget, { area: true, rows: 3, max: 300, required: true })}
            {text('objections', labels.objections, { area: true, rows: 4, required: true })}
            {text('constraints', labels.constraints, { area: true, rows: 4 })}
          </div>
          {text('hiddenFacts', labels.hiddenFacts, { area: true, rows: 4, hint: labels.hiddenFactsHint })}
        </>,
      )}
      {section(
        labels.sectionEvaluation,
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {text('successCriteria', labels.successCriteria, { area: true, rows: 4, required: true })}
            {text('endConditions', labels.endConditions, { area: true, rows: 4 })}
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">{labels.skillWeights}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <label key={skill.value} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                  {skill.label}
                  <Select name={`weight.${skill.value}`} defaultValue={value(`weight.${skill.value}`) || '0'} className="h-9 w-20">
                    {[0, 1, 2, 3, 4, 5].map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </Select>
                </label>
              ))}
            </div>
            {errors.skillWeights && <p className="mt-2 text-xs text-destructive">{errors.skillWeights}</p>}
          </div>
        </>,
      )}
      <Button type="submit" size="lg" disabled={pending} className="justify-self-start">
        {pending && <Loader2 className="animate-spin" />} {id ? labels.update : labels.create}
      </Button>
    </form>
  );
}

// Choix de la voix ElevenLabs du prospect, avec écoute de l'extrait fourni par ElevenLabs.
function VoiceField({ voices, initial, error, labels }: { voices: VoiceOption[]; initial: string; error?: string; labels: ScenarioFormLabels }) {
  const [selected, setSelected] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const preview = voices.find((v) => v.id === selected)?.previewUrl ?? null;
  const stop = () => {
    audio.current?.pause();
    setPlaying(false);
  };
  const listen = () => {
    if (playing) return stop();
    if (!preview) return;
    audio.current?.pause();
    const a = new Audio(preview);
    a.onended = () => setPlaying(false);
    audio.current = a;
    setPlaying(true);
    void a.play().catch(() => setPlaying(false));
  };
  return (
    <Field id="voiceId" label={labels.voice} hint={voices.length ? labels.voiceHint : labels.voiceListEmpty} error={error}>
      {(p) => (
        <div className="flex gap-2">
          <Select
            {...p}
            name="voiceId"
            value={selected}
            onChange={(e) => {
              stop();
              setSelected(e.target.value);
            }}
            className="flex-1"
          >
            <option value="">{labels.voiceDefault}</option>
            {voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.hint ? `${v.name} · ${v.hint}` : v.name}
              </option>
            ))}
            {selected && !voices.some((v) => v.id === selected) && <option value={selected}>{selected}</option>}
          </Select>
          <Button type="button" variant="outline" onClick={listen} disabled={!preview} aria-pressed={playing}>
            {playing ? <Pause /> : <Play />} {labels.voiceListen}
          </Button>
        </div>
      )}
    </Field>
  );
}
