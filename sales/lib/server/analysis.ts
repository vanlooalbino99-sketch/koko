import 'server-only';
import { after } from 'next/server';
import { analyzerFromEnv } from '@/lib/analysis/claude';
import { analyzeSimulation, getAnalysis } from '@/lib/analysis/service';
import { platformUsage } from '@/lib/billing/credits';
import { isDemo } from '@/lib/server/context';
import { getDb } from '@/lib/server/db';

const RETRYABLE_AFTER_MS = 5 * 60 * 1000;

// Lance l'analyse d'un appel terminé après la réponse HTTP (elle prend plusieurs dizaines de secondes).
// Sans effet si elle est déjà faite, en cours, si la clé Claude n'est pas configurée ou si le plafond
// quotidien d'analyses de la plateforme est atteint (elle reprendra le lendemain, à la visite suivante).
export async function scheduleAnalysis(simulationId: string) {
  if (!analyzerFromEnv() || (await isDemo())) return;
  const db = await getDb();
  const existing = await getAnalysis(db, simulationId);
  const due =
    !existing ||
    (existing.status === 'failed' && existing.attempts < 3) ||
    (existing.status === 'running' && Date.now() - existing.updatedAt.getTime() > RETRYABLE_AFTER_MS);
  if (!due || (await platformUsage(db)).analysisSaturated) return;
  after(async () => {
    const analyzer = analyzerFromEnv();
    if (analyzer) await analyzeSimulation(await getDb(), analyzer, simulationId);
  });
}
