import { Router } from 'express';

// Outils d'autres éditeurs affichés dans le CRM (rubrique Entraînement : Pitchbase).
// GET /cadre/:site dit si le site accepte d'être affiché dans le CRM (iframe) : sinon le CRM l'ouvre dans
// une fenêtre à côté. Seuls les sites de la liste sont vérifiés (pas d'adresse libre).
const SITES = { pitchbase: 'https://pitchbase.app/app' };
const DUREE = 6 * 3600 * 1000;

// En-têtes d'une réponse → affichage autorisé dans une page de `hote` ?
export function integrable(headers, hote) {
  const xfo = String(headers.get('x-frame-options') || '').trim();
  if (xfo) return false;
  const csp = String(headers.get('content-security-policy') || '');
  const fa = /(?:^|;)\s*frame-ancestors\s+([^;]*)/i.exec(csp);
  if (!fa) return true;
  const sources = fa[1].trim().split(/\s+/);
  if (sources.includes("'none'")) return false;
  return sources.some((s) => s === '*' || s === 'https:' || (hote && (s === `https://${hote}` || s === hote)));
}

export function integrationsRoutes({ fetch: web = globalThis.fetch } = {}) {
  const r = Router();
  const cache = new Map();
  r.get('/cadre/:site', async (req, res) => {
    const url = SITES[req.params.site];
    if (!url) return res.status(404).json({ error: 'Outil inconnu.' });
    const hote = String(req.get('host') || '');
    const memo = cache.get(url);
    if (memo && Date.now() - memo.t < DUREE) return res.json({ integrable: integrable(memo.headers, hote) });
    try {
      const rep = await web(url, { redirect: 'follow', signal: AbortSignal.timeout(8000) });
      const headers = new Headers({ 'x-frame-options': rep.headers.get('x-frame-options') || '', 'content-security-policy': rep.headers.get('content-security-policy') || '' });
      if (rep.body && rep.body.cancel) rep.body.cancel().catch(() => {});
      if (!rep.ok) return res.json({ integrable: false });
      cache.set(url, { t: Date.now(), headers });
      res.json({ integrable: integrable(headers, hote) });
    } catch {
      res.json({ integrable: false });
    }
  });
  return r;
}
