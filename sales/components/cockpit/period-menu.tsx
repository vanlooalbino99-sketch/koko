import { CalendarDays, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Choix de la période (7, 30 ou 90 jours). De simples liens : la page se recharge avec ?period=, et le menu se
// referme de lui-même. compact : petite pastille en haut d'une carte (« 30 jours ⌄ »).
export function PeriodMenu({
  path,
  range,
  current,
  periods,
  labels,
  short,
  srLabel,
  compact,
}: {
  path: string;
  range?: string;
  current: number;
  periods: readonly number[];
  labels: Record<string, string>;
  short?: Record<string, string>;
  srLabel: string;
  compact?: boolean;
}) {
  return (
    <details className="group relative">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-2 border border-border whitespace-nowrap',
          compact ? 'h-7 rounded-md bg-surface-2 px-2 text-[11px] text-[#d3d7e1]' : 'h-9 rounded-lg bg-surface px-3 text-[13px]',
        )}
      >
        {!compact && <CalendarDays className="size-4 text-[#9aa1b2]" aria-hidden="true" />}
        <span className="sr-only">{srLabel} : </span>
        {compact ? (short ?? labels)[`d${current}`] : <span className="hidden sm:inline">{range}</span>}
        <ChevronDown className="size-3.5 text-[#9aa1b2]" aria-hidden="true" />
      </summary>
      <ul className="absolute right-0 z-20 mt-1 grid min-w-44 gap-0.5 rounded-lg border border-border bg-surface-2 p-1 shadow-xl">
        {periods.map((p) => (
          <li key={p}>
            <a
              href={`${path}?period=${p}`}
              aria-current={p === current ? 'true' : undefined}
              className={cn('block rounded-md px-3 py-1.5 text-[13px] hover:bg-white/5', p === current && 'text-[#8f88ff]')}
            >
              {labels[`d${p}`]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
