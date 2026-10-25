import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { eq } from 'drizzle-orm';
import { simulations, voiceAgents } from '../lib/db/schema.ts';
import type { Db } from '../lib/db/client.ts';
import { getPlayableVersion, listScenarios } from '../lib/scenarios/service.ts';
import { ScenarioMetaSchema } from '../lib/scenarios/content.ts';
import { agentPayload } from '../lib/voice/agent-config.ts';
import {
  finishSimulation,
  getSimulation,
  markSimulationConnected,
  MAX_MARKERS,
  saveMarkers,
  startSimulation,
  syncSimulation,
} from '../lib/simulations/service.ts';
import { creditStatus } from '../lib/billing/credits.ts';
import type { AgentPayload, ProviderConversation, VoiceProvider } from '../lib/voice/provider.ts';
import { joinOrg, newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

// Faux ElevenLabs : enregistre les appels et renvoie des réponses au format de l'API.
let instances = 0;
class FakeProvider implements VoiceProvider {
  // Identifiants uniques d'un test à l'autre, comme chez ElevenLabs (la base est partagée par le fichier).
  readonly prefix = `t${++instances}`;
  agents: AgentPayload[] = [];
  tokens: { agentId: string; participant: string }[] = [];
  conversations = new Map<string, ProviderConversation>();
  failToken = false;
  async createAgent(config: AgentPayload) {
    this.agents.push(config);
    return { agentId: this.agentId(this.agents.length) };
  }
  async getConversationToken(agentId: string, participant: string) {
    if (this.failToken) throw new Error('ElevenLabs GET /v1/convai/conversation/token → 401');
    this.tokens.push({ agentId, participant });
    return { token: `tok_${this.tokens.length}`, conversationId: this.conv(this.tokens.length) };
  }
  agentId(n: number) {
    return `agent_${this.prefix}_${n}`;
  }
  conv(n: number) {
    return `conv_${this.prefix}_${n}`;
  }
  async getConversation(id: string) {
    return this.conversations.get(id) ?? { status: 'in-progress', agent_id: null, transcript: null, metadata: null };
  }
}

let provider: FakeProvider;
beforeEach(() => {
  provider = new FakeProvider();
});

async function firstCatalogScenario(auth: Parameters<typeof listScenarios>[1], language: 'fr' | 'en' = 'fr') {
  const [scenario] = await listScenarios(db, auth, { scope: 'catalog', language });
  return scenario;
}

test('prospect vocal : consigne complète côté serveur, un agent par version, réutilisé', async () => {
  const { auth } = await newUser(db, 'Vera');
  const scenario = await firstCatalogScenario(auth);
  const a = await startSimulation(db, provider, auth, scenario.id);
  assert.equal(a.ok, true);
  const b = await startSimulation(db, provider, auth, scenario.id);
  assert.equal(b.ok, true);
  assert.equal(provider.agents.length, 1, 'le même agent sert aux deux appels');
  const [payload] = provider.agents;
  assert.equal(payload.conversation_config.agent.language, 'fr');
  assert.equal(payload.platform_settings.auth.enable_auth, true, 'seuls nos jetons ouvrent une conversation');
  assert.ok(payload.conversation_config.conversation.max_duration_seconds <= 15 * 60);
  // Les faits cachés sont dans la consigne du prospect (serveur), jamais dans la réponse au navigateur.
  assert.match(payload.conversation_config.agent.prompt.prompt, /Hidden facts/);
  assert.equal(JSON.stringify(a).includes('Hidden'), false);
  // Le nom de participant envoyé à ElevenLabs est l'identifiant de simulation, pas le nom ni l'e-mail.
  assert.ok(a.ok && provider.tokens[0].participant === a.simulationId);
  assert.equal(JSON.stringify(provider.tokens).includes(auth.user.email), false);
});

test('prospect vocal : la voix choisie dans le scénario passe avant la voix par défaut de la langue', async () => {
  const { auth } = await newUser(db, 'Yann');
  const scenario = await firstCatalogScenario(auth);
  const playable = (await getPlayableVersion(db, auth, scenario.id))!;
  const meta = ScenarioMetaSchema.parse(playable.scenario);
  const version = { id: playable.versionId, number: playable.versionNumber };
  assert.equal(agentPayload(meta, playable.content, version).conversation_config.tts.voice_id, undefined);
  assert.equal(agentPayload(meta, playable.content, version, { fr: 'voixLangueFr1' }).conversation_config.tts.voice_id, 'voixLangueFr1');
  const chosen = agentPayload(meta, { ...playable.content, voiceId: 'voixScenario1' }, version, { fr: 'voixLangueFr1' });
  assert.equal(chosen.conversation_config.tts.voice_id, 'voixScenario1');
});

test('prospect vocal : le premier appel précédent passe en récupération quand on en démarre un autre', async () => {
  const { auth } = await newUser(db, 'Hugo');
  const scenario = await firstCatalogScenario(auth);
  const first = await startSimulation(db, provider, auth, scenario.id);
  assert.ok(first.ok);
  await markSimulationConnected(db, auth, first.simulationId, provider.conv(1));
  await startSimulation(db, provider, auth, scenario.id);
  const [row] = await db.select().from(simulations).where(eq(simulations.id, first.simulationId));
  assert.equal(row.status, 'processing');
});

test('session : fin d\'appel, transcription normalisée, durée et coût enregistrés', async () => {
  const { auth } = await newUser(db, 'Nina');
  const scenario = await firstCatalogScenario(auth);
  const started = await startSimulation(db, provider, auth, scenario.id);
  assert.ok(started.ok);
  assert.equal(await markSimulationConnected(db, auth, started.simulationId, 'ignored'), true);
  const [connected] = await db.select().from(simulations).where(eq(simulations.id, started.simulationId));
  assert.equal(connected.status, 'in_progress');
  assert.equal(connected.providerConversationId, provider.conv(1), 'l\'identifiant du serveur prime sur celui du navigateur');
  // L'agent de la version peut venir d'un test précédent : c'est celui enregistré sur la simulation qui compte.
  const agentId = connected.providerAgentId;

  provider.conversations.set(provider.conv(1), {
    status: 'processing',
    agent_id: agentId,
    transcript: null,
    metadata: null,
  });
  const processing = await finishSimulation(db, provider, auth, started.simulationId, 'user');
  assert.equal(processing?.status, 'processing');

  provider.conversations.set(provider.conv(1), {
    status: 'done',
    agent_id: agentId,
    transcript: [
      { role: 'agent', message: 'Allô, oui ?', time_in_call_secs: 0 },
      { role: 'user', message: 'Bonjour, ici Albino de Blackstart.', time_in_call_secs: 2.4 },
      { role: 'agent', message: 'Je suis en plein chantier, faites vite', time_in_call_secs: 6, interrupted: true },
      { role: 'user', message: '  ', time_in_call_secs: 9 },
      { role: 'user', message: 'Deux minutes et je vous laisse.', time_in_call_secs: 9.6 },
    ],
    metadata: { call_duration_secs: 74, cost: 512 },
  });
  const sim = (await getSimulation(db, auth, started.simulationId))!;
  const done = await syncSimulation(db, provider, sim, new Date(Date.now() + 5000));
  assert.equal(done.status, 'completed');
  assert.equal(done.durationSeconds, 74);
  assert.equal(done.providerCost, 512);
  assert.equal(done.endReason, 'user');
  assert.deepEqual(done.transcript, [
    { role: 'prospect', text: 'Allô, oui ?', at: 0 },
    { role: 'seller', text: 'Bonjour, ici Albino de Blackstart.', at: 2 },
    { role: 'prospect', text: 'Je suis en plein chantier, faites vite', at: 6, interrupted: true },
    { role: 'seller', text: 'Deux minutes et je vous laisse.', at: 10 },
  ]);
  // Une simulation terminée n'est plus modifiée par une nouvelle synchronisation.
  provider.conversations.set(provider.conv(1), { status: 'failed', agent_id: agentId, transcript: null, metadata: null });
  assert.equal((await syncSimulation(db, provider, done, new Date(Date.now() + 10_000))).status, 'completed');
  // 74 secondes : 2 crédits débités une seule fois, malgré les synchronisations répétées.
  const credits = await creditStatus(db, auth.organization);
  assert.equal(credits.used, 2);
});

test('session : une conversation d\'un autre agent n\'est jamais rattachée', async () => {
  const { auth } = await newUser(db, 'Omar');
  const scenario = await firstCatalogScenario(auth);
  const started = await startSimulation(db, provider, auth, scenario.id);
  assert.ok(started.ok);
  provider.conversations.set(provider.conv(1), {
    status: 'done',
    agent_id: 'agent_autre',
    transcript: [{ role: 'user', message: 'Conversation de quelqu\'un d\'autre', time_in_call_secs: 1 }],
    metadata: { call_duration_secs: 30 },
  });
  const sim = await finishSimulation(db, provider, auth, started.simulationId, 'user');
  // Jamais connectée : annulée sans aller chercher de transcription.
  assert.equal(sim?.status, 'cancelled');

  const again = await startSimulation(db, provider, auth, scenario.id);
  assert.ok(again.ok);
  await markSimulationConnected(db, auth, again.simulationId, 'conv_x');
  provider.conversations.set(provider.conv(2), { ...provider.conversations.get(provider.conv(1))! });
  const mismatch = await finishSimulation(db, provider, auth, again.simulationId, 'user');
  assert.equal(mismatch?.status, 'failed');
  assert.equal(mismatch?.transcript, null);
});

test('isolation : un autre compte ne voit ni ne termine la simulation', async () => {
  const a = await newUser(db, 'Iris');
  const b = await newUser(db, 'Jules');
  const scenario = await firstCatalogScenario(a.auth);
  const started = await startSimulation(db, provider, a.auth, scenario.id);
  assert.ok(started.ok);
  assert.equal(await getSimulation(db, b.auth, started.simulationId), null);
  assert.equal(await markSimulationConnected(db, b.auth, started.simulationId, provider.conv(1)), false);
  assert.equal(await finishSimulation(db, provider, b.auth, started.simulationId, 'user'), null);
  assert.equal(await saveMarkers(db, b.auth, started.simulationId, [3]), false);
  const [row] = await db.select().from(simulations).where(eq(simulations.id, started.simulationId));
  assert.equal(row.status, 'connecting');
  assert.deepEqual(row.markers, []);
});

test('moments marqués : triés, sans doublon, bornés à la durée d\'un appel', async () => {
  const { auth } = await newUser(db, 'Kim');
  const scenario = await firstCatalogScenario(auth);
  const started = await startSimulation(db, provider, auth, scenario.id);
  assert.ok(started.ok);
  assert.equal(await saveMarkers(db, auth, started.simulationId, [42, 7, 42, -1, 1.5, 9999, 12]), true);
  let [row] = await db.select().from(simulations).where(eq(simulations.id, started.simulationId));
  assert.deepEqual(row.markers, [7, 12, 42]);
  await saveMarkers(db, auth, started.simulationId, Array.from({ length: 80 }, (_, i) => i));
  [row] = await db.select().from(simulations).where(eq(simulations.id, started.simulationId));
  assert.equal(row.markers.length, MAX_MARKERS);
});

test('coûts : plus de crédits ce mois-ci, pas d\'appel ; jeton refusé, simulation en échec', async () => {
  const { auth } = await newUser(db, 'Lina');
  const scenario = await firstCatalogScenario(auth);
  const started = await startSimulation(db, provider, auth, scenario.id);
  assert.ok(started.ok);
  // Appel de 15 minutes : tout le forfait gratuit.
  const [sim] = await db.select().from(simulations).where(eq(simulations.id, started.simulationId));
  provider.conversations.set(provider.conv(1), {
    status: 'done',
    agent_id: sim.providerAgentId,
    transcript: [{ role: 'user', message: 'Bonjour', time_in_call_secs: 1 }],
    metadata: { call_duration_secs: 15 * 60, cost: 1200 },
  });
  // Deux synchronisations simultanées (deux onglets) : un seul débit.
  const [a, b] = await Promise.all([syncSimulation(db, provider, sim), syncSimulation(db, provider, sim)]);
  assert.ok([a.status, b.status].includes('completed'));
  const credits = await creditStatus(db, auth.organization);
  assert.equal(credits.used, 15);
  assert.equal(credits.remaining, 0);
  assert.deepEqual(await startSimulation(db, provider, auth, scenario.id), { ok: false, error: 'quota_exceeded' });

  const other = await newUser(db, 'Malo');
  provider.failToken = true;
  const failed = await startSimulation(db, provider, other.auth, scenario.id);
  assert.deepEqual(failed, { ok: false, error: 'provider_error' });
  const rows = await db.select().from(simulations).where(eq(simulations.userId, other.auth.user.id));
  assert.equal(rows[0].status, 'failed');
});

test('scénario privé d\'une autre organisation ou archivé : impossible à jouer', async () => {
  const { auth } = await newUser(db, 'Paul');
  assert.deepEqual(await startSimulation(db, provider, auth, '00000000-0000-0000-0000-000000000000'), { ok: false, error: 'not_found' });
  assert.equal(provider.agents.length, 0);
});

test('consigne : règles du jeu avant le scénario, contenu balisé, langue imposée', async () => {
  const { auth } = await newUser(db, 'Rita');
  const scenario = await firstCatalogScenario(auth, 'en');
  await startSimulation(db, provider, auth, scenario.id);
  const prompt = provider.agents[0].conversation_config.agent.prompt.prompt;
  assert.ok(prompt.indexOf('# Rules') < prompt.indexOf('<scenario>'));
  assert.match(prompt, /Speak only English/);
  assert.match(prompt, /Never say or hint that you are an AI/);
  const [stored] = await db.select().from(voiceAgents).where(eq(voiceAgents.agentId, provider.agentId(1)));
  assert.ok(stored, 'l\'agent est enregistré pour sa version');
});

test('coûts : un appel à la fois dans l\'offre gratuite, garde-fou mensuel de la plateforme', async () => {
  const owner = await newUser(db, 'Sacha');
  const colleague = await joinOrg(db, owner.auth.organization.id, 'member', 'Tess');
  const scenario = await firstCatalogScenario(owner.auth);
  const first = await startSimulation(db, provider, owner.auth, scenario.id);
  assert.ok(first.ok);
  assert.deepEqual(await startSimulation(db, provider, colleague, scenario.id), { ok: false, error: 'concurrent_limit' });

  const solo = await newUser(db, 'Ugo');
  process.env.PLATFORM_MONTHLY_MINUTES = '0';
  try {
    assert.deepEqual(await startSimulation(db, provider, solo.auth, scenario.id), { ok: false, error: 'platform_saturated' });
  } finally {
    delete process.env.PLATFORM_MONTHLY_MINUTES;
  }
  assert.ok((await startSimulation(db, provider, solo.auth, scenario.id)).ok);
});
