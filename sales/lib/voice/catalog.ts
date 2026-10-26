import { z } from 'zod';

// Voix disponibles dans le compte ElevenLabs (voix prêtes à l'emploi et voix ajoutées par le compte), pour
// choisir celle du prospect d'un scénario. La liste est gardée 10 minutes en mémoire ; la clé reste côté serveur.
export type Voice = { id: string; name: string; previewUrl: string | null; hint: string; gender: string | null; accent: string | null };

const VoicesSchema = z.object({
  voices: z.array(
    z.object({
      voice_id: z.string(),
      name: z.string(),
      preview_url: z.string().nullish(),
      labels: z.record(z.string(), z.string().nullish()).nullish(),
    }),
  ),
});

export const VOICE_ID = /^[A-Za-z0-9_-]{8,64}$/;
const TTL_MS = 10 * 60 * 1000;
const cache = globalThis as { __bsVoices?: { at: number; voices: Voice[] } };

export async function listVoices(): Promise<Voice[]> {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) return [];
  const cached = cache.__bsVoices;
  if (cached && Date.now() - cached.at < TTL_MS) return cached.voices;
  const base = process.env.ELEVENLABS_API_BASE?.trim() || 'https://api.elevenlabs.io';
  try {
    const res = await fetch(`${base}/v1/voices`, { headers: { 'xi-api-key': key }, signal: AbortSignal.timeout(8_000) });
    if (!res.ok) throw new Error(`ElevenLabs GET /v1/voices → ${res.status}`);
    const voices = VoicesSchema.parse(await res.json())
      .voices.filter((v) => VOICE_ID.test(v.voice_id))
      .map((v) => ({
        id: v.voice_id,
        name: v.name.slice(0, 80),
        previewUrl: v.preview_url?.startsWith('https://') ? v.preview_url : null,
        hint: [v.labels?.gender, v.labels?.accent, v.labels?.age]
          .filter((x): x is string => Boolean(x))
          .join(', ')
          .slice(0, 80),
        gender: v.labels?.gender?.toLowerCase() ?? null,
        accent: v.labels?.accent?.toLowerCase() ?? null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    cache.__bsVoices = { at: Date.now(), voices };
    return voices;
  } catch (error) {
    // Clé sans droit de lecture des voix, réseau : le scénario garde la voix par défaut.
    console.error('[voice] liste des voix indisponible', error instanceof Error ? error.message : error);
    return cached?.voices ?? [];
  }
}

export async function voiceName(id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  return (await listVoices()).find((v) => v.id === id)?.name ?? null;
}
