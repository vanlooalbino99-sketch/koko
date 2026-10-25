import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

const configured = (name: string) => Boolean(process.env[name]?.trim());

// Vérifie que l'application répond et que la base est joignable (sonde de l'hébergeur). Indique aussi quels
// services sont branchés (vrai ou faux seulement : aucune valeur de clé n'est renvoyée).
export async function GET() {
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    return Response.json({
      ok: true,
      voice: configured('ELEVENLABS_API_KEY'),
      analysis: configured('ANTHROPIC_API_KEY'),
      billing: configured('STRIPE_SECRET_KEY') && configured('STRIPE_WEBHOOK_SECRET'),
    });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
