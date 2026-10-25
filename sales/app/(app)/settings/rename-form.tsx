'use client';

import { useActionState } from 'react';
import { renameOrganizationAction } from '@/app/actions/team';
import { Button } from '@/components/ui/button';
import { Field, FormAlert } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { initialFormState } from '@/lib/forms';

export function RenameForm({ name, labels }: { name: string; labels: { name: string; submit: string } }) {
  const [state, action, pending] = useActionState(renameOrganizationAction, initialFormState);
  const value = typeof state.values?.name === 'string' ? state.values.name : name;
  return (
    <form action={action} className="grid gap-3" noValidate>
      <div className="flex flex-wrap items-end gap-3">
        <Field id="organization-name" label={labels.name} error={state.fieldErrors?.name} className="min-w-56 flex-1">
          {(p) => <Input {...p} name="name" required minLength={2} maxLength={80} defaultValue={value} />}
        </Field>
        <Button type="submit" variant="outline" disabled={pending} className="h-11">
          {labels.submit}
        </Button>
      </div>
      <FormAlert message={state.error} />
      <FormAlert tone="success" message={state.ok} />
    </form>
  );
}
