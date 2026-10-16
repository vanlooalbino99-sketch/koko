/* Blackstart CRM : rubrique « Entraînement » avec Pitchbase (pitchbase.app).
 *
 * Pitchbase fait jouer un prospect par une IA au téléphone pour s'entraîner avant les vrais appels.
 * Le CRM prépare la fiche du prospect à simuler (entreprise, secteur, contact, historique d'appels, notes,
 * objections de notre script, objectif de l'appel), la copie et ouvre Pitchbase : dans le CRM quand Pitchbase
 * accepte d'être affiché dans un autre site (le serveur du CRM le vérifie), sinon dans une fenêtre à côté.
 * Chaque entraînement lancé sur un prospect est noté sur sa fiche.
 */
(function () {
  'use strict';
  if (window.bsEntrainement) return;

  var SITE = 'https://pitchbase.app/app';
  var CLE = 'bs-entrainement';
  function lire(d) { try { var v = JSON.parse(localStorage.getItem(CLE)); return v && typeof v === 'object' ? v : d; } catch (e) { return d; } }
  function ecrire() { try { localStorage.setItem(CLE, JSON.stringify(P)); } catch (e) { /* stockage indisponible */ } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var P = lire({});
  if (!P.offre) P.offre = 'un CRM sur mesure et de la génération de leads, pour trouver de nouveaux clients et ne plus en perdre';
  if (!P.niveau) P.niveau = 'normal';
  if (!Array.isArray(P.historique)) P.historique = [];

  var S = { prospectId: '', objectif: '', fiche: '', modifiee: false, integrable: null, ouvert: false, msg: null };
  var racine, fenetre;

  var NIVEAUX = {
    facile: ['Facile', 'Curieux et poli, il pose des questions mais finit par écouter.'],
    normal: ['Normal', 'Pressé et un peu méfiant : il veut savoir vite pourquoi je l’appelle.'],
    difficile: ['Difficile', 'Fermé, il cherche à raccrocher et enchaîne les objections.']
  };
  var OBJECTIFS = {
    rdv: 'Obtenir un rendez-vous pour un audit gratuit de 20 minutes (proposer deux créneaux).',
    relance: 'Relancer la proposition envoyée et obtenir une décision ou une date de signature.',
    signature: 'Conclure : faire valider la proposition et fixer le démarrage.',
    rappel: 'Rattraper un prospect qui n’avait pas répondu et obtenir un rendez-vous.'
  };
  var OBJECTIONS = ['« Je n’ai pas le temps »', '« On n’a pas de budget pour ça »', '« Envoyez-moi une documentation »', '« On a déjà quelqu’un / un logiciel pour ça »', '« Rappelez-moi plus tard »'];
  var STATUTS = { a_appeler: 'à appeler', injoignable: 'injoignable', rdv_pris: 'rendez-vous pris', audit_realise: 'audit réalisé', proposition_envoyee: 'proposition envoyée', client_signe: 'client', perdu: 'perdu', resilie: 'résilié' };
  var RESULTATS = { injoignable: 'injoignable', rappel: 'à rappeler plus tard', rdv_pris: 'rendez-vous obtenu', audit_realise: 'audit réalisé', proposition_envoyee: 'proposition envoyée', client_signe: 'client signé', perdu: 'refus' };

  function store() { var R = window.__bsStore; return R && R.get ? R.get() : {}; }
  function prospects() { return (store().prospects || []).filter(function (p) { return p.entreprise || p.contact; }); }
  function prospect(id) { return prospects().filter(function (p) { return p.id === id; })[0] || null; }
  function objectifPour(p) {
    if (!p) return 'rdv';
    if (p.statut === 'proposition_envoyee' || p.statut === 'audit_realise') return 'relance';
    if (p.statut === 'rdv_pris') return 'signature';
    if (p.statut === 'injoignable') return 'rappel';
    return 'rdv';
  }
  function dateFr(d) { try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }); } catch (e) { return d || ''; } }

  // Fiche à coller dans Pitchbase : tout ce qu'il faut à l'IA pour jouer ce prospect-là.
  function fiche(p, objectif) {
    var moi = (store().companyInfo || {}).nom || 'Blackstart AI';
    var l = ['Appel de prospection B2B en français. Je suis commercial chez ' + moi + '. Je vends ' + P.offre + '.', ''];
    if (p) {
      l.push('Prospect à jouer : ' + (p.contact ? p.contact + ', décideur de ' : 'le gérant de ') + p.entreprise + (p.secteur ? ' (' + p.secteur + ')' : '') + (p.ville ? ', à ' + p.ville : '') + '.');
      if (p.site) l.push('Son site : ' + p.site);
      var appels = (p.callLog || []).slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      var h = 'Où on en est : prospect « ' + (STATUTS[p.statut] || p.statut || 'nouveau') + ' »';
      if (appels.length) h += ', ' + appels.length + ' appel' + (appels.length > 1 ? 's' : '') + ' déjà passé' + (appels.length > 1 ? 's' : '') + ' (dernier : ' + (RESULTATS[appels[0].outcome] || appels[0].outcome || 'sans résultat') + (appels[0].date ? ', le ' + dateFr(appels[0].date) : '') + ')';
      l.push(h + '.');
      var notes = String(p.notes || '').replace(/\s+/g, ' ').trim();
      var dernieres = appels.map(function (a) { return String(a.note || '').replace(/\s+/g, ' ').trim(); }).filter(Boolean).slice(0, 2);
      if (notes || dernieres.length) l.push('Ce que je sais déjà : ' + [notes].concat(dernieres).filter(Boolean).join(' · ').slice(0, 700));
    } else {
      l.push('Prospect à jouer : le gérant d’une petite entreprise française qui n’a jamais entendu parler de nous.');
    }
    l.push('');
    l.push('Caractère : ' + NIVEAUX[P.niveau][1]);
    l.push('Objections à me faire, une à la fois et naturellement : ' + OBJECTIONS.join(', ') + '.');
    l.push('Mon objectif : ' + OBJECTIFS[objectif || 'rdv']);
    l.push('');
    l.push('À la fin, note mon appel sur 10 et dis-moi les 3 choses à améliorer en priorité.');
    return l.join('\n');
  }
  function regenerer() {
    var p = prospect(S.prospectId);
    if (!S.objectif) S.objectif = objectifPour(p);
    S.fiche = fiche(p, S.objectif); S.modifiee = false;
  }

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

  function noterSurFiche(p) {
    try {
      var R = window.__bsStore; if (!R || !R.set || !p) return;
      var n = new Date();
      var ev = { id: Math.random().toString(36).slice(2) + n.getTime().toString(36), at: n.toISOString(), date: n.toISOString().slice(0, 10), time: n.toTimeString().slice(0, 5),
        type: 'note', text: 'Entraînement Pitchbase sur ce prospect (' + NIVEAUX[P.niveau][0].toLowerCase() + ')' };
      R.set(function (s) { return { prospects: s.prospects.map(function (x) { return x.id === p.id ? Object.assign({}, x, { events: [ev].concat(x.events || []).slice(0, 200) }) : x; }) }; });
    } catch (e) { /* la fiche est un plus */ }
  }

  function lancer() {
    var p = prospect(S.prospectId);
    P.historique = [{ at: new Date().toISOString(), prospectId: p ? p.id : '', nom: p ? p.entreprise : 'Prospect type', niveau: P.niveau }].concat(P.historique).slice(0, 30);
    ecrire();
    noterSurFiche(p);
    return copier(S.fiche).then(function (ok) {
      if (S.integrable) { S.ouvert = true; S.msg = { k: 'ok', t: ok ? 'Fiche copiée. Dans Pitchbase, créez un scénario et collez-la (Ctrl + V) dans la description du prospect.' : 'Copiez la fiche ci-dessus, puis collez-la dans Pitchbase.' }; }
      else {
        if (!fenetre || fenetre.closed) fenetre = window.open(SITE, 'pitchbase', 'width=1180,height=860');
        else { try { fenetre.focus(); } catch (e) { /* fenêtre d'un autre site */ } }
        S.msg = { k: fenetre ? 'ok' : 'warn', t: (ok ? 'Fiche copiée. ' : 'Copiez la fiche ci-dessus. ') + (fenetre ? 'Pitchbase s’est ouvert dans une fenêtre à côté du CRM : créez un scénario et collez la fiche (Ctrl + V) dans la description du prospect.' : 'Votre navigateur a bloqué la fenêtre Pitchbase : autorisez les fenêtres pour ce site, ou utilisez le bouton « Ouvrir Pitchbase ».') };
      }
      rendre();
    });
  }

  var LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="bsent-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#bsent-g)"/><path d="M17 13h9c5.2 0 8.6 3 8.6 7.6S31.2 28 26 28h-3.4v7H17zm5.6 4.7v5.6h3c2.1 0 3.4-1.1 3.4-2.8s-1.3-2.8-3.4-2.8z" fill="#fff"/><circle cx="36" cy="12" r="3" fill="#fde68a"/></svg>';
  var CSS = '.bsent-root{display:flex;flex-direction:column;gap:16px;max-width:1080px}' +
    '.bsent-card{padding-bottom:16px}.bsent-card>*:not(.card-head){margin-left:18px;margin-right:18px}' +
    '.bsent-fh{display:flex;align-items:center;gap:12px}.bsent-logo{display:inline-flex;width:44px;height:44px;flex:none;border-radius:12px;overflow:hidden}.bsent-logo svg{width:100%;height:100%}' +
    '.bsent-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.bsent-grid label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--text-2)}' +
    '.bsent-fiche{display:block;box-sizing:border-box;width:calc(100% - 36px);min-height:250px;resize:vertical;line-height:1.5;margin-top:12px;font-size:14px}' +
    '.bsent-act{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px}.bsent-act small{color:var(--text-3);font-size:12.5px}' +
    '.bsent-msg{border-radius:10px;padding:10px 14px;font-size:14px;margin-top:12px;background:var(--surface-2);border:1px solid var(--border)}.bsent-msg.ok{border-color:rgba(34,197,94,.45);background:rgba(34,197,94,.1)}.bsent-msg.warn{border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.1)}' +
    '.bsent-cadre{width:100%;height:min(78vh,860px);border:1px solid var(--border);border-radius:12px;background:#fff;display:block}' +
    '.bsent-h{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:14px}.bsent-h:last-child{border-bottom:0}.bsent-h b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bsent-h small{color:var(--text-3)}' +
    '.bsent-txt{margin:0;font-size:14px;line-height:1.5;color:var(--text-2)}';
  function css() {
    if (document.getElementById('bsent-css')) return;
    var s = document.createElement('style'); s.id = 'bsent-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function rendre() {
    if (!racine || !racine.isConnected) return;
    var zone = racine.querySelector('textarea[name=fiche]');
    if (zone && S.modifiee) S.fiche = zone.value;
    var liste = prospects();
    var p = prospect(S.prospectId);
    var pitch = S.integrable && S.ouvert
      ? '<section class="card bsent-card"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo">' + LOGO + '</span><div><h3 class="card-title">Pitchbase</h3><p class="card-sub">Votre simulation, sans quitter le CRM.</p></div></div>' +
        '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="fenetre">Ouvrir dans une fenêtre</button></div></header>' +
        '<iframe class="bsent-cadre" src="' + SITE + '" title="Pitchbase" allow="microphone; camera; autoplay; clipboard-read; clipboard-write; fullscreen"></iframe></section>'
      : '';
    racine.innerHTML = '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Entraînement</h1><p class="page-sub">Entraînez-vous face à un prospect joué par une IA avec Pitchbase, puis appelez pour de vrai.</p></div></div>' +
      '<section class="card bsent-card"><header class="card-head"><div class="bsent-fh"><span class="bsent-logo">' + LOGO + '</span><div><h3 class="card-title">Préparer la simulation</h3><p class="card-sub">Le CRM prépare la fiche du prospect pour Pitchbase : copiez-la, Pitchbase fait le reste.</p></div></div></header>' +
      '<div class="bsent-grid">' +
      '<label>Prospect à simuler<select class="input" name="prospect"><option value="">Un prospect type (sans fiche)</option>' +
      liste.slice(0, 500).map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === S.prospectId ? ' selected' : '') + '>' + esc((x.entreprise || x.contact) + (x.ville ? ' · ' + x.ville : '')) + '</option>'; }).join('') + '</select></label>' +
      '<label>Difficulté<select class="input" name="niveau">' + Object.keys(NIVEAUX).map(function (k) { return '<option value="' + k + '"' + (P.niveau === k ? ' selected' : '') + '>' + NIVEAUX[k][0] + '</option>'; }).join('') + '</select></label>' +
      '<label>Objectif de l’appel<select class="input" name="objectif">' + Object.keys(OBJECTIFS).map(function (k) { return '<option value="' + k + '"' + (S.objectif === k ? ' selected' : '') + '>' + { rdv: 'Obtenir un rendez-vous', relance: 'Relancer une proposition', signature: 'Conclure la vente', rappel: 'Rattraper un injoignable' }[k] + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      '<div class="bsent-grid" style="grid-template-columns:1fr;margin-top:10px"><label>Ce que vous vendez<input class="input" name="offre" value="' + esc(P.offre) + '"></label></div>' +
      '<textarea class="input bsent-fiche" name="fiche" spellcheck="false" aria-label="Fiche pour Pitchbase">' + esc(S.fiche) + '</textarea>' +
      (S.msg ? '<div class="bsent-msg ' + S.msg.k + '">' + esc(S.msg.t) + '</div>' : '') +
      '<div class="bsent-act"><button type="button" class="btn btn-primary" data-act="lancer">Lancer la simulation</button><button type="button" class="btn btn-secondary" data-act="copier">Copier la fiche</button>' +
      (S.modifiee ? '<button type="button" class="btn btn-ghost btn-sm" data-act="refaire">Refaire la fiche</button>' : '') +
      '<small>' + (S.integrable === false ? 'Pitchbase s’ouvre dans une fenêtre à côté du CRM.' : '') + (p && p.telephone ? ' Prêt ? Appelez ' + esc(p.entreprise) + ' au ' + esc(p.telephone) + '.' : '') + '</small></div>' +
      '</section>' + pitch +
      '<section class="card bsent-card"><header class="card-head"><div><h3 class="card-title">Pitchbase</h3><p class="card-sub">Simulateur d’appels avec IA pour les équipes commerciales francophones.</p></div>' +
      '<div class="card-actions"><button type="button" class="btn btn-ghost btn-sm" data-act="ouvrir">Ouvrir Pitchbase</button></div></header>' +
      '<p class="bsent-txt">Il faut un compte Pitchbase (essai gratuit, puis abonnement par personne chez Pitchbase). Connectez-vous une fois, Pitchbase s’en souvient. Autorisez le micro quand Pitchbase le demande.</p></section>' +
      (P.historique.length ? '<section class="card bsent-card"><header class="card-head"><div><h3 class="card-title">Derniers entraînements</h3><p class="card-sub">Sur cet appareil.</p></div></header><div>' +
        P.historique.slice(0, 10).map(function (h) {
          return '<div class="bsent-h"><b>' + esc(h.nom) + '</b><small>' + esc((NIVEAUX[h.niveau] || NIVEAUX.normal)[0] + ' · ' + new Date(h.at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) + '</small>' +
            (h.prospectId && prospect(h.prospectId) ? '<button type="button" class="btn btn-ghost btn-sm" data-refaire="' + esc(h.prospectId) + '">Recommencer</button>' : '') + '</div>';
        }).join('') + '</div></section>' : '');
  }

  function brancher(el) {
    el.addEventListener('change', function (ev) {
      var n = ev.target.name;
      if (n === 'prospect') { S.prospectId = ev.target.value; S.objectif = ''; S.msg = null; regenerer(); rendre(); }
      if (n === 'niveau') { P.niveau = ev.target.value; ecrire(); if (!S.modifiee) regenerer(); rendre(); }
      if (n === 'objectif') { S.objectif = ev.target.value; if (!S.modifiee) regenerer(); rendre(); }
      if (n === 'offre') { P.offre = ev.target.value.trim() || P.offre; ecrire(); if (!S.modifiee) regenerer(); rendre(); }
    });
    el.addEventListener('input', function (ev) { if (ev.target.name === 'fiche') { S.fiche = ev.target.value; if (!S.modifiee) { S.modifiee = true; } } });
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-act],[data-refaire]'); if (!t) return;
      if (t.hasAttribute('data-refaire')) { S.prospectId = t.getAttribute('data-refaire'); S.objectif = ''; regenerer(); S.msg = null; rendre(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      var a = t.getAttribute('data-act');
      if (a === 'lancer') lancer();
      if (a === 'copier') copier(S.fiche).then(function (ok) { S.msg = ok ? { k: 'ok', t: 'Fiche copiée : collez-la dans Pitchbase (Ctrl + V).' } : { k: 'warn', t: 'Copie impossible : sélectionnez le texte de la fiche et copiez-le.' }; rendre(); });
      if (a === 'refaire') { regenerer(); rendre(); }
      if (a === 'ouvrir' || a === 'fenetre') { fenetre = window.open(SITE, 'pitchbase', 'width=1180,height=860'); if (a === 'fenetre') { S.ouvert = false; rendre(); } }
    });
  }

  function verifierCadre() {
    if (S.integrable !== null || !window.BS_SERVER) { if (!window.BS_SERVER) S.integrable = false; return; }
    fetch('/api/integrations/cadre/pitchbase', { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
      .then(function (r) { return r.ok ? r.json() : { integrable: false }; })
      .then(function (b) { S.integrable = !!b.integrable; rendre(); }, function () { S.integrable = false; rendre(); });
  }

  function monter(el) {
    if (!el) return;
    css();
    if (el === racine && el.__bsEnt) return;
    racine = el; el.__bsEnt = true; el.classList.add('bsent-root');
    brancher(el);
    if (!S.fiche || !S.modifiee) regenerer();
    rendre();
    verifierCadre();
  }

  window.bsEntrainement = { monter: monter, fiche: fiche };
})();
