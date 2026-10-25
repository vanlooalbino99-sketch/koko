'use client';

import { useActionState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { requestQuoteAction } from '@/app/actions/billing';
import { Field, FormAlert } from '@/components/ui/field';
import { Input, Textarea } from '@/components/ui/input';
import { initialFormState } from '@/lib/forms';

type Labels = { company: string; email: string; seats: string; message: string; submit: string };

// Offre Entreprise : demande de devis, sans paiement en ligne.
export function QuoteForm({ labels, defaults }: { labels: Labels; defaults: { company: string; email: string } }) {
  const [state, action, pending] = useActionState(requestQuoteAction, initialFormState);
  const value = (key: string, fallback = '') => (typeof state.values?.[key] === 'string' ? (state.values[key] as string) : fallback);
  if (state.ok) return <FormAlert tone="success" message={state.ok} />;
  return (
    <form action={action} className="grid gap-3" noValidate>
      <Field id="quote-company" label={labels.company}>
        {(p) => <Input {...p} name="company" required maxLength={120} defaultValue={value('company', defaults.company)} />}
      </Field>
      <div className="grid gap-3 sm:grid-cols-[1fr_96px]">
        <Field id="quote-email" label={labels.email}>
          {(p) => <Input {...p} name="email" type="email" required maxLength={254} defaultValue={value('email', defaults.email)} />}
        </Field>
        <Field id="quote-seats" label={labels.seats}>
          {(p) => <Input {...p} name="seats" type="number" required min={2} defaultValue={value('seats', '10')} />}
        </Field>
      </div>
      <Field id="quote-message" label={labels.message}>
        {(p) => <Textarea {...p} name="message" maxLength={2000} rows={3} className="min-h-20" defaultValue={value('message')} />}
      </Field>
      <FormAlert message={state.error} />
      <button
        type="submit"
        disabled={pending}
        className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-[13px] font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />} {labels.submit}
      </button>
    </form>
  );
}
