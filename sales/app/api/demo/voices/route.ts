import { getDb } from '@/lib/db/client';
import { demoVersion } from '@/lib/demo/audio';
import { demoVoiceApiFromEnv } from '@/lib/demo/eleven';
import { DEMO_CALL } from '@/lib/demo/script';
import { demoVoicesFor } from '@/lib/demo/voices';

export const dynamic = 'force-dynamic';

// Démo publique : le son est-il disponible, et sous quelle version (elle change avec les voix). Ne renvoie ni
// clé ni identifiant de voix.
export async function GET(req: Request) {
  const lang = new URL(req.url).searchParams.get('lang') === 'en' ? 'en' : 'fr';
  const api = demoVoiceApiFromEnv();
  if (!api) return Response.json({ audio: false });
  const voices = await demoVoicesFor(await getDb(), api, lang);
  if (!voices) return Response.json({ audio: false });
  return Response.json({ audio: true, version: demoVersion(voices), lines: DEMO_CALL[lang].lines.length }, { headers: { 'cache-control': 'no-store' } });
}
