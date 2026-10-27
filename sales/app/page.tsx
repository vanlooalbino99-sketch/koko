import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  AudioLines,
  ChartColumnIncreasing,
  ChartPie,
  Check,
  CirclePlay,
  Clock,
  Goal,
  House,
  Lightbulb,
  Mic,
  MicOff,
  Phone,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { setLocaleAction } from '@/app/actions/auth';
import { DEFAULT_PRICES, PAID_PLANS, RECOMMENDED_PLAN, currencyFor, planLimits, type Plan } from '@/lib/billing/plans';
import { LOCALES, type Locale } from '@/lib/domain';
import { format } from '@/lib/i18n/format';
import type { Dictionary } from '@/lib/i18n';
import { getAuth, getI18n } from '@/lib/server/context';
import { cn } from '@/lib/utils';

// Accueil public, copié de la maquette d'albino : en-tête, accroche, aperçu incliné de l'écran d'appel,
// les trois fonctionnalités, puis le fonctionnement et les offres (montants de lib/billing/plans).

const FEATURE_ICONS: LucideIcon[] = [Mic, Goal, ChartColumnIncreasing];
const PREVIEW_ICONS: LucideIcon[] = [House, Sparkles, Users, Clock, ChartPie, Settings];

export default async function LandingPage() {
  const { t, locale } = await getI18n();
  const auth = await getAuth();
  const l = t.landing;
  const startHref = auth ? '/dashboard' : '/signup';
  return (
    <div className="landing min-h-dvh overflow-x-hidden">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-[1680px] items-center gap-6 px-4 py-4 sm:px-8 lg:px-10 2xl:px-[90px]">
          <Link href="/" className="flex shrink-0 items-center gap-4" aria-label={`${t.common.brand} ${t.common.appName}`}>
            <LandingMark />
            <span className="text-[22px] font-semibold tracking-tight text-white">
              BlackStart <span className="landing-accent-text">AI</span>
            </span>
            <span className="hidden h-7 w-px bg-white/15 sm:block" aria-hidden="true" />
            <span className="hidden text-lg font-medium text-white/90 sm:block">{t.common.appName}</span>
          </Link>
          <nav aria-label={l.nav.label} className="ml-auto hidden items-center gap-8 text-[15px] font-medium whitespace-nowrap text-white/90 xl:flex 2xl:mr-auto 2xl:ml-[84px] 2xl:gap-12">
            <a href="#fonctionnalites" className="transition-colors hover:text-white">
              {l.nav.features}
            </a>
            <a href="#comment-ca-marche" className="transition-colors hover:text-white">
              {l.nav.how}
            </a>
            <a href="#tarifs" className="transition-colors hover:text-white">
              {l.nav.pricing}
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-3 xl:ml-0">
            {!auth && (
              <Link href="/login" className="hidden text-sm font-medium whitespace-nowrap text-white/70 transition-colors hover:text-white 2xl:block">
                {l.ctaLogin}
              </Link>
            )}
            <LandingLanguage locale={locale} label={t.common.language} />
            <Link href={auth ? '/dashboard' : '/demo'} className="landing-btn hidden h-12 px-5 text-[15px] sm:inline-flex">
              {auth ? t.nav.dashboard : l.ctaTry} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="landing-glow" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1680px] items-center gap-14 px-4 pt-14 pb-10 sm:px-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-10 lg:px-10 2xl:px-[90px] lg:pt-16">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-[#7c6cff]/45 bg-[#7c6cff]/10 px-4 py-2 text-[13px] font-semibold tracking-wide text-white uppercase">
                <AudioLines className="size-4 text-[#9d8cff]" aria-hidden="true" />
                {l.badge}
              </p>
              <h1 className="mt-6 text-[44px] leading-[1.02] font-bold tracking-[-0.035em] text-white sm:text-[58px] xl:text-[66px]">
                {l.titleStart}
                <span className="landing-accent-text">{l.titleAccent}</span>
              </h1>
              <p className="mt-7 max-w-[660px] text-lg leading-[1.65] text-white/75 sm:text-[19px]">{l.subtitle}</p>
              <div className="mt-9 flex flex-wrap gap-5">
                <Link href={startHref} className="landing-btn h-[58px] px-7 text-[17px]">
                  {auth ? t.nav.dashboard : l.ctaStart} <ArrowRight className="size-[18px]" aria-hidden="true" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-[58px] items-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.02] px-7 text-[17px] font-semibold text-[#a99cff] transition-colors hover:border-white/30 hover:bg-white/[0.05]"
                >
                  <CirclePlay className="size-5" aria-hidden="true" /> {l.ctaDemo}
                </Link>
              </div>
              <p className="mt-7 flex items-center gap-3 text-[15px] text-white/80">
                <Users className="size-5 text-[#8f82ff]" aria-hidden="true" />
                {l.forWho}
              </p>
            </div>
            <CallPreview t={t} />
          </div>

          <div id="fonctionnalites" className="relative mx-auto max-w-[1680px] scroll-mt-6 px-4 pb-16 sm:px-8 lg:px-10 2xl:px-[90px]">
            <h2 className="sr-only">{l.featuresTitle}</h2>
            <ul className="grid rounded-2xl border border-white/[0.09] bg-[#0b0f1d]/80 px-2 py-2 md:grid-cols-3 md:py-7">
              {l.features.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? Target;
                return (
                  <li
                    key={f.title}
                    className={cn('flex gap-6 px-6 py-6 md:py-1 md:pr-8 md:pl-8', i > 0 && 'border-t border-white/[0.08] md:border-t-0 md:border-l')}
                  >
                    <span className="landing-tile grid size-14 shrink-0 place-items-center rounded-xl">
                      <Icon className="size-7 text-white" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-lg font-semibold text-white">{f.title}</span>
                      <span className="mt-2 block text-[15px] leading-relaxed text-white/65">{f.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="comment-ca-marche" aria-labelledby="steps" className="mx-auto max-w-[1680px] scroll-mt-6 px-4 pb-20 sm:px-8 lg:px-10 2xl:px-[90px]">
          <h2 id="steps" className="text-2xl font-semibold tracking-tight text-white">
            {l.stepsTitle}
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {l.steps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-white/[0.09] bg-[#0b0f1d]/80 p-6">
                <span className="font-mono text-sm text-[#a99cff]">0{i + 1}</span>
                <span className="text-[15px] text-white/85">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <Pricing t={t} locale={locale} href={auth ? '/billing' : '/signup'} />
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-white/50 sm:px-8 lg:px-10 2xl:px-[90px]">
          <span>© 2026 Blackstart AI</span>
          {!auth && (
            <Link href="/login" className="hover:text-white">
              {l.ctaLogin}
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}

// Monogramme « B » de la maquette, en dégradé violet.
function LandingMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-10 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id="landing-b" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="0.45" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#5b3bd6" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        d="M6 3h16.5a9 9 0 0 1 6.6 15.1A10 10 0 0 1 23.5 37H6V3Zm9 7.5v6h6a3 3 0 0 0 0-6h-6Zm0 13v6.5h7.2a3.25 3.25 0 0 0 0-6.5H15Z"
        fill="url(#landing-b)"
      />
    </svg>
  );
}

function LandingLanguage({ locale, label }: { locale: Locale; label: string }) {
  return (
    <form action={setLocaleAction} className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-1" aria-label={label}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="submit"
          name="locale"
          value={code}
          aria-pressed={code === locale}
          className={cn(
            'h-10 rounded-lg px-4 text-[15px] font-semibold uppercase transition-colors',
            code === locale ? 'bg-[#3d5afe] text-white shadow-[0_6px_18px_-8px_#3d5afe]' : 'text-white/70 hover:text-white',
          )}
        >
          {code}
        </button>
      ))}
    </form>
  );
}

// Aperçu incliné de l'écran d'appel (illustration de la maquette, sans interaction).
function CallPreview({ t }: { t: Dictionary }) {
  const p = t.landing.preview;
  const score = 82;
  return (
    <div className="landing-stage" role="img" aria-label={p.label}>
      <div className="landing-screen" aria-hidden="true">
        <aside className="flex flex-col gap-1.5 border-r border-white/[0.07] pr-3 max-sm:hidden">
          <span className="mb-4 flex items-center gap-1.5 px-1 text-[12.5px] font-semibold whitespace-nowrap text-white">
            <LandingMark className="size-5" />
            <span>
              BlackStart <span className="landing-accent-text">AI</span>
            </span>
          </span>
          {p.nav.map((label, i) => {
            const Icon = PREVIEW_ICONS[i] ?? House;
            return (
              <span
                key={label}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-[10.5px] text-white/70',
                  i === 1 && 'bg-[#4f46e5]/45 font-semibold text-white shadow-[inset_0_0_0_1px_rgb(129_140_248/0.35)]',
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </span>
            );
          })}
        </aside>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between text-[12px] font-semibold text-white">
              {p.live}
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-white/90">
                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                08:24
              </span>
            </div>
            <div className="mt-3 rounded-lg border border-white/[0.07] bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(140deg,#f0abfc,#8b5cf6_55%,#312e81)] text-[12px] font-bold text-white ring-2 ring-white/15">
                  SM
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-white">{p.prospect}</span>
                  <span className="block text-[10px] text-white/55">{p.role}</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-[auto_auto_1fr] items-start gap-x-4 text-[9px] text-white/55">
                <span>{p.difficulty}</span>
                <span>{p.budget}</span>
                <span>{p.objections}</span>
                <span className="mt-1.5 w-fit rounded-md bg-[#5b4cf0] px-2 py-1 text-[9px] font-semibold text-white">{p.level}</span>
                <span className="mt-1.5 w-fit rounded-md bg-white/[0.06] px-2 py-1 text-[9.5px] font-semibold text-white">{p.budgetValue}</span>
                <span className="mt-1.5 flex flex-wrap gap-1">
                  {p.objectionList.map((o) => (
                    <span key={o} className="rounded-md bg-[#3d4fd6]/40 px-1.5 py-1 text-[8.5px] text-white/90">
                      {o}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Wave side="left" />
              <span className="landing-mic grid size-16 shrink-0 place-items-center rounded-full">
                <Mic className="size-7 text-white" />
              </span>
              <Wave side="right" />
            </div>
            <p className="mt-2 text-center text-[9.5px] text-white/60">{p.live} • 08:24</p>
            <div className="mx-auto mt-4 mb-1 flex w-fit items-center gap-6 rounded-full bg-white/[0.04] px-6 py-2">
              <MicOff className="size-4 text-white/70" />
              <span className="grid size-9 place-items-center rounded-full bg-[#f43f5e] shadow-[0_6px_18px_-6px_#f43f5e]">
                <Phone className="size-4 rotate-[135deg] text-white" />
              </span>
              <SlidersHorizontal className="size-4 text-white/70" />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-semibold text-white">{p.score}</span>
              <span className="relative grid size-[78px] place-items-center">
                <svg viewBox="0 0 80 80" className="absolute inset-0 size-full -rotate-90">
                  <circle cx="40" cy="40" r="33" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="33"
                    fill="none"
                    stroke="url(#landing-ring)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(2 * Math.PI * 33 * score) / 100} ${2 * Math.PI * 33}`}
                  />
                  <defs>
                    <linearGradient id="landing-ring" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-[19px] font-bold text-white">
                  {score}
                  <span className="text-[9px] font-medium text-white/60">/100</span>
                </span>
              </span>
            </div>
            <ul className="mt-2 space-y-2.5">
              {p.skills.map((s, i) => (
                <li key={s.label}>
                  <span className="flex justify-between text-[10px] font-medium text-white/85">
                    {s.label}
                    <span>{s.value}</span>
                  </span>
                  <span className="mt-1 block h-1.5 rounded-full bg-white/[0.07]">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${s.value}%`,
                        background: ['linear-gradient(90deg,#34d399,#2dd4bf)', 'linear-gradient(90deg,#3b82f6,#6366f1)', 'linear-gradient(90deg,#6366f1,#a855f7)'][i],
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-white">
              <Lightbulb className="size-3.5 text-amber-300" />
              {p.feedbackTitle}
              <X className="ml-auto size-3 text-white/40" />
            </span>
            <ul className="mt-2 space-y-1.5">
              {p.feedback.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[9px] text-white/75">
                  <Check className="size-3 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Onde vocale de part et d'autre du micro : barres de hauteurs fixes, plus hautes près du centre.
function Wave({ side }: { side: 'left' | 'right' }) {
  const bars = Array.from({ length: 22 }, (_, i) => {
    const k = side === 'left' ? i : 21 - i;
    return Math.round(4 + (k / 21) * 16 + Math.abs(Math.sin(i * 1.7)) * 14 * (0.4 + k / 35));
  });
  return (
    <span className="flex h-12 items-center gap-[2px]">
      {bars.map((h, i) => (
        <span key={i} className="landing-wave w-[2px] rounded-full" style={{ height: h, animationDelay: `${(i % 7) * 0.12}s` } as CSSProperties} />
      ))}
    </span>
  );
}

function Pricing({ t, locale, href }: { t: Dictionary; locale: Locale; href: string }) {
  const b = t.billing;
  const currency = currencyFor(locale);
  const money = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: currency.toUpperCase() });
  const plans: Plan[] = ['free', ...PAID_PLANS];
  return (
    <section id="tarifs" aria-labelledby="pricing" className="mx-auto max-w-[1680px] scroll-mt-6 px-4 pb-24 sm:px-8 lg:px-10 2xl:px-[90px]">
      <h2 id="pricing" className="text-2xl font-semibold tracking-tight text-white">
        {t.landing.pricingTitle}
      </h2>
      <p className="mt-2 text-[15px] text-white/65">{t.landing.pricingSubtitle}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const limits = planLimits(plan);
          const recommended = plan === RECOMMENDED_PLAN;
          const features =
            plan === 'free'
              ? [format(b.featureTrial, { calls: limits.trialCalls ?? 0, minutes: limits.maxCallMinutes }), format(b.featureScenarios, { n: limits.privateScenarios ?? 0 })]
              : [
                  format(plan === 'premium' ? b.featureMinutesShared : b.featureMinutes, { n: limits.monthlyCredits }),
                  b.featureAnalysis,
                  limits.privateScenarios === null ? b.featureScenariosUnlimited : format(b.featureScenarios, { n: limits.privateScenarios }),
                  ...(limits.teamSpace ? [format(b.featureMembers, { n: limits.seats })] : []),
                ];
          return (
            <div
              key={plan}
              className={cn(
                'flex flex-col rounded-2xl border bg-[#0b0f1d]/80 p-6',
                recommended ? 'border-[#7c6cff]/70 shadow-[0_24px_60px_-30px_#7c6cff]' : 'border-white/[0.09]',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-lg font-semibold text-white">{t.enums.plan[plan]}</span>
                {recommended && <span className="rounded-full bg-[#7c6cff]/20 px-2.5 py-1 text-xs font-semibold text-[#c4b8ff]">{b.recommended}</span>}
              </span>
              <span className="mt-1 text-sm text-white/60">{b.planDescription[plan]}</span>
              <span className="mt-5 text-3xl font-bold tracking-tight text-white">
                {plan === 'free' ? b.free : money.format(DEFAULT_PRICES[plan].amount / 100)}
                {plan !== 'free' && <span className="ml-1 text-sm font-medium text-white/55">{b.perMonth}</span>}
              </span>
              <ul className="mt-5 flex-1 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-white/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#3fe0b5]" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={href} className={cn('mt-6 h-11 justify-center text-sm', recommended ? 'landing-btn' : 'landing-btn-ghost')}>
                {t.landing.pricingCta}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mt-4 rounded-xl border border-white/[0.09] bg-[#0b0f1d]/60 px-5 py-4 text-sm text-white/70">
        <span className="font-semibold text-white">
          {b.enterprise.name} · {b.enterprise.price}
        </span>{' '}
        — {b.enterprise.description}
      </p>
    </section>
  );
}
