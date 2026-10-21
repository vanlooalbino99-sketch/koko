/* Blackstart CRM : l'équipe d'assistants IA (Claude).
 *
 * Assistant de l'équipe, CEO, VP Sales, Directeur de production, Chasseur de leads, Marketing, Finance, Clients :
 * le serveur (/api/ia/assistants) donne la liste de ceux ouverts au membre connecté ; un administrateur les voit
 * tous et choisit qui a accès à chacun.
 * - panneau(el, o) : la carte « Assistant IA » de la page Aujourd'hui (choix de l'assistant, conversation).
 * - contexte() : l'état du CRM envoyé à Claude avec la question. Chiffres, entreprises, statuts, montants, dates ;
 *   jamais les noms, téléphones ni e-mails des contacts.
 * Les conversations restent dans ce navigateur (une par assistant et par membre).
 */
(function () {
  'use strict';
  if (window.bsAssistants) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var API = '/api/ia';
  var MAX_MSG = 40;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  function jour(d) { d = d || new Date(); return d.getFullYear() + '-' + deux(d.getMonth() + 1) + '-' + deux(d.getDate()); }
  function euros(n) { return (Number(n) || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); }
  var EXTRA = {
    'ia-send': '<path d="M3.7 3.2 21 12 3.7 20.8a.5.5 0 0 1-.7-.6L5.6 12 3 3.8a.5.5 0 0 1 .7-.6Z"/><path d="M5.6 12H12"/>',
    'chev-down': '<path d="m6 9 6 6 6-6"/>',
  };
  function ic(name, size) {
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name)) || (hs && hs[name]) || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  function api(method, path, body) {
    return fetch(API + path, { method: method, credentials: 'same-origin', headers: Object.assign({ 'X-Requested-With': 'blackstart' }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) { var e = new Error(b.error || 'Le serveur ne répond pas : réessayez.'); e.code = b.code; e.status = r.status; throw e; } return b; }); });
  }
  function prenom() {
    var n = (USER && USER.name) || '';
    if (!n) { var s = etat(); n = ((s.companyInfo || {}).expediteur || '').split(/[\s—-]/)[0]; }
    return String(n).trim().split(/\s+/)[0] || '';
  }

  // ---------------------------------------------------------------- état du CRM pour Claude
  function etat() { var r = window.__bsStore; return r && r.get ? r.get() : {}; }
  var STATUTS = { a_appeler: 'À appeler', injoignable: 'Injoignable', rdv_pris: 'RDV pris', audit_realise: 'Audit réalisé', proposition_envoyee: 'Proposition envoyée', client_signe: 'Client actif', resilie: 'Résilié', perdu: 'Perdu' };
  var FERMES = ['client_signe', 'perdu', 'resilie'];
  function appels(ps, du, au) {
    var n = 0, joints = 0, rdv = 0;
    ps.forEach(function (p) { (p.callLog || []).forEach(function (c) { if (c.date >= du && c.date <= au) { n++; if (c.outcome !== 'injoignable') joints++; if (c.outcome === 'rdv_pris') rdv++; } }); });
    return { n: n, joints: joints, rdv: rdv };
  }
  function contexte() {
    var s = etat(), ps = (s.prospects || []).filter(function (p) { return p && !p.supprime; }), t = jour(), lignes = [];
    var d7 = new Date(); d7.setDate(d7.getDate() - 6); d7 = jour(d7);
    var d30 = new Date(); d30.setDate(d30.getDate() - 29); d30 = jour(d30);
    var parStatut = {};
    ps.forEach(function (p) { parStatut[p.statut] = (parStatut[p.statut] || 0) + 1; });
    var aAppeler = ps.filter(function (p) { return p.prochaineRelance && p.prochaineRelance <= t && FERMES.indexOf(p.statut) < 0 && !p.nePlusContacter; });
    var retard = aAppeler.filter(function (p) { return p.prochaineRelance < t; });
    var a1 = appels(ps, t, t), a7 = appels(ps, d7, t), a30 = appels(ps, d30, t);
    var clients = ps.filter(function (p) { return p.statut === 'client_signe'; });
    var mrr = clients.reduce(function (x, p) { return x + (Number(p.mrrValue) || 0); }, 0);
    var st = s.settings || {};
    lignes.push('Date : ' + new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    if (s.companyInfo && s.companyInfo.nom) lignes.push('Entreprise : ' + s.companyInfo.nom);
    lignes.push('Prospects : ' + ps.length + ' (' + Object.keys(parStatut).map(function (k) { return (STATUTS[k] || k) + ' ' + parStatut[k]; }).join(', ') + ')');
    lignes.push('Appels prévus aujourd’hui : ' + aAppeler.length + ', dont ' + retard.length + ' en retard');
    lignes.push('Appels aujourd’hui : ' + a1.n + ' (' + a1.joints + ' joints, ' + a1.rdv + ' RDV) ; 7 derniers jours : ' + a7.n + ' (' + a7.joints + ' joints, ' + a7.rdv + ' RDV) ; 30 jours : ' + a30.n + ' (' + a30.joints + ' joints, ' + a30.rdv + ' RDV)');
    lignes.push('Objectifs : ' + (st.targetCallsWeek || 0) + ' appels et ' + (st.targetRdvWeek || 0) + ' RDV par semaine, ' + euros(st.targetCaMonth) + ' signés par mois, MRR visé ' + euros(st.targetMrr));
    lignes.push('Clients actifs : ' + clients.length + ', MRR ' + euros(mrr));
    var nouveaux = ps.filter(function (p) { return p.createdAt && p.createdAt >= d7; }).length;
    lignes.push('Nouveaux prospects sur 7 jours : ' + nouveaux);
    var secteurs = {};
    ps.forEach(function (p) { if (p.secteur) secteurs[p.secteur] = (secteurs[p.secteur] || 0) + 1; });
    lignes.push('Secteurs : ' + Object.keys(secteurs).sort(function (a, b) { return secteurs[b] - secteurs[a]; }).slice(0, 8).map(function (k) { return k + ' ' + secteurs[k]; }).join(', '));
    // Affaires en cours (entreprise, secteur, ville, statut, valeur, relance, dernier appel), sans les contacts.
    var enCours = ps.filter(function (p) { return FERMES.indexOf(p.statut) < 0; }).sort(function (a, b) { return String(a.prochaineRelance || '9999').localeCompare(String(b.prochaineRelance || '9999')); }).slice(0, 40);
    if (enCours.length) {
      lignes.push('Affaires en cours (40 au plus, relance la plus proche d’abord) :');
      enCours.forEach(function (p) {
        var dernier = (p.callLog || [])[0];
        lignes.push('- ' + [p.entreprise, p.secteur, p.ville].filter(Boolean).join(' · ') + ' | ' + (STATUTS[p.statut] || p.statut) +
          (p.priorite ? ' | priorité ' + p.priorite : '') + (p.dealValue ? ' | ' + euros(p.dealValue) : '') +
          (p.prochaineRelance ? ' | relance ' + p.prochaineRelance + (p.prochaineRelance < t ? ' (en retard)' : '') : '') +
          (dernier ? ' | dernier appel ' + dernier.date + ' : ' + (STATUTS[dernier.outcome] || dernier.outcome) : ''));
      });
    }
    var fact = (s.factures || []).filter(function (f) { return f && f.statut === 'a_payer'; });
    if (fact.length) {
      lignes.push('Factures à payer : ' + fact.length);
      fact.slice(0, 15).forEach(function (f) {
        var p = ps.filter(function (x) { return x.id === f.prospectId; })[0];
        lignes.push('- ' + (f.numero || 'Facture') + (p ? ' · ' + p.entreprise : '') + (f.echeance ? ' · échéance ' + f.echeance : '') + (f.date ? ' · émise le ' + f.date : ''));
      });
    }
    var taches = (s.tasks || []).filter(function (x) { return x && !x.done && x.due && x.due <= t; });
    if (taches.length) lignes.push('Tâches à faire aujourd’hui ou en retard : ' + taches.slice(0, 12).map(function (x) { return x.title; }).join(' ; '));
    return lignes.join('\n').slice(0, 29000);
  }

  // ---------------------------------------------------------------- liste et conversations
  var S = { liste: null, ia: null, charge: null, err: '', conv: {}, envoi: {}, choisi: null };
  var cleConv = 'bs-assistants-conv-' + (USER ? USER.id : 'local');
  try { S.conv = JSON.parse(localStorage.getItem(cleConv) || '{}') || {}; } catch (e) { S.conv = {}; }
  try { S.choisi = localStorage.getItem('bs-assistants-choisi') || null; } catch (e) { /* facultatif */ }
  function garder() { try { localStorage.setItem(cleConv, JSON.stringify(S.conv)); } catch (e) { /* facultatif */ } }
  var abonnes = [];
  function prevenir() { abonnes = abonnes.filter(function (f) { return f(); }); }
  function charger(force) {
    if (!CONF) { S.liste = []; S.ia = false; return Promise.resolve(S.liste); }
    if (S.charge && !force) return S.charge;
    S.charge = api('GET', '/assistants').then(function (b) { S.liste = b.assistants || []; S.ia = !!b.ia; S.err = ''; prevenir(); return S.liste; })
      .catch(function (e) { S.liste = S.liste || []; S.err = e.message; S.charge = null; prevenir(); return S.liste; });
    return S.charge;
  }
  function assistant(id) { return (S.liste || []).filter(function (a) { return a.id === id; })[0] || null; }
  function messages(id) { return S.conv[id] || (S.conv[id] = []); }
  function envoyer(id, texte) {
    texte = String(texte || '').trim();
    if (!texte || S.envoi[id]) return;
    var l = messages(id);
    l.push({ de: 'moi', texte: texte, at: Date.now() });
    if (l.length > MAX_MSG) l.splice(0, l.length - MAX_MSG);
    garder();
    if (!CONF) { l.push({ de: 'ia', texte: 'L’assistant IA fonctionne avec la version en ligne du CRM (connexion de l’équipe).', at: Date.now(), info: true }); garder(); prevenir(); return; }
    S.envoi[id] = true; prevenir();
    api('POST', '/assistants/' + encodeURIComponent(id), { messages: l.filter(function (m) { return !m.info; }).map(function (m) { return { de: m.de, texte: m.texte }; }), contexte: contexte() })
      .then(function (b) { l.push({ de: 'ia', texte: b.texte || '…', at: Date.now() }); })
      .catch(function (e) {
        var t = e.code === 'SANS_CLE'
          ? (USER && USER.role === 'admin' ? 'Claude n’est pas encore branché. Collez votre clé Claude dans Entraînement (réglage « Claude »), puis reposez votre question.' : 'Claude n’est pas encore branché : demandez à un administrateur de coller la clé Claude dans Entraînement.')
          : e.message;
        l.push({ de: 'ia', texte: t, at: Date.now(), info: true });
      })
      .then(function () { S.envoi[id] = false; garder(); prevenir(); });
  }
  function effacer(id) { S.conv[id] = []; garder(); prevenir(); }

  // Texte de Claude → HTML simple : gras, listes, paragraphes.
  function md(t) {
    var out = [], liste = null;
    String(t || '').split('\n').forEach(function (ligne) {
      var l = esc(ligne).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|\s)\*([^*\s][^*]*)\*/g, '$1<i>$2</i>');
      var m = /^\s*(?:[-•*]|(\d+)[.)])\s+(.*)$/.exec(l);
      if (m) {
        var type = m[1] ? 'ol' : 'ul';
        if (!liste || liste.type !== type) { if (liste) out.push('</' + liste.type + '>'); liste = { type: type }; out.push('<' + type + '>'); }
        out.push('<li>' + m[2] + '</li>');
        return;
      }
      if (liste) { out.push('</' + liste.type + '>'); liste = null; }
      if (l.trim()) out.push('<p>' + l.replace(/^#+\s*/, '') + '</p>');
    });
    if (liste) out.push('</' + liste.type + '>');
    return out.join('');
  }

  // ---------------------------------------------------------------- carte « Assistant IA » (page Aujourd'hui)
  // Ce que l'assistant de l'équipe propose, chaque ligne mène à la bonne rubrique.
  var AIDES = [
    { t: 'Trouver des prospects qualifiés', page: 'leads' },
    { t: 'Rédiger des messages personnalisés', page: 'modeles' },
    { t: 'Lancer des campagnes d’emailing', page: 'campagnes' },
    { t: 'Suivre vos réponses et rendez-vous', page: 'agenda' },
    { t: 'Automatiser toute votre prospection', act: 'session' },
  ];
  function titreDe(a) { return a.id === 'membre' ? 'Assistant IA - ' + (prenom() || 'Blackstart') + ' 2.0' : a.nom; }
  function nomCourt(a) { return a.id === 'membre' ? (prenom() || 'Blackstart') + ' 2.0' : a.nom; }

  function panneau(el, o) {
    o = o || {};
    css();
    if (el.__bsas) { el.__bsas.dessiner(); return el.__bsas; }
    var ui = { menu: false };
    function choisi() {
      var l = S.liste || [];
      return assistant(S.choisi) || assistant(o.defaut || 'membre') || l[0] || null;
    }
    function dessiner() {
      if (!el.isConnected && el.__bsasVu) return false;
      el.__bsasVu = true;
      var a = choisi(), l = S.liste || [];
      if (!S.liste) { el.innerHTML = '<div class="bsas-card"><div class="bsas-tete"><span class="bsas-logo">IA</span><div class="bsas-t"><b>Assistant IA</b><span>Chargement…</span></div></div></div>'; return true; }
      if (!a) {
        el.innerHTML = '<div class="bsas-card"><div class="bsas-tete"><span class="bsas-logo">IA</span><div class="bsas-t"><b>Assistant IA</b><span>' +
          esc(S.err || (CONF ? 'Aucun assistant IA n’est ouvert à votre compte : demandez l’accès à un administrateur.' : 'L’assistant IA fonctionne avec la version en ligne du CRM.')) + '</span></div></div></div>';
        return true;
      }
      var msgs = messages(a.id), occupe = !!S.envoi[a.id];
      var intro = '<div class="bsas-bulle bsas-intro"><p>Bonjour ! Je suis ' + esc(nomCourt(a)) + ', ' + (a.id === 'membre' ? 'votre assistant IA.' : esc(a.titre.charAt(0).toLowerCase() + a.titre.slice(1)) + '.') + '<br>Je peux vous aider à :</p>' +
        (a.id === 'membre'
          ? '<ul class="bsas-aides">' + AIDES.map(function (x, i) { return '<li><button type="button" data-aide="' + i + '">' + ic('check', 15) + '<span>' + esc(x.t) + '</span></button></li>'; }).join('') + '</ul>'
          : '<p class="bsas-desc">' + esc(a.description) + '</p>') + '</div>';
      var conv = msgs.map(function (m) {
        return '<div class="bsas-bulle ' + (m.de === 'moi' ? 'moi' : 'ia') + (m.info ? ' info' : '') + '">' + (m.de === 'moi' ? '<p>' + esc(m.texte).replace(/\n/g, '<br>') + '</p>' : md(m.texte)) + '</div>';
      }).join('');
      var sugg = (!msgs.length || o.toujoursSuggestions) && a.id !== 'membre' && a.suggestions && a.suggestions.length
        ? '<div class="bsas-sugg">' + a.suggestions.map(function (s, i) { return '<button type="button" data-sugg="' + i + '">' + esc(s) + '</button>'; }).join('') + '</div>' : '';
      var menu = ui.menu ? '<div class="bsas-menu" role="menu">' + l.map(function (x) {
        return '<button type="button" role="menuitem" data-choisir="' + esc(x.id) + '" class="' + (x.id === a.id ? 'on' : '') + '"><span class="bsas-pastille c-' + esc(x.couleur) + '">' + ic(x.icone, 15) + '</span><span><b>' + esc(nomCourt(x)) + '</b><small>' + esc(x.titre) + '</small></span></button>';
      }).join('') + (o.lienPage !== false ? '<a href="#/assistants" class="bsas-menu-tout">' + ic('users', 15) + 'Toute l’équipe IA</a>' : '') + '</div>' : '';
      var garde = el.querySelector('.bsas-champ'), brouillon = garde ? garde.value : '', focus = garde && document.activeElement === garde;
      el.innerHTML = '<section class="bsas-card c-' + esc(a.couleur) + '">' +
        '<div class="bsas-tete"><span class="bsas-logo">' + (a.id === 'membre' ? 'IA' : ic(a.icone, 22)) + '</span><div class="bsas-t"><b>' + esc(titreDe(a)) + '</b><span>' + (a.id === 'membre' ? 'Votre assistant intelligent pour une prospection plus efficace.' : esc(a.titre)) + '</span></div>' +
        (l.length > 1 ? '<button type="button" class="bsas-choix" data-act="menu" aria-expanded="' + ui.menu + '" title="Changer d’assistant">' + ic('users', 15) + '<span>' + l.length + '</span>' + ic('chev-down', 14) + '</button>' : '') + menu + '</div>' +
        '<div class="bsas-fil">' + intro + conv + (occupe ? '<div class="bsas-bulle ia bsas-ecrit"><i></i><i></i><i></i></div>' : '') + '</div>' + sugg +
        '<form class="bsas-form" autocomplete="off"><input class="bsas-champ" placeholder="Posez votre question..." maxlength="2000" aria-label="Votre question à ' + esc(nomCourt(a)) + '"><button type="submit" class="bsas-go" aria-label="Envoyer"' + (occupe ? ' disabled' : '') + '>' + ic('ia-send', 17) + '</button></form>' +
        (msgs.length ? '<button type="button" class="bsas-effacer" data-act="effacer">Nouvelle conversation</button>' : '') + '</section>';
      var champ = el.querySelector('.bsas-champ');
      if (champ) { champ.value = brouillon; if (focus) champ.focus(); }
      var fil = el.querySelector('.bsas-fil'); if (fil && msgs.length) fil.scrollTop = fil.scrollHeight;
      return true;
    }
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('button,a'); if (!t || !el.contains(t)) return;
      var a = choisi(); if (!a) return;
      if (t.dataset.act === 'menu') { ui.menu = !ui.menu; dessiner(); return; }
      if (t.dataset.choisir) { S.choisi = t.dataset.choisir; ui.menu = false; try { localStorage.setItem('bs-assistants-choisi', S.choisi); } catch (e) { /* facultatif */ } dessiner(); return; }
      if (t.classList.contains('bsas-menu-tout')) { ui.menu = false; return; }
      if (t.dataset.act === 'effacer') { effacer(a.id); return; }
      if (t.dataset.sugg != null) { envoyer(a.id, a.suggestions[+t.dataset.sugg]); return; }
      if (t.dataset.aide != null) {
        var x = AIDES[+t.dataset.aide];
        if (x.act === 'session' && o.session) o.session(); else if (x.page) location.hash = '#/' + x.page;
      }
    });
    el.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var a = choisi(), champ = el.querySelector('.bsas-champ'); if (!a || !champ) return;
      var v = champ.value; champ.value = ''; envoyer(a.id, v);
    });
    document.addEventListener('pointerdown', function (ev) { if (ui.menu && !el.contains(ev.target)) { ui.menu = false; dessiner(); } });
    var api_ = { dessiner: dessiner };
    el.__bsas = api_;
    abonnes.push(dessiner);
    dessiner(); charger();
    return api_;
  }

  var cssFait = false;
  function css() {
    if (cssFait) return; cssFait = true;
    var st = document.createElement('style'); st.id = 'bs-assistants-css';
    st.textContent = [
      '.bsas-card{--c:var(--accent-rgb,56 124 213);position:relative;display:flex;flex-direction:column;gap:14px;padding:20px;border-radius:18px;border:1px solid var(--border);background:var(--surface);box-shadow:var(--shadow-sm)}',
      '.bsas-card.c-violet{--c:139 92 246}.bsas-card.c-emerald{--c:16 185 129}.bsas-card.c-orange{--c:249 115 22}.bsas-card.c-cyan{--c:6 182 212}.bsas-card.c-pink{--c:236 72 153}.bsas-card.c-amber{--c:245 158 11}.bsas-card.c-rose{--c:244 63 94}',
      '.bsas-tete{position:relative;display:flex;align-items:flex-start;gap:14px}',
      '.bsas-logo{flex:none;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:800;font-size:17px;letter-spacing:.02em;background:linear-gradient(140deg,rgb(var(--c)/1),rgb(var(--c)/.65));box-shadow:0 8px 22px -8px rgb(var(--c)/.8),inset 0 1px 0 rgb(255 255 255/.25)}',
      '.bsas-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding-top:2px}',
      '.bsas-t b{font-size:1.12em;font-weight:750;line-height:1.25}',
      '.bsas-t span{font-size:.88em;color:var(--text-2);line-height:1.4}',
      '.bsas-choix{flex:none;display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 8px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:inherit;font-size:.8em;font-weight:700;cursor:pointer}',
      '.bsas-choix:hover,.bsas-choix[aria-expanded=true]{color:var(--text);border-color:var(--border-2)}',
      '.bsas-menu{position:absolute;z-index:30;right:0;top:38px;width:290px;max-height:420px;overflow:auto;padding:6px;border-radius:14px;border:1px solid var(--border-2);background:var(--surface);box-shadow:var(--shadow-lg,0 20px 50px -12px rgb(0 0 0/.5))}',
      '.bsas-menu button,.bsas-menu a{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border:0;border-radius:10px;background:none;color:var(--text);font:inherit;text-align:left;text-decoration:none;cursor:pointer}',
      '.bsas-menu button:hover,.bsas-menu a:hover,.bsas-menu button.on{background:var(--surface-2)}',
      '.bsas-menu span:not(.bsas-pastille){display:flex;flex-direction:column;min-width:0}',
      '.bsas-menu b{font-size:.9em}.bsas-menu small{font-size:.76em;color:var(--text-3)}',
      '.bsas-menu-tout{margin-top:4px;border-top:1px solid var(--border)!important;border-radius:0 0 10px 10px!important;font-size:.86em;font-weight:650;color:var(--accent-text,var(--accent))!important}',
      '.bsas-pastille{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:#fff;background:rgb(var(--c,56 124 213))}',
      '.bsas-pastille.c-blue{--c:59 130 246}.bsas-pastille.c-violet{--c:139 92 246}.bsas-pastille.c-emerald{--c:16 185 129}.bsas-pastille.c-orange{--c:249 115 22}.bsas-pastille.c-cyan{--c:6 182 212}.bsas-pastille.c-pink{--c:236 72 153}.bsas-pastille.c-amber{--c:245 158 11}.bsas-pastille.c-rose{--c:244 63 94}',
      '.bsas-fil{display:flex;flex-direction:column;gap:10px;max-height:380px;overflow:auto;scrollbar-width:thin}',
      '.bsas-bulle{padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:var(--surface-2);font-size:.9em;line-height:1.5}',
      '.bsas-bulle p{margin:0}.bsas-bulle p+p{margin-top:6px}',
      '.bsas-bulle ul,.bsas-bulle ol{margin:6px 0 0;padding-left:20px}.bsas-bulle li+li{margin-top:3px}',
      '.bsas-bulle.moi{align-self:flex-end;max-width:88%;background:rgb(var(--c)/.9);border-color:transparent;color:#fff}',
      '.bsas-bulle.ia{align-self:flex-start;max-width:100%}',
      '.bsas-bulle.info{border-style:dashed;color:var(--text-2)}',
      '.bsas-desc{margin-top:6px!important;color:var(--text-2)}',
      '.bsas-intro .bsas-aides{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:2px}',
      '.bsas-aides button{display:flex;align-items:center;gap:9px;width:100%;padding:3px 4px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}',
      '.bsas-aides button:hover{background:rgb(var(--c)/.12)}',
      '.bsas-aides svg{flex:none;color:var(--text-2)}',
      '.bsas-ecrit{display:flex;gap:4px;align-items:center;padding:14px 16px}',
      '.bsas-ecrit i{width:6px;height:6px;border-radius:50%;background:var(--text-3);animation:bsasPoint 1s infinite ease-in-out}',
      '.bsas-ecrit i:nth-child(2){animation-delay:.15s}.bsas-ecrit i:nth-child(3){animation-delay:.3s}',
      '@keyframes bsasPoint{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}',
      '.bsas-sugg{display:flex;flex-wrap:wrap;gap:6px}',
      '.bsas-sugg button{padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:inherit;font-size:.8em;font-weight:600;cursor:pointer}',
      '.bsas-sugg button:hover{color:var(--text);border-color:rgb(var(--c)/.6)}',
      '.bsas-form{display:flex;gap:8px;align-items:center;padding:5px 5px 5px 14px;border-radius:12px;border:1px solid var(--border-2);background:var(--surface-2)}',
      '.bsas-form:focus-within{border-color:rgb(var(--c)/.7);box-shadow:0 0 0 3px rgb(var(--c)/.15)}',
      '.bsas-champ{flex:1;min-width:0;border:0;background:none;color:var(--text);font:inherit;font-size:.92em;outline:none;padding:8px 0}',
      '.bsas-champ::placeholder{color:var(--text-3)}',
      '.bsas-go{flex:none;width:38px;height:38px;border-radius:10px;border:0;display:grid;place-items:center;color:#fff;background:rgb(var(--c));cursor:pointer;box-shadow:0 6px 16px -6px rgb(var(--c)/.9)}',
      '.bsas-go:disabled{opacity:.5;cursor:default}',
      '.bsas-effacer{align-self:flex-start;margin-top:-6px;padding:0;border:0;background:none;color:var(--text-3);font:inherit;font-size:.78em;cursor:pointer}',
      '.bsas-effacer:hover{color:var(--text)}',
    ].join('\n');
    document.head.appendChild(st);
  }

  window.bsAssistants = { charger: charger, liste: function () { return S.liste; }, ia: function () { return S.ia; }, contexte: contexte, envoyer: envoyer, panneau: panneau, md: md, etat: function () { return S; } };
})();
