// Générateur de leads : lecture du site internet d'une entreprise (accueil, page contact, mentions légales)
// pour y trouver son téléphone et son email, et vérifier que c'est bien son site (son SIREN y figure).
// Respecte robots.txt ; seulement des adresses publiques (jamais le réseau interne du serveur).
import dns from 'node:dns';
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';
import zlib from 'node:zlib';

// ------------------------------------------------------------------ SSRF guard
// Two separate lists: Node's BlockList also matches IPv4 addresses against IPv4-mapped IPv6 rules,
// so an IPv6 rule like ::ffff:0:0/96 in the same list would block every IPv4 address.
const BLOCK4 = new net.BlockList();
for (const [a, p] of [['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.88.99.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4]]) BLOCK4.addSubnet(a, p, 'ipv4');
const GLOBAL6 = new net.BlockList(); GLOBAL6.addSubnet('2000::', 3, 'ipv6'); // only global unicast IPv6 (rejects ::1, ::ffff:x, fc00::/7, fe80::/10, 64:ff9b::/96, ff00::/8)
const BLOCK6 = new net.BlockList(); // special ranges inside 2000::/3: Teredo/IETF, documentation, 6to4
for (const [a, p] of [['2001::', 23], ['2001:db8::', 32], ['2002::', 16]]) BLOCK6.addSubnet(a, p, 'ipv6');

export function isPublicIp(ip) {
  const fam = net.isIP(ip);
  if (fam === 4) return !BLOCK4.check(ip, 'ipv4');
  if (fam === 6) return GLOBAL6.check(ip, 'ipv6') && !BLOCK6.check(ip, 'ipv6');
  return false;
}
// Used as the socket's own `lookup`: the address that was checked is the address connected to (no DNS-rebinding gap).
export function safeLookup(hostname, options, cb) {
  if (typeof options === 'function') { cb = options; options = {}; }
  dns.lookup(hostname, { ...options, all: true }, (err, addrs) => {
    if (err) return cb(err);
    const bad = addrs.find((a) => !isPublicIp(a.address));
    if (!addrs.length || bad) {
      const e = new Error(`SSRF blocked: ${hostname} -> ${bad ? bad.address : 'no address'}`); e.code = 'ERR_SSRF_BLOCKED';
      return cb(e);
    }
    if (options.all) return cb(null, addrs);
    cb(null, addrs[0].address, addrs[0].family);
  });
}
// Static URL checks (run on the first URL and on every redirect hop).
export function checkUrl(u, { allowPrivate = false } = {}) {
  const url = u instanceof URL ? u : new URL(u);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw Object.assign(new Error('scheme ' + url.protocol), { code: 'ERR_SSRF_BLOCKED' });
  if (url.username || url.password) throw Object.assign(new Error('credentials in URL'), { code: 'ERR_SSRF_BLOCKED' });
  if (url.port && url.port !== '80' && url.port !== '443' && !allowPrivate) throw Object.assign(new Error('port ' + url.port), { code: 'ERR_SSRF_BLOCKED' });
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (/(^|\.)(localhost|local|internal|localdomain|home\.arpa)$/i.test(host) && !allowPrivate) throw Object.assign(new Error('host ' + host), { code: 'ERR_SSRF_BLOCKED' });
  // IP literals never go through `lookup`, so they are checked here.
  if (net.isIP(host) && !allowPrivate && !isPublicIp(host)) throw Object.assign(new Error('ip ' + host), { code: 'ERR_SSRF_BLOCKED' });
  return url;
}

// ------------------------------------------------------------------ bounded fetch
const UA = 'BlackstartCRM/1.0 (generateur de leads; +https://site-production-4a5c.up.railway.app)';
function once(url, { deadline, maxBytes, allowPrivate }) {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.request(url, {
      method: 'GET', lookup: allowPrivate ? undefined : safeLookup, agent: false,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml;q=0.9,text/plain;q=0.5', 'Accept-Language': 'fr-FR,fr;q=0.9', 'Accept-Encoding': 'gzip, deflate, br' },
      maxHeaderSize: 32 * 1024,
    });
    const left = deadline - Date.now();
    if (left <= 0) { req.destroy(); return reject(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })); }
    const timer = setTimeout(() => req.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })), left);
    req.on('error', (e) => { clearTimeout(timer); reject(e); });
    req.on('response', (res) => {
      const s = res.statusCode;
      if (s >= 300 && s < 400 && res.headers.location) { res.resume(); clearTimeout(timer); return resolve({ status: s, location: res.headers.location }); }
      const ct = String(res.headers['content-type'] || 'text/html');
      if (s < 200 || s >= 300 || !/text\/html|application\/xhtml|text\/plain/i.test(ct)) { res.resume(); clearTimeout(timer); return resolve({ status: s, html: '' }); }
      if (+res.headers['content-length'] > maxBytes * 4) { req.destroy(); clearTimeout(timer); return resolve({ status: s, html: '' }); }
      const enc = String(res.headers['content-encoding'] || '').toLowerCase();
      const stream = enc === 'gzip' || enc === 'x-gzip' ? res.pipe(zlib.createGunzip()) : enc === 'deflate' ? res.pipe(zlib.createInflate())
        : enc === 'br' ? res.pipe(zlib.createBrotliDecompress()) : res;
      const chunks = []; let n = 0, done = false;
      const finish = () => {
        if (done) return; done = true; clearTimeout(timer);
        const buf = Buffer.concat(chunks);
        const cs = (ct.match(/charset=["']?([\w-]+)/i) || buf.subarray(0, 2048).toString('latin1').match(/<meta[^>]+charset=["']?([\w-]+)/i) || [])[1] || 'utf-8';
        let html; try { html = new TextDecoder(cs.toLowerCase()).decode(buf); } catch { html = new TextDecoder('utf-8').decode(buf); }
        resolve({ status: s, html, truncated: n > maxBytes });
      };
      stream.on('data', (c) => { if (done) return; chunks.push(c); n += c.length; if (n > maxBytes) { finish(); req.destroy(); } }); // decompressed bytes counted (zip-bomb safe)
      stream.on('end', finish);
      stream.on('error', (e) => { if (!done) { done = true; clearTimeout(timer); chunks.length ? finish() : reject(e); } });
    });
    req.end();
  });
}
export async function fetchPage(input, { timeoutMs = 8000, maxBytes = 1_500_000, maxRedirects = 5, allowPrivate = false } = {}) {
  const deadline = Date.now() + timeoutMs;
  let url = checkUrl(input, { allowPrivate });
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const r = await once(url, { deadline, maxBytes, allowPrivate });
    if (r.location === undefined) return { url: url.href, ...r };
    url = checkUrl(new URL(r.location, url), { allowPrivate });
  }
  throw Object.assign(new Error('too many redirects'), { code: 'ERR_TOO_MANY_REDIRECTS' });
}

// ------------------------------------------------------------------ robots.txt (RFC 9309, simplified)
const ROBOTS = new Map(); // origin -> { t, rules }
export function parseRobots(txt, token = 'blackstartcrm') {
  const groups = []; let cur = null, lastWasUA = false;
  for (const raw of String(txt).split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim(); const m = line.match(/^([\w-]+)\s*:\s*(.*)$/); if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2].trim();
    if (k === 'user-agent') { if (!lastWasUA) groups.push(cur = { agents: [], rules: [] }); cur.agents.push(v.toLowerCase()); lastWasUA = true; continue; }
    lastWasUA = false;
    if (cur && (k === 'allow' || k === 'disallow')) cur.rules.push({ allow: k === 'allow', path: v });
  }
  const mine = groups.filter((g) => g.agents.some((a) => a !== '*' && token.includes(a)));
  const pick = mine.length ? mine : groups.filter((g) => g.agents.includes('*'));
  return pick.flatMap((g) => g.rules).filter((r) => r.path !== '');
}
export function robotsAllows(rules, path) {
  let best = null;
  for (const r of rules) {
    const re = new RegExp('^' + r.path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$'));
    if (re.test(path) && (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow))) best = r;
  }
  return !best || best.allow;
}
async function robotsFor(origin, opts) {
  const c = ROBOTS.get(origin); if (c && Date.now() - c.t < 24 * 3600e3) return c.rules;
  let rules;
  try {
    const r = await fetchPage(origin + '/robots.txt', { ...opts, timeoutMs: 5000, maxBytes: 512 * 1024 });
    rules = r.status >= 500 ? [{ allow: false, path: '/' }] : r.status >= 400 ? [] : parseRobots(r.html);
  } catch { rules = [{ allow: false, path: '/' }]; } // unreachable: RFC 9309 says assume complete disallow
  ROBOTS.set(origin, { t: Date.now(), rules });
  return rules;
}

// ------------------------------------------------------------------ extraction
export const RE = {
  phone: /(?<![\d+])(?:(?:\+|00)\s?33\s?(?:\(0\)\s?)?|0)[1-9](?:[\s.\-  ]?\d{2}){4}(?!\d)/g,
  tel: /href\s*=\s*["']\s*tel:([^"']+)["']/gi,
  mailto: /href\s*=\s*["']\s*mailto:([^"'?]+)/gi,
  cfEmail: /(?:data-cfemail\s*=\s*["']|\/cdn-cgi\/l\/email-protection#)([0-9a-f]{8,})/gi,
  email: /[a-z0-9][a-z0-9._%+-]{0,63}@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}(?![a-z0-9-])/gi,
  siren: /(?:siren|siret|r\.?c\.?s\.?|tva|immatricul\w*|registre du commerce[^0-9]{0,40})[^0-9]{0,60}((?:FR\s?\d{2}\s?)?\d{3}[\s. ]?\d{3}[\s. ]?\d{3})/gi,
  ldPhone: /"telephone"\s*:\s*"([^"]{6,30})"/gi,
  ldEmail: /"email"\s*:\s*"(?:mailto:)?([^"]{5,100})"/gi,
  link: /<a\b[^>]*?href\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]{0,300}?)<\/a>/gi,
};
const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', ccedil: 'ç', ocirc: 'ô', ucirc: 'û', icirc: 'î', rsquo: '’', commat: '@', period: '.' };
export const decodeEntities = (s) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
export function htmlToText(html) {
  return decodeEntities(html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/h\d|\/tr|\/td)\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ')).replace(/[ \t  ]+/g, ' ');
}
export function decodeCfEmail(hex) {
  const key = parseInt(hex.slice(0, 2), 16); let out = '';
  for (let i = 2; i + 1 < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  try { return decodeURIComponent(escape(out)); } catch { return out; }
}
export function normPhone(raw) {
  let d = String(raw).replace(/\D/g, '');
  if (d.startsWith('0033')) d = d.slice(4);
  else if (d.startsWith('33') && d.length >= 11) d = d.slice(2);
  else if (d.startsWith('0')) d = d.slice(1);
  else return null;
  if (d.length === 10 && d[0] === '0') d = d.slice(1); // "+33 (0)1 …"
  if (!/^[1-9]\d{8}$/.test(d)) return null;
  return { e164: '+33' + d, national: ('0' + d).replace(/(\d{2})(?=\d)/g, '$1 ') };
}
export function sirenValid(s) { // Luhn on 9 digits
  if (!/^\d{9}$/.test(s)) return false;
  let sum = 0; for (let i = 0; i < 9; i++) { let v = +s[8 - i]; if (i % 2) { v *= 2; if (v > 9) v -= 9; } sum += v; }
  return sum % 10 === 0;
}
// Phone zone (01-05) by département: soft plausibility signal only.
const ZONE = { 1: '75 77 78 91 92 93 94 95', 2: '14 18 22 27 28 29 35 36 37 41 44 45 49 50 53 56 61 72 76 85 974 976',
  3: '02 08 10 21 25 39 51 52 54 55 57 58 59 60 62 67 68 70 71 80 88 89 90',
  4: '01 03 04 05 06 07 11 13 15 26 2A 2B 30 34 38 42 43 48 63 66 69 73 74 83 84',
  5: '09 12 16 17 19 23 24 31 32 33 40 46 47 64 65 79 81 82 86 87 971 972 973' };
export function zoneOfDept(cp) {
  const dep = /^97/.test(cp) ? cp.slice(0, 3) : /^20/.test(cp) ? (+cp < 20200 ? '2A' : '2B') : String(cp).slice(0, 2);
  for (const [z, l] of Object.entries(ZONE)) if (l.split(' ').includes(dep)) return +z;
  return null;
}
const BAD_MAIL = /(^|\.)(example|exemple|domain|sentry|wixpress|sentry-next|godaddy|ovh|o2switch|hostinger|ionos|wordpress|w3\.org|schema\.org)\./i;
export function extract(html, { pageKind = 'home', siteHost = '' } = {}) {
  const phones = [], emails = [], sirens = new Set();
  const add = (raw, src, ctx = '') => {
    const p = normPhone(raw); if (!p) return;
    let w = { tel: 3, ld: 3, text: 1 }[src] + (pageKind === 'contact' ? 2 : 0);
    if (/h[ée]berg|hosting|hosted by|h[ée]bergeur/i.test(ctx)) w -= 10; // host provider block in mentions légales
    if (/^\+338(9|36)/.test(p.e164)) w -= 5; // premium-rate
    if (/t[ée]l|phone|appel|contact|standard|portable|mobile/i.test(ctx.slice(-40))) w += 1;
    phones.push({ ...p, w, src, pageKind });
  };
  for (const m of html.matchAll(RE.tel)) { try { add(decodeURIComponent(m[1]), 'tel'); } catch { add(m[1], 'tel'); } }
  for (const m of html.matchAll(RE.ldPhone)) add(m[1], 'ld');
  for (const m of html.matchAll(RE.mailto)) { try { emails.push(decodeURIComponent(m[1])); } catch { emails.push(m[1]); } }
  for (const m of html.matchAll(RE.cfEmail)) emails.push(decodeCfEmail(m[1]));
  for (const m of html.matchAll(RE.ldEmail)) emails.push(m[1]);
  const text = htmlToText(html);
  for (const m of text.matchAll(RE.phone)) add(m[0], 'text', text.slice(Math.max(0, m.index - 200), m.index));
  const deob = text.replace(/\s*[\[({]\s*(?:at|arobase|@)\s*[\])}]\s*/gi, '@').replace(/\s+arobase\s+/gi, '@')
    .replace(/\s*[\[({]\s*(?:dot|point)\s*[\])}]\s*/gi, '.');
  for (const m of deob.matchAll(RE.email)) emails.push(m[0]);
  for (const m of text.matchAll(RE.siren)) { const d = m[1].replace(/\D/g, '').slice(-9); if (sirenValid(d)) sirens.add(d); }
  const host = siteHost.replace(/^www\./, '');
  const mails = [...new Set(emails.map((e) => e.trim().toLowerCase()))]
    .filter((e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,24}$/.test(e) && !/\.(png|jpe?g|gif|webp|svg|css|js)$/.test(e) && !BAD_MAIL.test(e.split('@')[1] + '.'))
    .sort((a, b) => (b.endsWith('@' + host) || b.endsWith('.' + host)) - (a.endsWith('@' + host) || a.endsWith('.' + host)));
  return { phones, emails: mails, sirens: [...sirens], text };
}
export function discoverLinks(html, baseUrl) {
  const base = new URL(baseUrl), host = base.hostname.replace(/^www\./, ''), out = new Map();
  for (const m of html.matchAll(RE.link)) {
    const label = htmlToText(m[2]).trim().toLowerCase();
    let u; try { u = new URL(decodeEntities(m[1]), base); } catch { continue; }
    if (!/^https?:$/.test(u.protocol) || u.hostname.replace(/^www\./, '') !== host) continue;
    const key = decodeURIComponent(u.pathname).toLowerCase() + ' ' + label;
    const kind = /mentions?[\s_-]*l[ée]gales?|legal|impressum|informations?[\s_-]*l[ée]gales/.test(key) ? 'legal'
      : /contact|coordonn|nous[\s_-]*(joindre|trouver)|acc[eè]s/.test(key) ? 'contact' : null;
    if (kind && !out.has(kind)) { u.hash = ''; out.set(kind, u.href); }
  }
  return out; // Map kind -> url
}
export function pageHasSiren(text, siren) {
  if (!/^\d{9}$/.test(siren)) return false;
  return new RegExp(siren.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1[\\s.\\u00a0-]?$2[\\s.\\u00a0-]?$3')).test(text);
}

// ------------------------------------------------------------------ one lead
// lead: { siren, cp, nom }   site: 'https://…'
export async function enrichFromWebsite(site, lead, { fetchOpts = {}, respectRobots = true } = {}) {
  const t0 = Date.now(), deadline = t0 + 20000;
  const out = { site, confirmed: 'none', telephone: '', email: '', phones: [], emails: [], sirens: [], pages: [], errors: [] };
  let home;
  try { home = await fetchPage(site, fetchOpts); } catch (e) { out.errors.push('home: ' + (e.code || e.message)); return out; }
  if (!home.html) { out.errors.push('home: HTTP ' + home.status); return out; }
  const origin = new URL(home.url).origin, host = new URL(home.url).hostname;
  out.site = origin + '/';
  if (/domaine (est )?[àa] vendre|domain (is )?for sale|sedoparking|parkingcrew|afternic|dan\.com|this domain|ce nom de domaine/i.test(home.html.slice(0, 50000))) {
    out.errors.push('parked domain'); return out;
  }
  const rules = respectRobots ? await robotsFor(origin, fetchOpts) : [];
  const pages = [{ kind: 'home', url: home.url, html: home.html }];
  const links = discoverLinks(home.html, home.url);
  if (!links.has('legal')) links.set('legal', origin + '/mentions-legales');
  if (!links.has('contact')) links.set('contact', origin + '/contact');
  await Promise.all([...links].map(async ([kind, url]) => {
    if (respectRobots && !robotsAllows(rules, new URL(url).pathname)) { out.errors.push(kind + ': robots.txt'); return; }
    try {
      const r = await fetchPage(url, { ...fetchOpts, timeoutMs: Math.max(1000, Math.min(8000, deadline - Date.now())) });
      if (r.html) pages.push({ kind, url: r.url, html: r.html }); else out.errors.push(kind + ': HTTP ' + r.status);
    } catch (e) { out.errors.push(kind + ': ' + (e.code || e.message)); }
  }));
  const zone = zoneOfDept(lead.cp || '');
  const byPhone = new Map(); const emails = []; const sirens = new Set();
  for (const p of pages) {
    const x = extract(p.html, { pageKind: p.kind, siteHost: host });
    out.pages.push(p.url);
    if (lead.siren && pageHasSiren(x.text, lead.siren)) out.confirmed = 'siren';
    x.sirens.forEach((s) => sirens.add(s)); emails.push(...x.emails);
    for (const ph of x.phones) {
      const z = +ph.national[1];
      const w = ph.w + (zone && z >= 1 && z <= 5 ? (z === zone ? 2 : -3) : 0);
      const cur = byPhone.get(ph.e164) || { ...ph, w: 0, hits: 0 };
      cur.w += w; cur.hits++; byPhone.set(ph.e164, cur);
    }
  }
  out.sirens = [...sirens];
  if (out.confirmed !== 'siren' && lead.siren && out.sirens.length && !out.sirens.includes(lead.siren)) out.confirmed = 'mismatch';
  out.phones = [...byPhone.values()].filter((p) => p.w > 0).sort((a, b) => b.w - a.w).map(({ e164, national, w, hits }) => ({ e164, national, w, hits }));
  out.emails = [...new Set(emails)];
  if (out.confirmed !== 'mismatch') { out.telephone = out.phones[0]?.national || ''; out.email = out.emails[0] || ''; }
  out.ms = Date.now() - t0;
  return out;
}

// ------------------------------------------------------------------ domain guessing
const LEGAL = /\b(sarl|sas|sasu|eurl|sa|sci|snc|selarl|selas|scp|scm|eirl|ei|earl|gaec|ets|etablissements|societe|ste|holding|groupe|france)\b/g;
export function slugCandidates({ nom, enseigne, ville }) {
  const out = new Set();
  for (const n of [enseigne, nom].filter(Boolean)) {
    const base = String(n).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[&+]/g, ' et ')
      .replace(/['’]/g, '').replace(LEGAL, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
    if (base.length < 3) continue;
    const words = base.split(' ');
    const joined = words.join(''), dashed = words.join('-');
    for (const s of [joined, dashed]) for (const tld of ['fr', 'com']) out.add(`${s}.${tld}`);
    if (ville) { const v = String(ville).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); out.add(`${dashed}-${v}.fr`); }
  }
  return [...out].filter((d) => d.length <= 63 + 4).slice(0, 8);
}
export async function resolves(domain) {
  try { const a = await dns.promises.lookup(domain, { all: true }); return a.some((x) => isPublicIp(x.address)); } catch { return false; }
}
// Devine le site (nom.fr, nom.com…) et ne le garde QUE si ses pages portent le SIREN du lead.
export async function guessWebsite(lead, opts = {}) {
  const cands = slugCandidates(lead);
  const vivants = (await Promise.all(cands.map(async (d) => ((await resolves(d)) ? 'https://' + d + '/' : (await resolves('www.' + d)) ? 'https://www.' + d + '/' : null)))).filter(Boolean);
  for (const url of vivants.slice(0, 3)) {
    let r = await enrichFromWebsite(url, lead, opts);
    if (r.errors.some((e) => e.startsWith('home')) && !url.includes('://www.')) r = await enrichFromWebsite(url.replace('://', '://www.'), lead, opts);
    if (r.confirmed === 'siren') return r;
  }
  return null;
}
