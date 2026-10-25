import { accountsCsv, cockpit, PERIODS, type Period } from '@/lib/billing/cockpit';
import { billingProviderFromEnv } from '@/lib/billing/stripe';
import { getDb } from '@/lib/db/client';
import { getDictionary } from '@/lib/i18n';
import { getAuth } from '@/lib/server/context';

export const dynamic = 'force-dynamic';

// Export CSV des comptes du cockpit : réservé à l'éditeur, comme la page.
export async function GET(req: Request) {
  const auth = await getAuth();
  if (!auth?.user.isPlatformAdmin) return new Response(null, { status: 404 });
  const requested = Number(new URL(req.url).searchParams.get('period'));
  const days: Period = (PERIODS as readonly number[]).includes(requested) ? (requested as Period) : 30;
  const provider = billingProviderFromEnv();
  const prices = provider ? await provider.prices().catch(() => null) : null;
  const data = await cockpit(await getDb(), { days, prices, invoices: null });
  const t = getDictionary(auth.user.locale === 'en' ? 'en' : 'fr');
  const day = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${accountsCsv(data.accounts, t.admin.csvHeader)}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="comptes-${days}j-${day}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
