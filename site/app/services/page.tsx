import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero, Section } from '@/components/sections/section';
import { ServiceIcon } from '@/components/sections/service-icon';
import { Cta } from '@/components/sections/cta';
import { JsonLd, pageMetadata } from '@/lib/seo';
import { services, site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Services',
  description: 'Assistant téléphonique IA, prise de rendez-vous automatique, relances clients et audit : les services de Blackstart AI pour les entreprises locales.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="Tout ce qu’il faut pour ne plus laisser filer un client" intro="Chaque service fonctionne seul ou avec les autres. Nous commençons toujours par un audit gratuit pour vous proposer uniquement ce qui sert votre activité." />
      <Section>
        <div className="space-y-6">
          {services.map((s, i) => (
            <article key={s.slug} id={s.slug} className="grid scroll-mt-24 gap-8 rounded-2xl border bg-card p-6 sm:p-10 md:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="flex items-center gap-3">
                  <ServiceIcon icon={s.icon} />
                  <span className="text-sm font-medium text-muted-foreground">0{i + 1}</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h2>
                <p className="mt-4 text-lg text-pretty text-muted-foreground">{s.description}</p>
                <p className="mt-6 font-semibold">{s.price}</p>
              </div>
              <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted/60 p-6">
                <ul className="space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full sm:w-fit">
                  <Link href={`/rendez-vous?service=${s.slug}`}>
                    En parler lors de l’audit <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Cta />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'Service', name: s.title, description: s.description, url: `${site.url}/services#${s.slug}`, provider: { '@id': `${site.url}/#organisation` }, areaServed: 'FR' },
          })),
        }}
      />
    </>
  );
}
