import Link from 'next/link';
import { ArrowRight, Check, PhoneIncoming, Quote, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section, SectionHeading } from '@/components/sections/section';
import { ServiceIcon } from '@/components/sections/service-icon';
import { Cta } from '@/components/sections/cta';
import { Faq, faqJsonLd } from '@/components/sections/faq';
import { JsonLd } from '@/lib/seo';
import { sectors, services, stats, steps, testimonials } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      {/* Accroche */}
      <section className="relative overflow-hidden px-4 pt-14 pb-16 sm:px-6 md:pt-24 md:pb-24">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Badge variant="accent" className="mb-6 px-3 py-1 text-sm">
              <Sparkles aria-hidden /> Agence IA pour entreprises locales
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Ne perdez plus jamais <span className="text-primary">un appel client</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl">
              Blackstart AI installe un assistant téléphonique qui décroche à chaque appel, qualifie la demande et prend les rendez-vous, même quand vous êtes sur le terrain.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/rendez-vous">
                  Réserver un audit gratuit
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">Découvrir nos services</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
              {['Audit de 20 min offert', 'Sans engagement', 'Opérationnel en 14 jours'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-success" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Illustration : un appel traité par l'assistant */}
          <div className="relative mx-auto w-full max-w-md" aria-hidden>
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="relative rounded-2xl border bg-card p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
                  <PhoneIncoming className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Appel entrant · 19:42</p>
                  <p className="text-xs text-muted-foreground">Décroché en 0,6 s par l’assistant</p>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Traité</span>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">Bonjour, j’ai une fuite sous l’évier, vous pouvez passer cette semaine ?</p>
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-primary-foreground">Bien sûr. Je vous propose jeudi à 9 h ou vendredi à 14 h. Qu’est-ce qui vous arrange ?</p>
                <p className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">Jeudi 9 h, parfait.</p>
              </div>
              <div className="mt-5 rounded-xl border bg-background p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Résumé envoyé par SMS</p>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">Client</dt><dd>M. Laurent, Lyon 3e</dd>
                  <dt className="text-muted-foreground">Besoin</dt><dd>Fuite sous évier</dd>
                  <dt className="text-muted-foreground">RDV</dt><dd className="font-medium text-primary">Jeudi · 9 h 00</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section aria-label="Chiffres clés" className="border-y bg-muted/40 px-4 sm:px-6">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-2 py-8 text-center">
              <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <Section>
        <SectionHeading eyebrow="Services" title="Votre accueil client, automatisé de bout en bout" intro="Du premier appel au rendez-vous honoré, chaque étape est prise en charge. Vous gardez la main sur tout." />
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s) => (
            <Card key={s.slug} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <ServiceIcon icon={s.icon} />
                <CardTitle className="mt-3 text-xl">{s.title}</CardTitle>
                <CardDescription className="text-base">{s.summary}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link href={`/services#${s.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  En savoir plus <span className="sr-only">sur {s.title}</span>
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Méthode */}
      <Section className="border-y bg-muted/40">
        <SectionHeading eyebrow="Méthode" title="Opérationnel en quatre étapes" />
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border bg-card p-6">
              <span className="text-sm font-semibold text-primary">Étape {i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Témoignages */}
      <Section>
        <SectionHeading eyebrow="Ils nous font confiance" title="Des entreprises locales qui ne ratent plus rien" />
        <ul className="mb-12 flex flex-wrap justify-center gap-2">
          {sectors.map((s) => (
            <li key={s}><Badge variant="outline" className="px-3 py-1 text-sm">{s}</Badge></li>
          ))}
        </ul>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-xl border bg-card p-6">
              <Quote className="size-6 text-primary" aria-hidden />
              <blockquote className="mt-4 flex-1 text-pretty">« {t.quote} »</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="block text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Questions fréquentes */}
      <Section className="pt-0 md:pt-0">
        <SectionHeading eyebrow="Questions fréquentes" title="Vous vous demandez sûrement…" />
        <Faq />
        <JsonLd data={faqJsonLd()} />
      </Section>

      <Cta />
    </>
  );
}
