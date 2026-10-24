import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

// Vérifie que l'application répond et que la base est joignable (sonde de l'hébergeur).
export async function GET() {
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
