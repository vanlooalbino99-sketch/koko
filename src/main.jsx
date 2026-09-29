// Point d'entrée : montage, raccourcis clavier, rappels, superpositions.
import { render } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { db, useStore, loadData } from './lib/store.js';
import { app, open, close, go } from './lib/nav.js';
import { ui, initTheme } from './lib/theme.js';
import { loadFiles } from './lib/files.js';
import { chimeStartup, chimeAlert, notify } from './lib/sound.js';
import { overdueCount } from './lib/business.js';
import { today, nowTime, isTyping } from './lib/util.js';
import { Sidebar, Topbar, BottomNav, MobileMenu, Toasts } from './components/Shell.jsx';
import { Palette } from './components/Palette.jsx';
import { ConfirmDialog, Modal, Kbd, useDesktop } from './components/ui.jsx';
import { Icon } from './components/icons.jsx';
import { Today } from './views/Today.jsx';
import { Agenda, ScheduleModal } from './views/Agenda.jsx';
import { Prospects, Pipeline } from './views/Prospects.jsx';
import { ProspectDetail, ProspectForm, RescheduleModal } from './views/ProspectDetail.jsx';
import { CallScreen } from './views/Call.jsx';
import { ImportModal } from './views/Import.jsx';
import { Tasks, TaskForm } from './views/Tasks.jsx';
import { Sales, DocForm, DocView, EmailComposer } from './views/Sales.jsx';
import { Clients, Payments } from './views/Clients.jsx';
import { Dashboard, Reports } from './views/Analytics.jsx';
import { Tools } from './views/Tools.jsx';
import { Settings } from './views/Settings.jsx';

const PAGES = { today: Today, agenda: Agenda, prospects: Prospects, pipeline: Pipeline, tasks: Tasks, devis: Sales, clients: Clients, payments: Payments, dashboard: Dashboard, reports: Reports, tools: Tools, settings: Settings };

const OVERLAYS = {
  prospect: ProspectDetail,
  prospectForm: ProspectForm,
  reschedule: RescheduleModal,
  call: CallScreen,
  import: ImportModal,
  schedule: ScheduleModal,
  taskForm: TaskForm,
  devisForm: (p) => <DocForm {...p} kind="devis" />,
  factureForm: (p) => <DocForm {...p} kind="facture" />,
  devis: (p) => <DocView {...p} kind="devis" />,
  facture: (p) => <DocView {...p} kind="facture" />,
  email: EmailComposer,
  confirm: ConfirmDialog,
  shortcuts: Shortcuts,
};

function Shortcuts({ onClose }) {
  const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
  const rows = [
    [[mod, 'K'], 'Recherche et commandes'],
    [['N'], 'Nouveau prospect'],
    [['T'], 'Nouvelle tâche'],
    [['/'], 'Rechercher dans la page'],
    [['G', 'A'], "Aller à Aujourd'hui"],
    [['G', 'P'], 'Aller aux Prospects'],
    [['G', 'D'], 'Aller aux Devis'],
    [['G', 'C'], "Aller à l'Agenda"],
    [['G', 'S'], 'Aller au Tableau de bord'],
    [['?'], 'Afficher cette aide'],
    [['Échap'], 'Fermer la fenêtre'],
  ];
  return (
    <Modal title="Raccourcis clavier" icon="keyboard" size="sm" onClose={onClose} noAutoFocus>
      <div class="col" style={{ gap: 10 }}>
        {rows.map(([keys, label]) => (
          <div class="row between">
            <span class="text-2">{label}</span>
            <span class="row gap-4">
              {keys.map((k) => (
                <Kbd>{k}</Kbd>
              ))}
            </span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function App() {
  const loaded = useStore(db, (s) => s.loaded);
  const page = useStore(app, (s) => s.page);
  const overlays = useStore(app, (s) => s.overlays);
  const palette = useStore(app, (s) => s.palette);
  const mobileMenu = useStore(app, (s) => s.mobileMenu);
  const prospects = useStore(db, (s) => s.prospects);
  const desktop = useDesktop();
  useStore(ui, (s) => s.sidebar);

  /* Raccourcis clavier globaux. */
  useEffect(() => {
    let gPending = 0;
    function onKey(e) {
      const s = app.get();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        app.set({ palette: !s.palette });
        return;
      }
      if (e.key === 'Escape') {
        if (s.palette) return app.set({ palette: false });
        if (s.mobileMenu) return app.set({ mobileMenu: false });
        if (s.overlays.length) {
          e.preventDefault();
          return close();
        }
        return;
      }
      if (isTyping(document.activeElement) || e.metaKey || e.ctrlKey || e.altKey || s.palette || s.overlays.length) return;
      const k = e.key.toLowerCase();
      if (gPending && Date.now() - gPending < 900) {
        gPending = 0;
        const map = { a: 'today', p: 'prospects', d: 'devis', c: 'agenda', s: 'dashboard', r: 'reports', t: 'tasks', l: 'pipeline' };
        if (map[k]) go(map[k]);
        return;
      }
      if (k === 'g') gPending = Date.now();
      else if (k === 'n') (e.preventDefault(), open('prospectForm'));
      else if (k === 't') (e.preventDefault(), open('taskForm'));
      else if (e.key === '?') open('shortcuts');
      else if (e.key === '/') {
        const el = document.querySelector('.page .search-input');
        if (el) (e.preventDefault(), el.focus());
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Alerte sonore quand une nouvelle relance passe en retard. */
  const prevOverdue = useRef(null);
  const overdue = loaded ? overdueCount(prospects) : 0;
  useEffect(() => {
    if (prevOverdue.current !== null && overdue > prevOverdue.current) chimeAlert();
    prevOverdue.current = overdue;
  }, [overdue]);

  /* Rappels à l'heure prévue (notification navigateur + son). */
  useEffect(() => {
    if (!loaded) return;
    const fired = new Set();
    const tick = () => {
      const t = today();
      const hm = nowTime();
      db.get().prospects.forEach((p) => {
        if (p.prochaineRelance !== t || !p.prochaineRelanceHeure || p.prochaineRelanceHeure !== hm) return;
        const key = p.id + t + hm;
        if (fired.has(key)) return;
        fired.add(key);
        chimeAlert();
        notify(`Rappel : ${p.entreprise}`, `${p.contact ? p.contact + ' — ' : ''}${p.telephone || 'appel prévu à ' + hm}`);
      });
      db.get().tasks.forEach((x) => {
        if (x.done || x.due !== t || x.heure !== hm) return;
        const key = x.id + t + hm;
        if (fired.has(key)) return;
        fired.add(key);
        chimeAlert();
        notify(`Tâche : ${x.title}`, `Prévue à ${hm}`);
      });
    };
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [loaded]);

  if (!loaded) return null;
  const Page = PAGES[page] || Today;
  return (
    <div class="shell">
      {desktop && <Sidebar />}
      <div class="main-col">
        <Topbar />
        <main class="page fade-in" key={page} id="main">
          <Page />
        </main>
      </div>
      {!desktop && <BottomNav />}
      {mobileMenu && <MobileMenu />}
      {overlays.map((o) => {
        const C = OVERLAYS[o.type];
        return C ? <C key={o.key} ov={o} {...o} onClose={() => close(o.key)} /> : null;
      })}
      {palette && <Palette />}
      <Toasts />
    </div>
  );
}

/* ---------- Démarrage ---------- */
initTheme();
const started = Date.now();
loadData().then(() => {
  render(<App />, document.getElementById('root'));
  loadFiles();
  const el = document.getElementById('splash');
  const wait = Math.max(0, 450 - (Date.now() - started));
  setTimeout(() => el && el.classList.add('hide'), wait);
  setTimeout(() => el && el.remove(), wait + 600);
});
/* Son de démarrage : au premier geste de l'utilisateur (règle des navigateurs). */
const once = () => {
  chimeStartup();
  ['pointerdown', 'keydown'].forEach((ev) => window.removeEventListener(ev, once, true));
};
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, once, true));
export { Icon };
