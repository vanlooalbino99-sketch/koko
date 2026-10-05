'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { a11y, Consent, Field, Honeypot, selectClass } from './field';
import { contactSchema, SUJETS, type ContactData, type ContactInput } from '@/lib/validation';
import { submitContact } from '@/actions/contact';
import { newRequestId } from '@/lib/utils';

export function ContactForm() {
  const [requestId, setRequestId] = useState(() => newRequestId());
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { nom: '', entreprise: '', email: '', telephone: '', sujet: 'information', message: '', consentement: false, website: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const res = await submitContact(data, requestId).catch(() => ({ ok: false as const, error: 'Connexion impossible. Vérifiez votre réseau et réessayez.' }));
    if (res.ok) {
      setDone(true);
      reset();
      setRequestId(newRequestId());
      return;
    }
    setServerError(res.error);
    if ('fieldErrors' in res && res.fieldErrors) for (const [k, v] of Object.entries(res.fieldErrors)) setError(k as keyof ContactInput, { message: v });
  });

  if (done) {
    return (
      <div role="status" className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold">Message envoyé</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">Merci ! Nous vous rappelons sous 24 h ouvrées. Un e-mail de confirmation vient de vous être envoyé.</p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Envoyer un autre message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 rounded-xl border bg-card p-6 sm:p-8" aria-label="Formulaire de contact">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="nom" label="Nom et prénom" error={errors.nom?.message}>
          <Input {...a11y('nom', errors.nom?.message)} autoComplete="name" {...register('nom')} />
        </Field>
        <Field id="entreprise" label="Entreprise" optional error={errors.entreprise?.message}>
          <Input {...a11y('entreprise', errors.entreprise?.message)} autoComplete="organization" {...register('entreprise')} />
        </Field>
        <Field id="email" label="E-mail" error={errors.email?.message}>
          <Input {...a11y('email', errors.email?.message)} type="email" autoComplete="email" inputMode="email" {...register('email')} />
        </Field>
        <Field id="telephone" label="Téléphone" error={errors.telephone?.message} hint="Pour vous rappeler rapidement.">
          <Input {...a11y('telephone', errors.telephone?.message, true)} type="tel" autoComplete="tel" inputMode="tel" {...register('telephone')} />
        </Field>
      </div>
      <Field id="sujet" label="Sujet" error={errors.sujet?.message}>
        <select {...a11y('sujet', errors.sujet?.message)} className={selectClass} {...register('sujet')}>
          {SUJETS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </Field>
      <Field id="message" label="Message" error={errors.message?.message}>
        <Textarea {...a11y('message', errors.message?.message)} rows={5} placeholder="Parlez-nous de votre activité et de ce que vous souhaitez améliorer." {...register('message')} />
      </Field>
      <Consent error={errors.consentement?.message} {...register('consentement')} />
      <Honeypot {...register('website')} />
      {serverError && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-fit">
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
        {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
      </Button>
    </form>
  );
}
