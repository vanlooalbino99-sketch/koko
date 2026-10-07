import Link from 'next/link';
import { Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageHero, Section, SectionHeading } from '@/components/sections/section';
import { PackCards } from '@/components/sections/pricing';
import { Cta } from '@/components/sections/cta';
import { JsonLd, pageMetadata } from '@/lib/seo';
import { packs, saas, site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Offres et tarifs',
  description: 'Business Starter, Acquisition Pro, Scale, Entreprise : les packs Blackstart AI pour votre site, votre prise de rendez-vous et votre CRM, avec leurs prix.',
  path: '/offres',
});

export default function OffresPage() {
  return (
    <>
      <PageHero eyebrow="Offres et tarifs" title="Un pack pour chaque étape de votre croissance" intro="Du site qui prend vos rendez-vous au CRM qui pilote toute votre équipe commerciale. Chaque pack démarre par un audit gratuit.">
        <ul className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
          {['Audit gratuit avant de choisir', 'Mise en place clé en main', 'Intégré à votre CRM'].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden />{t}</li>
          ))}
        </ul>
      </PageHero>

      <Section className="pt-14 md:pt-20">
        <PackCards />
        <p data-reveal className="mt-10 text-center text-sm text-muted-foreground">
          Envie de voir le CRM avant de choisir ? <Link href="/demos" className="font-medium text-primary hover:underline">Essayez nos démos métier</Link>.
          <br />
          Vous hésitez entre deux packs ? <Link href="/rendez-vous" className="font-medium text-primary hover:underline">Réservez l’audit gratuit</Link> : nous vous conseillons celui qui sert vraiment votre activité.
        </p>
      </Section>

      {/* Offre en abonnement, à venir */}
      <Section className="border-y bg-muted/40">
        <SectionHeading eyebrow="Bientôt disponible" title="Le CRM Blackstart en abonnement" intro="Votre propre espace en ligne, prêt à l’emploi, sans développement spécifique." />
        <div data-reveal="zoom" data-spot className="beam mx-auto max-w-4xl rounded-3xl border bg-card p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-sm text-muted-foreground">Inclus :</span>
            {saas.includes.map((f) => <Badge key={f} variant="outline" className="px-3 py-1 text-sm">{f}</Badge>)}
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {saas.plans.map((p, i) => (
              <li key={p.name} data-reveal style={{ '--d': i } as React.CSSProperties} className="rounded-2xl border bg-background p-6 text-center">
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">{p.name}</p>
                <p className="mt-3"><span className="num-grad text-4xl font-semibold tracking-tight">{p.price}</span><span className="text-muted-foreground"> / mois</span></p>
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden />
            Ouverture prochaine. <Link href="/contact" className="font-medium text-primary hover:underline">Être prévenu</Link>
          </p>
        </div>
      </Section>

      <div className="pt-16 md:pt-24"><Cta /></div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: `Offres ${site.name}`,
          itemListElement: packs.map((p) => ({
            '@type': 'Offer',
            name: `Pack ${p.name}`,
            description: p.features.join(', '),
            url: `${site.url}/offres#${p.slug}`,
            priceSpecification: [
              { '@type': 'PriceSpecification', price: p.setup, priceCurrency: 'EUR', name: 'Mise en place' },
              { '@type': 'UnitPriceSpecification', price: p.monthly, priceCurrency: 'EUR', unitCode: 'MON', name: 'Abonnement mensuel' },
            ],
          })),
        }}
      />
    </>
  );
}
