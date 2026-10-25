import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { demoAudio } from '../db/schema.ts';
import type { Locale } from '../domain.ts';
import type { DemoVoiceApi, SpeechRequest } from './eleven.ts';
import { DEMO_CALL } from './script.ts';
import type { DemoVoices } from './voices.ts';

// Synthèse des répliques de la démo, une par une, gardées en base : chaque réplique n'est payée qu'une fois.
export function demoModel() {
  return process.env.ELEVENLABS_DEMO_MODEL?.trim() || 'eleven_multilingual_v2';
}

// Vendeur posé ; prospect plus expressif et un peu plus lent, comme un artisan pressé mais qui pèse ses mots.
const SETTINGS: Record<'seller' | 'prospect', SpeechRequest['voice_settings']> = {
  seller: { stability: 0.5, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true },
  prospect: { stability: 0.38, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true, speed: 0.97 },
};

export function demoVersion(voices: DemoVoices) {
  return createHash('sha256').update(`${voices.seller.id}|${voices.prospect.id}|${demoModel()}`).digest('hex').slice(0, 12);
}

export function speechRequest(locale: Locale, index: number, voices: DemoVoices) {
  const lines = DEMO_CALL[locale].lines;
  const line = lines[index];
  if (!line) return null;
  const spoken = (i: number) => (lines[i] ? (lines[i].say ?? lines[i].text) : undefined);
  const next = lines[index + 1];
  const body: SpeechRequest = {
    text: spoken(index)!,
    model_id: demoModel(),
    voice_settings: SETTINGS[line.role],
    // La réplique d'avant donne le ton (une question appelle une réponse) ; celle d'après, seulement si c'est la
    // même personne qui continue.
    previous_text: spoken(index - 1),
    next_text: next?.role === line.role ? spoken(index + 1) : undefined,
    seed: 1000 + index,
  };
  const voiceId = line.role === 'seller' ? voices.seller.id : voices.prospect.id;
  const key = createHash('sha256').update(JSON.stringify([voiceId, body])).digest('hex');
  return { voiceId, body, key };
}

const inflight = globalThis as typeof globalThis & { __bsDemoClips?: Map<string, Promise<{ mime: string; audio: Uint8Array }>> };

export async function demoClip(db: Db, api: DemoVoiceApi, locale: Locale, index: number, voices: DemoVoices) {
  const req = speechRequest(locale, index, voices);
  if (!req) return null;
  const [row] = await db.select({ mime: demoAudio.mime, audio: demoAudio.audio }).from(demoAudio).where(eq(demoAudio.key, req.key));
  if (row) return { mime: row.mime, audio: new Uint8Array(row.audio) };
  inflight.__bsDemoClips ??= new Map();
  const pending = inflight.__bsDemoClips.get(req.key);
  if (pending) return pending;
  const work = (async () => {
    const clip = await api.speech(req.voiceId, req.body);
    await db.insert(demoAudio).values({ key: req.key, mime: clip.mime, audio: clip.audio }).onConflictDoNothing();
    return clip;
  })().finally(() => inflight.__bsDemoClips?.delete(req.key));
  inflight.__bsDemoClips.set(req.key, work);
  return work;
}
