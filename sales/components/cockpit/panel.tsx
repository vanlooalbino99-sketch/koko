import { cn } from '@/lib/utils';

// Briques des cartes de la maquette « RevenuePulse » : fond #1d212c, coins arrondis, titre blanc.
export const card = 'min-w-0 rounded-xl border border-white/[0.04] bg-surface p-4';

export function CardTitle({ children, muted, action, id }: { children: React.ReactNode; muted?: boolean; action?: React.ReactNode; id?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 id={id} className={cn('min-w-0 text-[14px] font-medium', muted ? 'text-[#9aa1b2]' : 'text-[#eef0f5]')}>
        {children}
      </h2>
      {action}
    </div>
  );
}

// Carte indicateur : titre (et pastille « en direct »), valeur, écart avec la période précédente, puis le
// graphique collé au bas de la carte ; bleed le fait déborder jusqu'aux bords comme sur la maquette.
export function KpiCard({
  title,
  badge,
  value,
  big,
  delta,
  bleed,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  value: React.ReactNode;
  big?: boolean;
  delta: React.ReactNode;
  bleed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(card, 'bs-rise flex min-h-[188px] flex-col overflow-hidden pb-0')}>
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[14px] font-medium text-[#eef0f5]">{title}</h2>
        {badge}
      </div>
      <div className={cn('mt-2.5 leading-none font-semibold tracking-tight tabular-nums', big ? 'text-[30px]' : 'text-[22px]')}>{value}</div>
      <div className="mt-2">{delta}</div>
      <div className={cn('mt-auto pt-2', bleed ? '-mx-4' : 'pb-3')}>{children}</div>
    </section>
  );
}

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#2fd07a]/40 bg-[#2fd07a]/10 px-2 py-0.5 text-[10.5px] text-[#5ff0a0]">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2fd07a]" /> {label}
    </span>
  );
}

// Bouton discret « Voir tout » en haut à droite d'une carte (un vrai lien).
export function ViewAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="shrink-0 rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] whitespace-nowrap text-[#d3d7e1] hover:text-white">
      {children}
    </a>
  );
}
