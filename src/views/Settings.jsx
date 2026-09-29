// Réglages : entreprise, objectifs, apparence, notifications, données (sauvegarde / restauration).
import { useState, useRef, useEffect } from 'preact/hooks';
import { db, useStore, exportData, importData } from '../lib/store.js';
import { open, toast } from '../lib/nav.js';
import { ui, setUi, usePreset, PRESETS, FONTS, isDark } from '../lib/theme.js';
import { askNotifications, chimeAlert } from '../lib/sound.js';
import { DEFAULT_SETTINGS, DEFAULT_COMPANY } from '../lib/constants.js';
import { download, readFileText, today, fmtSize, plural } from '../lib/util.js';
import { PageHeader, Card, Button, Field, Input, Textarea, Select, Segmented, Toggle, Stepper, Kbd, cx } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';
import { exportProspectsCsv } from './Prospects.jsx';
import { loadDemo } from './Today.jsx';

const SECTIONS = [
  { id: 'company', label: 'Entreprise', icon: 'building' },
  { id: 'goals', label: 'Objectifs', icon: 'target' },
  { id: 'look', label: 'Apparence', icon: 'palette' },
  { id: 'notif', label: 'Notifications', icon: 'bell' },
  { id: 'data', label: 'Données', icon: 'database' },
  { id: 'help', label: 'Raccourcis', icon: 'keyboard' },
];

export function Settings() {
  const [sec, setSec] = useState('company');
  return (
    <>
      <PageHeader title="Réglages" subtitle="Personnalisez l'application, vos informations et vos objectifs" />
      <div class="settings-layout">
        <nav class="settings-nav">
          {SECTIONS.map((s) => (
            <button class={cx('sn-item', sec === s.id && 'active')} onClick={() => setSec(s.id)}>
              <Icon name={s.icon} size={16} />
              {s.label}
            </button>
          ))}
        </nav>
        <div class="stack">
          {sec === 'company' && <Company />}
          {sec === 'goals' && <Goals />}
          {sec === 'look' && <Look />}
          {sec === 'notif' && <Notif />}
          {sec === 'data' && <Data />}
          {sec === 'help' && <Help />}
        </div>
      </div>
    </>
  );
}

function Company() {
  const c = useStore(db, (s) => s.companyInfo);
  const set = (k) => (e) => db.set((s) => ({ companyInfo: { ...s.companyInfo, [k]: e.target.value } }));
  return (
    <Card title="Informations de l'entreprise" subtitle="Utilisées pour l'en-tête des devis et factures et la signature des emails — enregistrement automatique" icon="building">
      <div class="grid-2">
        <Field label="Nom de l'entreprise">
          <Input value={c.nom} onInput={set('nom')} placeholder="Blackstart AI" />
        </Field>
        <Field label="Votre nom (signature des emails)">
          <Input value={c.expediteur} onInput={set('expediteur')} placeholder="Prénom Nom" />
        </Field>
        <Field label="Adresse" class="span-2">
          <Input value={c.adresse} onInput={set('adresse')} placeholder="12 rue de la Prospection, 75000 Paris" />
        </Field>
        <Field label="Email de contact">
          <Input type="email" value={c.email} onInput={set('email')} placeholder="contact@blackstart.ai" />
        </Field>
        <Field label="Téléphone">
          <Input value={c.telephone} onInput={set('telephone')} placeholder="01 23 45 67 89" />
        </Field>
        <Field label="Site web">
          <Input value={c.site} onInput={set('site')} placeholder="blackstart.ai" />
        </Field>
        <Field label="SIRET">
          <Input value={c.siret} onInput={set('siret')} placeholder="000 000 000 00000" />
        </Field>
        <Field label="N° TVA intracommunautaire">
          <Input value={c.tvaIntra} onInput={set('tvaIntra')} placeholder="FR00 000000000" />
        </Field>
        <Field label="EIN (LLC US)">
          <Input value={c.ein} onInput={set('ein')} placeholder="00-0000000" />
        </Field>
        <Field label="Mentions légales (bas de facture)" class="span-2">
          <Textarea value={c.mentions} onInput={set('mentions')} rows={3} />
        </Field>
      </div>
      <p class="xs text-3 mt-12">
        Liens de paiement et IBAN : voir la page <strong>Paiements</strong>.
      </p>
    </Card>
  );
}

function Goals() {
  const st = useStore(db, (s) => s.settings);
  const set = (k, v) => db.set((s) => ({ settings: { ...s.settings, [k]: Math.max(0, Number(v) || 0) } }));
  return (
    <Card title="Objectifs commerciaux" subtitle="Affichés sur « Aujourd'hui », le tableau de bord et les clients" icon="target">
      <div class="grid-2">
        <Field label="Appels par semaine">
          <Stepper value={st.targetCallsWeek} step={5} onChange={(v) => set('targetCallsWeek', v)} />
        </Field>
        <Field label="RDV par semaine">
          <Stepper value={st.targetRdvWeek} onChange={(v) => set('targetRdvWeek', v)} />
        </Field>
        <Field label="CA signé par mois (€)">
          <Stepper value={st.targetCaMonth} step={500} onChange={(v) => set('targetCaMonth', v)} />
        </Field>
        <Field label="MRR visé (€)">
          <Stepper value={st.targetMrr} step={100} onChange={(v) => set('targetMrr', v)} />
        </Field>
        <Field label="Début de journée (agenda)">
          <Stepper value={st.workStart} onChange={(v) => set('workStart', Math.min(v, st.workEnd - 1))} />
        </Field>
        <Field label="Fin de journée (agenda)">
          <Stepper value={st.workEnd} onChange={(v) => set('workEnd', Math.min(23, Math.max(v, st.workStart + 1)))} />
        </Field>
      </div>
    </Card>
  );
}

function Look() {
  const cfg = useStore(ui);
  const dark = isDark(cfg);
  const accents = ['#387CD5', '#4F7DF3', '#22C1D0', '#8B5CF6', '#10B981', '#F97316', '#F43F5E', '#EAB308', '#EC4899', '#64748B'];
  return (
    <>
      <Card title="Thème" icon="palette">
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Mode</div>
            <div class="sr-hint">« Auto » suit le réglage de votre appareil.</div>
          </div>
          <Segmented
            value={cfg.scheme}
            onChange={(v) => setUi({ scheme: v })}
            options={[
              { value: 'dark', label: 'Sombre', icon: 'moon' },
              { value: 'light', label: 'Clair', icon: 'sun' },
              { value: 'auto', label: 'Auto', icon: 'monitor' },
            ]}
          />
        </div>
        <div class="mt-12 mb-8 field-label">Préréglages</div>
        <div class="swatches">
          {PRESETS.map((p) => {
            const [bg, sf] = dark ? p.dark : p.light || ['#F5F7FB', '#FFFFFF'];
            return (
              <button class={cx('swatch', cfg.preset === p.id && cfg.accent.toLowerCase() === p.accent.toLowerCase() && 'on')} onClick={() => usePreset(p.id)}>
                <div class="swatch-prev" style={{ background: bg }}>
                  <i style={{ width: 26, height: 18, background: sf }} />
                  <i style={{ width: 18, height: 26, background: p.accent }} />
                  <i style={{ width: 12, height: 12, background: p.accent, opacity: 0.5 }} />
                </div>
                <div class="swatch-name">{p.label}</div>
              </button>
            );
          })}
        </div>
        <div class="setting-row mt-12">
          <div class="sr-text">
            <div class="sr-label">Couleur d'accent</div>
            <div class="sr-hint">Boutons, sélection, graphiques.</div>
          </div>
          <div class="row-wrap">
            {accents.map((a) => (
              <button class={cx('color-dot', cfg.accent.toLowerCase() === a.toLowerCase() && 'on')} style={{ background: a }} onClick={() => setUi({ accent: a, preset: PRESETS.find((p) => p.accent === a)?.id || 'custom' })} aria-label={a} />
            ))}
            <input type="color" value={cfg.accent} onInput={(e) => setUi({ accent: e.target.value, preset: 'custom' })} aria-label="Couleur personnalisée" />
          </div>
        </div>
      </Card>
      <Card title="Interface" icon="sliders">
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Police</div>
          </div>
          <Select value={cfg.font} onChange={(e) => setUi({ font: e.target.value })} options={Object.entries(FONTS).map(([k, f]) => ({ value: k, label: f.label }))} style={{ width: 200 }} />
        </div>
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Taille du texte</div>
            <div class="sr-hint">{cfg.fontSize}px</div>
          </div>
          <input type="range" min="12" max="18" step="1" value={cfg.fontSize} onInput={(e) => setUi({ fontSize: Number(e.target.value) })} />
        </div>
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Densité</div>
            <div class="sr-hint">« Compacte » affiche plus de lignes à l'écran.</div>
          </div>
          <Segmented
            size="sm"
            value={cfg.density}
            onChange={(v) => setUi({ density: v })}
            options={[
              { value: 'comfortable', label: 'Confortable' },
              { value: 'compact', label: 'Compacte' },
            ]}
          />
        </div>
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Arrondis</div>
            <div class="sr-hint">{cfg.radius}px</div>
          </div>
          <input type="range" min="4" max="20" step="1" value={cfg.radius} onInput={(e) => setUi({ radius: Number(e.target.value) })} />
        </div>
        <Toggle label="Menu latéral replié" hint="Sur ordinateur, n'affiche que les icônes." checked={cfg.sidebar === 'collapsed'} onChange={(v) => setUi({ sidebar: v ? 'collapsed' : 'expanded' })} />
        <Toggle label="Réduire les animations" hint="Interface plus sobre et plus économe." checked={cfg.motion === 'reduced'} onChange={(v) => setUi({ motion: v ? 'reduced' : 'full' })} />
      </Card>
    </>
  );
}

function Notif() {
  const cfg = useStore(ui);
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  return (
    <Card title="Notifications & sons" icon="bell">
      <Toggle label="Sons" hint="Carillon au démarrage, alerte quand une relance passe en retard, succès sur RDV/signature." checked={cfg.sound} onChange={(v) => setUi({ sound: v })} />
      <Toggle
        label="Notifications du navigateur"
        hint={perm === 'unsupported' ? 'Non prises en charge par ce navigateur.' : perm === 'denied' ? 'Bloquées dans les réglages du navigateur.' : "Rappel à l'heure prévue pour vos relances et tâches (l'app doit rester ouverte)."}
        checked={cfg.notifications && perm === 'granted'}
        disabled={perm === 'unsupported' || perm === 'denied'}
        onChange={async (v) => {
          if (v) {
            const ok = await askNotifications();
            setUi({ notifications: ok });
            ok ? toast('Notifications activées') : toast('Notifications refusées', { tone: 'error' });
          } else setUi({ notifications: false });
        }}
      />
      <div class="mt-8">
        <Button size="sm" icon="play" onClick={chimeAlert}>
          Tester le son d'alerte
        </Button>
      </div>
    </Card>
  );
}

function Data() {
  const s = useStore(db);
  const fileRef = useRef(null);
  const [usage, setUsage] = useState(null);
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then((e) => setUsage(e)).catch(() => {});
  }, []);
  async function restore(file) {
    if (!file) return;
    try {
      const obj = JSON.parse(await readFileText(file));
      if (!obj || (!obj.prospects && !obj.devisList)) throw new Error('format');
      open('confirm', {
        title: 'Restaurer cette sauvegarde ?',
        text: `${plural((obj.prospects || []).length, 'prospect')}, ${plural((obj.devisList || []).length, 'devis', 'devis')}, ${plural((obj.factures || []).length, 'facture')}. Les données actuelles seront remplacées.`,
        confirmLabel: 'Restaurer',
        danger: true,
        onConfirm: () => {
          importData(obj);
          toast('Sauvegarde restaurée');
        },
      });
    } catch (e) {
      toast('Fichier illisible : choisissez une sauvegarde .json de Blackstart CRM', { tone: 'error' });
    }
  }
  return (
    <>
      <Card title="Sauvegarde" subtitle="Vos données restent dans ce navigateur. Exportez-les régulièrement." icon="database">
        <div class="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <div class="value-box">
            <div class="v">{s.prospects.length}</div>
            <div class="l">Prospects</div>
          </div>
          <div class="value-box">
            <div class="v">{s.devisList.length + s.factures.length}</div>
            <div class="l">Devis & factures</div>
          </div>
          <div class="value-box">
            <div class="v">{s.tasks.length}</div>
            <div class="l">Tâches</div>
          </div>
          <div class="value-box">
            <div class="v">{usage ? fmtSize(usage.usage) : '—'}</div>
            <div class="l">Espace utilisé</div>
          </div>
        </div>
        <div class="row-wrap mt-16">
          <Button variant="primary" icon="download" onClick={() => (download(`blackstart-sauvegarde-${today()}.json`, JSON.stringify(exportData(), null, 2), 'application/json'), toast('Sauvegarde téléchargée'))}>
            Exporter une sauvegarde
          </Button>
          <Button icon="upload" onClick={() => fileRef.current.click()}>
            Restaurer
          </Button>
          <Button icon="fileSheet" onClick={() => exportProspectsCsv(s.prospects)} disabled={!s.prospects.length}>
            Prospects en CSV
          </Button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(e) => (restore(e.target.files[0]), (e.target.value = ''))} />
        </div>
        <p class="xs text-3 mt-12">Compatible avec les données de la version précédente (v3) : elles ont été reprises automatiquement.</p>
      </Card>
      <Card title="Zone sensible" icon="alert">
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Charger des données de démonstration</div>
            <div class="sr-hint">Remplace vos données actuelles par un jeu d'exemple réaliste.</div>
          </div>
          <Button icon="sparkles" onClick={() => open('confirm', { title: 'Charger la démonstration ?', text: 'Vos données actuelles seront remplacées. Exportez une sauvegarde avant si besoin.', confirmLabel: 'Charger', danger: true, onConfirm: loadDemo })}>
            Démo
          </Button>
        </div>
        <div class="setting-row">
          <div class="sr-text">
            <div class="sr-label">Tout effacer</div>
            <div class="sr-hint">Supprime prospects, devis, factures et tâches. Vos réglages sont conservés.</div>
          </div>
          <Button
            variant="danger"
            icon="trash"
            onClick={() =>
              open('confirm', {
                title: 'Effacer toutes les données ?',
                text: 'Cette action est définitive. Pensez à exporter une sauvegarde avant.',
                confirmLabel: 'Tout effacer',
                danger: true,
                onConfirm: () => {
                  db.set({ prospects: [], devisList: [], factures: [], tasks: [] });
                  toast('Données effacées');
                },
              })
            }
          >
            Effacer
          </Button>
        </div>
      </Card>
    </>
  );
}

function Help() {
  const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
  const rows = [
    [[mod, 'K'], 'Recherche globale et commandes'],
    [['N'], 'Nouveau prospect'],
    [['T'], 'Nouvelle tâche'],
    [['/'], 'Rechercher dans la page'],
    [['G', 'puis', 'A / C / P / L / T / D / S / R'], "Aller à Aujourd'hui / Agenda / Prospects / Pipeline / Tâches / Devis / Tableau de bord / Rapports"],
    [['?'], 'Aide des raccourcis'],
    [['Échap'], 'Fermer une fenêtre'],
  ];
  return (
    <Card title="Raccourcis clavier" icon="keyboard">
      <div class="col" style={{ gap: 12 }}>
        {rows.map(([k, l]) => (
          <div class="row between" style={{ gap: 16, flexWrap: 'wrap' }}>
            <span class="text-2 sm">{l}</span>
            <span class="row gap-4">
              {k.map((x) => (x === 'puis' ? <span class="xs text-3">puis</span> : <Kbd>{x}</Kbd>))}
            </span>
          </div>
        ))}
      </div>
      <p class="xs text-3 mt-16">Blackstart CRM v4 — application autonome, vos données restent sur votre appareil.</p>
    </Card>
  );
}
