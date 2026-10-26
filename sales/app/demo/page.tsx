import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { enterDemoAction } from '@/app/actions/auth';
import type { VoxStatic } from '@/components/vox/vox-screen';
import { DEMO_CALL } from '@/lib/demo/script';
import { demoSpaceEnabled } from '@/lib/demo/space';
import type { Difficulty } from '@/lib/domain';
import { CATALOG } from '@/lib/scenarios/catalog';
import { getI18n } from '@/lib/server/context';
import { DemoCallScreen } from './demo-call';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.demo.metaTitle, description: t.demo.metaDescription };
}

// Démo publique, sans compte : l'écran d'appel rejoue un appel à froid écrit à l'avance (voix de synthèse,
// annoncé comme tel), puis la page montre le rapport et le tableau de bord, avec des données d'exemple.
export default async function DemoPage() {
  const { t, locale } = await getI18n();
  const d = t.demo;
  const call = DEMO_CALL[locale];
  const entry = CATALOG.find((e) => e.slug === `cold-call-ai-receptionist-${locale}`)!;
  const { meta, content } = entry;
  const data: VoxStatic = {
    appName: t.common.appName,
    nav: [],
    more: [],
    recents: [],
    user: { name: call.seller, plan: d.badge },
    scenario: {
      id: 'demo',
      family: meta.family,
      familyLabel: t.enums.family[meta.family],
      language: locale,
      estimatedMinutes: meta.estimatedMinutes,
      objective: content.objective,
      context: content.context,
      chips: [
        t.enums.difficulty[meta.difficulty as Difficulty],
        t.enums.personality[content.prospect.personality],
        t.enums.decisionPower[content.prospect.decisionPower],
      ],
      prospect: {
        name: content.prospect.name,
        role: content.prospect.role,
        company: content.prospect.company,
        publicProfile: content.prospect.publicProfile,
      },
      offer: { name: content.offer.name, price: content.offer.price },
      memo: { steps: t.call.outline[meta.family], criteria: content.successCriteria },
    },
    voiceName: null,
    remaining: null,
    blocked: null,
    locale,
    labels: t.call,
    links: { home: '/', live: '/demo', scenario: '/', family: '/demo', newSession: '/signup', quit: '/' },
    demo: { badge: d.badge },
  };

  const [during, after, weekly] = d.tour;
  return (
    <>
      <DemoCallScreen data={data} call={call} lang={locale} text={d} />

      <section aria-labelledby="tour-title" className="theme-vox border-t border-border bg-background px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 id="tour-title" className="text-[28px] font-medium tracking-tight">
            {d.tourTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{d.tourText}</p>

          <div className="mt-8 rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium">{during.title}</h3>
            <p className="mt-1 text-[14px] text-muted-foreground">{during.text}</p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <figure className="flex flex-col rounded-xl border border-border bg-surface p-5">
              <h3 className="font-medium">{after.title}</h3>
              <p className="mt-1 text-[14px] text-muted-foreground">{after.text}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo/rapport.webp" alt={d.reportAlt} width={1440} height={1374} loading="lazy" className="mt-5 w-full rounded-lg border border-border" />
              <figcaption className="mt-2 text-[12px] text-muted-foreground">{d.sample}</figcaption>
            </figure>
            <figure className="flex flex-col rounded-xl border border-border bg-surface p-5">
              <h3 className="font-medium">{weekly.title}</h3>
              <p className="mt-1 text-[14px] text-muted-foreground">{weekly.text}</p>
              <video
                src="/demo/tableau-de-bord.mp4"
                poster="/demo/tableau-de-bord.jpg"
                aria-label={d.dashboardLabel}
                width={1168}
                height={864}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="mt-5 w-full rounded-lg border border-border"
              />
              <figcaption className="mt-2 text-[12px] text-muted-foreground">{d.sample}</figcaption>
            </figure>
          </div>

          {demoSpaceEnabled() && (
            <form action={enterDemoAction} className="mt-4 flex flex-col items-start gap-4 rounded-xl border border-primary/40 bg-primary/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-[14px] text-muted-foreground">{d.exploreText}</p>
              <button className="vox-gradient inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-[14px] font-medium text-white hover:brightness-110">
                <LayoutDashboard className="size-4" aria-hidden="true" />
                {d.explore}
              </button>
            </form>
          )}

          <div className="mt-12 flex flex-col items-start gap-4 rounded-xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[22px] font-medium tracking-tight">{d.ctaTitle}</h2>
              <p className="mt-1 text-muted-foreground">{d.ctaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-[14px] hover:bg-surface-2">
                {d.home}
              </Link>
              <Link
                href="/signup"
                className="vox-gradient inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset] hover:brightness-110"
              >
                {d.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
