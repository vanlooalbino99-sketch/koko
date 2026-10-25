'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Plus, Upload } from 'lucide-react';
import { PeriodMenu } from '@/components/cockpit/period-menu';

const PERIODS = [7, 30, 90] as const;
const DAY = 86_400_000;

// Actions de la barre du haut : période et export sur le tableau de bord et le cockpit (comme la maquette),
// création de scénario ailleurs.
export function TopActions({
  tag,
  labels,
}: {
  tag: string;
  labels: { periods: Record<string, string>; period: string; export: string; newScenario: string | null };
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const exportPath = pathname === '/dashboard' ? '/api/dashboard/export' : pathname === '/admin' ? '/api/admin/export' : null;
  if (!exportPath) {
    return labels.newScenario ? (
      <Link
        href="/scenarios/new"
        className="hidden h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-white hover:bg-primary/90 sm:flex"
      >
        <Plus className="size-4" aria-hidden="true" /> {labels.newScenario}
      </Link>
    ) : null;
  }
  const requested = Number(params.get('period'));
  const days = (PERIODS as readonly number[]).includes(requested) ? requested : 30;
  const now = new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * DAY);
  const short = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short' });
  return (
    <div className="flex items-center gap-2">
      <PeriodMenu path={pathname} range={`${short.format(since)} – ${short.format(now)}`} current={days} periods={PERIODS} labels={labels.periods} srLabel={labels.period} />
      <a
        href={`${exportPath}?period=${days}`}
        download
        className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-white hover:bg-primary/90"
      >
        <Upload className="size-4" aria-hidden="true" /> {labels.export}
      </a>
    </div>
  );
}
