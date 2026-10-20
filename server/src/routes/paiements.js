// /api/paiements : paiement en ligne des factures avec Stripe (carte bancaire, Apple Pay, Google Pay, et PayPal
// quand il est activé dans Stripe).
// - Un administrateur colle la clé secrète Stripe (ou une clé restreinte) : vérifiée, puis chiffrée en base.
// - Pour chaque facture à encaisser, le CRM crée un lien de paiement Stripe au montant restant dû ; le lien
//   apparaît sur la facture (avec un QR code) et dans le mail d'envoi.
// - Le CRM demande à Stripe quelles factures ont été payées et les marque « payées » (pas besoin de webhook).
// PayPal.me reste un simple lien réglé dans Paiements (aucune clé).
import express, { Router } from 'express';
import { getSetting, setSetting } from '../store.js';
import { coffre } from '../coffre.js';

const STRIPE = 'https://api.stripe.com/v1';
const CLE_FORMAT = /^(sk|rk)_(live|test)_[A-Za-z0-9]{16,}$/;
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
    const c = await conf();
    res.json({ admin: req.user.role === 'admin', stripe: c ? { connecte: true, compte: c.compte || '', test: !!c.test } : { connecte: false } });
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

  return r;
}
