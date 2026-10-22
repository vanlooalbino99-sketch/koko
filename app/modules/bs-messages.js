/* Blackstart CRM : rubrique « Messages » (menu › Équipe), version équipe uniquement.
 *
 * - Conversation « Équipe » (tout le monde), groupes (nom + membres choisis) et messages directs.
 * - Temps réel par un flux SSE (/api/chat/flux) : messages, non-lus, présence, visios en cours.
 * - Visio de réunion en WebRTC, de navigateur à navigateur (maillage : chacun envoie son image aux autres,
 *   pensé pour de petites équipes). Micro, caméra, partage d'écran ; la fenêtre se réduit pour continuer
 *   à travailler dans le CRM pendant la réunion.
 * - Trois entrées dans le menu (section « Équipe ») : Messages (Équipe + messages directs), Groupes et Visio
 *   (salle de réunion). Compteurs : window.__bsY.bsMsg, bsGrp (non-lus) et bsVisio (visios en cours).
 * - Un message ou une visio
 *   qui arrive ailleurs dans le CRM s'annonce par une petite carte en bas de l'écran.
 */
(function () {
  'use strict';
  if (window.bsMessages) return;

  var API = '/api/chat';
  var serveur = function () { return !!window.BS_SERVER; };
  var S = {
    pret: false, err: '', me: null, users: [], online: [], convs: {}, msgs: {}, more: {}, chargement: {},
    actif: null, root: null, mobileListe: true, filtre: '', brouillons: {}, modal: null,
    mode: 'messages', dernier: {}, ecrit: {}, ecritEnvoi: 0, envois: {}, emojis: false, reagir: null, reagirTout: false, postes: [], // rubrique affichée (messages, groupes, visio) et dernière conversation ouverte dans chacune
  };
  var es = null;

  // ------------------------------------------------------------------ outils
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // Icônes absentes de l'interface et de la bibliothèque (tracés Lucide).
  var EXTRA = {
    micOff: '<path d="m2 2 20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M12 19v3"/>',
    videoOff: '<path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.25-3.06a.5.5 0 0 1 .75.43v8.2"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/>',
    maximize: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
    minimize: '<path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="m14 10 7-7"/><path d="m3 21 7-7"/>',
    organi: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/>',
    trombone: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    sourire: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
    doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    telecharger: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    chevG: '<path d="m15 18-6-6 6-6"/>',
    chevD: '<path d="m9 18 6-6-6-6"/>',
    lecture: '<polygon points="7 4 20 12 7 20 7 4" fill="currentColor"/>',
    note: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  };
  // Sélecteur d'émojis : une sélection courante, par thème.
  var EMOJIS = [
    ['Smileys', '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😎 🤩 🥳 🤗 🤔 🤨 😐 😶 🙄 😏 😬 😌 😴 🤤 😷 🤒 🤯 😳 🥺 😢 😭 😤 😡 🤬 😱 😨 😰 🙃 🤫 🤭 🫡'],
    ['Gestes', '👍 👎 👌 ✌️ 🤞 🤝 🙏 👏 🙌 💪 👋 🤙 👉 👈 👆 👇 ✋ 🫶 ✍️ 👀'],
    ['Cœurs', '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💯 💥 ✨ ⭐ 🌟 🔥 💫'],
    ['Travail', '✅ ☑️ ❌ ⚠️ ❗ ❓ 📌 📎 📝 📄 📊 📈 📉 💼 📅 📆 ⏰ ⏳ 📞 ☎️ 📱 💻 🖥️ 📧 📩 💡 🔔 🔑 🔒 🏆 🎯 🚀 💰 💶 💳 🧾 🏠 🏢 🔧 🛠️'],
    ['Fête', '🎉 🎊 🎁 🥂 🍾 🍕 ☕ 🍰 🌞 🌈 ⚡ 🌍'],
  ];
  function ic(name, size) {
    var lib = EXTRA[name] || (window.bsIcones && window.bsIcones.svg(name));
    var hs = window.__bsHs ? window.__bsHs() : null;
    var inner = (hs && hs[name]) || lib || '';
    return '<svg class="ic" width="' + (size || 16) + '" height="' + (size || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  function api(method, path, body) {
    var o = { method: method, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } };
    if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
    return fetch(API + path, o).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) throw new Error(b.error || 'Erreur du serveur.');
        return b;
      });
    });
  }
  function user(id) { for (var i = 0; i < S.users.length; i++) if (S.users[i].id === id) return S.users[i]; return null; }
  function posteDe(id) { var u = user(id); return (u && u.poste) || ''; }
  function nomDe(id) { var u = user(id); return u ? u.name : 'Ancien membre'; }
  function initiales(n) { return String(n || '?').trim().split(/\s+/).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase(); }
  function teinte(id) { var h = 0, s = String(id || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function avatar(id, nom, cls) {
    var on = S.online.indexOf(id) >= 0, u = id && user(id);
    var photo = u && u.photo ? ';--ph:url(&quot;/api/photos/' + encodeURIComponent(id) + '?v=' + encodeURIComponent(u.photo) + '&quot;)' : '';
    return '<span class="bsm-av ' + (photo ? 'ph ' : '') + (cls || '') + '" style="--h:' + teinte(id) + photo + '">' + (photo ? '' : esc(initiales(nom))) + (id ? '<i class="bsm-pres' + (on ? ' on' : '') + '" title="' + (on ? 'En ligne' : 'Hors ligne') + '"></i>' : '') + '</span>';
  }
  function autre(c) { return (c.members || []).filter(function (x) { return x !== S.me; })[0]; }
  function titre(c) { return c.kind === 'equipe' ? 'Équipe' : c.kind === 'direct' ? nomDe(autre(c)) : c.name; }
  function convIcon(c) {
    if (c.kind === 'direct') { var o = autre(c); return avatar(o, nomDe(o)); }
    if (c.kind === 'groupe' && c.photo) return '<span class="bsm-av ph gph" style="--ph:url(&quot;' + esc(photoGroupe(c)) + '&quot;)" role="img" aria-label="' + esc(c.name) + '"></span>';
    return '<span class="bsm-av bsm-av-grp ' + (c.kind === 'equipe' ? 'eq' : '') + '" style="--h:' + teinte(c.id) + '">' + ic(c.kind === 'equipe' ? 'users' : 'hash', 17) + '</span>';
  }
  function photoGroupe(c) { return API + '/groupes/' + encodeURIComponent(c.id) + '/photo?v=' + encodeURIComponent(c.photo); }
  // Image de groupe : recadrée au carré et réduite à 320 px dans le navigateur (le serveur ne garde qu'une petite image).
  function reduireImage(file) {
    return new Promise(function (ok, ko) {
      if (!file || !/^image\//.test(file.type)) { ko(new Error('Choisissez une image (JPEG, PNG…).')); return; }
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var t = Math.min(img.naturalWidth, img.naturalHeight), cv = document.createElement('canvas');
        cv.width = cv.height = 320;
        cv.getContext('2d').drawImage(img, (img.naturalWidth - t) / 2, (img.naturalHeight - t) / 2, t, t, 0, 0, 320, 320);
        URL.revokeObjectURL(url);
        ok(cv.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('Cette image ne peut pas être lue : essayez une photo JPEG ou PNG.')); };
      img.src = url;
    });
  }
  function peutSupprimer(m) { return m.userId === S.me || !!(window.BS_SERVER && window.BS_SERVER.user && window.BS_SERVER.user.role === 'admin'); }
  function supprimerMessage(id) {
    var c = S.convs[S.actif]; if (!c) return;
    if (!confirm('Supprimer ce message pour tout le monde ?')) return;
    api('DELETE', '/conversations/' + encodeURIComponent(c.id) + '/messages/' + encodeURIComponent(id)).then(function () { retirerMessage(c.id, Number(id)); })
      .catch(function (e) { carte({ titre: 'Suppression impossible', sous: e.message, icone: 'info', bouton: 'OK', action: function () {}, force: true }); });
  }
  // Réactions : une palette rapide (comme sur iPhone) et toute la liste d'émojis ; le même emoji une seconde fois retire la réaction.
  var REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉'];
  function trouverMessage(cid, id) {
    var arr = S.msgs[cid] || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }
  function reagir(id, emoji) {
    var c = S.convs[S.actif]; if (!c) return;
    var m = trouverMessage(c.id, Number(id)); if (!m) return;
    var avant = m.reactions || [];
    // Affichage immédiat, corrigé par la réponse du serveur.
    var apres = avant.map(function (r) { return { emoji: r.emoji, userIds: r.userIds.slice() }; });
    var g = apres.filter(function (r) { return r.emoji === emoji; })[0];
    if (g && g.userIds.indexOf(S.me) >= 0) g.userIds.splice(g.userIds.indexOf(S.me), 1);
    else if (g) g.userIds.push(S.me);
    else apres.push({ emoji: emoji, userIds: [S.me] });
    m.reactions = apres.filter(function (r) { return r.userIds.length; });
    S.reagir = null; S.reagirTout = false; rendre();
    // Une réaction d'un autre membre arrivée entre-temps (temps réel) est plus récente que cette réponse.
    var v = m.reactionsV = (m.reactionsV || 0) + 1;
    api('POST', '/conversations/' + encodeURIComponent(c.id) + '/messages/' + encodeURIComponent(m.id) + '/reactions', { emoji: emoji })
      .then(function (r) { if (m.reactionsV === v) { m.reactions = r.reactions || []; rendre(); } })
      .catch(function (e) { m.reactions = avant; rendre(); carte({ titre: 'Réaction impossible', sous: e.message, icone: 'info', bouton: 'OK', action: function () {}, force: true }); });
  }
  function reactionRecue(x) {
    var m = trouverMessage(x.conversationId, x.id);
    if (!m) return;
    var avant = {};
    (m.reactions || []).forEach(function (r) { avant[r.emoji] = r.userIds; });
    m.reactions = x.reactions || [];
    m.reactionsV = (m.reactionsV || 0) + 1;
    // Quelqu'un réagit à l'un de vos messages : petite bannière, sans son.
    if (m.userId === S.me) m.reactions.forEach(function (r) {
      r.userIds.forEach(function (uid) {
        if (uid === S.me || (avant[r.emoji] || []).indexOf(uid) >= 0) return;
        var c = S.convs[x.conversationId];
        carte({ titre: nomDe(uid) + ' a réagi ' + r.emoji, sous: resume(m) || 'à votre message', avatar: uid, bouton: 'Ouvrir', force: true, action: function () { if (c) aller(c.id); } });
      });
    });
    rendre();
  }
  function reactionsHtml(m) {
    var list = (m.reactions || []).filter(function (r) { return r.userIds && r.userIds.length; });
    if (!list.length) return '';
    return '<div class="bsm-reacs">' + list.map(function (r) {
      var moi = r.userIds.indexOf(S.me) >= 0;
      var noms = r.userIds.map(function (id) { return id === S.me ? 'Vous' : nomDe(id); }).join(', ');
      return '<button type="button" class="bsm-reac' + (moi ? ' on' : '') + '" data-reagir="' + esc(r.emoji) + '" data-mid="' + m.id + '" title="' + esc(noms) + (moi ? ' (cliquez pour retirer)' : '') + '" aria-label="' + esc(r.emoji + ' : ' + noms) + '">' +
        '<span>' + esc(r.emoji) + '</span>' + (r.userIds.length > 1 ? '<b>' + r.userIds.length + '</b>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function paletteHtml(m) {
    if (S.reagir !== m.id) return '';
    var miens = {};
    (m.reactions || []).forEach(function (r) { if (r.userIds.indexOf(S.me) >= 0) miens[r.emoji] = 1; });
    var bouton = function (e) { return '<button type="button" class="' + (miens[e] ? 'on' : '') + '" data-reagir="' + esc(e) + '" data-mid="' + m.id + '" aria-label="Réagir ' + esc(e) + '">' + esc(e) + '</button>'; };
    if (S.reagirTout) {
      return '<div class="bsm-palette tout" role="dialog" aria-label="Choisir une réaction">' + EMOJIS.map(function (g) {
        return '<div class="bsm-emo-g"><span>' + esc(g[0]) + '</span><div>' + g[1].split(' ').map(bouton).join('') + '</div></div>';
      }).join('') + '</div>';
    }
    return '<div class="bsm-palette" role="menu" aria-label="Réagir à ce message">' + REACTIONS.map(bouton).join('') +
      '<button type="button" class="plus" data-act="reactions-tout" title="Plus d’émojis" aria-label="Plus d’émojis">' + ic('plus', 16) + '</button></div>';
  }
  function retirerMessage(cid, id) {
    var arr = S.msgs[cid];
    if (arr) for (var i = arr.length - 1; i >= 0; i--) if (arr[i].id === id) arr.splice(i, 1);
    rendre();
  }
  function heure(iso) { var d = new Date(iso); return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  function jour(iso) {
    var d = new Date(iso), t = new Date(), y = new Date(); y.setDate(t.getDate() - 1);
    var same = function (a, b) { return a.toDateString() === b.toDateString(); };
    if (same(d, t)) return 'Aujourd’hui';
    if (same(d, y)) return 'Hier';
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function quand(iso) {
    if (!iso) return '';
    var d = new Date(iso), t = new Date();
    if (d.toDateString() === t.toDateString()) return heure(iso);
    if ((t - d) < 6 * 864e5) return d.toLocaleDateString('fr-FR', { weekday: 'short' });
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  function texte(body) {
    // Texte échappé, liens http(s) cliquables, retours à la ligne gardés.
    return esc(body).replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)'"]/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + '</a>'; }).replace(/\n/g, '<br>');
  }
  function resume(m) { return m.body || (m.file ? '📎 ' + m.file.name : ''); }
  function taillef(n) { return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko'; }
  function genre(mime) {
    mime = String(mime || '');
    return /^image\/(jpeg|png|gif|webp)$/.test(mime) ? 'image' : /^video\//.test(mime) ? 'video' : /^audio\//.test(mime) ? 'audio' : mime === 'application/pdf' ? 'pdf' : 'autre';
  }
  // Pièce jointe dans le fil : un clic l'ouvre en grand dans la visionneuse (data-voir).
  function piece(f) {
    if (!f) return '';
    var url = API + '/fichiers/' + encodeURIComponent(f.id), g = genre(f.mime), voir = ' data-voir="' + esc(f.id) + '"';
    if (g === 'image') return '<a class="bsm-img" href="' + url + '"' + voir + ' aria-label="Voir l’image ' + esc(f.name) + ' en grand"><img src="' + url + '" alt="' + esc(f.name) + '" loading="lazy"></a>';
    if (g === 'video') return '<a class="bsm-img bsm-vid" href="' + url + '"' + voir + ' aria-label="Lire la vidéo ' + esc(f.name) + '"><video src="' + url + '#t=0.1" preload="metadata" muted playsinline></video><span class="bsm-play">' + ic('lecture', 22) + '</span></a>';
    var ext = (f.name.split('.').pop() || '').slice(0, 4).toUpperCase();
    return '<a class="bsm-doc" href="' + url + (g === 'pdf' || g === 'audio' ? '' : '?telecharger') + '"' + voir + '>' +
      '<span class="bsm-doc-ic">' + ic(g === 'audio' ? 'note' : 'doc', 18) + '<i>' + esc(ext) + '</i></span><span class="bsm-doc-t"><b>' + esc(f.name) + '</b><small>' + taillef(f.size) + '</small></span>' + ic(g === 'autre' ? 'telecharger' : 'maximize', 16) + '</a>';
  }

  // ------------------------------------------------------------------ visionneuse des pièces jointes
  // Photo (clic pour zoomer), vidéo, son et PDF s'ouvrent en grand ; les autres fichiers se téléchargent d'ici.
  // Flèches, boutons ou balayage pour passer aux autres pièces jointes de la conversation ; Échap ou le fond pour fermer.
  var Vue = (function () {
    var el = null, liste = [], i = 0, avant = null, x0 = null;
    function pieces() {
      return ((S.actif && S.msgs[S.actif]) || []).filter(function (m) { return m.file; }).map(function (m) { return { f: m.file, auteur: m.author, at: m.at }; });
    }
    function contenu(f) {
      var url = API + '/fichiers/' + encodeURIComponent(f.id), g = genre(f.mime);
      if (g === 'image') return '<img class="bsv-img" src="' + url + '" alt="' + esc(f.name) + '" data-vue="zoom">';
      if (g === 'video') return '<video class="bsv-media" src="' + url + '" controls autoplay playsinline></video>';
      if (g === 'audio') return '<div class="bsv-carte">' + ic('note', 54) + '<b>' + esc(f.name) + '</b><audio src="' + url + '" controls autoplay></audio></div>';
      if (g === 'pdf') return '<iframe class="bsv-pdf" src="' + url + '" title="' + esc(f.name) + '"></iframe>';
      return '<div class="bsv-carte">' + ic('doc', 54) + '<b>' + esc(f.name) + '</b><small>' + taillef(f.size) + '</small><p>Pas d’aperçu pour ce type de fichier.</p>' +
        '<a class="btn btn-primary btn-md" href="' + url + '?telecharger" download="' + esc(f.name) + '">' + ic('telecharger', 16) + 'Télécharger</a></div>';
    }
    function arreter() { if (el) [].forEach.call(el.querySelectorAll('video,audio'), function (m) { try { m.pause(); } catch (e) {} }); }
    function rendu() {
      var p = liste[i], f = p.f, url = API + '/fichiers/' + encodeURIComponent(f.id);
      arreter();
      el.classList.remove('zoom');
      el.innerHTML = '<div class="bsv-haut"><div class="bsv-titre"><b>' + esc(f.name) + '</b><small>' + esc([p.auteur, jour(p.at) + ' ' + heure(p.at), taillef(f.size)].filter(Boolean).join(' · ')) +
        (liste.length > 1 ? ' · ' + (i + 1) + ' / ' + liste.length : '') + '</small></div>' +
        '<a class="bsv-btn" href="' + url + '?telecharger" download="' + esc(f.name) + '" title="Télécharger" aria-label="Télécharger">' + ic('telecharger', 20) + '</a>' +
        '<button type="button" class="bsv-btn" data-vue="fermer" title="Fermer (Échap)" aria-label="Fermer">' + ic('x', 22) + '</button></div>' +
        '<div class="bsv-scene" data-vue="fond">' + contenu(f) + '</div>' +
        (liste.length > 1 ? '<button type="button" class="bsv-nav prec" data-vue="prec" aria-label="Pièce jointe précédente"' + (i ? '' : ' disabled') + '>' + ic('chevG', 28) + '</button>' +
          '<button type="button" class="bsv-nav suiv" data-vue="suiv" aria-label="Pièce jointe suivante"' + (i < liste.length - 1 ? '' : ' disabled') + '>' + ic('chevD', 28) + '</button>' : '');
      el.querySelector('[data-vue="fermer"]').focus();
    }
    function aller(d) { var j = i + d; if (j < 0 || j >= liste.length) return; i = j; rendu(); }
    function fermer() {
      if (!el || el.hidden) return;
      arreter(); el.innerHTML = ''; el.hidden = true;
      document.documentElement.classList.remove('bsv-ouverte');
      if (avant && avant.focus) try { avant.focus(); } catch (e) {}
    }
    function creer() {
      el = document.createElement('div');
      el.className = 'bsv'; el.hidden = true;
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Pièce jointe');
      document.body.appendChild(el);
      el.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-vue]'), a = t && t.getAttribute('data-vue');
        if (a === 'fermer' || (a === 'fond' && ev.target === t)) fermer();
        else if (a === 'prec') aller(-1);
        else if (a === 'suiv') aller(1);
        else if (a === 'zoom') el.classList.toggle('zoom');
      });
      document.addEventListener('keydown', function (ev) {
        if (!el || el.hidden) return;
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); fermer(); }
        else if (ev.key === 'ArrowLeft' && !/^(VIDEO|AUDIO)$/.test(ev.target.tagName)) aller(-1);
        else if (ev.key === 'ArrowRight' && !/^(VIDEO|AUDIO)$/.test(ev.target.tagName)) aller(1);
        else if (ev.key === 'Tab') {
          var f = [].filter.call(el.querySelectorAll('a[href],button:not([disabled]),video,audio,iframe'), function (n) { return n.offsetParent !== null; });
          if (!f.length) return;
          if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
          else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); }
          else if (!el.contains(document.activeElement)) { ev.preventDefault(); f[0].focus(); }
        }
      }, true);
      el.addEventListener('touchstart', function (ev) { x0 = ev.touches.length === 1 && !el.classList.contains('zoom') ? ev.touches[0].clientX : null; }, { passive: true });
      el.addEventListener('touchend', function (ev) {
        if (x0 == null) return;
        var dx = ev.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 60) aller(dx < 0 ? 1 : -1);
      }, { passive: true });
    }
    function ouvrir(id) {
      liste = pieces();
      i = -1;
      liste.forEach(function (p, k) { if (p.f.id === id) i = k; });
      if (i < 0) return false;
      avant = document.activeElement;
      if (!el) creer();
      el.hidden = false;
      document.documentElement.classList.add('bsv-ouverte');
      rendu();
      return true;
    }
    return { ouvrir: ouvrir, fermer: fermer, ouverte: function () { return !!el && !el.hidden; } };
  })();
  var MAX_FICHIER = 10 * 1024 * 1024;
  function envoyerFichiers(files) {
    var c = S.convs[S.actif];
    if (!c) return;
    [].slice.call(files || []).forEach(function (f) {
      if (f.size > MAX_FICHIER) { carte({ titre: 'Fichier trop lourd', sous: f.name + ' dépasse 10 Mo.', icone: 'info', bouton: 'OK', action: function () {}, force: true }); return; }
      var nom = f.name || ('image-' + new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-') + '.png');
      var liste_ = S.envois[c.id] || (S.envois[c.id] = []);
      liste_.push(nom); rendre(true);
      var fin = function () { liste_.splice(liste_.indexOf(nom), 1); };
      fetch(API + '/conversations/' + encodeURIComponent(c.id) + '/fichiers?nom=' + encodeURIComponent(nom) + '&type=' + encodeURIComponent(f.type || 'application/octet-stream'), {
        method: 'POST', credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/octet-stream' }, body: f,
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw new Error(b.error || 'Envoi impossible.'); return b; }); })
        .then(function (b) { fin(); recu(b.message); envoye(c, b.message); })
        .catch(function (e) { fin(); rendre(); carte({ titre: 'Envoi impossible', sous: nom + ' : ' + e.message, icone: 'info', bouton: 'OK', action: function () {}, force: true }); });
    });
  }
  function liste() {
    var arr = Object.keys(S.convs).map(function (k) { return S.convs[k]; });
    arr.sort(function (a, b) {
      if (a.kind === 'equipe') return -1; if (b.kind === 'equipe') return 1;
      return String((b.last && b.last.at) || b.createdAt).localeCompare(String((a.last && a.last.at) || a.createdAt));
    });
    return arr;
  }
  function modeDe(c) { return c.kind === 'groupe' ? 'groupes' : 'messages'; }
  function totalNonLus() { return liste().reduce(function (n, c) { return n + (c.unread || 0); }, 0); }
  function majBadge() {
    var n = totalNonLus(), msg = 0, grp = 0, vis = 0;
    liste().forEach(function (c) {
      if (c.kind === 'groupe') grp += c.unread || 0; else msg += c.unread || 0;
      if (c.call && c.call.length && c.call.indexOf(S.me) < 0) vis++;
    });
    if (window.__bsY) {
      var cur = window.__bsY.get();
      if ((cur.bsMsg || 0) !== msg || (cur.bsGrp || 0) !== grp || (cur.bsVisio || 0) !== vis) window.__bsY.set({ bsMsg: msg, bsGrp: grp, bsVisio: vis });
    }
    var base = document.title.replace(/^\(\d+\)\s*/, '');
    document.title = n ? '(' + n + ') ' + base : base;
  }
  function visible() { return S.root && document.body.contains(S.root) && !document.hidden; }

  // ------------------------------------------------------------------ données et temps réel
  function charger() {
    return api('GET', '').then(function (b) {
      S.me = b.me; S.users = b.users; S.online = b.online; S.convs = {}; S.postes = b.postes || [];
      b.conversations.forEach(function (c) { S.convs[c.id] = c; });
      S.pret = true; S.err = '';
      choisirActif();
      majBadge(); rendre();
      if (visible() && S.actif) ouvrir(S.actif, true);
    }).catch(function (e) { S.err = e.message; rendre(); });
  }
  function demarrer() {
    if (!serveur() || es) return;
    charger();
    Sonnerie.charger();
    window.addEventListener('bs:acces-change', function () {
      if (Appel.conv && window.bsAcces && !window.bsAcces.peut('visio')) Appel.quitter();
      charger();
    });
    es = new EventSource(API + '/flux');
    var premier = true;
    es.addEventListener('pret', function (e) {
      S.online = JSON.parse(e.data).online;
      if (!premier) charger(); // reconnexion : on resynchronise tout
      premier = false;
    });
    es.addEventListener('presence', function (e) { S.online = JSON.parse(e.data).online; rendre(); });
    es.addEventListener('conversation', function (e) {
      var c = JSON.parse(e.data), nouveau = !S.convs[c.id];
      S.convs[c.id] = c; majBadge(); rendre();
      if (nouveau && c.kind === 'groupe' && c.createdBy !== S.me) carte({ titre: 'Nouveau groupe : ' + titre(c), sous: 'Vous faites maintenant partie de ce groupe.', icone: 'users', bouton: 'Ouvrir', action: function () { aller(c.id); } });
    });
    es.addEventListener('retire', function (e) {
      var id = JSON.parse(e.data).conversationId;
      delete S.convs[id]; delete S.msgs[id];
      if (S.actif === id) { S.actif = null; S.mobileListe = true; choisirActif(); }
      if (Appel.conv === id) Appel.quitter();
      majBadge(); rendre();
    });
    es.addEventListener('message', function (e) { recu(JSON.parse(e.data)); });
    es.addEventListener('supprime', function (e) { var x = JSON.parse(e.data); retirerMessage(x.conversationId, x.id); });
    es.addEventListener('reaction', function (e) { reactionRecue(JSON.parse(e.data)); });
    es.addEventListener('equipe', function () { charger(); });
    es.addEventListener('profil', function (e) { profil(JSON.parse(e.data)); });
    es.addEventListener('ecrit', function (e) { quelquUnEcrit(JSON.parse(e.data)); });
    es.addEventListener('call', function (e) {
      var x = JSON.parse(e.data), c = S.convs[x.conversationId];
      if (c) c.call = x.participants;
      Appel.evenement(x);
      majBadge();
      if (x.joined && x.joined !== S.me && x.participants.length === 1 && Appel.conv !== x.conversationId && c) {
        var k = carte({ titre: nomDe(x.joined) + ' a lancé une visio', sous: titre(c), icone: 'video', bouton: 'Rejoindre', sonne: true,
          action: function () { Appel.rejoindre(c.id); }, ferme: function () { Sonnerie.stop(c.id); } });
        Sonnerie.start(c.id, nomDe(x.joined) + ' vous appelle en visio', titre(c), k);
      }
      // Appel terminé, ou rejoint depuis un autre onglet : la sonnerie s'arrête.
      if (!x.participants.length || x.participants.indexOf(S.me) >= 0) Sonnerie.stop(x.conversationId);
      rendre();
    });
    es.addEventListener('signal', function (e) { Appel.signal(JSON.parse(e.data)); });
    // Accès changés par un administrateur : menu et pages appliqués par bs-acces.js.
    es.addEventListener('acces', function (e) {
      try { window.dispatchEvent(new CustomEvent('bs:acces', { detail: JSON.parse(e.data) })); } catch (er) { /* ignoré */ }
    });
    es.onerror = function () { /* EventSource se reconnecte seul */ };
  }
  // Conversation affichée en arrivant dans une rubrique : la dernière ouverte, sinon la plus récente.
  function choisirActif() {
    if (S.mode === 'visio') return;
    var cur = S.convs[S.actif];
    if (cur && modeDe(cur) === S.mode) return;
    var d = S.convs[S.dernier[S.mode]];
    var l = liste().filter(function (c) { return modeDe(c) === S.mode; });
    S.actif = d ? d.id : (l[0] ? l[0].id : null);
  }
  function recu(m) {
    var c = S.convs[m.conversationId];
    if (!c) { charger(); return; }
    if (S.ecrit[m.conversationId]) delete S.ecrit[m.conversationId][m.userId];
    var arr = S.msgs[m.conversationId];
    if (arr && !arr.some(function (x) { return x.id === m.id; })) arr.push(m);
    c.last = m;
    var lu = S.mode !== 'visio' && S.actif === m.conversationId && visible();
    if (m.userId === S.me) c.unread = 0;
    else if (lu) marquerLu(c);
    else if (m.kind === 'texte') {
      c.unread = (c.unread || 0) + 1;
      // Comme sur iPhone : bannière dès que le message arrive ailleurs que dans la conversation ouverte,
      // même dans Messages ; onglet en arrière-plan : notification du système, bannière au retour.
      var tN = m.author + (c.kind === 'direct' ? '' : ' · ' + titre(c));
      carte({ titre: tN, sous: resume(m), avatar: m.userId, bouton: 'Ouvrir', force: true, son: true, action: function () { aller(c.id); } });
      if (document.hidden) Sonnerie.systeme(tN, resume(m), 'bsm-msg-' + c.id, function () { aller(c.id); });
    }
    majBadge(); rendre(lu);
  }
  // « En train d'écrire » : trois points animés sous les messages, comme sur un téléphone.
  var ECRIT_MS = 5000;
  function quelquUnEcrit(x) {
    if (x.userId === S.me) return;
    var parConv = S.ecrit[x.conversationId] || (S.ecrit[x.conversationId] = {});
    clearTimeout(parConv[x.userId]);
    parConv[x.userId] = setTimeout(function () { delete parConv[x.userId]; majEcrit(); }, ECRIT_MS);
    majEcrit();
  }
  function quiEcrit(cid) { return Object.keys(S.ecrit[cid] || {}); }
  function bulleEcrit(cid) {
    var ids = quiEcrit(cid);
    if (!ids.length) return '';
    var noms = ids.map(function (id) { return nomDe(id).split(' ')[0]; });
    var dit = noms.length > 2 ? noms.length + ' personnes écrivent' : noms.join(' et ') + (noms.length > 1 ? ' écrivent' : ' écrit');
    return '<div class="bsm-msg bsm-ecrit" title="' + esc(dit) + '…">' + avatar(ids[0], nomDe(ids[0])) +
      '<div class="bsm-bulle" role="status" aria-label="' + esc(dit) + '"><span class="bsm-dots"><i></i><i></i><i></i></span></div></div>';
  }
  function majEcrit() {
    var box = S.root && S.root.querySelector('.bsm-scroll');
    if (!box || S.mode === 'visio') return;
    var enBas = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    var old = box.querySelector('.bsm-ecrit');
    if (old) old.remove();
    var html = S.actif ? bulleEcrit(S.actif) : '';
    if (html) box.insertAdjacentHTML('beforeend', html);
    if (enBas) box.scrollTop = box.scrollHeight;
  }
  function jEcris(t) {
    if (!S.actif || !t.value.trim() || Date.now() - S.ecritEnvoi < 2500) return;
    S.ecritEnvoi = Date.now();
    api('POST', '/conversations/' + encodeURIComponent(S.actif) + '/ecrit', {}).catch(function () {});
  }
  function profil(x) { var u = user(x.userId); if (u && u.photo !== x.photo) { u.photo = x.photo; rendre(); } }
  window.addEventListener('bs:profil', function (e) { profil(e.detail); });
  function marquerLu(c) {
    if (!c || !c.unread && c.lastRead >= ((c.last && c.last.id) || 0)) return;
    c.unread = 0;
    api('POST', '/conversations/' + encodeURIComponent(c.id) + '/lu', {}).catch(function () {});
    majBadge();
  }
  function ouvrir(id, silencieux) {
    var c = S.convs[id];
    if (!c) return;
    S.actif = id; S.dernier[modeDe(c)] = id;
    if (!S.msgs[id] && !S.chargement[id]) {
      S.chargement[id] = true;
      api('GET', '/conversations/' + encodeURIComponent(id) + '/messages').then(function (b) {
        S.msgs[id] = b.messages; S.more[id] = b.more; S.chargement[id] = false;
        rendre(true);
      }).catch(function (e) { S.chargement[id] = false; S.err = e.message; rendre(); });
    }
    marquerLu(c);
    if (!silencieux) rendre(true);
  }
  function plusAnciens() {
    var id = S.actif, arr = S.msgs[id];
    if (!arr || !arr.length || S.chargement[id]) return;
    S.chargement[id] = true;
    var box = S.root && S.root.querySelector('.bsm-scroll'), h0 = box ? box.scrollHeight : 0;
    api('GET', '/conversations/' + encodeURIComponent(id) + '/messages?before=' + arr[0].id).then(function (b) {
      S.msgs[id] = b.messages.concat(arr); S.more[id] = b.more; S.chargement[id] = false;
      rendre();
      var bx = S.root && S.root.querySelector('.bsm-scroll');
      if (bx) bx.scrollTop = bx.scrollHeight - h0;
    }).catch(function () { S.chargement[id] = false; });
  }
  function envoyer(txt) {
    var c = S.convs[S.actif];
    if (!c || !txt.trim()) return;
    S.brouillons[c.id] = ''; S.ecritEnvoi = 0; S.emojis = false;
    api('POST', '/conversations/' + encodeURIComponent(c.id) + '/messages', { body: txt }).then(function (b) { recu(b.message); envoye(c, b.message); })
      .catch(function (e) { S.brouillons[c.id] = txt; S.err = e.message; rendre(); });
  }
  // Bannière iPhone aussi à l'envoi : « Message envoyé », destinataire, texte, petit son « swoosh ».
  function envoye(c, m) {
    if (!m) return;
    var dest = c.kind === 'direct' ? autre(c) : null;
    carte({ titre: 'Message envoyé · À ' + titre(c), sous: resume(m), avatar: dest, envoye: true, duree: 3500, force: true,
      bouton: 'Ouvrir', action: function () { aller(c.id); } });
    Sonnerie.envoi();
  }
  function aller(id) {
    var c = S.convs[id];
    if (!c) return;
    var mode = modeDe(c);
    S.actif = id; S.dernier[mode] = id; S.mobileListe = false;
    if (location.hash !== '#/' + mode) location.hash = '#/' + mode;
    else { S.mode = mode; ouvrir(id); }
  }

  // ------------------------------------------------------------------ cartes de notification
  // Bannière façon iPhone (iOS) : descend du haut de l'écran, verre dépoli, photo de l'expéditeur avec la petite
  // icône de l'app, « maintenant » à droite, deux lignes de texte. Un clic ouvre, un glissé vers le haut la ferme,
  // les plus anciennes s'empilent derrière. Une visio qui sonne affiche les boutons rouge et vert d'un appel.
  var APP_IC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M7.2 4.5h5.6c2.6 0 4.2 1.3 4.2 3.4 0 1.4-.8 2.5-2 2.9 1.6.4 2.6 1.6 2.6 3.2 0 2.4-1.8 3.9-4.7 3.9H7.2zm3 5.5h2.1c1.1 0 1.7-.5 1.7-1.4s-.6-1.4-1.7-1.4h-2.1zm0 5.2h2.5c1.2 0 1.9-.5 1.9-1.5s-.7-1.5-1.9-1.5h-2.5z"/></svg>';
  var OK_IC = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M6 12.5l4 4 8-9"/></svg>';
  var enAttente = [];
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || !enAttente.length) return;
    var l = enAttente.splice(0); l.slice(-3).forEach(function (o, i) { setTimeout(function () { carte(o); }, i * 350); });
  });
  function carte(o) {
    if (visible() && !o.force) { if (o.icone !== 'video') return null; }
    if (document.hidden && !o.sonne) { if (!o.envoye) enAttente.push(o); return { fermer: function () {} }; }
    ensureCss();
    if (o.son) Sonnerie.message();
    var wrap = document.getElementById('bsm-cartes');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'bsm-cartes'; wrap.setAttribute('role', 'status'); wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    var el = document.createElement('div');
    el.className = 'bsm-carte' + (o.sonne ? ' sonne' : '') + (o.envoye ? ' envoye' : '');
    el.setAttribute('role', 'button'); el.tabIndex = 0;
    var titreTxt = String(o.titre || ''), groupe = '';
    var sep = titreTxt.indexOf(' · '); if (sep > 0) { groupe = titreTxt.slice(sep + 3); titreTxt = titreTxt.slice(0, sep); }
    var badge = o.envoye ? '<i class="app ok">' + OK_IC + '</i>' : '<i class="app">' + APP_IC + '</i>';
    var icone = o.avatar ? '<span class="bsm-ios-ic pers">' + avatar(o.avatar, nomDe(o.avatar)) + badge + '</span>'
      : '<span class="bsm-ios-ic app' + (o.sonne ? ' vert' : '') + '">' + (o.sonne ? ic('video', 20) : APP_IC) + (o.envoye ? badge : '') + '</span>';
    el.innerHTML = icone +
      '<div class="bsm-ios-t"><div class="l1"><b>' + esc(titreTxt) + '</b><time>' + (o.envoye ? 'Distribué' : 'maintenant') + '</time></div>' +
      (groupe ? '<div class="l2">' + esc(groupe) + '</div>' : '') +
      '<div class="l3">' + esc(String(o.sous || '').slice(0, 180)) + '</div></div>' +
      (o.sonne ? '<div class="bsm-ios-appel"><button type="button" class="non" aria-label="Refuser">' + ic('x', 20) + '</button>' +
        '<button type="button" class="oui" aria-label="' + esc(o.bouton || 'Rejoindre') + '">' + ic('video', 20) + '</button></div>' : '');
    el.setAttribute('aria-label', titreTxt + (groupe ? ', ' + groupe : '') + ' : ' + (o.sous || ''));
    var minuteur = null, reste = o.duree || (o.icone === 'video' ? 30000 : 6000), depart = 0;
    var fermer = function (haut) {
      if (el.classList.contains('out')) return;
      clearTimeout(minuteur);
      el.style.transform = ''; el.classList.add('out'); if (haut) el.classList.add('haut');
      setTimeout(function () { el.remove(); empiler(wrap); }, 320);
      if (o.ferme) o.ferme();
    };
    var lancer = function () { depart = Date.now(); minuteur = setTimeout(fermer, reste); };
    el.addEventListener('mouseenter', function () { clearTimeout(minuteur); reste = Math.max(1500, reste - (Date.now() - depart)); });
    el.addEventListener('mouseleave', lancer);
    var ouvrir = function () { fermer(true); o.action(); };
    el.addEventListener('click', function (e) {
      if (el.__glisse) { el.__glisse = false; return; }
      if (e.target.closest('.non')) { fermer(true); return; }
      ouvrir();
    });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); } else if (e.key === 'Escape') fermer(true); });
    // Glisser vers le haut pour fermer, comme sur iPhone.
    var g = null;
    el.addEventListener('pointerdown', function (e) { if (e.button === 0 && !e.target.closest('button')) g = { y: e.clientY, id: e.pointerId, dy: 0 }; });
    el.addEventListener('pointermove', function (e) {
      if (!g || e.pointerId !== g.id) return;
      g.dy = e.clientY - g.y;
      if (Math.abs(g.dy) < 4) return;
      try { el.setPointerCapture(e.pointerId); } catch (x) { /* relâché */ }
      el.classList.add('tire');
      el.style.transform = 'translateY(' + (g.dy < 0 ? g.dy : Math.sqrt(g.dy) * 3) + 'px)';
    });
    var lacher = function (e) {
      if (!g || e.pointerId !== g.id) return;
      var dy = g.dy; g = null; el.classList.remove('tire');
      if (Math.abs(dy) >= 4) el.__glisse = true;
      if (dy < -24) fermer(true); else el.style.transform = '';
    };
    el.addEventListener('pointerup', lacher); el.addEventListener('pointercancel', lacher);
    wrap.insertBefore(el, wrap.firstChild);
    while (wrap.children.length > 4) wrap.lastChild.remove();
    empiler(wrap);
    lancer();
    return { fermer: fermer };
  }
  // La plus récente devant ; les autres dépassent juste en dessous, plus petites (pile de notifications iOS).
  function empiler(wrap) {
    [].slice.call(wrap.children).filter(function (x) { return !x.classList.contains('out'); }).forEach(function (x, i) {
      x.style.setProperty('--rang', i); x.classList.toggle('derriere', i > 0); x.style.zIndex = 10 - i;
    });
  }

  // ------------------------------------------------------------------ sonnerie d'appel visio
  // Deux notes douces répétées (synthétisées, sans fichier son) pendant 30 s au plus, et une notification
  // du système quand l'onglet est en arrière-plan. Le son a besoin d'un premier clic dans la page (règle des navigateurs).
  var Sonnerie = (function () {
    var ctx = null, en = {};
    function audio() {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!ctx && Ctx) try { ctx = new Ctx(); } catch (e) { ctx = null; }
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(function () {});
      return ctx;
    }
    ['pointerdown', 'keydown'].forEach(function (t) {
      window.addEventListener(t, function deb() {
        audio();
        if (window.Notification && Notification.permission === 'default' && S.pret) Notification.requestPermission().catch(function () {});
        window.removeEventListener(t, deb, true);
      }, true);
    });
    // Une note : fréquence f, durée d, forme d'onde, volume relatif ; f2 fait glisser la note.
    function note(a, t, f, d, type, vol, f2) {
      var o = a.createOscillator(), g = a.createGain(), v = 0.18 * (vol || 1) * VOL[volume()];
      if (v <= 0) return;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d * 0.8);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + 0.05);
    }
    // Sonneries au choix (Réglages › Équipe & compte), toutes synthétisées ici.
    var SONS = {
      carillon: { nom: 'Carillon', jouer: function (a, t) { [0, 0.75].forEach(function (x) { note(a, t + x, 880, 0.35); note(a, t + x + 0.18, 1318.5, 0.5); }); } },
      aurore: { nom: 'Aurore', jouer: function (a, t) { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { note(a, t + i * 0.14, f, 0.9, 'sine', 0.8); }); } },
      marimba: { nom: 'Marimba', jouer: function (a, t) { [659.25, 783.99, 659.25, 987.77, 880].forEach(function (f, i) { note(a, t + i * 0.16, f, 0.28, 'triangle', 1.3); note(a, t + i * 0.16, f * 4, 0.06, 'sine', 0.25); }); } },
      classique: { nom: 'Téléphone classique', jouer: function (a, t) { [0, 0.5].forEach(function (x) { note(a, t + x, 440, 0.4, 'sine', 0.6); note(a, t + x, 480, 0.4, 'sine', 0.6); }); } },
      pulse: { nom: 'Pulsation', jouer: function (a, t) { [0, 0.22, 0.44].forEach(function (x) { note(a, t + x, 740, 0.16, 'square', 0.3); }); } },
      bulles: { nom: 'Bulles', jouer: function (a, t) { [0, 0.2, 0.4].forEach(function (x, i) { note(a, t + x, 400 + i * 150, 0.18, 'sine', 1, 900 + i * 250); }); } },
      cristal: { nom: 'Cristal', jouer: function (a, t) { [1567.98, 2093, 1567.98, 2637].forEach(function (f, i) { note(a, t + i * 0.2, f, 0.6, 'sine', 0.55); }); } },
      silence: { nom: 'Aucun son (notification seule)', jouer: function () {} },
    };
    var VOL = { faible: 0.4, normal: 1, fort: 1.8 };
    function lire(k, def) { try { return localStorage.getItem(k) || def; } catch (e) { return def; } }
    function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
    function choix() { var c = lire('bsm-sonnerie', 'carillon'); return SONS[c] ? c : 'carillon'; }
    function volume() { var v = lire('bsm-sonnerie-volume', 'normal'); return VOL[v] ? v : 'normal'; }
    function sonner(id) {
      var a = audio(); if (!a || a.state !== 'running') return;
      SONS[id || choix()].jouer(a, a.currentTime + 0.02);
    }

    // Sons personnels : un fichier son (MP3…) choisi par le membre sur son ordinateur, gardé sur le serveur
    // pour son compte (/api/sons), qui remplace le son du CRM pour la visio entrante, le message reçu ou envoyé.
    var PERSO = { visio: 'Visio entrante', recu: 'Message reçu', envoye: 'Message envoyé' };
    var perso = {};
    function entetes() { return { credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } }; }
    function chargerPerso() {
      if (!serveur()) return Promise.resolve();
      return fetch('/api/sons', entetes()).then(function (r) { return r.ok ? r.json() : { sons: [] }; }).then(function (b) {
        var neuf = {};
        return Promise.all((b.sons || []).map(function (x) {
          var deja = perso[x.sorte];
          if (deja && deja.maj === x.maj) { neuf[x.sorte] = deja; return null; }
          return fetch('/api/sons/' + x.sorte + '?v=' + encodeURIComponent(x.maj), entetes())
            .then(function (r) { return r.ok ? r.arrayBuffer() : null; })
            .then(function (ab) { if (ab) neuf[x.sorte] = { nom: x.nom, maj: x.maj, octets: ab }; });
        })).then(function () { perso = neuf; });
      }).catch(function () { /* hors ligne : sons du CRM */ });
    }
    function decoder(a, octets) {
      return new Promise(function (ok, ko) {
        try {
          var p = a.decodeAudioData(octets.slice(0), ok, ko);
          if (p && p.then) p.then(ok, ko);
        } catch (e) { ko(e); }
      });
    }
    function tampon(k) {
      var p = perso[k], a = audio();
      if (!p || !a) return Promise.resolve(null);
      if (!p.dec) p.dec = decoder(a, p.octets).then(function (b) { p.buf = b; return b; }, function () { return null; });
      return p.dec;
    }
    // Joue le son personnel k (s'il existe) ; renvoie de quoi l'arrêter, ou null s'il n'y en a pas.
    function jouerPerso(k, o) {
      var a = audio();
      if (!perso[k] || !a || a.state !== 'running') return null;
      var h = { src: null, fini: false, stop: function () { h.fini = true; if (h.src) try { h.src.stop(); } catch (e) { /* déjà arrêté */ } } };
      tampon(k).then(function (b) {
        if (!b || h.fini) return;
        var src = a.createBufferSource(), g = a.createGain();
        src.buffer = b; src.loop = !!(o && o.boucle);
        g.gain.value = 0.9 * VOL[volume()];
        src.connect(g); g.connect(a.destination);
        src.start();
        if (o && o.max) src.stop(a.currentTime + o.max);
        h.src = src;
      });
      return h;
    }
    function televerser(k, file) {
      if (!PERSO[k]) return Promise.reject(new Error('Son inconnu.'));
      if (!file) return Promise.reject(new Error('Aucun fichier choisi.'));
      if (file.size > 3 * 1024 * 1024) return Promise.reject(new Error('Fichier trop lourd : 3 Mo au plus (un son de quelques secondes suffit).'));
      var type = file.type || (/\.mp3$/i.test(file.name) ? 'audio/mpeg' : /\.m4a$/i.test(file.name) ? 'audio/mp4' : /\.wav$/i.test(file.name) ? 'audio/wav' : /\.ogg$/i.test(file.name) ? 'audio/ogg' : '');
      if (!/^audio\//.test(type)) return Promise.reject(new Error('Choisissez un fichier son (MP3, M4A, WAV ou OGG).'));
      var a = audio();
      return file.arrayBuffer().then(function (ab) {
        // Vérifié avant l'envoi : le navigateur doit savoir le lire.
        return (a ? decoder(a, ab) : Promise.resolve(null)).then(function () { return ab; }, function () { throw new Error('Ce fichier ne se lit pas comme un son. Essayez un MP3.'); });
      }).then(function (ab) {
        return fetch('/api/sons/' + k + '?nom=' + encodeURIComponent(file.name || 'son'), {
          method: 'PUT', credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': type }, body: ab,
        });
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw new Error(b.error || 'Envoi impossible.'); return b; }); })
        .then(chargerPerso);
    }
    function retirer(k) {
      return fetch('/api/sons/' + k, { method: 'DELETE', credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart' } })
        .then(function (r) { if (!r.ok) throw new Error('Suppression impossible.'); delete perso[k]; });
    }
    function stop(cid) {
      var x = en[cid]; if (!x) return;
      delete en[cid];
      clearInterval(x.boucle); clearTimeout(x.fin);
      if (x.perso) x.perso.stop();
      try { if (x.notif) x.notif.close(); } catch (e) { /* déjà fermée */ }
      if (x.carte) x.carte.fermer();
    }
    function start(cid, titreN, sous, carte) {
      stop(cid);
      var x = en[cid] = { carte: carte };
      x.perso = jouerPerso('visio', { boucle: true, max: 30 });
      if (!x.perso) { sonner(); x.boucle = setInterval(sonner, 3000); }
      x.fin = setTimeout(function () { stop(cid); }, 30000);
      try {
        if (window.Notification && Notification.permission === 'granted' && document.hidden) {
          x.notif = new Notification(titreN, { body: sous + ' · cliquez pour rejoindre', tag: 'bsm-visio-' + cid, requireInteraction: true });
          x.notif.onclick = function () { window.focus(); stop(cid); Appel.rejoindre(cid); };
        }
      } catch (e) { /* notifications indisponibles */ }
    }
    // Son de message (trois notes cristallines, dans l'esprit du « tri-tone » de l'iPhone), au volume choisi ;
    // aucun si la sonnerie est réglée sur « Aucun son ». Pas plus d'un toutes les 1,5 s.
    var dernierDing = 0;
    function message(test) {
      if (!test && Date.now() - dernierDing < 1500) return;
      if (!test && jouerPerso('recu', { max: 8 })) { dernierDing = Date.now(); return; }
      if (choix() === 'silence' && !test) return;
      var a = audio(); if (!a || a.state !== 'running') return;
      dernierDing = Date.now();
      var t = a.currentTime + 0.02;
      [[1318.5, 0], [1046.5, 0.13], [1567.98, 0.26]].forEach(function (n) { note(a, t + n[1], n[0], 0.32, 'sine', 0.55); note(a, t + n[1], n[0] * 2, 0.12, 'sine', 0.12); });
    }
    // Son d'envoi : un « swoosh » court qui monte, comme l'envoi d'un iMessage ; même réglage de volume.
    var dernierEnvoi = 0;
    function envoi(test) {
      if (!test && Date.now() - dernierEnvoi < 600) return;
      if (!test && jouerPerso('envoye', { max: 6 })) { dernierEnvoi = Date.now(); return; }
      if (choix() === 'silence' && !test) return;
      var a = audio(); if (!a || a.state !== 'running') return;
      dernierEnvoi = Date.now();
      var t = a.currentTime + 0.01;
      note(a, t, 520, 0.22, 'sine', 0.45, 1560); note(a, t + 0.02, 1040, 0.16, 'sine', 0.12, 2600);
    }
    function systeme(titreN, corps, tag, action) {
      try {
        if (!window.Notification || Notification.permission !== 'granted') return;
        var n = new Notification(titreN, { body: corps, tag: tag });
        n.onclick = function () { window.focus(); n.close(); action(); };
      } catch (e) { /* notifications indisponibles */ }
    }
    return {
      start: start, stop: stop, message: message, envoi: envoi, systeme: systeme,
      sons: function () { return Object.keys(SONS).map(function (k) { return { id: k, nom: SONS[k].nom }; }); },
      choix: choix, volume: volume,
      choisir: function (id) { if (SONS[id]) ecrire('bsm-sonnerie', id); },
      regler: function (v) { if (VOL[v]) ecrire('bsm-sonnerie-volume', v); },
      ecouter: function (id) { audio(); setTimeout(function () { sonner(id); }, 30); },
      // Sons personnels (Réglages) : liste, envoi d'un fichier, retrait, écoute (le sien ou celui du CRM).
      perso: function () { return Object.keys(PERSO).map(function (k) { return { id: k, nom: PERSO[k], fichier: perso[k] ? perso[k].nom : '' }; }); },
      charger: chargerPerso, televerser: televerser, retirer: retirer,
      ecouterPerso: function (k) {
        audio();
        setTimeout(function () {
          if (perso[k]) jouerPerso(k, { max: 8 });
          else if (k === 'visio') sonner();
          else if (k === 'recu') message(true);
          else envoi(true);
        }, 30);
      },
    };
  })();

  // ------------------------------------------------------------------ rendu
  function rendre(enBas) {
    var root = S.root;
    if (!root || !document.body.contains(root)) return;
    ensureCss();
    if (!serveur()) {
      root.innerHTML = '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Messages</h1><p class="page-sub">Discutez et faites vos réunions en visio avec l’équipe, sans quitter le CRM.</p></div></div>' +
        '<section class="card bsm-vide">' + ic('message-circle', 28) + '<h2>Disponible dans la version équipe</h2><p>La messagerie et la visio relient les membres d’une même équipe : elles fonctionnent quand le CRM est ouvert depuis le serveur de l’équipe, avec un compte.</p></section>';
      return;
    }
    if (!S.pret) {
      root.innerHTML = '<div class="bsm-shell card">' + (S.err ? '<div class="bsm-vide">' + ic('info', 24) + '<p>' + esc(S.err) + '</p><button class="btn btn-secondary btn-sm" data-act="recharger">Réessayer</button></div>' : '<div class="bsm-vide"><span class="bsm-spin"></span><p>Chargement des conversations…</p></div>') + '</div>';
      return;
    }
    var box = root.querySelector('.bsm-scroll');
    var etaitEnBas = !box || box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    var garde = box ? box.scrollTop : 0;
    var champ = root.querySelector('.bsm-input');
    var focus = champ && document.activeElement === champ;
    if (champ && S.actif) S.brouillons[S.actif] = champ.value;
    var filtreFocus = document.activeElement && document.activeElement.name === 'bsm-filtre';

    if (S.mode === 'visio') {
      root.innerHTML = rendreSalle() + (S.modal ? rendreModal() : '');
      if (S.modal && S.modal.type === 'organigramme') { orgBrancher(root); orgAppliquer(root); }
      return;
    }
    var c = S.convs[S.actif];
    root.innerHTML = '<div class="bsm-shell card' + (S.mobileListe ? ' liste' : ' fil') + '">' + rendreListe() + (c ? rendreFil(c) : rendreAucun()) + '</div>' + (S.modal ? rendreModal() : '');

    var nb = root.querySelector('.bsm-scroll');
    if (nb) nb.scrollTop = (enBas || etaitEnBas) ? nb.scrollHeight : garde;
    var nc = root.querySelector('.bsm-input');
    if (nc) { nc.value = S.brouillons[S.actif] || ''; taille(nc); if (focus) nc.focus(); }
    if (filtreFocus) { var f = root.querySelector('[name=bsm-filtre]'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); }
    var mi = root.querySelector('.bsm-modal input[autofocus]'); if (mi && !root.__modalFocus) { mi.focus(); root.__modalFocus = true; }
    if (!S.modal) root.__modalFocus = false;
    if (S.modal && S.modal.type === 'organigramme') { orgBrancher(root); orgAppliquer(root); }
  }
  function rendreListe() {
    var q = S.filtre.toLowerCase();
    var items = liste().filter(function (c) { return modeDe(c) === S.mode && (!q || titre(c).toLowerCase().indexOf(q) >= 0); });
    var grp = S.mode === 'groupes';
    var ligne = function (c) {
      var l = c.last, apercu = l ? (l.kind === 'texte' ? (l.userId === S.me ? 'Vous : ' : (c.kind === 'direct' ? '' : l.author.split(' ')[0] + ' : ')) + resume(l) : l.body) : (c.kind === 'direct' ? 'Démarrez la conversation' : 'Aucun message');
      var live = c.call && c.call.length;
      return '<button type="button" class="bsm-conv' + (c.id === S.actif ? ' on' : '') + (c.unread ? ' nl' : '') + '" data-conv="' + esc(c.id) + '">' + convIcon(c) +
        '<span class="bsm-conv-t"><span class="bsm-conv-l1"><b>' + esc(titre(c)) + '</b><time>' + esc(quand(l && l.at)) + '</time></span>' +
        '<span class="bsm-conv-l2"><span>' + (live ? '<em class="bsm-live">' + ic('video', 12) + ' Visio en cours</em>' : esc(apercu)) + '</span>' + (c.unread ? '<i class="bsm-nl">' + c.unread + '</i>' : '') + '</span></span></button>';
    };
    var sec = function (titreSec, arr) { return arr.length ? '<div class="bsm-sec">' + titreSec + '</div>' + arr.map(ligne).join('') : ''; };
    var eq = items.filter(function (c) { return c.kind === 'equipe'; }), gr = items.filter(function (c) { return c.kind === 'groupe'; }), di = items.filter(function (c) { return c.kind === 'direct'; });
    var enLigne = S.users.filter(function (u) { return u.id !== S.me && S.online.indexOf(u.id) >= 0; });
    return '<aside class="bsm-side"><div class="bsm-side-head"><div><h1 class="page-title">' + (grp ? 'Groupes' : 'Messages') + '</h1><p class="page-sub">' + (grp ? gr.length + ' groupe' + (gr.length > 1 ? 's' : '') : enLigne.length ? enLigne.length + ' en ligne' : 'Personne en ligne') + '</p></div>' +
      '<div class="bsm-side-act">' + (grp ? '<button type="button" class="btn btn-primary btn-sm" data-act="groupe">' + ic('plus', 14) + 'Nouveau groupe</button>'
        : '<button type="button" class="btn btn-primary btn-sm" data-act="direct">' + ic('plus', 14) + 'Nouveau message</button>') +
        '<button type="button" class="icon-btn" data-act="organigramme" title="Organigramme de l’équipe" aria-label="Organigramme de l’équipe">' + ic('organi', 18) + '</button></div></div>' +
      '<label class="bsm-search">' + ic('search', 15) + '<input name="bsm-filtre" placeholder="' + (grp ? 'Rechercher un groupe' : 'Rechercher une conversation') + '" value="' + esc(S.filtre) + '" autocomplete="off"></label>' +
      (enLigne.length && !grp ? '<div class="bsm-online">' + enLigne.map(function (u) { return '<button type="button" data-dm="' + esc(u.id) + '" title="Écrire à ' + esc(u.name) + (u.poste ? ' (' + esc(u.poste) + ')' : '') + '">' + avatar(u.id, u.name) + '<span>' + esc(u.name.split(' ')[0]) + '</span></button>'; }).join('') + '</div>' : '') +
      '<nav class="bsm-convs">' + sec('Équipe', eq) + sec(grp ? 'Vos groupes' : 'Groupes', gr) + sec('Messages directs', di) +
      (items.length ? '' : '<p class="bsm-rien">' + (q ? 'Aucun résultat.' : grp ? 'Aucun groupe pour l’instant.' : 'Aucune conversation.') + '</p>') + '</nav></aside>';
  }
  function rendreFil(c) {
    var arr = S.msgs[c.id];
    var membres = c.kind === 'equipe' ? S.users.map(function (u) { return u.id; }) : (c.members || []);
    var sous = c.kind === 'direct' ? (posteDe(autre(c)) ? posteDe(autre(c)) + ' · ' : '') + (S.online.indexOf(autre(c)) >= 0 ? 'En ligne' : 'Hors ligne') : membres.length + ' membre' + (membres.length > 1 ? 's' : '');
    var live = c.call && c.call.length, dedans = Appel.conv === c.id;
    var head = '<header class="bsm-head"><button type="button" class="icon-btn bsm-back" data-act="retour" aria-label="Retour aux conversations">' + ic('chevronLeft', 20) + '</button>' + convIcon(c) +
      '<div class="bsm-head-t"><b>' + esc(titre(c)) + '</b><span>' + esc(sous) + '</span></div>' +
      '<div class="bsm-stack">' + membres.slice(0, 5).map(function (id) { return avatar(id, nomDe(id), 'xs'); }).join('') + (membres.length > 5 ? '<span class="bsm-av xs plus">+' + (membres.length - 5) + '</span>' : '') + '</div>' +
      (dedans ? '<button type="button" class="btn btn-secondary btn-md" data-act="agrandir">' + ic('video', 16) + '<span class="btn-label">Retour à la visio</span></button>'
        : '<button type="button" class="btn ' + (live ? 'btn-success' : 'btn-primary') + ' btn-md bsm-visio" data-act="visio">' + ic('video', 16) + '<span class="btn-label">' + (live ? 'Rejoindre la visio (' + c.call.length + ')' : 'Visio') + '</span></button>') +
      (c.kind === 'groupe' ? '<button type="button" class="icon-btn" data-act="reglages" title="Réglages du groupe" aria-label="Réglages du groupe">' + ic('settings', 18) + '</button>' : '') + '</header>';
    var corps;
    if (!arr) corps = '<div class="bsm-vide"><span class="bsm-spin"></span></div>';
    else if (!arr.length) corps = '<div class="bsm-vide bsm-debut">' + convIcon(c) + '<h2>' + esc(titre(c)) + '</h2><p>' + (c.kind === 'direct' ? 'Début de votre conversation avec ' + esc(titre(c)) + '.' : 'Écrivez le premier message, ou lancez une visio pour une réunion.') + '</p></div>';
    else {
      var html = [], prev = null, prevJour = '';
      if (S.more[c.id]) html.push('<div class="bsm-more"><button type="button" class="btn btn-ghost btn-sm" data-act="plus">' + (S.chargement[c.id] ? 'Chargement…' : 'Messages précédents') + '</button></div>');
      arr.forEach(function (m) {
        var j = jour(m.at);
        if (j !== prevJour) { html.push('<div class="bsm-jour"><span>' + esc(j) + '</span></div>'); prevJour = j; prev = null; }
        if (m.kind !== 'texte') {
          html.push('<div class="bsm-info' + (m.kind === 'visio' ? ' visio' : '') + '">' + ic(m.kind === 'visio' ? 'video' : 'info', 13) + '<span>' + esc(m.body) + ' · ' + heure(m.at) + '</span>' +
            (m.kind === 'visio' && live && !dedans ? '<button type="button" class="btn btn-success btn-sm" data-act="visio">Rejoindre</button>' : '') + '</div>');
          prev = null; return;
        }
        var moi = m.userId === S.me;
        var suite = prev && prev.userId === m.userId && (new Date(m.at) - new Date(prev.at)) < 5 * 60000;
        html.push('<div class="bsm-msg' + (moi ? ' moi' : '') + (suite ? ' suite' : '') + '" data-mid="' + m.id + '">' + (moi ? '' : (suite ? '<span class="bsm-av-sp"></span>' : avatar(m.userId, m.author))) +
          '<div class="bsm-col">' + paletteHtml(m) + '<div class="bsm-bulle">' + (suite || moi || c.kind === 'direct' ? '' : '<b class="bsm-auteur" style="--h:' + teinte(m.userId) + '">' + esc(m.author) + (posteDe(m.userId) ? '<small>' + esc(posteDe(m.userId)) + '</small>' : '') + '</b>') +
          piece(m.file) + (m.body ? '<div class="bsm-txt">' + texte(m.body) + '</div>' : '') + '<time>' + heure(m.at) + '</time></div>' + reactionsHtml(m) + '</div>' +
          '<button type="button" class="bsm-reag' + (S.reagir === m.id ? ' on' : '') + '" data-reag="' + m.id + '" title="Réagir" aria-label="Réagir à ce message" aria-expanded="' + (S.reagir === m.id) + '">' + ic('sourire', 15) + '</button>' +
          (peutSupprimer(m) ? '<button type="button" class="bsm-suppr" data-suppr="' + m.id + '" title="Supprimer ce message" aria-label="Supprimer ce message">' + ic('trash', 15) + '</button>' : '') + '</div>');
        prev = m;
      });
      corps = html.join('');
    }
    if (arr) corps += bulleEcrit(c.id);
    var envois = (S.envois[c.id] || []).map(function (n) { return '<div class="bsm-envoi"><span class="bsm-spin"></span>Envoi de « ' + esc(n) + ' »…</div>'; }).join('');
    var foot = envois + '<form class="bsm-compose" autocomplete="off">' +
      '<button type="button" class="bsm-outil' + (S.emojis ? ' on' : '') + '" data-act="emojis" title="Émojis" aria-label="Émojis" aria-expanded="' + !!S.emojis + '">' + ic('sourire', 19) + '</button>' +
      '<button type="button" class="bsm-outil" data-act="joindre" title="Joindre un fichier (10 Mo au plus)" aria-label="Joindre un fichier">' + ic('trombone', 19) + '</button>' +
      '<input type="file" class="bsm-fichier" multiple hidden>' +
      (S.emojis ? '<div class="bsm-emojis" role="dialog" aria-label="Émojis">' + EMOJIS.map(function (g) {
        return '<div class="bsm-emo-t">' + g[0] + '</div><div class="bsm-emo-g">' + g[1].split(' ').map(function (e) { return '<button type="button" data-emoji="' + e + '">' + e + '</button>'; }).join('') + '</div>';
      }).join('') + '</div>' : '') +
      '<textarea class="bsm-input" rows="1" maxlength="4000" placeholder="Écrire à ' + esc(titre(c)) + '…" aria-label="Message"></textarea>' +
      '<button type="submit" class="bsm-send" aria-label="Envoyer">' + ic('send', 18) + '</button></form><p class="bsm-hint">Entrée pour envoyer · Maj + Entrée pour aller à la ligne · glissez un fichier ou collez une image pour l’envoyer</p>';
    return '<section class="bsm-main">' + head + '<div class="bsm-scroll" role="log" aria-live="polite">' + corps + '</div>' + foot + '</section>';
  }
  function rendreAucun() {
    return '<section class="bsm-main"><div class="bsm-vide bsm-debut"><span class="bsm-av bsm-av-grp" style="--h:250">' + ic('users', 26) + '</span><h2>Créez votre premier groupe</h2>' +
      '<p>Un espace pour une partie de l’équipe : les commerciaux, un client, un projet. Messages et visio réservés à ses membres.</p>' +
      '<button type="button" class="btn btn-primary btn-md" data-act="groupe">' + ic('plus', 16) + 'Nouveau groupe</button></div></section>';
  }
  // Rubrique « Visio » : les réunions en cours, et de quoi en lancer une avec l'équipe, un groupe ou une personne.
  function rendreSalle() {
    var convs = liste();
    var enCours = convs.filter(function (c) { return c.call && c.call.length; });
    var groupes = convs.filter(function (c) { return c.kind !== 'direct'; });
    var autres = S.users.filter(function (u) { return u.id !== S.me; }).sort(function (a, b) { return (S.online.indexOf(b.id) >= 0) - (S.online.indexOf(a.id) >= 0); });
    var pile = function (ids) { return '<span class="bsm-stack">' + ids.slice(0, 5).map(function (id) { return avatar(id, nomDe(id), 'xs'); }).join('') + '</span>'; };
    var carteConv = function (c) {
      var live = c.call && c.call.length, dedans = Appel.conv === c.id;
      var membres = c.kind === 'equipe' ? S.users.length : (c.members || []).length;
      return '<article class="bsm-room' + (live ? ' live' : '') + '">' + convIcon(c) + '<div class="bsm-room-t"><b>' + esc(titre(c)) + '</b><span>' +
        (live ? '<em class="bsm-live">' + ic('video', 12) + ' En cours · ' + c.call.length + ' participant' + (c.call.length > 1 ? 's' : '') + '</em>' : membres + ' membre' + (membres > 1 ? 's' : '')) + '</span></div>' +
        (live ? pile(c.call) : '') +
        (dedans ? '<button type="button" class="btn btn-secondary btn-md" data-act="agrandir">Retour à la visio</button>'
          : '<button type="button" class="btn ' + (live ? 'btn-success' : 'btn-primary') + ' btn-md" data-visio="' + esc(c.id) + '">' + ic('video', 16) + (live ? 'Rejoindre' : 'Lancer') + '</button>') + '</article>';
    };
    return '<div class="page-head"><div class="page-head-text"><h1 class="page-title">Visio</h1><p class="page-sub">Réunions en vidéo avec l’équipe, sans quitter le CRM : micro, caméra et partage d’écran.</p></div></div>' +
      (enCours.length ? '<h2 class="bsm-h2">' + ic('video', 16) + ' En cours</h2><div class="bsm-rooms">' + enCours.map(carteConv).join('') + '</div>' : '') +
      '<h2 class="bsm-h2">' + ic('users', 16) + ' Lancer une réunion</h2><div class="bsm-rooms">' + groupes.filter(function (c) { return !(c.call && c.call.length); }).map(carteConv).join('') +
      '<button type="button" class="bsm-room bsm-room-new" data-act="groupe">' + '<span class="bsm-av bsm-av-grp" style="--h:250">' + ic('plus', 18) + '</span><div class="bsm-room-t"><b>Nouveau groupe</b><span>Pour réunir une partie de l’équipe</span></div></button></div>' +
      '<h2 class="bsm-h2">' + ic('phone', 16) + ' Appeler un membre</h2>' +
      (autres.length ? '<div class="bsm-rooms">' + autres.map(function (u) {
        var on = S.online.indexOf(u.id) >= 0;
        return '<article class="bsm-room">' + avatar(u.id, u.name) + '<div class="bsm-room-t"><b>' + esc(u.name) + '</b><span>' + (on ? 'En ligne' : 'Hors ligne') + '</span></div>' +
          '<button type="button" class="btn btn-secondary btn-md" data-appeler="' + esc(u.id) + '">' + ic('video', 16) + 'Appeler</button></article>';
      }).join('') + '</div>' : '<p class="bsm-rien">Invitez des membres dans Réglages › Équipe &amp; compte pour faire vos réunions ici.</p>') +
      '<p class="bsm-note">' + ic('info', 14) + '<span>La visio relie directement les navigateurs des participants : idéale jusqu’à 5 ou 6 personnes. Autorisez la caméra et le micro quand le navigateur le demande.</span></p>';
  }
  // Image du groupe dans la fenêtre de création ou de réglages : aperçu, choisir, retirer.
  function imageGroupe(src, retirer, nom) {
    var en = S.modal && S.modal.photoEnCours;
    return '<div class="bsm-gimg"><span class="bsm-av xl ' + (src ? 'ph gph' : 'bsm-av-grp') + '"' + (src ? ' style="--ph:url(&quot;' + esc(src) + '&quot;)"' : ' style="--h:250"') + '>' + (src ? '' : ic('camera', 28)) + '</span>' +
      '<div class="bsm-gimg-t"><b>Image du groupe</b><span>Une photo ou un logo, recadré au carré.</span><div class="bsm-gimg-b">' +
      '<label class="btn btn-secondary btn-sm">' + (en ? '<span class="bsm-spin"></span>' : ic('upload', 14)) + (src ? 'Changer l’image' : 'Choisir une image') + '<input type="file" accept="image/*" class="bsm-gfichier" hidden></label>' +
      (retirer || (S.modal && S.modal.photo) ? '<button type="button" class="btn btn-ghost btn-sm" data-act="photo-retirer">Retirer</button>' : '') + '</div></div></div>';
  }
  function rendreModal() {
    var m = S.modal, autres = S.users.filter(function (u) { return u.id !== S.me; });
    var c = m.conv ? S.convs[m.conv] : null;
    var cases = function (sel, deja) {
      return '<div class="bsm-pick">' + (autres.length ? autres.map(function (u) {
        var d = deja && deja.indexOf(u.id) >= 0;
        return '<label class="bsm-pick-i' + (d ? ' deja' : '') + '"><input type="checkbox" name="m" value="' + esc(u.id) + '"' + (sel.indexOf(u.id) >= 0 || d ? ' checked' : '') + (d ? ' disabled' : '') + '>' + avatar(u.id, u.name) + '<span>' + esc(u.name) + (d ? ' <small>déjà membre</small>' : '') + '</span></label>';
      }).join('') : '<p class="bsm-rien">Invitez d’abord des membres dans Réglages › Équipe &amp; compte.</p>') + '</div>';
    };
    var corps;
    if (m.type === 'groupe') {
      corps = '<h2>Nouveau groupe</h2><p>Un espace de discussion pour une partie de l’équipe : commerciaux, un client, un projet…</p>' +
        imageGroupe(m.photo || '', '', 'Ex') +
        '<label class="bsm-lbl">Nom du groupe<input class="input" name="nom" maxlength="60" placeholder="Ex. Commerciaux, Projet Dupont" value="' + esc(m.nom || '') + '" autofocus></label>' +
        '<div class="bsm-lbl">Membres</div>' + cases(m.sel || []) +
        '<div class="bsm-modal-foot"><button type="button" class="btn btn-secondary btn-md" data-act="fermer">Annuler</button><button type="submit" class="btn btn-primary btn-md">Créer le groupe</button></div>';
    } else if (m.type === 'direct') {
      corps = '<h2>Nouveau message</h2><p>Choisissez la personne à qui écrire.</p><div class="bsm-pick">' + (autres.length ? autres.map(function (u) {
        return '<button type="button" class="bsm-pick-i" data-dm="' + esc(u.id) + '">' + avatar(u.id, u.name) + '<span>' + esc(u.name) + '<small>' + (u.poste ? esc(u.poste) + ' · ' : '') + (S.online.indexOf(u.id) >= 0 ? 'En ligne' : 'Hors ligne') + '</small></span></button>';
      }).join('') : '<p class="bsm-rien">Invitez d’abord des membres dans Réglages › Équipe &amp; compte.</p>') + '</div>' +
        '<div class="bsm-modal-foot"><button type="button" class="btn btn-secondary btn-md" data-act="fermer">Fermer</button></div>';
    } else if (m.type === 'reglages' && c) {
      var peutRetirer = window.BS_SERVER && window.BS_SERVER.user && window.BS_SERVER.user.role === 'admin';
      corps = '<h2>Réglages du groupe</h2>' +
        imageGroupe(m.photo || (c.photo ? photoGroupe(c) : ''), c.photo ? 'retirer' : '', c.name) +
        '<label class="bsm-lbl">Nom du groupe<input class="input" name="nom" maxlength="60" value="' + esc(m.nom != null ? m.nom : c.name) + '" autofocus></label>' +
        '<div class="bsm-lbl">Membres</div><div class="bsm-pick">' + (c.members || []).map(function (id) {
          return '<div class="bsm-pick-i">' + avatar(id, nomDe(id)) + '<span>' + esc(nomDe(id)) + (id === S.me ? ' <small>vous</small>' : '') + (id === c.createdBy ? ' <small>créateur</small>' : '') + '</span>' +
            (peutRetirer && id !== S.me ? '<button type="button" class="btn btn-ghost btn-sm" data-retirer="' + esc(id) + '">Retirer</button>' : '') + '</div>';
        }).join('') + '</div>' +
        '<div class="bsm-lbl">Ajouter des membres</div>' + cases(m.sel || [], c.members || []) +
        '<div class="bsm-modal-foot"><button type="button" class="btn btn-danger btn-md" data-act="quitter-groupe">Quitter le groupe</button><span class="grow"></span><button type="button" class="btn btn-secondary btn-md" data-act="fermer">Annuler</button><button type="submit" class="btn btn-primary btn-md">Enregistrer</button></div>';
    } else if (m.type === 'organigramme') {
      var admin = window.BS_SERVER && window.BS_SERVER.user && window.BS_SERVER.user.role === 'admin';
      var nbEnLigne = S.users.filter(function (u) { return S.online.indexOf(u.id) >= 0; }).length;
      corps = '<div class="bso-tete"><div><h2>Organigramme</h2><p>Qui fait quoi dans l’équipe, et qui dépend de qui.' + (admin ? ' Postes et responsables se règlent dans Réglages › Équipe &amp; compte.' : '') + '</p></div>' +
        '<div class="bso-stats"><span><b>' + S.users.length + '</b> membre' + (S.users.length > 1 ? 's' : '') + '</span><span><b>' + orgNiveaux() + '</b> niveau' + (orgNiveaux() > 1 ? 'x' : '') + '</span><span class="on"><i></i><b>' + nbEnLigne + '</b> en ligne</span></div></div>' +
        '<div class="bso-vue" data-org-vue>' + organigramme() +
        '<div class="bso-zoom" role="group" aria-label="Zoom de l’organigramme"><button type="button" data-org="moins" aria-label="Dézoomer" title="Dézoomer">−</button>' +
        '<button type="button" data-org="ajuster" class="txt" title="Voir toute l’équipe">Tout voir</button><button type="button" data-org="plus" aria-label="Zoomer" title="Zoomer">+</button></div>' +
        '<div class="bso-aide">Glissez pour vous déplacer · Ctrl + molette pour zoomer · cliquez sur un membre pour lui écrire</div></div>' +
        '<div class="bsm-modal-foot">' + (admin ? '<button type="button" class="btn btn-secondary btn-md" data-act="regler-equipe">Modifier</button>' : '') +
        '<button type="button" class="btn btn-primary btn-md" data-act="fermer">Fermer</button></div>';
    } else return '';
    return '<div class="overlay bsm-overlay" data-act="fermer-fond"><form class="modal bsm-modal' + (m.type === 'organigramme' ? ' large org' : '') + '" role="dialog" aria-modal="true">' + (m.err ? '<div class="bsm-err">' + esc(m.err) + '</div>' : '') + corps + '</form></div>';
  }
  // Arbre : chaque membre sous son responsable ; à poste égal, ordre de la liste des postes puis du nom.
  // Quand toute l'équipe d'un responsable est sans équipe propre, elle s'empile en colonne sous lui :
  // l'arbre reste étroit et toute l'équipe tient à l'écran.
  function orgArbre() {
    var ids = {}; S.users.forEach(function (u) { ids[u.id] = u; });
    var rang = function (u) { var i = S.postes.indexOf(u.poste); return i < 0 ? 999 : i; };
    var tri = function (a, b) { return rang(a) - rang(b) || a.name.localeCompare(b.name, 'fr'); };
    return {
      racines: function () { return this.enfants(null); },
      enfants: function (id) { return S.users.filter(function (u) { return (u.managerId && ids[u.managerId] ? u.managerId : null) === id; }).sort(tri); },
    };
  }
  function orgNiveaux() {
    var t = orgArbre();
    var prof = function (u, n) { var k = n < 12 ? t.enfants(u.id) : []; return k.length ? 1 + Math.max.apply(null, k.map(function (x) { return prof(x, n + 1); })) : 1; };
    var r = t.racines();
    return r.length ? Math.max.apply(null, r.map(function (u) { return prof(u, 0); })) : 0;
  }
  function organigramme() {
    var t = orgArbre();
    var total = function (u, n) { var k = n < 12 ? t.enfants(u.id) : []; return k.reduce(function (s, x) { return s + 1 + total(x, n + 1); }, 0); };
    var carteOrg = function (u, prof, nb) {
      return '<button type="button" class="bso-carte' + (u.id === S.me ? ' moi' : '') + (prof === 0 ? ' tete' : '') + '"' + (u.id === S.me ? '' : ' data-dm="' + esc(u.id) + '" title="Écrire à ' + esc(u.name) + '"') + '>' +
        avatar(u.id, u.name) + '<span class="bso-t"><b>' + esc(u.name) + (u.id === S.me ? ' <small>vous</small>' : '') + '</b><em>' + esc(u.poste || 'Poste à définir') + '</em>' +
        (nb ? '<span class="bso-nb">' + nb + ' personne' + (nb > 1 ? 's' : '') + '</span>' : '') + '</span></button>';
    };
    var noeud = function (u, prof) {
      var k = prof < 12 ? t.enfants(u.id) : [];
      var pile = k.length >= 2 && k.every(function (x) { return !t.enfants(x.id).length; });
      return '<li>' + carteOrg(u, prof, total(u, prof)) +
        (k.length ? '<ul' + (pile ? ' class="pile"' : '') + '>' + k.map(function (x) { return noeud(x, prof + 1); }).join('') + '</ul>' : '') + '</li>';
    };
    return '<div class="bso" data-org-arbre><ul>' + t.racines().map(function (u) { return noeud(u, 0); }).join('') + '</ul></div>';
  }
  // Vue de l'organigramme : ajustée à la fenêtre à l'ouverture, zoom (boutons, Ctrl + molette) et déplacement à la souris ou au doigt.
  var orgV = { z: 1, x: 0, y: 0, auto: true };
  function orgAppliquer(root) {
    var vue = root.querySelector('[data-org-vue]'), arbre = vue && vue.querySelector('[data-org-arbre]');
    if (!arbre) return;
    // Petit écran : liste en retrait (lisible au doigt) au lieu de l'arbre réduit.
    var liste = vue.clientWidth < 640;
    vue.classList.toggle('liste', liste);
    if (liste) { arbre.style.transform = ''; return; }
    if (orgV.auto) {
      var w = arbre.scrollWidth, h = arbre.scrollHeight, W = vue.clientWidth - 24, H = vue.clientHeight - 64;
      orgV.z = Math.max(0.35, Math.min(1, W / w, H / h));
      orgV.x = (vue.clientWidth - w * orgV.z) / 2;
      orgV.y = Math.max(14, (vue.clientHeight - 40 - h * orgV.z) / 2);
    }
    arbre.style.transform = 'translate(' + orgV.x + 'px,' + orgV.y + 'px) scale(' + orgV.z + ')';
    var aj = vue.querySelector('[data-org="ajuster"]'); if (aj) aj.classList.toggle('actif', orgV.auto);
  }
  function orgZoom(root, f, cx, cy) {
    var vue = root.querySelector('[data-org-vue]'); if (!vue) return;
    var r = vue.getBoundingClientRect();
    if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    var z = Math.max(0.3, Math.min(1.8, orgV.z * f));
    orgV.x = cx - (cx - orgV.x) * (z / orgV.z); orgV.y = cy - (cy - orgV.y) * (z / orgV.z);
    orgV.z = z; orgV.auto = false; orgAppliquer(root);
  }
  function orgBrancher(root) {
    if (root.__bsoVue) return;
    root.__bsoVue = true;
    var glisse = null;
    root.addEventListener('pointerdown', function (e) {
      var vue = e.target.closest('[data-org-vue]');
      if (!vue || vue.classList.contains('liste') || e.target.closest('.bso-zoom') || e.button !== 0) return;
      glisse = { x: e.clientX, y: e.clientY, ox: orgV.x, oy: orgV.y, bouge: false, id: e.pointerId, vue: vue };
    });
    root.addEventListener('pointermove', function (e) {
      if (!glisse || e.pointerId !== glisse.id) return;
      var dx = e.clientX - glisse.x, dy = e.clientY - glisse.y;
      if (!glisse.bouge && Math.abs(dx) + Math.abs(dy) < 5) return;
      if (!glisse.bouge) { glisse.bouge = true; glisse.vue.classList.add('glisse'); try { glisse.vue.setPointerCapture(e.pointerId); } catch (x) { /* déjà relâché */ } }
      orgV.x = glisse.ox + dx; orgV.y = glisse.oy + dy; orgV.auto = false; orgAppliquer(root);
    });
    var fin = function (e) {
      if (!glisse || (e && e.pointerId !== glisse.id)) return;
      var g = glisse; glisse = null; g.vue.classList.remove('glisse');
      // Après un déplacement, le clic qui suit n'ouvre pas de conversation.
      if (g.bouge) window.addEventListener('click', function stop(ev) { ev.stopPropagation(); ev.preventDefault(); window.removeEventListener('click', stop, true); }, true);
    };
    root.addEventListener('pointerup', fin); root.addEventListener('pointercancel', fin);
    root.addEventListener('wheel', function (e) {
      var vue = e.target.closest('[data-org-vue]');
      if (!vue || !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      var r = vue.getBoundingClientRect();
      orgZoom(root, e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-org]'); if (!b) return;
      e.preventDefault();
      var a = b.getAttribute('data-org');
      if (a === 'ajuster') { orgV.auto = true; orgAppliquer(root); } else orgZoom(root, a === 'plus' ? 1.2 : 1 / 1.2);
    });
    window.addEventListener('resize', function () { if (orgV.auto && root.querySelector('[data-org-vue]')) orgAppliquer(root); });
  }
  function taille(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; }

  // ------------------------------------------------------------------ actions de la rubrique
  function brancher(root) {
    if (root.__bsm) return;
    root.__bsm = true;
    root.addEventListener('click', function (ev) {
      var t = ev.target;
      var voir = t.closest('[data-voir]');
      if (voir && root.contains(voir) && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey && Vue.ouvrir(voir.getAttribute('data-voir'))) { ev.preventDefault(); return; }
      if (t.closest('[data-act="fermer-fond"]') && !t.closest('.bsm-modal')) { S.modal = null; rendre(); return; }
      var b = t.closest('button');
      if (!b || !root.contains(b)) return;
      var id;
      if ((id = b.getAttribute('data-emoji'))) {
        var ta = root.querySelector('.bsm-input'), v = ta.value, a = ta.selectionStart == null ? v.length : ta.selectionStart, z = ta.selectionEnd == null ? v.length : ta.selectionEnd;
        ta.value = v.slice(0, a) + id + v.slice(z);
        ta.focus(); ta.setSelectionRange(a + id.length, a + id.length);
        S.brouillons[S.actif] = ta.value; taille(ta);
        return;
      }
      if ((id = b.getAttribute('data-conv'))) { S.mobileListe = false; S.emojis = false; ouvrir(id); return; }
      if ((id = b.getAttribute('data-dm'))) {
        S.modal = null;
        api('POST', '/directs', { userId: id }).then(function (r) { S.convs[r.conversation.id] = r.conversation; aller(r.conversation.id); })
          .catch(function (e) { S.err = e.message; rendre(); });
        return;
      }
      if ((id = b.getAttribute('data-retirer'))) { modifierGroupe({ remove: [id] }, false); return; }
      if ((id = b.getAttribute('data-suppr'))) { supprimerMessage(id); return; }
      if ((id = b.getAttribute('data-reagir'))) { reagir(b.getAttribute('data-mid'), id); return; }
      if ((id = b.getAttribute('data-reag'))) { S.reagir = S.reagir === Number(id) ? null : Number(id); S.reagirTout = false; rendre(); return; }
      if ((id = b.getAttribute('data-visio'))) { Appel.rejoindre(id); return; }
      if ((id = b.getAttribute('data-appeler'))) {
        api('POST', '/directs', { userId: id }).then(function (r) { S.convs[r.conversation.id] = r.conversation; Appel.rejoindre(r.conversation.id); })
          .catch(function (e) { S.err = e.message; rendre(); });
        return;
      }
      var act = b.getAttribute('data-act');
      if (act === 'organigramme') { orgV.auto = true; S.modal = { type: 'organigramme' }; rendre(); return; }
      if (act === 'regler-equipe') { S.modal = null; location.hash = '#/settings'; if (window.bsEquipe && window.bsEquipe.ouvrirEquipe) window.bsEquipe.ouvrirEquipe(); return; }
      if (act === 'reactions-tout') { S.reagirTout = true; rendre(); return; }
      if (act === 'emojis') { S.emojis = !S.emojis; rendre(); var ti = root.querySelector('.bsm-input'); if (ti) ti.focus(); return; }
      if (act === 'joindre') { root.querySelector('.bsm-fichier').click(); return; }
      if (act === 'retour') { S.mobileListe = true; rendre(); }
      else if (act === 'groupe') { S.modal = { type: 'groupe', sel: [] }; rendre(); }
      else if (act === 'direct') { S.modal = { type: 'direct' }; rendre(); }
      else if (act === 'reglages') { S.modal = { type: 'reglages', conv: S.actif }; rendre(); }
      else if (act === 'fermer') { S.modal = null; rendre(); }
      else if (act === 'photo-retirer') {
        if (S.modal.photo) { S.modal.photo = ''; rendre(); }
        else if (S.modal.type === 'reglages') photoDuGroupe(S.modal.conv, null);
      }
      else if (act === 'quitter-groupe') {
        if (confirm('Quitter ce groupe ? Vous ne verrez plus ses messages.')) modifierGroupe({ remove: [S.me] }, true);
      }
      else if (act === 'visio') Appel.rejoindre(S.actif);
      else if (act === 'agrandir') Appel.agrandir();
      else if (act === 'plus') plusAnciens();
      else if (act === 'recharger') { S.err = ''; charger(); rendre(); }
    });
    root.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = ev.target;
      if (f.classList.contains('bsm-compose')) { var ta = f.querySelector('textarea'); var v = ta.value; ta.value = ''; taille(ta); envoyer(v); return; }
      if (!f.classList.contains('bsm-modal')) return;
      var nom = f.querySelector('[name=nom]'), sel = [].slice.call(f.querySelectorAll('[name=m]:checked:not(:disabled)')).map(function (x) { return x.value; });
      if (S.modal.type === 'groupe') {
        var image = S.modal.photo;
        api('POST', '/groupes', { name: nom.value, members: sel }).then(function (r) {
          S.convs[r.conversation.id] = r.conversation; S.modal = null; aller(r.conversation.id);
          if (image) api('PUT', '/groupes/' + encodeURIComponent(r.conversation.id) + '/photo', { image: image }).then(function (x) { S.convs[x.conversation.id] = x.conversation; rendre(); }).catch(function () {});
        })
          .catch(function (e) { S.modal.err = e.message; rendre(); });
      } else if (S.modal.type === 'reglages') modifierGroupe({ name: nom.value, add: sel }, true);
    });
    root.addEventListener('keydown', function (ev) {
      if (ev.target.classList && ev.target.classList.contains('bsm-input') && ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) {
        ev.preventDefault();
        var ta = ev.target, v = ta.value; ta.value = ''; taille(ta); envoyer(v);
      }
      if (ev.key === 'Escape' && S.modal) { S.modal = null; rendre(); }
      else if (ev.key === 'Escape' && S.emojis) { S.emojis = false; rendre(); }
    });
    root.addEventListener('change', function (ev) {
      if (ev.target.classList && ev.target.classList.contains('bsm-fichier')) { envoyerFichiers(ev.target.files); ev.target.value = ''; }
      if (ev.target.classList && ev.target.classList.contains('bsm-gfichier') && S.modal) {
        var f = ev.target.files[0], md = S.modal;
        garderSaisie(md);
        md.photoEnCours = true; md.err = ''; rendre();
        reduireImage(f).then(function (url) {
          md.photoEnCours = false;
          if (md.type === 'reglages') photoDuGroupe(md.conv, url);
          else { md.photo = url; rendre(); }
        }).catch(function (e) { md.photoEnCours = false; md.err = e.message; rendre(); });
      }
    });
    root.addEventListener('paste', function (ev) {
      if (!ev.target.classList || !ev.target.classList.contains('bsm-input')) return;
      var files = [].slice.call((ev.clipboardData && ev.clipboardData.files) || []);
      if (files.length) { ev.preventDefault(); envoyerFichiers(files); }
    });
    root.addEventListener('dragover', function (ev) {
      var zone = ev.target.closest && ev.target.closest('.bsm-main');
      if (zone && ev.dataTransfer && [].indexOf.call(ev.dataTransfer.types || [], 'Files') >= 0) { ev.preventDefault(); zone.classList.add('depot'); }
    });
    root.addEventListener('dragleave', function (ev) {
      var zone = ev.target.closest && ev.target.closest('.bsm-main');
      if (zone && !zone.contains(ev.relatedTarget)) zone.classList.remove('depot');
    });
    root.addEventListener('drop', function (ev) {
      var zone = ev.target.closest && ev.target.closest('.bsm-main');
      if (!zone || !ev.dataTransfer || !ev.dataTransfer.files.length) return;
      ev.preventDefault(); zone.classList.remove('depot');
      envoyerFichiers(ev.dataTransfer.files);
    });
    // Le sélecteur d'émojis se ferme quand on clique ailleurs.
    document.addEventListener('pointerdown', function (ev) {
      if (S.emojis && !(ev.target.closest && ev.target.closest('.bsm-emojis,[data-act="emojis"]'))) { S.emojis = false; rendre(); }
      if (S.reagir && !(ev.target.closest && ev.target.closest('.bsm-palette,[data-reag],.bsm-reac'))) { S.reagir = null; S.reagirTout = false; rendre(); }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && S.reagir && !S.modal) { S.reagir = null; S.reagirTout = false; rendre(); }
    });
    root.addEventListener('input', function (ev) {
      var t = ev.target;
      if (t.classList.contains('bsm-input')) { taille(t); S.brouillons[S.actif] = t.value; jEcris(t); }
      if (t.name === 'bsm-filtre') { S.filtre = t.value; rendre(); }
    });
    root.addEventListener('scroll', function (ev) {
      if (ev.target.classList && ev.target.classList.contains('bsm-scroll') && ev.target.scrollTop < 40 && S.more[S.actif]) plusAnciens();
    }, true);
  }
  // Le choix d'une image redessine la fenêtre : on garde le nom tapé et les membres cochés.
  function garderSaisie(md) {
    var f = document.querySelector('.bsm-modal form') || document.querySelector('.bsm-modal');
    if (!f) return;
    var nom = f.querySelector('[name=nom]');
    if (nom) md.nom = nom.value;
    md.sel = [].map.call(f.querySelectorAll('input[name=m]:checked:not(:disabled)'), function (i) { return i.value; });
  }
  // Réglages du groupe : l'image est enregistrée tout de suite (sans attendre « Enregistrer »).
  function photoDuGroupe(id, url) {
    var md = S.modal;
    if (md) garderSaisie(md);
    (url ? api('PUT', '/groupes/' + encodeURIComponent(id) + '/photo', { image: url }) : api('DELETE', '/groupes/' + encodeURIComponent(id) + '/photo'))
      .then(function (r) { S.convs[id] = r.conversation; if (md) md.photo = ''; rendre(); })
      .catch(function (e) { if (S.modal) S.modal.err = e.message; rendre(); });
  }
  function modifierGroupe(changes, fermer) {
    var id = S.modal ? S.modal.conv : S.actif;
    api('PATCH', '/groupes/' + encodeURIComponent(id), changes).then(function (r) {
      if (r.conversation) S.convs[id] = r.conversation;
      else { delete S.convs[id]; S.actif = null; S.mobileListe = true; choisirActif(); }
      if (fermer) S.modal = null;
      rendre();
    }).catch(function (e) { if (S.modal) S.modal.err = e.message; else S.err = e.message; rendre(); });
  }

  function monter(root, mode) {
    mode = mode === 'groupes' || mode === 'visio' ? mode : 'messages';
    if (S.root === root && root.__bsm && S.mode === mode) return;
    if (S.mode !== mode) { S.mode = mode; S.filtre = ''; S.mobileListe = true; }
    S.root = root;
    brancher(root);
    demarrer();
    choisirActif();
    rendre(true);
    if (S.pret && S.actif) ouvrir(S.actif, true);
  }

  // ------------------------------------------------------------------ visio (WebRTC)
  var Appel = {
    conv: null, local: null, ecran: null, pcs: {}, flux: {}, etats: {}, ice: [], reduit: false, micro: true, camera: true, el: null, chrono: null, debut: 0,
    rejoindre: function (cid) {
      var self = this;
      if (self.conv === cid) { self.agrandir(); return; }
      if (self.conv && !confirm('Quitter la visio en cours pour rejoindre celle-ci ?')) return;
      if (self.conv) self.quitter();
      self.conv = cid; self.reduit = false; self.debut = Date.now(); self.etats = {};
      self.dessiner('Connexion à la caméra et au micro…');
      self.media().then(function () {
        return api('POST', '/conversations/' + encodeURIComponent(cid) + '/visio', {});
      }).then(function (r) {
        if (self.conv !== cid) return;
        self.ice = r.iceServers || [];
        r.others.forEach(function (uid) { self.appeler(uid); });
        self.dessiner();
        rendre();
      }).catch(function (e) {
        self.fin();
        carte({ titre: 'Visio impossible', sous: e.message, icone: 'video', bouton: 'OK', action: function () {}, force: true });
      });
    },
    media: function () {
      var self = this;
      var md = navigator.mediaDevices;
      if (!md || !md.getUserMedia) return Promise.reject(new Error('Ce navigateur ne permet pas la visio (connexion HTTPS requise).'));
      return md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: { width: { ideal: 1280 }, height: { ideal: 720 } } })
        .catch(function () { self.camera = false; return md.getUserMedia({ audio: true }); })
        .catch(function () { self.micro = false; self.camera = false; return new MediaStream(); })
        .then(function (s) { self.local = s; self.micro = !!s.getAudioTracks().length; self.camera = !!s.getVideoTracks().length; });
    },
    piste: function (kind) {
      if (kind === 'video' && this.ecran) return this.ecran.getVideoTracks()[0] || null;
      var t = this.local && (kind === 'audio' ? this.local.getAudioTracks() : this.local.getVideoTracks());
      return (t && t[0]) || null;
    },
    pc: function (uid) {
      var self = this;
      if (self.pcs[uid]) return self.pcs[uid];
      var pc = new RTCPeerConnection({ iceServers: self.ice });
      pc.__file = [];
      pc.onicecandidate = function (e) { if (e.candidate) self.envoyer(uid, { type: 'ice', candidate: e.candidate }); };
      pc.ontrack = function (e) {
        var st = self.flux[uid] || (self.flux[uid] = new MediaStream());
        if (st.getTracks().indexOf(e.track) < 0) st.addTrack(e.track);
        e.track.onunmute = function () { self.dessiner(); };
        self.dessiner();
      };
      pc.onconnectionstatechange = function () {
        if (pc.connectionState === 'failed') { self.etats[uid] = Object.assign(self.etats[uid] || {}, { echec: true }); self.dessiner(); }
        if (pc.connectionState === 'connected' && self.etats[uid]) { self.etats[uid].echec = false; self.dessiner(); }
      };
      self.pcs[uid] = pc;
      return pc;
    },
    brancherPistes: function (pc) {
      var self = this;
      pc.getTransceivers().forEach(function (tr) {
        var kind = tr.receiver.track && tr.receiver.track.kind;
        if (!kind) return;
        try { tr.direction = 'sendrecv'; } catch (e) { /* transceiver arrêté */ }
        tr.sender.replaceTrack(self.piste(kind)).catch(function () {});
      });
    },
    appeler: function (uid) {
      var self = this, pc = self.pc(uid);
      pc.addTransceiver('audio', { direction: 'sendrecv' });
      pc.addTransceiver('video', { direction: 'sendrecv' });
      self.brancherPistes(pc);
      pc.createOffer().then(function (o) { return pc.setLocalDescription(o); })
        .then(function () { self.envoyer(uid, { type: 'offer', sdp: pc.localDescription.sdp }); self.envoyer(uid, self.etat()); });
    },
    signal: function (x) {
      var self = this;
      if (x.conversationId !== self.conv) return;
      var uid = x.from, d = x.data || {}, pc;
      if (d.type === 'offer') {
        pc = self.pc(uid);
        pc.setRemoteDescription({ type: 'offer', sdp: d.sdp }).then(function () {
          self.brancherPistes(pc);
          pc.__file.splice(0).forEach(function (c) { pc.addIceCandidate(c).catch(function () {}); });
          return pc.createAnswer();
        }).then(function (a) { return pc.setLocalDescription(a); })
          .then(function () { self.envoyer(uid, { type: 'answer', sdp: pc.localDescription.sdp }); self.envoyer(uid, self.etat()); });
      } else if (d.type === 'answer') {
        pc = self.pcs[uid];
        if (pc) pc.setRemoteDescription({ type: 'answer', sdp: d.sdp }).then(function () {
          pc.__file.splice(0).forEach(function (c) { pc.addIceCandidate(c).catch(function () {}); });
        });
      } else if (d.type === 'ice') {
        pc = self.pc(uid);
        if (pc.remoteDescription) pc.addIceCandidate(d.candidate).catch(function () {});
        else pc.__file.push(d.candidate);
      } else if (d.type === 'etat') {
        self.etats[uid] = Object.assign(self.etats[uid] || {}, { micro: d.micro, camera: d.camera, ecran: d.ecran });
        self.dessiner();
      }
    },
    etat: function () { return { type: 'etat', micro: this.micro && !!this.piste('audio') && this.piste('audio').enabled, camera: !!this.ecran || (this.camera && !!this.piste('video') && this.piste('video').enabled), ecran: !!this.ecran }; },
    envoyer: function (uid, data) {
      api('POST', '/signal', { to: uid, conversationId: this.conv, data: data }).catch(function () {});
    },
    diffuserEtat: function () { var self = this; Object.keys(self.pcs).forEach(function (uid) { self.envoyer(uid, self.etat()); }); },
    evenement: function (x) {
      if (x.conversationId !== this.conv) return;
      if (x.left && this.pcs[x.left]) { this.pcs[x.left].close(); delete this.pcs[x.left]; delete this.flux[x.left]; delete this.etats[x.left]; }
      this.dessiner();
    },
    basculerMicro: function () {
      var t = this.piste('audio');
      if (!t) { carte({ titre: 'Micro indisponible', sous: 'Autorisez le micro dans votre navigateur, puis rejoignez à nouveau la visio.', icone: 'video', bouton: 'OK', action: function () {}, force: true }); return; }
      t.enabled = !t.enabled; this.micro = t.enabled; this.diffuserEtat(); this.dessiner();
    },
    basculerCamera: function () {
      var t = this.local && this.local.getVideoTracks()[0];
      if (!t) { carte({ titre: 'Caméra indisponible', sous: 'Aucune caméra autorisée : les autres vous entendent sans vous voir.', icone: 'video', bouton: 'OK', action: function () {}, force: true }); return; }
      t.enabled = !t.enabled; this.camera = t.enabled; this.diffuserEtat(); this.dessiner();
    },
    partager: function () {
      var self = this;
      if (self.ecran) { self.finPartage(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) { carte({ titre: 'Partage d’écran indisponible', sous: 'Ce navigateur ou cet appareil ne permet pas de partager l’écran.', icone: 'video', bouton: 'OK', action: function () {}, force: true }); return; }
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then(function (s) {
        self.ecran = s;
        s.getVideoTracks()[0].onended = function () { self.finPartage(); };
        self.remplacerVideo(); self.diffuserEtat(); self.dessiner();
      }).catch(function () {});
    },
    finPartage: function () {
      if (!this.ecran) return;
      this.ecran.getTracks().forEach(function (t) { t.stop(); });
      this.ecran = null; this.remplacerVideo(); this.diffuserEtat(); this.dessiner();
    },
    remplacerVideo: function () {
      var t = this.piste('video');
      Object.keys(this.pcs).forEach(function (uid) {
        this.pcs[uid].getTransceivers().forEach(function (tr) { if (tr.receiver.track && tr.receiver.track.kind === 'video') tr.sender.replaceTrack(t).catch(function () {}); });
      }, this);
    },
    quitter: function () {
      var cid = this.conv;
      if (!cid) return;
      fetch(API + '/conversations/' + encodeURIComponent(cid) + '/visio', { method: 'POST', keepalive: true, credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'quitter' }) }).catch(function () {});
      this.fin();
    },
    fin: function () {
      var self = this;
      Object.keys(self.pcs).forEach(function (uid) { self.pcs[uid].close(); });
      [self.local, self.ecran].forEach(function (s) { if (s) s.getTracks().forEach(function (t) { t.stop(); }); });
      self.pcs = {}; self.flux = {}; self.etats = {}; self.local = null; self.ecran = null; self.conv = null; self.micro = true; self.camera = true;
      clearInterval(self.chrono); self.chrono = null;
      if (self.el) { self.el.remove(); self.el = null; }
      document.documentElement.classList.remove('bsm-en-visio');
      rendre();
    },
    agrandir: function () { this.reduit = false; this.dessiner(); },
    reduire: function () { this.reduit = true; this.dessiner(); },
    dessiner: function (attente) {
      var self = this;
      if (!self.conv) return;
      ensureCss();
      var c = S.convs[self.conv];
      if (!self.el) {
        self.el = document.createElement('div');
        self.el.className = 'bsm-call';
        self.el.setAttribute('role', 'dialog');
        self.el.setAttribute('aria-label', 'Visio');
        document.body.appendChild(self.el);
        self.el.addEventListener('click', function (ev) {
          var b = ev.target.closest('[data-v]');
          if (!b) return;
          var a = b.getAttribute('data-v');
          if (a === 'micro') self.basculerMicro();
          else if (a === 'camera') self.basculerCamera();
          else if (a === 'ecran') self.partager();
          else if (a === 'reduire') self.reduire();
          else if (a === 'agrandir') self.agrandir();
          else if (a === 'quitter') self.quitter();
          else if (a === 'fil') { self.reduire(); aller(self.conv); }
        });
        self.chrono = setInterval(function () { var t = self.el && self.el.querySelector('.bsm-chrono'); if (t) t.textContent = duree(Date.now() - self.debut); }, 1000);
      }
      document.documentElement.classList.add('bsm-en-visio');
      self.el.classList.toggle('reduit', self.reduit);
      var autres = Object.keys(self.pcs);
      var tuiles = [{ uid: S.me, moi: true }].concat(autres.map(function (u) { return { uid: u }; }));
      self.el.style.setProperty('--n', tuiles.length);
      var grid = '<div class="bsm-grid n' + Math.min(tuiles.length, 6) + '">' + tuiles.map(function (t) {
        var st = t.moi ? (self.ecran || self.local) : self.flux[t.uid];
        var e = t.moi ? self.etat() : (self.etats[t.uid] || {});
        var video = st && st.getVideoTracks().some(function (x) { return x.readyState === 'live' && !x.muted; }) && e.camera !== false;
        var nom = t.moi ? 'Vous' : nomDe(t.uid);
        return '<div class="bsm-tile' + (video ? '' : ' sans') + (t.moi && !self.ecran ? ' moi' : '') + '" data-uid="' + esc(t.uid) + '">' +
          '<video autoplay playsinline' + (t.moi ? ' muted' : '') + '></video>' +
          '<div class="bsm-tile-av">' + avatar(t.uid, t.moi ? nomDe(S.me) : nom, 'xl') + '</div>' +
          '<span class="bsm-tile-n">' + (e.micro === false ? ic('micOff', 13) : '') + (e.ecran ? ic('monitor', 13) : '') + esc(nom) + '</span>' +
          (e.echec ? '<span class="bsm-tile-err">Connexion impossible avec ce réseau</span>' : '') + '</div>';
      }).join('') + '</div>';
      var bouton = function (v, icone, label, on, cls) { return '<button type="button" class="bsm-cb ' + (cls || '') + (on === false ? ' off' : '') + '" data-v="' + v + '" title="' + label + '" aria-label="' + label + '">' + ic(icone, 19) + '</button>'; };
      self.el.innerHTML = '<div class="bsm-call-top"><span class="bsm-rec"></span><b>' + esc(c ? titre(c) : 'Visio') + '</b><span class="bsm-chrono">' + duree(Date.now() - self.debut) + '</span>' +
        '<span class="bsm-call-n">' + tuiles.length + ' participant' + (tuiles.length > 1 ? 's' : '') + '</span><span class="grow"></span>' +
        (self.reduit ? bouton('agrandir', 'maximize', 'Agrandir') : bouton('fil', 'message-circle', 'Ouvrir la discussion') + bouton('reduire', 'minimize', 'Réduire et continuer dans le CRM')) + '</div>' +
        (attente ? '<div class="bsm-call-wait"><span class="bsm-spin"></span>' + esc(attente) + '</div>' : grid) +
        '<div class="bsm-call-bar">' + bouton('micro', self.micro ? 'mic' : 'micOff', self.micro ? 'Couper le micro' : 'Activer le micro', self.micro) +
        bouton('camera', self.camera ? 'video' : 'videoOff', self.camera ? 'Couper la caméra' : 'Activer la caméra', self.camera) +
        bouton('ecran', 'monitor', self.ecran ? 'Arrêter le partage' : 'Partager l’écran', null, self.ecran ? 'actif' : '') +
        bouton('quitter', 'phoneOff', 'Quitter la visio', null, 'rouge') + '</div>' +
        (autres.length || attente ? '' : '<p class="bsm-call-seul">Vous êtes seul pour l’instant : les membres de « ' + esc(c ? titre(c) : '') + ' » sont prévenus et peuvent rejoindre.</p>');
      self.el.querySelectorAll('.bsm-tile').forEach(function (tile) {
        var uid = tile.getAttribute('data-uid'), v = tile.querySelector('video');
        var st = uid === S.me ? (self.ecran || self.local) : self.flux[uid];
        if (st && v.srcObject !== st) { v.srcObject = st; v.play().catch(function () {}); }
      });
    },
  };
  function duree(ms) { var s = Math.floor(ms / 1000), m = Math.floor(s / 60); return (m < 10 ? '0' : '') + m + ':' + ((s % 60) < 10 ? '0' : '') + (s % 60); }
  window.addEventListener('pagehide', function () { if (Appel.conv) Appel.quitter(); });
  document.addEventListener('visibilitychange', function () { if (visible() && S.actif && S.mode !== 'visio') { marquerLu(S.convs[S.actif]); rendre(); } });

  // ------------------------------------------------------------------ styles
  var CSS = [
    '.bsm-root{min-width:0}',
    '.bsm-shell{display:grid;grid-template-columns:320px minmax(0,1fr);height:calc(100dvh - var(--topbar-h,60px) - 56px);min-height:460px;padding:0!important;overflow:hidden}',
    '.bsm-side{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--aur-hair,var(--border))}',
    '.bsm-side-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:18px 16px 10px}',
    '.bsm-side-head .page-title{font-size:1.45em}',
    '.bsm-side-act{display:flex;gap:4px}',
    '.bsm-search{display:flex;align-items:center;gap:8px;margin:0 14px 8px;padding:0 12px;height:38px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-3)}',
    '.bsm-search input{flex:1;min-width:0;border:0;background:none;outline:none;color:var(--text);font-size:.92em}',
    '.bsm-search:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}',
    '.bsm-online{display:flex;gap:10px;overflow-x:auto;padding:4px 14px 10px;scrollbar-width:none}',
    '.bsm-online::-webkit-scrollbar{display:none}',
    '.bsm-online button{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:.72em;color:var(--text-2);flex:none;width:52px}',
    '.bsm-online button span:last-child{max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsm-convs{flex:1;overflow-y:auto;padding:0 8px 12px;min-height:0}',
    '.bsm-sec{font-size:.66em;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text-3);padding:12px 10px 6px}',
    '.bsm-conv{display:flex;align-items:center;gap:11px;width:100%;padding:9px 10px;border-radius:12px;text-align:left;transition:background-color .15s;min-width:0}',
    '.bsm-conv:hover{background:var(--surface-2)}',
    '.bsm-conv.on{background:linear-gradient(90deg,color-mix(in srgb,var(--aur-1,var(--accent)) 24%,transparent),color-mix(in srgb,var(--aur-2,var(--accent)) 8%,transparent));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 26%,transparent)}',
    '.bsm-conv-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.bsm-conv-l1,.bsm-conv-l2{display:flex;align-items:center;gap:8px;min-width:0}',
    '.bsm-conv-l1 b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650;font-size:.94em}',
    '.bsm-conv-l1 time{font-size:.72em;color:var(--text-3);flex:none}',
    '.bsm-conv-l2>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.82em;color:var(--text-3)}',
    '.bsm-conv.nl .bsm-conv-l2>span{color:var(--text);font-weight:600}',
    '.bsm-nl{font-style:normal;min-width:20px;height:20px;padding:0 6px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;font-size:.72em;font-weight:700;color:#fff;background:linear-gradient(135deg,var(--aur-1,var(--accent)),var(--aur-2,var(--accent)));box-shadow:0 4px 12px -4px var(--accent)}',
    '.bsm-live{font-style:normal;display:inline-flex;align-items:center;gap:5px;color:#10b981;font-weight:650}',
    '.bsm-rien{color:var(--text-3);font-size:.88em;padding:10px}',
    '.bsm-av{position:relative;flex:none;width:38px;height:38px;border-radius:12px;display:inline-grid;place-items:center;font-weight:750;font-size:.8em;color:#fff;background:linear-gradient(140deg,hsl(var(--h) 72% 56%),hsl(calc(var(--h) + 40) 70% 42%));box-shadow:inset 0 1px 0 rgb(255 255 255/.22)}',
    '.bsm-av.xs{width:26px;height:26px;border-radius:9px;font-size:.66em;margin-left:-6px;box-shadow:0 0 0 2px var(--surface)}',
    '.bsm-av.xs .bsm-pres{display:none}',
    '.bsm-av.xs.plus{background:var(--surface-3);color:var(--text-2)}',
    '.bsm-av.xl{width:84px;height:84px;border-radius:28px;font-size:1.7em}',
    '.bsm-av-grp{background:linear-gradient(140deg,color-mix(in srgb,var(--aur-1,var(--accent)) 70%,#000 0%),color-mix(in srgb,var(--aur-2,var(--accent)) 80%,#000 10%))}',
    '.bsm-av-grp.eq{background:linear-gradient(140deg,var(--aur-3,#22d3ee),var(--aur-1,var(--accent)) 55%,var(--aur-2,#8b5cf6))}',
    '.bsm-pres{position:absolute;right:-2px;bottom:-2px;width:11px;height:11px;border-radius:50%;background:var(--surface-3);box-shadow:0 0 0 2px var(--surface)}',
    '.bsm-pres.on{background:#10b981}',
    '.bsm-main{display:flex;flex-direction:column;min-width:0;min-height:0}',
    '.bsm-head{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--aur-hair,var(--border))}',
    '.bsm-head-t{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.bsm-head-t b{font-size:1.02em;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsm-head-t span{font-size:.8em;color:var(--text-3)}',
    '.bsm-stack{display:flex;padding-left:6px}',
    '.bsm-back{display:none}',
    '.bsm-scroll{flex:1;overflow-y:auto;padding:18px 20px 8px;display:flex;flex-direction:column;gap:3px;min-height:0}',
    '.bsm-jour{display:flex;justify-content:center;margin:14px 0 8px}',
    '.bsm-jour span{font-size:.72em;font-weight:650;letter-spacing:.04em;color:var(--text-3);padding:4px 12px;border-radius:99px;background:var(--surface-2);border:1px solid var(--border);text-transform:capitalize}',
    '.bsm-msg{display:flex;align-items:flex-end;gap:9px;max-width:min(680px,86%);margin-top:8px}',
    '.bsm-msg.suite{margin-top:0}',
    '.bsm-av.ph{background:var(--ph) center/cover no-repeat;border-radius:50%!important}',
    '.bsm-av.ph.gph{border-radius:12px!important}',
    '.bsm-av.xl.ph.gph{border-radius:26px!important}',
    '.bsm-gimg{display:flex;align-items:center;gap:14px;padding:10px 12px;border:1px solid var(--border);border-radius:16px;background:var(--surface-2)}',
    '.bsm-gimg .bsm-av.xl{width:72px;height:72px;border-radius:22px}',
    '.bsm-gimg-t{display:flex;flex-direction:column;gap:2px;min-width:0}',
    '.bsm-gimg-t b{font-size:.95em}',
    '.bsm-gimg-t>span{font-size:.8em;color:var(--text-3)}',
    '.bsm-gimg-b{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}',
    '.bsm-gimg-b label{cursor:pointer}',
    '.bsm-suppr{align-self:center;flex:none;width:30px;height:30px;display:grid;place-items:center;border-radius:9px;border:0;background:transparent;color:var(--text-3);cursor:pointer;opacity:0;transition:opacity .15s,background .15s,color .15s}',
    '.bsm-msg:hover .bsm-suppr,.bsm-suppr:focus-visible{opacity:1}',
    '.bsm-suppr:hover{background:color-mix(in srgb,#ef4444 14%,transparent);color:#ef4444}',
    '@media (hover:none){.bsm-suppr{opacity:.55}}',
    '.bsm-col{position:relative;display:flex;flex-direction:column;align-items:flex-start;min-width:0}',
    '.bsm-msg.moi .bsm-col{align-items:flex-end}',
    '.bsm-reag{align-self:center;flex:none;width:30px;height:30px;display:grid;place-items:center;border-radius:9px;border:0;background:transparent;color:var(--text-3);cursor:pointer;opacity:0;transition:opacity .15s,background .15s,color .15s}',
    '.bsm-msg:hover .bsm-reag,.bsm-reag:focus-visible,.bsm-reag.on{opacity:1}',
    '.bsm-reag:hover,.bsm-reag.on{background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent-text,var(--accent))}',
    '@media (hover:none){.bsm-reag{opacity:.55}}',
    '.bsm-reacs{display:flex;flex-wrap:wrap;gap:4px;margin-top:-6px;padding:0 8px;position:relative;z-index:1}',
    '.bsm-reac{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border-radius:99px;border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit;font-size:.82em;cursor:pointer;box-shadow:0 2px 6px -3px rgb(0 0 0/.35);transition:transform .12s,border-color .15s}',
    '.bsm-reac span{font-size:1.05em;line-height:1}',
    '.bsm-reac b{font-size:.86em;font-weight:700;color:var(--text-2)}',
    '.bsm-reac:hover{transform:scale(1.06)}',
    '.bsm-reac.on{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 16%,var(--surface))}',
    '.bsm-reac.on b{color:var(--accent-text,var(--accent))}',
    '.bsm-palette{position:absolute;bottom:calc(100% + 6px);left:0;z-index:20;display:flex;gap:2px;padding:5px;border-radius:99px;background:var(--surface);border:1px solid var(--border);box-shadow:0 14px 34px -12px rgb(0 0 0/.45);animation:bsm-pal .16s ease-out}',
    '.bsm-msg.moi .bsm-palette{left:auto;right:0}',
    '.bsm-palette button{width:34px;height:34px;border-radius:50%;border:0;background:transparent;font-size:1.25em;line-height:1;cursor:pointer;display:grid;place-items:center;color:var(--text-2);transition:transform .12s,background .12s}',
    '.bsm-palette button:hover{transform:scale(1.22);background:var(--surface-2)}',
    '.bsm-palette button.on{background:color-mix(in srgb,var(--accent) 20%,transparent)}',
    '.bsm-palette.tout{display:block;width:min(330px,80vw);max-height:260px;overflow-y:auto;border-radius:16px;padding:8px}',
    '.bsm-palette.tout .bsm-emo-g>span{display:block;font-size:.7em;font-weight:700;color:var(--text-3);margin:4px 4px 2px;text-transform:uppercase;letter-spacing:.04em}',
    '.bsm-palette.tout .bsm-emo-g>div{display:flex;flex-wrap:wrap}',
    '.bsm-palette.tout button{width:36px;height:36px}',
    '@keyframes bsm-pal{from{opacity:0;transform:translateY(4px) scale(.92)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.bsm-palette{animation:none}.bsm-palette button:hover,.bsm-reac:hover{transform:none}}',
    '.bsm-msg .bsm-av{width:30px;height:30px;border-radius:10px;font-size:.66em}',
    '.bsm-av-sp{width:30px;flex:none}',
    '.bsm-msg.moi{align-self:flex-end;flex-direction:row-reverse}',
    '.bsm-bulle{position:relative;padding:8px 12px 6px;border-radius:16px 16px 16px 6px;background:var(--surface-2);border:1px solid var(--border);min-width:0}',
    '.bsm-msg.suite .bsm-bulle{border-radius:6px 16px 16px 6px}',
    '.bsm-msg.moi .bsm-bulle{border-radius:16px 16px 6px 16px;color:#fff;border-color:transparent;background:linear-gradient(135deg,var(--aur-1,var(--accent)),color-mix(in srgb,var(--aur-1,var(--accent)) 45%,var(--aur-2,var(--accent))));box-shadow:0 8px 20px -14px var(--accent)}',
    '.bsm-msg.moi.suite .bsm-bulle{border-radius:16px 6px 6px 16px}',
    '.bsm-auteur{display:block;font-size:.76em;font-weight:700;margin-bottom:2px;color:hsl(var(--h) 70% 62%)}',
    '[data-scheme=light] .bsm-auteur{color:hsl(var(--h) 65% 38%)}',
    '.bsm-txt{font-size:.93em;line-height:1.45;overflow-wrap:anywhere;white-space:normal}',
    '.bsm-txt a{color:inherit;text-decoration:underline}',
    '.bsm-ecrit .bsm-bulle{padding:11px 14px;border-radius:18px;background:color-mix(in srgb,var(--accent) 14%,var(--surface-2));border-color:transparent;animation:bsm-ecrit-in .2s ease-out}',
    '.bsm-dots{display:flex;gap:4px;align-items:center;height:8px}',
    '.bsm-dots i{width:7px;height:7px;border-radius:50%;background:color-mix(in srgb,var(--accent) 75%,#8a94a6);opacity:.45;animation:bsm-dot 1.2s infinite ease-in-out}',
    '.bsm-dots i:nth-child(2){animation-delay:.15s}.bsm-dots i:nth-child(3){animation-delay:.3s}',
    '@keyframes bsm-dot{0%,60%,100%{opacity:.35;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}',
    '@keyframes bsm-ecrit-in{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.bsm-dots i{animation:none;opacity:.7}.bsm-ecrit .bsm-bulle{animation:none}}',
    '.bsm-bulle time{display:block;text-align:right;font-size:.66em;opacity:.65;margin-top:2px}',
    '.bsm-info{align-self:center;display:flex;align-items:center;gap:8px;margin:10px 0;font-size:.78em;color:var(--text-3);padding:5px 12px;border-radius:99px;background:var(--surface-2);border:1px dashed var(--border)}',
    '.bsm-info.visio{color:var(--text);border-style:solid;border-color:rgb(16 185 129/.4);background:rgb(16 185 129/.08)}',
    '.bsm-info.visio svg{color:#10b981}',
    '.bsm-more{display:flex;justify-content:center;padding-bottom:8px}',
    '.bsm-compose{position:relative;z-index:5}',
    '.bsm-outil{flex:none;width:34px;height:38px;display:grid;place-items:center;border-radius:10px;color:var(--text-3,var(--text-2));transition:color .15s,background .15s}',
    '.bsm-outil:hover,.bsm-outil.on{color:var(--accent);background:var(--accent-soft,rgb(99 102 241/.12))}',
    '.bsm-emojis{position:absolute;left:0;bottom:calc(100% + 8px);z-index:20;width:min(340px,calc(100vw - 48px));max-height:300px;overflow:auto;padding:10px;border-radius:16px;background:var(--surface);-webkit-backdrop-filter:blur(24px) saturate(1.3);backdrop-filter:blur(24px) saturate(1.3);border:1px solid var(--border);box-shadow:0 24px 60px -20px rgb(0 0 0/.6);animation:bsm-ecrit-in .15s ease-out}',
    '.bsm-emo-t{font-size:.7em;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3,var(--text-2));margin:6px 4px 4px}',
    '.bsm-emo-g{display:grid;grid-template-columns:repeat(8,1fr)}',
    '.bsm-emo-g button{font-size:22px;line-height:1;padding:6px 0;border-radius:8px;transition:background .1s,transform .1s}',
    '.bsm-emo-g button:hover{background:var(--surface-2);transform:scale(1.15)}',
    '.bsm-img{display:block;margin:2px 0 4px;border-radius:12px;overflow:hidden;max-width:min(280px,60vw);cursor:zoom-in}',
    '.bsm-vid{position:relative;cursor:pointer}',
    '.bsm-vid video{display:block;width:100%;max-height:260px;object-fit:cover;background:#000;pointer-events:none}',
    '.bsm-play{position:absolute;inset:0;display:grid;place-items:center;color:#fff;background:rgb(0 0 0/.18)}',
    '.bsm-play svg{width:50px;height:50px;padding:14px 12px 14px 16px;border-radius:50%;background:rgb(0 0 0/.55);box-sizing:border-box}',
    // Visionneuse plein écran des pièces jointes
    '.bsv{position:fixed;inset:0;z-index:200;display:flex;flex-direction:column;background:rgb(6 8 14/.94);color:#fff;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:bsvIn .18s ease-out}',
    '.bsv[hidden]{display:none}',
    '@keyframes bsvIn{from{opacity:0}to{opacity:1}}',
    'html.bsv-ouverte{overflow:hidden}',
    '.bsv-haut{display:flex;align-items:center;gap:8px;padding:10px 12px 10px 18px;padding-top:max(10px,env(safe-area-inset-top))}',
    '.bsv-titre{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.bsv-titre b{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bsv-titre small{font-size:12.5px;opacity:.72}',
    '.bsv-btn{flex:none;display:grid;place-items:center;width:42px;height:42px;border:0;border-radius:12px;background:rgb(255 255 255/.1);color:#fff;cursor:pointer;text-decoration:none}',
    '.bsv-btn:hover,.bsv-btn:focus-visible{background:rgb(255 255 255/.22)}',
    '.bsv-scene{flex:1;min-height:0;display:grid;place-items:center;padding:6px 72px 24px;overflow:auto}',
    '.bsv-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;cursor:zoom-in;user-select:none;-webkit-user-select:none}',
    '.bsv.zoom .bsv-scene{place-items:start center}',
    '.bsv.zoom .bsv-img{max-width:none;max-height:none;cursor:zoom-out}',
    '.bsv-media{max-width:100%;max-height:100%;border-radius:8px;background:#000}',
    '.bsv-pdf{width:min(1000px,100%);height:100%;border:0;border-radius:8px;background:#fff}',
    '.bsv-carte{display:flex;flex-direction:column;align-items:center;gap:12px;max-width:100%;padding:32px 28px;border-radius:20px;background:rgb(255 255 255/.07);text-align:center}',
    '.bsv-carte b{font-size:16px;word-break:break-word}',
    '.bsv-carte p{margin:0;opacity:.72}',
    '.bsv-carte audio{width:min(380px,76vw)}',
    '.bsv-nav{position:absolute;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:48px;height:48px;border:0;border-radius:50%;background:rgb(255 255 255/.13);color:#fff;cursor:pointer}',
    '.bsv-nav:hover,.bsv-nav:focus-visible{background:rgb(255 255 255/.26)}',
    '.bsv-nav[disabled]{opacity:.25;cursor:default}',
    '.bsv-nav.prec{left:14px}',
    '.bsv-nav.suiv{right:14px}',
    '@media (max-width:640px){.bsv-scene{padding:4px 4px 84px}.bsv-nav{top:auto;bottom:max(18px,env(safe-area-inset-bottom));transform:none}.bsv-nav.prec{left:calc(50% - 60px)}.bsv-nav.suiv{right:calc(50% - 60px)}}',
    '.bsm-img img{display:block;width:100%;max-height:260px;object-fit:cover}',
    '.bsm-doc{display:flex;align-items:center;gap:10px;margin:2px 0 4px;padding:8px 10px;border-radius:12px;background:rgb(127 127 127/.12);color:inherit;text-decoration:none;min-width:200px;max-width:300px}',
    '.bsm-doc:hover{background:rgb(127 127 127/.2)}',
    '.bsm-doc-ic{position:relative;flex:none;display:grid;place-items:center;width:36px;height:40px}',
    '.bsm-doc-ic i{position:absolute;bottom:3px;font-style:normal;font-size:8px;font-weight:800;letter-spacing:.02em}',
    '.bsm-doc-t{flex:1;min-width:0;display:flex;flex-direction:column}',
    '.bsm-doc-t b{font-size:.86em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bsm-doc-t small{font-size:.72em;opacity:.7}',
    '.bsm-envoi{display:flex;align-items:center;gap:8px;margin:6px 16px 0;font-size:.8em;color:var(--text-2)}',
    '.bsm-envoi .bsm-spin{width:14px;height:14px;border-width:2px}',
    '.bsm-main.depot{outline:2px dashed var(--accent);outline-offset:-8px;border-radius:16px}',
    '.bsm-compose{display:flex;align-items:flex-end;gap:8px;margin:8px 16px 0;padding:6px 6px 6px 14px;border-radius:16px;background:var(--surface-2);border:1px solid var(--border);transition:border-color .2s,box-shadow .2s}',
    '.bsm-compose:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft),0 0 26px -10px var(--accent)}',
    '.bsm-input{flex:1;resize:none;border:0;background:none;outline:none;color:var(--text);font:inherit;font-size:.95em;line-height:1.45;padding:7px 0;max-height:160px}',
    '.bsm-send{flex:none;width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--aur-1,var(--accent)),var(--aur-2,var(--accent)));box-shadow:0 8px 18px -10px var(--accent);transition:transform .15s}',
    '.bsm-send:hover{transform:translateY(-1px)}',
    '.bsm-send:active{transform:scale(.94)}',
    '.bsm-hint{margin:6px 18px 12px;font-size:.7em;color:var(--text-3)}',
    '.bsm-vide{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:40px 20px;color:var(--text-3)}',
    '.bsm-vide h2{margin:4px 0 0;font-size:1.1em;color:var(--text)}',
    '.bsm-vide p{margin:0;max-width:420px;font-size:.9em}',
    '.bsm-debut .bsm-av{width:64px;height:64px;border-radius:20px;font-size:1.2em}',
    '.bsm-spin{display:inline-block;width:18px;height:18px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:bsmSpin .7s linear infinite}',
    '@keyframes bsmSpin{to{transform:rotate(360deg)}}',
    // Rubrique Visio
    '.bsm-h2{display:flex;align-items:center;gap:8px;margin:22px 0 10px;font-size:.78em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text-3)}',
    '.bsm-rooms{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr));gap:12px}',
    '.bsm-room{display:flex;align-items:center;gap:12px;padding:14px;border-radius:18px;background:var(--aur-glass,var(--surface));border:1px solid var(--aur-hair,var(--border));-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);text-align:left;min-width:0}',
    '.bsm-room.live{border-color:rgb(16 185 129/.45);box-shadow:0 0 0 1px rgb(16 185 129/.15),0 16px 40px -24px rgb(16 185 129/.9)}',
    '.bsm-room-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}',
    '.bsm-room-t b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsm-room-t span{font-size:.82em;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.bsm-room-new{border-style:dashed;cursor:pointer;transition:border-color .2s}',
    '.bsm-room-new:hover{border-color:var(--accent)}',
    '.bsm-note{display:flex;gap:8px;align-items:flex-start;margin:22px 0 0;font-size:.8em;color:var(--text-3);max-width:720px}',
    '.bsm-note svg{flex:none;margin-top:2px}',
    '.bsm-side-act .btn-sm{gap:5px}',
    // Fenêtre (groupe, message direct)
    '.bsm-overlay{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:16px}',
    '.bsm-modal.large{width:min(1000px,100%)}',
    '.bsm-auteur small{font-weight:600;opacity:.6;margin-left:6px;font-size:.92em}',
    // Organigramme : lignes qui relient chaque membre à son responsable, vue zoomable qui montre toute l'équipe.
    '.bsm-modal.org{width:min(1320px,100%);height:min(860px,calc(100dvh - 32px));overflow:hidden}',
    '.bso-tete{display:flex;align-items:flex-end;justify-content:space-between;gap:12px 20px;flex-wrap:wrap}',
    '.bso-tete h2{margin:0;font-size:1.25em}',
    '.bso-tete p{margin:4px 0 0;color:var(--text-3);font-size:.9em}',
    '.bso-stats{display:flex;gap:6px;flex-wrap:wrap}',
    '.bso-stats span{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);font-size:.8em;color:var(--text-2)}',
    '.bso-stats b{color:var(--text);font-weight:750}',
    '.bso-stats .on i{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgb(34 197 94/.2)}',
    '.bso-vue{position:relative;flex:1;min-height:300px;overflow:hidden;border-radius:16px;border:1px solid var(--border);cursor:grab;touch-action:none;user-select:none;' +
      'background:radial-gradient(120% 80% at 50% 0%,rgb(var(--accent-rgb,56 124 213)/.10),transparent 60%),radial-gradient(circle at 1px 1px,color-mix(in srgb,var(--text) 9%,transparent) 1px,transparent 1.5px) 0 0/22px 22px,var(--surface-2)}',
    '.bso-vue.glisse{cursor:grabbing}',
    '.bso-vue.glisse .bso-carte{pointer-events:none}',
    '.bso{position:absolute;left:0;top:0;transform-origin:0 0;width:max-content;transition:transform .35s cubic-bezier(.2,.8,.2,1)}',
    '.bso-vue.glisse .bso{transition:none}',
    '.bso-zoom{position:absolute;right:12px;bottom:12px;display:flex;gap:2px;padding:3px;border-radius:12px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 80%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}',
    '.bso-zoom button{min-width:32px;height:30px;padding:0 8px;border:0;border-radius:9px;background:none;color:var(--text);font:inherit;font-size:17px;font-weight:600;cursor:pointer}',
    '.bso-zoom button.txt{font-size:12.5px}',
    '.bso-zoom button:hover{background:rgb(var(--text-rgb,148 163 184)/.1)}',
    '.bso-zoom button.actif{color:var(--accent-text,rgb(var(--accent-rgb)))}',
    '.bso-aide{position:absolute;left:14px;bottom:14px;font-size:.74em;color:var(--text-3);pointer-events:none}',
    '@media (max-width:760px){.bso-aide{display:none}}',
    '.bso ul{display:flex;justify-content:center;padding-top:26px;position:relative;margin:0;list-style:none;padding-left:0}',
    '.bso>ul{padding-top:0}',
    '.bso li{position:relative;display:flex;flex-direction:column;align-items:center;padding:26px 9px 0}',
    '.bso>ul>li{padding-top:0}',
    '.bso li::before,.bso li::after{content:"";position:absolute;top:0;width:50%;height:26px;border-top:2px solid var(--bso-ligne)}',
    '.bso{--bso-ligne:color-mix(in srgb,rgb(var(--accent-rgb,56 124 213)) 45%,var(--border))}',
    '.bso li::before{right:50%}.bso li::after{left:50%;border-left:2px solid var(--bso-ligne)}',
    '.bso li:only-child::before,.bso li:only-child::after{border-top:0}',
    '.bso li:first-child::before,.bso li:last-child::after{border-top:0}',
    '.bso li:last-child::before{border-right:2px solid var(--bso-ligne);border-radius:0 12px 0 0}',
    '.bso li:first-child::after{border-radius:12px 0 0 0}',
    '.bso li:only-child::before{display:none}',
    '.bso li:only-child::after{border-radius:0}',
    '.bso>ul>li::before,.bso>ul>li::after{display:none}',
    '.bso ul ul::before{content:"";position:absolute;top:0;left:50%;height:26px;border-left:2px solid var(--bso-ligne)}',
    // Équipe sans sous-équipe : en colonne, reliée par un trait vertical.
    '.bso ul.pile{flex-direction:column;align-items:center;gap:0}',
    '.bso ul.pile>li{padding:12px 0 0}',
    '.bso ul.pile>li:first-child{padding-top:0}',
    '.bso ul.pile>li::before{display:none}',
    '.bso ul.pile>li::after{left:50%;width:0;height:12px;border:0;border-left:2px solid var(--bso-ligne);border-radius:0}',
    '.bso ul.pile>li:first-child::after{display:none}',
    // Petit écran : liste en retrait, reliée par un trait à gauche.
    '.bso-vue.liste{overflow:auto;cursor:auto;touch-action:auto;user-select:auto}',
    '.bso-vue.liste .bso-zoom,.bso-vue.liste .bso-aide{display:none}',
    '.bso-vue.liste .bso{position:static;transform:none!important;width:auto;padding:12px 12px 16px}',
    '.bso-vue.liste .bso ul{display:block;margin:0 0 0 19px;padding:0 0 0 18px;border-left:2px solid var(--bso-ligne)}',
    '.bso-vue.liste .bso>ul{margin:0;padding:0;border:0}',
    '.bso-vue.liste .bso li{display:block;padding:10px 0 0}',
    '.bso-vue.liste .bso>ul>li{padding:0}',
    '.bso-vue.liste .bso li::before,.bso-vue.liste .bso li::after,.bso-vue.liste .bso ul ul::before{display:none!important}',
    '.bso-vue.liste .bso-carte,.bso-vue.liste .bso-carte.tete{width:100%}',
    '.bso-vue.liste .bso ul .bso-carte::before{content:"";position:absolute;left:-20px;top:50%;width:18px;border-top:2px solid var(--bso-ligne)}',
    '@media (max-width:1023px){.bsm-modal.org{height:100%;max-height:100%;padding:16px}}',
    '.bso-carte{position:relative;display:flex;align-items:center;gap:11px;width:214px;padding:11px 12px;border-radius:16px;background:color-mix(in srgb,var(--surface) 88%,transparent);border:1px solid var(--border);text-align:left;color:var(--text);cursor:pointer;box-shadow:0 10px 24px -14px rgb(0 0 0/.55);transition:border-color .15s,transform .15s,box-shadow .15s}',
    '.bso-carte[data-dm]:hover{border-color:rgb(var(--accent-rgb)/.75);transform:translateY(-2px);box-shadow:0 16px 30px -14px rgb(var(--accent-rgb)/.55)}',
    '.bso-carte.moi{border-color:color-mix(in srgb,var(--accent) 60%,var(--border));cursor:default}',
    '.bso-carte.tete{width:236px;padding:13px 14px;background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(120deg,var(--aur-3,#22d3ee),rgb(var(--accent-rgb)),var(--aur-2,#8b5cf6)) border-box;border:1.5px solid transparent;box-shadow:0 18px 40px -16px rgb(var(--accent-rgb)/.7)}',
    '.bso-carte.tete .bsm-av{width:46px;height:46px;border-radius:14px}',
    '.bso-carte .bsm-av{width:40px;height:40px}',
    '.bso-t{display:flex;flex-direction:column;align-items:flex-start;min-width:0;gap:1px}',
    '.bso-t b{max-width:100%;font-size:.9em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bso-t b small{font-weight:600;opacity:.6}',
    '.bso-t em{max-width:100%;font-style:normal;font-size:.76em;color:var(--accent-text,var(--accent));font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bso-nb{margin-top:4px;padding:1px 7px;border-radius:999px;font-size:.68em;font-weight:700;color:var(--text-2);background:rgb(var(--text-rgb,148 163 184)/.1)}',
    '.bsm-modal{width:min(480px,100%);max-height:calc(100dvh - 32px);overflow:auto;padding:22px;border-radius:var(--radius-lg,16px)!important;display:flex;flex-direction:column;gap:12px}',
    '.bsm-modal h2{margin:0;font-size:1.2em}',
    '.bsm-modal>p{margin:-6px 0 0;color:var(--text-3);font-size:.9em}',
    '.bsm-lbl{display:flex;flex-direction:column;gap:6px;font-size:.84em;font-weight:600;color:var(--text-2)}',
    '.bsm-pick{display:flex;flex-direction:column;gap:4px;max-height:260px;overflow:auto}',
    '.bsm-pick-i{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2);text-align:left;cursor:pointer;width:100%}',
    '.bsm-pick-i>span:not(.bsm-av){flex:1;min-width:0;display:flex;flex-direction:column;font-weight:600;font-size:.92em}',
    '.bsm-pick-i small{font-weight:500;color:var(--text-3);font-size:.8em}',
    '.bsm-pick-i input{width:18px;height:18px;accent-color:var(--accent)}',
    '.bsm-pick-i.deja{opacity:.6;cursor:default}',
    '.bsm-pick-i:hover{border-color:var(--border-2)}',
    '.bsm-modal-foot{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:6px;flex-wrap:wrap}',
    '.bsm-modal-foot .grow{flex:1}',
    '.bsm-err{padding:10px 12px;border-radius:10px;background:rgb(244 63 94/.1);border:1px solid rgb(244 63 94/.35);font-size:.88em;font-weight:600}',
    // Cartes d'annonce
    // Bannières façon iPhone (iOS), en haut au centre.
    '#bsm-cartes{position:fixed;top:calc(10px + env(safe-area-inset-top));left:50%;z-index:160;width:min(410px,calc(100vw - 16px));height:0;transform:translateX(-50%);pointer-events:none}',
    '.bsm-carte{--rang:0;position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:11px;min-height:66px;padding:11px 14px 11px 11px;border-radius:24px;pointer-events:auto;cursor:pointer;user-select:none;touch-action:none;' +
      'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:#fff;' +
      'background:rgb(30 30 32/.62);-webkit-backdrop-filter:blur(30px) saturate(190%);backdrop-filter:blur(30px) saturate(190%);' +
      'box-shadow:0 10px 40px rgb(0 0 0/.32),inset 0 0 0 .5px rgb(255 255 255/.14);' +
      'transform:translateY(calc(var(--rang) * 11px)) scale(calc(1 - var(--rang) * .06));transform-origin:50% 100%;' +
      'transition:transform .45s cubic-bezier(.32,1.3,.5,1),opacity .3s,filter .3s;animation:bsmIos .62s cubic-bezier(.3,1.35,.45,1)}',
    '[data-scheme=light] .bsm-carte{color:#000;background:rgb(246 246 248/.72);box-shadow:0 10px 40px rgb(0 0 0/.16),inset 0 0 0 .5px rgb(0 0 0/.06)}',
    '.bsm-carte.derriere{pointer-events:none;background:rgb(72 72 78/.5);box-shadow:0 6px 20px rgb(0 0 0/.25),inset 0 0 0 .5px rgb(255 255 255/.12)}',
    '[data-scheme=light] .bsm-carte.derriere{background:rgb(255 255 255/.55)}',
    '.bsm-carte.derriere>*{opacity:0;transition:opacity .2s}',
    '.bsm-carte:nth-child(n+4){opacity:0}',
    '.bsm-carte.tire{transition:none}',
    '.bsm-carte.out{opacity:0;transform:translateY(-14px) scale(.96);transition:transform .32s cubic-bezier(.4,0,.6,1),opacity .28s}',
    '.bsm-carte.out.haut{transform:translateY(-120%)}',
    '.bsm-carte:focus-visible{outline:2px solid rgb(10 132 255);outline-offset:2px}',
    '@keyframes bsmIos{from{opacity:.4;transform:translateY(-130%) scale(.98)}}',
    '.bsm-ios-ic{position:relative;flex:none;width:40px;height:40px;display:grid;place-items:center}',
    '.bsm-ios-ic.pers .bsm-av{width:40px;height:40px;border-radius:50%;font-size:14px}',
    '.bsm-ios-ic.pers .bsm-pres{display:none}',
    '.bsm-ios-ic.app,.bsm-ios-ic .app{border-radius:10px;background:linear-gradient(150deg,#4f8cdb,#2a4fd6 55%,#7c5cff);color:#fff;box-shadow:inset 0 0 0 .5px rgb(255 255 255/.25)}',
    '.bsm-ios-ic.app svg{width:26px;height:26px}',
    '.bsm-ios-ic.app.vert{background:linear-gradient(160deg,#5fe07a,#28c840 60%,#1fa337)}',
    '.bsm-ios-ic .app{position:absolute;right:-3px;bottom:-3px;width:17px;height:17px;border-radius:5px;display:grid;place-items:center;box-shadow:0 0 0 1.5px rgb(30 30 32/.9)}',
    '[data-scheme=light] .bsm-ios-ic .app{box-shadow:0 0 0 1.5px rgb(246 246 248)}',
    '.bsm-ios-ic .app.ok{background:linear-gradient(160deg,#4aa3ff,#0a84ff)}',
    '.bsm-ios-ic .app.ok svg{width:12px;height:12px}',
    '.bsm-ios-ic.app .app.ok{right:-4px;bottom:-4px}',
    '.bsm-carte.envoye .l1 time{color:#0a84ff;font-weight:600}',
    '[data-scheme=light] .bsm-carte.envoye .l1 time{color:#0a6fe0}',
    '.bsm-ios-ic .app svg{width:12px;height:12px}',
    '.bsm-ios-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;font-size:15px;line-height:1.27;letter-spacing:-.012em}',
    '.bsm-ios-t .l1{display:flex;align-items:baseline;gap:8px}',
    '.bsm-ios-t .l1 b{flex:1;min-width:0;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bsm-ios-t time{flex:none;font-size:13px;letter-spacing:0;color:rgb(235 235 245/.55)}',
    '[data-scheme=light] .bsm-ios-t time{color:rgb(60 60 67/.6)}',
    '.bsm-ios-t .l2{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bsm-ios-t .l3{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;word-break:break-word}',
    '.bsm-ios-appel{display:flex;gap:10px;flex:none}',
    '.bsm-ios-appel button{width:40px;height:40px;border-radius:50%;border:0;display:grid;place-items:center;color:#fff;cursor:pointer}',
    '.bsm-ios-appel .non{background:#ff3b30}.bsm-ios-appel .oui{background:#34c759}',
    '.bsm-ios-appel button:active{filter:brightness(.85)}',
    '.bsm-carte.sonne .bsm-ios-ic{animation:bsmSonne 1.5s ease-out infinite;border-radius:10px}',
    '@keyframes bsmSonne{0%{box-shadow:0 0 0 0 rgb(52 199 89/.55)}70%{box-shadow:0 0 0 12px rgb(52 199 89/0)}100%{box-shadow:0 0 0 0 rgb(52 199 89/0)}}',
    '@media (prefers-reduced-motion:reduce){.bsm-carte.sonne .bsm-ios-ic{animation:none}}',
    '@keyframes bsmIn{from{opacity:0;transform:translateY(14px) scale(.96)}}',
    // Visio
    '.bsm-call{position:fixed;inset:12px;z-index:110;display:flex;flex-direction:column;border-radius:24px;overflow:hidden;color:#fff;background:radial-gradient(80% 60% at 20% 0%,color-mix(in srgb,var(--aur-1,#387cd5) 30%,transparent),transparent 70%),radial-gradient(70% 60% at 100% 100%,color-mix(in srgb,var(--aur-2,#8b5cf6) 26%,transparent),transparent 70%),#05080f;box-shadow:0 40px 120px -30px rgb(0 0 0/.9),0 0 0 1px rgb(255 255 255/.08);animation:bsmIn .35s cubic-bezier(.2,1.1,.4,1)}',
    '.bsm-call-top{display:flex;align-items:center;gap:10px;padding:14px 16px;font-size:.92em}',
    '.bsm-call-top .grow{flex:1}',
    '.bsm-rec{width:9px;height:9px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 4px rgb(239 68 68/.25);animation:bsmPulse 1.6s ease-in-out infinite}',
    '@keyframes bsmPulse{50%{opacity:.4}}',
    '.bsm-chrono{font-variant-numeric:tabular-nums;color:rgb(255 255 255/.7)}',
    '.bsm-call-n{color:rgb(255 255 255/.55);font-size:.9em}',
    '.bsm-grid{flex:1;display:grid;gap:10px;padding:0 14px;min-height:0;grid-auto-rows:1fr}',
    '.bsm-grid.n1{grid-template-columns:1fr}',
    '.bsm-grid.n2{grid-template-columns:1fr 1fr}',
    '.bsm-grid.n3,.bsm-grid.n4{grid-template-columns:1fr 1fr}',
    '.bsm-grid.n5,.bsm-grid.n6{grid-template-columns:repeat(3,1fr)}',
    '@media (max-width:720px){.bsm-grid.n2{grid-template-columns:1fr}.bsm-grid.n5,.bsm-grid.n6{grid-template-columns:1fr 1fr}}',
    '.bsm-tile{position:relative;border-radius:18px;overflow:hidden;background:rgb(255 255 255/.04);border:1px solid rgb(255 255 255/.08);min-height:0}',
    '.bsm-tile video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}',
    '.bsm-tile.moi video{transform:scaleX(-1)}',
    '.bsm-tile.sans video{opacity:0}',
    '.bsm-tile-av{position:absolute;inset:0;display:none;place-items:center}',
    '.bsm-tile.sans .bsm-tile-av{display:grid}',
    '.bsm-tile-n{position:absolute;left:10px;bottom:10px;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;background:rgb(0 0 0/.55);backdrop-filter:blur(8px);font-size:.8em;font-weight:600}',
    '.bsm-tile-err{position:absolute;left:10px;top:10px;padding:4px 10px;border-radius:99px;background:rgb(239 68 68/.85);font-size:.75em;font-weight:600}',
    '.bsm-call-wait{flex:1;display:flex;align-items:center;justify-content:center;gap:12px;color:rgb(255 255 255/.75)}',
    '.bsm-call-bar{display:flex;justify-content:center;gap:12px;padding:16px}',
    '.bsm-cb{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;color:#fff;background:rgb(255 255 255/.1);border:1px solid rgb(255 255 255/.12);transition:background-color .15s,transform .15s}',
    '.bsm-cb:hover{background:rgb(255 255 255/.18);transform:translateY(-1px)}',
    '.bsm-cb.off{background:#fff;color:#0b1220}',
    '.bsm-cb.actif{background:linear-gradient(135deg,var(--aur-1,#387cd5),var(--aur-2,#8b5cf6));border-color:transparent}',
    '.bsm-cb.rouge{background:#ef4444;border-color:transparent;width:64px}',
    '.bsm-cb.rouge:hover{background:#dc2626}',
    '.bsm-call-top .bsm-cb{width:38px;height:38px;border-radius:12px}',
    '.bsm-call-seul{text-align:center;margin:-6px 16px 14px;font-size:.82em;color:rgb(255 255 255/.6)}',
    '.bsm-call.reduit{inset:auto 16px 16px auto;width:min(340px,calc(100vw - 32px));height:auto;border-radius:20px}',
    '.bsm-call.reduit .bsm-grid{grid-template-columns:repeat(2,1fr)!important;grid-auto-rows:96px;padding:0 10px}',
    '.bsm-call.reduit .bsm-grid.n1{grid-template-columns:1fr!important;grid-auto-rows:170px}',
    '.bsm-call.reduit .bsm-call-n,.bsm-call.reduit .bsm-call-seul,.bsm-call.reduit .bsm-tile-av .bsm-av{display:none}',
    '.bsm-call.reduit .bsm-call-bar{padding:10px;gap:8px}',
    '.bsm-call.reduit .bsm-cb{width:42px;height:42px;border-radius:14px}',
    '.bsm-call.reduit .bsm-cb.rouge{width:52px}',
    '.bsm-call.reduit .bsm-call-top{padding:10px 12px}',
    '@media (max-width:1023px){.bsm-call{inset:0;border-radius:0}.bsm-call.reduit{bottom:calc(76px + env(safe-area-inset-bottom))}}',
    '[data-motion=reduced] .bsm-rec,[data-motion=reduced] .bsm-carte,[data-motion=reduced] .bsm-call{animation:none}',
    '@media (prefers-reduced-motion:reduce){.bsm-rec,.bsm-carte,.bsm-call{animation:none}}',
    // Téléphone : une colonne à la fois
    '@media (max-width:820px){.bsm-shell{grid-template-columns:1fr;height:calc(100dvh - var(--topbar-h,60px) - 110px)}.bsm-shell.liste .bsm-main{display:none}.bsm-shell.fil .bsm-side{display:none}.bsm-back{display:inline-flex}.bsm-stack,.bsm-hint{display:none}.bsm-visio .btn-label{display:none}.bsm-msg{max-width:92%}.bsm-scroll{padding:14px 12px 8px}.bsm-compose{margin:8px 10px 10px}}',
  ].join('\n');
  function ensureCss() {
    if (document.getElementById('bs-messages-css')) return;
    var s = document.createElement('style'); s.id = 'bs-messages-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  // Démarre le temps réel dès que le CRM est prêt (non-lus et annonces partout, pas seulement dans la rubrique).
  function auto() { if (serveur()) setTimeout(demarrer, 1200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();

  window.bsMessages = { monter: monter, appel: Appel, sonnerie: Sonnerie, visionneuse: Vue,
    organigramme: function () { orgV.auto = true; S.modal = { type: 'organigramme' }; if (location.hash !== '#/messages') location.hash = '#/messages'; else rendre(); }, etat: function () { return S; } };
})();
