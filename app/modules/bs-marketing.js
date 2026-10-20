/* Blackstart CRM : rubrique « Marketing » (outils communs aux pages Campagnes, Modèles, Contenu, Sources & ROI).
 *
 * Les données Marketing sont rangées avec celles du CRM (clé « marketing » du magasin window.__bsStore) : elles
 * sont donc enregistrées sur le serveur et partagées par l'équipe, comme les prospects.
 *   marketing.campagnes : séquences de mails (segment de prospects, étapes J+0, J+3…, inscrits et envois)
 *   marketing.modeles   : modèles de messages (email, SMS, LinkedIn, WhatsApp, script d'appel)
 *   marketing.posts     : calendrier des publications (LinkedIn, Facebook, Instagram, Google Business)
 *   marketing.budgets   : budget mensuel de chaque source de prospects (pour le coût par lead et le ROI)
 * Rien n'est supprimé pour de bon : un élément retiré reçoit supprime: true (le serveur ne laisse supprimer
 * que les administrateurs). Un prospect marqué « ne plus contacter » (nePlusContacter) sort de tout le Marketing.
 * Rédaction avec Claude : /api/ia (version équipe, quand une clé Claude est branchée).
 */
(function () {
  'use strict';
  if (window.bsMarketing) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { d = d || new Date(); return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function auj() { return jour(new Date()); }
  function plusJours(iso, n) { var d = new Date(String(iso).slice(0, 10) + 'T12:00:00'); d.setDate(d.getDate() + (Number(n) || 0)); return jour(d); }
  function ecart(a, b) { return Math.round((new Date(String(b).slice(0, 10) + 'T12:00:00') - new Date(String(a).slice(0, 10) + 'T12:00:00')) / 86400000); }
  function dateFr(iso, o) { try { return new Date(String(iso).slice(0, 10) + 'T12:00:00').toLocaleDateString('fr-FR', o || { day: 'numeric', month: 'short' }); } catch (e) { return iso || ''; } }
  function euros(n) { return (Number(n) || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); }

  // ---------------------------------------------------------------- magasin du CRM
  function R() { return window.__bsStore || null; }
  function etat() { var r = R(); return r && r.get ? r.get() : {}; }
  function prospects() { return (etat().prospects || []).filter(function (p) { return p && (p.entreprise || p.contact); }); }
  function prospect(id) { var l = etat().prospects || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function data() {
    var m = etat().marketing;
    m = m && typeof m === 'object' ? m : {};
    return { campagnes: Array.isArray(m.campagnes) ? m.campagnes : [], modeles: Array.isArray(m.modeles) ? m.modeles : [],
      posts: Array.isArray(m.posts) ? m.posts : [], budgets: Array.isArray(m.budgets) ? m.budgets : [], reglages: m.reglages && typeof m.reglages === 'object' ? m.reglages : {} };
  }
  function actifs(liste) { return liste.filter(function (x) { return x && !x.supprime; }); }
  // Remplace une liste de marketing (campagnes, modeles, posts, budgets) par fn(liste).
  function majListe(nom, fn) {
    var r = R(); if (!r || !r.set) return;
    r.set(function (s) {
      var m = Object.assign({}, s.marketing && typeof s.marketing === 'object' ? s.marketing : {});
      m[nom] = fn((Array.isArray(m[nom]) ? m[nom] : []).slice());
      return { marketing: m };
    });
  }
  function majElement(nom, id, patch) {
    majListe(nom, function (l) {
      var trouve = false;
      l = l.map(function (x) { if (x.id !== id) return x; trouve = true; return Object.assign({}, x, typeof patch === 'function' ? patch(x) : patch, { modifieLe: new Date().toISOString() }); });
      if (!trouve && typeof patch !== 'function') l.unshift(Object.assign({ id: id }, patch));
      return l;
    });
  }
  function majReglages(patch) {
    var r = R(); if (!r || !r.set) return;
    r.set(function (s) {
      var m = Object.assign({}, s.marketing && typeof s.marketing === 'object' ? s.marketing : {});
      m.reglages = Object.assign({}, m.reglages || {}, patch);
      return { marketing: m };
    });
  }
  function majProspect(id, fn) {
    var r = R(); if (!r || !r.set) return;
    r.set(function (s) { return { prospects: (s.prospects || []).map(function (x) { return x.id === id ? Object.assign({}, x, fn(x), { updatedAt: jour() }) : x; }) }; });
  }
  // Note sur l'historique de la fiche du prospect (même format que le reste du CRM).
  function noter(id, type, texte) {
    var n = new Date();
    var ev = { id: uid(), at: n.toISOString(), date: jour(n), time: deux(n.getHours()) + ':' + deux(n.getMinutes()), type: type || 'note', text: texte };
    var r = R(); if (!r || !r.set) return;
    r.set(function (s) { return { prospects: (s.prospects || []).map(function (x) { return x.id === id ? Object.assign({}, x, { events: [ev].concat(x.events || []).slice(0, 200) }) : x; }) }; });
  }
  function bloque(p) { return !!(p && p.nePlusContacter); }
  function ouvrirFiche(id) {
    var Y = window.__bsY;
    if (Y && Y.set && id) Y.set(function (a) { return { overlays: (a.overlays || []).concat([{ key: uid(), type: 'prospect', id: id }]) }; });
  }

  var STATUTS = { a_appeler: 'À appeler', injoignable: 'Injoignable', rdv_pris: 'RDV pris', audit_realise: 'Audit réalisé', proposition_envoyee: 'Proposition envoyée',
    client_signe: 'Client actif', resilie: 'Résilié', perdu: 'Perdu / Refus' };
  var ETAPE = { a_appeler: 0, injoignable: 0, rdv_pris: 1, audit_realise: 2, proposition_envoyee: 3, client_signe: 4, resilie: -1, perdu: -1 };

  // ---------------------------------------------------------------- variables {{…}}
  var CIVILITES = /^(m\.?|mr\.?|mme\.?|mlle\.?|monsieur|madame|mademoiselle|dr\.?|docteur|me|maître)$/i;
  function prenomDe(contact) {
    var mots = String(contact || '').trim().split(/\s+/).filter(Boolean);
    if (mots.length < 2 || CIVILITES.test(mots[0])) return '';
    return mots[0].charAt(0).toUpperCase() + mots[0].slice(1);
  }
  function moi() {
    var c = etat().companyInfo || {};
    return (USER && USER.name) || c.expediteur || c.nom || 'Blackstart AI';
  }
  function valeurs(p) {
    var c = etat().companyInfo || {};
    p = p || {};
    var contact = String(p.contact || '').trim();
    return { prenom: prenomDe(contact) || contact || 'Madame, Monsieur', contact: contact || 'Madame, Monsieur', entreprise: p.entreprise || 'votre entreprise',
      ville: p.ville || 'votre ville', secteur: p.secteur && p.secteur !== 'Autre' ? p.secteur : 'votre secteur', moi: moi(), agence: c.nom || 'Blackstart AI',
      site: c.site || '', telephone: c.telephone || '' };
  }
  var VARIABLES = ['prenom', 'contact', 'entreprise', 'ville', 'secteur', 'moi', 'agence'];
  function remplir(t, p) {
    var v = valeurs(p);
    return String(t || '').replace(/\{\{\s*([a-z]+)\s*\}\}/gi, function (m, k) { k = k.toLowerCase(); return Object.prototype.hasOwnProperty.call(v, k) ? v[k] : m; });
  }

  // ---------------------------------------------------------------- presse-papiers, numéros
  function copier(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return copierVieux(t); });
    return Promise.resolve(copierVieux(t));
  }
  function copierVieux(t) {
    var z = document.createElement('textarea'); z.value = t; z.style.position = 'fixed'; z.style.opacity = '0';
    document.body.appendChild(z); z.select(); var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    z.remove(); return ok;
  }
  function telDe(p) { return p ? (p.mobile || p.portable || p.telephone || '') : ''; }
  // 06 12 34 56 78 → 33612345678 (pour wa.me).
  function international(t) {
    var d = String(t || '').replace(/[^\d+]/g, '');
    if (!d) return '';
    if (d.indexOf('+') === 0) return d.slice(1);
    if (d.indexOf('00') === 0) return d.slice(2);
    if (d.charAt(0) === '0' && d.length === 10) return '33' + d.slice(1);
    return d;
  }

  // ---------------------------------------------------------------- Claude (rédaction)
  var IA = { etat: null, attente: [] };
  function iaEtat(cb) {
    if (IA.etat) { cb(IA.etat); return; }
    IA.attente.push(cb);
    if (IA.attente.length > 1) return;
    var fin = function (e) { IA.etat = e; var l = IA.attente; IA.attente = []; l.forEach(function (f) { try { f(e); } catch (x) { /* page démontée */ } }); };
    if (!CONF) { fin({ ia: false, admin: false }); return; }
    fetch('/api/ia/etat', { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
      .then(function (r) { return r.ok ? r.json() : { ia: false }; })
      .then(function (b) { fin({ ia: !!(b && b.ia), admin: !!(b && b.admin) }); }, function () { fin({ ia: false, admin: false }); });
  }
  function rediger(type, consigne) {
    return fetch('/api/ia/rediger', { method: 'POST', credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: type, consigne: String(consigne || '').slice(0, 4000) }) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (b) {
          if (!r.ok || !b.texte) throw new Error(b.error || 'Claude n’a pas pu rédiger le texte (erreur ' + r.status + ').');
          return String(b.texte);
        });
      });
  }
  function contexteAgence() {
    var c = etat().companyInfo || {};
    return 'Je suis ' + moi() + ', de ' + (c.nom || 'Blackstart AI') + ', une agence qui crée des CRM sur mesure et fait de la génération de leads pour les petites entreprises françaises (artisans, immobilier, santé, commerce, services).';
  }

  // ---------------------------------------------------------------- affichage
  var CSS = '.bsmk-root{display:flex;flex-direction:column;gap:16px;max-width:1120px;min-width:0}' +
    '.bsmk-card{padding-bottom:16px;min-width:0}.bsmk-card>*:not(.card-head){margin-left:18px;margin-right:18px}' +
    '.bsmk-tabs{display:flex;gap:6px;flex-wrap:wrap}.bsmk-tab{border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);border-radius:999px;padding:7px 14px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer}' +
    '.bsmk-tab.on{background:var(--accent);border-color:var(--accent);color:var(--on-accent,#fff)}' +
    '.bsmk-msg{border-radius:10px;padding:10px 14px;font-size:14px;background:var(--surface-2);border:1px solid var(--border);line-height:1.45}' +
    '.bsmk-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsmk-msg.err{border-color:rgba(239,68,68,.45);background:rgba(239,68,68,.1)}.bsmk-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsmk-msg a{color:var(--accent)}' +
    '.bsmk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.bsmk-grid label,.bsmk-l{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--text-2);min-width:0}' +
    '.bsmk-grid .input,.bsmk-l .input{width:100%;box-sizing:border-box}' +
    '.bsmk-act{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.bsmk-act small{color:var(--text-3);font-size:12.5px}' +
    '.bsmk-vide{color:var(--text-3);font-size:14px;margin:6px 0}' +
    '.bsmk-txt{margin:0;font-size:14px;line-height:1.5;color:var(--text-2)}' +
    '.bsmk-area{display:block;box-sizing:border-box;width:100%;min-height:150px;resize:vertical;line-height:1.5;font-size:14px}' +
    '.bsmk-vars{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:var(--text-3)}.bsmk-vars button{border:1px dashed var(--border-2,var(--border));background:var(--surface-2);color:var(--text-2);border-radius:8px;padding:3px 8px;font:inherit;font-size:12px;cursor:pointer}' +
    '.bsmk-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.bsmk-kpis .kpi{padding:12px 14px}' +
    '.bsmk-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px;min-width:0}.bsmk-row:last-child{border-bottom:0}' +
    '.bsmk-row .bsmk-t{flex:1;min-width:0}.bsmk-row .bsmk-t b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsmk-row .bsmk-t small{color:var(--text-3);display:block;overflow:hidden;text-overflow:ellipsis}' +
    '.bsmk-apercu{border:1px solid var(--border);border-radius:12px;background:var(--surface-2);padding:12px 14px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word}' +
    '.bsmk-apercu b{display:block;margin-bottom:6px}' +
    '.bsmk-sep{height:1px;background:var(--border);margin:14px 0}' +
    '.bsmk-h4{margin:14px 0 8px;font-size:14px;font-weight:700;color:var(--text)}' +
    '.bsmk-tbl{width:100%;border-collapse:collapse;font-size:13.5px}.bsmk-tbl th{font-size:12px;font-weight:600;color:var(--text-3);text-align:right;padding:8px 6px;border-bottom:1px solid var(--border);white-space:nowrap}' +
    '.bsmk-tbl td{padding:9px 6px;border-bottom:1px solid var(--border);text-align:right;white-space:nowrap}.bsmk-tbl th:first-child,.bsmk-tbl td:first-child{text-align:left}.bsmk-tbl tr:last-child td{border-bottom:0}' +
    '.bsmk-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}' +
    '.bsmk-bar{height:8px;border-radius:99px;background:var(--surface-3,var(--surface-2));overflow:hidden;min-width:60px}.bsmk-bar i{display:block;height:100%;border-radius:99px;background:var(--accent)}' +
    '@media (max-width:760px){.bsmk-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
    '@media (max-width:640px){.bsmk-card>*:not(.card-head){margin-left:12px;margin-right:12px}.bsmk-act .btn{flex:1 1 auto}.bsmk-row{flex-wrap:wrap}}';
  function css() {
    if (document.getElementById('bsmk-css')) return;
    var s = document.createElement('style'); s.id = 'bsmk-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function tete(titre, sous, actions) {
    return '<div class="page-head"><div class="page-head-text"><h1 class="page-title">' + esc(titre) + '</h1><p class="page-sub">' + esc(sous) + '</p></div>' +
      (actions ? '<div class="page-head-actions">' + actions + '</div>' : '') + '</div>';
  }
  function kpi(label, valeur, sous) {
    return '<div class="kpi" data-kpi="' + esc(label) + '"><div class="kpi-top"><span class="kpi-label">' + esc(label) + '</span></div><div class="kpi-value">' + esc(valeur) + '</div>' +
      (sous ? '<div class="kpi-sub">' + esc(sous) + '</div>' : '') + '</div>';
  }
  function message(m) { return m ? '<div class="bsmk-msg ' + (m.k || '') + '">' + esc(m.t) + (m.lien ? ' <a href="' + esc(m.lien) + '">' + esc(m.lienTexte || 'Ouvrir') + '</a>' : '') + '</div>' : ''; }
  function boutonsVariables(cible) {
    return '<div class="bsmk-vars"><span>Variables :</span>' + VARIABLES.map(function (v) { return '<button type="button" data-var="{{' + v + '}}" data-cible="' + esc(cible || '') + '">{{' + v + '}}</button>'; }).join('') + '</div>';
  }
  // Insère une variable à l'endroit du curseur dans le dernier champ de texte utilisé.
  var dernierChamp = null;
  document.addEventListener('focusin', function (e) { var t = e.target; if (t && (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && t.type === 'text')) && t.closest && t.closest('.bsmk-root')) dernierChamp = t; });
  function insererVariable(btn) {
    var cible = btn.getAttribute('data-cible');
    var champ = cible ? document.querySelector(cible) : dernierChamp;
    if (!champ || !champ.isConnected) champ = dernierChamp;
    if (!champ || !champ.isConnected) return;
    var v = btn.getAttribute('data-var'), a = champ.selectionStart, b = champ.selectionEnd;
    if (typeof a !== 'number') { a = b = champ.value.length; }
    champ.value = champ.value.slice(0, a) + v + champ.value.slice(b);
    champ.focus(); champ.selectionStart = champ.selectionEnd = a + v.length;
    champ.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Une page Marketing : monter(el) dessine dans el et se redessine quand les données changent (sauf pendant
  // qu'on écrit dans un champ de la page : elle attend qu'on en sorte).
  function page(rendre, brancher) {
    var racine = null, sale = false, desabo = null;
    function dessiner(forcer) {
      if (!racine || !racine.isConnected) return;
      var f = document.activeElement;
      if (forcer !== true && f && racine.contains(f) && /^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName)) { sale = true; return; }
      sale = false;
      var y = window.scrollY;
      // Les cartes de chiffres déjà affichées sont gardées (seul le contenu change) : l'animation d'entrée des
      // chiffres (bs-anim) ne se rejoue pas à chaque mise à jour.
      var vieux = {};
      Array.prototype.forEach.call(racine.querySelectorAll('.kpi[data-kpi]'), function (k) { vieux[k.getAttribute('data-kpi')] = k; });
      rendre(racine);
      Array.prototype.forEach.call(racine.querySelectorAll('.kpi[data-kpi]'), function (n) {
        var o = vieux[n.getAttribute('data-kpi')];
        if (!o) return;
        if (o.innerHTML !== n.innerHTML) o.innerHTML = n.innerHTML;
        n.parentNode.replaceChild(o, n);
      });
      if (Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y);
    }
    function monter(el) {
      if (!el) return;
      css();
      if (el === racine && el.__bsmk) { dessiner(); return; }
      racine = el; el.__bsmk = true; el.classList.add('bsmk-root');
      el.addEventListener('focusout', function () { setTimeout(function () { if (sale) dessiner(); }, 60); });
      el.addEventListener('click', function (ev) { var b = ev.target.closest('[data-var]'); if (b && el.contains(b)) { ev.preventDefault(); insererVariable(b); } });
      brancher(el, dessiner);
      if (!desabo && R() && R().subscribe) {
        var avant = null;
        desabo = R().subscribe(function (s) {
          var cle = [s.marketing, s.prospects, s.factures, s.companyInfo];
          if (avant && cle.every(function (v, i) { return v === avant[i]; })) return;
          avant = cle;
          if (racine && racine.isConnected) dessiner();
        });
      }
      dessiner();
    }
    return { monter: monter, dessiner: dessiner, racine: function () { return racine; } };
  }

  window.bsMarketing = {
    esc: esc, uid: uid, jour: jour, auj: auj, plusJours: plusJours, ecart: ecart, dateFr: dateFr, euros: euros,
    etat: etat, prospects: prospects, prospect: prospect, data: data, actifs: actifs, majListe: majListe, majElement: majElement, majReglages: majReglages,
    majProspect: majProspect, noter: noter, bloque: bloque, ouvrirFiche: ouvrirFiche, STATUTS: STATUTS, ETAPE: ETAPE,
    VARIABLES: VARIABLES, valeurs: valeurs, remplir: remplir, prenomDe: prenomDe, moi: moi,
    copier: copier, telDe: telDe, international: international,
    iaEtat: iaEtat, rediger: rediger, contexteAgence: contexteAgence,
    css: css, tete: tete, kpi: kpi, message: message, boutonsVariables: boutonsVariables, page: page,
    serveur: !!CONF, user: USER
  };
})();
