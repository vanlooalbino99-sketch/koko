import { z } from 'zod';

// Appels ElevenLabs dont la démo publique a besoin. La clé reste sur le serveur ; les erreurs ne la citent jamais.
export type AccountVoice = {
  id: string;
  name: string;
  category: string | null;
  labels: Record<string, string>;
  description: string;
  languages: string[];
};

export type SharedVoice = {
  ownerId: string;
  id: string;
  name: string;
  gender: string;
  age: string;
  descriptive: string;
  useCase: string;
  category: string;
  description: string;
  usage: number;
  freeUsersAllowed: boolean;
};

export type SharedQuery = { language: string; gender: 'male' | 'female'; age?: string; descriptives?: string };

export type SpeechRequest = {
  text: string;
  model_id: string;
  voice_settings: { stability: number; similarity_boost: number; style: number; use_speaker_boost: boolean; speed?: number };
  previous_text?: string;
  next_text?: string;
  seed?: number;
};

export interface DemoVoiceApi {
  voices(): Promise<AccountVoice[]>;
  cloneVoice(name: string, sample: Uint8Array, description: string): Promise<string>;
  sharedVoices(query: SharedQuery): Promise<SharedVoice[]>;
  addSharedVoice(ownerId: string, voiceId: string, name: string): Promise<string>;
  speech(voiceId: string, body: SpeechRequest): Promise<{ mime: string; audio: Uint8Array }>;
}

const VoicesSchema = z.object({
  voices: z.array(
    z.object({
      voice_id: z.string(),
      name: z.string(),
      category: z.string().nullish(),
      description: z.string().nullish(),
      labels: z.record(z.string(), z.string().nullish()).nullish(),
      verified_languages: z.array(z.object({ language: z.string().nullish() })).nullish(),
    }),
  ),
});

const SharedSchema = z.object({
  voices: z.array(
    z.object({
      public_owner_id: z.string(),
      voice_id: z.string(),
      name: z.string(),
      gender: z.string().nullish(),
      age: z.string().nullish(),
      descriptive: z.string().nullish(),
      use_case: z.string().nullish(),
      category: z.string().nullish(),
      description: z.string().nullish(),
      usage_character_count_1y: z.number().nullish(),
      free_users_allowed: z.boolean().nullish(),
    }),
  ),
});

const IdSchema = z.object({ voice_id: z.string() });

export class DemoApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

export function demoVoiceApi(apiKey: string, baseUrl = 'https://api.elevenlabs.io'): DemoVoiceApi {
  async function call(path: string, init: RequestInit = {}, timeout = 15_000): Promise<Response> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'xi-api-key': apiKey, ...init.headers },
      signal: AbortSignal.timeout(timeout),
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => '')).slice(0, 200);
      throw new DemoApiError(`ElevenLabs ${init.method ?? 'GET'} ${path.split('?')[0]} → ${res.status} ${detail}`, res.status);
    }
    return res;
  }
  const json = { 'content-type': 'application/json' };

  return {
    async voices() {
      const body = VoicesSchema.parse(await (await call('/v1/voices')).json());
      return body.voices.map((v) => ({
        id: v.voice_id,
        name: v.name,
        category: v.category ?? null,
        labels: Object.fromEntries(Object.entries(v.labels ?? {}).filter((e): e is [string, string] => typeof e[1] === 'string')),
        description: v.description ?? '',
        languages: (v.verified_languages ?? []).map((l) => l.language ?? '').filter(Boolean),
      }));
    },
    async cloneVoice(name, sample, description) {
      const form = new FormData();
      form.set('name', name);
      form.set('description', description);
      form.set('remove_background_noise', 'false');
      form.append('files', new Blob([new Uint8Array(sample)], { type: 'audio/mpeg' }), 'echantillon.mp3');
      return IdSchema.parse(await (await call('/v1/voices/add', { method: 'POST', body: form }, 60_000)).json()).voice_id;
    },
    async sharedVoices(query) {
      const qs = new URLSearchParams({ page_size: '50', sort: 'usage_character_count_1y', language: query.language, gender: query.gender });
      if (query.age) qs.set('age', query.age);
      if (query.descriptives) qs.set('descriptives', query.descriptives);
      const body = SharedSchema.parse(await (await call(`/v1/shared-voices?${qs}`)).json());
      return body.voices.map((v) => ({
        ownerId: v.public_owner_id,
        id: v.voice_id,
        name: v.name,
        gender: v.gender ?? '',
        age: v.age ?? '',
        descriptive: v.descriptive ?? '',
        useCase: v.use_case ?? '',
        category: v.category ?? '',
        description: v.description ?? '',
        usage: v.usage_character_count_1y ?? 0,
        freeUsersAllowed: v.free_users_allowed ?? false,
      }));
    },
    async addSharedVoice(ownerId, voiceId, name) {
      const path = `/v1/voices/add/${encodeURIComponent(ownerId)}/${encodeURIComponent(voiceId)}`;
      return IdSchema.parse(await (await call(path, { method: 'POST', headers: json, body: JSON.stringify({ new_name: name }) })).json()).voice_id;
    },
    async speech(voiceId, body) {
      const path = `/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;
      const res = await call(path, { method: 'POST', headers: { ...json, accept: 'audio/mpeg' }, body: JSON.stringify(body) }, 60_000);
      const mime = res.headers.get('content-type')?.split(';')[0].trim() || 'audio/mpeg';
      return { mime, audio: new Uint8Array(await res.arrayBuffer()) };
    },
  };
}

export function demoVoiceApiFromEnv(): DemoVoiceApi | null {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) return null;
  return demoVoiceApi(key, process.env.ELEVENLABS_API_BASE?.trim() || undefined);
}
