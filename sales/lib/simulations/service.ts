import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { audit } from '../audit.ts';
import type { AuthContext } from '../auth/service.ts';
import { creditStatus, debitSimulation, platformUsage } from '../billing/credits.ts';
import type { Db } from '../db/client.ts';
import { scenarioVersions, scenarios, simulations, voiceAgents, type Simulation, type TranscriptTurn } from '../db/schema.ts';
import type { Locale } from '../domain.ts';
import { ScenarioMetaSchema } from '../scenarios/content.ts';
import { getPlayableVersion, type PlayableVersion } from '../scenarios/service.ts';
import { agentPayload, payloadHash } from '../voice/agent-config.ts';
import type { ProviderConversation, VoiceProvider } from '../voice/provider.ts';

const ACTIVE = ['connecting', 'in_progress', 'processing'] as const;
// Au-delà, une simulation jamais connectée ou jamais transcrite est considérée comme perdue.
const LOST_AFTER_MS = 45 * 60 * 1000;

// Prospect vocal de la version : réutilisé tant que la configuration ne change pas. Le verrou évite que deux
// premiers appels simultanés créent chacun un agent.
export async function ensureVoiceAgent(db: Db, provider: VoiceProvider, playable: PlayableVersion, voices: Partial<Record<Locale, string>> = {}) {
  const payload = agentPayload(
    ScenarioMetaSchema.parse(playable.scenario),
    playable.content,
    { id: playable.versionId, number: playable.versionNumber },
    voices,
  );
  const hash = payloadHash(payload);
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${playable.versionId}, 0))`);
    const [existing] = await tx.select().from(voiceAgents).where(eq(voiceAgents.scenarioVersionId, playable.versionId)).limit(1);
    if (existing?.configHash === hash) return existing.agentId;
    const { agentId } = await provider.createAgent(payload);
    await tx
      .insert(voiceAgents)
      .values({ scenarioVersionId: playable.versionId, agentId, configHash: hash })
      .onConflictDoUpdate({ target: voiceAgents.scenarioVersionId, set: { agentId, configHash: hash, updatedAt: new Date() } });
    return agentId;
  });
}

export type StartResult =
  | { ok: true; simulationId: string; token: string }
  | { ok: false; error: 'not_found' | 'quota_exceeded' | 'concurrent_limit' | 'platform_saturated' | 'provider_error' };

export async function startSimulation(
  db: Db,
  provider: VoiceProvider,
  auth: AuthContext,
  scenarioId: string,
  voices: Partial<Record<Locale, string>> = {},
): Promise<StartResult> {
  const playable = await getPlayableVersion(db, auth, scenarioId);
  if (!playable) return { ok: false, error: 'not_found' };
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
      metadata: { scenarioId, version: playable.versionNumber },
    });
    return { ok: true, simulationId: sim.id, token };
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

export function normalizeTranscript(turns: ProviderConversation['transcript']): TranscriptTurn[] {
  return (turns ?? []).flatMap((turn): TranscriptTurn[] => {
    const text = turn.message?.trim();
    if (!text || (turn.role !== 'user' && turn.role !== 'agent')) return [];
    return [
      {
        role: turn.role === 'user' ? 'seller' : 'prospect',
        text,
        at: Math.max(0, Math.round(turn.time_in_call_secs ?? 0)),
        ...(turn.role === 'agent' && turn.interrupted ? { interrupted: true } : {}),
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
