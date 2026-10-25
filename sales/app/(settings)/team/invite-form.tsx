'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { inviteAction } from '@/app/actions/team';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Field, FormAlert } from '@/components/ui/field';
import { Input, Select } from '@/components/ui/input';
import { initialFormState } from '@/lib/forms';

type Labels = { email: string; role: string; submit: string; link: string; copy: string; copied: string };

export function InviteForm({ roles, labels }: { roles: { value: string; label: string }[]; labels: Labels }) {
  const [state, action, pending] = useActionState(inviteAction, initialFormState);
  const email = typeof state.values?.email === 'string' ? state.values.email : undefined;
  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto] sm:items-end" noValidate>
        <Field id="invite-email" label={labels.email} error={state.fieldErrors?.email}>
          {(p) => <Input {...p} name="email" type="email" autoComplete="off" required defaultValue={state.ok ? undefined : email} key={state.ok} />}
        </Field>
        <Field id="invite-role" label={labels.role}>
          {(p) => (
            <Select {...p} name="role" defaultValue="member">
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Button type="submit" disabled={pending} className="h-11">
          {pending && <Loader2 className="animate-spin" />} {labels.submit}
        </Button>
      </form>
      <FormAlert message={state.error} />
      {state.ok && (
        <div className="grid gap-2 rounded-xl border border-success/30 bg-success/10 p-3">
          <label htmlFor="invite-link" className="text-sm font-medium">
            {labels.link.replace('{email}', email ?? '')}
          </label>
          <div className="flex flex-wrap gap-2">
            <Input id="invite-link" readOnly value={state.ok} className="flex-1 font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
            <CopyButton value={state.ok} label={labels.copy} done={labels.copied} />
          </div>
        </div>
      )}
    </div>
  );
}
