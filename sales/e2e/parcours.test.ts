// Parcours complet dans un vrai navigateur, contre « next start » et une base PGlite jetable :
// inscription, onboarding, dashboard, catalogue, création et modification d'un scénario, langue,
// déconnexion et reconnexion, puis isolation entre deux comptes ; appel vocal ; rapport d'analyse de Claude.
// Prérequis : npm run build. BS_SHOTS=dossier pour enregistrer des captures d'écran.
import assert from 'node:assert/strict';
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { chromium, type Browser, type Page } from 'playwright';
import type { ClaudeAnalysis } from '../lib/analysis/schema.ts';
import { getAuthContext, signUp as createAccount } from '../lib/auth/service.ts';
import { connectPglite } from '../lib/db/client.ts';
import { simulations, type TranscriptTurn } from '../lib/db/schema.ts';
import type { Skill } from '../lib/domain.ts';
import { OnboardingSchema, saveProfile } from '../lib/profile/service.ts';
import { getPlayableVersion, listScenarios } from '../lib/scenarios/service.ts';

const PORT = 3000 + Math.floor(Math.random() * 1000) + 400;
const BASE = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.BS_SHOTS;
const dataDir = mkdtempSync(join(tmpdir(), 'bs-sales-e2e-'));
let server: ChildProcess;

// Faux ElevenLabs : l'application lui parle comme à la vraie API (création d'agent, jeton, conversation).
// La connexion audio du navigateur, elle, part vers ElevenLabs avec un faux jeton et échoue : on teste ce cas.
const MOCK_PORT = PORT + 1;
const mockCalls: { method: string; url: string; key?: string; body: string }[] = [];
let mock: Server;
let browser: Browser;
// Dernière page ouverte : capturée à la fin pour comprendre un échec.
let lastPage: Page | undefined;

// Faux Claude, sur le même serveur : renvoie l'analyse préparée par seedCompletedCall, après un délai
// pour que la page montre d'abord l'analyse en cours.
let claudeAnswer = '';
const report = { email: `romain.${Date.now()}@example.com`, simulationId: '', scenarioId: '', expectedScore: 0 };

const TRANSCRIPT: TranscriptTurn[] = [
  { role: 'prospect', text: 'Allô, oui ?', at: 0 },
  { role: 'seller', text: 'Bonjour Monsieur Lefèvre, je vous appelle au sujet des appels manqués, vous avez deux minutes ?', at: 2 },
  { role: 'prospect', text: 'Deux minutes, pas plus, je suis sur un chantier.', at: 9, interrupted: true },
  { role: 'seller', text: "Combien d'appels pensez-vous rater par semaine quand vous êtes en intervention ?", at: 13 },
  { role: 'prospect', text: 'Une dizaine, peut-être plus.', at: 18 },
  { role: 'seller', text: 'Je vous propose une démo de vingt minutes jeudi à 18 heures, ça vous va ?', at: 22 },
];

// Un appel terminé, écrit directement en base avant le démarrage du serveur : le navigateur ne peut pas
// établir de vraie liaison audio ici, mais tout ce qui suit l'appel (analyse, rapport) est réel.
async function seedCompletedCall() {
  const { db, close } = await connectPglite(dataDir);
  try {
    const res = await createAccount(db, { name: 'Romain Rapport', email: report.email, password: 'motdepasse-solide', locale: 'fr' });
    if (!res.ok) throw new Error(res.error);
    const auth = (await getAuthContext(db, res.token))!;
    await saveProfile(db, auth, OnboardingSchema.parse({ persona: 'freelance', experience: 'intermediate', goals: ['closing'] }));
    const catalog = await listScenarios(db, auth, { scope: 'catalog', language: 'fr', family: 'cold_call' });
    const scenario = catalog.find((x) => /plombier/i.test(x.title))!;
    const playable = (await getPlayableVersion(db, auth, scenario.id))!;
    const weights = playable.content.skillWeights as Partial<Record<Skill, number>>;
    const skills = (Object.keys(weights) as Skill[]).filter((k) => (weights[k] ?? 0) > 0);
    const answer: ClaudeAnalysis = {
      summary: 'Accroche directe et question chiffrée, mais la démo est proposée avant d’avoir creusé le besoin.',
      outcome: 'postponed',
      skills: skills.map((skill, i) => ({
        skill,
        score: 35 + i * 9,
        justification: `Justification de la note ${skill}.`,
        evidence:
          i === 0
            ? [
                { turn: 3, quote: "Combien d'appels pensez-vous rater par semaine" },
                { turn: 3, quote: 'Citation inventée qui ne figure nulle part' },
              ]
            : [],
      })),
      successCriteria: [{ criterion: 'Obtenir un créneau de démo', met: false, evidence: 'Proposé, pas accepté.' }],
      hiddenFacts: [{ fact: 'Une dizaine d’appels manqués par semaine', uncovered: true, howToUncover: 'Déjà découvert.' }],
      objections: [{ objection: 'Pas le temps', handling: 'partly', comment: 'Reconnue mais pas traitée.' }],
      strengths: ['Question chiffrée sur les appels manqués'],
      improvements: [
        { turn: 5, said: 'Je vous propose une démo de vingt minutes jeudi', better: 'Qu’est-ce qui vous arrangerait cette semaine ?', why: 'Laisser le prospect choisir.' },
        { turn: 1, said: 'Phrase jamais prononcée par le vendeur', better: '…', why: '…' },
      ],
      focusSkills: ['needs_discovery'],
    };
    claudeAnswer = JSON.stringify(answer);
    const total = skills.reduce((n, k) => n + weights[k]!, 0);
    report.expectedScore = Math.round(skills.reduce((n, k, i) => n + (35 + i * 9) * weights[k]!, 0) / total);
    const [sim] = await db
      .insert(simulations)
      .values({
        organizationId: auth.organization.id,
        userId: auth.user.id,
        scenarioVersionId: playable.versionId,
        status: 'completed',
        endReason: 'user',
        transcript: TRANSCRIPT,
        durationSeconds: 30,
        startedAt: new Date(Date.now() - 60_000),
        endedAt: new Date(Date.now() - 30_000),
      })
      .returning();
    report.simulationId = sim.id;
    report.scenarioId = scenario.id;
  } finally {
    await close();
  }
}

async function waitForHealth() {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
    } catch {
      // le serveur démarre
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('le serveur ne répond pas');
}

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });
}

before(async () => {
  mock = createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      mockCalls.push({ method: req.method ?? '', url: req.url ?? '', key: req.headers['xi-api-key'] as string, body });
      res.setHeader('content-type', 'application/json');
      if (req.url?.startsWith('/v1/convai/agents/create')) return res.end(JSON.stringify({ agent_id: `agent_e2e_${mockCalls.length}` }));
      if (req.url?.startsWith('/v1/convai/conversation/token')) {
        return res.end(JSON.stringify({ token: 'jeton-de-test', conversation_id: `conv_e2e_${mockCalls.length}` }));
      }
      if (req.method === 'POST' && req.url?.startsWith('/v1/messages')) {
        mockCalls[mockCalls.length - 1].key = req.headers['x-api-key'] as string;
        const message = {
          id: 'msg_e2e',
          type: 'message',
          role: 'assistant',
          model: 'claude-opus-5-5',
          content: [{ type: 'text', text: claudeAnswer }],
          stop_reason: 'end_turn',
          stop_sequence: null,
          usage: { input_tokens: 2400, output_tokens: 1500 },
        };
        setTimeout(() => res.end(JSON.stringify(message)), 1500);
        return;
      }
      res.statusCode = 404;
      res.end('{}');
    });
  });
  await new Promise<void>((resolve) => mock.listen(MOCK_PORT, '127.0.0.1', resolve));
  await seedCompletedCall();
  // Groupe de processus à part : on arrête le serveur et ses enfants d'un coup à la fin.
  server = spawn('node_modules/.bin/next', ['start', '-p', String(PORT), '-H', '127.0.0.1'], {
    env: {
      ...process.env,
      PGLITE_DIR: dataDir,
      ALLOW_LOCAL_DB: '1',
      INSECURE_COOKIES: '1',
      DATABASE_URL: '',
      ELEVENLABS_API_KEY: 'cle-de-test',
      ELEVENLABS_API_BASE: `http://127.0.0.1:${MOCK_PORT}`,
      ANTHROPIC_API_KEY: 'cle-de-test',
      ANTHROPIC_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
      ANALYSIS_MODEL: '',
    },
    stdio: ['ignore', 'ignore', 'pipe'],
    detached: true,
  });
  server.stderr?.on('data', (d) => process.stderr.write(d));
  await waitForHealth();
  // Micro simulé par Chromium : l'autorisation est accordée sans fenêtre.
  browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
});

after(async () => {
  if (SHOTS && lastPage && !lastPage.isClosed()) {
    await lastPage.screenshot({ path: join(SHOTS, 'derniere-page.png'), fullPage: true }).catch(() => {});
  }
  await browser?.close();
  if (server?.pid) process.kill(-server.pid, 'SIGTERM');
  mock?.close();
  rmSync(dataDir, { recursive: true, force: true });
});

async function signUp(page: Page, name: string, email: string) {
  await page.goto(`${BASE}/signup`);
  await page.getByLabel('Prénom et nom').fill(name);
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('motdepasse-solide');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await page.waitForURL(`${BASE}/onboarding`);
}

async function onboard(page: Page) {
  await page.getByText('Indépendant ou freelance').click();
  await page.getByText('Confirmé', { exact: true }).click();
  await page.getByText('Traitement des objections', { exact: true }).click();
  await page.getByText('Conclusion', { exact: true }).click();
  await page.getByLabel('Offre ou produit').fill('Assistant téléphonique IA');
  await page.getByRole('button', { name: 'Voir mon tableau de bord' }).click();
  await page.waitForURL(`${BASE}/dashboard`);
}

test('parcours complet d\'un nouvel utilisateur', async () => {
  const context = await browser.newContext({ locale: 'fr-FR', viewport: { width: 1440, height: 900 } });
  context.setDefaultTimeout(15_000);
  const page = await context.newPage();
  lastPage = page;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(BASE);
  await assert.doesNotReject(page.getByRole('heading', { level: 1 }).waitFor());
  await shot(page, '01-accueil');

  // Les pages protégées renvoient vers la connexion.
  await page.goto(`${BASE}/dashboard`);
  await page.waitForURL(`${BASE}/login`);

  const email = `albino.${Date.now()}@example.com`;
  await signUp(page, 'Albino Test', email);
  // Sans onboarding, le dashboard renvoie vers l'onboarding.
  await page.goto(`${BASE}/dashboard`);
  await page.waitForURL(`${BASE}/onboarding`);
  await shot(page, '02-onboarding');
  await onboard(page);

  await assert.doesNotReject(page.getByRole('heading', { name: 'Bonjour Albino' }).waitFor());
  assert.equal(await page.getByText('Pas encore de score').count(), 1, 'aucun score inventé');
  assert.equal(await page.getByText('Aucune simulation pour l\'instant.').count(), 1);
  const recommended = page.locator('section[aria-labelledby="reco"] a[href^="/scenarios/"]');
  assert.equal(await recommended.count(), 3);
  await shot(page, '03-dashboard');

  // Catalogue : 16 scénarios, filtre par langue, recherche.
  await page.getByRole('link', { name: 'Scénarios', exact: true }).first().click();
  await page.waitForURL(`${BASE}/scenarios`);
  await assert.doesNotReject(page.getByText('16 scénarios').waitFor());
  await page.getByLabel("Langue de l'appel").selectOption('fr');
  await page.getByRole('button', { name: 'Filtrer' }).click();
  await assert.doesNotReject(page.getByText('8 scénarios').waitFor());
  await shot(page, '04-scenarios');

  // Un scénario du catalogue ne montre jamais ses informations cachées.
  await page.getByRole('link', { name: /plombier/ }).click();
  await assert.doesNotReject(page.getByRole('heading', { name: /plombier/ }).waitFor());
  assert.equal(await page.getByText('Informations cachées').count(), 0);
  assert.equal(await page.getByText('dizaine d\'appels').count(), 0);
  await shot(page, '05-scenario-catalogue');

  // Création d'un scénario privé.
  await page.goto(`${BASE}/scenarios/new`);
  assert.equal(await page.getByLabel('Nom de l\'offre').inputValue(), 'Assistant téléphonique IA', 'offre reprise du profil');
  await page.getByRole('button', { name: 'Créer le scénario' }).click();
  await assert.doesNotReject(page.getByText('Vérifiez les champs signalés.').waitFor());
  await page.getByLabel('Titre').fill('Relance d\'un garage automobile');
  await page.getByLabel('Résumé en une phrase').fill('Relancer un garagiste après une démo.');
  await page.getByLabel('Secteur').fill('Automobile');
  await page.getByLabel('Objectif du vendeur').fill('Obtenir une date de décision.');
  await page.getByLabel('Nom', { exact: true }).fill('Karim Benali');
  await page.getByLabel('Fonction').fill('Gérant');
  await page.getByLabel('Entreprise', { exact: true }).fill('Garage Benali');
  await page.getByLabel('Besoin réel').fill('Ne plus rater les appels pendant les réparations.');
  await page.getByLabel('Budget', { exact: true }).fill('100 € par mois');
  await page.getByLabel('Objections (une par ligne)').fill('Trop cher\nPas le temps');
  await page.getByLabel('Informations cachées (une par ligne)').fill('Son associé veut un essai gratuit');
  await page.getByLabel('Critères de réussite (un par ligne)').fill('Date de décision obtenue');
  await page.getByRole('button', { name: 'Créer le scénario' }).click();
  await assert.doesNotReject(page.getByText('Scénario créé.').waitFor());
  assert.equal(await page.getByText('Son associé veut un essai gratuit').count(), 1, 'l\'auteur voit ses infos cachées');
  assert.equal(await page.getByText(/^poids \d$/).count(), 6, 'pondération par défaut des compétences');
  const privateUrl = page.url().split('?')[0];
  await shot(page, '06-scenario-prive');

  // Modification : nouvelle version.
  await page.getByRole('link', { name: 'Modifier' }).click();
  await page.getByLabel('Titre').fill('Relance d\'un garage automobile indépendant');
  await page.getByRole('button', { name: 'Enregistrer une nouvelle version' }).click();
  await assert.doesNotReject(page.getByText('Nouvelle version enregistrée.').waitFor());
  await assert.doesNotReject(page.getByText(/Version 2/).waitFor());

  // Langue anglaise, enregistrée sur le compte.
  await page.locator('header').getByRole('button', { name: 'en', exact: true }).click();
  await assert.doesNotReject(page.getByRole('link', { name: 'Dashboard' }).first().waitFor());
  await page.goto(`${BASE}/dashboard`);
  await assert.doesNotReject(page.getByRole('heading', { name: 'Hello Albino' }).waitFor());
  await page.locator('header').getByRole('button', { name: 'fr', exact: true }).click();
  await assert.doesNotReject(page.getByRole('heading', { name: 'Bonjour Albino' }).waitFor());

  // Déconnexion puis reconnexion.
  await page.goto(`${BASE}/settings`);
  await shot(page, '07-reglages');
  await page.getByRole('main').getByRole('button', { name: 'Se déconnecter' }).click();
  await page.waitForURL(`${BASE}/login`);
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Mot de passe').fill('mauvais-mot-de-passe');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await assert.doesNotReject(page.getByText('E-mail ou mot de passe incorrect.').waitFor());
  await page.getByLabel('Mot de passe').fill('motdepasse-solide');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL(`${BASE}/dashboard`);

  // Un autre compte ne voit pas le scénario privé.
  const other = await browser.newContext({ locale: 'fr-FR' });
  const otherPage = await other.newPage();
  await signUp(otherPage, 'Bob Autre', `bob.${Date.now()}@example.com`);
  await onboard(otherPage);
  const res = await otherPage.goto(privateUrl);
  assert.equal(res?.status(), 404);
  await otherPage.goto(`${BASE}/scenarios?scope=private`);
  await assert.doesNotReject(otherPage.getByText("Vous n'avez pas encore de scénario privé.").waitFor());
  await other.close();

  // Mobile : menu et pages lisibles sans défilement horizontal.
  const mobile = await browser.newContext({ locale: 'fr-FR', viewport: { width: 390, height: 844 }, storageState: await context.storageState() });
  const m = await mobile.newPage();
  await m.goto(`${BASE}/dashboard`);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, `débordement horizontal de ${overflow}px`);
  await shot(m, '08-mobile-dashboard');
  await mobile.close();

  assert.deepEqual(errors, [], 'aucune erreur JavaScript');
  await context.close();
});

test('appel vocal : prospect créé côté serveur, échec de connexion géré, session enregistrée', async () => {
  const context = await browser.newContext({ locale: 'fr-FR', viewport: { width: 1280, height: 860 }, permissions: ['microphone'] });
  context.setDefaultTimeout(20_000);
  const page = await context.newPage();
  lastPage = page;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await signUp(page, 'Claire Appel', `claire.${Date.now()}@example.com`);
  await onboard(page);

  await page.goto(`${BASE}/scenarios?language=fr`);
  await page.getByRole('link', { name: /plombier/ }).click();
  await page.getByRole('link', { name: "Démarrer l'appel" }).click();
  await page.waitForURL(/\/call$/);
  await assert.doesNotReject(page.getByText('30 min de voix restantes ce mois-ci').waitFor());
  // La consigne du prospect (faits cachés) ne quitte jamais le serveur.
  assert.equal((await page.content()).includes("dizaine d'appels"), false);
  await shot(page, '09-appel-brief');

  const before = mockCalls.length;
  await page.getByRole('button', { name: "Démarrer l'appel" }).click();
  await assert.doesNotReject(page.getByText('La connexion audio a été coupée.').waitFor({ timeout: 60_000 }));
  await assert.doesNotReject(page.getByRole('button', { name: "Démarrer l'appel" }).waitFor());
  await shot(page, '10-appel-echec');

  const calls = mockCalls.slice(before);
  assert.ok(calls.every((c) => c.key === 'cle-de-test'), 'la clé est envoyée par le serveur');
  const create = calls.find((c) => c.url.startsWith('/v1/convai/agents/create'));
  assert.ok(create, 'un prospect vocal est créé');
  const payload = JSON.parse(create.body);
  assert.equal(payload.conversation_config.agent.language, 'fr');
  assert.equal(payload.platform_settings.auth.enable_auth, true);
  assert.match(payload.conversation_config.agent.prompt.prompt, /dizaine d'appels/, 'les faits cachés sont dans la consigne serveur');
  const token = calls.find((c) => c.url.startsWith('/v1/convai/conversation/token'));
  assert.ok(token);
  const participant = new URL(token.url, 'http://x').searchParams.get('participant_name');
  assert.match(participant ?? '', /^[0-9a-f-]{36}$/, 'aucun nom ni e-mail envoyé à ElevenLabs');

  // L'appel raté apparaît dans l'historique, en échec, sans minute décomptée.
  await page.goto(`${BASE}/simulations`);
  await assert.doesNotReject(page.getByRole('link', { name: /plombier/ }).waitFor());
  await assert.doesNotReject(page.getByText('Échouée', { exact: true }).waitFor());
  await page.getByRole('link', { name: /plombier/ }).click();
  await assert.doesNotReject(page.getByText("L'appel n'a pas pu être enregistré. Aucune minute n'a été décomptée.").waitFor());
  await page.goto(`${BASE}/scenarios?language=fr`);
  await page.getByRole('link', { name: /plombier/ }).click();
  await page.getByRole('link', { name: "Démarrer l'appel" }).click();
  await assert.doesNotReject(page.getByText('30 min de voix restantes ce mois-ci').waitFor());
  assert.deepEqual(errors, [], 'aucune erreur JavaScript');
  await context.close();
});

test('rapport : Claude analyse l\'appel, scores justifiés par des citations vérifiées, exercices ciblés', async () => {
  const context = await browser.newContext({ locale: 'fr-FR', viewport: { width: 1440, height: 900 } });
  context.setDefaultTimeout(20_000);
  const page = await context.newPage();
  lastPage = page;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(`${BASE}/login`);
  await page.getByLabel('E-mail').fill(report.email);
  await page.getByLabel('Mot de passe').fill('motdepasse-solide');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL(`${BASE}/dashboard`);

  const before = mockCalls.filter((c) => c.url.startsWith('/v1/messages')).length;
  await page.goto(`${BASE}/simulations/${report.simulationId}`);
  // L'analyse part après l'affichage : la page l'annonce, puis se met à jour seule.
  await assert.doesNotReject(page.getByText('Claude analyse votre appel.', { exact: false }).waitFor());
  await shot(page, '11-rapport-en-cours');
  await assert.doesNotReject(page.getByRole('heading', { name: 'Score global' }).waitFor({ timeout: 45_000 }));

  const overall = page.locator('section[aria-labelledby="report-title"]');
  assert.equal(await overall.getByText(String(report.expectedScore), { exact: true }).count(), 1, 'score global pondéré par le serveur');
  await assert.doesNotReject(page.getByText('Décision repoussée').waitFor());
  await assert.doesNotReject(page.getByRole('img', { name: 'Compétences' }).waitFor());
  // Seules les citations réellement prononcées par le vendeur sont affichées.
  await assert.doesNotReject(page.getByText("« Combien d'appels pensez-vous rater par semaine »").waitFor());
  assert.equal(await page.getByText('Citation inventée qui ne figure nulle part').count(), 0);
  await assert.doesNotReject(page.getByText('« Je vous propose une démo de vingt minutes jeudi »').waitFor());
  assert.equal(await page.getByText('Phrase jamais prononcée par le vendeur').count(), 0);
  // Exercices suivants : d'autres scénarios du catalogue, jamais celui qui vient d'être joué.
  const next = page.locator('section[aria-labelledby="next-title"] a[href^="/scenarios/"]');
  assert.ok((await next.count()) > 0, 'au moins un exercice recommandé');
  const hrefs = await next.evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  assert.ok(!hrefs.includes(`/scenarios/${report.scenarioId}`));
  await shot(page, '12-rapport');

  const claude = mockCalls.filter((c) => c.url.startsWith('/v1/messages'));
  assert.equal(claude.length - before, 1, 'un seul appel à Claude');
  const request = claude.at(-1)!;
  assert.equal(request.key, 'cle-de-test', 'la clé Claude reste côté serveur');
  const body = JSON.parse(request.body);
  assert.equal(body.model, 'claude-opus-5-5');
  assert.equal(body.output_config.format.type, 'json_schema');
  assert.match(body.messages[0].content, /\[3\] SELLER: Combien/);
  assert.ok(!request.body.includes(report.email) && !request.body.includes('Romain'), 'ni nom ni e-mail envoyés à Claude');
  assert.equal((await page.content()).includes('cle-de-test'), false);

  // Recharger ne relance pas l'analyse ; le score alimente l'historique.
  await page.reload();
  await assert.doesNotReject(page.getByRole('heading', { name: 'Score global' }).waitFor());
  assert.equal(mockCalls.filter((c) => c.url.startsWith('/v1/messages')).length, claude.length);
  await page.goto(`${BASE}/simulations`);
  await assert.doesNotReject(page.getByRole('cell', { name: String(report.expectedScore), exact: true }).waitFor());
  assert.deepEqual(errors, [], 'aucune erreur JavaScript');
  await context.close();
});
