'use client';

import dynamic from 'next/dynamic';

// Le calendrier et la validation (react-day-picker, zod) sont chargés après le premier affichage :
// l'en-tête de la page s'affiche aussitôt sur mobile (Lighthouse), le formulaire arrive juste après.
export const BookingFormLazy = dynamic(() => import('./booking-form').then((m) => m.BookingForm), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]" aria-busy="true" aria-label="Chargement du formulaire de réservation">
      <div className="h-[640px] animate-pulse rounded-2xl border bg-card lg:w-[400px]" />
      <div className="h-[640px] animate-pulse rounded-2xl border bg-card" />
    </div>
  ),
});
