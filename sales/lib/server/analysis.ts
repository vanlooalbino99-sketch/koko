import 'server-only';
import { after } from 'next/server';
import { analyzerFromEnv } from '@/lib/analysis/claude';
import { analyzeSimulation, getAnalysis } from '@/lib/analysis/service';
import { getDb } from '@/lib/db/client';

const RETRYABLE_AFTER_MS = 5 * 60 * 1000;

// Lance l'analyse d'un appel terminé après la réponse HTTP (elle prend plusieurs dizaines de secondes).
// Sans effet si elle est déjà faite, en cours, ou si la clé Claude n'est pas configurée.
export async function scheduleAnalysis(simulationId: string) {
  if (!analyzerFromEnv()) return;
  const existing = await getAnalysis(await getDb(), simulationId);
  const due =
    !existing ||
    (existing.status === 'failed' && existing.attempts < 3) ||
    (existing.status === 'running' && Date.now() - existing.updatedAt.getTime() > RETRYABLE_AFTER_MS);
  if (!due) return;
  after(async () => {
    const analyzer = analyzerFromEnv();
    if (analyzer) await analyzeSimulation(await getDb(), analyzer, simulationId);
  });
}
