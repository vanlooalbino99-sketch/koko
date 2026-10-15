// Relais d'envoi des mails du CRM Blackstart — Cloudflare Worker installé par le CRM (Mail › Mes boîtes › Relais d'envoi).
// Railway bloque l'envoi de mails (SMTP) hors offre Pro : le CRM confie le mail déjà prêt à ce relais, qui le remet
// au serveur d'envoi de la boîte (Hostinger, OVH, IONOS…) avec l'adresse et le mot de passe de la boîte.
// - POST /envoyer : corps = le mail au format SMTP (lignes en CRLF, points doublés, terminé par « . »).
// - POST /verifier : se connecte et s'identifie seulement.
// En-têtes : Authorization: Bearer <clé du relais>, X-Relais: base64(JSON { host, port, secure, user, pass, from, to }).
// Ce fichier est envoyé tel quel à Cloudflare : pas d'autre import que cloudflare:sockets.
import { connect } from 'cloudflare:sockets';

const enc = new TextEncoder();
const dec = new TextDecoder();
const VERSION = '1';

function b64(s) { let t = ''; for (const o of enc.encode(s)) t += String.fromCharCode(o); return btoa(t); }
function json(o, status = 200) { return new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } }); }
function erreur(r) {
  const e = new Error(r.texte.replace(/^\d{3}[ -]/gm, '').slice(0, 300));
  e.code = [530, 534, 535, 454].includes(r.code) ? 'EAUTH' : 'ESMTP';
  return e;
}

function lecteur(socket) {
  const r = socket.readable.getReader();
  let tampon = '';
  return {
    // Une réponse SMTP complète : lignes « 250-… » puis la dernière « 250 … ».
    async reponse() {
      const lignes = [];
      for (;;) {
        let i;
        while ((i = tampon.indexOf('\n')) >= 0) {
          const l = tampon.slice(0, i).replace(/\r$/, '');
          tampon = tampon.slice(i + 1);
          lignes.push(l);
          if (/^\d{3}( |$)/.test(l)) return { code: Number(l.slice(0, 3)), texte: lignes.join('\n') };
        }
        const { value, done } = await r.read();
        if (done) throw Object.assign(new Error('Le serveur mail a fermé la connexion.'), { code: 'ESOCKET' });
        tampon += dec.decode(value, { stream: true });
      }
    },
    liberer() { r.releaseLock(); },
  };
}

export async function session(p, corps, ouvrir = connect) {
  const starttls = !p.secure;
  let socket = ouvrir({ hostname: p.host, port: p.port }, { secureTransport: starttls ? 'starttls' : 'on', allowHalfOpen: false });
  let lec = lecteur(socket);
  let w = socket.writable.getWriter();
  const cmd = async (ligne, attendus) => {
    if (ligne !== null) await w.write(enc.encode(ligne + '\r\n'));
    const r = await lec.reponse();
    if (!attendus.includes(r.code)) throw erreur(r);
    return r;
  };
  try {
    await cmd(null, [220]);
    let ehlo = await cmd('EHLO relais.blackstart', [250]);
    if (starttls) {
      await cmd('STARTTLS', [220]);
      lec.liberer(); w.releaseLock();
      socket = socket.startTls();
      lec = lecteur(socket); w = socket.writable.getWriter();
      ehlo = await cmd('EHLO relais.blackstart', [250]);
    }
    const meca = ((/^250[ -]AUTH[ =](.*)$/im.exec(ehlo.texte) || [])[1] || '').toUpperCase();
    if (meca.includes('PLAIN') || !meca.includes('LOGIN')) await cmd('AUTH PLAIN ' + b64('\u0000' + p.user + '\u0000' + p.pass), [235]);
    else { await cmd('AUTH LOGIN', [334]); await cmd(b64(p.user), [334]); await cmd(b64(p.pass), [235]); }
    if (corps) {
      await cmd(`MAIL FROM:<${p.from}>`, [250]);
      for (const a of p.to) await cmd(`RCPT TO:<${a}>`, [250, 251]);
      await cmd('DATA', [354]);
      w.releaseLock();
      await corps.pipeTo(socket.writable, { preventClose: true });
      w = socket.writable.getWriter();
      await cmd(null, [250]);
    }
    await cmd('QUIT', [221]).catch(() => {});
  } finally {
    try { socket.close(); } catch { /* déjà fermé */ }
  }
}

const SUR = /^[a-z0-9.-]+\.[a-z]{2,}$/i;
const ADR = /^[^\s<>]+@[^\s<>]+$/;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'GET') return json({ ok: true, relais: 'blackstart', version: VERSION });
    if (!env.RELAIS_SECRET || req.headers.get('authorization') !== 'Bearer ' + env.RELAIS_SECRET) return json({ error: 'Clé du relais refusée.' }, 401);
    let p;
    try { p = JSON.parse(dec.decode(Uint8Array.from(atob(req.headers.get('x-relais') || ''), (c) => c.charCodeAt(0)))); } catch { return json({ error: 'Paramètres illisibles.' }, 400); }
    const port = Number(p.port);
    if (!SUR.test(String(p.host || '')) || ![465, 587, 2525].includes(port)) return json({ error: 'Serveur d’envoi refusé par le relais.' }, 400);
    const envoi = url.pathname === '/envoyer';
    if (envoi && (!ADR.test(String(p.from || '')) || !Array.isArray(p.to) || !p.to.length || p.to.some((a) => !ADR.test(String(a))))) return json({ error: 'Adresses invalides.' }, 400);
    if (!envoi && url.pathname !== '/verifier') return json({ error: 'Adresse inconnue.' }, 404);
    const limite = new Promise((_, ko) => setTimeout(() => ko(Object.assign(new Error('Le serveur mail ne répond pas.'), { code: 'ETIMEDOUT' })), 55000));
    try {
      await Promise.race([session({ ...p, port, secure: port === 465 }, envoi ? req.body : null), limite]);
      return json({ ok: true });
    } catch (e) {
      return json({ error: String(e && e.message || e).slice(0, 400), code: (e && e.code) || 'ESOCKET' }, 502);
    }
  },
};
