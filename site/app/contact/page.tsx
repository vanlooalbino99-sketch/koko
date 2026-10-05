import Link from 'next/link';
import { CalendarCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero, Section } from '@/components/sections/section';
import { ContactForm } from '@/components/forms/contact-form';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Contact',
  description: 'Une question, un devis ? Écrivez à Blackstart AI : nous vous rappelons sous 24 h ouvrées.',
  path: '/contact',
});

export default function ContactPage() {
  const infos = [
    { icon: Phone, label: 'Téléphone', value: site.phoneDisplay, href: `tel:${site.phone.replace(/\s/g, '')}` },
    { icon: Mail, label: 'E-mail', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Adresse', value: `${site.address.street}, ${site.address.postalCode} ${site.address.city}` },
    { icon: Clock, label: 'Horaires', value: site.hours },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons de votre activité" intro="Laissez-nous un message : un membre de l’équipe vous rappelle sous 24 h ouvrées pour comprendre votre besoin." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-6">
            <ul className="space-y-5">
              {infos.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="size-5" aria-hidden /></span>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    {href ? <a href={href} className="font-medium hover:text-primary">{value}</a> : <p className="font-medium">{value}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border bg-muted/50 p-6">
              <h2 className="font-semibold">Vous préférez fixer un moment ?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Choisissez directement un créneau pour votre audit gratuit de 20 minutes.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/rendez-vous"><CalendarCheck aria-hidden />Prendre rendez-vous</Link>
              </Button>
            </div>
          </aside>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
