/* Blackstart CRM : rubrique « Téléphone » avec Ringover.
 *
 * - Le téléphone Ringover (app.ringover.com) s'ouvre dans une fenêtre flottante du CRM : on se connecte une
 *   fois avec son compte Ringover, puis on appelle sans quitter le CRM. La fenêtre reste ouverte d'une page à
 *   l'autre (un appel en cours ne coupe pas quand on change de rubrique).
 * - Un clic sur un numéro du CRM (lien tel:) appelle avec Ringover au lieu d'ouvrir le téléphone de l'appareil.
 * - Chaque appel est noté sur la fiche du prospect dont c'est le numéro (sortant, entrant, durée, sans réponse).
 * Activation par appareil (chaque membre se connecte avec sa propre ligne Ringover).
 * Même échange de messages que le SDK officiel de Ringover (github.com/ringover/ringover-sdk), en vérifiant
 * l'origine des messages et sans remplacer window.onmessage.
 */
(function () {
  'use strict';
  if (window.bsTelephone) return;

  var ORIGINE = 'https://app.ringover.com';
  var CLE = 'bs-ringover';
  var CLE_JOURNAL = 'bs-ringover-journal';
  var PAYS = [['33', 'France (+33)'], ['32', 'Belgique (+32)'], ['41', 'Suisse (+41)'], ['352', 'Luxembourg (+352)'], ['1', 'Canada (+1)'],
    ['212', 'Maroc (+212)'], ['216', 'Tunisie (+216)'], ['213', 'Algérie (+213)'], ['221', 'Sénégal (+221)'], ['225', 'Côte d’Ivoire (+225)'],
    ['261', 'Madagascar (+261)'], ['230', 'Maurice (+230)'], ['262', 'La Réunion (+262)']];

  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var pref = lire(CLE, {});
  if (typeof pref !== 'object' || !pref) pref = {};
  if (!pref.pays) pref.pays = '33';
  if (pref.clic === undefined) pref.clic = true;
  var journal = lire(CLE_JOURNAL, []);
  if (!Array.isArray(journal)) journal = [];

  var S = { charge: false, pret: false, userId: null, ouvert: false, appel: null, attente: null, notes: {} };
  var boite, cadre, bouton, titre, racine;

  // ---------------------------------------------------------------- numéros
  function chiffres(n) { return String(n || '').replace(/\D/g, ''); }
  // Numéro tel qu'écrit dans le CRM → format international (+33612345678), pays par défaut au choix.
  function e164(n) {
    var s = String(n || '').trim().replace(/[^\d+]/g, '');
    if (!s) return '';
    if (s.indexOf('00') === 0) return '+' + s.slice(2);
    if (s.charAt(0) === '+') return '+' + s.slice(1).replace(/\+/g, '');
    if (s.charAt(0) === '0') return '+' + pref.pays + s.slice(1);
    return '+' + pref.pays + s;
  }
  function memeNumero(a, b) {
    var x = chiffres(a), y = chiffres(b);
    if (x.length < 6 || y.length < 6) return false;
    var n = Math.min(9, x.length, y.length);
    return x.slice(-n) === y.slice(-n);
  }
  function prospectDe(num) {
    var R = window.__bsStore; if (!R || !R.get || !num) return null;
    var liste = R.get().prospects || [];
    for (var i = 0; i < liste.length; i++) {
      var p = liste[i];
      if (memeNumero(p.telephone, num) || memeNumero(p.mobile, num) || memeNumero(p.portable, num)) return p;
    }
    return null;
  }
  function duree(s) {
    s = Math.max(0, Math.round(Number(s) || 0));
    return s < 60 ? s + ' s' : Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0');
  }

  // ---------------------------------------------------------------- fenêtre Ringover
  var LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="11" fill="#14b8a6"/><path d="M17 13h9.5c5 0 8.5 2.9 8.5 7.4 0 3.2-1.8 5.6-4.7 6.7L36 35h-6.3l-4.8-7.3H22.6V35H17zm5.6 4.6v5.7h3.7c2 0 3.2-1.1 3.2-2.9s-1.2-2.8-3.2-2.8z" fill="#fff"/></svg>';
  var ICONE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  var CSS = '#bs-tel{position:fixed;right:20px;bottom:20px;width:380px;height:min(640px,calc(100vh - 40px));z-index:60;display:flex;flex-direction:column;border-radius:16px;overflow:hidden;background:var(--surface,#fff);border:1px solid var(--border);box-shadow:0 24px 60px -12px rgba(0,0,0,.55);transition:opacity .18s,transform .18s}' +
    '#bs-tel.ferme{opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;visibility:hidden}' +
    '#bs-tel header{display:flex;align-items:center;gap:10px;height:44px;flex:none;padding:0 8px 0 12px;border-bottom:1px solid var(--border);background:var(--surface-2)}' +
    '#bs-tel header .bstel-logo{width:24px;height:24px;border-radius:7px}#bs-tel header b{flex:1;min-width:0;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#bs-tel header button{border:0;background:none;color:var(--text-2);cursor:pointer;width:32px;height:32px;border-radius:8px;font-size:20px;line-height:1}#bs-tel header button:hover{background:var(--surface-3,rgba(127,127,127,.15))}' +
    '#bs-tel iframe{flex:1;width:100%;border:0;background:#fff}' +
    '#bs-tel-btn{position:fixed;right:20px;bottom:20px;z-index:59;width:52px;height:52px;border-radius:50%;border:0;cursor:pointer;display:none;align-items:center;justify-content:center;color:#fff;background:#14b8a6;box-shadow:0 10px 26px -8px rgba(20,184,166,.9),0 2px 6px rgba(0,0,0,.25)}' +
    '#bs-tel-btn.on{display:inline-flex}#bs-tel-btn.appel{background:#ef4444;animation:bstelpouls 1.2s infinite}#bs-tel-btn i{position:absolute;top:3px;right:3px;width:11px;height:11px;border-radius:50%;background:#f59e0b;box-shadow:0 0 0 2px var(--bg,#111)}#bs-tel-btn.pret i{background:#22c55e}' +
    '@keyframes bstelpouls{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.6)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}' +
    '@media (max-width:1023px){#bs-tel-btn{right:auto;left:16px;bottom:calc(80px + env(safe-area-inset-bottom))}#bs-tel{right:0;bottom:0;left:0;top:0;width:auto;height:auto;border-radius:0;border:0}}' +
    '.bstel-root{display:flex;flex-direction:column;gap:16px;max-width:980px}' +
    '.bstel-card{padding-bottom:16px}.bstel-card>*:not(.card-head){margin-left:18px;margin-right:18px}' +
    '.bstel-fh{display:flex;align-items:center;gap:12px}.bstel-logo{display:inline-flex;width:44px;height:44px;flex:none;border-radius:12px;overflow:hidden}.bstel-logo svg{width:100%;height:100%}' +
    '.bstel-txt{margin:0;font-size:14px;line-height:1.5;color:var(--text-2)}.bstel-txt b{color:var(--text)}' +
    '.bstel-liste{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.45;color:var(--text-2)}' +
    '.bstel-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}' +
    '.bstel-etat{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;border-radius:999px;padding:5px 12px;background:rgba(245,158,11,.12);color:#d97706}.bstel-etat.ok{background:rgba(34,197,94,.13);color:#16a34a}.bstel-etat i{width:8px;height:8px;border-radius:50%;background:currentColor}' +
    '.bstel-appeler{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.bstel-appeler .input{flex:1;min-width:220px}' +
    '.bstel-opts{display:flex;flex-direction:column;gap:10px;margin-top:6px;font-size:14px}.bstel-opts label{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.bstel-opts select{max-width:240px}' +
    '.bstel-j{display:grid;grid-template-columns:auto 1fr auto;gap:2px 12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)}.bstel-j:last-child{border-bottom:0}' +
    '.bstel-j .bstel-sens{grid-row:span 2;width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:15px;background:var(--surface-2)}' +
    '.bstel-j b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bstel-j small{grid-column:2;color:var(--text-3)}.bstel-j button{grid-row:span 2}' +
    '.bstel-vide{color:var(--text-3);font-size:14px}';
  function css() {
    if (document.getElementById('bstel-css')) return;
    var s = document.createElement('style'); s.id = 'bstel-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function poster(m) { if (cadre && cadre.contentWindow) cadre.contentWindow.postMessage(m, ORIGINE); }

  function construire() {
    css();
    if (!bouton) {
      bouton = document.createElement('button');
      bouton.id = 'bs-tel-btn'; bouton.type = 'button'; bouton.title = 'Téléphone Ringover';
      bouton.setAttribute('aria-label', 'Ouvrir le téléphone Ringover');
      bouton.innerHTML = ICONE + '<i></i>';
      bouton.addEventListener('click', function () { ouvrir(); });
      document.body.appendChild(bouton);
    }
    if (!boite) {
      boite = document.createElement('div');
      boite.id = 'bs-tel'; boite.className = 'ferme';
      boite.innerHTML = '<header><span class="bstel-logo">' + LOGO + '</span><b>Ringover</b><button type="button" data-tel="page" title="Rubrique Téléphone" aria-label="Rubrique Téléphone">⋯</button><button type="button" data-tel="fermer" title="Réduire" aria-label="Réduire">×</button></header>';
      titre = boite.querySelector('header b');
      boite.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-tel]'); if (!t) return;
        if (t.getAttribute('data-tel') === 'fermer') fermer();
        if (t.getAttribute('data-tel') === 'page') { fermer(); location.hash = '#/telephone'; }
        if (t.getAttribute('data-tel') === 'fiche' && S.appel && S.appel.prospectId) ouvrirFiche(S.appel.prospectId);
      });
      document.body.appendChild(boite);
    }
    if (!cadre) {
      cadre = document.createElement('iframe');
      cadre.title = 'Téléphone Ringover';
      cadre.allow = 'microphone; autoplay; clipboard-read; clipboard-write';
      cadre.addEventListener('load', function () { S.charge = true; setTimeout(viderAttente, 2500); });
      cadre.src = ORIGINE;
      boite.appendChild(cadre);
    }
    maj();
  }
  function detruire() {
    if (boite) boite.remove(); if (bouton) bouton.remove();
    boite = cadre = bouton = titre = null;
    S.charge = S.pret = false; S.userId = null; S.ouvert = false; S.appel = null;
  }
  function permis() { return pref.actif && (!window.bsAcces || window.bsAcces.peut('telephone')); }
  function ouvrir() { if (!permis()) return; construire(); S.ouvert = true; maj(); }
  function fermer() { S.ouvert = false; maj(); }

  function maj() {
    if (bouton) {
      bouton.classList.toggle('on', !!pref.actif && !S.ouvert && (!!S.appel || !/^#\/telephone\b/.test(location.hash || '')));
      bouton.classList.toggle('pret', S.pret);
      bouton.classList.toggle('appel', !!S.appel);
    }
    if (boite) boite.classList.toggle('ferme', !S.ouvert);
    if (titre) {
      var a = S.appel;
      titre.innerHTML = a ? esc((a.sens === 'in' ? 'Appel de ' : 'Appel vers ') + (a.nom || a.numero)) +
        (a.prospectId ? ' · <u data-tel="fiche" style="cursor:pointer;color:var(--accent)">voir la fiche</u>' : '') : 'Ringover';
    }
    rendre();
  }

  function viderAttente() {
    if (!S.attente) return;
    var n = S.attente; S.attente = null;
    poster({ action: 'dial', number: n, from_number: null });
  }
  function appeler(numero) {
    var n = e164(numero);
    if (!n || chiffres(n).length < 6) return false;
    if (!permis()) return false;
    construire(); S.ouvert = true; maj();
    if (S.pret || S.charge) poster({ action: 'dial', number: n, from_number: null });
    else S.attente = n;
    return true;
  }
  function pageRingover(p) { construire(); S.ouvert = true; maj(); poster({ action: 'changePage', page: p }); }

  function ouvrirFiche(id) {
    var Y = window.__bsY; if (!Y || !Y.set) return;
    if (S.ouvert && window.matchMedia && window.matchMedia('(max-width:1023px)').matches) fermer();
    Y.set(function (a) { return { overlays: (a.overlays || []).concat([{ key: Math.random().toString(36).slice(2), type: 'prospect', id: id }]) }; });
  }

  // ---------------------------------------------------------------- événements Ringover
  function infos(d, etat) {
    d = d || {};
    var sens = d.direction === 'in' ? 'in' : 'out';
    var numero = sens === 'in' ? d.from_number : d.to_number;
    var p = prospectDe(numero);
    return { id: d.call_id || null, sens: sens, numero: String(numero || ''), etat: etat, interne: !!d.internal,
      prospectId: p ? p.id : null, nom: p ? (p.entreprise || p.contact || '') : '' };
  }
  function noterAppel(d) {
    var a = infos(d, 'fini');
    if (a.interne) return;
    if (a.id && S.notes[a.id]) return;
    if (a.id) S.notes[a.id] = true;
    var parle = Number(d && d.callDuration) || 0;
    var texte = 'Appel Ringover ' + (a.sens === 'in' ? 'entrant' : 'sortant') + (parle > 0 ? ' · ' + duree(parle) : (a.sens === 'in' ? ' manqué' : ' sans réponse'));
    var maintenant = new Date();
    journal = [{ at: maintenant.toISOString(), sens: a.sens, numero: a.numero, nom: a.nom, prospectId: a.prospectId, duree: parle, id: a.id }].concat(journal).slice(0, 50);
    ecrire(CLE_JOURNAL, journal);
    if (!a.prospectId) return;
    try {
      var R = window.__bsStore; if (!R || !R.set) return;
      var ev = { id: Math.random().toString(36).slice(2) + Date.now().toString(36), at: maintenant.toISOString(), date: maintenant.toISOString().slice(0, 10),
        time: maintenant.toTimeString().slice(0, 5), type: 'call', text: texte, ringover: a.id || true };
      R.set(function (s) { return { prospects: s.prospects.map(function (x) { return x.id === a.prospectId ? Object.assign({}, x, { events: [ev].concat(x.events || []).slice(0, 200) }) : x; }) }; });
    } catch (e) { /* la fiche est un plus : l'appel reste dans le journal */ }
  }

  window.addEventListener('hashchange', function () { if (bouton) maj(); });

  window.addEventListener('message', function (ev) {
    if (ev.origin !== ORIGINE || !cadre || ev.source !== cadre.contentWindow) return;
    var m = ev.data;
    if (!m || typeof m !== 'object' || typeof m.action !== 'string') return;
    var d = m.data || {};
    switch (m.action) {
      case 'checkSDK': poster({ action: 'presenceSDK', location: location.origin }); break;
      case 'dialerReady': case 'login': S.pret = true; S.userId = d.userId || null; viderAttente(); maj(); break;
      case 'logout': S.pret = false; S.userId = null; maj(); break;
      case 'ringingCall': S.appel = infos(d, 'sonne'); S.ouvert = true; maj(); break;
      case 'answeredCall': S.appel = infos(d, 'en cours'); maj(); break;
      case 'hangupCall': noterAppel(d); S.appel = null; maj(); break;
      default: break;
    }
  });

  // Un clic sur un numéro du CRM appelle avec Ringover. On n'arrête pas l'événement : le CRM garde ses
  // propres réactions au clic (minuteur d'appel, résultat à noter…), seul le lien tel: est remplacé.
  document.addEventListener('click', function (ev) {
    if (!permis() || !pref.clic || ev.defaultPrevented) return;
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="tel:"]') : null;
    if (!a) return;
    var n = decodeURIComponent(a.getAttribute('href').slice(4));
    if (appeler(n)) ev.preventDefault();
  }, true);

  // ---------------------------------------------------------------- rubrique Téléphone
  function quand(iso) { try { return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function rendre() {
    if (!racine || !racine.isConnected) return;
    var act = document.activeElement, garder = act && racine.contains(act) && act.name === 'numero' ? act.value : null;
    var tete = '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Téléphone</h1><p class="page-sub">Appelez vos prospects avec Ringover sans quitter le CRM : chaque appel est noté sur la fiche.</p></div></div>';
    if (!pref.actif) {
      racine.innerHTML = tete + '<section class="card bstel-card"><header class="card-head"><div class="bstel-fh"><span class="bstel-logo">' + LOGO + '</span><div><h3 class="card-title">Ringover dans le CRM</h3><p class="card-sub">Votre ligne Ringover, directement dans le CRM.</p></div></div></header>' +
        '<ul class="bstel-liste"><li>Le téléphone Ringover s’ouvre dans une fenêtre du CRM et reste ouvert quand vous changez de page.</li>' +
        '<li>Un clic sur le numéro d’un prospect lance l’appel avec votre ligne Ringover.</li>' +
        '<li>Chaque appel (sortant, entrant, durée, sans réponse) est noté sur la fiche du prospect.</li>' +
        '<li>Quand un prospect vous appelle, son nom s’affiche avec un lien vers sa fiche.</li></ul>' +
        '<p class="bstel-txt" style="margin-top:12px">Il faut un compte Ringover. Vous vous connectez une seule fois dans la fenêtre Ringover, sur chaque ordinateur ou téléphone.</p>' +
        '<div class="bstel-act"><button type="button" class="btn btn-primary" data-act="activer">Activer Ringover sur cet appareil</button>' +
        '<a class="btn btn-ghost" href="https://www.ringover.com/fr" target="_blank" rel="noopener">Découvrir Ringover</a></div></section>';
      return;
    }
    var R = window.__bsStore, prospects = R && R.get ? (R.get().prospects || []).filter(function (p) { return p.telephone; }) : [];
    var etat = S.pret ? '<span class="bstel-etat ok"><i></i>Connecté à Ringover</span>' : '<span class="bstel-etat"><i></i>' + (S.charge ? 'Connectez-vous dans la fenêtre Ringover' : 'Ouverture de Ringover…') + '</span>';
    racine.innerHTML = tete +
      '<section class="card bstel-card"><header class="card-head"><div class="bstel-fh"><span class="bstel-logo">' + LOGO + '</span><div><h3 class="card-title">Ringover</h3><p class="card-sub">' + etat + '</p></div></div></header>' +
      '<div class="bstel-act" style="margin-top:0"><button type="button" class="btn btn-primary" data-act="ouvrir">Ouvrir le téléphone</button>' +
      '<button type="button" class="btn btn-secondary" data-act="historique">Historique Ringover</button><button type="button" class="btn btn-secondary" data-act="sms">SMS</button></div>' +
      '<form class="bstel-appeler" data-appeler><input class="input" name="numero" list="bstel-prospects" placeholder="Numéro ou nom d’un prospect" autocomplete="off">' +
      '<datalist id="bstel-prospects">' + prospects.slice(0, 400).map(function (p) { return '<option value="' + esc(p.telephone) + '">' + esc(p.entreprise || p.contact || '') + '</option>'; }).join('') + '</datalist>' +
      '<button type="submit" class="btn btn-primary">Appeler</button></form>' +
      (S.pret ? '' : '<p class="bstel-txt" style="margin-top:12px">Première fois : ouvrez le téléphone et connectez-vous avec votre compte Ringover. Si la fenêtre reste blanche, autorisez le micro et les cookies pour ringover.com dans votre navigateur, puis cliquez sur « Recharger ».</p>') +
      '</section>' +
      '<section class="card bstel-card"><header class="card-head"><div><h3 class="card-title">Derniers appels depuis le CRM</h3><p class="card-sub">Sur cet appareil. Les appels avec un prospect sont aussi notés sur sa fiche.</p></div></header>' +
      (journal.length ? '<div>' + journal.slice(0, 15).map(function (j, i) {
        return '<div class="bstel-j"><span class="bstel-sens" title="' + (j.sens === 'in' ? 'Entrant' : 'Sortant') + '">' + (j.sens === 'in' ? '↙' : '↗') + '</span>' +
          '<b>' + esc(j.nom || j.numero) + '</b><button type="button" class="btn btn-ghost btn-sm" data-rappel="' + i + '">Rappeler</button>' +
          '<small>' + esc((j.nom ? j.numero + ' · ' : '') + quand(j.at) + ' · ' + (j.duree > 0 ? duree(j.duree) : (j.sens === 'in' ? 'manqué' : 'sans réponse'))) + '</small></div>';
      }).join('') + '</div>' : '<p class="bstel-vide">Aucun appel pour l’instant. Cliquez sur le numéro d’un prospect pour l’appeler.</p>') +
      '</section>' +
      '<section class="card bstel-card"><header class="card-head"><div><h3 class="card-title">Réglages sur cet appareil</h3></div></header><div class="bstel-opts">' +
      '<label><input type="checkbox" data-opt="clic"' + (pref.clic ? ' checked' : '') + '> Un clic sur un numéro du CRM appelle avec Ringover</label>' +
      '<label>Numéros écrits sans indicatif : <select class="input" data-opt="pays">' + PAYS.map(function (p) { return '<option value="' + p[0] + '"' + (pref.pays === p[0] ? ' selected' : '') + '>' + p[1] + '</option>'; }).join('') + '</select></label>' +
      '</div><div class="bstel-act"><button type="button" class="btn btn-ghost btn-sm" data-act="recharger">Recharger Ringover</button><button type="button" class="btn btn-ghost btn-sm" data-act="desactiver">Désactiver sur cet appareil</button></div></section>';
    if (garder !== null) { var i = racine.querySelector('[name=numero]'); if (i) { i.value = garder; i.focus(); } }
  }

  function brancher(el) {
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-act],[data-rappel]'); if (!t) return;
      if (t.hasAttribute('data-rappel')) { var j = journal[Number(t.getAttribute('data-rappel'))]; if (j) appeler(j.numero); return; }
      var a = t.getAttribute('data-act');
      if (a === 'activer') { pref.actif = true; ecrire(CLE, pref); ouvrir(); }
      if (a === 'ouvrir') ouvrir();
      if (a === 'historique') pageRingover('call-logs');
      if (a === 'sms') pageRingover('sms');
      if (a === 'recharger') { if (cadre) { S.charge = S.pret = false; cadre.src = ORIGINE; } ouvrir(); }
      if (a === 'desactiver') { pref.actif = false; ecrire(CLE, pref); detruire(); rendre(); }
    });
    el.addEventListener('change', function (ev) {
      var o = ev.target.getAttribute && ev.target.getAttribute('data-opt'); if (!o) return;
      if (o === 'clic') pref.clic = !!ev.target.checked;
      if (o === 'pays') pref.pays = ev.target.value;
      ecrire(CLE, pref);
    });
    el.addEventListener('submit', function (ev) {
      if (!ev.target.hasAttribute('data-appeler')) return;
      ev.preventDefault();
      var v = ev.target.numero.value.trim();
      if (!/\d{6}/.test(chiffres(v))) {
        var p = (window.__bsStore && window.__bsStore.get().prospects || []).filter(function (x) { return x.telephone && (x.entreprise || '').toLowerCase().indexOf(v.toLowerCase()) >= 0; })[0];
        v = p ? p.telephone : '';
      }
      if (v) { appeler(v); ev.target.numero.value = ''; }
    });
  }

  function monter(el) {
    if (!el) return;
    css();
    if (el === racine && el.__bsTel) { rendre(); return; }
    racine = el; el.__bsTel = true; el.classList.add('bstel-root');
    brancher(el);
    if (permis()) construire();
    rendre();
  }

  // Le téléphone se charge dès l'ouverture du CRM sur un appareil où Ringover est activé (appels entrants).
  function demarrer() { if (permis()) construire(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
  // Accès retiré par l'administrateur : le téléphone disparaît ; rendu : il revient.
  window.addEventListener('bs:acces-change', function () { if (!permis()) { if (!S.appel) detruire(); } else if (!cadre) construire(); });

  window.bsTelephone = { monter: monter, appeler: appeler, ouvrir: ouvrir, fermer: fermer, e164: e164, memeNumero: memeNumero, _etat: S };
})();
