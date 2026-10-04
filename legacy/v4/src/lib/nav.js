// État d'interface : page courante (via #hash), superpositions (fiches, modales), notifications.
import { createStore } from './store.js';
import { uid } from './util.js';

export const PAGES = ['today', 'agenda', 'prospects', 'pipeline', 'tasks', 'devis', 'clients', 'payments', 'dashboard', 'reports', 'tools', 'settings'];
const fromHash = () => {
  const h = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
  return PAGES.includes(h) ? h : 'today';
};

export const app = createStore({
  page: fromHash(),
  overlays: [],
  toasts: [],
  palette: false,
  session: null, // { ids: [], index: 0, done: 0 }
  mobileMenu: false,
});

export function go(page) {
  if (!PAGES.includes(page)) return;
  app.set({ page, mobileMenu: false });
  if (location.hash !== '#/' + page) history.replaceState(null, '', '#/' + page);
  const main = document.getElementById('main-scroll');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => app.set({ page: fromHash() }));

/* Superpositions empilées : la plus récente est au-dessus. */
export function open(type, props = {}) {
  app.set((s) => ({ overlays: [...s.overlays, { key: uid(), type, ...props }] }));
}
export function close(key) {
  app.set((s) => ({ overlays: key ? s.overlays.filter((o) => o.key !== key) : s.overlays.slice(0, -1) }));
}
export function replaceTop(type, props = {}) {
  app.set((s) => ({ overlays: [...s.overlays.slice(0, -1), { key: uid(), type, ...props }] }));
}
export const closeAll = () => app.set({ overlays: [] });

export function toast(message, opts = {}) {
  const t = { id: uid(), message, tone: opts.tone || 'success', action: opts.action || null, actionLabel: opts.actionLabel || 'Annuler' };
  app.set((s) => ({ toasts: [...s.toasts.slice(-2), t] }));
  setTimeout(() => dismissToast(t.id), opts.duration || (opts.action ? 6000 : 2800));
}
export const dismissToast = (id) => app.set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
