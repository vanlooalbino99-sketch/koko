/* Blackstart CRM : rubrique « Mail » (version équipe).
 *
 * - Connecter ses boîtes mail en cliquant sur le logo de sa messagerie (Gmail, Hostinger, OVHcloud, IONOS,
 *   Zoho, Yahoo, iCloud, Gandi) ou n'importe quel mail pro (serveur SMTP).
 * - Écrire un mail sans quitter le CRM : destinataires (avec les prospects du CRM), objet, message, pièces
 *   jointes (fichiers de l'ordinateur, devis et factures du CRM transformés en PDF), signature.
 * - Historique des mails envoyés.
 * window.bsMail.composer({ a, sujet, texte, prospectId, joindre: { kind: 'devis'|'facture', id } }) ouvre la
 * rubrique avec un mail déjà rempli (bouton « Envoyer depuis le CRM » de la fenêtre Email d'un devis).
 * Version autonome (sans serveur) : la rubrique explique la version équipe.
 */
(function () {
  'use strict';
  if (window.bsMail) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var API = '/api/mail';
  var MAX = 20 * 1024 * 1024;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function taille(n) { n = Number(n) || 0; return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko'; }
  function quand(iso) { try { return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function api(method, path, body) {
    var o = { method: method, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } };
    if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    return fetch(API + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) { var e = new Error(b.error || (r.status === 413 ? 'Envoi trop lourd.' : 'Erreur ' + r.status)); e.status = r.status; throw e; }
        return b;
      });
    });
  }

  // ---------------------------------------------------------------- logos des messageries
  function carre(fond, contenu) { return '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="' + fond + '"/>' + contenu + '</svg>'; }
  function sigle(t, taille_, coul) { return '<text x="24" y="' + (24 + taille_ * 0.36) + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="' + taille_ + '" fill="' + (coul || '#fff') + '">' + t + '</text>'; }
  var LOGOS = {
    gmail: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#fff"/><g transform="translate(5 9) scale(.79)">' +
      '<path fill="#4285F4" d="M3.3 38H10V21.9L0 14.4V34.7C0 36.5 1.5 38 3.3 38z"/><path fill="#34A853" d="M38 38h6.7c1.8 0 3.3-1.5 3.3-3.3V14.4l-10 7.5z"/>' +
      '<path fill="#FBBC04" d="M38 4.9v17l10-7.5V9.9c0-4.1-4.7-6.5-8-4z"/><path fill="#EA4335" d="M10 21.9v-17l14 10.5 14-10.5v17L24 32.4z"/>' +
      '<path fill="#C5221F" d="M0 9.9v4.5l10 7.5v-17L8 3.4C4.7.9 0 3.3 0 7.4z"/></g></svg>',
    hostinger: carre('#673DE6', '<path fill="#fff" d="M13 9l8 4v11.5l-8 0zM27 13.6l8-4.6v12.6l-8 3.9zM13 27.4l8-3.9V24.5h6v14.5l8-4V24l-8 3.9h-6v-.1L13 31.5V39l8-4V27.5z"/>'),
    ovh: carre('#000E9C', sigle('OVH', 15)),
    ionos: carre('#003D8F', sigle('IONOS', 11)),
    zoho: carre('#fff', '<rect x="5" y="15" width="9" height="18" rx="2" fill="#E42527"/><rect x="15" y="15" width="9" height="18" rx="2" fill="#089949"/><rect x="25" y="15" width="9" height="18" rx="2" fill="#226DB4"/><rect x="35" y="15" width="8" height="18" rx="2" fill="#F9B21D"/>' + sigle('ZOHO', 10)),
    yahoo: carre('#6001D2', sigle('Y!', 22)),
    icloud: carre('#fff', '<path fill="#3E82F7" d="M15 34h19a7 7 0 0 0 .9-13.9A10 10 0 0 0 15.6 18 8 8 0 0 0 15 34z"/>'),
    gandi: carre('#6640FE', sigle('gandi', 12)),
    autre: carre('#475569', '<rect x="11" y="15" width="26" height="18" rx="3" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M12 17l12 9 12-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>')
  };
  var FOURN = [
    { id: 'gmail', nom: 'Gmail', sous: 'Se connecter avec Google', google: true },
    { id: 'hostinger', nom: 'Hostinger', sous: 'Mail pro', aide: 'Le mot de passe de la boîte, choisi dans hPanel › Emails.' },
    { id: 'ovh', nom: 'OVHcloud', sous: 'Mail pro', aide: 'Le mot de passe de la boîte, choisi dans l’espace client OVHcloud › Emails.' },
    { id: 'ionos', nom: 'IONOS', sous: 'Mail pro', aide: 'Le mot de passe de la boîte mail IONOS.' },
    { id: 'zoho', nom: 'Zoho Mail', sous: 'Mail pro', aide: 'Si la validation en 2 étapes est active, créez un mot de passe d’application dans Zoho › Sécurité.' },
    { id: 'yahoo', nom: 'Yahoo Mail', sous: 'Yahoo', appli: 'https://login.yahoo.com/account/security',
      aide: 'Yahoo demande un « mot de passe d’application » : Sécurité du compte › Générer un mot de passe d’application.' },
    { id: 'icloud', nom: 'iCloud Mail', sous: 'Apple', appli: 'https://account.apple.com',
      aide: 'Apple demande un « mot de passe pour app » : compte Apple › Connexion et sécurité › Mots de passe pour app.' },
    { id: 'gandi', nom: 'Gandi', sous: 'Mail pro', aide: 'Le mot de passe de la boîte mail Gandi.' },
    { id: 'autre', nom: 'Autre mail pro', sous: 'Serveur SMTP', aide: 'Les réglages SMTP sont dans l’aide de votre hébergeur (souvent smtp.votredomaine.fr, port 465).' }
  ];
  function fourn(id) { return FOURN.filter(function (f) { return f.id === id; })[0] || FOURN[FOURN.length - 1]; }

  var IC = {
    send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
    clip: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/></svg>',
    doc: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
  };

  // ---------------------------------------------------------------- devis et factures en PDF
  function charger(src, test) {
    if (test()) return Promise.resolve();
    return new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = function () { ok(); }; s.onerror = function () { ko(new Error('Outil PDF indisponible : rechargez la page.')); };
      document.head.appendChild(s);
    });
  }
  function outilsPdf() {
    return charger('/vendor/html2canvas.min.js', function () { return !!window.html2canvas; })
      .then(function () { return charger('/vendor/jspdf.umd.min.js', function () { return !!(window.jspdf && window.jspdf.jsPDF); }); });
  }
  function docsDuCrm() {
    var st = window.__bsStore && window.__bsStore.get ? window.__bsStore.get() : {};
    var out = [];
    (st.devisList || []).forEach(function (d) { out.push({ kind: 'devis', id: d.id, numero: d.numero, client: d.clientNom || '', prospectId: d.prospectId, d: d }); });
    (st.factures || []).forEach(function (d) { out.push({ kind: 'facture', id: d.id, numero: d.numero, client: d.clientNom || '', prospectId: d.prospectId, d: d }); });
    return out;
  }
  // Rend le devis (ou la facture) comme à l'impression, hors écran, puis le transforme en PDF A4.
  function pdfDe(kind, id) {
    var doc = docsDuCrm().filter(function (x) { return x.kind === kind && x.id === id; })[0];
    if (!doc) return Promise.reject(new Error('Document introuvable.'));
    if (!window.__bsDoc) return Promise.reject(new Error('Mise en page des devis indisponible.'));
    return outilsPdf().then(function () {
      var hote = document.createElement('div');
      hote.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;z-index:-1';
      hote.className = 'bsmail-pdf';
      document.body.appendChild(hote);
      window.__bsDoc(kind, doc.d, hote);
      return new Promise(function (ok) { setTimeout(ok, 120); })
        .then(function () { return window.html2canvas(hote, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, windowWidth: 794 }); })
        .then(function (canvas) {
          var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
          var w = 210, h = 297, pageH = Math.floor(canvas.width * h / w), y = 0, premiere = true;
          while (y < canvas.height - 4) {
            var part = document.createElement('canvas');
            part.width = canvas.width; part.height = Math.min(pageH, canvas.height - y);
            part.getContext('2d').drawImage(canvas, 0, y, canvas.width, part.height, 0, 0, canvas.width, part.height);
            if (!premiere) pdf.addPage();
            pdf.addImage(part.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, w, part.height * w / canvas.width);
            premiere = false; y += pageH;
          }
          document.body.removeChild(hote);
          var b64 = pdf.output('datauristring').split(',')[1];
          var nom = (kind === 'devis' ? 'Devis' : 'Facture') + ' ' + (doc.numero || '') + (doc.client ? ' - ' + doc.client : '');
          return { nom: nom.replace(/[\\/:*?"<>|]+/g, '-').trim() + '.pdf', type: 'application/pdf', data: b64, taille: Math.round(b64.length * 3 / 4), source: kind + ':' + id };
        }, function (e) { if (hote.parentNode) document.body.removeChild(hote); throw e; });
    });
  }
  function lireFichier(f) {
    return new Promise(function (ok, ko) {
      var r = new FileReader();
      r.onload = function () { ok({ nom: f.name, type: f.type || 'application/octet-stream', data: String(r.result).split(',')[1] || '', taille: f.size }); };
      r.onerror = function () { ko(new Error('Fichier illisible : ' + f.name)); };
      r.readAsDataURL(f);
    });
  }

  // ---------------------------------------------------------------- état
  var S = { comptes: null, envoyes: null, reseau: null, google: null, cle: false, relais: null, installe: false, relaisForm: false, onglet: 'ecrire', ajout: null, msg: null, envoi: false, attente: false, ouvert: null,
    b: { compte: '', a: '', cc: '', sujet: '', texte: '', pieces: [], prospectId: '' } };
  var racine = null;
  var enAttente = null; // mail demandé par composer() avant l'ouverture de la rubrique

  function charge() {
    api('GET', '/comptes').then(function (r) {
      S.comptes = r.comptes || [];
      if (!S.b.compte && S.comptes.length) S.b.compte = S.comptes[0].id;
      if (!S.comptes.length && S.onglet === 'ecrire') S.onglet = 'comptes';
      rendre();
    }).catch(function (e) { S.comptes = []; S.msg = { t: e.message, k: 'err' }; rendre(); });
    api('GET', '/reseau').then(function (r) { S.reseau = !!r.smtp; rendre(); }).catch(function () {});
    api('GET', '/google').then(function (r) { S.google = r; rendre(); }).catch(function () {});
    api('GET', '/relais').then(function (r) { S.relais = r; rendre(); }).catch(function () {});
  }
  function chargeEnvoyes() { api('GET', '/envoyes').then(function (r) { S.envoyes = r.envoyes || []; rendre(); }).catch(function () { S.envoyes = []; rendre(); }); }
  function flash(t, k) { S.msg = { t: t, k: k || '' }; rendre(); }

  // ---------------------------------------------------------------- rendu
  function vueComptes() {
    var liste = (S.comptes || []).map(function (c) {
      var f = fourn(c.fournisseur);
      return '<div class="bsmail-compte"><span class="bsmail-logo">' + LOGOS[c.fournisseur] + '</span><div class="bsmail-ct"><b>' + esc(c.email) + '</b><small>' + esc(c.google ? 'Gmail · connecté avec Google' : f.nom) + ' · ' + esc(c.nom) + '</small></div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-sig="' + esc(c.id) + '">Signature</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-deco="' + esc(c.id) + '">Déconnecter</button></div>' +
        (S.ouvert === 'sig:' + c.id ? '<form class="bsmail-sigf" data-sigf="' + esc(c.id) + '"><textarea class="input" name="signature" rows="4" placeholder="Prénom Nom&#10;Blackstart AI&#10;06 00 00 00 00">' + esc(c.signature) + '</textarea>' +
          '<div class="bsmail-act"><button type="submit" class="btn btn-secondary btn-sm">Enregistrer la signature</button></div></form>' : '');
    }).join('');
    var grille = FOURN.map(function (f) {
      return '<button type="button" class="bsmail-four' + (S.ajout === f.id ? ' on' : '') + '" data-four="' + f.id + '"><span class="bsmail-logo">' + LOGOS[f.id] + '</span><b>' + esc(f.nom) + '</b><small>' + esc(f.sous) + '</small></button>';
    }).join('');
    var form = '';
    if (S.ajout === 'gmail') form = vueGoogle();
    else if (S.ajout) {
      var f = fourn(S.ajout);
      form = '<form class="bsmail-form" data-ajout>' +
        '<div class="bsmail-fh"><span class="bsmail-logo">' + LOGOS[f.id] + '</span><b>Connecter ' + esc(f.nom) + '</b></div>' +
        '<div class="bsmail-grid">' +
        '<label class="field"><span class="field-label">Adresse mail</span><input class="input" type="email" name="email" required autocomplete="email" placeholder="' + (f.id === 'gmail' ? 'vous@gmail.com' : 'contact@votredomaine.fr') + '"></label>' +
        '<label class="field"><span class="field-label">' + (f.appli ? 'Mot de passe d’application' : 'Mot de passe de la boîte') + '</span><input class="input" type="password" name="motDePasse" required autocomplete="new-password"></label>' +
        '<label class="field"><span class="field-label">Nom affiché chez le destinataire</span><input class="input" name="nom" value="' + esc(USER ? USER.name : '') + '"></label>' +
        (f.id === 'autre' ? '<label class="field"><span class="field-label">Serveur d’envoi (SMTP)</span><input class="input" name="serveur" required placeholder="smtp.votredomaine.fr"></label>' +
          '<label class="field"><span class="field-label">Port</span><select class="input select" name="port"><option value="465">465 (SSL)</option><option value="587">587 (STARTTLS)</option></select></label>' +
          '<label class="field"><span class="field-label">Identifiant (si différent de l’adresse)</span><input class="input" name="identifiant"></label>' : '') +
        '</div><p class="bsmail-aide">' + esc(f.aide) + (f.appli ? ' <a href="' + f.appli + '" target="_blank" rel="noopener">Créer le mot de passe ›</a>' : '') + '</p>' +
        '<p class="bsmail-aide">Le mot de passe est chiffré sur le serveur du CRM ; il ne sert qu’à envoyer vos mails.</p>' +
        (S.reseau === false && !(S.relais && S.relais.pret) ? '<div class="bsmail-msg warn">Vous pouvez connecter cette boîte dès maintenant. Ses mails partiront quand l’hébergement du CRM autorisera l’envoi (relais ou offre Pro) ; Gmail, lui, marche déjà.</div>' : '') +
        '<div class="bsmail-act"><button type="button" class="btn btn-ghost btn-md" data-annuler-ajout>Annuler</button><button type="submit" class="btn btn-primary btn-md"' + (S.attente ? ' disabled' : '') + '>' + (S.attente ? 'Vérification…' : 'Connecter la boîte') + '</button></div></form>';
    }
    return '<section class="card bsmail-card"><header class="card-head"><div><h3 class="card-title">Mes boîtes mail</h3><p class="card-sub">Les mails partent de votre propre adresse : ils arrivent comme si vous les envoyiez depuis votre messagerie.</p></div></header>' +
      (liste || '<p class="bsmail-vide">Aucune boîte connectée pour l’instant. Choisissez votre messagerie ci-dessous.</p>') + '</section>' +
      '<section class="card bsmail-card"><header class="card-head"><div><h3 class="card-title">Connecter une boîte mail</h3><p class="card-sub">Cliquez sur votre messagerie.</p></div></header>' +
      '<div class="bsmail-fours">' + grille + '</div>' + form + '</section>' + vueRelais();
  }

  var CFLOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#fff"/><path fill="#F38020" d="M32.6 31.5l.5-1.6c.6-2 .4-3.8-.6-5.1-.9-1.2-2.3-1.9-4.1-2l-14.7-.2c-.1 0-.2-.1-.3-.1v-.3c0-.1.1-.2.3-.2l14.8-.2c1.8-.1 3.7-1.5 4.4-3.3l.9-2.2c0-.1.1-.2 0-.3-1-4.3-4.9-7.6-9.6-7.6-4.3 0-8 2.8-9.3 6.7-.9-.6-1.9-.9-3.1-.8-2.1.2-3.7 1.9-3.9 3.9-.1.5 0 1 .1 1.5C4.5 19.6 1.8 22.4 1.8 25.9c0 .3 0 .6.1 1 0 .2.2.3.3.3h29.9c.2 0 .3-.1.4-.3z"/><path fill="#FAAE40" d="M37.9 21.1h-.4c-.1 0-.2.1-.2.2l-.6 2.2c-.6 2-.4 3.8.6 5.1.9 1.2 2.3 1.9 4.1 2l3.2.2c.1 0 .2.1.3.1v.3c0 .1-.1.2-.3.2l-3.3.2c-1.8.1-3.7 1.5-4.4 3.3l-.2.7c0 .1 0 .2.2.2h11.3c.1 0 .2-.1.2-.2.2-.7.3-1.5.3-2.3 0-4.5-3.7-8.2-8.2-8.2z"/></svg>';
  // Relais gratuit (Cloudflare) pour Hostinger, OVH, IONOS… quand l'hébergement du CRM bloque l'envoi de mails.
  function vueRelais() {
    var r = S.relais;
    if (!r || (S.reseau !== false && !r.pret)) return '';
    var tete = '<header class="card-head"><div class="bsmail-fh"><span class="bsmail-logo">' + CFLOGO + '</span><div><h3 class="card-title">Relais d’envoi</h3>' +
      '<p class="card-sub">Pour Hostinger, OVHcloud, IONOS et les autres mails pro (Gmail n’en a pas besoin).</p></div></div></header>';
    if (r.pret && !S.relaisForm) return '<section class="card bsmail-card">' + tete + '<div class="bsmail-msg ok">Relais installé' + (r.compte ? ' sur le compte Cloudflare « ' + esc(r.compte) + ' »' : '') + ' : les mails de vos boîtes pro partent par lui.</div>' +
      (r.admin && !r.parEnv ? '<div class="bsmail-act" style="margin-top:10px"><button type="button" class="btn btn-ghost btn-sm" data-relais-form>Réinstaller le relais</button></div>' : '') + '</section>';
    if (!r.admin) return '<section class="card bsmail-card">' + tete + '<p class="bsmail-aide">Un administrateur doit installer le relais gratuit (une seule fois pour toute l’équipe).</p></section>';
    var etapes = [
      'Créez un compte gratuit sur <a href="https://dash.cloudflare.com/sign-up" target="_blank" rel="noopener">dash.cloudflare.com</a> et confirmez votre adresse mail.',
      'Ouvrez <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener">Jetons d’API</a> › « Créer un jeton » › modèle « Modifier Cloudflare Workers » › « Utiliser le modèle ».',
      'En bas : « Continuer vers le résumé » › « Créer le jeton », puis copiez-le et collez-le ci-dessous.'
    ];
    return '<section class="card bsmail-card">' + tete + '<form class="bsmail-form" data-relais style="margin-top:0;border-top:0;padding-top:0">' +
      '<p class="bsmail-aide"><b>Gratuit, une seule fois pour toute l’équipe.</b> Le CRM installe lui-même un petit relais sur votre compte Cloudflare ; vos mails partent ensuite de votre adresse pro.</p>' +
      '<ol class="bsmail-etapes">' + etapes.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ol>' +
      '<label class="field"><span class="field-label">Jeton Cloudflare</span><input class="input" type="password" name="jeton" required autocomplete="off" placeholder="Collez le jeton ici"></label>' +
      '<div class="bsmail-act">' + (r.pret ? '<button type="button" class="btn btn-ghost btn-md" data-relais-form>Annuler</button>' : '') +
      '<button type="submit" class="btn btn-primary btn-md"' + (S.installe ? ' disabled' : '') + '>' + (S.installe ? 'Installation…' : 'Installer le relais') + '</button></div></form></section>';
  }

  var GLOGO = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.8c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
  function vueGoogle() {
    var g = S.google, tete = '<div class="bsmail-fh"><span class="bsmail-logo">' + LOGOS.gmail + '</span><b>Connecter Gmail</b></div>';
    if (!g) return '<div class="bsmail-form">' + tete + '<p class="bsmail-aide">Chargement…</p></div>';
    if (g.pret && !S.cle) return '<div class="bsmail-form">' + tete +
      '<p class="bsmail-aide">Google vous demande de choisir votre compte puis d’autoriser le CRM à envoyer des mails en votre nom. ' +
      'S’il affiche « Google n’a pas validé cette application », cliquez sur « Paramètres avancés » puis « Accéder à Blackstart CRM ».</p>' +
      '<div class="bsmail-act">' + (g.admin && !g.parEnv ? '<button type="button" class="btn btn-ghost btn-md" data-cle>Changer la clé Google</button>' : '') +
      '<a class="bsmail-g" href="/api/mail/google/debut">' + GLOGO + 'Se connecter avec Google</a></div></div>';
    if (!g.admin) return '<div class="bsmail-form">' + tete + '<p class="bsmail-aide">Un administrateur doit d’abord brancher la clé Google du CRM (une seule fois pour toute l’équipe), dans Mail › Mes boîtes › Gmail.</p></div>';
    var etapes = [
      'Ouvrez <a href="https://console.cloud.google.com/projectcreate" target="_blank" rel="noopener">console.cloud.google.com</a> avec votre compte Google et créez un projet nommé « Blackstart CRM ».',
      'Activez l’API Gmail : <a href="https://console.cloud.google.com/apis/library/gmail.googleapis.com" target="_blank" rel="noopener">page Gmail API</a> › bouton « Activer ».',
      'Ouvrez <a href="https://console.cloud.google.com/auth/overview" target="_blank" rel="noopener">Google Auth Platform</a> › « Commencer » : nom de l’application « Blackstart CRM », votre adresse mail, audience « Externe », puis « Créer ».',
      'Dans <a href="https://console.cloud.google.com/auth/audience" target="_blank" rel="noopener">Audience</a>, cliquez sur « Publier l’application » (sinon la connexion se coupe au bout de 7 jours).',
      'Dans <a href="https://console.cloud.google.com/auth/clients" target="_blank" rel="noopener">Clients</a> › « Créer un client » : type « Application Web », puis dans « URI de redirection autorisés » ajoutez cette adresse :' +
        '<div class="bsmail-uri"><code>' + esc(g.retour) + '</code><button type="button" class="btn btn-ghost btn-sm" data-copier="' + esc(g.retour) + '">Copier</button></div>',
      'Cliquez sur « Créer », puis collez ci-dessous l’ID client et le code secret affichés.'
    ];
    return '<form class="bsmail-form" data-cle-form>' + tete +
      '<p class="bsmail-aide"><b>Une seule fois pour toute l’équipe :</b> créez la clé Google du CRM (environ 10 minutes, gratuit).</p>' +
      '<ol class="bsmail-etapes">' + etapes.map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ol>' +
      '<div class="bsmail-grid"><label class="field"><span class="field-label">ID client</span><input class="input" name="clientId" required placeholder="…apps.googleusercontent.com" autocomplete="off"></label>' +
      '<label class="field"><span class="field-label">Code secret du client</span><input class="input" type="password" name="clientSecret" required autocomplete="off"></label></div>' +
      '<div class="bsmail-act">' + (g.pret ? '<button type="button" class="btn btn-ghost btn-md" data-cle>Annuler</button>' : '') + '<button type="submit" class="btn btn-primary btn-md">Enregistrer la clé Google</button></div></form>';
  }

  function vueEcrire() {
    if (!S.comptes || !S.comptes.length) return '<section class="card bsmail-card"><p class="bsmail-vide">Connectez d’abord une boîte mail (onglet « Mes boîtes »).</p></section>';
    var b = S.b, st = window.__bsStore && window.__bsStore.get ? window.__bsStore.get() : {};
    var contacts = (st.prospects || []).filter(function (p) { return p.email; }).slice(0, 500).map(function (p) {
      return '<option value="' + esc(p.email) + '">' + esc(p.entreprise + (p.contact ? ' — ' + p.contact : '')) + '</option>';
    }).join('');
    var docs = docsDuCrm().slice().reverse().slice(0, 200).map(function (x) {
      return '<option value="' + x.kind + ':' + esc(x.id) + '">' + (x.kind === 'devis' ? 'Devis ' : 'Facture ') + esc(x.numero || '') + (x.client ? ' — ' + esc(x.client) : '') + '</option>';
    }).join('');
    var total = b.pieces.reduce(function (s, p) { return s + (p.taille || 0); }, 0);
    var pieces = b.pieces.map(function (p, i) {
      return '<span class="bsmail-pj">' + (p.type === 'application/pdf' ? IC.doc : IC.clip) + '<span>' + esc(p.nom) + '</span><small>' + taille(p.taille) + '</small><button type="button" data-retirer="' + i + '" aria-label="Retirer ' + esc(p.nom) + '">' + IC.x + '</button></span>';
    }).join('');
    return '<section class="card bsmail-card"><form class="bsmail-ecrire" data-ecrire>' +
      '<label class="bsmail-l"><span>De</span><select class="input select" name="compte">' + S.comptes.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === b.compte ? ' selected' : '') + '>' + esc((c.nom ? c.nom + ' — ' : '') + c.email) + '</option>';
      }).join('') + '</select></label>' +
      '<label class="bsmail-l"><span>À</span><input class="input" name="a" list="bsmail-contacts" value="' + esc(b.a) + '" placeholder="client@entreprise.fr (plusieurs : séparez par une virgule)" autocomplete="off"></label>' +
      '<datalist id="bsmail-contacts">' + contacts + '</datalist>' +
      '<label class="bsmail-l"><span>Cc</span><input class="input" name="cc" value="' + esc(b.cc) + '" placeholder="Copie (facultatif)"></label>' +
      '<label class="bsmail-l"><span>Objet</span><input class="input" name="sujet" value="' + esc(b.sujet) + '" maxlength="300"></label>' +
      '<textarea class="input bsmail-texte" name="texte" rows="12" placeholder="Bonjour,&#10;&#10;Veuillez trouver ci-joint…">' + esc(b.texte) + '</textarea>' +
      '<div class="bsmail-pjs">' + pieces + '</div>' +
      '<div class="bsmail-outils">' +
      '<label class="btn btn-secondary btn-sm bsmail-fichier">' + IC.clip + 'Joindre un fichier<input type="file" multiple data-fichiers></label>' +
      (docs ? '<select class="input select bsmail-doc" data-doc><option value="">' + 'Joindre un devis ou une facture (PDF)…' + '</option>' + docs + '</select>' : '') +
      '<span class="bsmail-total">' + (total ? taille(total) + ' sur 20 Mo' : '') + '</span>' +
      '<button type="submit" class="btn btn-primary btn-md"' + (S.envoi ? ' disabled' : '') + '>' + IC.send + (S.envoi ? 'Envoi…' : 'Envoyer') + '</button></div>' +
      '</form></section>';
  }

  function vueEnvoyes() {
    if (S.envoyes === null) { chargeEnvoyes(); return '<section class="card bsmail-card"><p class="bsmail-vide">Chargement…</p></section>'; }
    if (!S.envoyes.length) return '<section class="card bsmail-card"><p class="bsmail-vide">Aucun mail envoyé depuis le CRM pour l’instant.</p></section>';
    return '<section class="card bsmail-card">' + S.envoyes.map(function (m) {
      var ouvert = S.ouvert === 'm:' + m.id;
      return '<div class="bsmail-env' + (ouvert ? ' on' : '') + '"><button type="button" class="bsmail-envh" data-voir="' + esc(m.id) + '">' +
        '<span class="bsmail-st ' + (m.statut === 'envoye' ? 'ok' : 'err') + '">' + (m.statut === 'envoye' ? 'Envoyé' : 'Échec') + '</span>' +
        '<b>' + esc(m.sujet) + '</b><small>À ' + esc(m.a) + ' · ' + esc(quand(m.date)) + (m.pieces.length ? ' · ' + m.pieces.length + ' pièce' + (m.pieces.length > 1 ? 's' : '') + ' jointe' + (m.pieces.length > 1 ? 's' : '') : '') + '</small></button>' +
        (ouvert ? '<div class="bsmail-envc"><small>De ' + esc(m.de) + (m.cc ? ' · Cc ' + esc(m.cc) : '') + '</small>' + (m.erreur ? '<div class="bsmail-msg err">' + esc(m.erreur) + '</div>' : '') +
          '<pre>' + esc(m.texte) + '</pre>' + (m.pieces.length ? '<div class="bsmail-pjs">' + m.pieces.map(function (p) { return '<span class="bsmail-pj">' + IC.clip + '<span>' + esc(p.nom) + '</span><small>' + taille(p.taille) + '</small></span>'; }).join('') + '</div>' : '') +
          '<div class="bsmail-act"><button type="button" class="btn btn-secondary btn-sm" data-renvoyer="' + esc(m.id) + '">Réutiliser ce mail</button></div></div>' : '') + '</div>';
    }).join('') + '</section>';
  }

  function rendre() {
    if (!racine || !racine.isConnected) return;
    // On garde ce qui est en cours de frappe dans le formulaire d'écriture.
    lireFormulaire();
    var act = document.activeElement, nomFocus = act && act.form && racine.contains(act) ? act.name : '';
    var onglets = [['ecrire', 'Nouveau mail'], ['envoyes', 'Envoyés'], ['comptes', 'Mes boîtes' + (S.comptes && S.comptes.length ? ' (' + S.comptes.length + ')' : '')]];
    var bloquees = (S.comptes || []).filter(function (c) { return !c.google; });
    var bandeau = S.reseau === false && !(S.relais && S.relais.pret) && bloquees.length ? '<div class="bsmail-msg warn"><b>Gmail marche.</b> Pour ' + esc(bloquees.map(function (c) { return c.email; }).join(', ')) + ', l’envoi attend que l’hébergement du CRM l’autorise (relais ou offre Pro).</div>' : '';
    racine.innerHTML = '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Mail</h1><p class="page-sub">Envoyez vos mails, devis et factures depuis votre propre adresse, sans quitter le CRM.</p></div></div>' +
      '<div class="bsmail-tabs" role="tablist">' + onglets.map(function (o) {
        return '<button type="button" role="tab" aria-selected="' + (S.onglet === o[0]) + '" class="bsmail-tab' + (S.onglet === o[0] ? ' on' : '') + '" data-onglet="' + o[0] + '">' + o[1] + '</button>';
      }).join('') + '</div>' + bandeau +
      (S.msg ? '<div class="bsmail-msg ' + S.msg.k + '">' + esc(S.msg.t) + '</div>' : '') +
      (S.comptes === null ? '<p class="bsmail-vide">Chargement…</p>' : S.onglet === 'comptes' ? vueComptes() : S.onglet === 'envoyes' ? vueEnvoyes() : vueEcrire());
    if (nomFocus) { var el = racine.querySelector('[name="' + nomFocus + '"]'); if (el) { el.focus(); if (el.setSelectionRange && el.value && el.type !== 'email') try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) { /* champ sans curseur */ } } }
  }
  function lireFormulaire() {
    var f = racine && racine.querySelector('form[data-ecrire]');
    if (!f) return;
    ['compte', 'a', 'cc', 'sujet', 'texte'].forEach(function (k) { if (f.elements[k]) S.b[k] = f.elements[k].value; });
  }

  function ajouterPiece(p) {
    var total = S.b.pieces.reduce(function (s, x) { return s + (x.taille || 0); }, 0);
    if (total + p.taille > MAX) { flash('Pièces jointes trop lourdes : 20 Mo au plus au total.', 'err'); return; }
    if (p.source && S.b.pieces.some(function (x) { return x.source === p.source; })) return;
    S.b.pieces.push(p);
  }
  function joindreDoc(valeur) {
    var i = valeur.indexOf(':'), kind = valeur.slice(0, i), id = valeur.slice(i + 1);
    flash('Préparation du PDF…', '');
    return pdfDe(kind, id).then(function (p) { ajouterPiece(p); S.msg = null; rendre(); })
      .catch(function (e) { flash(e.message, 'err'); });
  }

  function brancher(el) {
    el.addEventListener('click', function (e) {
      var t = e.target.closest('button,[data-four]'); if (!t || !el.contains(t)) return;
      if (t.hasAttribute('data-onglet')) { lireFormulaire(); S.onglet = t.getAttribute('data-onglet'); S.msg = null; if (S.onglet === 'envoyes') S.envoyes = null; rendre(); return; }
      if (t.hasAttribute('data-four')) { S.ajout = t.getAttribute('data-four'); S.msg = null; rendre(); var i = el.querySelector('form[data-ajout] [name=email]'); if (i) i.focus(); return; }
      if (t.hasAttribute('data-annuler-ajout')) { S.ajout = null; rendre(); return; }
      if (t.hasAttribute('data-cle')) { S.cle = !S.cle; rendre(); return; }
      if (t.hasAttribute('data-relais-form')) { S.relaisForm = !S.relaisForm; rendre(); return; }
      if (t.hasAttribute('data-copier')) {
        var txt = t.getAttribute('data-copier');
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { t.textContent = 'Copié ✓'; }, function () { window.prompt('Copiez cette adresse :', txt); });
        return;
      }
      if (t.hasAttribute('data-retirer')) { lireFormulaire(); S.b.pieces.splice(Number(t.getAttribute('data-retirer')), 1); rendre(); return; }
      if (t.hasAttribute('data-voir')) { var v = 'm:' + t.getAttribute('data-voir'); S.ouvert = S.ouvert === v ? null : v; rendre(); return; }
      if (t.hasAttribute('data-sig')) { var s = 'sig:' + t.getAttribute('data-sig'); S.ouvert = S.ouvert === s ? null : s; rendre(); return; }
      if (t.hasAttribute('data-renvoyer')) {
        var m = (S.envoyes || []).filter(function (x) { return x.id === t.getAttribute('data-renvoyer'); })[0];
        if (m) { S.b = { compte: S.b.compte, a: m.a, cc: m.cc, sujet: m.sujet, texte: m.texte, pieces: [], prospectId: m.prospectId || '' }; S.onglet = 'ecrire'; S.msg = { t: 'Mail repris : ajoutez les pièces jointes si besoin.', k: '' }; rendre(); }
        return;
      }
      if (t.hasAttribute('data-deco')) {
        var c = (S.comptes || []).filter(function (x) { return x.id === t.getAttribute('data-deco'); })[0];
        if (!c || !window.confirm('Déconnecter ' + c.email + ' du CRM ?')) return;
        api('DELETE', '/comptes/' + encodeURIComponent(c.id)).then(function () {
          if (S.b.compte === c.id) S.b.compte = ''; flash(c.email + ' est déconnectée.', 'ok'); charge();
        }).catch(function (er) { flash(er.message, 'err'); });
      }
    });
    el.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-fichiers')) {
        lireFormulaire();
        var fichiers = Array.prototype.slice.call(t.files || []);
        Promise.all(fichiers.map(lireFichier)).then(function (l) { l.forEach(ajouterPiece); rendre(); }).catch(function (er) { flash(er.message, 'err'); });
        return;
      }
      if (t.hasAttribute('data-doc') && t.value) { lireFormulaire(); joindreDoc(t.value); }
    });
    el.addEventListener('submit', function (e) {
      var f = e.target; e.preventDefault();
      if (f.hasAttribute('data-ajout')) {
        var body = { fournisseur: S.ajout };
        ['email', 'motDePasse', 'nom', 'serveur', 'port', 'identifiant'].forEach(function (k) { if (f.elements[k]) body[k] = f.elements[k].value; });
        S.attente = true; S.msg = null; rendre();
        api('POST', '/comptes', body).then(function (r) {
          S.attente = false; S.ajout = null; S.b.compte = r.compte.id; S.onglet = 'ecrire';
          S.msg = r.verifie ? { t: r.compte.email + ' est connectée : vous pouvez envoyer vos mails.', k: 'ok' } : { t: r.compte.email + ' est enregistrée. ' + (r.avertissement || ''), k: 'warn' };
          charge();
        }).catch(function (er) {
          S.attente = false; rendre();
          var form = racine.querySelector('form[data-ajout]');
          if (form) { ['email', 'nom', 'serveur', 'port', 'identifiant'].forEach(function (k) { if (form.elements[k] && body[k] !== undefined) form.elements[k].value = body[k]; }); }
          flash(er.message, 'err');
        });
        return;
      }
      if (f.hasAttribute('data-relais')) {
        var jeton = f.elements.jeton.value;
        S.installe = true; S.msg = null; rendre();
        api('PUT', '/relais', { jeton: jeton }).then(function (r) {
          S.installe = false; S.relaisForm = false;
          flash('Relais installé sur Cloudflare (' + r.adresse + ') : vos boîtes pro peuvent envoyer leurs mails.', 'ok'); charge();
        }).catch(function (er) { S.installe = false; flash(er.message, 'err'); });
        return;
      }
      if (f.hasAttribute('data-cle-form')) {
        api('PUT', '/google', { clientId: f.elements.clientId.value, clientSecret: f.elements.clientSecret.value })
          .then(function () { S.cle = false; flash('Clé Google enregistrée : cliquez sur « Se connecter avec Google ».', 'ok'); charge(); })
          .catch(function (er) { flash(er.message, 'err'); });
        return;
      }
      if (f.hasAttribute('data-sigf')) {
        api('PATCH', '/comptes/' + encodeURIComponent(f.getAttribute('data-sigf')), { signature: f.elements.signature.value })
          .then(function () { S.ouvert = null; flash('Signature enregistrée : elle s’ajoute à la fin de vos mails.', 'ok'); charge(); })
          .catch(function (er) { flash(er.message, 'err'); });
        return;
      }
      if (f.hasAttribute('data-ecrire')) {
        lireFormulaire();
        var b = S.b;
        if (!b.a.trim()) { flash('Indiquez le destinataire.', 'err'); return; }
        if (!b.sujet.trim()) { flash('Ajoutez un objet au mail.', 'err'); return; }
        S.envoi = true; S.msg = null; rendre();
        api('POST', '/envoyer', { compte: b.compte, a: b.a, cc: b.cc, sujet: b.sujet, texte: b.texte, prospectId: b.prospectId || null,
          pieces: b.pieces.map(function (p) { return { nom: p.nom, type: p.type, data: p.data }; }) })
          .then(function () {
            var a = b.a;
            noterSurFiche(b); marquerDevis(b);
            S.envoi = false; S.b = { compte: b.compte, a: '', cc: '', sujet: '', texte: '', pieces: [], prospectId: '' }; S.envoyes = null;
            flash('Mail envoyé à ' + a + '.', 'ok');
          })
          .catch(function (er) { S.envoi = false; flash(er.message, 'err'); });
      }
    });
  }

  // Le mail envoyé est noté dans l'historique de la fiche du prospect (comme la fenêtre Email du CRM).
  function noterSurFiche(b) {
    try {
      var R = window.__bsStore; if (!R || !R.set) return;
      var st = R.get(), dest = b.a.toLowerCase();
      var p = (st.prospects || []).filter(function (x) { return (b.prospectId && x.id === b.prospectId) || (x.email && dest.indexOf(x.email.toLowerCase()) >= 0); })[0];
      if (!p) return;
      var ev = { id: Math.random().toString(36).slice(2) + Date.now().toString(36), at: new Date().toISOString(), date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5), type: 'email', text: 'Email « ' + b.sujet + ' » envoyé depuis le CRM' + (b.pieces.length ? ' (' + b.pieces.map(function (x) { return x.nom; }).join(', ') + ')' : '') };
      R.set(function (s) { return { prospects: s.prospects.map(function (x) { return x.id === p.id ? Object.assign({}, x, { events: [ev].concat(x.events || []).slice(0, 200) }) : x; }) }; });
    } catch (e) { /* l'historique de la fiche est un plus */ }
  }
  // Un devis encore en brouillon envoyé en pièce jointe passe à « Envoyé ».
  function marquerDevis(b) {
    try {
      var R = window.__bsStore; if (!R || !R.set) return;
      var ids = b.pieces.map(function (x) { return x.source || ''; }).filter(function (x) { return x.indexOf('devis:') === 0; }).map(function (x) { return x.slice(6); });
      if (!ids.length) return;
      R.set(function (s) { return { devisList: (s.devisList || []).map(function (d) { return ids.indexOf(d.id) >= 0 && d.statut === 'brouillon' ? Object.assign({}, d, { statut: 'envoye' }) : d; }) }; });
    } catch (e) { /* l'historique de la fiche est un plus */ }
  }

  var CSS = '.bsmail-root{display:flex;flex-direction:column;gap:16px;max-width:980px}' +
    '.bsmail-tabs{display:flex;gap:6px;flex-wrap:wrap}.bsmail-tab{border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);border-radius:999px;padding:7px 14px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer}' +
    '.bsmail-tab.on{background:var(--accent);border-color:var(--accent);color:var(--accent-text,#fff)}' +
    '.bsmail-card{padding-bottom:16px}.bsmail-card>*:not(.card-head){margin-left:18px;margin-right:18px}' +
    '.bsmail-vide{color:var(--text-3);font-size:14px;margin:6px 18px}' +
    '.bsmail-msg{border-radius:10px;padding:10px 14px;font-size:14px;background:var(--surface-2);border:1px solid var(--border)}' +
    '.bsmail-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsmail-msg.err{border-color:rgba(239,68,68,.45);background:rgba(239,68,68,.1)}' +
    '.bsmail-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsmail-logo{display:inline-flex;width:40px;height:40px;flex:none;border-radius:11px;overflow:hidden;box-shadow:0 0 0 1px var(--border)}.bsmail-logo svg{width:100%;height:100%}' +
    '.bsmail-fours{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
    '.bsmail-four{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border:1px solid var(--border);border-radius:14px;background:var(--surface-2);color:var(--text);font:inherit;cursor:pointer;transition:transform .12s,border-color .12s}' +
    '.bsmail-four:hover{transform:translateY(-2px);border-color:var(--accent)}.bsmail-four.on{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset}' +
    '.bsmail-four .bsmail-logo{width:48px;height:48px}.bsmail-four b{font-size:14px}.bsmail-four small{font-size:12px;color:var(--text-3)}' +
    '.bsmail-four.off{opacity:.45;cursor:not-allowed;transform:none}' +
    '.bsmail-g{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#fff;color:#1f1f1f;border:1px solid #dadce0;font-weight:600;font-size:14.5px;text-decoration:none;box-shadow:0 1px 2px rgba(0,0,0,.12)}' +
    '.bsmail-g:hover{background:#f7f8f8}.bsmail-etapes{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.45}.bsmail-etapes a{color:var(--accent)}' +
    '.bsmail-uri{display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}.bsmail-uri code{padding:6px 10px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);font-size:12.5px;word-break:break-all}' +
    '.bsmail-form{margin-top:16px;padding-top:14px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:10px}' +
    '.bsmail-fh{display:flex;align-items:center;gap:10px}.bsmail-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}' +
    '.bsmail-aide{margin:0;font-size:13px;color:var(--text-3)}.bsmail-aide a{color:var(--accent)}' +
    '.bsmail-act{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}' +
    '.bsmail-compte{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}.bsmail-compte:last-of-type{border-bottom:0}' +
    '.bsmail-ct{flex:1;min-width:0}.bsmail-ct b{display:block;overflow:hidden;text-overflow:ellipsis}.bsmail-ct small{color:var(--text-3)}' +
    '.bsmail-sigf{display:flex;flex-direction:column;gap:8px;padding:0 0 12px}' +
    '.bsmail-ecrire{display:flex;flex-direction:column;gap:10px;padding-top:16px}' +
    '.bsmail-l{display:grid;grid-template-columns:64px 1fr;align-items:center;gap:10px}.bsmail-l>span{font-size:13px;font-weight:600;color:var(--text-2)}' +
    '.bsmail-texte{min-height:240px;resize:vertical;line-height:1.5}' +
    '.bsmail-pjs{display:flex;flex-wrap:wrap;gap:8px}.bsmail-pjs:empty{display:none}' +
    '.bsmail-pj{display:inline-flex;align-items:center;gap:6px;padding:6px 8px 6px 10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);font-size:13px;max-width:100%}' +
    '.bsmail-pj span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px}.bsmail-pj small{color:var(--text-3)}' +
    '.bsmail-pj button{border:0;background:none;color:var(--text-3);cursor:pointer;display:inline-flex;padding:2px}' +
    '.bsmail-outils{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.bsmail-total{flex:1;font-size:12.5px;color:var(--text-3);text-align:right}' +
    '.bsmail-fichier{position:relative;cursor:pointer}.bsmail-fichier input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}' +
    '.bsmail-doc{max-width:300px}' +
    '.bsmail-env{border-bottom:1px solid var(--border)}.bsmail-env:last-child{border-bottom:0}' +
    '.bsmail-envh{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;width:100%;text-align:left;border:0;background:none;color:var(--text);font:inherit;padding:12px 0;cursor:pointer}' +
    '.bsmail-envh b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsmail-envh small{grid-column:2;color:var(--text-3)}' +
    '.bsmail-st{grid-row:span 2;align-self:center;font-size:11.5px;font-weight:700;border-radius:999px;padding:3px 9px}.bsmail-st.ok{background:rgba(34,197,94,.15);color:#16a34a}.bsmail-st.err{background:rgba(239,68,68,.15);color:#dc2626}' +
    '.bsmail-envc{padding:0 0 14px;display:flex;flex-direction:column;gap:8px}.bsmail-envc pre{white-space:pre-wrap;font:inherit;margin:0;padding:12px;border-radius:10px;background:var(--surface-2)}' +
    '@media (max-width:640px){.bsmail-compte{flex-wrap:wrap;row-gap:4px}.bsmail-ct{flex:1 1 calc(100% - 60px)}.bsmail-compte>button:first-of-type{margin-left:48px}.bsmail-l{grid-template-columns:1fr}.bsmail-total{text-align:left}.bsmail-doc{max-width:100%}}';
  function css() {
    if (document.getElementById('bsmail-css')) return;
    var s = document.createElement('style'); s.id = 'bsmail-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  var RETOURS = {
    ok: ['Gmail est connecté : vous pouvez envoyer vos mails depuis le CRM.', 'ok'],
    annule: ['Connexion à Google annulée.', 'warn'],
    expire: ['La connexion a pris trop de temps : recommencez.', 'warn'],
    refuse: ['Google a refusé la connexion : vérifiez la clé Google (ID client, code secret et adresse de redirection), puis recommencez.', 'err'],
    'sans-envoi': ['Sur la page Google, laissez cochée l’autorisation d’envoyer des e-mails, puis recommencez.', 'err'],
    'sans-cle': ['La clé Google du CRM n’est pas encore renseignée.', 'warn']
  };
  (function () {
    var m = /[?&]mail=([\w-]+)/.exec(location.search || '');
    if (!m) return;
    var r = RETOURS[m[1]];
    if (r) { S.msg = { t: r[0], k: r[1] }; if (m[1] === 'ok') S.onglet = 'ecrire'; else { S.onglet = 'comptes'; S.ajout = 'gmail'; } }
    try { history.replaceState(null, '', location.pathname + (location.hash || '#/mail')); } catch (e) { /* adresse inchangée */ }
  })();

  function monter(el) {
    if (!el) return;
    if (el === racine && el.__bsMail) return;
    css();
    racine = el; el.__bsMail = true;
    if (!USER) {
      el.innerHTML = '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Mail</h1><p class="page-sub">Disponible dans la version équipe (serveur Blackstart) : connectez vos boîtes mail et envoyez devis et factures sans quitter le CRM.</p></div></div>';
      return;
    }
    brancher(el);
    if (enAttente) { appliquer(enAttente); enAttente = null; }
    rendre();
    charge();
  }

  function appliquer(o) {
    S.onglet = 'ecrire';
    S.b = { compte: S.b.compte, a: o.a || '', cc: o.cc || '', sujet: o.sujet || '', texte: o.texte || '', pieces: [], prospectId: o.prospectId || '' };
    S.msg = null;
    if (o.joindre && o.joindre.kind && o.joindre.id) joindreDoc(o.joindre.kind + ':' + o.joindre.id);
  }
  function composer(o) {
    o = o || {};
    if (racine && racine.isConnected) { appliquer(o); rendre(); }
    else enAttente = o;
    if ((location.hash || '') !== '#/mail') location.hash = '#/mail';
  }

  window.bsMail = { monter: monter, composer: composer, pdf: pdfDe, fournisseurs: FOURN };
})();
