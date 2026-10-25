import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { eq, sql } from 'drizzle-orm';
import { getAuthContext } from '../lib/auth/service.ts';
import type { AnalysisResult } from '../lib/analysis/schema.ts';
import { getDashboard } from '../lib/dashboard/service.ts';
import type { Db } from '../lib/db/client.ts';
import { simulationAnalyses, simulations, users } from '../lib/db/schema.ts';
import { seedDemoSpace } from '../lib/demo/space.ts';
import { testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

test("l'espace de démo : une équipe fictive complète, des rapports valides, puis plus aucune écriture possible", async () => {
  const { token } = await seedDemoSpace(db, new Date('2026-10-25T12:00:00Z'));
  const auth = await getAuthContext(db, token);
  assert.equal(auth?.user.name, 'Camille Roux');
  assert.equal(auth?.role, 'owner');
  assert.equal(auth?.organization.plan, 'team');
  assert.ok(auth?.user.email.endsWith('.invalid'), 'adresses fictives, impossibles à joindre');

  const results = await db.select({ result: simulationAnalyses.result }).from(simulationAnalyses);
  assert.ok(results.length > 50);
  for (const { result } of results) {
    const r = result as AnalysisResult;
    assert.ok(r.overallScore >= 15 && r.overallScore <= 96);
    // Chaque citation du vendeur figure bien dans sa réplique : rien n'a été retiré par finalizeAnalysis.
    assert.ok(r.skills.every((s) => s.evidence.length > 0), JSON.stringify(r.skills.map((s) => [s.skill, s.evidence.length])));
    assert.ok(r.improvements.length > 0);
    assert.ok(r.recommendedScenarioIds.length > 0);
  }
  const failed = await db.select().from(simulations).where(eq(simulations.status, 'failed'));
  assert.ok(failed.length >= 1);

  const d = await getDashboard(db, auth!);
  assert.ok(d.completedSimulations >= 20);
  assert.equal(d.members, 5);
  // Camille progresse : ses derniers appels sont meilleurs que les premiers.
  const scores = d.scoreHistory.map((h) => h.score);
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  assert.ok(avg(scores.slice(-6)) > avg(scores.slice(0, 6)), scores.join(','));

  await db.execute(sql`set session characteristics as transaction read only`);
  await assert.rejects(db.update(users).set({ name: 'X' }), (e: Error) => /read-only/.test(String(e.cause)));
});
