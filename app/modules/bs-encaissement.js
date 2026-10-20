/* Blackstart CRM : paiement en ligne des factures (page Paiements).
 *
 * Stripe : un administrateur colle la clé Stripe ; pour chaque facture à encaisser, le serveur crée un lien de
 * paiement Stripe au montant restant dû. Le lien est mis dans window.BS_PAY_LINKS, que le bloc « Règlement » des
 * factures (bs-reglement.js, avec QR code) et le mail d'envoi de facture reprennent. Les factures payées sur Stripe
 * passent toutes seules en « payée » (le serveur interroge Stripe).
 * PayPal : le lien PayPal.me réglé dans « Liens de paiement » reçoit le montant de chaque facture (bs-reglement.js).
 * Logos : window.bsEncaissement.logo('stripe' | 'paypal' | 'payoneer').
 */
(function () {
  'use strict';
  if (window.bsEncaissement) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var eur = function (n) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n); };

  // Logos (simple-icons, CC0) sur la couleur de chaque marque.
  var LOGOS = {
    stripe: ['#635BFF', '<path fill="#fff" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" transform="translate(4.8 4.8) scale(.6)"/>'],
    paypal: ['#003087', '<path fill="#fff" d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" transform="translate(4.8 4.8) scale(.6)"/>'],
    payoneer: ['#FF4800', '<circle cx="12" cy="12" r="5.2" fill="none" stroke="#fff" stroke-width="2.4"/>']
  };
  function logo(nom, taille) {
    var l = LOGOS[nom]; if (!l) return '';
    var t = taille || 20;
    return '<svg class="bsenc-logo" viewBox="0 0 24 24" width="' + t + '" height="' + t + '" role="img" aria-label="' + esc(nom[0].toUpperCase() + nom.slice(1)) + '"><rect width="24" height="24" rx="6" fill="' + l[0] + '"/>' + l[1] + '</svg>';
  }

  function store() { var R = window.__bsStore; return R && R.get ? R.get() : {}; }
  function total(f) { // même calcul que le CRM : HT après remise + TVA par taux
    var parTaux = {}, brut = 0;
    (f.lignes || []).forEach(function (l) { var v = (Number(l.quantite) || 0) * (Number(l.prixUnitaire) || 0); brut += v; var t = Number(l.tva) || 0; parTaux[t] = (parTaux[t] || 0) + v; });
    var rem = Math.min(100, Math.max(0, Number(f.remise) || 0)) / 100, tva = 0;
    Object.keys(parTaux).forEach(function (t) { tva += parTaux[t] * (1 - rem) * (Number(t) / 100); });
    return brut * (1 - rem) + tva;
  }
  function reste(f) { return Math.max(0, Math.round((total(f) - (f.paiements || []).reduce(function (s, p) { return s + (Number(p.montant) || 0); }, 0)) * 100)); }
  function aPayer() { return (store().factures || []).filter(function (f) { return f.statut === 'a_payer'; }); }

  var S = { etat: null, liens: {}, msg: null, envoi: false, encours: {}, copie: '' };
  var racine = null;

  function api(methode, url, corps) {
    return fetch(url, { method: methode, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw Object.assign(new Error(b.error || 'Erreur ' + r.status), { code: b.code }); return b; }); });
  }
  function permis() { return !!window.BS_SERVER && (!window.bsAcces || !window.bsAcces.peut || window.bsAcces.peut('payments')); }

  // Liens à jour → window.BS_PAY_LINKS (seulement s'ils correspondent encore au montant dû) ; paiements reçus → facture payée.
  function appliquer() {
    var R = window.__bsStore, fs = (store().factures || []), map = {}, payees = [];
    fs.forEach(function (f) {
      var l = S.liens[f.id]; if (!l) return;
      if (l.payee) { if (f.statut === 'a_payer') payees.push([f, l]); return; }
      if (f.statut === 'a_payer' && l.montant === reste(f)) map[f.id] = l.url;
    });
    window.BS_PAY_LINKS = map;
    if (payees.length && R && R.set) {
      var n = new Date();
      R.set(function (s) {
        return {
          factures: s.factures.map(function (f) { var x = payees.filter(function (p) { return p[0].id === f.id; })[0]; return x ? Object.assign({}, f, { statut: 'payee', datePaiement: x[1].datePaiement || n.toISOString().slice(0, 10), moyenPaiement: 'Stripe' }) : f; }),
          prospects: s.prospects.map(function (p) {
            var evs = payees.filter(function (x) { return x[0].prospectId === p.id; }).map(function (x) {
              return { id: Math.random().toString(36).slice(2) + n.getTime().toString(36), at: n.toISOString(), date: n.toISOString().slice(0, 10), time: n.toTimeString().slice(0, 5), type: 'facture', text: 'Facture ' + (x[0].numero || '') + ' : payée en ligne (Stripe)' };
            });
            return evs.length ? Object.assign({}, p, { events: evs.concat(p.events || []).slice(0, 200) }) : p;
          })
        };
      });
      S.msg = { k: 'ok', t: payees.length === 1 ? 'Paiement reçu sur Stripe : la facture ' + (payees[0][0].numero || '') + ' est marquée payée.' : payees.length + ' paiements reçus sur Stripe : les factures sont marquées payées.' };
    }
  }
  function charger(verifier) {
    if (!permis()) return Promise.resolve();
    return api('GET', '/api/paiements/stripe/liens' + (verifier ? '?verifier=1' : '')).then(function (b) { S.liens = b.liens || {}; appliquer(); rendre(); }, function (e) { if (verifier) { S.msg = { k: 'warn', t: e.message }; rendre(); } });
  }
  function etat() {
    if (!permis()) return Promise.resolve();
    return api('GET', '/api/paiements/etat').then(function (b) { S.etat = b; rendre(); if (b.stripe && b.stripe.connecte) charger(false); }, function () { S.etat = { stripe: { connecte: false } }; rendre(); });
  }

  function creerLien(f) {
    S.encours[f.id] = true; rendre();
    return api('POST', '/api/paiements/stripe/lien', { factureId: f.id, numero: f.numero, client: f.clientNom, montant: reste(f) })
      .then(function (l) { S.liens[f.id] = l; appliquer(); return l; })
      .catch(function (e) { S.msg = { k: 'warn', t: e.message }; return null; })
      .then(function (l) { delete S.encours[f.id]; rendre(); return l; });
  }
  function creerTous() {
    var fs = aPayer().filter(function (f) { return reste(f) >= 50 && !(window.BS_PAY_LINKS || {})[f.id]; });
    return fs.reduce(function (p, f) { return p.then(function () { return creerLien(f); }); }, Promise.resolve()).then(function () {
      if (!S.msg || S.msg.k !== 'warn') S.msg = { k: 'ok', t: fs.length + ' lien' + (fs.length > 1 ? 's' : '') + ' de paiement prêt' + (fs.length > 1 ? 's' : '') + ' : ils apparaissent sur les factures et dans les mails d’envoi.' };
      rendre();
    });
  }
  function copier(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return false; });
    return Promise.resolve(false);
  }

  var CSS = '.bsenc{padding-bottom:14px}.bsenc>*:not(.card-head){margin-left:18px;margin-right:18px}' +
    '.bsenc-logo{flex:none;display:inline-block;vertical-align:middle;border-radius:6px}' +
    '.bsenc-tetes{display:flex;gap:6px;align-items:center}' +
    '.bsenc-bloc{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--border)}.bsenc-bloc:first-of-type{border-top:0}' +
    '.bsenc-bloc>div{flex:1;min-width:0;font-size:14px;line-height:1.5}.bsenc-bloc b{font-size:14.5px}.bsenc-bloc p{margin:2px 0 0;color:var(--text-2);font-size:13.5px}' +
    '.bsenc-bloc ol{margin:6px 0 8px;padding-left:20px;color:var(--text-2);font-size:13.5px}' +
    '.bsenc form{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.bsenc form input{flex:1;min-width:0}' +
    '.bsenc-ok{color:#16a34a;font-weight:700}.bsenc-test{display:inline-block;margin-left:6px;font-size:11.5px;font-weight:700;border-radius:999px;padding:1px 8px;background:rgba(245,158,11,.15);color:#b45309}' +
    '.bsenc-fact{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:8px 0;border-top:1px dashed var(--border);font-size:13.5px}.bsenc-fact span{flex:1 1 100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-2)}.bsenc-fact b{flex:1;white-space:nowrap}' +
    '.bsenc-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}' +
    '.bsenc-msg{border-radius:10px;padding:9px 12px;font-size:13.5px;margin-top:10px;background:var(--surface-2);border:1px solid var(--border)}.bsenc-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsenc-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsenc-lab{display:inline-flex;align-items:center;gap:8px}.bsenc-tool{background:none!important;padding:0!important;overflow:hidden}.bsenc-tool svg{display:block;width:100%;height:100%}' +
    '@media (max-width:640px){.bsenc>*:not(.card-head){margin-left:12px;margin-right:12px}}';
  function css() { if (document.getElementById('bsenc-css')) return; var s = document.createElement('style'); s.id = 'bsenc-css'; s.textContent = CSS; document.head.appendChild(s); }

  function vueStripe() {
    var e = S.etat, st = e && e.stripe;
    if (!e) return '<div class="bsenc-bloc">' + logo('stripe', 36) + '<div><b>Stripe</b><p>Chargement…</p></div></div>';
    if (!st.connecte) {
      return '<div class="bsenc-bloc">' + logo('stripe', 36) + '<div><b>Stripe</b><p>Carte bancaire, Apple Pay, Google Pay (et PayPal si vous l’activez dans Stripe). Le lien de paiement s’ajoute sur chaque facture et dans le mail d’envoi, et la facture passe en « payée » toute seule.</p>' +
        (e.admin ? '<ol><li>Ouvrez votre compte sur <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener">dashboard.stripe.com</a> et activez-le.</li><li>Développeurs › Clés API : copiez la clé secrète (sk_live_…).</li><li>Collez-la ici. Elle est gardée chiffrée sur le serveur du CRM.</li></ol>' +
          '<form data-form="stripe"><input class="input" type="password" name="cle" placeholder="sk_live_…" autocomplete="off" aria-label="Clé secrète Stripe"><button type="submit" class="btn btn-primary btn-sm"' + (S.envoi ? ' disabled' : '') + '>' + (S.envoi ? 'Vérification…' : 'Connecter Stripe') + '</button></form>' +
          '<p style="font-size:12.5px;margin-top:6px">Pour essayer sans encaisser, collez une clé de test (sk_test_…).</p>'
          : '<p>Demandez à un administrateur de connecter Stripe.</p>') + '</div></div>';
    }
    var fs = aPayer();
    var liens = window.BS_PAY_LINKS || {};
    var sans = fs.filter(function (f) { return reste(f) >= 50 && !liens[f.id]; }).length;
    return '<div class="bsenc-bloc">' + logo('stripe', 36) + '<div><b>Stripe</b> <span class="bsenc-ok">✓ connecté</span>' + (st.test ? '<span class="bsenc-test">mode test</span>' : '') +
      '<p>' + esc(st.compte ? 'Compte : ' + st.compte + '. ' : '') + 'Les factures payées en ligne passent en « payée » toutes seules.</p>' +
      (fs.length ? fs.slice(0, 12).map(function (f) {
        var l = liens[f.id], r = reste(f);
        return '<div class="bsenc-fact"><span>' + esc((f.numero || 'Facture') + ' · ' + (f.clientNom || 'Sans client')) + '</span><b>' + eur(r / 100) + '</b>' +
          (r < 50 ? '' : l ? '<button type="button" class="btn btn-ghost btn-sm" data-copier="' + esc(f.id) + '">' + (S.copie === f.id ? 'Copié' : 'Copier le lien') + '</button>'
            : '<button type="button" class="btn btn-secondary btn-sm" data-lien="' + esc(f.id) + '"' + (S.encours[f.id] ? ' disabled' : '') + '>' + (S.encours[f.id] ? 'Création…' : 'Créer le lien') + '</button>') + '</div>';
      }).join('') : '<p>Aucune facture à encaisser.</p>') +
      '<div class="bsenc-act">' + (sans > 1 ? '<button type="button" class="btn btn-primary btn-sm" data-act="tous">Créer les ' + sans + ' liens</button>' : '') +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="verifier">Vérifier les paiements</button>' +
      (e.admin ? '<button type="button" class="btn btn-ghost btn-sm" data-act="deconnecter">Déconnecter</button>' : '') + '</div></div></div>';
  }
  function vuePaypal() {
    var lien = ((store().companyInfo || {}).paymentLinks || {}).paypal || '';
    var me = /paypal\.me\//i.test(lien);
    return '<div class="bsenc-bloc">' + logo('paypal', 36) + '<div><b>PayPal</b>' + (me ? ' <span class="bsenc-ok">✓ prêt</span>' : '') +
      (me ? '<p>Votre lien PayPal.me <a href="' + esc(lien) + '" target="_blank" rel="noopener">' + esc(lien.replace(/^https?:\/\/(www\.)?/, '')) + '</a> reçoit le montant exact de chaque facture.</p>'
        : lien ? '<p>Votre lien PayPal est affiché sur les factures. Avec un lien PayPal.me, le montant de chaque facture est rempli tout seul.</p>'
          : '<p>Collez votre lien PayPal.me (paypal.me/votrenom) dans « Liens de paiement » ci-dessous : il apparaîtra sur chaque facture avec le bon montant. Pas encore de lien ? <a href="https://www.paypal.com/paypalme/" target="_blank" rel="noopener">Créez-le sur PayPal</a>.</p>') +
      '<p style="font-size:12.5px">Marquez la facture « payée » quand l’argent arrive sur PayPal.</p></div></div>';
  }
  function rendre() {
    if (!racine || !racine.isConnected) return;
    racine.innerHTML = '<section class="card bsenc"><header class="card-head"><div><h3 class="card-title">Paiement en ligne</h3><p class="card-sub">Vos clients paient leurs factures par carte ou PayPal.</p></div><div class="card-actions bsenc-tetes">' + logo('stripe', 22) + logo('paypal', 22) + '</div></header>' +
      vueStripe() + vuePaypal() + (S.msg ? '<div class="bsenc-msg ' + S.msg.k + '">' + esc(S.msg.t) + '</div>' : '') + '</section>';
  }
  function brancher(el) {
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (ev.target.getAttribute('data-form') !== 'stripe') return;
      var v = (ev.target.querySelector('input[name=cle]') || {}).value || '';
      if (!v.trim()) return;
      S.envoi = true; S.msg = null; rendre();
      api('PUT', '/api/paiements/stripe', { cle: v.trim() }).then(function (b) {
        S.envoi = false; S.etat = Object.assign({}, S.etat, { stripe: b.stripe }); S.msg = { k: 'ok', t: 'Stripe est connecté' + (b.stripe.test ? ' en mode test' : '') + ' : créez les liens de paiement de vos factures.' }; rendre(); charger(false);
      }, function (e) { S.envoi = false; S.msg = { k: 'warn', t: e.message }; rendre(); });
    });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-lien],[data-copier],[data-act]'); if (!t) return;
      var fs = store().factures || [];
      if (t.hasAttribute('data-lien')) { var f = fs.filter(function (x) { return x.id === t.getAttribute('data-lien'); })[0]; if (f) creerLien(f); return; }
      if (t.hasAttribute('data-copier')) { var id = t.getAttribute('data-copier'), url = (window.BS_PAY_LINKS || {})[id]; if (url) copier(url).then(function (ok) { S.copie = ok ? id : ''; rendre(); setTimeout(function () { S.copie = ''; rendre(); }, 1500); }); return; }
      var a = t.getAttribute('data-act');
      if (a === 'tous') creerTous();
      if (a === 'verifier') { S.msg = null; charger(true).then(function () { if (!S.msg) { S.msg = { k: 'ok', t: 'Paiements vérifiés sur Stripe : rien de nouveau.' }; rendre(); } }); }
      if (a === 'deconnecter' && window.confirm('Déconnecter Stripe ? Les liens de paiement déjà envoyés restent valables chez Stripe, mais le CRM ne suivra plus les paiements.')) {
        api('DELETE', '/api/paiements/stripe').then(function (b) { S.etat = Object.assign({}, S.etat, { stripe: b.stripe }); S.liens = {}; appliquer(); S.msg = { k: 'ok', t: 'Stripe est déconnecté.' }; rendre(); }, function (e) { S.msg = { k: 'warn', t: e.message }; rendre(); });
      }
    });
  }

  function monter(el) {
    if (!el) return;
    css();
    if (el === racine && el.__bsEnc) { rendre(); return; }
    racine = el; el.__bsEnc = true;
    brancher(el);
    rendre();
    etat();
  }

  // Au démarrage : liens et paiements reçus, pour les aperçus de factures et les mails, même sans ouvrir Paiements.
  function demarrer() {
    var R = window.__bsStore;
    if (!R || !R.get || !R.get().loaded) return setTimeout(demarrer, 800);
    css();
    if (!permis()) return;
    api('GET', '/api/paiements/etat').then(function (b) { S.etat = b; if (b.stripe && b.stripe.connecte) charger(false); }, function () { /* hors ligne */ });
    setInterval(function () { if (S.etat && S.etat.stripe && S.etat.stripe.connecte && document.visibilityState === 'visible') charger(false); }, 5 * 60 * 1000);
  }
  if (window.BS_SERVER) setTimeout(demarrer, 500);

  window.bsEncaissement = { monter: monter, logo: logo, reste: reste, _etat: S };
})();
