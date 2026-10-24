'use server';

import { getDb } from '@/lib/db/client';
import {
  finishSimulation,
  getSimulation,
  markSimulationConnected,
  startSimulation,
  syncSimulation,
  type StartResult,
} from '@/lib/simulations/service';
import { requireAuth } from '@/lib/server/context';
import { voiceProviderFromEnv } from '@/lib/voice/provider';
import { configuredVoices } from '@/lib/voice/voices';

export async function startSimulationAction(scenarioId: string): Promise<StartResult | { ok: false; error: 'not_configured' }> {
  const auth = await requireAuth();
  const provider = voiceProviderFromEnv();
  if (!provider) return { ok: false, error: 'not_configured' };
  return startSimulation(await getDb(), provider, auth, String(scenarioId), configuredVoices());
}

export async function markConnectedAction(simulationId: string, conversationId: string): Promise<boolean> {
  const auth = await requireAuth();
  return markSimulationConnected(await getDb(), auth, String(simulationId), String(conversationId ?? ''));
}

export async function finishSimulationAction(
  simulationId: string,
  reason: 'user' | 'agent' | 'error',
  errorMessage?: string,
): Promise<{ status: string } | null> {
  const auth = await requireAuth();
  const safeReason = reason === 'agent' || reason === 'error' ? reason : 'user';
  const sim = await finishSimulation(
    await getDb(),
    voiceProviderFromEnv(),
    auth,
    String(simulationId),
    safeReason,
    typeof errorMessage === 'string' ? errorMessage : undefined,
  );
  return sim && { status: sim.status };
}

// Interrogée par la page d'une simulation tant que la transcription n'est pas prête.
export async function refreshSimulationAction(simulationId: string): Promise<{ status: string } | null> {
  const auth = await requireAuth();
  const db = await getDb();
  const sim = await getSimulation(db, auth, String(simulationId));
  if (!sim) return null;
  const provider = voiceProviderFromEnv();
  const synced = provider ? await syncSimulation(db, provider, sim) : sim;
  return { status: synced.status };
}
