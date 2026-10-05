import { NextResponse, type NextRequest } from 'next/server';
import { bookedSlots } from '@/lib/crm';
import { availableSlots, isDate } from '@/lib/slots';

export const dynamic = 'force-dynamic';

/** Créneaux libres d'une journée : GET /api/creneaux?date=AAAA-MM-JJ */
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!isDate(date)) return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  try {
    const taken = (await bookedSlots(date, date)).map((s) => s.heure);
    return NextResponse.json({ date, slots: availableSlots(date, taken) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('[creneaux] CRM indisponible', e);
    // Sans le CRM, on affiche les créneaux théoriques : la réservation revérifie au moment d'envoyer.
    return NextResponse.json({ date, slots: availableSlots(date), degraded: true }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
