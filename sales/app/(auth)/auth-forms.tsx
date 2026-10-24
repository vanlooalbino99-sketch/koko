'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { logInAction, signUpAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Field, FormAlert } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { initialFormState } from '@/lib/forms';

type Labels = {
  name: string;
  email: string;
  password: string;
  passwordHint: string;
  submit: string;
  switchText: string;
  terms?: string;
};

const value = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);

export function LoginForm({ labels, next }: { labels: Labels; next?: string }) {
  const [state, action, pending] = useActionState(logInAction, initialFormState);
  return (
    <form action={action} className="grid gap-4" noValidate>
      <FormAlert message={state.error} />
      {next && <input type="hidden" name="next" value={next} />}
      <Field id="email" label={labels.email}>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" required defaultValue={value(state.values?.email)} />}
      </Field>
      <Field id="password" label={labels.password}>
        {(p) => <Input {...p} name="password" type="password" autoComplete="current-password" required />}
      </Field>
      <Button type="submit" size="lg" disabled={pending} className="mt-2">
        {pending && <Loader2 className="animate-spin" />} {labels.submit}
      </Button>
      <Link href="/signup" className="text-center text-sm text-muted-foreground hover:text-foreground">
        {labels.switchText}
      </Link>
    </form>
  );
}

export function SignupForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState(signUpAction, initialFormState);
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-4" noValidate>
      <FormAlert message={state.error} />
      <Field id="name" label={labels.name} error={errors.name}>
        {(p) => <Input {...p} name="name" autoComplete="name" required defaultValue={value(state.values?.name)} />}
      </Field>
      <Field id="email" label={labels.email} error={errors.email}>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" required defaultValue={value(state.values?.email)} />}
      </Field>
      <Field id="password" label={labels.password} hint={labels.passwordHint} error={errors.password}>
        {(p) => <Input {...p} name="password" type="password" autoComplete="new-password" minLength={10} required />}
      </Field>
      <Button type="submit" size="lg" disabled={pending} className="mt-2">
        {pending && <Loader2 className="animate-spin" />} {labels.submit}
      </Button>
      {labels.terms && <p className="text-xs text-muted-foreground">{labels.terms}</p>}
      <Link href="/login" className="text-center text-sm text-muted-foreground hover:text-foreground">
        {labels.switchText}
      </Link>
    </form>
  );
}
