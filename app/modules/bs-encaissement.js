/* Blackstart CRM : paiement en ligne des factures et banque (page Paiements).
 *
 * Stripe : un administrateur colle la clé Stripe ; pour chaque facture à encaisser, le serveur crée un lien de
 * paiement Stripe au montant restant dû. Le lien est mis dans window.BS_PAY_LINKS, que le bloc « Règlement » des
 * factures (bs-reglement.js, avec QR code) et le mail d'envoi de facture reprennent. Les factures payées sur Stripe
 * passent toutes seules en « payée » (le serveur interroge Stripe).
 * PayPal : un administrateur colle l'identifiant et le secret de son application PayPal ; chaque facture peut avoir sa
 * facture PayPal (payable par compte PayPal ou par carte), dans window.BS_PAYPAL_LINKS (et dans BS_PAY_LINKS quand il
 * n'y a pas de lien Stripe). Payée chez PayPal : la facture passe en « payée » toute seule. Sans connexion, le lien
 * PayPal.me réglé dans « Liens de paiement » reçoit le montant de chaque facture (bs-reglement.js).
 * Mercury : un administrateur colle un jeton d'API en lecture seule ; la page affiche les soldes et les virements reçus,
 * avec la facture qui correspond (numéro, client ou montant), à marquer payée d'un clic.
 * Logos : window.bsEncaissement.logo('stripe' | 'paypal' | 'payoneer' | 'mercury').
 */
(function () {
  'use strict';
  if (window.bsEncaissement) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var eur = function (n) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n); };
  var usd = function (n) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(n); };
  var jour = function (d) { return d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''; };

  // Logos (simple-icons, CC0) sur la couleur de chaque marque ; Mercury : simple monogramme.
  var LOGOS = {
    stripe: ['#635BFF', '<path fill="#fff" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" transform="translate(4.8 4.8) scale(.6)"/>'],
    paypal: ['#003087', '<path fill="#fff" d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" transform="translate(4.8 4.8) scale(.6)"/>'],
    payoneer: ['#FF4800', '<circle cx="12" cy="12" r="5.2" fill="none" stroke="#fff" stroke-width="2.4"/>'],
    mercury: ['#1F2033', '<path d="M7 16.5v-9l5 5.2 5-5.2v9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>']
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
  function emailClient(f) { var p = f.prospectId && (store().prospects || []).filter(function (x) { return x.id === f.prospectId; })[0]; return (p && p.email) || ''; }

  var S = { etat: null, liens: {}, pp: {}, merc: null, mercErr: '', mercCharge: false, msg: null, envoi: '', encours: {}, copie: '' };
  var racine = null;

  function api(methode, url, corps) {
    return fetch(url, { method: methode, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' }, body: corps ? JSON.stringify(corps) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw Object.assign(new Error(b.error || 'Erreur ' + r.status), { code: b.code }); return b; }); });
  }
  function permis() { return !!window.BS_SERVER && (!window.bsAcces || !window.bsAcces.peut || window.bsAcces.peut('payments')); }
  var connecte = function (k) { return !!(S.etat && S.etat[k] && S.etat[k].connecte); };

  // Liens à jour → window.BS_PAY_LINKS / BS_PAYPAL_LINKS (seulement s'ils correspondent encore au montant dû) ;
  // paiements reçus (Stripe, PayPal) → facture payée.
  function appliquer() {
    var R = window.__bsStore, fs = (store().factures || []), map = {}, pp = {}, payees = [];
    fs.forEach(function (f) {
      [['Stripe', S.liens[f.id]], ['PayPal', S.pp[f.id]]].forEach(function (x) {
        var l = x[1]; if (!l) return;
        if (l.payee) { if (f.statut === 'a_payer' && !payees.some(function (p) { return p[0].id === f.id; })) payees.push([f, l, x[0]]); return; }
        if (f.statut === 'a_payer' && l.montant === reste(f)) { if (x[0] === 'Stripe') map[f.id] = l.url; else pp[f.id] = l.url; }
      });
      if (!map[f.id] && pp[f.id]) map[f.id] = pp[f.id];
    });
    window.BS_PAY_LINKS = map;
    window.BS_PAYPAL_LINKS = pp;
    if (payees.length && R && R.set) {
      var n = new Date();
      R.set(function (s) {
        return {
          factures: s.factures.map(function (f) { var x = payees.filter(function (p) { return p[0].id === f.id; })[0]; return x ? Object.assign({}, f, { statut: 'payee', datePaiement: x[1].datePaiement || n.toISOString().slice(0, 10), moyenPaiement: x[2] }) : f; }),
          prospects: s.prospects.map(function (p) {
            var evs = payees.filter(function (x) { return x[0].prospectId === p.id; }).map(function (x) {
              return { id: Math.random().toString(36).slice(2) + n.getTime().toString(36), at: n.toISOString(), date: n.toISOString().slice(0, 10), time: n.toTimeString().slice(0, 5), type: 'facture', text: 'Facture ' + (x[0].numero || '') + ' : payée en ligne (' + x[2] + ')' };
            });
            return evs.length ? Object.assign({}, p, { events: evs.concat(p.events || []).slice(0, 200) }) : p;
          })
        };
      });
      S.msg = { k: 'ok', t: payees.length === 1 ? 'Paiement reçu sur ' + payees[0][2] + ' : la facture ' + (payees[0][0].numero || '') + ' est marquée payée.' : payees.length + ' paiements reçus en ligne : les factures sont marquées payées.' };
    }
  }
  function charger(verifier) {
    if (!permis()) return Promise.resolve();
    return api('GET', '/api/paiements/stripe/liens' + (verifier ? '?verifier=1' : '')).then(function (b) { S.liens = b.liens || {}; appliquer(); rendre(); }, function (e) { if (verifier) { S.msg = { k: 'warn', t: e.message }; rendre(); } });
  }
  function chargerPaypal(verifier) {
    if (!permis()) return Promise.resolve();
    return api('GET', '/api/paiements/paypal/factures' + (verifier ? '?verifier=1' : '')).then(function (b) { S.pp = b.factures || {}; appliquer(); rendre(); }, function (e) { if (verifier) { S.msg = { k: 'warn', t: e.message }; rendre(); } });
  }
  function chargerMercury(actualiser) {
    if (!permis() || !S.etat || !S.etat.admin) return Promise.resolve();
    S.mercCharge = true; rendre();
    return api('GET', '/api/paiements/mercury' + (actualiser ? '?actualiser=1' : '')).then(function (b) { S.merc = b; S.mercErr = ''; }, function (e) { S.mercErr = e.message; })
      .then(function () { S.mercCharge = false; rendre(); });
  }
  function suivre(b) {
    if (b.stripe && b.stripe.connecte) charger(false);
    if (b.paypal && b.paypal.connecte) chargerPaypal(false);
  }
  function etat() {
    if (!permis()) return Promise.resolve();
    return api('GET', '/api/paiements/etat').then(function (b) {
      S.etat = b; rendre(); suivre(b);
      if (b.mercury && b.mercury.connecte && b.admin) chargerMercury(false);
    }, function () { S.etat = { stripe: { connecte: false }, paypal: { connecte: false }, mercury: { connecte: false } }; rendre(); });
  }

  function creer(f, ou) {
    var cle = ou + ':' + f.id;
    S.encours[cle] = true; rendre();
    var req = ou === 'paypal'
      ? api('POST', '/api/paiements/paypal/facture', { factureId: f.id, numero: f.numero, client: f.clientNom, email: emailClient(f), montant: reste(f) })
      : api('POST', '/api/paiements/stripe/lien', { factureId: f.id, numero: f.numero, client: f.clientNom, montant: reste(f) });
    return req
      .then(function (l) { if (ou === 'paypal') S.pp[f.id] = l; else S.liens[f.id] = l; appliquer(); return l; })
      .catch(function (e) { S.msg = { k: 'warn', t: e.message }; return null; })
      .then(function (l) { delete S.encours[cle]; rendre(); return l; });
  }
  function creerTous(ou) {
    var min = ou === 'paypal' ? 100 : 50, deja = ou === 'paypal' ? (window.BS_PAYPAL_LINKS || {}) : S.liens;
    var fs = aPayer().filter(function (f) { var l = deja[f.id]; return reste(f) >= min && !(ou === 'paypal' ? l : l && !l.payee && l.montant === reste(f)); });
    return fs.reduce(function (p, f) { return p.then(function () { return creer(f, ou); }); }, Promise.resolve()).then(function () {
      if (!S.msg || S.msg.k !== 'warn') S.msg = { k: 'ok', t: ou === 'paypal' ? fs.length + ' facture' + (fs.length > 1 ? 's' : '') + ' PayPal prête' + (fs.length > 1 ? 's' : '') + ' : le lien apparaît sur les factures.' : fs.length + ' lien' + (fs.length > 1 ? 's' : '') + ' de paiement prêt' + (fs.length > 1 ? 's' : '') + ' : ils apparaissent sur les factures et dans les mails d’envoi.' };
      rendre();
    });
  }
  function copier(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return false; });
    return Promise.resolve(false);
  }

  // Mercury : facture qui correspond à un virement reçu (numéro de facture dans le libellé, nom du client, même montant).
  function norm(s) { return String(s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z0-9]/g, ''); }
  function correspondances(op) {
    var t = norm(op.libelle + ' ' + op.detail), c = Math.round(op.montant * 100);
    return aPayer().map(function (f) {
      var s = 0, pourquoi = [], num = norm(f.numero), cli = norm(f.clientNom);
      if (num.length >= 4 && t.indexOf(num) >= 0) { s += 3; pourquoi.push('numéro de facture trouvé'); }
      if (cli.length >= 4 && t.indexOf(cli) >= 0) { s += 2; pourquoi.push('nom du client'); }
      if (c === reste(f)) { s += 1; pourquoi.push('même montant'); }
      return { f: f, s: s, pourquoi: pourquoi };
    }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
  }
  function rapprocher(fid, op) {
    var R = window.__bsStore, f = (store().factures || []).filter(function (x) { return x.id === fid; })[0];
    if (!f || !R || !R.set) return;
    var n = new Date(), date = op.date || n.toISOString().slice(0, 10);
    R.set(function (s) {
      return {
        factures: s.factures.map(function (x) { return x.id === fid ? Object.assign({}, x, { statut: 'payee', datePaiement: date, moyenPaiement: 'Virement (Mercury)', mercuryTx: op.id }) : x; }),
        prospects: s.prospects.map(function (p) {
          if (p.id !== f.prospectId) return p;
          var ev = { id: Math.random().toString(36).slice(2) + n.getTime().toString(36), at: n.toISOString(), date: n.toISOString().slice(0, 10), time: n.toTimeString().slice(0, 5), type: 'facture', text: 'Facture ' + (f.numero || '') + ' : payée par virement (Mercury, ' + usd(op.montant) + ')' };
          return Object.assign({}, p, { events: [ev].concat(p.events || []).slice(0, 200) });
        })
      };
    });
    S.msg = { k: 'ok', t: 'La facture ' + (f.numero || '') + ' est marquée payée (virement Mercury du ' + jour(date) + ').' };
    rendre();
  }

  var CSS = '.bsenc{padding-bottom:14px}.bsenc>*:not(.card-head){margin-left:18px;margin-right:18px}.bsenc+.bsenc{margin-top:16px}' +
    '.bsenc-logo{flex:none;display:inline-block;vertical-align:middle;border-radius:6px}' +
    '.bsenc-tetes{display:flex;gap:6px;align-items:center}' +
    '.bsenc-bloc{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--border)}.bsenc-bloc:first-of-type{border-top:0}' +
    '.bsenc-bloc>div{flex:1;min-width:0;font-size:14px;line-height:1.5}.bsenc-bloc b{font-size:14.5px}.bsenc-bloc p{margin:2px 0 0;color:var(--text-2);font-size:13.5px}' +
    '.bsenc-bloc ol{margin:6px 0 8px;padding-left:20px;color:var(--text-2);font-size:13.5px}' +
    '.bsenc form{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.bsenc form input{flex:1 1 180px;min-width:0}' +
    '.bsenc-ok{color:#16a34a;font-weight:700}.bsenc-test{display:inline-block;margin-left:6px;font-size:11.5px;font-weight:700;border-radius:999px;padding:1px 8px;background:rgba(245,158,11,.15);color:#b45309}' +
    '.bsenc-fact{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:8px 0;border-top:1px dashed var(--border);font-size:13.5px}.bsenc-fact span{flex:1 1 100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-2)}.bsenc-fact b{flex:1;white-space:nowrap}' +
    '.bsenc-fact select{flex:1 1 200px;min-width:0;max-width:100%}.bsenc-fact .bsenc-why{flex:1 1 100%;font-size:12.5px;color:#16a34a;white-space:normal}' +
    '.bsenc-solde{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;padding:6px 0}.bsenc-solde b{font-size:18px}.bsenc-solde span{color:var(--text-2);font-size:13px}' +
    '.bsenc-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}' +
    '.bsenc-msg{border-radius:10px;padding:9px 12px;font-size:13.5px;margin-top:10px;background:var(--surface-2);border:1px solid var(--border)}.bsenc-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsenc-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsenc-lab{display:inline-flex;align-items:center;gap:8px}.bsenc-tool{background:none!important;padding:0!important;overflow:hidden}.bsenc-tool svg{display:block;width:100%;height:100%}' +
    '@media (max-width:640px){.bsenc>*:not(.card-head){margin-left:12px;margin-right:12px}}';
  function css() { if (document.getElementById('bsenc-css')) return; var s = document.createElement('style'); s.id = 'bsenc-css'; s.textContent = CSS; document.head.appendChild(s); }

  function bouton(form, libelle) { return '<button type="submit" class="btn btn-primary btn-sm"' + (S.envoi ? ' disabled' : '') + '>' + (S.envoi === form ? 'Vérification…' : libelle) + '</button>'; }
  // Factures à encaisser avec, pour chacune, le lien (copier) ou le bouton pour le créer.
  function lignes(ou, liens, min, creerLib) {
    var fs = aPayer();
    if (!fs.length) return '<p>Aucune facture à encaisser.</p>';
    return fs.slice(0, 12).map(function (f) {
      var l = liens[f.id], r = reste(f), cle = ou + ':' + f.id;
      return '<div class="bsenc-fact"><span>' + esc((f.numero || 'Facture') + ' · ' + (f.clientNom || 'Sans client')) + '</span><b>' + eur(r / 100) + '</b>' +
        (r < min ? '' : l ? '<a class="btn btn-ghost btn-sm" href="' + esc(l) + '" target="_blank" rel="noopener">Ouvrir</a><button type="button" class="btn btn-ghost btn-sm" data-copier="' + esc(cle) + '">' + (S.copie === cle ? 'Copié' : 'Copier le lien') + '</button>'
          : '<button type="button" class="btn btn-secondary btn-sm" data-creer="' + esc(cle) + '"' + (S.encours[cle] ? ' disabled' : '') + '>' + (S.encours[cle] ? 'Création…' : creerLib) + '</button>') + '</div>';
    }).join('');
  }

  function vueStripe() {
    var e = S.etat, st = e && e.stripe;
    if (!e) return '<div class="bsenc-bloc">' + logo('stripe', 36) + '<div><b>Stripe</b><p>Chargement…</p></div></div>';
    if (!st.connecte) {
      return '<div class="bsenc-bloc">' + logo('stripe', 36) + '<div><b>Stripe</b><p>Carte bancaire, Apple Pay, Google Pay (et PayPal si vous l’activez dans Stripe). Le lien de paiement s’ajoute sur chaque facture et dans le mail d’envoi, et la facture passe en « payée » toute seule.</p>' +
        (e.admin ? '<ol><li>Ouvrez votre compte sur <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener">dashboard.stripe.com</a> et activez-le.</li><li>Développeurs › Clés API : copiez la clé secrète (sk_live_…).</li><li>Collez-la ici. Elle est gardée chiffrée sur le serveur du CRM.</li></ol>' +
          '<form data-form="stripe"><input class="input" type="password" name="cle" placeholder="sk_live_…" autocomplete="off" aria-label="Clé secrète Stripe">' + bouton('stripe', 'Connecter Stripe') + '</form>' +
          '<p style="font-size:12.5px;margin-top:6px">Pour essayer sans encaisser, collez une clé de test (sk_test_…).</p>'
          : '<p>Demandez à un administrateur de connecter Stripe.</p>') + '</div></div>';
    }
    var stripeSeul = {};
    Object.keys(S.liens).forEach(function (id) { var l = S.liens[id], f = aPayer().filter(function (x) { return x.id === id; })[0]; if (f && !l.payee && l.montant === reste(f)) stripeSeul[id] = l.url; });
    var sans = aPayer().filter(function (f) { return reste(f) >= 50 && !stripeSeul[f.id]; }).length;
    return '<div class="bsenc-bloc">' + logo('stripe', 36) + '<div><b>Stripe</b> <span class="bsenc-ok">✓ connecté</span>' + (st.test ? '<span class="bsenc-test">mode test</span>' : '') +
      '<p>' + esc(st.compte ? 'Compte : ' + st.compte + '. ' : '') + 'Les factures payées en ligne passent en « payée » toutes seules.</p>' +
      lignes('stripe', stripeSeul, 50, 'Créer le lien') +
      '<div class="bsenc-act">' + (sans > 1 ? '<button type="button" class="btn btn-primary btn-sm" data-act="tous:stripe">Créer les ' + sans + ' liens</button>' : '') +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="verifier:stripe">Vérifier les paiements</button>' +
      (e.admin ? '<button type="button" class="btn btn-ghost btn-sm" data-act="deconnecter:stripe">Déconnecter</button>' : '') + '</div></div></div>';
  }

  function vuePaypal() {
    var e = S.etat, st = e && e.paypal;
    var lien = ((store().companyInfo || {}).paymentLinks || {}).paypal || '';
    var me = /paypal\.me\//i.test(lien);
    if (!e) return '<div class="bsenc-bloc">' + logo('paypal', 36) + '<div><b>PayPal</b><p>Chargement…</p></div></div>';
    if (st && st.connecte) {
      var pp = window.BS_PAYPAL_LINKS || {};
      var sans = aPayer().filter(function (f) { return reste(f) >= 100 && !pp[f.id]; }).length;
      return '<div class="bsenc-bloc">' + logo('paypal', 36) + '<div><b>PayPal</b> <span class="bsenc-ok">✓ connecté</span>' + (st.test ? '<span class="bsenc-test">bac à sable</span>' : '') +
        '<p>' + esc(st.compte ? 'Compte : ' + st.compte + '. ' : '') + 'Chaque facture a sa facture PayPal : votre client paie avec son compte PayPal ou par carte, et la facture passe en « payée » toute seule.</p>' +
        lignes('paypal', pp, 100, 'Créer la facture PayPal') +
        '<div class="bsenc-act">' + (sans > 1 ? '<button type="button" class="btn btn-primary btn-sm" data-act="tous:paypal">Créer les ' + sans + ' factures PayPal</button>' : '') +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="verifier:paypal">Vérifier les paiements</button>' +
        (e.admin ? '<button type="button" class="btn btn-ghost btn-sm" data-act="deconnecter:paypal">Déconnecter</button>' : '') + '</div></div></div>';
    }
    var secours = me ? '<p>En attendant, votre lien PayPal.me <a href="' + esc(lien) + '" target="_blank" rel="noopener">' + esc(lien.replace(/^https?:\/\/(www\.)?/, '')) + '</a> reçoit le montant de chaque facture (à marquer payée à la main).</p>'
      : lien ? '<p>En attendant, votre lien PayPal est affiché sur les factures.</p>' : '';
    return '<div class="bsenc-bloc">' + logo('paypal', 36) + '<div><b>PayPal</b>' +
      '<p>Connectez votre compte PayPal Business : chaque facture aura sa facture PayPal (payable par compte PayPal ou par carte), et le CRM verra tout seul quand elle est payée.</p>' +
      (e.admin ? '<ol><li>Connectez-vous sur <a href="https://developer.paypal.com/dashboard/applications/live" target="_blank" rel="noopener">developer.paypal.com</a> avec votre compte PayPal Business.</li><li>Apps &amp; Credentials › onglet « Live » › Create App (type Merchant).</li><li>Dans l’application, gardez « Invoicing » coché.</li><li>Copiez le Client ID et le Secret, puis collez-les ici. Le secret est gardé chiffré sur le serveur du CRM.</li></ol>' +
        '<form data-form="paypal"><input class="input" name="clientId" placeholder="Client ID" autocomplete="off" aria-label="Client ID PayPal"><input class="input" type="password" name="secret" placeholder="Secret" autocomplete="off" aria-label="Secret PayPal">' + bouton('paypal', 'Connecter PayPal') + '</form>' +
        '<p style="font-size:12.5px;margin-top:6px">Pour essayer sans encaisser, collez les identifiants de l’onglet « Sandbox ».</p>'
        : '<p>Demandez à un administrateur de connecter PayPal.</p>') + secours + '</div></div>';
  }

  function vueMercury() {
    var e = S.etat, st = e && e.mercury;
    if (!e) return '';
    if (!st || !st.connecte) {
      return '<div class="bsenc-bloc">' + logo('mercury', 36) + '<div><b>Mercury</b><p>Connectez votre compte Mercury : le CRM affiche vos soldes et les virements reçus, et vous propose la facture qui correspond pour la marquer payée d’un clic.</p>' +
        (e.admin ? '<ol><li>Dans Mercury, ouvrez <a href="https://app.mercury.com/settings/tokens" target="_blank" rel="noopener">Paramètres › Jetons d’API</a>.</li><li>Créez un jeton « Read only » (lecture seule) : le CRM ne peut rien envoyer ni payer.</li><li>Collez-le ici. Il est gardé chiffré sur le serveur du CRM.</li></ol>' +
          '<form data-form="mercury"><input class="input" type="password" name="jeton" placeholder="secret-token:mercury_production_…" autocomplete="off" aria-label="Jeton d’API Mercury">' + bouton('mercury', 'Connecter Mercury') + '</form>'
          : '<p>Demandez à un administrateur de connecter Mercury.</p>') + '</div></div>';
    }
    var tete = '<div class="bsenc-bloc">' + logo('mercury', 36) + '<div><b>Mercury</b> <span class="bsenc-ok">✓ connecté</span>' + (st.compte ? '<p>' + esc(st.compte) + ' · lecture seule</p>' : '');
    if (!e.admin) return tete + '<p>Les soldes et les virements sont visibles par les administrateurs.</p></div></div>';
    var m = S.merc;
    if (!m) return tete + '<p>' + (S.mercErr ? esc(S.mercErr) : 'Chargement des comptes…') + '</p>' + (S.mercErr ? '<div class="bsenc-act"><button type="button" class="btn btn-ghost btn-sm" data-act="actualiser:mercury">Réessayer</button><button type="button" class="btn btn-ghost btn-sm" data-act="deconnecter:mercury">Déconnecter</button></div>' : '') + '</div></div>';
    var utilises = {};
    (store().factures || []).forEach(function (f) { if (f.mercuryTx) utilises[f.mercuryTx] = true; });
    var recus = (m.operations || []).filter(function (o) { return o.montant > 0 && !utilises[o.id]; });
    var fs = aPayer();
    return tete +
      (m.comptes || []).map(function (a) {
        return '<div class="bsenc-solde"><b>' + usd(a.solde) + '</b><span>' + esc(a.nom + (a.fin ? ' ••' + a.fin : '')) + (a.disponible !== a.solde ? ' · disponible ' + usd(a.disponible) : '') + '</span>' +
          (a.lien ? '<a class="sm" href="' + esc(a.lien) + '" target="_blank" rel="noopener">Ouvrir dans Mercury</a>' : '') + '</div>';
      }).join('') +
      '<p style="margin-top:8px"><b style="font-size:13.5px">Virements reçus (30 jours)</b>' + (S.mercErr ? ' · ' + esc(S.mercErr) : '') + '</p>' +
      (recus.length ? recus.slice(0, 8).map(function (o) {
        var c = correspondances(o), best = c[0];
        return '<div class="bsenc-fact" data-op="' + esc(o.id) + '"><span>' + esc(jour(o.date) + ' · ' + (o.libelle || 'Virement') + (o.detail ? ' · ' + o.detail : '')) + '</span><b>' + usd(o.montant) + '</b>' +
          (fs.length ? '<select class="input" aria-label="Facture réglée par ce virement"><option value="">Choisir la facture…</option>' + fs.map(function (f) {
            return '<option value="' + esc(f.id) + '"' + (best && best.f.id === f.id ? ' selected' : '') + '>' + esc((f.numero || 'Facture') + ' · ' + (f.clientNom || 'Sans client') + ' · ' + eur(reste(f) / 100)) + '</option>';
          }).join('') + '</select><button type="button" class="btn btn-secondary btn-sm" data-rapprocher="' + esc(o.id) + '">Marquer payée</button>' : '') +
          (best ? '<span class="bsenc-why">Correspond à ' + esc(best.f.numero || 'la facture') + ' : ' + esc(best.pourquoi.join(', ')) + '</span>' : '') + '</div>';
      }).join('') : '<p>Aucun nouveau virement reçu.</p>') +
      '<div class="bsenc-act"><button type="button" class="btn btn-ghost btn-sm" data-act="actualiser:mercury"' + (S.mercCharge ? ' disabled' : '') + '>' + (S.mercCharge ? 'Actualisation…' : 'Actualiser') + '</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-act="deconnecter:mercury">Déconnecter</button></div>' +
      '<p style="font-size:12.5px;margin-top:6px">Montants en dollars, tels que Mercury les affiche.</p></div></div>';
  }

  function rendre() {
    if (!racine || !racine.isConnected) return;
    racine.innerHTML = '<section class="card bsenc"><header class="card-head"><div><h3 class="card-title">Paiement en ligne</h3><p class="card-sub">Vos clients paient leurs factures par carte ou PayPal.</p></div><div class="card-actions bsenc-tetes">' + logo('stripe', 22) + logo('paypal', 22) + '</div></header>' +
      vueStripe() + vuePaypal() + (S.msg ? '<div class="bsenc-msg ' + S.msg.k + '">' + esc(S.msg.t) + '</div>' : '') + '</section>' +
      (S.etat ? '<section class="card bsenc"><header class="card-head"><div><h3 class="card-title">Banque</h3><p class="card-sub">Soldes et virements reçus, rapprochés de vos factures.</p></div><div class="card-actions bsenc-tetes">' + logo('mercury', 22) + '</div></header>' + vueMercury() + '</section>' : '');
  }

  var CONNEXION = {
    stripe: { url: '/api/paiements/stripe', corps: function (f) { return { cle: f.cle.value.trim() }; }, ok: function (b) { return 'Stripe est connecté' + (b.stripe.test ? ' en mode test' : '') + ' : créez les liens de paiement de vos factures.'; } },
    paypal: { url: '/api/paiements/paypal', corps: function (f) { return { clientId: f.clientId.value.trim(), secret: f.secret.value.trim() }; }, ok: function (b) { return 'PayPal est connecté' + (b.paypal.test ? ' en bac à sable (essai)' : '') + ' : créez les factures PayPal de vos factures.'; } },
    mercury: { url: '/api/paiements/mercury', corps: function (f) { return { jeton: f.jeton.value.trim() }; }, ok: function () { return 'Mercury est connecté : vos soldes et virements reçus s’affichent ci-dessous.'; } }
  };
  var NOMS = { stripe: 'Stripe', paypal: 'PayPal', mercury: 'Mercury' };
  var DECONNEXION = {
    stripe: 'Déconnecter Stripe ? Les liens de paiement déjà envoyés restent valables chez Stripe, mais le CRM ne suivra plus les paiements.',
    paypal: 'Déconnecter PayPal ? Les factures PayPal déjà envoyées restent payables chez PayPal, mais le CRM ne suivra plus les paiements.',
    mercury: 'Déconnecter Mercury ? Le CRM n’affichera plus vos soldes ni vos virements. Pensez aussi à supprimer le jeton dans Mercury.'
  };

  function brancher(el) {
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ou = ev.target.getAttribute('data-form'), c = CONNEXION[ou]; if (!c || S.envoi) return;
      var corps = c.corps(ev.target);
      if (Object.keys(corps).some(function (k) { return !corps[k]; })) return;
      S.envoi = ou; S.msg = null; rendre();
      api('PUT', c.url, corps).then(function (b) {
        S.envoi = ''; S.etat = Object.assign({}, S.etat); S.etat[ou] = b[ou]; S.msg = { k: 'ok', t: c.ok(b) }; rendre();
        if (ou === 'stripe') charger(false); else if (ou === 'paypal') chargerPaypal(false); else chargerMercury(true);
      }, function (e) { S.envoi = ''; S.msg = { k: 'warn', t: e.message }; rendre(); });
    });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-creer],[data-copier],[data-act],[data-rapprocher]'); if (!t) return;
      var fs = store().factures || [];
      if (t.hasAttribute('data-creer')) {
        var p = t.getAttribute('data-creer').split(':'), f = fs.filter(function (x) { return x.id === p.slice(1).join(':'); })[0];
        if (f) creer(f, p[0]);
        return;
      }
      if (t.hasAttribute('data-copier')) {
        var cle = t.getAttribute('data-copier'), q = cle.split(':'), id = q.slice(1).join(':');
        var url = q[0] === 'paypal' ? (window.BS_PAYPAL_LINKS || {})[id] : (S.liens[id] || {}).url;
        if (url) copier(url).then(function (ok) { S.copie = ok ? cle : ''; rendre(); setTimeout(function () { S.copie = ''; rendre(); }, 1500); });
        return;
      }
      if (t.hasAttribute('data-rapprocher')) {
        var op = ((S.merc && S.merc.operations) || []).filter(function (o) { return o.id === t.getAttribute('data-rapprocher'); })[0];
        var sel = t.closest('.bsenc-fact').querySelector('select');
        if (!op || !sel) return;
        if (!sel.value) { S.msg = null; sel.focus(); return; }
        rapprocher(sel.value, op);
        return;
      }
      var a = t.getAttribute('data-act').split(':'), quoi = a[0], ou2 = a[1];
      if (quoi === 'tous') creerTous(ou2);
      if (quoi === 'verifier') {
        S.msg = null;
        (ou2 === 'paypal' ? chargerPaypal(true) : charger(true)).then(function () { if (!S.msg) { S.msg = { k: 'ok', t: 'Paiements vérifiés sur ' + NOMS[ou2] + ' : rien de nouveau.' }; rendre(); } });
      }
      if (quoi === 'actualiser') chargerMercury(true);
      if (quoi === 'deconnecter' && window.confirm(DECONNEXION[ou2])) {
        api('DELETE', '/api/paiements/' + ou2).then(function (b) {
          S.etat = Object.assign({}, S.etat); S.etat[ou2] = b[ou2];
          if (ou2 === 'stripe') S.liens = {}; if (ou2 === 'paypal') S.pp = {}; if (ou2 === 'mercury') { S.merc = null; S.mercErr = ''; }
          appliquer(); S.msg = { k: 'ok', t: NOMS[ou2] + ' est déconnecté.' }; rendre();
        }, function (e) { S.msg = { k: 'warn', t: e.message }; rendre(); });
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
    api('GET', '/api/paiements/etat').then(function (b) { S.etat = b; suivre(b); }, function () { /* hors ligne */ });
    setInterval(function () { if (S.etat && document.visibilityState === 'visible') suivre(S.etat); }, 5 * 60 * 1000);
  }
  if (window.BS_SERVER) setTimeout(demarrer, 500);

  window.bsEncaissement = { monter: monter, logo: logo, reste: reste, _etat: S };
})();
