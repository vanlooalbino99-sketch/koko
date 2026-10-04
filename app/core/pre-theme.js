
/* Pré-thème : applique immédiatement le fond enregistré pour éviter tout flash. */
(function () {
  try {
    var c = JSON.parse(localStorage.getItem('blackstart-ui-v4') || 'null');
    var d = document.documentElement;
    var dark = true;
    if (c && c.scheme === 'light') dark = false;
    if (c && c.scheme === 'auto') dark = !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
    d.setAttribute('data-scheme', dark ? 'dark' : 'light');
    d.setAttribute('data-nav', (c && (c.nav === 'horizontal' || c.nav === 'vertical')) ? c.nav : 'auto');
    if (c && c.bgCache) d.style.background = c.bgCache;
  } catch (e) {}
})();
