import { getDb } from '@/lib/db/client';
import { demoClip, demoVersion } from '@/lib/demo/audio';
import { demoVoiceApiFromEnv } from '@/lib/demo/eleven';
import { DEMO_CALL } from '@/lib/demo/script';
import { demoVoicesFor } from '@/lib/demo/voices';

export const dynamic = 'force-dynamic';

// Une réplique de la démo publique, en MP3. Seules les répliques du script existent : impossible de faire lire
// un autre texte. Synthétisée une fois, puis servie depuis la base.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const lang = params.get('lang') === 'en' ? 'en' : 'fr';
  const index = Number(params.get('line'));
  if (!Number.isInteger(index) || index < 0 || index >= DEMO_CALL[lang].lines.length) return new Response(null, { status: 404 });
  const api = demoVoiceApiFromEnv();
  if (!api) return new Response(null, { status: 404 });
  const db = await getDb();
  const voices = await demoVoicesFor(db, api, lang);
  if (!voices) return new Response(null, { status: 503 });
  try {
    const clip = await demoClip(db, api, lang, index, voices);
    if (!clip) return new Response(null, { status: 404 });
    // Même version demandée que celle en service : l'adresse ne changera plus de contenu.
    const stable = params.get('v') === demoVersion(voices);
    return new Response(new Uint8Array(clip.audio), {
      headers: { 'content-type': clip.mime, 'cache-control': stable ? 'public, max-age=31536000, immutable' : 'no-store' },
    });
  } catch (error) {
    console.error('[demo] synthèse impossible', error instanceof Error ? error.message : error);
    return new Response(null, { status: 503 });
  }
}
