/* Blackstart CRM : logo de l'entreprise sur les devis et factures (aperçu, PDF, impression).
 *
 * - Réglages › Entreprise : « Logo des devis et factures », une image choisie sur l'ordinateur (PNG, JPG, WebP ou SVG),
 *   réduite dans le navigateur et rangée dans companyInfo.logo (partagée avec l'équipe en version serveur).
 * - Sans image choisie : le logo Blackstart AI si l'entreprise s'appelle Blackstart (ou n'a pas encore de nom),
 *   sinon l'initiale du nom, comme avant.
 * L'en-tête des documents appelle window.bsLogo.doc(e, entreprise) ; le formulaire Entreprise, bsLogo.reglage(élément).
 */
(function () {
  'use strict';
  if (window.bsLogo) return;
  var MAX_W = 480, MAX_H = 200, MAX_SVG = 150000;
  var BLACKSTART = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0b1220"/><path d="M11 8h6.5a5 5 0 0 1 2.9 9.1A5.2 5.2 0 0 1 18 24h-7z" fill="#ffffff"/><circle cx="23.5" cy="8.5" r="2.5" fill="#4f8cdb"/></svg>');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function store() { var R = window.__bsStore; return R && R.get ? R.get() : {}; }
  function valide(v) { return typeof v === 'string' && /^data:image\/(png|jpeg|webp|svg\+xml)[;,]/.test(v); }
  function source(a) {
    a = a || {};
    if (valide(a.logo)) return { src: a.logo, perso: true };
    if (!String(a.nom || '').trim() || /blackstart/i.test(a.nom)) return { src: BLACKSTART, perso: false };
    return null;
  }

  // En-tête des devis et factures.
  function doc(e, a) {
    var s = source(a);
    if (!s) return e('span', { class: 'pp-logo-mark', children: String((a && a.nom) || 'B').trim()[0].toUpperCase() });
    return e('img', { class: s.perso ? 'pp-logo-img' : 'pp-logo-img pp-logo-carre', src: s.src, alt: (a && a.nom) || 'Logo' });
  }

  // Réglages › Entreprise.
  var etat = { msg: null, envoi: false };
  var zone = null;
  function enregistrer(v) {
    var R = window.__bsStore;
    if (R && R.set) R.set(function (st) { var c = Object.assign({}, st.companyInfo); if (v) c.logo = v; else delete c.logo; return { companyInfo: c }; });
  }
  function lire(fichier) {
    return new Promise(function (ok, ko) {
      var fr = new FileReader();
      fr.onerror = function () { ko(new Error('Image illisible.')); };
      fr.onload = function () { ok(fr.result); };
      fr.readAsDataURL(fichier);
    });
  }
  // Image réduite (PNG pour garder la transparence) : un logo net sur le PDF, sans alourdir les données du CRM.
  function reduire(url) {
    return new Promise(function (ok, ko) {
      var img = new Image();
      img.onerror = function () { ko(new Error('Image illisible : choisissez un PNG, un JPG, un WebP ou un SVG.')); };
      img.onload = function () {
        var r = Math.min(1, MAX_W / img.width, MAX_H / img.height);
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * r)); c.height = Math.max(1, Math.round(img.height * r));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/png'));
      };
      img.src = url;
    });
  }
  function choisir(fichier) {
    if (!fichier) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(fichier.type)) { etat.msg = { k: 'warn', t: 'Choisissez une image PNG, JPG, WebP ou SVG.' }; rendre(); return; }
    etat.envoi = true; etat.msg = null; rendre();
    lire(fichier).then(function (url) {
      if (fichier.type === 'image/svg+xml' && url.length <= MAX_SVG) return url;
      return reduire(url);
    }).then(function (v) {
      enregistrer(v);
      etat.msg = { k: 'ok', t: 'Logo enregistré : il apparaît en haut de vos devis et factures.' };
    }, function (err) { etat.msg = { k: 'warn', t: err.message }; })
      .then(function () { etat.envoi = false; rendre(); });
  }
  function rendre() {
    if (!zone || !zone.isConnected) return;
    var a = store().companyInfo || {}, s = source(a);
    zone.innerHTML = '<div class="field-label">Logo des devis et factures</div><div class="bslogo">' +
      '<div class="bslogo-apercu">' + (s ? '<img src="' + esc(s.src) + '" alt="">' : '<span class="pp-logo-mark">' + esc(String(a.nom || 'B').trim()[0].toUpperCase()) + '</span>') + '</div>' +
      '<div class="bslogo-txt"><p>' + (s && s.perso ? 'Votre logo apparaît en haut de chaque devis et facture (aperçu, PDF, mail).' : s ? 'Le logo Blackstart AI apparaît sur vos documents. Choisissez une autre image pour le remplacer.' : 'Ajoutez votre logo : il apparaîtra en haut de chaque devis et facture.') + '</p>' +
      '<div class="bslogo-act"><label class="btn btn-secondary btn-sm"' + (etat.envoi ? ' aria-disabled="true"' : '') + '>' + (etat.envoi ? 'Enregistrement…' : s && s.perso ? 'Changer le logo' : 'Choisir une image') + '<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden data-logo-fichier></label>' +
      (s && s.perso ? '<button type="button" class="btn btn-ghost btn-sm" data-logo-retirer>Retirer</button>' : '') + '</div>' +
      (etat.msg ? '<p class="bslogo-msg ' + etat.msg.k + '">' + esc(etat.msg.t) + '</p>' : '<p class="bslogo-aide">PNG ou SVG sur fond transparent de préférence.</p>') + '</div></div>';
  }
  function reglage(el) {
    css();
    if (el !== zone) {
      zone = el;
      el.addEventListener('change', function (ev) { if (ev.target.hasAttribute('data-logo-fichier')) choisir(ev.target.files && ev.target.files[0]); });
      el.addEventListener('click', function (ev) {
        if (!ev.target.closest('[data-logo-retirer]')) return;
        enregistrer(null); etat.msg = { k: 'ok', t: 'Logo retiré.' }; rendre();
      });
    }
    rendre();
  }

  var CSS = '.pp-logo-img{display:block;max-height:56px;max-width:190px;width:auto;height:auto;object-fit:contain}.pp-logo-carre{width:42px;height:42px;border-radius:11px}' +
    '.bslogo{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:6px}' +
    '.bslogo-apercu{flex:none;width:120px;height:72px;border-radius:12px;background:#fff;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;padding:8px}' +
    '.bslogo-apercu img{max-width:100%;max-height:100%;object-fit:contain}' +
    '.bslogo-txt{flex:1;min-width:200px}.bslogo-txt p{margin:0;font-size:13.5px;color:var(--text-2)}' +
    '.bslogo-act{display:flex;gap:8px;margin:8px 0 4px}.bslogo-act label{cursor:pointer}' +
    '.bslogo-aide{font-size:12px!important;color:var(--text-3)!important}.bslogo-msg.ok{color:#16a34a!important}.bslogo-msg.warn{color:#b45309!important}';
  function css() { if (document.getElementById('bslogo-css')) return; var s = document.createElement('style'); s.id = 'bslogo-css'; s.textContent = CSS; document.head.appendChild(s); }
  css();

  window.bsLogo = { doc: doc, reglage: reglage, source: source };
})();
