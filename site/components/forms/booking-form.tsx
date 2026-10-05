'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarCheck, CheckCircle2, ChevronsLeft, ChevronsRight, Clock, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { a11y, Consent, Field, Honeypot, selectClass } from './field';
import { bookingSchema, SERVICE_OPTIONS, type BookingData, type BookingInput } from '@/lib/validation';
import { availableSlots, booking, bookingWindow, formatSlot, formatTime } from '@/lib/slots';
import { submitBooking } from '@/actions/booking';
import { cn, newRequestId } from '@/lib/utils';

const ymd = (d: Date) => format(d, 'yyyy-MM-dd');
const fromYmd = (s: string) => new Date(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));

type Slots = { state: 'idle' } | { state: 'loading' } | { state: 'ready'; slots: string[] } | { state: 'error' };

export function BookingForm() {
  // Calculée dans le navigateur (la page est pré-générée : la date du jour n'est pas celle de la génération).
  const [win, setWin] = useState<{ from: string; to: string | null } | null>(null);
  // Mois affiché : navigation libre, mois par mois ou année par année, sans date limite.
  const [month, setMonth] = useState<Date | null>(null);
  useEffect(() => {
    const w = bookingWindow();
    setWin(w);
    setMonth(fromYmd(w.from.slice(0, 8) + '01'));
  }, []);
  const [requestId, setRequestId] = useState(() => newRequestId());
  const [slots, setSlots] = useState<Slots>({ state: 'idle' });
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const { register, handleSubmit, setValue, watch, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<BookingInput, unknown, BookingData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
    defaultValues: { date: '', heure: '', nom: '', entreprise: '', email: '', telephone: '', service: 'assistant-telephonique', message: '', consentement: false, website: '' },
  });
  const date = watch('date');
  const heure = watch('heure');

  // Service présélectionné depuis la page Services (?service=…).
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('service');
    if (s && SERVICE_OPTIONS.some((o) => o.value === s)) setValue('service', s);
  }, [setValue]);

  // Créneaux libres du jour choisi.
  useEffect(() => {
    if (!date) return;
    const ctrl = new AbortController();
    setSlots({ state: 'loading' });
    fetch(`/api/creneaux?date=${date}`, { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j: { slots: string[] }) => setSlots({ state: 'ready', slots: j.slots }))
      .catch((e) => e?.name !== 'AbortError' && setSlots({ state: 'error' }));
    return () => ctrl.abort();
  }, [date, refresh]);

  const pickDate = (d?: Date) => {
    setValue('date', d ? ymd(d) : '', { shouldValidate: true });
    setValue('heure', '');
  };
  const pickTime = (t: string) => {
    setValue('heure', t, { shouldValidate: true });
    clearErrors('heure');
  };

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const res = await submitBooking(data, requestId).catch(() => ({ ok: false as const, error: 'Connexion impossible. Vérifiez votre réseau et réessayez.' }));
    if (res.ok) {
      setConfirmed(res.quand);
      setRequestId(newRequestId());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setServerError(res.error);
    if ('fieldErrors' in res && res.fieldErrors) {
      for (const [k, v] of Object.entries(res.fieldErrors)) setError(k as keyof BookingInput, { message: v });
      if (res.fieldErrors.heure) {
        setValue('heure', '');
        setRefresh((n) => n + 1);
      }
    }
  });

  if (confirmed) {
    return (
      <div role="status" className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border bg-card p-10 text-center">
        <CheckCircle2 className="size-14 text-success" aria-hidden />
        <h2 className="mt-4 text-2xl font-semibold">Rendez-vous confirmé</h2>
        <p className="mt-3 text-lg font-medium text-primary first-letter:uppercase">{confirmed}</p>
        <p className="mt-3 max-w-md text-muted-foreground">Nous vous appelons au numéro indiqué. Un e-mail de confirmation avec l’invitation pour votre agenda vient de vous être envoyé.</p>
        <Button asChild variant="outline" className="mt-8"><Link href="/">Retour à l’accueil</Link></Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 lg:grid-cols-[auto_1fr]" aria-label="Réservation d’un rendez-vous">
      {/* 1. Date et heure */}
      <fieldset className="rounded-2xl border bg-card p-4 sm:p-6 lg:w-[400px]">
        <legend className="sr-only">Date et heure</legend>
        <h2 className="flex items-center gap-2 px-1 font-semibold"><Step n={1} />Choisissez un jour</h2>
        {!win || !month ? (
          <div className="mt-2 h-[352px] animate-pulse rounded-lg bg-muted/60" aria-label="Chargement du calendrier" />
        ) : (
          <>
            <MonthJump month={month} first={fromYmd(win.from.slice(0, 8) + '01')} onChange={setMonth} />
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={date ? fromYmd(date) : undefined}
              onSelect={pickDate}
              startMonth={fromYmd(win.from)}
              endMonth={win.to ? fromYmd(win.to) : undefined}
              // Jours sans aucun créneau possible (fermés, passés, délai de prévenance dépassé) : grisés.
              disabled={[{ before: fromYmd(win.from) }, ...(win.to ? [{ after: fromYmd(win.to) }] : []), (d: Date) => availableSlots(ymd(d)).length === 0]}
              className="mx-auto mt-1 px-0"
              classNames={{ root: 'w-full', months: 'w-full' }}
            />
          </>
        )}
        {errors.date && <p role="alert" className="mt-1 px-1 text-sm text-destructive">{errors.date.message}</p>}

        <div className="mt-4 border-t pt-5" aria-live="polite">
          <h2 className="flex items-center gap-2 px-1 font-semibold"><Step n={2} />Choisissez un horaire</h2>
          {!date && <p className="mt-3 px-1 text-sm text-muted-foreground">Sélectionnez d’abord un jour dans le calendrier.</p>}
          {date && slots.state === 'loading' && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" aria-label="Chargement des créneaux">
              {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />)}
            </div>
          )}
          {date && slots.state === 'error' && (
            <p className="mt-3 px-1 text-sm text-destructive">Impossible de charger les créneaux. <button type="button" className="underline" onClick={() => setRefresh((n) => n + 1)}>Réessayer</button></p>
          )}
          {date && slots.state === 'ready' && slots.slots.length === 0 && (
            <p className="mt-3 px-1 text-sm text-muted-foreground">Plus de créneau libre ce jour-là. Essayez une autre date.</p>
          )}
          {date && slots.state === 'ready' && slots.slots.length > 0 && (
            <>
              <p className="mt-1 px-1 text-sm text-muted-foreground first-letter:uppercase">{formatSlot(date)}</p>
              <div role="radiogroup" aria-label="Horaires disponibles" className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={heure === t}
                    onClick={() => pickTime(t)}
                    className={cn(
                      'h-10 rounded-md border text-sm font-medium tabular-nums transition-colors hover:border-primary hover:text-primary',
                      heure === t && 'border-primary bg-primary text-primary-foreground hover:text-primary-foreground',
                    )}
                  >
                    {formatTime(t)}
                  </button>
                ))}
              </div>
            </>
          )}
          {errors.heure && <p role="alert" className="mt-2 px-1 text-sm text-destructive">{errors.heure.message}</p>}
          <p className="mt-4 flex items-center gap-1.5 px-1 text-xs text-muted-foreground"><Clock className="size-3.5" aria-hidden />Heure de Paris · appel de {booking.durationMinutes} minutes maximum</p>
        </div>
      </fieldset>

      {/* 2. Coordonnées */}
      <fieldset className="grid content-start gap-5 rounded-2xl border bg-card p-6 sm:p-8">
        <legend className="sr-only">Vos coordonnées</legend>
        <h2 className="flex items-center gap-2 font-semibold"><Step n={3} />Vos coordonnées</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="nom" label="Nom et prénom" error={errors.nom?.message}>
            <Input {...a11y('nom', errors.nom?.message)} autoComplete="name" {...register('nom')} />
          </Field>
          <Field id="entreprise" label="Entreprise" error={errors.entreprise?.message}>
            <Input {...a11y('entreprise', errors.entreprise?.message)} autoComplete="organization" {...register('entreprise')} />
          </Field>
          <Field id="email" label="E-mail" error={errors.email?.message}>
            <Input {...a11y('email', errors.email?.message)} type="email" autoComplete="email" inputMode="email" {...register('email')} />
          </Field>
          <Field id="telephone" label="Téléphone" error={errors.telephone?.message} hint="Nous vous appelons à ce numéro.">
            <Input {...a11y('telephone', errors.telephone?.message, true)} type="tel" autoComplete="tel" inputMode="tel" {...register('telephone')} />
          </Field>
        </div>
        <Field id="service" label="Ce qui vous intéresse" error={errors.service?.message}>
          <select {...a11y('service', errors.service?.message)} className={selectClass} {...register('service')}>
            {SERVICE_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field id="message" label="Votre situation en quelques mots" optional error={errors.message?.message}>
          <Textarea {...a11y('message', errors.message?.message)} rows={4} placeholder="Ex. : cabinet de 3 personnes, beaucoup d’appels manqués le midi." {...register('message')} />
        </Field>
        <Consent error={errors.consentement?.message} {...register('consentement')} />
        <Honeypot {...register('website')} />

        {date && heure && (
          <p className="rounded-lg bg-accent px-4 py-3 text-sm text-accent-foreground">
            <CalendarCheck className="mr-2 inline size-4 align-[-3px]" aria-hidden />
            <span className="first-letter:uppercase">{formatSlot(date, heure)}</span>
          </p>
        )}
        {serverError && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>}
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : <CalendarCheck aria-hidden />}
          {isSubmitting ? 'Réservation…' : 'Confirmer le rendez-vous'}
        </Button>
      </fieldset>
    </form>
  );
}

const MONTHS = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2026, i, 1)));

/** Saut rapide : mois (liste) et année (‹ 2027 ›), sans limite vers le futur. */
function MonthJump({ month, first, onChange }: { month: Date; first: Date; onChange: (d: Date) => void }) {
  const y = month.getFullYear(), m = month.getMonth();
  const go = (yy: number, mm: number) => {
    const d = new Date(yy, mm, 1);
    onChange(d < first ? first : d);
  };
  const atStart = y <= first.getFullYear();
  const btn = 'inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35';
  return (
    <div className="mt-3 flex items-center gap-1.5 rounded-xl border bg-background/60 p-1">
      <button type="button" className={btn} onClick={() => go(y - 1, m)} disabled={atStart} aria-label="Année précédente"><ChevronsLeft className="size-4" aria-hidden /></button>
      <select
        aria-label="Mois"
        value={m}
        onChange={(e) => go(y, +e.target.value)}
        className="h-9 min-w-0 flex-1 cursor-pointer rounded-md bg-transparent px-2 text-sm font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {MONTHS.map((label, i) => <option key={label} value={i} disabled={y === first.getFullYear() && i < first.getMonth()}>{label}</option>)}
      </select>
      <span className="w-12 text-center text-sm font-semibold tabular-nums" aria-live="polite" aria-label={`Année ${y}`}>{y}</span>
      <button type="button" className={btn} onClick={() => go(y + 1, m)} aria-label="Année suivante"><ChevronsRight className="size-4" aria-hidden /></button>
      <button type="button" onClick={() => onChange(first)} className="h-9 rounded-md px-2.5 text-xs font-medium text-primary transition-colors hover:bg-accent">Aujourd’hui</button>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" aria-hidden>{n}</span>;
}
