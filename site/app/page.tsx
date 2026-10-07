import Link from 'next/link';
import { ArrowRight, Check, PhoneIncoming, Quote, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Section, SectionHeading } from '@/components/sections/section';
import { ServiceIcon } from '@/components/sections/service-icon';
import { Cta } from '@/components/sections/cta';
import { PackCards } from '@/components/sections/pricing';
import { Faq, faqJsonLd } from '@/components/sections/faq';
import { JsonLd } from '@/lib/seo';
import { CountUp } from '@/components/motion/count-up';
import { sectors, services, stats, steps, testimonials } from '@/lib/site';

export default function HomePage() {
  return (
    <>
      {/* Accroche */}
      <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:px-6 md:pt-24 md:pb-32">
        <div className="aurora pointer-events-none" aria-hidden><i /><i /><i /></div>
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="bg-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="voice pointer-events-none absolute inset-x-0 -bottom-6 opacity-45 [mask-image:linear-gradient(to_top,#000_30%,transparent)]" aria-hidden>
          {Array.from({ length: 64 }, (_, i) => <i key={i} style={{ '--i': i, '--k': ((i * 37) % 11) / 10 } as React.CSSProperties} />)}
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Badge variant="accent" className="rise mb-6 px-3 py-1 text-sm">
              <Sparkles aria-hidden /> Agence IA pour entreprises locales
            </Badge>
            <h1 className="words text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {['Ne', 'perdez', 'plus', 'jamais'].map((w, i) => <span key={w} style={{ '--i': i } as React.CSSProperties}>{w}&nbsp;</span>)}
              {['un', 'appel', 'client.'].map((w, i) => <span key={w} style={{ '--i': i + 4 } as React.CSSProperties} className="text-shine">{w}{i < 2 && <>&nbsp;</>}</span>)}
            </h1>
            <p style={{ '--d': 1 } as React.CSSProperties} className="rise mt-6 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl">
              Blackstart AI installe un assistant téléphonique qui décroche à chaque appel, qualifie la demande et prend les rendez-vous, même quand vous êtes sur le terrain.
            </p>
            <div style={{ '--d': 2 } as React.CSSProperties} className="rise mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group sheen glow-btn" data-magnet>
                <Link href="/rendez-vous">
                  Réserver un audit gratuit
                  <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-magnet>
                <Link href="/services">Découvrir nos services</Link>
              </Button>
            </div>
            <ul style={{ '--d': 3 } as React.CSSProperties} className="rise mt-8 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
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
            <div className="orbit -inset-10 hidden sm:block"><b /></div>
            <div className="orbit rev -inset-20 hidden opacity-70 lg:block"><b /></div>
            <div data-tilt className="relative">
            <div className="float beam relative rounded-2xl border bg-card/90 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="ring-pulse relative flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
                  <PhoneIncoming className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Appel entrant · 19:42</p>
                  <p className="text-xs text-muted-foreground">Décroché en 0,6 s par l’assistant</p>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Traité</span>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <p style={{ '--at': '0.5s' } as React.CSSProperties} className="msg w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">Bonjour, j’ai une fuite sous l’évier, vous pouvez passer cette semaine ?</p>
                <p style={{ '--at': '1.3s', '--until': '2.4s' } as React.CSSProperties} className="msg typing ml-auto w-fit rounded-2xl rounded-tr-sm bg-primary/15 px-3.5 py-3 text-primary"><i /><i /><i /></p>
                <p style={{ '--at': '2.4s' } as React.CSSProperties} className="msg ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-primary-foreground">Bien sûr. Je vous propose jeudi à 9 h ou vendredi à 14 h. Qu’est-ce qui vous arrange ?</p>
                <p style={{ '--at': '3.6s' } as React.CSSProperties} className="msg w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">Jeudi 9 h, parfait.</p>
              </div>
              <div style={{ '--at': '4.4s' } as React.CSSProperties} className="msg mt-5 rounded-xl border bg-background p-4">
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
        </div>
      </section>

      {/* Chiffres */}
      <section aria-label="Chiffres clés" className="border-y bg-muted/40 px-4 sm:px-6">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} data-reveal style={{ '--d': i } as React.CSSProperties} className="flex flex-col-reverse px-2 py-8 text-center">
              <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="num-grad text-3xl font-semibold tracking-tight sm:text-5xl"><CountUp value={s.value} /></dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Services */}
      <Section>
        <SectionHeading eyebrow="Services" title="Votre accueil client, automatisé de bout en bout" intro="Du premier appel au rendez-vous honoré, chaque étape est prise en charge. Vous gardez la main sur tout." />
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((s, i) => (
            <Card key={s.slug} data-reveal style={{ '--d': i } as React.CSSProperties} className="lift" data-spot>
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

      {/* Offres */}
      <Section className="pt-0 md:pt-0">
        <SectionHeading eyebrow="Offres" title="Un pack pour chaque étape de votre croissance" intro="Prix de lancement : payez une fois, ou choisissez l’abonnement mensuel sans rien avancer." />
        <PackCards compact />
        <p data-reveal className="mt-10 text-center">
          <Link href="/offres" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            Comparer toutes les offres <ArrowRight className="size-4" aria-hidden />
          </Link>
          <span className="mx-3 text-muted-foreground" aria-hidden>·</span>
          <Link href="/demos" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            Essayer une démo de CRM <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </Section>

      {/* Méthode */}
      <Section className="border-y bg-muted/40">
        <SectionHeading eyebrow="Méthode" title="Opérationnel en quatre étapes" />
        <ol className="relative grid gap-6 md:grid-cols-4">
          <li aria-hidden className="track hidden md:block" data-reveal />
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ '--d': i } as React.CSSProperties} className="relative">
              <span className="step-dot" style={{ '--d': i } as React.CSSProperties}>{i + 1}</span>
              <div className="lift mt-5 rounded-xl border bg-card p-6" data-spot>
              <span className="text-sm font-semibold text-primary">Étape {i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Témoignages */}
      <Section>
        <SectionHeading eyebrow="Ils nous font confiance" title="Des entreprises locales qui ne ratent plus rien" />
        <div className="marquee mb-12 overflow-hidden" data-reveal>
          <ul className="gap-2">
            {[...sectors, ...sectors].map((s, i) => (
              <li key={i} aria-hidden={i >= sectors.length || undefined}><Badge variant="outline" className="mx-1 px-3 py-1 text-sm whitespace-nowrap">{s}</Badge></li>
            ))}
          </ul>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={t.name} data-reveal style={{ '--d': i } as React.CSSProperties} className="lift flex flex-col rounded-xl border bg-card p-6" data-spot>
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
