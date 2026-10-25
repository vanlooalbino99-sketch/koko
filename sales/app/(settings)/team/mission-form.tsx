'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { assignMissionAction } from '@/app/actions/team';
import { Button } from '@/components/ui/button';
import { Field, FormAlert } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { initialFormState } from '@/lib/forms';

type Option = { value: string; label: string };
type Labels = { scenario: string; assignee: string; all: string; due: string; note: string; noteHint: string; submit: string };

export function MissionForm({ scenarios, members, labels, minDate }: { scenarios: Option[]; members: Option[]; labels: Labels; minDate: string }) {
  const [state, action, pending] = useActionState(assignMissionAction, initialFormState);
  const value = (key: string) => (typeof state.values?.[key] === 'string' ? (state.values[key] as string) : undefined);
  return (
    <form action={action} className="grid gap-3" noValidate key={state.ok}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="mission-scenario" label={labels.scenario}>
          {(p) => (
            <Select {...p} name="scenario" required defaultValue={value('scenario')}>
              {scenarios.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="mission-assignee" label={labels.assignee}>
          {(p) => (
            <Select {...p} name="assignee" required defaultValue={value('assignee') ?? 'all'}>
              <option value="all">{labels.all}</option>
              {members.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field id="mission-due" label={labels.due} className="sm:max-w-56">
        {(p) => <Input {...p} name="due" type="date" min={minDate} defaultValue={value('due')} />}
      </Field>
      <Field id="mission-note" label={labels.note} hint={labels.noteHint}>
        {(p) => <Textarea {...p} name="note" maxLength={300} rows={2} className="min-h-16" defaultValue={value('note')} />}
      </Field>
      <FormAlert message={state.error} />
      <FormAlert tone="success" message={state.ok} />
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending && <Loader2 className="animate-spin" />} {labels.submit}
      </Button>
    </form>
  );
}
