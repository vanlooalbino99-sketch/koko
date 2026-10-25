import { getDb } from '@/lib/server/db';
import { periodOf, sessionsCsv, trainingPulse } from '@/lib/dashboard/pulse';
import { getDictionary } from '@/lib/i18n';
import { getAuth } from '@/lib/server/context';

export const dynamic = 'force-dynamic';

// Export CSV des appels de l'utilisateur sur la période du tableau de bord : les siens, dans son espace actif.
export async function GET(req: Request) {
  const auth = await getAuth();
  if (!auth) return new Response(null, { status: 401 });
  const days = periodOf(new URL(req.url).searchParams.get('period'));
  const pulse = await trainingPulse(await getDb(), auth, { days });
  const t = getDictionary(auth.user.locale === 'en' ? 'en' : 'fr');
  const csv = sessionsCsv(pulse.sessions, t.dashboard.csvHeader, (s) => ({
    status: t.enums.status[s.status as keyof typeof t.enums.status] ?? s.status,
    outcome: s.outcome ? t.report.outcome[s.outcome] : '',
    focus: s.focus ? t.enums.skill[s.focus] : '',
  }));
  const day = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="appels-${days}j-${day}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
