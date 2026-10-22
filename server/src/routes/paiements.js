// /api/paiements : paiement en ligne des factures avec Stripe (carte bancaire, Apple Pay, Google Pay, et PayPal
// quand il est activé dans Stripe).
// - Un administrateur colle la clé secrète Stripe (ou une clé restreinte) : vérifiée, puis chiffrée en base.
// - Pour chaque facture à encaisser, le CRM crée un lien de paiement Stripe au montant restant dû ; le lien
//   apparaît sur la facture (avec un QR code) et dans le mail d'envoi.
// - Le CRM demande à Stripe quelles factures ont été payées et les marque « payées » (pas besoin de webhook).
// PayPal : un administrateur colle l'identifiant et le secret d'une application PayPal (REST). Le CRM crée pour chaque
// facture une facture PayPal (payable par compte PayPal ou par carte), et relève chez PayPal celles qui sont payées.
// Sans connexion, le lien PayPal.me réglé dans Paiements reste affiché.
// Mercury : un administrateur colle un jeton d'API (lecture seule suffit). Le CRM affiche les soldes et les virements
// reçus, que la page Paiements rapproche des factures à encaisser.
import express, { Router } from 'express';
import { getSetting, setSetting } from '../store.js';
import { coffre } from '../coffre.js';

const STRIPE = 'https://api.stripe.com/v1';
const CLE_FORMAT = /^(sk|rk)_(live|test)_[A-Za-z0-9]{16,}$/;
const PAYPAL = { live: 'https://api-m.paypal.com', sandbox: 'https://api-m.sandbox.paypal.com' };
const PAYPAL_ID = /^[A-Za-z0-9_-]{20,128}$/;
const PAYPAL_PAYEE = new Set(['PAID', 'MARKED_AS_PAID', 'PAID_EXTERNAL']);
const MERCURY = 'https://api.mercury.com/api/v1';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const texte = (v, n) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);

// Corps « application/x-www-form-urlencoded » à la façon de Stripe (a[b][0][c]=…).
export function formulaire(o, prefixe = '', p = new URLSearchParams()) {
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    const cle = prefixe ? `${prefixe}[${k}]` : k;
    if (typeof v === 'object') formulaire(v, cle, p); else p.append(cle, String(v));
  }
  return p;
}

export function paiementsRoutes({ db, dataDir, fetch: web = globalThis.fetch }) {
  const r = Router();
  const { chiffrer, dechiffrer } = coffre(dataDir);
  let verif = { at: 0, promesse: null };

  async function conf() {
    const g = await getSetting(db, 'stripe', null);
    if (!g || !g.cle) return null;
    try { return { ...g, cle: dechiffrer(g.cle) }; } catch { return null; }
  }
  async function stripe(cle, methode, chemin, corps) {
    const o = { method: methode, headers: { Authorization: `Bearer ${cle}`, 'Stripe-Version': '2024-06-20' }, signal: AbortSignal.timeout(20000) };
    if (corps) { o.body = formulaire(corps); o.headers['Content-Type'] = 'application/x-www-form-urlencoded'; }
    let rep;
    try { rep = await web(STRIPE + chemin, o); } catch { throw Object.assign(new Error('Stripe ne répond pas pour le moment : réessayez.'), { status: 502 }); }
    const b = await rep.json().catch(() => ({}));
    if (!rep.ok) {
      const e = b.error || {};
      if (rep.status === 401) throw Object.assign(new Error('Clé Stripe refusée : vérifiez-la dans Stripe (Développeurs › Clés API) puis collez-la de nouveau.'), { status: 400 });
      if (rep.status === 403) throw Object.assign(new Error('Cette clé Stripe n’a pas les droits nécessaires : utilisez la clé secrète, ou une clé restreinte avec « Payment Links », « Prices », « Products » en écriture et « Checkout Sessions » en lecture.'), { status: 400 });
      throw Object.assign(new Error('Stripe a refusé : ' + texte(e.message || rep.status, 300)), { status: 400 });
    }
    return b;
  }
  const echec = (res, e) => res.status(e.status || 500).json({ error: e.status ? e.message : 'Erreur du serveur.' });
  const admin = (req, res) => { if (req.user.role === 'admin') return true; res.status(403).json({ error: 'Réservé aux administrateurs.' }); return false; };
  const liens = async () => (await getSetting(db, 'stripe_liens', null)) || {};

  r.get('/etat', async (req, res) => {
    const c = await conf(), p = await confPaypal(), m = await confMercury();
    res.json({
      admin: req.user.role === 'admin',
      stripe: c ? { connecte: true, compte: c.compte || '', test: !!c.test } : { connecte: false },
      paypal: p ? { connecte: true, compte: p.compte || '', test: p.mode === 'sandbox' } : { connecte: false },
      mercury: m ? { connecte: true, compte: m.compte || '' } : { connecte: false },
    });
  });

  r.put('/stripe', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    const cle = texte(req.body && req.body.cle, 300).replace(/\s+/g, '');
    if (!CLE_FORMAT.test(cle)) return res.status(400).json({ error: 'Ce n’est pas une clé secrète Stripe : elle commence par « sk_live_ » (ou « rk_live_ » pour une clé restreinte, « sk_test_ » pour essayer).' });
    let compte = '';
    try {
      try {
        const a = await stripe(cle, 'GET', '/account');
        compte = texte((a.settings && a.settings.dashboard && a.settings.dashboard.display_name) || (a.business_profile && a.business_profile.name) || a.email || a.id, 120);
      } catch (e) {
        if (!/droits/.test(e.message)) throw e;
        await stripe(cle, 'GET', '/payment_links?limit=1'); // clé restreinte sans accès au compte : on vérifie les liens de paiement
      }
    } catch (e) { return echec(res, e); }
    await setSetting(db, 'stripe', { cle: chiffrer(cle), compte, test: /_test_/.test(cle), at: new Date().toISOString(), par: req.user.id });
    res.json({ stripe: { connecte: true, compte, test: /_test_/.test(cle) } });
  });

  r.delete('/stripe', async (req, res) => {
    if (!admin(req, res)) return;
    await db.run("DELETE FROM settings WHERE key IN ('stripe', 'stripe_liens')");
    res.json({ stripe: { connecte: false } });
  });

  // Lien de paiement d'une facture, au montant restant dû (en centimes). Un lien existant au même montant est réutilisé ;
  // sinon l'ancien est désactivé et un nouveau est créé.
  r.post('/stripe/lien', express.json({ limit: '10kb' }), async (req, res) => {
    const b = req.body || {};
    const id = texte(b.factureId, 80), numero = texte(b.numero, 60), client = texte(b.client, 120);
    const montant = Math.round(Number(b.montant));
    if (!id) return res.status(400).json({ error: 'Facture inconnue.' });
    if (!(montant >= 50 && montant <= 99999999)) return res.status(400).json({ error: 'Le montant à payer doit être d’au moins 0,50 €.' });
    const c = await conf();
    if (!c) return res.status(409).json({ error: 'Stripe n’est pas connecté : un administrateur doit coller la clé Stripe dans Paiements.', code: 'SANS_STRIPE' });
    const tous = await liens(), ancien = tous[id];
    if (ancien && ancien.montant === montant && !ancien.payee) return res.json(ancien);
    try {
      if (ancien && ancien.id && !ancien.payee) await stripe(c.cle, 'POST', `/payment_links/${encodeURIComponent(ancien.id)}`, { active: false }).catch(() => {});
      const nom = 'Facture ' + (numero || id) + (client ? ' · ' + client : '');
      const prix = await stripe(c.cle, 'POST', '/prices', { currency: 'eur', unit_amount: montant, product_data: { name: nom.slice(0, 250) } });
      const lien = await stripe(c.cle, 'POST', '/payment_links', {
        line_items: [{ price: prix.id, quantity: 1 }],
        metadata: { facture_id: id, numero },
        payment_intent_data: { description: nom.slice(0, 250), metadata: { facture_id: id, numero } },
        after_completion: { type: 'hosted_confirmation', hosted_confirmation: { custom_message: ('Merci ! Le paiement de la ' + nom.toLowerCase().replace(/^facture/, 'facture') + ' est bien reçu.').slice(0, 500) } },
      });
      const l = { id: lien.id, url: lien.url, montant, numero, cree: new Date().toISOString() };
      await setSetting(db, 'stripe_liens', { ...(await liens()), [id]: l });
      res.json(l);
    } catch (e) { echec(res, e); }
  });

  // Liens de paiement + paiements reçus. Stripe est interrogé au plus une fois par minute.
  r.get('/stripe/liens', async (req, res) => {
    const c = await conf();
    if (!c) return res.json({ liens: {} });
    try {
      const forcer = req.query.verifier === '1';
      if (forcer || Date.now() - verif.at > 60000) {
        if (!verif.promesse) {
          verif.promesse = (async () => {
            const tous = await liens();
            let change = false;
            for (const [fid, l] of Object.entries(tous)) {
              if (l.payee || !l.id) continue;
              const s = await stripe(c.cle, 'GET', `/checkout/sessions?payment_link=${encodeURIComponent(l.id)}&limit=10`);
              const paye = (s.data || []).find((x) => x.payment_status === 'paid');
              if (paye) {
                tous[fid] = { ...l, payee: true, montantPaye: paye.amount_total, datePaiement: new Date((paye.created || Date.now() / 1000) * 1000).toISOString().slice(0, 10) };
                change = true;
                await stripe(c.cle, 'POST', `/payment_links/${encodeURIComponent(l.id)}`, { active: false }).catch(() => {});
              }
            }
            if (change) await setSetting(db, 'stripe_liens', { ...(await liens()), ...tous });
            verif.at = Date.now();
          })().finally(() => { verif.promesse = null; });
        }
        await verif.promesse;
      }
      res.json({ liens: await liens() });
    } catch (e) { echec(res, e); }
  });

  // ---------------------------------------------------------------- PayPal (API REST, facturation)
  let jetonPaypal = { valeur: '', fin: 0, cle: '' };
  let verifPaypal = { at: 0, promesse: null };
  async function confPaypal() {
    const g = await getSetting(db, 'paypal', null);
    if (!g || !g.id || !g.secret) return null;
    try { return { ...g, secret: dechiffrer(g.secret) }; } catch { return null; }
  }
  const facturesPaypal = async () => (await getSetting(db, 'paypal_factures', null)) || {};
  async function appelWeb(url, o, nom) {
    try { return await web(url, { ...o, signal: AbortSignal.timeout(20000) }); } catch { throw Object.assign(new Error(nom + ' ne répond pas pour le moment : réessayez.'), { status: 502 }); }
  }
  async function jetonPP(id, secret, mode) {
    const cle = mode + ':' + id;
    if (jetonPaypal.cle === cle && jetonPaypal.fin > Date.now() + 60000) return jetonPaypal.valeur;
    const rep = await appelWeb(PAYPAL[mode] + '/v1/oauth2/token', {
      method: 'POST',
      headers: { Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: 'grant_type=client_credentials',
    }, 'PayPal');
    const b = await rep.json().catch(() => ({}));
    if (!rep.ok || !b.access_token) throw Object.assign(new Error('Identifiants PayPal refusés : vérifiez l’identifiant client et le secret de votre application PayPal.'), { status: 400, refuse: rep.status === 401 });
    jetonPaypal = { valeur: b.access_token, fin: Date.now() + (Number(b.expires_in) || 3000) * 1000, cle };
    return b.access_token;
  }
  async function paypal(c, methode, chemin, corps) {
    const jeton = await jetonPP(c.id, c.secret, c.mode);
    const rep = await appelWeb(PAYPAL[c.mode] + chemin, {
      method: methode,
      headers: { Authorization: `Bearer ${jeton}`, 'Content-Type': 'application/json', Accept: 'application/json', Prefer: 'return=representation' },
      body: corps ? JSON.stringify(corps) : undefined,
    }, 'PayPal');
    const b = rep.status === 204 ? {} : await rep.json().catch(() => ({}));
    if (!rep.ok) {
      if (rep.status === 401) jetonPaypal = { valeur: '', fin: 0, cle: '' };
      if (rep.status === 403) throw Object.assign(new Error('Votre application PayPal n’a pas accès à la facturation : dans developer.paypal.com, ouvrez l’application et cochez « Invoicing ».'), { status: 400 });
      const d = (b.details && b.details[0]) || {};
      throw Object.assign(new Error('PayPal a refusé : ' + texte(d.description || b.message || rep.status, 300)), { status: 400 });
    }
    return b;
  }

  r.put('/paypal', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    const id = texte(req.body && req.body.clientId, 200).replace(/\s+/g, '');
    const secret = texte(req.body && req.body.secret, 200).replace(/\s+/g, '');
    if (!PAYPAL_ID.test(id) || !PAYPAL_ID.test(secret)) return res.status(400).json({ error: 'Collez l’identifiant client (Client ID) et le secret (Secret) de votre application PayPal, en entier.' });
    let mode = 'live';
    try {
      try { await jetonPP(id, secret, 'live'); } catch (e) { if (!e.refuse) throw e; mode = 'sandbox'; await jetonPP(id, secret, 'sandbox'); }
      const c = { id, secret, mode };
      await paypal(c, 'POST', '/v2/invoicing/generate-next-invoice-number'); // vérifie l'accès à la facturation
      let compte = '';
      try {
        const t = await paypal(c, 'GET', '/v2/invoicing/templates?fields=all&page_size=1');
        const tpl = (t.templates || [])[0] || {};
        const inv = (tpl.template_info && tpl.template_info.invoicer) || {};
        compte = texte(inv.business_name || inv.email_address || '', 120);
      } catch { /* nom du compte facultatif */ }
      await setSetting(db, 'paypal', { id, secret: chiffrer(secret), mode, compte, at: new Date().toISOString(), par: req.user.id });
      res.json({ paypal: { connecte: true, compte, test: mode === 'sandbox' } });
    } catch (e) { echec(res, e); }
  });

  r.delete('/paypal', async (req, res) => {
    if (!admin(req, res)) return;
    await db.run("DELETE FROM settings WHERE key IN ('paypal', 'paypal_factures')");
    jetonPaypal = { valeur: '', fin: 0, cle: '' };
    res.json({ paypal: { connecte: false } });
  });

  // Facture PayPal d'une facture du CRM, au montant restant dû (en centimes). Elle est « envoyée » sans mail de PayPal :
  // c'est le CRM qui transmet le lien (facture, QR code, mail). Montant changé : l'ancienne est annulée, une nouvelle est créée.
  r.post('/paypal/facture', express.json({ limit: '10kb' }), async (req, res) => {
    const b = req.body || {};
    const id = texte(b.factureId, 80), numero = texte(b.numero, 60), client = texte(b.client, 120), email = texte(b.email, 200);
    const montant = Math.round(Number(b.montant));
    if (!id) return res.status(400).json({ error: 'Facture inconnue.' });
    if (!(montant >= 100 && montant <= 99999999)) return res.status(400).json({ error: 'Le montant à payer doit être d’au moins 1 €.' });
    const c = await confPaypal();
    if (!c) return res.status(409).json({ error: 'PayPal n’est pas connecté : un administrateur doit coller les identifiants PayPal dans Paiements.', code: 'SANS_PAYPAL' });
    const tous = await facturesPaypal(), ancien = tous[id];
    if (ancien && ancien.montant === montant && !ancien.payee) return res.json(ancien);
    try {
      if (ancien && ancien.id && !ancien.payee) {
        await paypal(c, 'POST', `/v2/invoicing/invoices/${encodeURIComponent(ancien.id)}/cancel`, { send_to_invoicer: false, send_to_recipient: false }).catch(() => {});
      }
      const essai = ancien ? (ancien.essai || 1) + 1 : 1;
      const nom = 'Facture ' + (numero || id) + (client ? ' · ' + client : '');
      const corps = {
        detail: { currency_code: 'EUR', invoice_number: ((numero || id) + (essai > 1 ? '-' + essai : '')).slice(0, 127), note: ('Règlement de la ' + nom.charAt(0).toLowerCase() + nom.slice(1)).slice(0, 4000) },
        items: [{ name: nom.slice(0, 200), quantity: '1', unit_amount: { currency_code: 'EUR', value: (montant / 100).toFixed(2) } }],
      };
      if (EMAIL.test(email)) corps.primary_recipients = [{ billing_info: { email_address: email, ...(client ? { business_name: client.slice(0, 100) } : {}) } }];
      const cree = await paypal(c, 'POST', '/v2/invoicing/invoices', corps);
      const pid = cree.id || String(cree.href || '').split('/').pop();
      if (!pid) throw Object.assign(new Error('PayPal n’a pas renvoyé de numéro de facture.'), { status: 502 });
      const envoi = await paypal(c, 'POST', `/v2/invoicing/invoices/${encodeURIComponent(pid)}/send`, { send_to_invoicer: false, send_to_recipient: false });
      let url = envoi.href && envoi.rel === 'payer-view' ? envoi.href : '';
      if (!url) {
        const d = await paypal(c, 'GET', `/v2/invoicing/invoices/${encodeURIComponent(pid)}`);
        url = (d.detail && d.detail.metadata && d.detail.metadata.recipient_view_url) || '';
      }
      if (!/^https:\/\//.test(url)) throw Object.assign(new Error('PayPal n’a pas renvoyé de lien de paiement.'), { status: 502 });
      const f = { id: pid, url, montant, numero, essai, cree: new Date().toISOString() };
      await setSetting(db, 'paypal_factures', { ...(await facturesPaypal()), [id]: f });
      res.json(f);
    } catch (e) { echec(res, e); }
  });

  // Factures PayPal + paiements reçus. PayPal est interrogé au plus une fois par minute.
  r.get('/paypal/factures', async (req, res) => {
    const c = await confPaypal();
    if (!c) return res.json({ factures: {} });
    try {
      if (req.query.verifier === '1' || Date.now() - verifPaypal.at > 60000) {
        if (!verifPaypal.promesse) {
          verifPaypal.promesse = (async () => {
            const tous = await facturesPaypal();
            let change = false;
            for (const [fid, f] of Object.entries(tous)) {
              if (f.payee || !f.id) continue;
              const d = await paypal(c, 'GET', `/v2/invoicing/invoices/${encodeURIComponent(f.id)}`);
              if (PAYPAL_PAYEE.has(d.status)) {
                const p = d.payments || {}, t = (p.transactions || [])[0] || {};
                tous[fid] = { ...f, payee: true, statut: d.status, montantPaye: Math.round(Number((p.paid_amount && p.paid_amount.value) || f.montant / 100) * 100), datePaiement: texte(t.payment_date, 10) || new Date().toISOString().slice(0, 10) };
                change = true;
              } else if (d.status && d.status !== f.statut) { tous[fid] = { ...f, statut: d.status }; change = true; }
            }
            if (change) await setSetting(db, 'paypal_factures', { ...(await facturesPaypal()), ...tous });
            verifPaypal.at = Date.now();
          })().finally(() => { verifPaypal.promesse = null; });
        }
        await verifPaypal.promesse;
      }
      res.json({ factures: await facturesPaypal() });
    } catch (e) { echec(res, e); }
  });

  // ---------------------------------------------------------------- Mercury (banque : soldes et virements reçus)
  let cacheMercury = { at: 0, cle: '', donnees: null };
  async function confMercury() {
    const g = await getSetting(db, 'mercury', null);
    if (!g || !g.jeton) return null;
    try { return { ...g, jeton: dechiffrer(g.jeton) }; } catch { return null; }
  }
  async function mercury(jeton, chemin) {
    const rep = await appelWeb(MERCURY + chemin, { headers: { Authorization: `Bearer ${jeton}`, Accept: 'application/json' } }, 'Mercury');
    const b = await rep.json().catch(() => ({}));
    if (!rep.ok) {
      if (rep.status === 401) throw Object.assign(new Error('Jeton Mercury refusé : créez un jeton dans Mercury (Paramètres › Jetons d’API) puis collez-le de nouveau.'), { status: 400 });
      if (rep.status === 403) throw Object.assign(new Error('Mercury refuse ce jeton depuis le serveur du CRM : utilisez un jeton « Lecture seule » (Read only), qui ne demande pas de liste d’adresses IP.'), { status: 400 });
      throw Object.assign(new Error('Mercury a refusé : ' + texte(b.errors && b.errors.message || b.message || rep.status, 300)), { status: 400 });
    }
    return b;
  }
  const comptesActifs = (b) => (b.accounts || []).filter((a) => a && a.status === 'active' && a.type !== 'external' && a.type !== 'recipient');

  r.put('/mercury', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    let jeton = texte(req.body && req.body.jeton, 400).replace(/\s+/g, '');
    if (!/^(secret-token:)?[A-Za-z0-9_\-:.]{20,}$/.test(jeton)) return res.status(400).json({ error: 'Collez le jeton d’API Mercury en entier (il commence par « secret-token: »).' });
    if (!jeton.startsWith('secret-token:')) jeton = 'secret-token:' + jeton;
    try {
      const b = await mercury(jeton, '/accounts');
      const a = comptesActifs(b)[0] || (b.accounts || [])[0] || {};
      const compte = texte(a.legalBusinessName || a.name || '', 120);
      await setSetting(db, 'mercury', { jeton: chiffrer(jeton), compte, at: new Date().toISOString(), par: req.user.id });
      cacheMercury = { at: 0, cle: '', donnees: null };
      res.json({ mercury: { connecte: true, compte } });
    } catch (e) { echec(res, e); }
  });

  r.delete('/mercury', async (req, res) => {
    if (!admin(req, res)) return;
    await db.run("DELETE FROM settings WHERE key = 'mercury'");
    cacheMercury = { at: 0, cle: '', donnees: null };
    res.json({ mercury: { connecte: false } });
  });

  // Comptes (solde) et opérations des 30 derniers jours, pour les administrateurs. Les numéros de compte complets ne
  // quittent pas le serveur.
  r.get('/mercury', async (req, res) => {
    if (!admin(req, res)) return;
    const c = await confMercury();
    if (!c) return res.status(409).json({ error: 'Mercury n’est pas connecté.', code: 'SANS_MERCURY' });
    try {
      if (req.query.actualiser === '1' || cacheMercury.cle !== c.at || Date.now() - cacheMercury.at > 60000) {
        const debut = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
        const comptes = comptesActifs(await mercury(c.jeton, '/accounts'));
        const operations = [];
        for (const a of comptes.slice(0, 6)) {
          const t = await mercury(c.jeton, `/account/${encodeURIComponent(a.id)}/transactions?limit=200&order=desc&start=${debut}`);
          for (const x of t.transactions || []) {
            if (!x || x.status === 'cancelled' || x.status === 'failed' || x.status === 'blocked') continue;
            operations.push({
              id: texte(x.id, 64), compte: texte(a.nickname || a.name, 80), montant: Math.round(Number(x.amount) * 100) / 100,
              date: texte(x.postedAt || x.createdAt, 10), statut: texte(x.status, 20), type: texte(x.kind, 40),
              libelle: texte(x.counterpartyNickname || x.counterpartyName, 120),
              detail: texte([x.externalMemo, x.bankDescription, x.note].filter(Boolean).join(' · '), 240),
              lien: /^https:\/\//.test(x.dashboardLink || '') ? x.dashboardLink : '',
            });
          }
        }
        operations.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        cacheMercury = {
          at: Date.now(), cle: c.at,
          donnees: {
            compte: c.compte || '',
            comptes: comptes.map((a) => ({
              id: a.id, nom: texte(a.nickname || a.name, 80), type: texte(a.kind, 40), fin: texte(a.accountNumber, 40).slice(-4),
              solde: Number(a.currentBalance) || 0, disponible: Number(a.availableBalance) || 0, lien: /^https:\/\//.test(a.dashboardLink || '') ? a.dashboardLink : '',
            })),
            operations: operations.slice(0, 300),
            maj: new Date().toISOString(),
          },
        };
      }
      res.json(cacheMercury.donnees);
    } catch (e) { echec(res, e); }
  });

  return r;
}
