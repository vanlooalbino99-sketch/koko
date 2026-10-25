import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getDb } from '@/lib/server/db';
import type { Family } from '@/lib/domain';
import { format, formatDate } from '@/lib/i18n';
import { getI18n, requireOnboarded } from '@/lib/server/context';
import { listSimulations } from '@/lib/simulations/service';
import { StatusBadge, duration } from './status';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.history.title };
}

export default async function SimulationsPage() {
  const { auth } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const h = t.history;
  const rows = await listSimulations(await getDb(), auth);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{h.title}</h1>
        <p className="mt-1 text-muted-foreground">{h.subtitle}</p>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {h.empty}{' '}
          <Link href="/scenarios" className="text-primary hover:underline">
            {t.nav.scenarios}
          </Link>
        </p>
      ) : (
        <Card className="overflow-x-auto p-0 sm:p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">{h.scenario}</th>
                <th className="px-5 py-3 font-medium">{h.date}</th>
                <th className="px-5 py-3 font-medium">{h.duration}</th>
                <th className="px-5 py-3 font-medium">{h.status}</th>
                <th className="px-5 py-3 text-right font-medium">{h.score}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <Link href={`/simulations/${row.id}`} className="font-medium hover:text-primary">
                      {row.scenarioTitle}
                    </Link>
                    <p className="text-xs text-muted-foreground">{t.enums.family[row.scenarioFamily as Family]}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{formatDate(row.createdAt, locale)}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground tabular-nums">
                    {row.durationSeconds == null ? '—' : duration(row.durationSeconds, h.seconds, format)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={row.status} t={t} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{row.overallScore ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
