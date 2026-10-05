import { HeartHandshake, Target, Eye } from 'lucide-react';
import { PageHero, Section, SectionHeading } from '@/components/sections/section';
import { Cta } from '@/components/sections/cta';
import { pageMetadata } from '@/lib/seo';
import { site, stats, values } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'À propos',
  description: 'Blackstart AI aide les entreprises locales à ne plus perdre de clients grâce à l’intelligence artificielle. Notre histoire, notre mission et nos valeurs.',
  path: '/a-propos',
});

const ICONS = [Target, HeartHandshake, Eye];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="À propos" title="L’IA au service des entreprises qui font tourner la ville" intro={`${site.name} est née d’un constat simple : les artisans, cabinets et agences perdent chaque semaine des clients parce que personne n’a pu décrocher.`} />
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div className="space-y-5 text-lg text-pretty text-muted-foreground">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Notre histoire</h2>
            <p>Nous avons passé des centaines d’heures au téléphone avec des entreprises locales. Partout, le même problème : un plombier sous un évier, une secrétaire déjà en ligne, une agence fermée le samedi… et un client qui appelle le concurrent suivant.</p>
            <p>Nous avons donc construit ce que nous aurions voulu leur offrir : un accueil téléphonique toujours disponible, qui parle comme eux, qui connaît leurs services et qui remplit leur agenda.</p>
            <p>Aujourd’hui, nous installons, réglons et suivons ces assistants pour chaque client, avec une équipe joignable et des résultats mesurés chaque mois.</p>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-xl border bg-card p-6">
                <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
      <Section className="border-y bg-muted/40">
        <SectionHeading eyebrow="Nos valeurs" title="Ce qui guide notre travail" />
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((v, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={v.title} className="rounded-xl border bg-card p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Icon className="size-5" aria-hidden /></span>
                <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-muted-foreground">{v.text}</p>
              </div>
            );
          })}
        </div>
      </Section>
      <Section>
        <SectionHeading eyebrow="Où nous trouver" title={`Basés à ${site.address.city}, présents partout en France`} intro="Les audits et le suivi se font par téléphone ou en visio. Nous nous déplaçons volontiers pour les installations en région lyonnaise." />
      </Section>
      <Cta />
    </>
  );
}
