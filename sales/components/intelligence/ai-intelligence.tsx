import Link from 'next/link';
import { ArrowRight, Dumbbell, Lightbulb, Loader, MessageSquareWarning, Play, RotateCcw, Sparkles, Target, TrendingUp } from 'lucide-react';
import type { Intelligence } from '@/lib/dashboard/intelligence';
import type { Locale } from '@/lib/domain';
import { format, type Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { IntelTabs } from './intel-tabs';

// Section « Intelligence IA » du tableau de bord, mise en page de la maquette « Pitstop » : anneau de score et
// synthèse, points forts et lacunes, puis les onglets (plan d'action, points forts, à améliorer, scores, objections).

const panel = 'min-w-0 rounded-2xl border border-white/[0.04] bg-[#1b1c22] p-4 sm:p-5';
const GRADES = [
  { min: 80, key: 'excellent', color: '#3fdc85' },
  { min: 65, key: 'good', color: '#f2e53a' },
  { min: 50, key: 'fair', color: '#ff9f2e' },
  { min: 0, key: 'low', color: '#ff5a76' },
] as const;
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="size-[124px]" aria-hidden="true">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#2b2c36" strokeWidth="10" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform="rotate(-90 64 64)"
        className="bs-ring-draw"
        style={{ ['--len' as string]: `${(score / 100) * c}` }}
      />
    </svg>
  );
}

export function AiIntelligence({ intel, t, locale, voiceReady }: { intel: Intelligence | null; t: Dictionary; locale: Locale; voiceReady: boolean }) {
  const d = t.dashboard.intel;
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const dec = (v: number) => new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }).format(v);
  const signed = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${dec(Math.abs(v))}`;

  const heading = (
    <h2 id="intel-title" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-white">
      <Sparkles className="size-5 text-[#8f88ff]" aria-hidden="true" /> {d.title}
    </h2>
  );

  if (!intel) {
    return (
      <section aria-labelledby="intel-title" className={cn(panel, 'bs-rise grid gap-3')} data-intel="vide">
        {heading}
        <p className="max-w-[70ch] text-[13.5px] leading-relaxed text-[#b4b9c6]">{d.empty}</p>
        <Link href="/scenarios" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#4f46e5] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#5b52f0]">
          <Play className="size-4" aria-hidden="true" /> {d.emptyCta}
        </Link>
      </section>
    );
  }

  const grade = GRADES.find((g) => (intel.score ?? 0) >= g.min)!;
  const since = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' }).format(intel.since);
  const kind = (k: keyof typeof d.kinds) => d.kinds[k];
  const ex = intel.exercise;
  const delta = intel.score !== null && intel.previousScore !== null ? intel.score - intel.previousScore : null;
  const missed = (o: { poorly: number; partly: number }) => o.poorly + o.partly;
  const tip = intel.improvements[0];

  const subtitle =
    intel.scope === 'recent'
      ? format(d.subtitleRecent, { n: intel.calls })
      : intel.calls === 1
        ? d.subtitleWeekOne
        : format(d.subtitleWeek, { n: intel.calls });

  const coaching = [
    intel.weakest && format(d.coachingSkill, { skill: lower(t.enums.skill[intel.weakest.skill]), cost: dec(intel.weakest.cost) }),
    intel.losing && format(d.coachingObjection, { kind: kind(intel.losing.kind), example: intel.losing.example.replace(/[\s.!…]+$/u, '') }),
    tip && format(d.coachingExample, { said: tip.said, better: tip.better }),
  ].filter((s): s is string => !!s);

  const plan = (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      <div className="rounded-2xl bg-[linear-gradient(135deg,#4c3bd1,#5a3fc8_55%,#4b3bc0)] p-6 text-white shadow-[0_18px_50px_-20px_rgba(91,63,200,0.7)]">
        <h3 className="flex items-center gap-2.5 text-[20px] font-semibold">
          <Lightbulb className="size-6" aria-hidden="true" /> {d.coachingTitle}
        </h3>
        <div className="mt-4 grid gap-2.5 text-[14px] leading-relaxed text-white/95">
          {coaching.length ? coaching.map((p) => <p key={p}>{p}</p>) : <p>{d.noFocus}</p>}
        </div>
      </div>
      <div className="pt-1">
        <h3 className="text-[18px] font-semibold text-white">{d.nextFocusTitle}</h3>
        {intel.focus.length === 0 ? (
          <p className="mt-4 text-[13.5px] text-[#9aa1b2]">{d.noFocus}</p>
        ) : (
          <ul className="mt-4 grid gap-3.5 text-[13.5px] leading-snug text-[#eef0f5]">
            {intel.focus.map((f) => (
              <li key={f.kind + f.text} className="grid grid-cols-[auto_1fr] gap-2">
                <ArrowRight className="mt-0.5 size-4 text-[#7d76ff]" aria-hidden="true" />
                <span>
                  {format(f.kind === 'objection' ? d.focusObjection : f.kind === 'question' ? d.focusQuestion : d.focusCriterion, { text: f.text })}
                  {f.detail && f.kind === 'objection' && <span className="mt-1 block text-[12.5px] text-[#9aa1b2]">{f.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const forces =
    intel.strengths.length === 0 ? (
      <p className="text-[13.5px] text-[#9aa1b2]">{d.noStrengths}</p>
    ) : (
      <div className="grid gap-3">
        <ul className="grid gap-2.5 text-[13.5px] text-[#eef0f5]">
          {intel.strengths.map((s) => (
            <li key={s} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#a3e635]" />
              {s}
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-[#9aa1b2]">{d.strengthsFrom}</p>
      </div>
    );

  const improve =
    intel.improvements.length === 0 ? (
      <p className="text-[13.5px] text-[#9aa1b2]">{d.noImprovements}</p>
    ) : (
      <ul className="grid gap-3 md:grid-cols-2">
        {intel.improvements.map((i) => (
          <li key={i.simulationId + i.moment} className="grid gap-2 rounded-xl border border-white/10 p-4 text-[13px]">
            <p className="truncate text-[12px] font-medium text-[#9aa1b2]">{i.title}</p>
            <p>
              <span className="block text-[11px] tracking-wide text-[#ff7a90] uppercase">{d.improveSaid}</span>
              <span className="text-[#c9cdd8]">« {i.said} »</span>
            </p>
            <p>
              <span className="block text-[11px] tracking-wide text-[#3fdc85] uppercase">{d.improveBetter}</span>
              <span className="text-white">« {i.better} »</span>
            </p>
            {i.why && <p className="text-[12.5px] text-[#9aa1b2]">{i.why}</p>}
            <p className="mt-1 flex flex-wrap gap-4 text-[12.5px]">
              {voiceReady && (
                <Link
                  href={`/scenarios/${i.scenarioId}/call?${new URLSearchParams({ exercice: i.simulationId, moment: String(i.moment) })}`}
                  className="inline-flex items-center gap-1.5 text-[#b3adff] hover:text-white"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" /> {d.replay}
                </Link>
              )}
              <Link href={`/simulations/${i.simulationId}`} className="text-[#9aa1b2] hover:text-white">
                {d.viewReport}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    );

  const scores = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-[13px]">
        <thead className="text-left text-[11px] tracking-[0.04em] text-[#9aa1b2] uppercase">
          <tr className="border-b border-white/10">
            <th className="py-2 pr-3 font-medium">{d.scoreCols.skill}</th>
            <th className="py-2 pr-3 font-medium">{intel.scope === 'week' ? d.scoreCols.week : d.scoreCols.recent}</th>
            {intel.scope === 'week' && <th className="py-2 pr-3 font-medium">{d.scoreCols.previous}</th>}
            <th className="py-2 pr-3 font-medium">{d.scoreCols.cost}</th>
            <th className="py-2 font-medium">{d.scoreCols.n}</th>
          </tr>
        </thead>
        <tbody>
          {intel.skills.map((s) => (
            <tr key={s.skill} className="border-b border-white/[0.04]">
              <td className="py-2.5 pr-3 text-[#eef0f5]">{t.enums.skill[s.skill]}</td>
              <td className="py-2.5 pr-3">
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-1.5 w-24 rounded-full bg-[#2b2c36]">
                    <span className="bs-grow-x block h-full rounded-full" style={{ width: `${s.value}%`, background: GRADES.find((g) => s.value >= g.min)!.color }} />
                  </span>
                  <span className="text-white tabular-nums">{s.value}</span>
                </span>
              </td>
              {intel.scope === 'week' && <td className="py-2.5 pr-3 text-[#c9cdd8] tabular-nums">{s.previous ?? t.dashboard.none}</td>}
              <td className="py-2.5 pr-3 text-[#ff8a9e] tabular-nums">{s.cost > 0 ? `−${dec(s.cost)}` : '0'}</td>
              <td className="py-2.5 text-[#c9cdd8] tabular-nums">{s.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const objections =
    intel.objections.length === 0 ? (
      <p className="text-[13.5px] text-[#9aa1b2]">{d.noObjections}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-[13px]">
          <thead className="text-left text-[11px] tracking-[0.04em] text-[#9aa1b2] uppercase">
            <tr className="border-b border-white/10">
              {(['kind', 'raised', 'well', 'partly', 'poorly', 'gap'] as const).map((k) => (
                <th key={k} className="py-2 pr-3 font-medium">
                  {d.objectionCols[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {intel.objections.map((o) => (
              <tr key={o.kind} className="border-b border-white/[0.04]" title={o.example}>
                <td className="py-2.5 pr-3 text-[#eef0f5]">{d.kindNames[o.kind]}</td>
                <td className="py-2.5 pr-3 tabular-nums">{o.raised}</td>
                <td className="py-2.5 pr-3 text-[#3fdc85] tabular-nums">{o.well}</td>
                <td className="py-2.5 pr-3 text-[#ff9f2e] tabular-nums">{o.partly}</td>
                <td className="py-2.5 pr-3 text-[#ff5a76] tabular-nums">{o.poorly}</td>
                <td className="py-2.5 pr-3 tabular-nums">{o.gap === null ? t.dashboard.none : `${signed(-o.gap)} pts`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <section aria-labelledby="intel-title" className="bs-rise grid gap-2.5" data-intel="calcule">
      <div className="flex flex-wrap items-end justify-between gap-2 px-1">
        {heading}
        <p className="text-[12.5px] text-[#9aa1b2]">{subtitle}</p>
      </div>

      <div className={cn(panel, 'grid gap-5')}>
        <div className="grid gap-6 md:grid-cols-[minmax(220px,0.62fr)_1.6fr] md:gap-8">
          <div className="grid justify-items-center content-center gap-1 py-2 text-center">
            <div className="relative">
              {intel.score !== null && <ScoreRing score={intel.score} color={grade.color} />}
              <p className="absolute inset-0 grid place-items-center text-[24px] font-medium text-white tabular-nums">
                <span>
                  {intel.score ?? t.dashboard.none}
                  <span className="text-[#8b90a0]">/100</span>
                </span>
              </p>
            </div>
            {intel.score !== null && (
              <p className="mt-1 text-[17px] font-semibold" style={{ color: grade.color }}>
                {d.grades[grade.key]}
              </p>
            )}
            <p className="text-[13px] text-[#8b90a0]">{format(intel.calls === 1 ? d.analyzedOnOne : d.analyzedOn, { n: intel.calls, date: since })}</p>
            {delta !== null && (
              <p className={cn('text-[12.5px] tabular-nums', delta >= 0 ? 'text-[#3fdc85]' : 'text-[#ff5a76]')}>{format(d.vsPrevious, { delta: signed(delta) })}</p>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-[19px] font-semibold text-white">{d.summaryTitle}</h3>
            <ul className="mt-4 grid gap-3.5 text-[14px] leading-snug">
              {intel.weakest && (
                <li className="grid grid-cols-[auto_1fr] gap-3" data-intel-ligne="point-faible">
                  <Target className="mt-0.5 size-[18px] text-[#ff7a90]" aria-hidden="true" />
                  <span>
                    <span className="block text-white">
                      {format(intel.scope === 'week' ? d.weakest : d.weakestRecent, { skill: t.enums.skill[intel.weakest.skill] })}
                    </span>
                    <span className="text-[13px] text-[#a5aaba]">{format(d.weakestDetail, { score: intel.weakest.value, cost: dec(intel.weakest.cost) })}</span>
                  </span>
                </li>
              )}
              {intel.losing && (
                <li className="grid grid-cols-[auto_1fr] gap-3" data-intel-ligne="objections">
                  <MessageSquareWarning className="mt-0.5 size-[18px] text-[#ff9f2e]" aria-hidden="true" />
                  <span>
                    <span className="block text-white">{format(d.losing, { kind: kind(intel.losing.kind) })}</span>
                    <span className="text-[13px] text-[#a5aaba]">
                      {format(d.losingDetail, { missed: missed(intel.losing), raised: intel.losing.raised })}
                      {intel.losing.gap !== null && intel.losing.gap > 0 && ` ${format(d.losingGap, { gap: intel.losing.gap })}`}
                    </span>
                  </span>
                </li>
              )}
              {ex && (
                <li className="grid grid-cols-[auto_1fr] gap-3" data-intel-ligne="exercice">
                  <Dumbbell className="mt-0.5 size-[18px] text-[#8f88ff]" aria-hidden="true" />
                  <span>
                    <span className="block text-white">
                      {format(d.exercise, { personality: lower(t.enums.personality[ex.personality]), level: ex.level })}
                    </span>
                    <span className="text-[13px] text-[#a5aaba]">
                      {ex.reason === 'objection' && intel.losing
                        ? format(d.exerciseObjection, { title: ex.title, kind: kind(intel.losing.kind) })
                        : format(d.exerciseSkill, { title: ex.title, skill: intel.weakest ? lower(t.enums.skill[intel.weakest.skill]) : '' })}
                    </span>
                  </span>
                </li>
              )}
            </ul>
            {ex && (
              <Link
                href={`/scenarios/${ex.scenarioId}/call`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4f46e5] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(79,70,229,0.9)] hover:bg-[#5b52f0]"
              >
                <Play className="size-4 fill-current" aria-hidden="true" /> {d.launch}
              </Link>
            )}
            {intel.latest && (
              <p className="mt-5 text-[13px] leading-relaxed text-[#a5aaba]">
                <Link href={`/simulations/${intel.latest.simulationId}`} className="text-[#c9cdd8] hover:text-white">
                  {d.latestSummary} · {intel.latest.title}
                </Link>
                {' : '}
                {intel.latest.summary}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_1.03fr]">
          <div className="rounded-xl border border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-[17px] font-semibold text-white">
              <TrendingUp className="size-[18px]" aria-hidden="true" /> {d.strengthsTitle}
            </h3>
            {intel.strongest.length === 0 ? (
              <p className="mt-2.5 text-[13px] text-[#9aa1b2]">{d.noStrength}</p>
            ) : (
              <ul className="mt-2.5 grid gap-2 text-[13.5px] text-[#d9dce5]">
                {intel.strongest.map((s) => (
                  <li key={s.skill} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#a3e635]" />
                    {format(d.strengthSkill, { skill: t.enums.skill[s.skill], score: s.value, calls: s.n === 1 ? d.callsOne : format(d.calls, { n: s.n }) })}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <h3 className="flex items-center gap-2 text-[17px] font-semibold text-white">
              <Loader className="size-[18px]" aria-hidden="true" /> {d.gapsTitle}
            </h3>
            {!intel.weakest && !intel.losing ? (
              <p className="mt-2.5 text-[13px] text-[#9aa1b2]">{d.noGap}</p>
            ) : (
              <ul className="mt-2.5 grid gap-2 text-[13.5px] text-[#d9dce5]">
                {intel.skills
                  .filter((s) => s.cost > 0)
                  .slice(0, intel.losing ? 2 : 3)
                  .map((s) => (
                    <li key={s.skill} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#ff5a5a]" />
                      {format(d.gapSkill, { skill: t.enums.skill[s.skill], score: s.value, cost: dec(s.cost) })}
                    </li>
                  ))}
                {intel.losing && (
                  <li className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#ff5a5a]" />
                    {format(d.gapObjection, { kind: kind(intel.losing.kind), missed: missed(intel.losing), raised: intel.losing.raised })}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={panel}>
        <IntelTabs
          label={d.title}
          tabs={[
            { key: 'plan', label: d.tabs.plan, panel: plan },
            { key: 'forces', label: d.tabs.forces, panel: forces },
            { key: 'improve', label: d.tabs.improve, panel: improve },
            { key: 'scores', label: d.tabs.scores, panel: scores },
            { key: 'objections', label: d.tabs.objections, panel: objections },
          ]}
        />
      </div>
    </section>
  );
}
