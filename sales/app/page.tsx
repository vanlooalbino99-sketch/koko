import Link from 'next/link';
import { ArrowRight, BrainCircuit, MessageSquareQuote, Target } from 'lucide-react';
import { Brand } from '@/components/brand';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { Button } from '@/components/ui/button';
import { getAuth, getI18n } from '@/lib/server/context';
import { voiceProviderFromEnv } from '@/lib/voice/provider';

const FEATURE_ICONS = [BrainCircuit, MessageSquareQuote, Target];

export default async function LandingPage() {
  const { t, locale } = await getI18n();
  const auth = await getAuth();
  const l = t.landing;
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Brand name={t.common.appName} sub={t.common.brand} />
        <div className="flex items-center gap-2">
          <LanguageSwitch locale={locale} label={t.common.language} />
          {auth ? (
            <Button asChild size="sm">
              <Link href="/dashboard">{t.nav.dashboard}</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">{t.auth.login}</Link>
            </Button>
          )}
        </div>
      </header>

      <main>
        <section className="glow">
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
            <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground">{l.badge}</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{l.title}</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">{l.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={auth ? '/dashboard' : '/signup'}>
                  {auth ? t.nav.dashboard : l.ctaSignup} <ArrowRight />
                </Link>
              </Button>
              {!auth && (
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">{l.ctaLogin}</Link>
                </Button>
              )}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{l.forWho}</p>
          </div>
        </section>

        <section aria-labelledby="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="features" className="text-2xl font-semibold tracking-tight">
            {l.featuresTitle}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {l.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Target;
              return (
                <div key={f.title} className="rounded-2xl border border-border bg-surface p-6">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="steps" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 id="steps" className="text-2xl font-semibold tracking-tight">
            {l.stepsTitle}
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {l.steps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-border bg-surface/60 p-6">
                <span className="font-mono text-sm text-teal">0{i + 1}</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-xl border border-warning/25 bg-warning/5 px-4 py-3 text-sm text-muted-foreground">{voiceProviderFromEnv() ? l.statusVoice : l.status}</p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">© 2026 Blackstart AI</div>
      </footer>
    </div>
  );
}
