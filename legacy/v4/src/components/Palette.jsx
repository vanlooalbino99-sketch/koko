// Palette de commandes (Ctrl/⌘ + K) : recherche globale + actions rapides.
import { useMemo, useState, useEffect, useRef } from 'preact/hooks';
import { Icon } from './icons.jsx';
import { Kbd, StatusBadge, cx } from './ui.jsx';
import { app, go, open } from '../lib/nav.js';
import { db, useStore } from '../lib/store.js';
import { ui, setUi, isDark } from '../lib/theme.js';
import { norm, digits, fmtPhone, eur } from '../lib/util.js';
import { totals, dueQueue } from '../lib/business.js';
import { NAV, NAV_FOOT } from './Shell.jsx';
import { startSession } from '../views/Today.jsx';

export function Palette() {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const input = useRef(null);
  const { prospects, devisList, factures } = useStore(db);
  const cfg = useStore(ui);
  const closeP = () => app.set({ palette: false });
  useEffect(() => {
    setTimeout(() => input.current && input.current.focus(), 20);
  }, []);

  const results = useMemo(() => {
    const n = norm(q);
    const d = digits(q);
    const groups = [];
    const actions = [
      { title: 'Nouveau prospect', icon: 'userPlus', run: () => open('prospectForm'), k: 'ajouter creer prospect lead' },
      { title: `Lancer la session d'appels (${dueQueue(prospects).length})`, icon: 'zap', run: () => startSession(), k: 'session appels appeler file' },
      { title: 'Nouveau devis', icon: 'fileText', run: () => open('devisForm'), k: 'devis creer' },
      { title: 'Nouvelle facture', icon: 'receipt', run: () => open('factureForm'), k: 'facture creer' },
      { title: 'Nouvelle tâche', icon: 'checkSquare', run: () => open('taskForm'), k: 'tache todo rappel' },
      { title: 'Planifier un créneau', icon: 'calendarClock', run: () => open('schedule', {}), k: 'agenda planifier rdv creneau' },
      { title: 'Importer des leads', icon: 'upload', run: () => open('import'), k: 'import csv api sirene' },
      { title: isDark(cfg) ? 'Passer en mode clair' : 'Passer en mode sombre', icon: isDark(cfg) ? 'sun' : 'moon', run: () => setUi({ scheme: isDark(cfg) ? 'light' : 'dark' }), k: 'theme mode clair sombre' },
      { title: 'Raccourcis clavier', icon: 'keyboard', run: () => open('shortcuts'), k: 'aide raccourcis clavier' },
    ];
    const pages = [...NAV, ...NAV_FOOT].filter((x) => x.id).map((x) => ({ title: `Aller à : ${x.label}`, icon: x.icon, run: () => go(x.id), k: norm(x.label) }));
    if (!n) {
      groups.push({ label: 'Actions rapides', items: actions.slice(0, 6) });
      groups.push({ label: 'Navigation', items: pages });
      return groups;
    }
    const ps = prospects
      .filter((p) => norm(p.entreprise).includes(n) || norm(p.contact).includes(n) || norm(p.ville).includes(n) || norm(p.email).includes(n) || (d.length >= 3 && digits(p.telephone).includes(d)))
      .slice(0, 8)
      .map((p) => ({
        title: p.entreprise,
        sub: [p.contact, fmtPhone(p.telephone), p.ville].filter(Boolean).join(' · '),
        icon: 'building',
        badge: <StatusBadge statut={p.statut} short />,
        run: () => open('prospect', { id: p.id }),
      }));
    if (ps.length) groups.push({ label: 'Prospects', items: ps });
    const ds = devisList
      .filter((x) => norm(x.numero).includes(n) || norm(x.clientNom).includes(n))
      .slice(0, 5)
      .map((x) => ({ title: `${x.numero} — ${x.clientNom || 'Sans client'}`, sub: eur(totals(x.lignes, x.remise).totalTTC) + ' TTC', icon: 'fileText', run: () => open('devis', { id: x.id }) }));
    const fs = factures
      .filter((x) => norm(x.numero).includes(n) || norm(x.clientNom).includes(n))
      .slice(0, 5)
      .map((x) => ({ title: `${x.numero} — ${x.clientNom || 'Sans client'}`, sub: eur(totals(x.lignes, x.remise).totalTTC) + ' TTC', icon: 'receipt', run: () => open('facture', { id: x.id }) }));
    if (ds.length || fs.length) groups.push({ label: 'Devis & factures', items: [...ds, ...fs] });
    const as = [...actions, ...pages].filter((a) => norm(a.title).includes(n) || (a.k && a.k.includes(n)));
    if (as.length) groups.push({ label: 'Actions', items: as.slice(0, 8) });
    if (!ps.length && q.trim().length > 1) groups.push({ label: 'Créer', items: [{ title: `Créer le prospect « ${q.trim()} »`, icon: 'plus', run: () => open('prospectForm', { initial: { entreprise: q.trim() } }) }] });
    return groups;
  }, [q, prospects, devisList, factures, cfg]);

  const flat = results.flatMap((g) => g.items);
  useEffect(() => setIdx(0), [q]);
  function run(item) {
    closeP();
    item && item.run();
  }
  function onKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(flat[idx]);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      closeP();
    }
  }
  useEffect(() => {
    const el = document.querySelector('.palette-item.active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [idx]);
  let i = -1;
  return (
    <div class="overlay overlay-palette" onMouseDown={(e) => e.target === e.currentTarget && closeP()}>
      <div class="palette" role="dialog" aria-label="Recherche et commandes">
        <div class="palette-input">
          <Icon name="search" size={18} />
          <input ref={input} value={q} onInput={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Rechercher un prospect, un devis, une action…" aria-label="Rechercher" />
          <Kbd>Échap</Kbd>
        </div>
        <div class="palette-list">
          {results.map((g) => (
            <div>
              <div class="palette-group">{g.label}</div>
              {g.items.map((it) => {
                i++;
                const my = i;
                return (
                  <button class={cx('palette-item', my === idx && 'active')} onMouseMove={() => setIdx(my)} onClick={() => run(it)}>
                    <span class="pi-icon">
                      <Icon name={it.icon} size={15} />
                    </span>
                    <span class="grow min-w-0">
                      <span class="pi-title truncate" style={{ display: 'block' }}>
                        {it.title}
                      </span>
                      {it.sub && <span class="pi-sub truncate" style={{ display: 'block' }}>{it.sub}</span>}
                    </span>
                    {it.badge}
                  </button>
                );
              })}
            </div>
          ))}
          {!flat.length && <div class="chart-empty">Aucun résultat pour « {q} »</div>}
        </div>
        <div class="palette-foot hide-mobile">
          <span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> naviguer
          </span>
          <span>
            <Kbd>Entrée</Kbd> ouvrir
          </span>
          <span>
            <Kbd>Échap</Kbd> fermer
          </span>
        </div>
      </div>
    </div>
  );
}
