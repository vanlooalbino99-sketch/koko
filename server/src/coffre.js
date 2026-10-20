// Secrets gardés en base (mots de passe mail, clés d'API) : chiffrés en AES-256-GCM.
// La clé de chiffrement vient de MAIL_SECRET, sinon d'un fichier du dossier de données (créé au premier usage).
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function cleDe(dataDir) {
  if (process.env.MAIL_SECRET) return createHash('sha256').update(process.env.MAIL_SECRET).digest();
  const f = join(dataDir || 'data', 'mail.key');
  if (!existsSync(f)) { mkdirSync(dataDir || 'data', { recursive: true }); writeFileSync(f, randomBytes(32).toString('base64'), { mode: 0o600 }); }
  return Buffer.from(readFileSync(f, 'utf8').trim(), 'base64');
}

export function coffre(dataDir) {
  const cle = cleDe(dataDir);
  return {
    chiffrer(t) {
      const iv = randomBytes(12), c = createCipheriv('aes-256-gcm', cle, iv);
      const data = Buffer.concat([c.update(String(t), 'utf8'), c.final()]);
      return [iv, c.getAuthTag(), data].map((b) => b.toString('base64')).join('.');
    },
    dechiffrer(s) {
      const [iv, tag, data] = String(s).split('.').map((b) => Buffer.from(b, 'base64'));
      const d = createDecipheriv('aes-256-gcm', cle, iv); d.setAuthTag(tag);
      return Buffer.concat([d.update(data), d.final()]).toString('utf8');
    },
  };
}
