import { getDb } from '@/lib/server/db';
import { getAuth } from '@/lib/server/context';
import { getSimulation } from '@/lib/simulations/service';

export const dynamic = 'force-dynamic';

// Enregistrement audio d'un appel terminé, relayé depuis ElevenLabs : réservé à la personne qui a passé
// l'appel. La clé ElevenLabs reste sur le serveur.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth();
  if (!auth) return new Response(null, { status: 401 });
  const sim = await getSimulation(await getDb(), auth, (await params).id);
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!sim || sim.status !== 'completed' || !sim.providerConversationId || !key) return new Response(null, { status: 404 });
  const base = process.env.ELEVENLABS_API_BASE?.trim() || 'https://api.elevenlabs.io';
  try {
    const res = await fetch(`${base}/v1/convai/conversations/${encodeURIComponent(sim.providerConversationId)}/audio`, {
      headers: { 'xi-api-key': key },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok || !res.body) return new Response(null, { status: 404 });
    return new Response(res.body, {
      headers: { 'content-type': res.headers.get('content-type') ?? 'audio/mpeg', 'cache-control': 'private, max-age=3600' },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
