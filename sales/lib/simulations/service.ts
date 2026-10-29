import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import { creditStatus, debitSimulation, platformUsage } from '../billing/credits.ts';
import type { Db } from '../db/client.ts';
import {
  scenarioVersions,
  scenarios,
  simulationAnalyses,
  simulations,
  voiceAgents,
  type Simulation,
  type SimulationDrill,
  type TranscriptTurn,
} from '../db/schema.ts';
import type { Locale } from '../domain.ts';
import { ScenarioMetaSchema } from '../scenarios/content.ts';
import { getPlayableVersion, type PlayableVersion } from '../scenarios/service.ts';
import { agentPayload, payloadHash } from '../voice/agent-config.ts';
import { splitTones } from '../voice/emotion.ts';
import type { VoiceDefaults } from '../voice/voices.ts';
import { VoiceProviderError, type ProviderConversation, type VoiceProvider } from '../voice/provider.ts';

const ACTIVE = ['connecting', 'in_progress', 'processing'] as const;
// Au-delà, une simulation jamais connectée ou jamais transcrite est considérée comme perdue.
const LOST_AFTER_MS = 45 * 60 * 1000;

// Prospect vocal de la version : réutilisé tant que la configuration ne change pas. Le verrou évite que deux
// premiers appels simultanés créent chacun un agent.
// Si ElevenLabs refuse la voix expressive (offre du compte, langue), le prospect est créé avec la voix rapide d'avant ;
// l'empreinte enregistrée reste celle de la configuration voulue, pour ne pas retenter à chaque appel.
export async function ensureVoiceAgent(db: Db, provider: VoiceProvider, playable: PlayableVersion, voices: VoiceDefaults = {}) {
  const build = (expressive: boolean) =>
    agentPayload(
      ScenarioMetaSchema.parse(playable.scenario),
      playable.content,
      { id: playable.versionId, number: playable.versionNumber },
      voices,
      { expressive },
    );
  const payload = build(true);
  const hash = payloadHash(payload);
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${playable.versionId}, 0))`);
    const [existing] = await tx.select().from(voiceAgents).where(eq(voiceAgents.scenarioVersionId, playable.versionId)).limit(1);
    if (existing?.configHash === hash) return existing.agentId;
    const { agentId } = await provider.createAgent(payload).catch((err: unknown) => {
      const refused = err instanceof VoiceProviderError && (err.status === 400 || err.status === 403 || err.status === 422);
      if (!refused) throw err;
      console.warn('[voice] voix expressive refusée, prospect créé avec la voix rapide :', err.message);
      return provider.createAgent(build(false));
    });
    await tx
      .insert(voiceAgents)
      .values({ scenarioVersionId: playable.versionId, agentId, configHash: hash })
      .onConflictDoUpdate({ target: voiceAgents.scenarioVersionId, set: { agentId, configHash: hash, updatedAt: new Date() } });
    return agentId;
  });
}

export type StartResult =
  | { ok: true; simulationId: string; token: string; maxSeconds: number; firstMessage?: string }
  | { ok: false; error: 'not_found' | 'quota_exceeded' | 'concurrent_limit' | 'platform_saturated' | 'provider_error' };

// Demande du navigateur : rejouer le moment n° « moment » des reformulations d'un appel, ou reprendre un appel coupé.
export type DrillRequest = { kind: 'moment'; from: string; moment: number } | { kind: 'resume'; from: string };

// Un exercice ciblé est court : le temps de rejouer le moment et d'enchaîner.
export const DRILL_MAX_SECONDS = 3 * 60;
// Une reprise n'est proposée que peu après la coupure.
const RESUME_WITHIN_MS = 2 * 60 * 60 * 1000;
const RESUME_LINE: Record<Locale, string> = {
  fr: 'Allô ? Excusez-moi, ça a coupé. Vous disiez ?',
  en: 'Hello? Sorry, we got cut off. You were saying?',
};

// Exercice calculé par le serveur à partir d'un appel de l'utilisateur sur le même scénario : le texte vient de
// la transcription et de l'analyse enregistrées, jamais du navigateur.
export async function prepareDrill(db: Db, auth: AuthContext, scenarioId: string, req: DrillRequest, now = new Date()): Promise<SimulationDrill | null> {
  const source = await ownSimulation(db, auth, String(req.from ?? ''));
  if (!source) return null;
  const [row] = await db
    .select({ scenarioId: scenarioVersions.scenarioId, language: scenarios.language })
    .from(scenarioVersions)
    .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
    .where(eq(scenarioVersions.id, source.scenarioVersionId))
    .limit(1);
  if (!row || row.scenarioId !== scenarioId) return null;
  if (req.kind === 'resume') {
    const ended = source.endedAt ?? source.createdAt;
    if (source.endReason !== 'error' || now.getTime() - ended.getTime() > RESUME_WITHIN_MS) return null;
    return { kind: 'resume', fromSimulationId: source.id, prospectLine: RESUME_LINE[row.language === 'en' ? 'en' : 'fr'] };
  }
  const [analysis] = await db
    .select({ result: simulationAnalyses.result })
    .from(simulationAnalyses)
    .where(and(eq(simulationAnalyses.simulationId, source.id), eq(simulationAnalyses.status, 'completed')))
    .limit(1);
  const improvements = (analysis?.result as { improvements?: { turn: number; said: string; better: string; why: string }[] } | undefined)?.improvements;
  const imp = Number.isInteger(req.moment) ? improvements?.[req.moment] : undefined;
  const transcript = source.transcript ?? [];
  if (!imp) return null;
  const before = transcript.slice(0, Math.max(0, imp.turn)).findLast((t) => t.role === 'prospect');
  if (!before?.text.trim()) return null;
  const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);
  return {
    kind: 'moment',
    fromSimulationId: source.id,
    moment: req.moment,
    prospectLine: cut(before.text.trim(), 400),
    said: cut(imp.said, 600),
    better: cut(imp.better, 600),
    why: cut(imp.why, 600),
  };
}

export async function startSimulation(
  db: Db,
  provider: VoiceProvider,
  auth: AuthContext,
  scenarioId: string,
  voices: VoiceDefaults = {},
  drillRequest?: DrillRequest,
): Promise<StartResult> {
  const playable = await getPlayableVersion(db, auth, scenarioId);
  if (!playable) return { ok: false, error: 'not_found' };
  const drill = drillRequest ? await prepareDrill(db, auth, playable.scenario.id, drillRequest) : null;
  if (drillRequest && !drill) return { ok: false, error: 'not_found' };
  // Un seul appel à la fois par vendeur : un appel précédent resté ouvert (onglet fermé) part en récupération de transcription.
  await db
    .update(simulations)
    .set({ status: 'processing', endedAt: new Date(), endReason: sql`coalesce(${simulations.endReason}, 'timeout')` })
    .where(and(eq(simulations.userId, auth.user.id), inArray(simulations.status, ['connecting', 'in_progress'])));

  // Moins d'un crédit restant : on ne démarre pas un appel qui serait coupé presque aussitôt.
  const credits = await creditStatus(db, auth.organization);
  if (credits.remaining < 1) return { ok: false, error: 'quota_exceeded' };
  if (credits.activeCalls >= credits.concurrentCalls) return { ok: false, error: 'concurrent_limit' };
  if ((await platformUsage(db)).voiceSaturated) return { ok: false, error: 'platform_saturated' };

  let agentId: string;
  try {
    agentId = await ensureVoiceAgent(db, provider, playable, voices);
  } catch (error) {
    console.error('[voice] création du prospect vocal impossible', error instanceof Error ? error.message : error);
    return { ok: false, error: 'provider_error' };
  }

  const [sim] = await db
    .insert(simulations)
    .values({
      organizationId: auth.organization.id,
      userId: auth.user.id,
      scenarioVersionId: playable.versionId,
      status: 'connecting',
      providerAgentId: agentId,
      drill,
    })
    .returning({ id: simulations.id });

  try {
    // Le nom du participant est l'identifiant de la simulation : aucune donnée personnelle n'est envoyée.
    const { token, conversationId } = await provider.getConversationToken(agentId, sim.id);
    if (conversationId) await db.update(simulations).set({ providerConversationId: conversationId }).where(eq(simulations.id, sim.id));
    await audit(db, {
      action: 'simulation.started',
      organizationId: auth.organization.id,
      actorUserId: auth.user.id,
      targetType: 'simulation',
      targetId: sim.id,
      metadata: { scenarioId, version: playable.versionNumber, ...(drill ? { drill: drill.kind, from: drill.fromSimulationId } : {}) },
    });
    // L'essai coupe l'appel plus tôt (5 minutes) : l'écran d'appel raccroche à cette limite.
    const maxSeconds = Math.min(credits.maxCallMinutes, credits.remaining) * 60;
    return drill
      ? { ok: true, simulationId: sim.id, token, maxSeconds: drill.kind === 'moment' ? Math.min(maxSeconds, DRILL_MAX_SECONDS) : maxSeconds, firstMessage: drill.prospectLine }
      : { ok: true, simulationId: sim.id, token, maxSeconds };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[voice] jeton de conversation refusé', message);
    await db.update(simulations).set({ status: 'failed', errorMessage: message.slice(0, 500), endReason: 'error' }).where(eq(simulations.id, sim.id));
    return { ok: false, error: 'provider_error' };
  }
}

async function ownSimulation(db: Db, auth: AuthContext, id: string): Promise<Simulation | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [sim] = await db
    .select()
    .from(simulations)
    .where(and(eq(simulations.id, id), eq(simulations.userId, auth.user.id), eq(simulations.organizationId, auth.organization.id)))
    .limit(1);
  return sim ?? null;
}

// Le navigateur signale que la voix est connectée. L'identifiant de conversation qu'il envoie ne sert que si le
// serveur n'en a pas reçu avec le jeton, et il est vérifié contre l'agent à la synchronisation.
export async function markSimulationConnected(db: Db, auth: AuthContext, id: string, conversationId: string): Promise<boolean> {
  const sim = await ownSimulation(db, auth, id);
  if (!sim) return false;
  if (sim.status !== 'connecting') return true;
  const useClientId = !sim.providerConversationId && /^[A-Za-z0-9_-]{1,120}$/.test(conversationId);
  await db
    .update(simulations)
    .set({ status: 'in_progress', startedAt: new Date(), ...(useClientId ? { providerConversationId: conversationId } : {}) })
    .where(eq(simulations.id, sim.id));
  return true;
}

export async function finishSimulation(
  db: Db,
  provider: VoiceProvider | null,
  auth: AuthContext,
  id: string,
  reason: 'user' | 'agent' | 'error',
  errorMessage?: string,
): Promise<Simulation | null> {
  const sim = await ownSimulation(db, auth, id);
  if (!sim) return null;
  if (sim.status === 'connecting' || sim.status === 'in_progress') {
    // Jamais connecté : rien n'a été facturé ni enregistré, la simulation est annulée ou en échec.
    const neverConnected = sim.status === 'connecting';
    await db
      .update(simulations)
      .set({
        status: neverConnected ? (reason === 'error' ? 'failed' : 'cancelled') : 'processing',
        endedAt: new Date(),
        endReason: reason,
        ...(errorMessage ? { errorMessage: errorMessage.slice(0, 500) } : {}),
      })
      .where(eq(simulations.id, sim.id));
  }
  const updated = (await ownSimulation(db, auth, id))!;
  return provider ? syncSimulation(db, provider, updated) : updated;
}

// Moments marqués par le vendeur pendant l'appel (secondes depuis le début) : triés, sans doublon, bornés.
export const MAX_MARKERS = 50;
export async function saveMarkers(db: Db, auth: AuthContext, id: string, markers: number[]): Promise<boolean> {
  const sim = await ownSimulation(db, auth, id);
  if (!sim) return false;
  const clean = [...new Set(markers.filter((m) => Number.isInteger(m) && m >= 0 && m <= 3600))].sort((a, b) => a - b).slice(0, MAX_MARKERS);
  await db.update(simulations).set({ markers: clean }).where(eq(simulations.id, sim.id));
  return true;
}

// Les balises de voix du prospect (« [sighs] ») sortent du texte ; son ton est gardé à part.
export function normalizeTranscript(turns: ProviderConversation['transcript']): TranscriptTurn[] {
  return (turns ?? []).flatMap((turn): TranscriptTurn[] => {
    if (turn.role !== 'user' && turn.role !== 'agent') return [];
    const { text, tones } = turn.role === 'agent' ? splitTones(turn.message ?? '') : { text: turn.message?.trim() ?? '', tones: [] };
    if (!text) return [];
    return [
      {
        role: turn.role === 'user' ? 'seller' : 'prospect',
        text,
        at: Math.max(0, Math.round(turn.time_in_call_secs ?? 0)),
        ...(turn.role === 'agent' && turn.interrupted ? { interrupted: true } : {}),
        ...(tones.length ? { tones } : {}),
      },
    ];
  });
}

// Récupère la transcription et la durée chez ElevenLabs. Sans effet sur une simulation déjà terminée.
export async function syncSimulation(db: Db, provider: VoiceProvider, sim: Simulation, now = new Date()): Promise<Simulation> {
  if (!(ACTIVE as readonly string[]).includes(sim.status)) return sim;
  if (sim.lastSyncedAt && now.getTime() - sim.lastSyncedAt.getTime() < 2000) return sim;
  const lost = now.getTime() - sim.createdAt.getTime() > LOST_AFTER_MS;
  const save = async (values: Partial<Simulation>) => {
    const [row] = await db
      .update(simulations)
      .set({ ...values, lastSyncedAt: now })
      .where(and(eq(simulations.id, sim.id), inArray(simulations.status, [...ACTIVE])))
      .returning();
    return row ?? sim;
  };

  if (!sim.providerConversationId) {
    return lost ? save({ status: 'failed', endReason: sim.endReason ?? 'error', errorMessage: 'no_conversation' }) : sim;
  }
  let conversation: ProviderConversation;
  try {
    conversation = await provider.getConversation(sim.providerConversationId);
  } catch (error) {
    console.error('[voice] lecture de la conversation impossible', error instanceof Error ? error.message : error);
    return save({});
  }
  // Une conversation d'un autre agent ne peut pas être rattachée à cette simulation.
  if (conversation.agent_id && sim.providerAgentId && conversation.agent_id !== sim.providerAgentId) {
    return save({ status: 'failed', endReason: 'error', errorMessage: 'conversation_mismatch' });
  }
  if (conversation.status === 'done') {
    const transcript = normalizeTranscript(conversation.transcript);
    const lastAt = transcript.at(-1)?.at ?? 0;
    // Terminé et débité ensemble : si l'écriture échoue, ni l'un ni l'autre n'a lieu.
    return db.transaction(async (tx) => {
      const [row] = await tx
        .update(simulations)
        .set({
          status: 'completed',
          transcript,
          durationSeconds: Math.round(conversation.metadata?.call_duration_secs ?? lastAt),
          providerCost: conversation.metadata?.cost == null ? null : Math.round(conversation.metadata.cost),
          endReason: sim.endReason ?? 'timeout',
          endedAt: sim.endedAt ?? now,
          lastSyncedAt: now,
        })
        .where(and(eq(simulations.id, sim.id), inArray(simulations.status, [...ACTIVE])))
        .returning();
      if (!row) return sim;
      await debitSimulation(tx, row);
      return row;
    });
  }
  if (conversation.status === 'failed') return save({ status: 'failed', endReason: sim.endReason ?? 'error', errorMessage: 'provider_failed' });
  return lost ? save({ status: 'failed', endReason: sim.endReason ?? 'timeout', errorMessage: 'transcript_timeout' }) : save({});
}

// Rattrape les appels de l'utilisateur restés sans transcription (onglet fermé, réseau coupé).
export async function syncPendingSimulations(db: Db, provider: VoiceProvider, auth: AuthContext, limit = 3) {
  const pending = await db
    .select()
    .from(simulations)
    .where(and(eq(simulations.userId, auth.user.id), eq(simulations.organizationId, auth.organization.id), inArray(simulations.status, [...ACTIVE])))
    .orderBy(desc(simulations.createdAt))
    .limit(limit);
  for (const sim of pending) {
    // Un appel en cours dans un autre onglet n'est pas touché tant qu'il n'est pas terminé côté ElevenLabs.
    await syncSimulation(db, provider, sim);
  }
}

export type SimulationView = Simulation & {
  scenarioId: string;
  scenarioTitle: string;
  scenarioLanguage: string;
  scenarioFamily: string;
  version: number;
  prospectName: string;
};

export async function getSimulation(db: Db, auth: AuthContext, id: string): Promise<SimulationView | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db
    .select({
      sim: simulations,
      scenarioId: scenarios.id,
      scenarioTitle: scenarios.title,
      scenarioLanguage: scenarios.language,
      scenarioFamily: scenarios.family,
      version: scenarioVersions.version,
      prospectName: sql<string>`${scenarioVersions.content} -> 'prospect' ->> 'name'`,
    })
    .from(simulations)
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
    .where(and(eq(simulations.id, id), eq(simulations.userId, auth.user.id), eq(simulations.organizationId, auth.organization.id)))
    .limit(1);
  if (!row) return null;
  return {
    ...row.sim,
    scenarioId: row.scenarioId,
    scenarioTitle: row.scenarioTitle,
    scenarioLanguage: row.scenarioLanguage,
    scenarioFamily: row.scenarioFamily,
    version: row.version,
    prospectName: row.prospectName,
  };
}

export async function listSimulations(db: Db, auth: AuthContext, limit = 50) {
  return db
    .select({
      id: simulations.id,
      status: simulations.status,
      createdAt: simulations.createdAt,
      durationSeconds: simulations.durationSeconds,
      overallScore: simulations.overallScore,
      scenarioTitle: scenarios.title,
      scenarioFamily: scenarios.family,
    })
    .from(simulations)
    .innerJoin(scenarioVersions, eq(scenarioVersions.id, simulations.scenarioVersionId))
    .innerJoin(scenarios, eq(scenarios.id, scenarioVersions.scenarioId))
    .where(and(eq(simulations.userId, auth.user.id), eq(simulations.organizationId, auth.organization.id)))
    .orderBy(desc(simulations.createdAt))
    .limit(limit);
}
