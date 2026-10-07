import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHero, Section, SectionHeading } from '@/components/sections/section';
import { Cta } from '@/components/sections/cta';
import { pageMetadata } from '@/lib/seo';
import { demoCommon, demos } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Démos de CRM métier',
  description: 'Trois CRM de démonstration à essayer en ligne : agences immobilières, rénovation énergétique, courtage en assurance et crédit.',
  path: '/demos',
});

export default function DemosPage() {
  return (
    <>
      <PageHero eyebrow="Démos" title="Le CRM qui parle la langue de votre métier" intro="Trois démonstrations prêtes à l’emploi. Ouvrez-en une, mettez votre nom et votre couleur dans Réglages, et découvrez votre futur outil en direct." />

      <Section className="pt-14 md:pt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {demos.map((d, i) => (
            <article key={d.slug} id={d.slug} data-reveal data-spot style={{ '--d': i } as React.CSSProperties} className="lift flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-card">
              <a href={`/demos/${d.slug}.html`} className="group relative block aspect-[16/10] overflow-hidden border-b bg-muted" tabIndex={-1} aria-hidden>
                <Image src={`/demos/captures/${d.slug}.jpg`} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" loading="eager" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <Badge className="absolute top-3 left-3 shadow">{d.tag}</Badge>
              </a>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-semibold tracking-tight">{d.title}</h2>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">{d.why}</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {d.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{f}</li>
                  ))}
                </ul>
                <p className="mt-5 rounded-lg bg-muted/60 px-3 py-2 text-sm">Chiffre clé : <b>{d.kpi}</b></p>
                <Button asChild size="lg" className="sheen glow-btn mt-6 w-full" data-magnet>
                  <a href={`/demos/${d.slug}.html`} target="_blank" rel="noopener">
                    Ouvrir la démo <ArrowUpRight aria-hidden /><span className="sr-only">{d.title} (nouvel onglet)</span>
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
        <p data-reveal className="mt-8 text-center text-sm text-muted-foreground">Démonstrations : données fictives enregistrées dans votre navigateur. Bouton « Réinitialiser la démo » dans chaque CRM.</p>
      </Section>

      <Section className="border-y bg-muted/40">
        <SectionHeading eyebrow="Dans chacun des trois" title="Tout ce qu’un CRM métier doit faire, dès le premier jour" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoCommon.map((f, i) => (
            <div key={f.title} data-reveal data-spot style={{ '--d': i % 4 } as React.CSSProperties} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-10 text-center">
          <Link href="/offres" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            Voir les offres et les tarifs <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </Section>

      <div className="pt-16 md:pt-24"><Cta title="Votre CRM, à votre métier et à votre marque" text="Réservez un audit gratuit : nous partons de la démo la plus proche de votre activité et l’adaptons à votre équipe." /></div>
    </>
  );
}
