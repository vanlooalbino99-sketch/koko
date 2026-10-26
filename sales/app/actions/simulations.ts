'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { analyzerFromEnv } from '@/lib/analysis/claude';
import { getAnalysis, requestReanalysis } from '@/lib/analysis/service';
import { platformUsage } from '@/lib/billing/credits';
import { getDb } from '@/lib/server/db';
import {
  finishSimulation,
  getSimulation,
  markSimulationConnected,
  saveMarkers,
  startSimulation,
  syncSimulation,
  type DrillRequest,
  type StartResult,
} from '@/lib/simulations/service';
import { scheduleAnalysis } from '@/lib/server/analysis';
import { isDemo, refuseInDemo, requireAuth } from '@/lib/server/context';
import { voiceProviderFromEnv } from '@/lib/voice/provider';
import { resolvedVoices } from '@/lib/voice/voices';

export async function startSimulationAction(scenarioId: string, drill?: DrillRequest): Promise<StartResult | { ok: false; error: 'not_configured' }> {
  const auth = await requireAuth();
  const provider = voiceProviderFromEnv();
  // Démo : aucun appel n'est lancé (ni payé) ; l'écran d'appel l'annonce déjà.
  if (!provider || auth.demo) return { ok: false, error: 'not_configured' };
  // Seule la référence de l'appel d'origine vient du navigateur : le texte de l'exercice est relu par le serveur.
  const request: DrillRequest | undefined =
    drill?.kind === 'moment'
      ? { kind: 'moment', from: String(drill.from), moment: Number(drill.moment) }
      : drill?.kind === 'resume'
        ? { kind: 'resume', from: String(drill.from) }
        : undefined;
  return startSimulation(await getDb(), provider, auth, String(scenarioId), await resolvedVoices(), request);
}

export async function markConnectedAction(simulationId: string, conversationId: string): Promise<boolean> {
  const auth = await requireAuth();
  if (auth.demo) return false;
  return markSimulationConnected(await getDb(), auth, String(simulationId), String(conversationId ?? ''));
}

export async function saveMarkersAction(simulationId: string, markers: number[]): Promise<boolean> {
  const auth = await requireAuth();
  if (auth.demo || !Array.isArray(markers)) return false;
  return saveMarkers(await getDb(), auth, String(simulationId), markers.slice(0, 200).map(Number));
}

export async function finishSimulationAction(
  simulationId: string,
  reason: 'user' | 'agent' | 'error',
  errorMessage?: string,
): Promise<{ status: string } | null> {
  const auth = await requireAuth();
  if (auth.demo) return null;
  const safeReason = reason === 'agent' || reason === 'error' ? reason : 'user';
  const sim = await finishSimulation(
    await getDb(),
    voiceProviderFromEnv(),
    auth,
    String(simulationId),
    safeReason,
    typeof errorMessage === 'string' ? errorMessage : undefined,
  );
  if (sim?.status === 'completed') await scheduleAnalysis(sim.id);
  return sim && { status: sim.status };
}

// Interrogée par la page d'une simulation tant que la transcription ou l'analyse n'est pas prête.
export async function refreshSimulationAction(simulationId: string): Promise<{ status: string; analysis: string | null } | null> {
  const auth = await requireAuth();
  const db = await getDb();
  const sim = await getSimulation(db, auth, String(simulationId));
  if (!sim) return null;
  const provider = (await isDemo()) ? null : voiceProviderFromEnv();
  const synced = provider ? await syncSimulation(db, provider, sim) : sim;
  if (synced.status === 'completed') await scheduleAnalysis(synced.id);
  const analysis = await getAnalysis(db, synced.id);
  return { status: synced.status, analysis: analysis?.status ?? null };
}

// « Régénérer » dans le rapport : nouvelle analyse de Claude, dans la limite des tentatives par appel.
export async function regenerateAnalysisAction(formData: FormData) {
  await refuseInDemo();
  const auth = await requireAuth();
  const id = String(formData.get('simulation') ?? '');
  const db = await getDb();
  const sim = await getSimulation(db, auth, id);
  if (!sim) redirect('/simulations');
  // Plafond quotidien atteint : on garde le rapport actuel plutôt que de le masquer jusqu'au lendemain.
  const ready = analyzerFromEnv() !== null && !(await platformUsage(db)).analysisSaturated;
  if (sim.status === 'completed' && ready && (await requestReanalysis(db, sim.id))) await scheduleAnalysis(sim.id);
  revalidatePath(`/simulations/${sim.id}`);
  redirect(`/simulations/${sim.id}`);
}
