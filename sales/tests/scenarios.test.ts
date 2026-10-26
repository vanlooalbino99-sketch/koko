import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { eq } from 'drizzle-orm';
import { memberships, scenarioVersions, scenarios } from '../lib/db/schema.ts';
import { syncCatalog } from '../lib/scenarios/catalog-sync.ts';
import { CATALOG } from '../lib/scenarios/catalog.ts';
import { ScenarioInputSchema, type ScenarioInput } from '../lib/scenarios/content.ts';
import {
  archiveScenario,
  createScenario,
  ForbiddenError,
  getScenario,
  listScenarios,
  recommendScenarios,
  updateScenario,
} from '../lib/scenarios/service.ts';
import { getAuthContext } from '../lib/auth/service.ts';
import type { Db } from '../lib/db/client.ts';
import { newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const input = (title = 'Vendre un audit SEO'): ScenarioInput => ({
  meta: {
    title,
    summary: 'Scénario interne pour l\'équipe.',
    industry: 'Commerce',
    family: 'discovery',
    difficulty: 'intermediate',
    language: 'fr',
    channel: 'phone',
    estimatedMinutes: 8,
  },
  content: {
    objective: 'Obtenir un rendez-vous.',
    context: '',
    offer: { name: 'Audit SEO', description: '', price: '900 €' },
    prospect: {
      name: 'Paul',
      role: 'Gérant',
      company: 'Boutique Paul',
      companySize: '3 personnes',
      personality: 'skeptical',
      decisionPower: 'decider',
      publicProfile: '',
    },
    need: 'Plus de visites en boutique.',
    budget: '1 000 €',
    objections: ['Trop cher.'],
    constraints: [],
    hiddenFacts: ['Son concurrent vient d\'ouvrir en face.'],
    successCriteria: ['Rendez-vous fixé.'],
    endConditions: [],
    skillWeights: { needs_discovery: 5 },
  },
});

test('validation : un scénario doit évaluer au moins une compétence', () => {
  assert.equal(ScenarioInputSchema.safeParse(input()).success, true);
  const none = input();
  none.content.skillWeights = { closing: 0 };
  const parsed = ScenarioInputSchema.safeParse(none);
  assert.equal(parsed.success, false);
  assert.deepEqual(parsed.error?.issues.map((i) => [i.path.join('.'), i.message]), [['content.skillWeights', 'skill_weights_empty']]);
});

test('catalogue : 24 scénarios publics FR et EN, resynchronisation sans doublon', async () => {
  const rows = await db.select().from(scenarios);
  assert.equal(rows.length, CATALOG.length);
  assert.equal(CATALOG.length, 24);
  assert.deepEqual(await syncCatalog(db), { created: 0, updated: 0 });
  assert.equal((await db.select().from(scenarioVersions)).length, CATALOG.length);
});

test('catalogue : les informations cachées ne sont jamais renvoyées à l\'apprenant', async () => {
  const { auth } = await newUser(db, 'Lea');
  const [first] = await listScenarios(db, auth, { scope: 'catalog' });
  const detail = await getScenario(db, auth, first.id);
  assert.ok(detail);
  assert.equal(detail.showsHidden, false);
  assert.equal('hiddenFacts' in detail.content, false);
  assert.equal('endConditions' in detail.content, false);
  assert.equal(detail.canEdit, false);
});

test('isolation : un scénario privé est invisible pour une autre organisation', async () => {
  const a = await newUser(db, 'Anna');
  const b = await newUser(db, 'Boris');
  const id = await createScenario(db, a.auth, input());
  const own = await getScenario(db, a.auth, id);
  assert.ok(own?.showsHidden, 'l\'auteur voit les infos cachées de son propre scénario');
  assert.equal(await getScenario(db, b.auth, id), null);
  assert.equal((await listScenarios(db, b.auth, { scope: 'private' })).length, 0);
  assert.ok((await listScenarios(db, b.auth)).every((s) => s.id !== id));
  await assert.rejects(updateScenario(db, b.auth, id, input('Piraté')), ForbiddenError);
  await assert.rejects(archiveScenario(db, b.auth, id), ForbiddenError);
  const [still] = await db.select().from(scenarios).where(eq(scenarios.id, id));
  assert.equal(still.title, 'Vendre un audit SEO');
  assert.equal(still.status, 'active');
});

test('rôles : un simple membre ne crée ni ne modifie de scénario et ne voit pas les infos cachées', async () => {
  const owner = await newUser(db, 'Olga');
  const member = await newUser(db, 'Marc');
  const id = await createScenario(db, owner.auth, input());
  // Marc rejoint l'organisation d'Olga comme simple membre.
  await db.insert(memberships).values({ organizationId: owner.auth.organization.id, userId: member.auth.user.id, role: 'member' });
  const memberAuth = { ...(await getAuthContext(db, member.token))!, organization: owner.auth.organization, role: 'member' as const };
  await assert.rejects(createScenario(db, memberAuth, input()), ForbiddenError);
  await assert.rejects(updateScenario(db, memberAuth, id, input()), ForbiddenError);
  const seen = await getScenario(db, memberAuth, id);
  assert.ok(seen);
  assert.equal(seen.showsHidden, false);
  assert.equal('hiddenFacts' in seen.content, false);
});

test('versions : une modification crée la version 2 et garde la version 1', async () => {
  const { auth } = await newUser(db, 'Victor');
  const id = await createScenario(db, auth, input());
  assert.equal(await updateScenario(db, auth, id, input('Vendre un audit SEO local')), 2);
  const versions = await db.select().from(scenarioVersions).where(eq(scenarioVersions.scenarioId, id));
  assert.deepEqual(versions.map((v) => v.version).sort(), [1, 2]);
  const detail = await getScenario(db, auth, id);
  assert.equal(detail?.scenario.title, 'Vendre un audit SEO local');
  await archiveScenario(db, auth, id);
  assert.ok((await listScenarios(db, auth)).every((s) => s.id !== id));
});

test('recherche et filtres : texte échappé, langue, difficulté', async () => {
  const { auth } = await newUser(db, 'Sam');
  const fr = await listScenarios(db, auth, { language: 'fr', scope: 'catalog' });
  assert.equal(fr.length, 12);
  assert.ok(fr.every((s) => s.language === 'fr'));
  const experts = await listScenarios(db, auth, { difficulty: 'expert' });
  assert.ok(experts.length > 0 && experts.every((s) => s.difficulty === 'expert'));
  assert.equal((await listScenarios(db, auth, { q: 'a%_b' })).length, 0, '% et _ sont cherchés tels quels');
  assert.ok((await listScenarios(db, auth, { q: 'plombier' })).length >= 1);
  assert.equal(await getScenario(db, auth, 'pas-un-uuid'), null);
});

test('recommandations : objectifs et niveau de l\'utilisateur', async () => {
  const { auth } = await newUser(db, 'Rita');
  const picks = await recommendScenarios(db, auth, { goals: ['negotiation', 'closing'], experience: 'expert' }, 'fr');
  assert.equal(picks.length, 3);
  assert.ok(picks.every((p) => p.scenario.language === 'fr'));
  assert.ok(['negotiation', 'closing'].includes(picks[0].scenario.family));
  assert.equal(picks[0].scenario.difficulty, 'expert');
});
