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
<meta name="theme-color" content="#070b16">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23387CD5'/%3E%3Ctext x='32' y='44' font-family='Arial,sans-serif' font-size='34' font-weight='900' fill='white' text-anchor='middle'%3EB%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap">
<style>
  @property --ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
  :root {
    --bg: #070b16; --text: #eef3fc; --text-2: #a6b4cc; --text-3: #6f7d96; --bad: #fb7185;
    --accent: #387cd5; --a1: #387cd5; --a2: #8b5cf6; --a3: #22d3ee;
    --hair: rgb(255 255 255 / .09); --glass: rgb(14 22 40 / .62);
    --grad: linear-gradient(118deg, var(--a1), #6a6be8 60%, var(--a2));
    --display: "Sora", Inter, system-ui, sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  body { min-height: 100vh; min-height: 100dvh; position: relative; overflow-x: hidden; }

  /* Ciel : image d'ambiance de l'équipe si elle existe, sinon aurore animée. */
  .bg { position: fixed; inset: -4%; background-size: cover; background-position: center; animation: kb 40s ease-in-out infinite alternate; }
  .sky { position: fixed; inset: -20vmax; pointer-events: none; filter: blur(48px); }
  .sky i { position: absolute; border-radius: 50%; opacity: .75; animation: drift 22s ease-in-out infinite alternate; }
  .sky i:nth-child(1) { width: 52vmax; height: 40vmax; left: 8%; top: 4%; background: radial-gradient(closest-side, rgb(56 124 213 / .75), transparent); }
  .sky i:nth-child(2) { width: 46vmax; height: 38vmax; right: 6%; top: 12%; background: radial-gradient(closest-side, rgb(139 92 246 / .65), transparent); animation-duration: 28s; animation-direction: alternate-reverse; }
  .sky i:nth-child(3) { width: 44vmax; height: 30vmax; left: 34%; bottom: 6%; background: radial-gradient(closest-side, rgb(34 211 238 / .38), transparent); animation-duration: 34s; }
  .grid { position: fixed; inset: 0; pointer-events: none; background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / .14) 1px, transparent 1.4px); background-size: 28px 28px; -webkit-mask-image: radial-gradient(90% 70% at 50% 40%, #000, transparent 80%); mask-image: radial-gradient(90% 70% at 50% 40%, #000, transparent 80%); opacity: .55; }
  .veil { position: fixed; inset: 0; background: radial-gradient(120% 90% at 50% 0%, rgb(7 11 22 / .15), rgb(7 11 22 / .7)); }
  body.photo .sky, body.photo .grid { display: none; }
  body.photo .veil { background: linear-gradient(180deg, rgb(7 11 22 / .55), rgb(7 11 22 / .85)); }
  @keyframes kb { from { transform: scale(1.02); } to { transform: scale(1.12) translate(-2%, -1%); } }
  @keyframes drift { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(6%, 5%, 0) scale(1.12); } }

  .wrap { position: relative; z-index: 1; min-height: 100vh; min-height: 100dvh; display: grid; grid-template-columns: minmax(0, 1fr); align-items: center; gap: 40px; width: min(1180px, 100%); margin: 0 auto; padding: 32px 16px; }
  @media (min-width: 980px) { .wrap { grid-template-columns: minmax(0, 1.1fr) minmax(0, 440px); gap: 64px; padding: 48px 40px; } }

  .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: .14em; font-size: 13px; }
  .brand i { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; font-style: normal; letter-spacing: 0; font-size: 18px; background: linear-gradient(135deg, var(--accent), #2868bc); box-shadow: 0 8px 20px -8px var(--accent); }
  .brand span { color: #73a3e1; }
  @keyframes spin { to { --ang: 360deg; } }

  /* Colonne vitrine */
  .pitch h2 { font-family: var(--display); font-weight: 700; font-size: clamp(34px, 4.6vw, 58px); line-height: 1.04; letter-spacing: -.045em; word-spacing: .08em; margin: 34px 0 18px; }
  .pitch h2 em { font-style: normal; background: linear-gradient(100deg, var(--a3), var(--a1) 45%, var(--a2) 90%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .pitch p { color: var(--text-2); font-size: 16.5px; line-height: 1.6; max-width: 34em; margin: 0; }
  .feats { display: flex; flex-wrap: wrap; gap: 10px; margin: 26px 0 0; padding: 0; list-style: none; }
  .feats li { display: inline-flex; align-items: center; gap: 8px; padding: 8px 13px; border-radius: 99px; font-size: 13.5px; font-weight: 600; color: var(--text); background: rgb(255 255 255 / .05); border: 1px solid var(--hair); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
  .feats li i { width: 7px; height: 7px; border-radius: 50%; background: var(--c); box-shadow: 0 0 10px var(--c); }

  .scene { position: relative; height: 250px; margin-top: 38px; perspective: 1200px; }
  .panel { position: absolute; left: 0; top: 0; width: min(440px, 92%); border-radius: 20px; padding: 18px 18px 14px; background: var(--glass); border: 1px solid var(--hair); backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); box-shadow: 0 40px 80px -40px rgb(0 0 0 / .9); transform: rotateX(8deg) rotateY(-10deg) rotateZ(1deg); transform-origin: left center; animation: float 9s ease-in-out infinite alternate; }
  .panel-top { display: flex; justify-content: space-between; align-items: baseline; }
  .panel-top span { font-size: 12px; color: var(--text-3); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
  .panel-top strong { font-family: var(--display); font-size: 26px; letter-spacing: -.03em; background: linear-gradient(100deg, var(--a3), var(--a1) 60%, var(--a2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .panel svg { display: block; width: 100%; height: 120px; margin-top: 8px; overflow: visible; }
  .line { fill: none; stroke: url(#lg); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 2.4s .3s cubic-bezier(.65, 0, .35, 1) forwards; filter: drop-shadow(0 6px 10px rgb(56 124 213 / .55)); }
  .area { fill: url(#la); opacity: 0; animation: fade 1.2s 1.6s ease forwards; }
  .dot { fill: #fff; opacity: 0; animation: fade .4s 2.6s ease forwards; filter: drop-shadow(0 0 8px var(--a3)); }
  .chip { position: absolute; display: flex; align-items: center; gap: 10px; padding: 10px 14px 10px 10px; border-radius: 14px; background: rgb(16 24 44 / .78); border: 1px solid var(--hair); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 24px 50px -24px rgb(0 0 0 / .9); font-size: 13px; font-weight: 600; white-space: nowrap; opacity: 0; animation: pop .7s var(--d, 1s) cubic-bezier(.2, 1.4, .4, 1) forwards, float 7s var(--d, 1s) ease-in-out infinite alternate; }
  .chip small { display: block; color: var(--text-3); font-weight: 500; font-size: 11.5px; }
  .chip .ic { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; background: linear-gradient(140deg, rgb(var(--t) / .4), rgb(var(--t) / .12)); box-shadow: inset 0 0 0 1px rgb(var(--t) / .45); color: #fff; }
  .chip.c1 { --t: 16 185 129; --d: 1.2s; right: 0; top: 96px; }
  .chip.c2 { --t: 139 92 246; --d: 1.7s; left: 32%; bottom: 22px; }
  @keyframes draw { to { stroke-dashoffset: 0; } }
  @keyframes fade { to { opacity: 1; } }
  @keyframes pop { from { opacity: 0; transform: translateY(14px) scale(.9); } to { opacity: 1; transform: none; } }
  @keyframes float { from { translate: 0 0; } to { translate: 0 -10px; } }
  @media (max-width: 979px) { .pitch { display: none; } }

  /* Carte de connexion */
  .side { display: grid; gap: 22px; justify-items: stretch; }
  .side .brand { justify-self: center; }
  @media (min-width: 980px) { .side .brand { display: none; } }
  main { position: relative; width: 100%; max-width: 440px; justify-self: center; background: var(--glass); border-radius: 24px; padding: 34px 30px 28px; backdrop-filter: blur(22px) saturate(1.35); -webkit-backdrop-filter: blur(22px) saturate(1.35); box-shadow: 0 50px 100px -40px rgb(0 0 0 / .95), inset 0 1px 0 rgb(255 255 255 / .06); }
  main::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; background: conic-gradient(from var(--ang), transparent 0 60%, var(--a3) 72%, var(--a1) 82%, var(--a2) 92%, transparent), linear-gradient(var(--hair), var(--hair)); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; animation: spin 7s linear infinite; }
  .kicker { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-2); }
  .kicker i { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 4px rgb(52 211 153 / .18), 0 0 12px #34d399; }
  h1 { font-family: var(--display); font-size: 27px; font-weight: 700; letter-spacing: -.035em; word-spacing: .08em; line-height: 1.15; margin: 14px 0 8px; }
  p.sub { margin: 0 0 24px; color: var(--text-2); font-size: 14.5px; line-height: 1.55; }
  form { display: grid; gap: 16px; }
  label { display: grid; gap: 7px; font-size: 13px; font-weight: 600; color: var(--text-2); }
  input { font: inherit; font-size: 15px; color: var(--text); background: rgb(4 8 18 / .45); border: 1px solid var(--hair); border-radius: 13px; padding: 13px 14px; outline: none; transition: border-color .2s, box-shadow .2s, background-color .2s; }
  input::placeholder { color: var(--text-3); }
  input:hover { border-color: rgb(255 255 255 / .16); }
  input:focus { border-color: rgb(110 140 240 / .9); background: rgb(4 8 18 / .6); box-shadow: 0 0 0 4px rgb(56 124 213 / .2), 0 0 30px -8px rgb(139 92 246 / .8); }
  button { position: relative; overflow: hidden; margin-top: 6px; font: inherit; font-weight: 700; font-size: 15px; color: #fff; background: var(--grad); background-size: 160% 100%; border: 0; border-radius: 13px; padding: 14px 16px; cursor: pointer; box-shadow: inset 0 1px 0 rgb(255 255 255 / .3), 0 16px 34px -14px var(--a2); transition: transform .15s, box-shadow .25s, background-position .5s; }
  button::after { content: ""; position: absolute; inset: 0; background: linear-gradient(104deg, transparent 35%, rgb(255 255 255 / .35) 50%, transparent 65%); transform: translateX(-130%); }
  button:hover { background-position: 100% 0; box-shadow: inset 0 1px 0 rgb(255 255 255 / .35), 0 20px 40px -14px var(--a2); }
  button:hover::after { transition: transform .9s cubic-bezier(.16, 1, .3, 1); transform: translateX(130%); }
  button:active { transform: translateY(1px) scale(.99); }
  button:focus-visible { outline: 2px solid var(--a3); outline-offset: 3px; }
  button:disabled { opacity: .6; cursor: default; }
  .err { min-height: 20px; color: var(--bad); font-size: 13.5px; font-weight: 600; }
  .err:empty { min-height: 0; margin-block: -8px; }
  .foot { margin-top: 18px; color: var(--text-3); font-size: 12.5px; text-align: center; line-height: 1.5; }
  .legal { text-align: center; color: var(--text-3); font-size: 12px; }

  @media (prefers-reduced-motion: reduce) {
    .bg, .sky i, main::before, .panel, .chip { animation: none !important; }
    .chip, .area, .dot { opacity: 1; }
    .line { animation: none; stroke-dashoffset: 0; }
  }
</style>
</head>
<body>
<div class="bg" id="bg"></div>
<div class="sky" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="grid" aria-hidden="true"></div>
<div class="veil"></div>
<div class="wrap">
  <section class="pitch" aria-hidden="true">
    <div class="brand"><i>B</i>BLACKSTART <span>AI</span></div>
    <h2>Votre prospection,<br><em>en pleine lumière.</em></h2>
    <p>Appels, rendez-vous, devis et relances au même endroit, partagés en direct avec toute l’équipe.</p>
    <ul class="feats">
      <li style="--c:#22d3ee"><i></i>File d’appels</li>
      <li style="--c:#387cd5"><i></i>Pipeline</li>
      <li style="--c:#8b5cf6"><i></i>Devis &amp; factures</li>
      <li style="--c:#34d399"><i></i>Rapports</li>
    </ul>
    <div class="scene">
      <div class="panel">
        <div class="panel-top"><span>Activité de l’équipe</span><strong>+38 %</strong></div>
        <svg viewBox="0 0 400 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#387cd5"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient>
            <linearGradient id="la" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a6be8" stop-opacity=".4"/><stop offset="1" stop-color="#6a6be8" stop-opacity="0"/></linearGradient>
          </defs>
          <path class="area" d="M4 104 C 50 96, 70 70, 110 78 S 170 40, 210 52 S 280 30, 320 22 S 380 10, 396 8 L 396 120 L 4 120 Z"/>
          <path class="line" pathLength="100" d="M4 104 C 50 96, 70 70, 110 78 S 170 40, 210 52 S 280 30, 320 22 S 380 10, 396 8"/>
          <circle class="dot" cx="396" cy="8" r="5"/>
        </svg>
      </div>
      <div class="chip c1"><span class="ic">✓</span><span>Rendez-vous pris<small>Session d’appels</small></span></div>
      <div class="chip c2"><span class="ic">€</span><span>Devis signé<small>Relance J+5</small></span></div>
    </div>
  </section>
  <div class="side">
    <div class="brand"><i>B</i>BLACKSTART <span>AI</span></div>
    <main>
      <div class="kicker"><i></i>${needsSetup ? 'Installation' : 'Espace équipe'}</div>
      <h1>${esc(title)}</h1>
      <p class="sub">${esc(sub)}</p>
      <form id="f" novalidate>
        ${fields}
        <div class="err" id="err" role="alert"></div>
        <button type="submit">${needsSetup ? 'Créer le compte et ouvrir le CRM' : 'Se connecter'}</button>
      </form>
      <div class="foot">${needsSetup ? 'Vous pourrez ensuite inviter l’équipe dans Réglages › Équipe &amp; compte.' : 'Pas encore de compte ? Demandez-le à l’administrateur de l’équipe.'}</div>
    </main>
    <div class="legal">Blackstart AI · CRM de prospection</div>
  </div>
</div>
<script>
(function () {
  var retour = ${JSON.stringify(retour).replace(/</g, '\\u003c')};
  var img = new Image();
  img.onload = function () { var bg = document.getElementById('bg'); bg.style.backgroundImage = 'url("/ambiance/connexion")'; document.body.classList.add('photo'); };
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
