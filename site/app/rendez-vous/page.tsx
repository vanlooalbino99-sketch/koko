import { Check } from 'lucide-react';
import { PageHero, Section } from '@/components/sections/section';
import { BookingFormLazy as BookingForm } from '@/components/forms/booking-form-lazy';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Prendre rendez-vous',
  description: 'Réservez en ligne votre audit gratuit de 20 minutes avec Blackstart AI : choisissez un jour et un horaire, nous vous appelons.',
  path: '/rendez-vous',
});

export default function BookingPage() {
  return (
    <>
      <PageHero eyebrow="Prise de rendez-vous" title="Réservez votre audit gratuit" intro="20 minutes au téléphone pour mesurer les appels et demandes que vous perdez, et voir ce que l’IA peut récupérer pour vous.">
        <ul className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
          {['Gratuit et sans engagement', 'Confirmation immédiate par e-mail', 'Nous vous appelons'].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden />{t}</li>
          ))}
        </ul>
      </PageHero>
      <Section className="pt-10 md:pt-14">
        <BookingForm />
      </Section>
    </>
  );
}
