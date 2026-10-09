import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BarChart3, CalendarCheck, Check, MessageSquareText, Phone, PhoneCall, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/sections/section';
import { PackCards } from '@/components/sections/pricing';
import { Faq, faqJsonLd } from '@/components/sections/faq';
import { ContactForm } from '@/components/forms/contact-form';
import { GlassStage } from '@/components/glass/glass-stage';
import { JsonLd } from '@/lib/seo';
import { demos, sectors, services, site, steps, testimonials } from '@/lib/site';

const serviceIcons = { phone: PhoneCall, calendar: CalendarCheck, message: MessageSquareText, chart: BarChart3 } as const;

// Chiffres du chapitre « Résultats » (repris des chiffres clés du site).
const figures = [
  { value: 62, suffix: ' %', label: ['des appels manqués', 'ne rappellent jamais'] },
  { value: 14, suffix: ' j', label: ['pour être', 'opérationnel'] },
  { value: 20, suffix: ' min', label: ['d’audit offert pour', 'chiffrer vos pertes'] },
];

/** Titre de chapitre sur deux lignes, la seconde en gris : chaque ligne monte depuis son propre masque. */
function Title({ as: Tag = 'h2', lines }: { as?: 'h1' | 'h2'; lines: [string, string] }) {
  return (
    <Tag className="slide-title">
      <span className="line"><span className="line-inner">{lines[0]}</span></span>{' '}
      <span className="line muted"><span className="line-inner">{lines[1]}</span></span>
    </Tag>
  );
}

function Slides() {
  return (
    <>
      <section id="accueil" data-slide className="slide slide-1 active" aria-labelledby="titre-accueil">
        <p className="slide-eyebrow"><span className="eyebrow-dot" aria-hidden />Agence IA pour entreprises locales</p>
        <div id="titre-accueil"><Title as="h1" lines={['Ne perdez plus', 'un appel client.']} /></div>
        <p className="slide-desc">
          Blackstart AI installe un assistant téléphonique qui décroche à chaque appel, qualifie la demande et prend les rendez-vous, même quand vous êtes sur le terrain.
        </p>
        <div className="slide-actions">
          <Link href="/rendez-vous" className="pill-btn pill-solid">Réserver un audit gratuit <ArrowUpRight aria-hidden /></Link>
          <Link href="/offres" className="pill-btn">Voir les offres de lancement</Link>
        </div>
        <ul className="slide-checks">
          {['Audit de 20 min offert', 'Sans engagement', 'Opérationnel en 14 jours'].map((t) => (
            <li key={t}><Check aria-hidden />{t}</li>
          ))}
        </ul>
      </section>

      <section id="methode" data-slide className="slide slide-2" aria-label="Méthode">
        <Title lines={['Opérationnel', 'en 14 jours.']} />
        <p className="slide-desc">
          En 20 minutes d’audit, nous mesurons les appels et les demandes que vous perdez. Nous configurons ensuite l’assistant à votre image, avec vos horaires, vos services et vos tarifs, puis nous redirigeons votre ligne et formons votre équipe. Chaque mois, un point sur les appels traités et les rendez-vous pris.
        </p>
        <ol className="slide-steps">
          {steps.map((s, i) => (
            <li key={s.title}><span>{String(i + 1).padStart(2, '0')}</span>{s.title}</li>
          ))}
        </ol>
      </section>

      <section id="ce-que-nous-faisons" data-slide className="slide slide-3" aria-label="Services">
        <Title lines={['Votre accueil', 'automatisé.']} />
        <ul className="benefits">
          {services.map((s) => {
            const Icon = serviceIcons[s.icon];
            return (
              <li key={s.slug} className="benefit">
                <span className="benefit-icon" aria-hidden><Icon /></span>
                <p><Link href={`/services#${s.slug}`}><strong>{s.title}.</strong></Link> {s.summary}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="resultats" data-slide className="slide slide-4" aria-label="Résultats">
        <Title lines={['Ce que change', 'un appel décroché']} />
        <p className="slide-desc">Un client qui tombe sur la messagerie appelle le concurrent suivant. L’assistant, lui, décroche toujours.</p>
        <dl className="figures">
          {figures.map((f) => (
            <div key={f.suffix} className="figure">
              <dt><span className="figure-value" data-count={f.value} data-decimals={0}>{f.value}</span>{f.suffix}</dt>
              <dd>{f.label[0]}<br />{f.label[1]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

function After() {
  return (
    <>
      {/* Offres */}
      <Section id="offres" className="scroll-mt-16 pt-28 md:pt-40">
        <SectionHeading eyebrow="Offres de lancement" title="Un pack pour chaque étape de votre croissance" intro="Prix de lancement : payez une fois, ou choisissez l’abonnement mensuel sans rien avancer." />
        <PackCards compact />
        <p data-reveal className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-center">
          <Link href="/offres" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            Comparer toutes les offres <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href="/demos" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            Essayer une démo de CRM <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </Section>

      {/* Démos */}
      <Section className="pt-0 md:pt-0">
        <SectionHeading eyebrow="Démos" title="Le CRM qui parle la langue de votre métier" intro="Trois démonstrations à ouvrir tout de suite, avec des données fictives." />
        <div className="grid gap-5 md:grid-cols-3">
          {demos.map((d, i) => (
            <a key={d.slug} href={`/demos/${d.slug}.html`} target="_blank" rel="noopener" data-reveal data-spot style={{ '--d': i } as React.CSSProperties} className="glass-panel lift group flex flex-col overflow-hidden rounded-3xl">
              <span className="relative block aspect-[16/10] overflow-hidden">
                <Image src={`/demos/captures/${d.slug}.jpg`} alt={d.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105" />
              </span>
              <span className="flex flex-1 flex-col gap-2 p-6">
                <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{d.tag}</span>
                <span className="text-lg font-medium">{d.title}</span>
                <span className="text-sm text-pretty text-muted-foreground">{d.why}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-primary">
                  Ouvrir la démo <ArrowUpRight className="size-4" aria-hidden /><span className="sr-only">(nouvel onglet)</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* Témoignages */}
      <Section className="pt-0 md:pt-0">
        <SectionHeading eyebrow="Ils nous font confiance" title="Des entreprises locales qui ne ratent plus rien" />
        <div className="marquee mb-12 overflow-hidden" data-reveal>
          <ul className="gap-2">
            {[...sectors, ...sectors].map((s, i) => (
              <li key={i} aria-hidden={i >= sectors.length || undefined}><span className="glass-chip mx-1">{s}</span></li>
            ))}
          </ul>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={t.name} data-reveal style={{ '--d': i } as React.CSSProperties} className="glass-panel lift flex flex-col rounded-3xl p-7" data-spot>
              <Quote className="size-6 text-primary" aria-hidden />
              <blockquote className="mt-4 flex-1 text-pretty">« {t.quote} »</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-medium">{t.name}</span>
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

      {/* Contact : la carte du formulaire repose sur une dalle de verre 3D */}
      <section id="contact" className="glass-contact px-4 pt-10 pb-24 sm:px-6 md:pb-32" aria-labelledby="titre-contact">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-20">
          <div data-reveal>
            <p className="slide-eyebrow"><span className="eyebrow-dot" aria-hidden />Contact / 05</p>
            <h2 id="titre-contact" className="slide-title contact-title">
              <span className="line"><span className="line-inner">Réservons votre</span></span>{' '}
              <span className="line muted"><span className="line-inner">audit gratuit.</span></span>
            </h2>
            <p className="max-w-md text-lg font-light text-pretty text-muted-foreground">
              20 minutes pour chiffrer les appels que vous perdez. Choisissez un créneau, ou laissez-nous un message : nous vous rappelons sous 24 h ouvrées.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rendez-vous" className="pill-btn pill-solid">Choisir un créneau <ArrowUpRight aria-hidden /></Link>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="pill-btn"><Phone aria-hidden />{site.phoneDisplay}</a>
            </div>
            <a href={`mailto:${site.email}`} className="contact-mail mt-10">{site.email} <ArrowUpRight aria-hidden /></a>
          </div>
          <div data-glass-card className="contact-card" data-reveal>
            <p className="card-head"><span>Écrire à Blackstart</span><ArrowUpRight aria-hidden /></p>
            <ContactForm bare />
          </div>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <GlassStage slides={<Slides />} after={<After />} />
      <noscript>
        <style>{'.glass-root .glass-slides{position:static}.glass-root .slide{position:static;opacity:1;pointer-events:auto}.glass-root .scroll-stage,.glass-root .story-progress{display:none}.glass-root .line-inner,.glass-root .slide-desc,.glass-root .benefit,.glass-root .figure{opacity:1;transform:none;filter:none}'}</style>
      </noscript>
    </>
  );
}
