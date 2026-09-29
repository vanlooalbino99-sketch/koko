// Coquille : barre latérale (bureau), barre supérieure, navigation mobile, notifications.
import { Icon } from './icons.jsx';
import { IconButton, Button, Kbd, Modal, cx, Menu } from './ui.jsx';
import { app, go, open, dismissToast } from '../lib/nav.js';
import { db, useStore } from '../lib/store.js';
import { ui, setUi, isDark } from '../lib/theme.js';
import { dueQueue, overdueCount, isFactureLate } from '../lib/business.js';
import { today } from '../lib/util.js';

export const NAV = [
  { group: 'Prospection' },
  { id: 'today', label: "Aujourd'hui", icon: 'sun' },
  { id: 'agenda', label: 'Agenda', icon: 'calendar' },
  { id: 'prospects', label: 'Prospects', icon: 'users' },
  { id: 'pipeline', label: 'Pipeline', icon: 'kanban' },
  { id: 'tasks', label: 'Tâches', icon: 'checkSquare' },
  { group: 'Ventes' },
  { id: 'devis', label: 'Devis & factures', icon: 'fileText' },
  { id: 'clients', label: 'Clients', icon: 'briefcase' },
  { id: 'payments', label: 'Paiements', icon: 'wallet' },
  { group: 'Analyse' },
  { id: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
  { id: 'reports', label: 'Rapports', icon: 'lineChart' },
];
export const NAV_FOOT = [
  { id: 'tools', label: 'Outils', icon: 'wrench' },
  { id: 'settings', label: 'Réglages', icon: 'settings' },
];
export const PAGE_TITLES = Object.fromEntries([...NAV, ...NAV_FOOT].filter((n) => n.id).map((n) => [n.id, n.label]));

function useCounts() {
  const prospects = useStore(db, (s) => s.prospects);
  const tasks = useStore(db, (s) => s.tasks);
  const factures = useStore(db, (s) => s.factures);
  const t = today();
  return {
    today: dueQueue(prospects).length,
    agenda: overdueCount(prospects),
    tasks: tasks.filter((x) => !x.done && x.due && x.due <= t).length,
    payments: factures.filter(isFactureLate).length,
  };
}

export function Sidebar() {
  const page = useStore(app, (s) => s.page);
  const collapsed = useStore(ui, (s) => s.sidebar === 'collapsed');
  const company = useStore(db, (s) => s.companyInfo);
  const counts = useCounts();
  const item = (n) => {
    const c = counts[n.id];
    const hot = n.id === 'agenda' || n.id === 'payments' || n.id === 'tasks';
    return (
      <button class={cx('nav-item', page === n.id && 'active')} onClick={() => go(n.id)} title={collapsed ? n.label : undefined} aria-current={page === n.id ? 'page' : undefined}>
        <Icon name={n.icon} size={17} />
        <span class="nav-label">{n.label}</span>
        {c > 0 && <span class={cx('nav-count', hot && 'hot')}>{c}</span>}
        {c > 0 && <span class="nav-dot" />}
      </button>
    );
  };
  return (
    <aside class={cx('sidebar', collapsed && 'collapsed')}>
      <div class="sb-brand">
        <div class="brand">
          <span class="brand-mark">{(company.nom || 'B').trim()[0].toUpperCase()}</span>
          <div class="brand-text min-w-0">
            <div class="brand-name">
              BLACKSTART <span>AI</span>
            </div>
            <div class="brand-sub">Command Center</div>
          </div>
        </div>
      </div>
      <div class="sb-quick">
        <Button variant="primary" icon="plus" block onClick={() => open('prospectForm')} title="Nouveau prospect (N)">
          {!collapsed && 'Nouveau prospect'}
        </Button>
      </div>
      <nav class="sb-scroll">
        {NAV.map((n) => (n.group ? <div class="nav-group-label">{n.group}</div> : item(n)))}
      </nav>
      <div class="sb-foot">
        {NAV_FOOT.map(item)}
        <button class="nav-item" onClick={() => setUi({ sidebar: collapsed ? 'expanded' : 'collapsed' })} title={collapsed ? 'Déplier le menu' : 'Replier le menu'}>
          <Icon name="panelLeft" size={17} />
          <span class="nav-label">Replier le menu</span>
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  const page = useStore(app, (s) => s.page);
  const cfg = useStore(ui);
  const prospects = useStore(db, (s) => s.prospects);
  const overdue = overdueCount(prospects);
  const dark = isDark(cfg);
  const saveError = useStore(db, (s) => s.saveError);
  return (
    <header class="topbar">
      <div class="brand hide-desktop grow min-w-0">
        <span class="brand-mark">B</span>
        <div class="min-w-0">
          <div class="topbar-title truncate">{PAGE_TITLES[page]}</div>
        </div>
      </div>
      <div class="hide-mobile grow min-w-0">
        <button class="topbar-search" onClick={() => app.set({ palette: true })}>
          <Icon name="search" size={15} />
          <span>Rechercher un prospect, un devis, une action…</span>
          <Kbd>{/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'} K</Kbd>
        </button>
      </div>
      {saveError && (
        <span class="badge tone-rose hide-mobile" title={saveError}>
          <Icon name="alert" size={12} /> Sauvegarde
        </span>
      )}
      <IconButton icon="search" label="Rechercher" class="hide-desktop" onClick={() => app.set({ palette: true })} />
      <IconButton icon="bell" label={overdue ? `${overdue} relance(s) en retard` : 'Aucune relance en retard'} badge={overdue} onClick={() => go('agenda')} />
      <IconButton icon={dark ? 'sun' : 'moon'} label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'} onClick={() => setUi({ scheme: dark ? 'light' : 'dark' })} />
      <span class="hide-mobile">
        <Menu
          trigger={<Button variant="primary" icon="plus" size="sm">Créer</Button>}
          items={[
            { label: 'Nouveau prospect', icon: 'userPlus', hint: 'N', onClick: () => open('prospectForm') },
            { label: 'Nouveau devis', icon: 'fileText', onClick: () => open('devisForm') },
            { label: 'Nouvelle facture', icon: 'receipt', onClick: () => open('factureForm') },
            { label: 'Nouvelle tâche', icon: 'checkSquare', hint: 'T', onClick: () => open('taskForm') },
            { label: 'Planifier un créneau', icon: 'calendarClock', onClick: () => open('schedule', {}) },
            '-',
            { label: 'Importer des leads', icon: 'upload', onClick: () => open('import') },
          ]}
        />
      </span>
    </header>
  );
}

const MOBILE_MAIN = ['today', 'agenda', 'prospects', 'devis'];
export function BottomNav() {
  const page = useStore(app, (s) => s.page);
  const counts = useCounts();
  const all = [...NAV, ...NAV_FOOT].filter((n) => n.id);
  const inMenu = !MOBILE_MAIN.includes(page);
  return (
    <nav class="bottom-nav" aria-label="Navigation principale">
      {MOBILE_MAIN.map((id) => {
        const n = all.find((x) => x.id === id);
        const c = id === 'today' ? counts.today : id === 'agenda' ? counts.agenda : 0;
        return (
          <button class={cx('bn-item', page === id && 'active')} onClick={() => go(id)}>
            <span class="bn-icon">
              <Icon name={n.icon} size={19} />
            </span>
            {id === 'devis' ? 'Devis' : n.label}
            {c > 0 && <span class="bn-badge">{c}</span>}
          </button>
        );
      })}
      <button class={cx('bn-item', inMenu && 'active')} onClick={() => app.set({ mobileMenu: true })}>
        <span class="bn-icon">
          <Icon name="grid" size={19} />
        </span>
        {inMenu ? PAGE_TITLES[page].split(' ')[0] : 'Plus'}
        {counts.tasks + counts.payments > 0 && <span class="bn-badge">{counts.tasks + counts.payments}</span>}
      </button>
    </nav>
  );
}

export function MobileMenu() {
  const page = useStore(app, (s) => s.page);
  const counts = useCounts();
  const items = [...NAV, ...NAV_FOOT].filter((n) => n.id && !MOBILE_MAIN.includes(n.id));
  const close = () => app.set({ mobileMenu: false });
  return (
    <Modal title="Menu" subtitle="Toutes les sections" icon="grid" onClose={close} size="sm" noAutoFocus>
      <div class="mobile-menu-grid">
        {items.map((n) => (
          <button class={cx('mm-item', page === n.id && 'active')} onClick={() => go(n.id)}>
            <Icon name={n.icon} size={20} />
            {n.label}
            {counts[n.id] > 0 && <span class="bn-badge" style={{ top: 6, left: 'auto', right: 8, margin: 0 }}>{counts[n.id]}</span>}
          </button>
        ))}
      </div>
      <div class="mt-16 grid-2">
        <Button icon="upload" onClick={() => (close(), open('import'))}>
          Importer
        </Button>
        <Button icon="checkSquare" onClick={() => (close(), open('taskForm'))}>
          Nouvelle tâche
        </Button>
      </div>
    </Modal>
  );
}

export function Toasts() {
  const toasts = useStore(app, (s) => s.toasts);
  return (
    <div class="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div class={cx('toast', t.tone === 'error' && 'error')} key={t.id}>
          <Icon name={t.tone === 'error' ? 'alert' : 'check2'} size={16} />
          <span class="grow">{t.message}</span>
          {t.action && (
            <button
              class="toast-action"
              onClick={() => {
                t.action();
                dismissToast(t.id);
              }}
            >
              {t.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
