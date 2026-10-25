import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { and, eq } from 'drizzle-orm';
import { getAuthContext, logIn, type AuthContext } from '../lib/auth/service.ts';
import { seatsInUse } from '../lib/billing/service.ts';
import type { Db } from '../lib/db/client.ts';
import { billingAccounts, memberships, missions, organizations, sessions, simulationAnalyses, simulations } from '../lib/db/schema.ts';
import { acceptInvitation, createInvitation, inspectInvitation, listInvitations, revokeInvitation } from '../lib/organization/invitations.ts';
import {
  changeMemberRole,
  leaveOrganization,
  listMyOrganizations,
  removeMember,
  switchOrganization,
  TeamError,
} from '../lib/organization/service.ts';
import { ScenarioInputSchema } from '../lib/scenarios/content.ts';
import { createScenario, getPlayableVersion, listScenarios } from '../lib/scenarios/service.ts';
import { createMissions, deleteMission, listMyMissions, listTeamMissions, teamOverview } from '../lib/team/service.ts';
import { joinOrg, newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

const DAY = 24 * 60 * 60 * 1000;

// Une organisation abonnée à l'offre Équipe, comme après le webhook Stripe.
async function teamOrg(name: string, seats: number) {
  const owner = await newUser(db, name);
  const orgId = owner.auth.organization.id;
  await db.update(organizations).set({ plan: 'team', kind: 'team', name: `Équipe ${name}` }).where(eq(organizations.id, orgId));
  await db.insert(billingAccounts).values({ organizationId: orgId, stripeCustomerId: `cus_${orgId}`, stripeSubscriptionId: `sub_${orgId}`, plan: 'team', status: 'active', seats });
  return { ...owner, auth: (await getAuthContext(db, owner.token))!, orgId };
}

async function rejects(promise: Promise<unknown>, code: string) {
  await assert.rejects(promise, (err) => err instanceof TeamError && err.code === code);
}

test('invitations : offre Équipe exigée, sièges comptés, lien remplacé, rôles autorisés', async () => {
  const solo = await newUser(db, 'Solène');
  await rejects(createInvitation(db, solo.auth, { email: 'x@example.com', role: 'member' }), 'plan_required');

  const { auth, orgId } = await teamOrg('Hugo', 3);
  const first = await createInvitation(db, auth, { email: 'Ana@Example.com'.toLowerCase(), role: 'member' });
  await createInvitation(db, auth, { email: 'ben@example.com', role: 'manager' });
  assert.equal(await seatsInUse(db, orgId), 3);
  await rejects(createInvitation(db, auth, { email: 'chloe@example.com', role: 'member' }), 'no_seat');

  // Nouveau lien pour Ana : l'ancien ne vaut plus rien et aucun siège de plus n'est pris.
  const second = await createInvitation(db, auth, { email: 'ana@example.com', role: 'admin' });
  assert.equal(await inspectInvitation(db, first), null);
  assert.equal(await seatsInUse(db, orgId), 3);
  const view = await inspectInvitation(db, second);
  assert.deepEqual(
    { status: view?.status, organizationName: view?.organizationName, role: view?.role, inviterName: view?.inviterName },
    { status: 'valid', organizationName: 'Équipe Hugo', role: 'admin', inviterName: 'Hugo' },
  );

  // Retirer une invitation libère son siège.
  const pending = await listInvitations(db, auth);
  assert.equal(pending.length, 2);
  await revokeInvitation(db, auth, pending.find((i) => i.email === 'ben@example.com')!.id);
  assert.equal(await seatsInUse(db, orgId), 2);

  const member = await joinOrg(db, orgId, 'member', 'Momo');
  await rejects(createInvitation(db, member, { email: 'y@example.com', role: 'member' }), 'forbidden');
  const admin = await joinOrg(db, orgId, 'admin', 'Adèle');
  await rejects(createInvitation(db, admin, { email: 'y@example.com', role: 'admin' }), 'invalid_role');
  await rejects(createInvitation(db, auth, { email: member.user.email, role: 'member' }), 'already_member');
});

test('invitations : acceptées par le bon compte seulement, une seule fois, avant expiration', async () => {
  const { auth, orgId } = await teamOrg('Iris', 5);
  const invited = await newUser(db, 'Jade');
  const other = await newUser(db, 'Karl');
  const token = await createInvitation(db, auth, { email: invited.email, role: 'manager' });

  await rejects(acceptInvitation(db, other.auth, token), 'wrong_account');
  await rejects(acceptInvitation(db, invited.auth, token, new Date(Date.now() + 8 * DAY)), 'expired');
  await rejects(acceptInvitation(db, invited.auth, 'x'.repeat(43)), 'not_found');

  assert.equal(await acceptInvitation(db, invited.auth, token), orgId);
  const session = (await getAuthContext(db, invited.token))!;
  assert.equal(session.organization.id, orgId);
  assert.equal(session.role, 'manager');
  assert.equal((await inspectInvitation(db, token))?.status, 'used');
  await rejects(acceptInvitation(db, invited.auth, token), 'used');
  // Le siège est désormais celui du membre, pas compté deux fois.
  assert.equal(await seatsInUse(db, orgId), 2);

  // Deux espaces : à la connexion, celui de l'équipe ; on peut revenir à l'espace personnel.
  const orgs = await listMyOrganizations(db, invited.auth.user.id);
  assert.deepEqual(orgs.map((o) => o.id), [orgId, invited.auth.organization.id]);
  const login = await logIn(db, invited.email, 'motdepasse-solide');
  assert.equal((await getAuthContext(db, login!.token))?.organization.id, orgId);
  assert.ok(await switchOrganization(db, session, invited.auth.organization.id));
  assert.equal((await getAuthContext(db, invited.token))?.organization.id, invited.auth.organization.id);
  assert.equal(await switchOrganization(db, session, (await newUser(db, 'Léo')).auth.organization.id), false);

  // L'équipe repasse en offre gratuite : un lien encore valable ne fait plus entrer personne.
  const late = await newUser(db, 'Lou');
  const lateToken = await createInvitation(db, auth, { email: late.email, role: 'member' });
  await db.update(organizations).set({ plan: 'free' }).where(eq(organizations.id, orgId));
  await rejects(acceptInvitation(db, late.auth, lateToken), 'plan_required');
  await db.update(organizations).set({ plan: 'team' }).where(eq(organizations.id, orgId));
});

test('rôles : le propriétaire nomme les admins, un admin gère managers et membres, personne ne se modifie', async () => {
  const { auth: owner, orgId } = await teamOrg('Mia', 6);
  const admin = await joinOrg(db, orgId, 'admin', 'Nora');
  const admin2 = await joinOrg(db, orgId, 'admin', 'Omar');
  const manager = await joinOrg(db, orgId, 'manager', 'Paul');
  const member = await joinOrg(db, orgId, 'member', 'Quentin');

  await rejects(changeMemberRole(db, admin, admin2.user.id, 'member'), 'forbidden');
  await rejects(changeMemberRole(db, admin, owner.user.id, 'member'), 'forbidden');
  await rejects(changeMemberRole(db, admin, member.user.id, 'admin'), 'invalid_role');
  await rejects(changeMemberRole(db, admin, admin.user.id, 'member'), 'forbidden');
  await rejects(changeMemberRole(db, manager, member.user.id, 'manager'), 'forbidden');
  await rejects(changeMemberRole(db, owner, member.user.id, 'owner'), 'invalid_role');
  await changeMemberRole(db, admin, member.user.id, 'manager');
  await changeMemberRole(db, owner, admin2.user.id, 'member');
  const roles = await db.select({ userId: memberships.userId, role: memberships.role }).from(memberships).where(eq(memberships.organizationId, orgId));
  assert.equal(roles.find((r) => r.userId === member.user.id)?.role, 'manager');
  assert.equal(roles.find((r) => r.userId === admin2.user.id)?.role, 'member');

  // Retirer un membre ferme ses sessions dans l'espace et supprime ses missions.
  const [scenario] = await listScenarios(db, owner, { scope: 'catalog', language: 'fr' });
  await createMissions(db, owner, { scenarioId: scenario.id, assignee: admin2.user.id });
  await rejects(removeMember(db, manager, admin2.user.id), 'forbidden');
  await removeMember(db, admin, admin2.user.id);
  assert.equal((await db.select().from(sessions).where(and(eq(sessions.userId, admin2.user.id), eq(sessions.organizationId, orgId)))).length, 0);
  assert.equal((await db.select().from(missions).where(eq(missions.assigneeId, admin2.user.id))).length, 0);
  await rejects(removeMember(db, admin, owner.user.id), 'forbidden');

  // Un membre peut partir et retrouve son espace personnel ; le propriétaire ne peut pas.
  const personal = await leaveOrganization(db, manager);
  assert.notEqual(personal, orgId);
  assert.equal((await db.select().from(memberships).where(and(eq(memberships.organizationId, orgId), eq(memberships.userId, manager.user.id)))).length, 0);
  await rejects(leaveOrganization(db, owner), 'forbidden');
});

test('missions : attribuées par un responsable, remplies par un appel terminé après attribution', async () => {
  const { auth: owner, orgId } = await teamOrg('Rose', 6);
  const manager = await joinOrg(db, orgId, 'manager', 'Sam');
  const member = await joinOrg(db, orgId, 'member', 'Théo');
  const member2 = await joinOrg(db, orgId, 'member', 'Ugo');
  const [scenario] = await listScenarios(db, owner, { scope: 'catalog', language: 'fr', family: 'cold_call' });
  const playable = (await getPlayableVersion(db, owner, scenario.id))!;

  await rejects(createMissions(db, member, { scenarioId: scenario.id, assignee: member2.user.id }), 'forbidden');
  const outsider = await newUser(db, 'Vera');
  const foreign = await createScenario(db, outsider.auth, ScenarioInputSchema.parse(privateScenario()));
  await rejects(createMissions(db, manager, { scenarioId: foreign, assignee: member.user.id }), 'not_found');
  await rejects(createMissions(db, manager, { scenarioId: scenario.id, assignee: outsider.auth.user.id }), 'not_found');
  await rejects(createMissions(db, manager, { scenarioId: scenario.id, assignee: member.user.id, dueDate: '2001-01-01' }), 'invalid_date');

  // Un appel fait avant l'attribution ne remplit pas la mission.
  await completedCall(member, playable.versionId, 40, new Date(Date.now() - DAY));
  const due = new Date(Date.now() + 2 * DAY).toISOString().slice(0, 10);
  assert.equal(await createMissions(db, manager, { scenarioId: scenario.id, assignee: member.user.id, dueDate: due, note: 'Avant vendredi' }), 1);
  let mine = await listMyMissions(db, member);
  assert.equal(mine.length, 1);
  assert.equal(mine[0].status, 'todo');
  assert.equal(mine[0].assignedByName, 'Sam');
  assert.equal((await listMyMissions(db, member, new Date(Date.now() + 3 * DAY)))[0].status, 'overdue');

  await completedCall(member, playable.versionId, 72);
  mine = await listMyMissions(db, member);
  assert.equal(mine[0].status, 'done');
  assert.equal(mine[0].score, 72);

  // Toute l'équipe sauf la personne qui attribue.
  assert.equal(await createMissions(db, manager, { scenarioId: scenario.id, assignee: 'all' }), 3);
  assert.equal((await listMyMissions(db, manager)).length, 0);
  const team = await listTeamMissions(db, manager);
  assert.equal(team.length, 4);
  assert.deepEqual(await listTeamMissions(db, member), []);
  await deleteMission(db, manager, team[0].id);
  assert.equal((await listTeamMissions(db, owner)).length, 3);
  await rejects(deleteMission(db, member, team[1].id), 'forbidden');

  const solo = await newUser(db, 'Wendy');
  await rejects(createMissions(db, solo.auth, { scenarioId: scenario.id, assignee: 'all' }), 'plan_required');
});

test('tableau d\'équipe : appels, minutes, score moyen et compétence la plus faible des 30 derniers jours', async () => {
  const { auth: owner, orgId } = await teamOrg('Xavier', 4);
  const member = await joinOrg(db, orgId, 'member', 'Yasmine');
  await joinOrg(db, orgId, 'member', 'Zoé');
  const [scenario] = await listScenarios(db, owner, { scope: 'catalog', language: 'fr' });
  const versionId = (await getPlayableVersion(db, owner, scenario.id))!.versionId;

  const a = await completedCall(member, versionId, 60, new Date(), 150);
  await analysed(a, [['closing', 40], ['questioning', 80]]);
  const b = await completedCall(member, versionId, 80, new Date(), 90);
  await analysed(b, [['closing', 50], ['questioning', 70], ['opening', 90]]);
  // Hors période : ne compte pas.
  await completedCall(member, versionId, 10, new Date(Date.now() - 40 * DAY), 600);

  const overview = (await teamOverview(db, owner))!;
  const y = overview.members.find((m) => m.id === member.user.id)!;
  assert.deepEqual(
    { calls: y.calls, minutes: y.minutes, averageScore: y.averageScore, weakest: y.weakestSkill },
    { calls: 2, minutes: 4, averageScore: 70, weakest: { skill: 'closing', score: 45 } },
  );
  const z = overview.members.find((m) => m.name === 'Zoé')!;
  assert.deepEqual({ calls: z.calls, averageScore: z.averageScore, weakest: z.weakestSkill }, { calls: 0, averageScore: null, weakest: null });
  assert.deepEqual(overview.totals, { calls: 2, minutes: 4, averageScore: 70, activeMembers: 1 });
  assert.deepEqual(overview.skills, [
    { skill: 'opening', score: 90 },
    { skill: 'questioning', score: 75 },
    { skill: 'closing', score: 45 },
  ]);
  assert.equal(await teamOverview(db, member), null);
});

async function completedCall(auth: AuthContext, scenarioVersionId: string, score: number, createdAt = new Date(), durationSeconds = 120) {
  const [sim] = await db
    .insert(simulations)
    .values({
      organizationId: auth.organization.id,
      userId: auth.user.id,
      scenarioVersionId,
      status: 'completed',
      durationSeconds,
      overallScore: score,
      createdAt,
    })
    .returning();
  return sim;
}

async function analysed(sim: { id: string }, skills: [string, number][]) {
  await db.insert(simulationAnalyses).values({
    simulationId: sim.id,
    status: 'completed',
    result: { skills: skills.map(([skill, score]) => ({ skill, score, justification: '…', evidence: [] })) },
  });
}

function privateScenario() {
  return {
    meta: {
      title: 'Relance d’un devis',
      summary: 'Relancer un devis envoyé la semaine dernière.',
      industry: 'BTP',
      family: 'follow_up',
      difficulty: 'beginner',
      language: 'fr',
      channel: 'phone',
      estimatedMinutes: 5,
    },
    content: {
      objective: 'Obtenir une date de décision.',
      context: 'Devis envoyé il y a huit jours.',
      offer: { name: 'Standard IA', description: 'Répond aux appels manqués.', price: '49 € / mois' },
      prospect: {
        name: 'Sophie Martin',
        role: 'Gérante',
        company: 'Martin Rénovation',
        companySize: '8 salariés',
        personality: 'busy',
        decisionPower: 'decider',
        publicProfile: '',
      },
      need: 'Ne plus rater d’appels.',
      budget: '50 € par mois',
      objections: ['Pas le temps'],
      constraints: [],
      hiddenFacts: ['A déjà un devis concurrent'],
      successCriteria: ['Date de décision obtenue'],
      endConditions: [],
      skillWeights: { closing: 3 },
    },
  };
}
