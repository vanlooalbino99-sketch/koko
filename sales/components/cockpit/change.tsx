import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Écart avec la période précédente : en pourcentage, ou en points pour un score (rien si la période
// précédente était vide : un écart infini ne dit rien).
export function Change({ value, previous, label, points, tag }: { value: number | null; previous: number | null; label: string; points?: boolean; tag: string }) {
  if (value === null || previous === null || (!points && previous === 0)) return <p className="text-[11.5px] text-muted-foreground">{label}</p>;
  const diff = points ? Math.round((value - previous) * 10) / 10 : Math.round(((value - previous) / previous) * 1000) / 10;
  const up = diff >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <p className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
      <span className={cn('inline-flex items-center gap-0.5 font-medium', up ? 'text-[#3fe0b5]' : 'text-[#ff8fab]')}>
        <Icon className="size-3.5" aria-hidden="true" />
        {new Intl.NumberFormat(tag).format(Math.abs(diff))}
        {points ? ' pt' : ' %'}
      </span>
      {label}
    </p>
  );
}
