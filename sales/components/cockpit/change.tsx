import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Écart avec la période précédente : en pourcentage, ou en points pour un score (rien si la période
// précédente était vide : un écart infini ne dit rien). Flèche et chiffre verts ou rouges, comme la maquette.
export function Change({ value, previous, label, points, tag }: { value: number | null; previous: number | null; label: string; points?: boolean; tag: string }) {
  if (value === null || previous === null || (!points && previous === 0)) return <p className="text-[11.5px] text-[#9aa1b2]">{label}</p>;
  const diff = points ? Math.round((value - previous) * 10) / 10 : Math.round(((value - previous) / previous) * 1000) / 10;
  const up = diff >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-[11.5px] text-[#c9cdd8]">
      <span className={cn('inline-flex items-center gap-0.5 font-medium', up ? 'text-[#34d17f]' : 'text-[#ff5a76]')}>
        <Icon className="size-3" strokeWidth={2.6} aria-hidden="true" />
        {new Intl.NumberFormat(tag).format(Math.abs(diff))}
        {points ? ' pt' : ' %'}
      </span>
      {label}
    </p>
  );
}
