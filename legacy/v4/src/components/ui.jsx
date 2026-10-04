// Kit d'interface : boutons, champs, badges, cartes, modales, menus…
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { Icon } from './icons.jsx';
import { STATUTS, DEVIS_STATUTS, FACTURE_STATUTS, PRIORITES, TASK_PRIORITES } from '../lib/constants.js';
import { initials } from '../lib/util.js';

const cx = (...a) => a.filter(Boolean).join(' ');
export { cx };

export function Button({ variant = 'secondary', size = 'md', icon, iconRight, loading, block, class: cls, children, type = 'button', ...rest }) {
  return (
    <button type={type} class={cx('btn', `btn-${variant}`, `btn-${size}`, block && 'btn-block', !children && 'btn-icon-only', cls)} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span class="spinner" /> : icon && <Icon name={icon} size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children && <span class="btn-label">{children}</span>}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}

export function IconButton({ icon, label, size = 16, class: cls, variant = 'ghost', badge, ...rest }) {
  return (
    <button type="button" class={cx('icon-btn', `icon-btn-${variant}`, cls)} aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={size} />
      {badge ? <span class="icon-btn-badge">{badge > 99 ? '99+' : badge}</span> : null}
    </button>
  );
}

export function Badge({ tone = 'slate', dot, children, class: cls, size, ...rest }) {
  return (
    <span class={cx('badge', `tone-${tone}`, size === 'lg' && 'badge-lg', cls)} {...rest}>
      {dot && <span class="badge-dot" />}
      {children}
    </span>
  );
}
export const StatusBadge = ({ statut, short }) => {
  const s = STATUTS[statut] || STATUTS.a_appeler;
  return (
    <Badge tone={s.tone} dot>
      {short ? s.short : s.label}
    </Badge>
  );
};
export const DevisBadge = ({ statut, expired }) => {
  if (expired) return <Badge tone="orange" dot>Expiré</Badge>;
  const s = DEVIS_STATUTS[statut] || DEVIS_STATUTS.brouillon;
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
};
export const FactureBadge = ({ statut, late }) => {
  if (late) return <Badge tone="rose" dot>En retard</Badge>;
  const s = FACTURE_STATUTS[statut] || FACTURE_STATUTS.a_payer;
  return <Badge tone={s.tone} dot>{s.label}</Badge>;
};
export const PrioriteBadge = ({ priorite, task }) => {
  const p = (task ? TASK_PRIORITES : PRIORITES)[priorite];
  if (!p) return null;
  return (
    <Badge tone={p.tone}>
      <Icon name={task ? 'flag' : 'flame'} size={11} /> {p.label}
    </Badge>
  );
};

const AVATAR_TONES = ['blue', 'violet', 'emerald', 'orange', 'rose', 'sky', 'indigo', 'amber'];
export function Avatar({ name, size = 32, class: cls }) {
  let h = 0;
  for (const ch of String(name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const tone = AVATAR_TONES[h % AVATAR_TONES.length];
  return (
    <span class={cx('avatar', `tone-${tone}`, cls)} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}>
      {initials(name)}
    </span>
  );
}

export function Field({ label, hint, children, class: cls, required, action }) {
  return (
    <label class={cx('field', cls)}>
      {label && (
        <span class="field-label">
          {label}
          {required && <span class="req">*</span>}
          {action && <span class="field-action">{action}</span>}
        </span>
      )}
      {children}
      {hint && <span class="field-hint">{hint}</span>}
    </label>
  );
}
export const Input = ({ class: cls, onInput, onChange, ...p }) => <input class={cx('input', cls)} onInput={onInput || onChange} {...p} />;
export const Textarea = ({ class: cls, onInput, onChange, ...p }) => <textarea class={cx('input textarea', cls)} onInput={onInput || onChange} {...p} />;
export function Select({ class: cls, options, children, ...p }) {
  return (
    <span class={cx('select-wrap', cls)}>
      <select class="input select" {...p}>
        {options ? options.map((o) => (typeof o === 'string' ? <option value={o}>{o}</option> : <option value={o.value}>{o.label}</option>)) : children}
      </select>
      <Icon name="chevronDown" size={14} class="select-caret" />
    </span>
  );
}

export function SearchInput({ value, onInput, placeholder, inputRef, autoFocus, class: cls }) {
  return (
    <div class={cx('search', cls)}>
      <Icon name="search" size={15} />
      <input ref={inputRef} class="search-input" value={value} onInput={(e) => onInput(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} />
      {value && <IconButton icon="x" label="Effacer" size={14} onClick={() => onInput('')} class="search-clear" />}
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint, disabled }) {
  return (
    <label class={cx('toggle-row', disabled && 'is-disabled')}>
      <span class="toggle-text">
        <span class="toggle-label">{label}</span>
        {hint && <span class="toggle-hint">{hint}</span>}
      </span>
      <button type="button" role="switch" aria-checked={checked} class={cx('toggle', checked && 'on')} onClick={() => !disabled && onChange(!checked)}>
        <span />
      </button>
    </label>
  );
}

export function Checkbox({ checked, indeterminate, onChange, label, class: cls }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : !!checked}
      aria-label={label || 'Sélectionner'}
      class={cx('checkbox', (checked || indeterminate) && 'on', cls)}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      {checked && <Icon name="check" size={12} stroke={3} />}
      {!checked && indeterminate && <span class="checkbox-dash" />}
    </button>
  );
}

export function Segmented({ options, value, onChange, size, class: cls }) {
  return (
    <div class={cx('segmented', size === 'sm' && 'segmented-sm', cls)} role="tablist">
      {options.map((o) => (
        <button type="button" role="tab" aria-selected={o.value === value} class={cx('seg', o.value === value && 'active')} onClick={() => onChange(o.value)} title={o.title}>
          {o.icon && <Icon name={o.icon} size={14} />}
          {o.label && <span>{o.label}</span>}
          {o.count != null && <span class="seg-count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Card({ title, subtitle, icon, actions, children, class: cls, pad = true, ...rest }) {
  return (
    <section class={cx('card', !pad && 'card-flush', cls)} {...rest}>
      {(title || actions) && (
        <header class="card-head">
          <div class="card-title-wrap">
            {icon && (
              <span class="card-icon">
                <Icon name={icon} size={15} />
              </span>
            )}
            <div>
              {title && <h3 class="card-title">{title}</h3>}
              {subtitle && <p class="card-sub">{subtitle}</p>}
            </div>
          </div>
          {actions && <div class="card-actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Kpi({ label, value, sub, icon, delta, deltaGood = true, deltaSuffix = '', tone, onClick, children }) {
  const up = delta > 0;
  const good = delta === 0 || delta == null ? null : up === deltaGood;
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag class={cx('kpi', onClick && 'kpi-click')} onClick={onClick} type={onClick ? 'button' : undefined}>
      <div class="kpi-top">
        <span class="kpi-label">{label}</span>
        {icon && (
          <span class={cx('kpi-icon', tone && `tone-${tone}`)}>
            <Icon name={icon} size={15} />
          </span>
        )}
      </div>
      <div class="kpi-value">{value}</div>
      <div class="kpi-foot">
        {delta != null && delta !== 0 && (
          <span class={cx('delta', good ? 'delta-good' : 'delta-bad')}>
            <Icon name={up ? 'trendUp' : 'trendDown'} size={12} />
            {up ? '+' : ''}
            {typeof delta === 'number' ? delta.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) : delta}
            {deltaSuffix}
          </span>
        )}
        {sub && <span class="kpi-sub">{sub}</span>}
      </div>
      {children}
    </Tag>
  );
}

export function EmptyState({ icon = 'inbox', title, text, children, compact }) {
  return (
    <div class={cx('empty', compact && 'empty-compact')}>
      <span class="empty-icon">
        <Icon name={icon} size={compact ? 18 : 22} />
      </span>
      <div class="empty-title">{title}</div>
      {text && <p class="empty-text">{text}</p>}
      {children && <div class="empty-actions">{children}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children, eyebrow }) {
  return (
    <div class="page-head">
      <div class="page-head-text">
        {eyebrow && <div class="eyebrow">{eyebrow}</div>}
        <h1 class="page-title">{title}</h1>
        {subtitle && <p class="page-sub">{subtitle}</p>}
      </div>
      {children && <div class="page-actions">{children}</div>}
    </div>
  );
}

export function Meter({ value, max = 100, tone }) {
  const p = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  const t = tone || (p >= 100 ? 'good' : p >= 60 ? 'accent' : 'warn');
  return (
    <div class={cx('meter', `meter-${t}`)} role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin="0" aria-valuemax="100">
      <span style={{ width: p + '%' }} />
    </div>
  );
}

export const Kbd = ({ children }) => <kbd class="kbd">{children}</kbd>;

/* ---------- Superpositions ---------- */
function useLockScroll() {
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      if (!document.querySelector('.overlay')) document.body.classList.remove('no-scroll');
    };
  }, []);
}
function useAutoFocus(ref, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) return;
    const f = el.querySelector('[data-autofocus]') || el.querySelector('input:not([type=hidden]):not([type=checkbox]):not([readonly]), textarea, select');
    if (f) setTimeout(() => f.focus(), 30);
  }, []);
}

export function Modal({ title, subtitle, onClose, size = 'md', footer, children, icon, class: cls, noAutoFocus, headerExtra }) {
  const ref = useRef(null);
  useLockScroll();
  useAutoFocus(ref, !noAutoFocus);
  return (
    <div class="overlay overlay-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div class={cx('modal', `modal-${size}`, cls)} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <header class="modal-head">
          <div class="modal-head-text">
            {icon && (
              <span class="modal-icon">
                <Icon name={icon} size={16} />
              </span>
            )}
            <div class="min-w-0">
              <h2 class="modal-title">{title}</h2>
              {subtitle && <p class="modal-sub">{subtitle}</p>}
            </div>
          </div>
          {headerExtra}
          <IconButton icon="x" label="Fermer" onClick={onClose} />
        </header>
        <div class="modal-body">{children}</div>
        {footer && <footer class="modal-foot">{footer}</footer>}
      </div>
    </div>
  );
}

export function Drawer({ onClose, children, width = 560, class: cls }) {
  useLockScroll();
  return (
    <div class="overlay overlay-drawer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside class={cx('drawer', cls)} style={{ '--drawer-w': width + 'px' }} role="dialog" aria-modal="true">
        {children}
      </aside>
    </div>
  );
}

export function ConfirmDialog({ ov, onClose }) {
  return (
    <Modal
      title={ov.title || 'Confirmer'}
      size="sm"
      onClose={onClose}
      icon={ov.danger ? 'alert' : 'info'}
      noAutoFocus
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant={ov.danger ? 'danger' : 'primary'}
            data-autofocus
            onClick={() => {
              onClose();
              ov.onConfirm && ov.onConfirm();
            }}
          >
            {ov.confirmLabel || 'Confirmer'}
          </Button>
        </>
      }
    >
      <p class="text-2">{ov.text}</p>
    </Modal>
  );
}

/* Menu contextuel positionné sur le déclencheur (rendu dans <body>). */
export function Menu({ trigger, items, align = 'right', width = 220 }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btn = useRef(null);
  const panel = useRef(null);
  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const h = panel.current ? panel.current.offsetHeight : 240;
    const below = r.bottom + 6 + h < window.innerHeight;
    let left = align === 'right' ? r.right - width : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    setPos({ left, top: below ? r.bottom + 6 : Math.max(8, r.top - h - 6) });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const off = (e) => {
      if (panel.current && panel.current.contains(e.target)) return;
      if (btn.current && btn.current.contains(e.target)) return;
      setOpen(false);
    };
    const esc = (e) => e.key === 'Escape' && (e.stopPropagation(), setOpen(false));
    document.addEventListener('mousedown', off, true);
    document.addEventListener('touchstart', off, true);
    document.addEventListener('keydown', esc, true);
    window.addEventListener('resize', () => setOpen(false), { once: true });
    return () => {
      document.removeEventListener('mousedown', off, true);
      document.removeEventListener('touchstart', off, true);
      document.removeEventListener('keydown', esc, true);
    };
  }, [open]);
  return (
    <>
      <span
        ref={btn}
        class="menu-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {trigger}
      </span>
      {open &&
        createPortal(
          <div ref={panel} class="menu" style={{ width, left: pos ? pos.left : -9999, top: pos ? pos.top : -9999 }} role="menu">
            {items.filter(Boolean).map((it, i) =>
              it === '-' ? (
                <div class="menu-sep" key={i} />
              ) : it.header ? (
                <div class="menu-header" key={i}>
                  {it.header}
                </div>
              ) : (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  class={cx('menu-item', it.danger && 'danger', it.active && 'active')}
                  disabled={it.disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    it.onClick && it.onClick();
                  }}
                >
                  {it.icon ? <Icon name={it.icon} size={15} /> : it.dot ? <span class={cx('menu-dot', `tone-${it.dot}`)} /> : null}
                  <span class="menu-label">{it.label}</span>
                  {it.active && <Icon name="check" size={14} class="menu-check" />}
                  {it.hint && <span class="menu-hint">{it.hint}</span>}
                </button>
              ),
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div class="tabs" role="tablist">
      {tabs.map((t) => (
        <button type="button" role="tab" aria-selected={t.value === value} class={cx('tab', t.value === value && 'active')} onClick={() => onChange(t.value)}>
          {t.icon && <Icon name={t.icon} size={15} />}
          {t.label}
          {t.count != null && <span class="tab-count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Stepper({ value, onChange, min = 0, step = 1 }) {
  return (
    <div class="stepper">
      <button type="button" onClick={() => onChange(Math.max(min, (Number(value) || 0) - step))} aria-label="Moins">
        −
      </button>
      <input class="input" type="number" inputMode="numeric" value={value} min={min} onInput={(e) => onChange(Number(e.target.value) || 0)} />
      <button type="button" onClick={() => onChange((Number(value) || 0) + step)} aria-label="Plus">
        +
      </button>
    </div>
  );
}

export function useMedia(q) {
  const get = () => (window.matchMedia ? matchMedia(q).matches : false);
  const [m, setM] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = matchMedia(q);
    const f = () => setM(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', f) : mq.addListener(f);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', f) : mq.removeListener(f));
  }, [q]);
  return m;
}
export const useDesktop = () => useMedia('(min-width: 1024px)');
