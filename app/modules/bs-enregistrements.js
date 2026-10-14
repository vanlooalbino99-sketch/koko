/* Blackstart CRM : enregistrements d'appels envoyés au serveur (version équipe).
 *
 * - Chaque nouvel enregistrement (Outils › Enregistrements) part aussi sur le serveur, pour son auteur.
 * - Les administrateurs écoutent, téléchargent et suppriment ceux de toute l'équipe, avec un filtre par membre.
 * - Un membre voit ce qu'il a envoyé ; ses enregistrements plus anciens, restés sur l'appareil, partent d'un clic.
 * Version autonome (sans serveur) : rien ne change, tout reste sur l'appareil.
 */
(function () {
  'use strict';
  if (window.bsEnreg) return;

  var CONF = window.BS_SERVER && typeof window.BS_SERVER === 'object' ? window.BS_SERVER : null;
  var USER = CONF && CONF.user ? CONF.user : null;
  var API = '/api/enregistrements';
  var H = { 'X-Requested-With': 'blackstart' };
  // Seuls les enregistrements faits à partir de cette version partent tout seuls ; les plus anciens, sur demande.
  var DEBUT = (function () {
    var k = 'bs-enreg-debut', v = null;
    try { v = localStorage.getItem(k); if (!v) { v = new Date().toISOString(); localStorage.setItem(k, v); } } catch (e) { v = new Date().toISOString(); }
    return v;
  })();
  var envoiEnCours = {};

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function duree(s) { s = Math.round(Number(s) || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function taille(n) { n = Number(n) || 0; return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko'; }
  function quand(iso) { try { return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function json(r) { return r.json().catch(function () { return {}; }).then(function (b) { if (!r.ok) throw new Error(b.error || 'Erreur ' + r.status); return b; }); }
  function signaler() { try { window.dispatchEvent(new CustomEvent('bs:enreg')); } catch (e) { /* vieux navigateur */ } }

  function envoyer(t, blob) {
    if (!USER || !t || !t.id || !blob || envoiEnCours[t.id]) return Promise.resolve(false);
    envoiEnCours[t.id] = true;
    var mime = String(blob.type || t.mime || 'audio/webm').split(';')[0];
    var q = '?id=' + encodeURIComponent(t.id) + '&nom=' + encodeURIComponent(t.name || '') + '&prospect=' + encodeURIComponent(t.prospectName || '') +
      '&prospectId=' + encodeURIComponent(t.prospectId || '') + '&duree=' + encodeURIComponent(t.duration || 0) + '&date=' + encodeURIComponent(t.ts || new Date().toISOString());
    return fetch(API + q, { method: 'POST', credentials: 'same-origin', headers: { 'X-Requested-With': 'blackstart', 'Content-Type': mime }, body: blob })
      .then(json).then(function () { delete envoiEnCours[t.id]; signaler(); return true; })
      .catch(function () { delete envoiEnCours[t.id]; return false; });
  }

  function locaux() {
    var R = window.__bsRec;
    return R && R.liste ? R.liste().filter(function (x) { return x.kind === 'recording'; }) : [];
  }
  function mesIds() {
    return fetch(API + '?membre=' + encodeURIComponent(USER.id), { credentials: 'same-origin', headers: H }).then(json)
      .then(function (b) { var s = {}; (b.enregistrements || []).forEach(function (x) { s[x.id] = 1; }); return s; });
  }
  // Envoie ceux de l'appareil qui manquent sur le serveur (tous, ou seulement les récents).
  function rattraper(tous) {
    var liste = locaux().filter(function (x) { return tous || (x.ts || '') >= DEBUT; });
    if (!liste.length) return Promise.resolve(0);
    return mesIds().then(function (ids) {
      var manque = liste.filter(function (x) { return !ids[x.id]; }), n = 0;
      return manque.reduce(function (p, x) {
        return p.then(function () { return window.__bsRec.blob(x.id); }).then(function (b) { return b ? envoyer(x, b) : false; }).then(function (ok) { if (ok) n++; });
      }, Promise.resolve()).then(function () { return n; });
    });
  }

  var CSS = '.bse-enr{border-top:1px solid var(--border,rgba(127,127,127,.2));padding:14px 16px;display:flex;flex-direction:column;gap:10px}' +
    '.bse-enr-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.bse-enr-h b{flex:1;min-width:180px}' +
    '.bse-enr-h .select{max-width:220px}.bse-enr-hint{font-size:12.5px;opacity:.7;margin:0}' +
    '.bse-enr-l{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid var(--border,rgba(127,127,127,.12))}' +
    '.bse-enr-l:last-child{border-bottom:0}.bse-enr-m{flex:1;min-width:160px}.bse-enr-m b{display:block}.bse-enr-m small{opacity:.7}' +
    '.bse-enr-l audio{width:100%;height:36px}.bse-enr-a{display:flex;gap:6px;flex-wrap:wrap}' +
    '.bse-enr-msg{font-size:13px}.bse-enr-msg.err{color:var(--danger,#dc2626)}.bse-enr-msg.ok{color:var(--success,#16a34a)}';
  function css() {
    if (document.getElementById('bs-enreg-css')) return;
    var s = document.createElement('style'); s.id = 'bs-enreg-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function monter(el) {
    if (!USER || !el || el.__bsEnreg) return;
    el.__bsEnreg = true;
    css();
    var admin = USER.role === 'admin';
    var st = { liste: null, membre: '', membres: [], joue: null, msg: null, attente: 0 };

    function charger() {
      fetch(API + (admin && st.membre ? '?membre=' + encodeURIComponent(st.membre) : ''), { credentials: 'same-origin', headers: H }).then(json)
        .then(function (b) { st.liste = b.enregistrements || []; return mesIds(); })
        .then(function (ids) { st.attente = locaux().filter(function (x) { return !ids[x.id]; }).length; rendre(); })
        .catch(function (e) { st.msg = { t: e.message, k: 'err' }; rendre(); });
    }
    function rendre() {
      if (!el.isConnected) return;
      var lignes = (st.liste || []).map(function (x) {
        var src = API + '/' + encodeURIComponent(x.id);
        return '<div class="bse-enr-l"><div class="bse-enr-m"><b>' + esc(x.prospect || 'Sans prospect') + '</b><small>' +
          (admin ? esc(x.auteur) + ' · ' : '') + esc(quand(x.date)) + ' · ' + duree(x.duree) + ' · ' + taille(x.taille) + '</small></div>' +
          '<div class="bse-enr-a">' + (st.joue === x.id ? '' : '<button type="button" class="btn btn-secondary btn-sm" data-enr-play="' + esc(x.id) + '">Écouter</button>') +
          '<a class="btn btn-ghost btn-sm" href="' + src + '?telecharger" download>Télécharger</a>' +
          (admin ? '<button type="button" class="btn btn-ghost btn-sm" data-enr-del="' + esc(x.id) + '">Supprimer</button>' : '') + '</div>' +
          (st.joue === x.id ? '<audio controls autoplay preload="metadata" src="' + src + '"></audio>' : '') + '</div>';
      }).join('');
      var filtre = admin ? '<select class="input select" data-enr-membre><option value="">Toute l’équipe</option>' + st.membres.map(function (m) {
        return '<option value="' + esc(m.id) + '"' + (m.id === st.membre ? ' selected' : '') + '>' + esc(m.name) + '</option>';
      }).join('') + '</select>' : '';
      el.innerHTML = '<div class="bse-enr"><div class="bse-enr-h"><b>' + (admin ? 'Enregistrements de l’équipe (serveur)' : 'Envoyés au serveur') + '</b>' + filtre + '</div>' +
        '<p class="bse-enr-hint">' + (admin ? 'Les enregistrements faits par chaque membre arrivent ici tout seuls.' : 'Vos nouveaux enregistrements partent aussi sur le serveur : les administrateurs de l’équipe peuvent les écouter.') + '</p>' +
        (st.attente ? '<div class="bse-enr-h"><span class="bse-enr-hint" style="flex:1">' + st.attente + ' enregistrement' + (st.attente > 1 ? 's' : '') + ' de cet appareil pas encore sur le serveur.</span>' +
          '<button type="button" class="btn btn-secondary btn-sm" data-enr-envoyer>Les envoyer</button></div>' : '') +
        (st.msg ? '<div class="bse-enr-msg ' + st.msg.k + '">' + esc(st.msg.t) + '</div>' : '') +
        (st.liste === null ? '<p class="bse-enr-hint">Chargement…</p>' : lignes || '<p class="bse-enr-hint">Aucun enregistrement sur le serveur' + (admin && st.membre ? ' pour ce membre' : '') + '.</p>') + '</div>';
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-enr-play],[data-enr-del],[data-enr-envoyer]');
      if (!b) return;
      if (b.hasAttribute('data-enr-play')) { st.joue = b.getAttribute('data-enr-play'); rendre(); return; }
      if (b.hasAttribute('data-enr-envoyer')) {
        st.msg = { t: 'Envoi en cours…', k: '' }; rendre();
        rattraper(true).then(function (n) { st.msg = { t: n + ' enregistrement' + (n > 1 ? 's envoyés' : ' envoyé') + ' au serveur.', k: 'ok' }; charger(); });
        return;
      }
      var id = b.getAttribute('data-enr-del');
      if (!window.confirm('Supprimer cet enregistrement du serveur ? (La copie sur l’appareil de son auteur reste.)')) return;
      fetch(API + '/' + encodeURIComponent(id), { method: 'DELETE', credentials: 'same-origin', headers: H }).then(json)
        .then(function () { st.msg = { t: 'Enregistrement supprimé du serveur.', k: 'ok' }; if (st.joue === id) st.joue = null; charger(); })
        .catch(function (er) { st.msg = { t: er.message, k: 'err' }; rendre(); });
    });
    el.addEventListener('change', function (e) {
      if (!e.target.hasAttribute('data-enr-membre')) return;
      st.membre = e.target.value; st.joue = null; st.liste = null; rendre(); charger();
    });
    window.addEventListener('bs:enreg', function () { if (el.isConnected) charger(); });
    if (admin) {
      fetch('/api/chat', { credentials: 'same-origin', headers: H }).then(json)
        .then(function (b) { st.membres = b.users || []; rendre(); }).catch(function () {});
    }
    rendre();
    charger();
  }

  // Au chargement : renvoie les enregistrements récents dont l'envoi avait échoué (hors connexion…).
  if (USER) setTimeout(function () { if (window.__bsRec) rattraper(false).catch(function () {}); }, 4000);

  window.bsEnreg = { envoyer: envoyer, monter: monter, rattraper: rattraper };
})();
