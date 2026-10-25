import { CalendarDays, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Choix de la période (7, 30 ou 90 jours). De simples liens : la page se recharge avec ?period=, et le menu se
// referme de lui-même.
export function PeriodMenu({
  path,
  range,
  current,
  periods,
  labels,
  srLabel,
}: {
  path: string;
  range: string;
  current: number;
  periods: readonly number[];
  labels: Record<string, string>;
  srLabel: string;
}) {
  return (
    <details className="group relative">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-surface px-3 text-[13px]">
        <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">{srLabel} : </span>
        {range}
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </summary>
      <ul className="absolute right-0 z-20 mt-1 grid min-w-44 gap-0.5 rounded-lg border border-border bg-surface-2 p-1 shadow-xl">
        {periods.map((p) => (
          <li key={p}>
            <a
              href={`${path}?period=${p}`}
              aria-current={p === current ? 'true' : undefined}
              className={cn('block rounded-md px-3 py-1.5 text-[13px] hover:bg-white/5', p === current && 'text-primary')}
            >
              {labels[`d${p}`]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
