import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './logo';
import { nav, services, site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{site.tagline} Assistants téléphoniques et automatisations IA pour les entreprises locales.</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Navigation</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[...nav, { href: '/rendez-vous', label: 'Prise de rendez-vous' }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Services</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="hover:text-foreground">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Contact</h2>
          <address className="space-y-2.5 text-sm text-muted-foreground not-italic">
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-foreground"><Phone className="size-4" aria-hidden />{site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-foreground"><Mail className="size-4" aria-hidden />{site.email}</a>
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />{site.address.street}, {site.address.postalCode} {site.address.city}</p>
          </address>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</p>
          <p className="flex gap-4">
            <span>{site.hours}</span>
            <Link href="/mentions-legales" className="hover:text-foreground">Mentions légales</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
