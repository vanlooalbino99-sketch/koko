// Page de connexion (et de création du premier compte administrateur), aux couleurs du CRM.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function loginPage({ needsSetup, retour = '/' }) {
  const title = needsSetup ? 'Créez le compte administrateur' : 'Connexion';
  const sub = needsSetup
    ? 'Premier lancement : ce compte gérera l’équipe, les ambiances et les sauvegardes.'
    : 'Connectez-vous pour retrouver les prospects, devis et relances de l’équipe.';
  const fields = needsSetup
    ? `<label>Nom<input name="name" autocomplete="name" required maxlength="80" placeholder="Prénom Nom"></label>
       <label>E-mail<input name="email" type="email" autocomplete="email" required placeholder="vous@entreprise.fr"></label>
       <label>Mot de passe<input name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="8 caractères au moins"></label>`
    : `<label>E-mail<input name="email" type="email" autocomplete="username" required autofocus placeholder="vous@entreprise.fr"></label>
       <label>Mot de passe<input name="password" type="password" autocomplete="current-password" required></label>`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Blackstart AI CRM</title>
<meta name="color-scheme" content="dark">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22528 168 484 474%22%3E%3Cdefs%3E%3ClinearGradient id=%22fg%22 x1=%220%22 y1=%220%22 x2=%220%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22#7d8494%22/%3E%3Cstop offset=%221%22 stop-color=%22#3b404c%22/%3E%3C/linearGradient%3E%3ClinearGradient id=%22fb%22 x1=%220.2%22 y1=%220%22 x2=%220.6%22 y2=%221%22%3E%3Cstop offset=%220%22 stop-color=%22#2bb0ff%22/%3E%3Cstop offset=%221%22 stop-color=%22#0b52e0%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=%22M566 350V209L828 402L566 595V450%22 fill=%22none%22 stroke=%22url%28#fg%29%22 stroke-width=%2258%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3Cpath d=%22M766 205H862L978 290V314L874 402L978 490V514L862 605H766%22 fill=%22none%22 stroke=%22url%28#fb%29%22 stroke-width=%2254%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>
  :root { --bg: #0a1220; --surface: #0f1b2e; --border: rgb(148 163 184 / .18); --text: #eaf1fb; --text-2: #a9bfdd; --accent: #387cd5; --bad: #f87171; }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; }
  body { display: grid; place-items: center; min-height: 100vh; padding: 24px 16px; position: relative; overflow: hidden; }
  .bg { position: fixed; inset: -4%; background: radial-gradient(60% 50% at 20% 0%, rgb(56 124 213 / .35), transparent 70%), radial-gradient(50% 50% at 100% 100%, rgb(99 102 241 / .22), transparent 70%), var(--bg); background-size: cover; background-position: center; animation: kb 40s ease-in-out infinite alternate; }
  .veil { position: fixed; inset: 0; background: linear-gradient(180deg, rgb(10 18 32 / .55), rgb(10 18 32 / .85)); }
  @keyframes kb { from { transform: scale(1.02); } to { transform: scale(1.12) translate(-2%, -1%); } }
  @media (prefers-reduced-motion: reduce) { .bg { animation: none; } }
  main { position: relative; width: min(420px, 100%); background: rgb(15 27 46 / .82); border: 1px solid var(--border); border-radius: 20px; padding: 30px 28px 26px; backdrop-filter: blur(18px) saturate(1.2); -webkit-backdrop-filter: blur(18px) saturate(1.2); box-shadow: 0 30px 80px -30px rgb(0 0 0 / .8); }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: .14em; font-size: 13px; }
  .brand .mark { width: 38px; height: 38px; overflow: visible; filter: drop-shadow(0 3px 8px rgb(11 82 224 / .4)); }
  .brand span { color: #73a3e1; }
  h1 { font-size: 23px; letter-spacing: -.02em; margin: 22px 0 6px; }
  p.sub { margin: 0 0 20px; color: var(--text-2); font-size: 14px; line-height: 1.5; }
  form { display: grid; gap: 14px; }
  label { display: grid; gap: 6px; font-size: 13px; font-weight: 600; color: var(--text-2); }
  input { font: inherit; font-size: 15px; color: var(--text); background: rgb(255 255 255 / .05); border: 1px solid var(--border); border-radius: 11px; padding: 11px 13px; outline: none; transition: border-color .15s, box-shadow .15s; }
  input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(56 124 213 / .25); }
  button { margin-top: 6px; font: inherit; font-weight: 700; font-size: 15px; color: #fff; background: linear-gradient(180deg, #4a8be0, var(--accent)); border: 0; border-radius: 11px; padding: 12px 16px; cursor: pointer; box-shadow: 0 10px 24px -12px var(--accent); }
  button:disabled { opacity: .6; cursor: default; }
  .err { min-height: 20px; color: var(--bad); font-size: 13.5px; font-weight: 600; }
  .foot { margin-top: 16px; color: var(--text-2); font-size: 12.5px; text-align: center; }
</style>
</head>
<body>
<div class="bg" id="bg"></div><div class="veil"></div>
<main>
  <div class="brand"><svg class="mark" viewBox="528 168 484 474" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f6"/><stop offset="1" stop-color="#9aa3b4"/></linearGradient><linearGradient id="lb" x1="0.2" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#2bb0ff"/><stop offset="1" stop-color="#0b52e0"/></linearGradient></defs><path d="M566 350V209L828 402L566 595V450" fill="none" stroke="url(#lg)" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/><path d="M766 205H862L978 290V314L874 402L978 490V514L862 605H766" fill="none" stroke="url(#lb)" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/></svg>BLACKSTART <span>AI</span></div>
  <h1>${esc(title)}</h1>
  <p class="sub">${esc(sub)}</p>
  <form id="f" novalidate>
    ${fields}
    <div class="err" id="err" role="alert"></div>
    <button type="submit">${needsSetup ? 'Créer le compte et ouvrir le CRM' : 'Se connecter'}</button>
  </form>
  <div class="foot">${needsSetup ? 'Vous pourrez ensuite inviter l’équipe dans Réglages › Équipe &amp; compte.' : 'Pas encore de compte ? Demandez-le à l’administrateur de l’équipe.'}</div>
</main>
<script>
(function () {
  var retour = ${JSON.stringify(retour).replace(/</g, '\\u003c')};
  var img = new Image();
  img.onload = function () { var bg = document.getElementById('bg'); bg.style.backgroundImage = 'url("/ambiance/connexion")'; };
  img.src = '/ambiance/connexion';
  var f = document.getElementById('f'), err = document.getElementById('err');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {}; new FormData(f).forEach(function (v, k) { data[k] = v; });
    var btn = f.querySelector('button'); btn.disabled = true; err.textContent = '';
    fetch(${JSON.stringify(needsSetup ? '/api/auth/setup' : '/api/auth/login')}, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' },
      body: JSON.stringify(data),
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { ok: r.ok, b: b }; }); })
      .then(function (x) {
        if (x.ok) { location.replace(retour); return; }
        err.textContent = x.b.error || 'Connexion impossible.'; btn.disabled = false;
      })
      .catch(function () { err.textContent = 'Serveur injoignable : vérifiez votre connexion.'; btn.disabled = false; });
  });
})();
</script>
</body>
</html>`;
}

// Retour après connexion : seulement un chemin de ce site (jamais une autre adresse).
export function safeReturn(v) {
  const s = String(v || '/');
  return s.startsWith('/') && !s.startsWith('//') && !s.startsWith('/\\') ? s : '/';
}
