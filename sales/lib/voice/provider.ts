import { z } from 'zod';

// Ce dont la simulation a besoin chez le fournisseur de voix. Les tests utilisent un faux fournisseur.
export interface VoiceProvider {
  createAgent(config: AgentPayload): Promise<{ agentId: string }>;
  getConversationToken(agentId: string, participantName: string): Promise<{ token: string; conversationId: string | null }>;
  getConversation(conversationId: string): Promise<ProviderConversation>;
}

// Corps de POST /v1/convai/agents/create, au format du fil (snake_case).
export type AgentPayload = {
  name: string;
  tags: string[];
  conversation_config: {
    agent: {
      first_message: string;
      language: string;
      prompt: {
        prompt: string;
        llm: string;
        temperature: number;
        built_in_tools: { end_call: { type: 'system'; name: 'end_call'; description: string; params: { system_tool_type: 'end_call' } } };
      };
    };
    tts: { model_id: string; voice_id?: string };
    turn: { turn_eagerness: 'patient' | 'normal' | 'eager' };
    conversation: { max_duration_seconds: number };
  };
  platform_settings: {
    auth: { enable_auth: true };
    overrides: { conversation_config_override: { agent: { first_message: true } } };
  };
};

const ConversationSchema = z.object({
  agent_id: z.string().nullish(),
  status: z.string(),
  transcript: z
    .array(
      z.object({
        role: z.string(),
        message: z.string().nullish(),
        time_in_call_secs: z.number().nullish(),
        interrupted: z.boolean().nullish(),
      }),
    )
    .nullish(),
  metadata: z
    .object({
      call_duration_secs: z.number().nullish(),
      cost: z.number().nullish(),
      termination_reason: z.string().nullish(),
    })
    .nullish(),
});
export type ProviderConversation = z.infer<typeof ConversationSchema>;

export class VoiceProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

// Client HTTP ElevenLabs. La clé reste sur le serveur et n'apparaît jamais dans les erreurs ni les journaux.
export function elevenLabs(apiKey: string, baseUrl = 'https://api.elevenlabs.io'): VoiceProvider {
  async function call(path: string, init: RequestInit = {}): Promise<unknown> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', ...init.headers },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      // Le détail renvoyé par ElevenLabs aide au diagnostic ; on le tronque pour ne pas remplir les journaux.
      const detail = (await res.text().catch(() => '')).slice(0, 300);
      throw new VoiceProviderError(`ElevenLabs ${init.method ?? 'GET'} ${path.split('?')[0]} → ${res.status} ${detail}`, res.status);
    }
    return res.json();
  }

  return {
    async createAgent(config) {
      const body = z.object({ agent_id: z.string() }).parse(await call('/v1/convai/agents/create', { method: 'POST', body: JSON.stringify(config) }));
      return { agentId: body.agent_id };
    },
    async getConversationToken(agentId, participantName) {
      const qs = new URLSearchParams({ agent_id: agentId, participant_name: participantName });
      const body = z
        .object({ token: z.string(), conversation_id: z.string().nullish() })
        .parse(await call(`/v1/convai/conversation/token?${qs}`));
      return { token: body.token, conversationId: body.conversation_id ?? null };
    },
    async getConversation(conversationId) {
      return ConversationSchema.parse(await call(`/v1/convai/conversations/${encodeURIComponent(conversationId)}`));
    },
  };
}

// Fournisseur configuré sur ce serveur, ou null si la clé ElevenLabs n'est pas encore renseignée.
export function voiceProviderFromEnv(): VoiceProvider | null {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) return null;
  return elevenLabs(key, process.env.ELEVENLABS_API_BASE?.trim() || undefined);
}
