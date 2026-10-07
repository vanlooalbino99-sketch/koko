// Serveur de test : SQLite dans un dossier temporaire, ou PostgreSQL si BS_TEST_PG donne l'adresse d'un
// serveur de test (une base neuve est créée puis supprimée pour chaque fichier de tests).
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { createApp } from '../src/app.js';

export async function testApp(opts = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'bs-test-'));
  let databaseUrl = null, drop = async () => {};
  if (process.env.BS_TEST_PG) {
    const pg = (await import('pg')).default;
    const name = 'bs_test_' + randomBytes(5).toString('hex');
    const admin = async (sql) => { const c = new pg.Client(process.env.BS_TEST_PG); await c.connect(); try { await c.query(sql); } finally { await c.end(); } };
    await admin(`CREATE DATABASE ${name}`);
    const u = new URL(process.env.BS_TEST_PG);
    u.pathname = '/' + name;
    databaseUrl = u.toString();
    drop = () => admin(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
  }
  const made = await createApp({ dataDir: dir, databaseUrl, ...opts });
  return {
    ...made,
    dir,
    async cleanup() {
      made.hub.close();
      await made.db.close();
      await drop();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
