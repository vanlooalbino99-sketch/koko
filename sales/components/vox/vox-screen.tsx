'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  AudioWaveform,
  Bookmark,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Disc3,
  Ellipsis,
  Gauge,
  IdCard,
  LayoutDashboard,
  Loader2,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Pause,
  Play,
  Radio,
  Settings,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import { format } from '@/lib/i18n/format';
import type { Locale } from '@/lib/domain';
import type { DrillRequest } from '@/lib/simulations/service';
import {
  annotate,
  coachTip,
  PACE_TARGET,
  pace,
  paceBand,
  QUESTION_TARGET,
  TALK_TARGET,
  talkBand,
  talkRatio,
  type FillerCount,
  type LiveState,
  type Piece,
  type Signal,
} from '@/lib/live/speech';
import { cn } from '@/lib/utils';
import type { Tone } from '@/lib/voice/emotion';

// ─── Données de l'écran ──────────────────────────────────────────────────────

export type CallLabels = Dictionary['call'];

const NAV_ICONS = {
  live: Radio,
  scenarios: ClipboardList,
  history: Disc3,
  dashboard: LayoutDashboard,
  new: IdCard,
  settings: Settings,
  team: Users,
  billing: CreditCard,
  admin: Gauge,
};
export type VoxNavItem = { href: string; label: string; icon: keyof typeof NAV_ICONS };
export type VoxRecent = { id: string; title: string; meta: string };

// Ce que le serveur fournit : rien de secret (ni faits cachés, ni conditions de fin du scénario).
export type VoxStatic = {
  appName: string;
  nav: VoxNavItem[];
  more: VoxNavItem[];
  recents: VoxRecent[];
  user: { name: string; plan: string };
  scenario: {
    id: string;
    family: string;
    familyLabel: string;
    language: Locale;
    estimatedMinutes: number;
    objective: string;
    context: string;
    chips: string[];
    prospect: { name: string; role: string; company: string; publicProfile: string };
    offer: { name: string; price: string };
    memo: { steps: string[]; criteria: string[] };
  };
  // Exercice ciblé ou reprise après une coupure : ce que le prospect dira en décrochant et le conseil à appliquer.
  drill?: { ref: DrillRequest; kind: 'moment' | 'resume'; prospectLine: string; said?: string; better?: string } | null;
  voiceName: string | null;
  remaining: string | null;
  // L'appel ne peut pas démarrer (clé absente, minutes épuisées) : message et lien éventuel.
  blocked: { message: string; link?: { href: string; label: string } } | null;
  locale: Locale;
  labels: CallLabels;
  // Démo publique (/demo) : liens vers des pages ouvertes à tous et bandeau qui annonce un appel scénarisé.
  links?: { home: string; live: string; scenario: string; family: string; newSession: string; quit: string };
  demo?: { badge: string };
};

export type VoxPhase = 'loading' | 'idle' | 'starting' | 'live' | 'ending';
export type VoxLine = { id: number; role: 'seller' | 'prospect'; text: string; at: number; tones?: Tone[] };

// Ton du prospect sur une réplique (« hausse le ton », « soupire »…) : le plus fort seulement.
export function ToneTag({ tones, labels }: { tones?: Tone[]; labels: Record<Tone, string> }) {
  const tone = tones?.[0];
  if (!tone) return null;
  const hot = tone === 'shouts' || tone === 'angry';
  return <span className={cn('mr-1.5 text-[12.5px] italic', hot ? 'text-[#ef6f87]' : 'text-muted-foreground/80')}>({labels[tone]})</span>;
}
export type VoxSignal = Signal & { end: number };
export type WaveSample = { v: number; who: 's' | 'p' | '-' };

export type VoxLive = {
  phase: VoxPhase;
  elapsed: number;
  lines: VoxLine[];
  signals: VoxSignal[];
  markers: number[];
  stats: LiveState;
  fillers: FillerCount[];
  db: number | null;
  khz: number | null;
  isSpeaking: boolean;
  isMuted: boolean;
  volumeOn: boolean;
  interrupted: boolean;
  error?: string;
  // Message affiché à la place de « Prêt à appeler » quand l'écran est au repos (fin de la démo, par exemple).
  notice?: string;
  // L'appel a coupé après la connexion : reprendre tout de suite ou lire le rapport de la partie enregistrée.
  dropped?: { resumeHref: string; reportHref: string };
};

// Lecture du son en continu, sans re-rendu React : niveau global, spectre et historique de l'appel.
export type VoxMeter = { level(): number; bins(): Uint8Array | null; history(): WaveSample[] };

export type VoxHandlers = {
  start(): void;
  hangUp(): void;
  toggleMute(): void;
  toggleVolume(): void;
  mark(): void;
};

export const EMPTY_STATS: LiveState = {
  elapsed: 0,
  sellerSeconds: 0,
  prospectSeconds: 0,
  sellerWords: 0,
  openQuestions: 0,
  closedQuestions: 0,
  fillers: 0,
  concessions: 0,
};

export const SAMPLE_SECONDS = 0.25;

const TONE = { good: '#2fd8a8', warn: '#f5b544', bad: '#f2716b' } as const;

function mmss(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function mss(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ─── Écran ───────────────────────────────────────────────────────────────────

export function VoxScreen({
  data,
  live,
  meter,
  on,
}: {
  data: VoxStatic;
  live: VoxLive;
  meter?: VoxMeter;
  on: VoxHandlers;
}) {
  const asked = live.stats.openQuestions + live.stats.closedQuestions;
  return (
    <div data-phase={live.phase} className="theme-vox relative min-h-dvh lg:grid lg:grid-cols-[234px_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto] xl:h-dvh xl:grid-cols-[234px_minmax(0,1fr)_336px] xl:grid-rows-[auto_minmax(0,1fr)] xl:overflow-hidden">
      <Sidebar data={data} asked={asked} />
      <Header data={data} />
      <main id="contenu" className="flex min-h-0 flex-col lg:col-start-2 xl:row-start-2">
        <div className="relative flex min-h-0 flex-1 flex-col px-4 pt-6 pb-3">
          <Brief data={data} />
          <Visualizer data={data} live={live} meter={meter} />
          <Transcript data={data} live={live} />
        </div>
        <Controls data={data} live={live} on={on} />
      </main>
      <Performance data={data} live={live} />
    </div>
  );
}

// ─── Colonne de gauche ───────────────────────────────────────────────────────

function NavLink({ item, active }: { item: VoxNavItem; active?: boolean }) {
  const Icon = NAV_ICONS[item.icon];
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-2.5 py-[7px] text-[14px] transition-colors',
        active ? 'bg-surface-2 text-foreground ring-1 ring-white/5' : 'text-foreground/85 hover:bg-surface-2/70 hover:text-foreground',
      )}
    >
      <Icon className="size-4 text-foreground/80" aria-hidden="true" />
      {item.label}
    </Link>
  );
}

function Sidebar({ data, asked }: { data: VoxStatic; asked: number }) {
  const c = data.labels;
  const shown = Math.min(asked, QUESTION_TARGET);
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border lg:row-span-3 lg:flex xl:row-span-2">
      <Link href={data.links?.home ?? '/dashboard'} className="flex h-[70px] shrink-0 items-center gap-2 px-[18px]">
        <AudioWaveform className="size-7 text-teal" strokeWidth={1.75} aria-hidden="true" />
        <span className="text-[19px] font-medium tracking-tight">{data.appName}</span>
      </Link>
      <nav className="grid gap-0.5 px-4 pt-4">
        <NavLink item={{ href: data.links?.live ?? `/scenarios/${data.scenario.id}/call`, label: c.navLive, icon: 'live' }} active />
        {data.nav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        {data.more.length > 0 && (
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg px-2.5 py-[7px] text-[14px] text-foreground/85 hover:bg-surface-2/70 hover:text-foreground">
              <Ellipsis className="size-4 text-foreground/80" aria-hidden="true" />
              {c.navMore}
            </summary>
            <div className="mt-1 grid gap-0.5 rounded-lg border border-border bg-surface p-1">
              {data.more.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </details>
        )}
      </nav>

      <details open className="group mt-9 min-h-0 flex-1 overflow-y-auto px-4">
        <summary className="flex cursor-pointer list-none items-center justify-between px-0 pb-3 text-[14px] text-muted-foreground">
          {c.recent}
          <ChevronDown className="size-4 -rotate-90 transition-transform group-open:rotate-0" aria-hidden="true" />
        </summary>
        <ul className="flex flex-col gap-1">
          {data.recents.length === 0 && <li className="px-2.5 text-[13px] text-muted-foreground">{c.recentEmpty}</li>}
          {data.recents.map((r) => (
            <li key={r.id} className="min-w-0">
              <Link href={`/simulations/${r.id}`} className="block rounded-lg px-2.5 py-1.5 hover:bg-surface-2/70">
                <span className="block truncate text-[14px] text-foreground/95">{r.title}</span>
                <span className="block truncate text-[12px] text-muted-foreground">{r.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </details>

      <div className="px-4 pb-4">
        <section aria-labelledby="arc-title" className="rounded-xl border border-border bg-surface p-4" title={format(c.questionsHint, { n: QUESTION_TARGET })}>
          <div className="flex items-center justify-between text-[12px] tracking-wide uppercase">
            <h2 id="arc-title" className="text-muted-foreground">
              {c.questionsTitle}
            </h2>
            <span className="text-muted-foreground tabular-nums">
              {asked}/{QUESTION_TARGET}
            </span>
          </div>
          <ol className="mt-4 grid grid-cols-5" aria-label={format(c.questionsHint, { n: QUESTION_TARGET })}>
            {Array.from({ length: QUESTION_TARGET }, (_, i) => {
              const done = i < shown;
              const next = i === shown;
              return (
                <li key={i} className="relative grid justify-items-center gap-1.5">
                  {i < QUESTION_TARGET - 1 && (
                    <span aria-hidden="true" className={cn('absolute top-[5px] left-1/2 h-px w-full', i < shown ? 'bg-white/80' : 'bg-white/15')} />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative z-10 size-[11px] rounded-full',
                      done ? 'bg-white' : next ? 'border-[1.5px] border-white bg-surface' : 'border border-white/20 bg-surface',
                    )}
                  />
                  <span className={cn('text-[10px] tabular-nums', done || next ? 'text-foreground/90' : 'text-muted-foreground/50')}>Q{i + 1}</span>
                </li>
              );
            })}
          </ol>
        </section>
        <div className="mt-4 flex items-center gap-3 px-1">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal/40 to-[#3d7bfa]/40 text-[13px] font-semibold">
            {initials(data.user.name)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px]">{data.user.name}</span>
            <span className="block text-[13px] text-muted-foreground">{data.user.plan}</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

// ─── En-tête ─────────────────────────────────────────────────────────────────

function Clock({ locale }: { locale: Locale }) {
  const [now, setNow] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
    const update = () => setNow(fmt.format(new Date()));
    update();
    const timer = window.setInterval(update, 10_000);
    return () => window.clearInterval(timer);
  }, [locale]);
  return <time className="min-w-[2.5rem] text-[14px] text-muted-foreground tabular-nums">{now}</time>;
}

function Header({ data }: { data: VoxStatic }) {
  const c = data.labels;
  return (
    <header className="sticky top-0 z-20 flex h-[70px] items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:col-start-2 lg:px-5 xl:static xl:col-span-2">
      <Link href={data.links?.scenario ?? `/scenarios/${data.scenario.id}`} className="grid size-9 place-items-center rounded-lg border border-border lg:hidden" aria-label={c.back}>
        <ArrowLeft className="size-4" aria-hidden="true" />
      </Link>
      <nav aria-label={c.breadcrumb} className="flex min-w-0 items-center gap-1.5 text-[14px]">
        <span className="hidden text-muted-foreground sm:inline">{c.navLive} /</span>
        <Link href={data.links?.family ?? `/scenarios?family=${data.scenario.family}`} className="flex min-w-0 items-center gap-1.5 text-foreground hover:text-teal">
          <span className="truncate">{data.scenario.familyLabel}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>
      </nav>
      {data.demo && (
        <span className="hidden shrink-0 rounded-full border border-teal/40 bg-teal/10 px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] text-teal uppercase sm:inline">
          {data.demo.badge}
        </span>
      )}
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden sm:inline">
          <Clock locale={data.locale} />
        </span>
        <span aria-hidden="true" className="hidden h-6 w-px bg-border sm:block" />
        <Link
          href={data.links?.newSession ?? '/scenarios'}
          className="vox-gradient inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset] hover:brightness-110"
        >
          <AudioLines className="size-4" aria-hidden="true" />
          {c.newSession}
        </Link>
      </div>
    </header>
  );
}

// ─── Centre : objectif, visualiseur, transcription ───────────────────────────

function Brief({ data }: { data: VoxStatic }) {
  const c = data.labels;
  const s = data.scenario;
  return (
    <section aria-labelledby="call-objective" className="shrink-0">
      <div className="flex items-baseline justify-between gap-4 text-[14px] text-muted-foreground">
        <p className="min-w-0 truncate">
          {s.prospect.name}, {s.prospect.role} · {s.prospect.company}
        </p>
        <p className="shrink-0">{format(c.estimate, { n: s.estimatedMinutes })}</p>
      </div>
      <h1 id="call-objective" className="mt-2.5 text-[21px] leading-[1.45] font-normal tracking-[-0.01em] text-balance sm:text-[23px]">
        {s.objective}
      </h1>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {s.chips.map((chip) => (
          <li key={chip} className="rounded-md border border-border px-3 py-[7px] text-[11px] leading-none tracking-[0.06em] text-foreground/75 uppercase">
            {chip}
          </li>
        ))}
      </ul>
      {data.drill && <DrillCard data={data} />}
    </section>
  );
}

// Exercice ciblé : la réplique du prospect qui ouvre l'appel, ce que le vendeur avait dit et la meilleure réponse.
function DrillCard({ data }: { data: VoxStatic }) {
  const c = data.labels;
  const d = data.drill!;
  return (
    <aside aria-label={d.kind === 'moment' ? c.drillTitle : c.resumeTitle} className="mt-4 grid gap-3 rounded-xl border border-teal/30 bg-teal/[0.06] p-4 text-[13.5px]">
      <div>
        <p className="text-[11px] tracking-wide text-teal uppercase">{d.kind === 'moment' ? c.drillTitle : c.resumeTitle}</p>
        <p className="mt-1 text-muted-foreground">{d.kind === 'moment' ? c.drillIntro : c.resumeIntro}</p>
      </div>
      <p>
        <span className="text-muted-foreground">{c.drillProspect} : </span>« {d.prospectLine} »
      </p>
      {d.kind === 'moment' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{c.drillSaid}</p>
            <p className="mt-1 text-foreground/80">« {d.said} »</p>
          </div>
          <div>
            <p className="text-[11px] tracking-wide text-teal uppercase">{c.drillBetter}</p>
            <p className="mt-1">« {d.better} »</p>
          </div>
        </div>
      )}
    </aside>
  );
}

// Glyphe central : points et barres qui suivent le spectre de la voix qui parle.
const GLYPH = [
  { dot: 9, tone: 1 },
  { dot: 11, tone: 0.72 },
  { bar: 26, tone: 0.95 },
  { bar: 44, tone: 0.62 },
  { bar: 66, tone: 0.98 },
  { bar: 44, tone: 0.62 },
  { bar: 26, tone: 0.95 },
  { dot: 11, tone: 0.72 },
  { dot: 9, tone: 1 },
] as const;

function Glyph({ meter, active }: { meter?: VoxMeter; active: boolean }) {
  const items = useRef<(HTMLSpanElement | null)[]>([]);
  const halo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!meter || !active) return;
    let frame = 0;
    const tick = () => {
      const bins = meter.bins();
      const level = Math.min(1, meter.level() * 2.2);
      halo.current?.style.setProperty('--level', String(level));
      const bands = [0, 0, 0, 0, 0];
      if (bins && bins.length > 0) {
        // Les fréquences de la voix occupent surtout le bas du spectre : on en garde le premier tiers.
        const span = Math.max(5, Math.floor(bins.length / 3));
        const step = Math.floor(span / 5);
        for (let b = 0; b < 5; b++) {
          let sum = 0;
          for (let k = b * step; k < (b + 1) * step; k++) sum += bins[k] ?? 0;
          bands[b] = Math.min(1, sum / step / 200);
        }
      } else {
        bands.fill(level);
      }
      const order = [3, 1, 0, 2, 4]; // grave au centre, aigus vers l'extérieur
      GLYPH.forEach((g, i) => {
        const el = items.current[i];
        if (!el) return;
        if ('bar' in g) {
          const v = bands[order[i - 2]];
          el.style.height = `${Math.round(g.bar * (0.5 + v * 0.9))}px`;
        } else {
          el.style.transform = `scale(${1 + level * 0.35})`;
        }
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [meter, active]);
  return (
    <>
      <div ref={halo} aria-hidden="true" className="vox-glow pointer-events-none absolute top-1/2 left-1/2 size-[min(78%,560px)] -translate-x-1/2 -translate-y-[56%] rounded-full" />
      <div aria-hidden="true" className="relative flex items-center gap-[7px]">
        {GLYPH.map((g, i) => (
          <span
            key={i}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="block rounded-full transition-[height] duration-75"
            style={
              'bar' in g
                ? { width: 10, height: Math.round(g.bar * 0.62), background: `rgb(255 255 255 / ${g.tone})` }
                : { width: g.dot, height: g.dot, background: `rgb(255 255 255 / ${g.tone})` }
            }
          />
        ))}
      </div>
    </>
  );
}

// Bande de l'appel entier : amplitude, moments repérés (bons, à surveiller, à éviter) et marqueurs.
function Waveform({ meter, signals, markers, elapsed }: { meter?: VoxMeter; signals: VoxSignal[]; markers: number[]; elapsed: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = canvas.current;
    if (!el || width === 0) return;
    const H = 64;
    const dpr = window.devicePixelRatio || 1;
    el.width = width * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, H);
    const history = meter?.history() ?? [];
    const slots = Math.floor((width - 16) / 4);
    const windowSec = Math.max(history.length * SAMPLE_SECONDS, slots * SAMPLE_SECONDS, elapsed);
    const perSlot = windowSec / slots;
    const x = (seconds: number) => 8 + (seconds / windowSec) * (width - 16);
    const boxes = signals.map((s) => ({ x0: x(s.at) - 6, x1: Math.max(x(s.at) + 18, x(s.end) + 6), color: TONE[s.tone] }));
    for (const b of boxes) {
      ctx.fillStyle = `${b.color}1f`;
      ctx.strokeStyle = `${b.color}99`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(b.x0 + 0.5, 4.5, b.x1 - b.x0, H - 9, 5);
      ctx.fill();
      ctx.stroke();
    }
    for (let i = 0; i < slots; i++) {
      const t0 = i * perSlot;
      const a = Math.floor(t0 / SAMPLE_SECONDS);
      const z = Math.max(a + 1, Math.floor((t0 + perSlot) / SAMPLE_SECONDS));
      const px = 8 + i * 4 + 1;
      let v = -1;
      for (let k = a; k < z && k < history.length; k++) v = Math.max(v, history[k].v);
      const box = boxes.find((b) => px >= b.x0 && px <= b.x1);
      if (v < 0) {
        ctx.fillStyle = 'rgb(255 255 255 / 0.12)';
        ctx.fillRect(px, H / 2 - 1, 1.5, 2);
        continue;
      }
      const h = Math.max(3, Math.min(H - 16, 3 + Math.min(1, v * 2.4) * (H - 16)));
      ctx.fillStyle = box ? box.color : 'rgb(255 255 255 / 0.42)';
      ctx.fillRect(px, (H - h) / 2, 1.5, h);
    }
    for (const m of markers) {
      const mx = x(m);
      ctx.fillStyle = 'rgb(255 255 255 / 0.9)';
      ctx.fillRect(mx, 6, 1.5, H - 12);
      ctx.beginPath();
      ctx.moveTo(mx - 3.5, 4);
      ctx.lineTo(mx + 5, 4);
      ctx.lineTo(mx + 0.75, 9);
      ctx.fill();
    }
  }, [meter, signals, markers, elapsed, width]);
  return <canvas ref={canvas} aria-hidden="true" className="block h-16 w-full" />;
}

function Visualizer({ data, live, meter }: { data: VoxStatic; live: VoxLive; meter?: VoxMeter }) {
  const c = data.labels;
  const on = live.phase === 'live';
  const last = live.lines.at(-1);
  const status =
    live.phase === 'starting'
      ? c.connecting
      : live.phase === 'ending'
        ? c.saving
        : on
          ? live.isSpeaking
            ? c.prospectSpeaking
            : c.listening
          : null;
  return (
    <section aria-label={c.live} className="vox-frame relative mt-5 flex h-[clamp(320px,52vh,540px)] shrink-0 flex-col overflow-hidden rounded-xl">
      <div aria-hidden="true" className="vox-dots pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-[300px] -translate-x-1/2 -translate-y-[56%] rounded-full border border-teal/[0.07]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-[460px] -translate-x-1/2 -translate-y-[56%] rounded-full border border-teal/[0.05]" />

      <div className="relative flex items-start justify-between gap-3 px-4 pt-3.5 text-[12px] text-muted-foreground">
        <p role="status" aria-live="polite" className="flex min-h-5 items-center gap-2">
          {status && (
            <>
              {live.phase === 'starting' || live.phase === 'ending' ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <span aria-hidden="true" className={cn('size-2 rounded-full', live.isSpeaking ? 'bg-[#3d7bfa]' : 'bg-teal')} />
              )}
              {status}
            </>
          )}
          {live.interrupted && <span className="text-warning">· {c.interrupted}</span>}
        </p>
        {data.voiceName && <p>{format(c.voice, { name: data.voiceName })}</p>}
      </div>

      <div className="relative grid flex-1 place-items-center">
        <Glyph meter={meter} active={on} />
        {!on && live.phase !== 'starting' && live.phase !== 'ending' && (
          <div className="absolute inset-x-4 bottom-4 grid justify-items-center gap-2 text-center">
            {data.blocked ? (
              <p role="alert" className="max-w-md rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
                {data.blocked.message}
              </p>
            ) : live.dropped ? (
              <>
                <p role="alert" className="max-w-md text-[15px] text-balance">
                  {c.dropped}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href={live.dropped.resumeHref} className="rounded-lg bg-teal px-3.5 py-2 text-[13.5px] font-medium text-black hover:bg-teal/90">
                    {c.resume}
                  </Link>
                  <Link href={live.dropped.reportHref} className="rounded-lg border border-border px-3.5 py-2 text-[13.5px] hover:bg-surface-2">
                    {c.seeReport}
                  </Link>
                </div>
              </>
            ) : live.notice ? (
              <p className="max-w-md text-[15px] text-balance">{live.notice}</p>
            ) : (
              <>
                <p className="text-[15px]">{format(c.ready, { name: data.scenario.prospect.name })}</p>
                <p className="max-w-md text-[13px] text-muted-foreground">{c.micHint}</p>
                {data.remaining && <p className="text-[12px] text-muted-foreground">{data.remaining}</p>}
              </>
            )}
            {live.error && !live.dropped && (
              <p role="alert" className="max-w-md rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
                {live.error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="relative px-4 pb-4">
        <div className="mb-2.5 flex items-center gap-3 text-[13px] text-muted-foreground">
          <span className="w-12 shrink-0 tabular-nums">{mmss(live.elapsed)}</span>
          <p className="mx-auto min-w-0 max-w-[min(60%,32rem)]">
            {on && last && (
              <span className="block truncate rounded-md border border-white/10 bg-black/45 px-3 py-1.5 text-[12.5px] text-foreground/90 backdrop-blur">
                {last.text}
              </span>
            )}
          </p>
          <span className="shrink-0 text-right tabular-nums">
            {live.db !== null ? `${live.db} dB` : '— dB'}
            {live.khz !== null && <> · {live.khz} kHz</>}
          </span>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/30">
          <Waveform meter={meter} signals={live.signals} markers={live.markers} elapsed={live.elapsed} />
        </div>
      </div>
    </section>
  );
}

// Réplique du vendeur surlignée : questions en vert, hésitations en ambre, concessions en rouge, tics soulignés.
function Annotated({ text, locale }: { text: string; locale: Locale }) {
  const pieces = annotate(text, locale);
  const runs: { question: boolean; pieces: Piece[] }[] = [];
  for (const p of pieces) {
    const q = Boolean(p.question);
    if (runs.at(-1)?.question === q) runs.at(-1)!.pieces.push(p);
    else runs.push({ question: q, pieces: [p] });
  }
  const piece = (p: Piece, i: number) =>
    p.mark === 'filler' ? (
      <span key={i} className="underline decoration-muted-foreground decoration-dotted decoration-1 underline-offset-[5px]">
        {p.text}
      </span>
    ) : p.mark === 'hedge' ? (
      <mark key={i} className="rounded-[3px] bg-[#f5b544]/30 px-0.5 text-foreground">
        {p.text}
      </mark>
    ) : p.mark === 'concession' ? (
      <mark key={i} className="rounded-[3px] bg-[#f2716b]/35 px-0.5 text-foreground">
        {p.text}
      </mark>
    ) : (
      <span key={i}>{p.text}</span>
    );
  return (
    <>
      {runs.map((run, r) => {
        if (!run.question) return <span key={r}>{run.pieces.map(piece)}</span>;
        const lastPiece = run.pieces.at(-1)!;
        const tail = lastPiece.text.match(/\s*$/)?.[0] ?? '';
        const trimmed = [...run.pieces.slice(0, -1), { ...lastPiece, text: lastPiece.text.slice(0, lastPiece.text.length - tail.length) }];
        const lead = trimmed[0].text.match(/^\s*/)?.[0] ?? '';
        trimmed[0] = { ...trimmed[0], text: trimmed[0].text.slice(lead.length) };
        return (
          <span key={r}>
            {lead}
            <mark className="rounded-[3px] bg-teal/25 px-0.5 text-foreground [box-decoration-break:clone]">{trimmed.map(piece)}</mark>
            {tail}
          </span>
        );
      })}
    </>
  );
}

function Transcript({ data, live }: { data: VoxStatic; live: VoxLive }) {
  const c = data.labels;
  const box = useRef<HTMLElement>(null);
  const count = live.lines.length;
  // Sur grand écran, la transcription défile dans sa zone et suit la dernière réplique.
  useEffect(() => {
    const el = box.current;
    if (el && count > 0 && el.scrollHeight > el.clientHeight) el.scrollTop = el.scrollHeight;
  }, [count]);
  const firstName = data.scenario.prospect.name.split(' ')[0];
  return (
    <section ref={box} aria-labelledby="transcript-title" className="relative mt-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
      <h2 id="transcript-title" className="sr-only">
        {c.transcriptTitle}
      </h2>
      <ol className="grid gap-3.5" aria-live="polite">
        {count === 0 && <li className="px-4 text-[14px] text-muted-foreground">{c.liveEmpty}</li>}
        {live.lines.map((line) => (
          <li key={line.id} className="grid grid-cols-[46px_minmax(0,1fr)] gap-x-2 px-4 text-[14.5px] leading-[1.65]">
            <span className="pt-px text-[12.5px] text-muted-foreground tabular-nums">{mss(line.at)}</span>
            {line.role === 'seller' ? (
              <p className="text-foreground/95">
                <span className="sr-only">{c.you} : </span>
                <Annotated text={line.text} locale={data.scenario.language} />
              </p>
            ) : (
              <p className="text-muted-foreground">
                <span className="mr-2 text-[11px] font-medium tracking-[0.06em] text-muted-foreground/80 uppercase">{firstName}</span>
                <ToneTag tones={line.tones} labels={c.tones} />
                {line.text}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ─── Barre de commandes ──────────────────────────────────────────────────────

function IconButton({ label, onClick, disabled, children, pressed }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; pressed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-foreground/85 transition-colors hover:bg-surface-2 disabled:opacity-40 [&_svg]:size-4"
    >
      {children}
    </button>
  );
}

function Controls({ data, live, on }: { data: VoxStatic; live: VoxLive; on: VoxHandlers }) {
  const c = data.labels;
  const [brief, setBrief] = useState(false);
  const [full, setFull] = useState(false);
  const isLive = live.phase === 'live';
  const busy = live.phase === 'starting' || live.phase === 'ending' || live.phase === 'loading';
  const canStart = !data.blocked && (live.phase === 'idle' || live.phase === 'loading');

  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const s = data.scenario;
  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 border-t border-border bg-background/95 px-3 py-3 backdrop-blur sm:flex-nowrap sm:px-[10px]">
      <div className="relative order-2 flex items-center gap-2 sm:order-none">
        <button
          type="button"
          onClick={() => setBrief((v) => !v)}
          aria-expanded={brief}
          aria-controls="call-brief"
          className="h-9 rounded-lg border border-border bg-surface px-3.5 text-[14px] text-foreground/90 hover:bg-surface-2"
        >
          {c.brief}
        </button>
        <IconButton label={live.markers.length ? `${c.bookmark} (${format(c.bookmarked, { n: live.markers.length })})` : c.bookmark} onClick={on.mark} disabled={!isLive}>
          <Bookmark className={cn(live.markers.length > 0 && 'fill-current')} />
        </IconButton>
        {brief && (
          <div
            id="call-brief"
            role="dialog"
            aria-label={c.briefTitle}
            className="absolute bottom-[calc(100%+12px)] left-0 z-30 grid w-[min(28rem,calc(100vw-1.5rem))] gap-3 rounded-xl border border-border bg-surface p-4 text-[13.5px] shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between">
              <p className="text-[12px] tracking-wide text-muted-foreground uppercase">{c.briefTitle}</p>
              <button type="button" onClick={() => setBrief(false)} aria-label={c.briefClose} className="grid size-7 place-items-center rounded-md hover:bg-surface-2">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div>
              <p className="text-[11px] tracking-wide text-teal uppercase">{c.yourGoal}</p>
              <p className="mt-1">{s.objective}</p>
            </div>
            <div>
              <p className="text-[11px] tracking-wide text-teal uppercase">{c.youKnow}</p>
              <p className="mt-1">
                {s.prospect.name}, {s.prospect.role} · {s.prospect.company}
              </p>
              {s.prospect.publicProfile && <p className="mt-1 text-muted-foreground">{s.prospect.publicProfile}</p>}
            </div>
            <div>
              <p className="text-[11px] tracking-wide text-teal uppercase">{c.offer}</p>
              <p className="mt-1">
                {s.offer.name}
                {s.offer.price && <span className="text-muted-foreground"> · {s.offer.price}</span>}
              </p>
            </div>
            {s.context && (
              <div>
                <p className="text-[11px] tracking-wide text-teal uppercase">{c.context}</p>
                <p className="mt-1 text-muted-foreground">{s.context}</p>
              </div>
            )}
            {s.memo.steps.length > 0 && (
              <div>
                <p className="text-[11px] tracking-wide text-teal uppercase">{c.memoSteps}</p>
                <ol className="mt-1 grid list-decimal gap-0.5 pl-5 text-muted-foreground">
                  {s.memo.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            {s.memo.criteria.length > 0 && (
              <div>
                <p className="text-[11px] tracking-wide text-teal uppercase">{c.memoCriteria}</p>
                <ul className="mt-1 grid list-disc gap-0.5 pl-5 text-muted-foreground">
                  {s.memo.criteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="order-1 flex w-full items-center justify-center gap-2 sm:order-none sm:mx-auto sm:w-auto">
        <IconButton label={live.volumeOn ? c.volumeOff : c.volumeOn} onClick={on.toggleVolume} disabled={!isLive} pressed={!live.volumeOn}>
          {live.volumeOn ? <Volume2 /> : <VolumeX />}
        </IconButton>
        {isLive ? (
          <button
            type="button"
            onClick={on.toggleMute}
            aria-pressed={live.isMuted}
            className="vox-gradient inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset] hover:brightness-110"
          >
            {data.demo ? (
              live.isMuted ? (
                <Play className="size-4" aria-hidden="true" />
              ) : (
                <Pause className="size-4" aria-hidden="true" />
              )
            ) : live.isMuted ? (
              <MicOff className="size-4" aria-hidden="true" />
            ) : (
              <Mic className="size-4" aria-hidden="true" />
            )}
            {live.isMuted ? c.unmute : c.mute}
          </button>
        ) : data.blocked?.link ? (
          <Link
            href={data.blocked.link.href}
            className="vox-gradient inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[14px] font-medium text-white hover:brightness-110"
          >
            {data.blocked.link.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={on.start}
            disabled={!canStart || live.phase === 'loading'}
            className="vox-gradient inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset] hover:brightness-110 disabled:opacity-50"
          >
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {live.phase === 'starting' ? c.connecting : live.phase === 'ending' ? c.saving : c.start}
            {!busy && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        )}
        <IconButton label={full ? c.exitFullscreen : c.fullscreen} onClick={toggleFull}>
          {full ? <Minimize2 /> : <Maximize2 />}
        </IconButton>
      </div>

      {isLive || live.phase === 'starting' ? (
        <button
          type="button"
          onClick={on.hangUp}
          className="order-3 ml-auto h-9 rounded-lg sm:order-none sm:ml-0 border border-destructive/45 bg-destructive/10 px-3.5 text-[14px] font-medium text-destructive hover:bg-destructive/20"
        >
          {c.hangUp}
        </button>
      ) : (
        <Link
          href={data.links?.quit ?? `/scenarios/${s.id}`}
          className="order-3 ml-auto inline-flex h-9 items-center rounded-lg sm:order-none sm:ml-0 border border-destructive/45 bg-destructive/10 px-3.5 text-[14px] font-medium text-destructive hover:bg-destructive/20"
        >
          {c.quit}
        </Link>
      )}
    </div>
  );
}

// ─── Panneau de droite : performance en direct ───────────────────────────────

function Performance({ data, live }: { data: VoxStatic; live: VoxLive }) {
  const c = data.labels;
  const stats = live.stats;
  const ratio = talkRatio(stats);
  const wpm = pace(stats);
  const tip = coachTip(stats);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const firstName = data.scenario.prospect.name.split(' ')[0];
  const TICKS = 34;
  const filled = ratio === null ? 0 : Math.round((ratio / 100) * TICKS);
  const max = Math.max(10, ...live.fillers.map((f) => f.count));
  const recent = live.signals.slice(-4).reverse();
  const markerLeft = wpm === null ? null : ((Math.min(PACE_TARGET.scaleMax, Math.max(PACE_TARGET.scaleMin, wpm)) - PACE_TARGET.scaleMin) / (PACE_TARGET.scaleMax - PACE_TARGET.scaleMin)) * 100;
  const bandLeft = ((PACE_TARGET.min - PACE_TARGET.scaleMin) / (PACE_TARGET.scaleMax - PACE_TARGET.scaleMin)) * 100;
  const bandWidth = ((PACE_TARGET.max - PACE_TARGET.min) / (PACE_TARGET.scaleMax - PACE_TARGET.scaleMin)) * 100;
  const tipText = format(c.coach[tip.key], { value: tip.value ?? 0, name: firstName, objective: data.scenario.objective });
  const tipId = `${tip.key}:${tip.value ?? ''}`;
  return (
    <aside aria-labelledby="perf-title" className="relative border-t border-border px-4 pt-6 pb-6 lg:col-start-2 xl:col-start-3 xl:row-start-2 xl:overflow-y-auto xl:border-t-0 xl:border-l">
      <h2 id="perf-title" className="text-[12px] tracking-[0.04em] text-muted-foreground uppercase">
        {c.performance}
      </h2>

      <section
        className="vox-talk-card mt-4 rounded-xl border border-border p-4"
        aria-label={c.talkTime}
        title={format(c.talkHint, { min: TALK_TARGET.min, max: TALK_TARGET.max })}
      >
        <div className="flex items-center justify-between text-[11.5px] tracking-[0.04em] uppercase">
          <span className="text-foreground/75">{c.talkTime}</span>
          <span className="font-mono text-[11px] text-foreground/80">{ratio === null ? c.talkBand.none : c.talkBand[talkBand(ratio)]}</span>
        </div>
        <p className="mt-2 text-[44px] leading-none font-light tracking-tight tabular-nums">{ratio === null ? '—' : `${ratio}%`}</p>
        <div aria-hidden="true" className="mt-4 flex h-7 items-stretch justify-between">
          {Array.from({ length: TICKS }, (_, i) => (
            <span key={i} className={cn('w-[2px] rounded-full', i < filled ? 'bg-teal' : 'bg-white/20')} />
          ))}
        </div>
        <p className="sr-only">{format(c.talkHint, { min: TALK_TARGET.min, max: TALK_TARGET.max })}</p>
      </section>

      <section className="mt-4 rounded-xl border border-border bg-surface p-4" aria-label={c.pace}>
        <div className="flex items-center justify-between text-[11.5px] tracking-[0.04em] uppercase">
          <span className="text-foreground/75">{c.pace}</span>
          <span className="font-mono text-[11px] text-foreground/80">{wpm === null ? c.paceBand.none : c.paceBand[paceBand(wpm)]}</span>
        </div>
        <p className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[44px] leading-none font-light tracking-tight tabular-nums">{wpm ?? '—'}</span>
          <span className="text-[12px] text-muted-foreground">{c.paceUnit}</span>
        </p>
        <div aria-hidden="true" className="relative mt-5 h-[3px] rounded-full bg-white/10">
          <span className="absolute inset-y-0 rounded-full bg-[#8aa3c7]/45" style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }} />
          {markerLeft !== null && <span className="absolute -top-[4px] h-[11px] w-[3px] -translate-x-1/2 rounded-full bg-teal" style={{ left: `${markerLeft}%` }} />}
        </div>
        <div className="mt-2.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums">
          <span>{PACE_TARGET.scaleMin}</span>
          <span>{format(c.paceTarget, { min: PACE_TARGET.min, max: PACE_TARGET.max })}</span>
          <span>{PACE_TARGET.scaleMax}</span>
        </div>
      </section>

      <section className="mt-5" aria-labelledby="fillers-title">
        <h3 id="fillers-title" className="text-[12px] tracking-[0.04em] text-muted-foreground uppercase">
          {c.fillersTitle}
        </h3>
        <ul className="mt-2.5 grid">
          {live.fillers.slice(0, 3).map((f) => (
            <li key={f.key} className="grid grid-cols-[minmax(0,1fr)_116px_22px] items-center gap-3 py-[6px] text-[14px]">
              <span className="truncate">{f.label}</span>
              <span aria-hidden="true" className="h-[3px] rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-[#8aa3c7]" style={{ width: `${Math.round((f.count / max) * 100)}%` }} />
              </span>
              <span className="text-right text-[12px] text-muted-foreground tabular-nums">{f.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-3 border-t border-border" />

      <section className="mt-5" aria-labelledby="signals-title">
        <h3 id="signals-title" className="text-[12px] tracking-[0.04em] text-muted-foreground uppercase">
          {c.signalsTitle}
        </h3>
        <ol className="mt-2.5 grid" aria-live="polite">
          {recent.length === 0 && <li className="py-1.5 text-[13px] text-muted-foreground">{c.signalsEmpty}</li>}
          {recent.map((s, i) => (
            <li key={`${s.at}-${s.kind}-${i}`} className="grid grid-cols-[44px_auto_minmax(0,1fr)] items-baseline gap-x-2.5 py-[7px]">
              <span className="text-[12px] text-muted-foreground tabular-nums">{mmss(s.at)}</span>
              <span className="flex items-center gap-2 text-[14px]">
                <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: TONE[s.tone] }} />
                {c.signals[s.kind]}
              </span>
              <span className="truncate text-right text-[12px] text-muted-foreground">
                {s.kind === 'monologue'
                  ? format(c.monologueDetail, { n: s.detail })
                  : s.kind === 'fast_pace'
                    ? format(c.paceDetail, { n: s.detail })
                    : s.detail}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {dismissed !== tipId && (
        <section className="mt-4 rounded-xl border border-border bg-surface p-4" aria-labelledby="coach-title">
          <h3 id="coach-title" className="text-[11.5px] tracking-[0.04em] text-foreground/75 uppercase">
            {c.coachTitle}
          </h3>
          <p className="mt-3 text-[14px] leading-[1.6] text-foreground/90" aria-live="polite">
            {tipText}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
            <span className="text-[11px] tracking-[0.04em] text-muted-foreground uppercase">
              {format(c.criterion, { name: c.criteria[tip.criterion] })}
            </span>
            <button
              type="button"
              onClick={() => setDismissed(tipId)}
              className="h-8 rounded-md border border-border px-3 text-[11px] tracking-[0.04em] uppercase hover:bg-surface-2"
            >
              {c.dismiss}
            </button>
          </div>
        </section>
      )}
    </aside>
  );
}
