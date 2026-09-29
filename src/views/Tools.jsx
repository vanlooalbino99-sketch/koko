// Outils : enregistreur d'appels, documents (stockés sur l'appareil), script & modèles d'email éditables, intégrations.
import { useState, useRef, useEffect } from 'preact/hooks';
import { db, useStore } from '../lib/store.js';
import { toast, open } from '../lib/nav.js';
import { files, addFile, removeFile, getBlob } from '../lib/files.js';
import { DEFAULT_SCRIPT, DEFAULT_TEMPLATES, TEMPLATE_VARS } from '../lib/constants.js';
import { uid, today, fmtDuration, fmtDateFull, fmtSize, download } from '../lib/util.js';
import { PageHeader, Card, Button, IconButton, Tabs, Field, Input, Textarea, Select, EmptyState, cx } from '../components/ui.jsx';
import { Icon } from '../components/icons.jsx';

export function Tools() {
  const [tab, setTab] = useState('record');
  return (
    <>
      <PageHeader title="Outils" subtitle="Enregistrements, documents, script d'appel, modèles d'email et intégrations" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'record', label: 'Enregistreur', icon: 'mic' },
          { value: 'docs', label: 'Documents', icon: 'folder' },
          { value: 'script', label: "Script d'appel", icon: 'book' },
          { value: 'templates', label: "Modèles d'email", icon: 'mail' },
          { value: 'apps', label: 'Intégrations', icon: 'sparkles' },
        ]}
      />
      <div class="mt-16">
        {tab === 'record' && <Recorder />}
        {tab === 'docs' && <Documents />}
        {tab === 'script' && <ScriptEditor />}
        {tab === 'templates' && <TemplatesEditor />}
        {tab === 'apps' && <Integrations />}
      </div>
    </>
  );
}

function useBlobUrl(id, enabled) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    let u = null;
    getBlob(id).then((b) => {
      if (b) {
        u = URL.createObjectURL(b);
        setUrl(u);
      }
    });
    return () => u && URL.revokeObjectURL(u);
  }, [id, enabled]);
  return url;
}

function RecordingItem({ r }) {
  const [play, setPlay] = useState(false);
  const url = useBlobUrl(r.id, play);
  return (
    <div class="list-item" style={{ flexWrap: 'wrap' }}>
      <span class="file-ic tone-rose">
        <Icon name="mic" size={16} />
      </span>
      <div class="li-main">
        <div class="li-title">{r.prospectName || 'Sans prospect'}</div>
        <div class="li-sub">
          {fmtDateFull(r.date)} · {fmtDuration(r.duration)} · {fmtSize(r.size)}
        </div>
      </div>
      <div class="row gap-4">
        {!play && (
          <Button size="sm" variant="soft" icon="play" onClick={() => setPlay(true)}>
            Écouter
          </Button>
        )}
        <IconButton
          icon="download"
          label="Télécharger"
          onClick={async () => {
            const b = await getBlob(r.id);
            b && download(`${r.name || 'enregistrement'}.${(r.mime || '').includes('mp4') ? 'm4a' : 'webm'}`, b);
          }}
        />
        {r.prospectId && <IconButton icon="building" label="Ouvrir la fiche" onClick={() => open('prospect', { id: r.prospectId })} />}
        <IconButton icon="trash" label="Supprimer" onClick={() => open('confirm', { title: 'Supprimer cet enregistrement ?', danger: true, confirmLabel: 'Supprimer', onConfirm: () => removeFile(r.id).then(() => toast('Enregistrement supprimé')) })} />
      </div>
      {play && url && <audio src={url} controls autoPlay style={{ flexBasis: '100%', marginTop: 8 }} />}
    </div>
  );
}

function Recorder() {
  const prospects = useStore(db, (s) => s.prospects);
  const { list, error } = useStore(files);
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [pid, setPid] = useState('');
  const mr = useRef(null);
  const chunks = useRef([]);
  const stream = useRef(null);
  const timer = useRef(null);
  const secsRef = useRef(0);
  const recs = list.filter((f) => f.kind === 'recording');
  useEffect(() => () => {
    clearInterval(timer.current);
    stream.current && stream.current.getTracks().forEach((t) => t.stop());
  }, []);
  async function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) return toast('Enregistrement audio non supporté par ce navigateur', { tone: 'error' });
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const m = new MediaRecorder(s);
      chunks.current = [];
      m.ondataavailable = (e) => e.data && e.data.size && chunks.current.push(e.data);
      m.onstop = async () => {
        const blob = new Blob(chunks.current, { type: m.mimeType || 'audio/webm' });
        const p = prospects.find((x) => x.id === pid);
        try {
          await addFile({ id: uid(), kind: 'recording', name: `appel-${p ? p.entreprise : 'sans-prospect'}-${today()}`, prospectId: pid || null, prospectName: p ? p.entreprise : 'Sans prospect', date: today(), duration: secsRef.current, mime: blob.type }, blob);
          toast('Enregistrement sauvegardé sur cet appareil');
        } catch (e) {
          toast("Impossible d'enregistrer le fichier", { tone: 'error' });
        }
        s.getTracks().forEach((t) => t.stop());
      };
      mr.current = m;
      m.start();
      setRec(true);
      setSecs(0);
      secsRef.current = 0;
      timer.current = setInterval(() => {
        secsRef.current += 1;
        setSecs(secsRef.current);
      }, 1000);
    } catch (e) {
      toast('Micro inaccessible — vérifiez les autorisations du navigateur', { tone: 'error' });
    }
  }
  function stop() {
    if (mr.current && rec) {
      mr.current.stop();
      clearInterval(timer.current);
      setRec(false);
    }
  }
  return (
    <div class="layout-2">
      <Card title="Enregistrements" subtitle="Conservés sur cet appareil (non envoyés en ligne)" icon="history" pad={false}>
        {error && <div class="p-section callout tone-amber">{error}</div>}
        {recs.length ? recs.map((r) => <RecordingItem r={r} key={r.id} />) : <EmptyState compact icon="mic" title="Aucun enregistrement pour le moment" text="Enregistrez vos appels pour les réécouter et progresser." />}
      </Card>
      <Card title="Nouvel enregistrement" icon="mic">
        <div style={{ textAlign: 'center' }} class="stack">
          <div>
            <div class={cx('rec-orb', rec && 'on')}>
              <Icon name="mic" size={34} />
            </div>
            <div class="rec-time">{fmtDuration(secs)}</div>
            <div class="sm text-3">{rec ? 'Enregistrement en cours…' : 'Prêt à enregistrer'}</div>
          </div>
          <Field label="Prospect associé (optionnel)">
            <Select value={pid} onChange={(e) => setPid(e.target.value)} disabled={rec}>
              <option value="">— Aucun —</option>
              {[...prospects]
                .sort((a, b) => a.entreprise.localeCompare(b.entreprise, 'fr'))
                .map((p) => (
                  <option value={p.id}>{p.entreprise}</option>
                ))}
            </Select>
          </Field>
          {rec ? (
            <Button size="lg" variant="danger" icon="stop" block onClick={stop}>
              Arrêter et sauvegarder
            </Button>
          ) : (
            <Button size="lg" variant="primary" icon="mic" block onClick={start}>
              Démarrer l'enregistrement
            </Button>
          )}
          <p class="xs text-3">Informez toujours votre interlocuteur avant d'enregistrer une conversation.</p>
        </div>
      </Card>
    </div>
  );
}

const EXT_TONE = { pdf: 'rose', doc: 'blue', docx: 'blue', xls: 'emerald', xlsx: 'emerald', csv: 'emerald', ppt: 'orange', pptx: 'orange', png: 'violet', jpg: 'violet', jpeg: 'violet', webp: 'violet', txt: 'slate' };
function Documents() {
  const { list } = useStore(files);
  const [over, setOver] = useState(false);
  const input = useRef(null);
  const docs = list.filter((f) => f.kind === 'document');
  async function add(fl) {
    const arr = Array.from(fl || []);
    let n = 0;
    for (const f of arr) {
      try {
        await addFile({ id: uid(), kind: 'document', name: f.name, mime: f.type, date: today() }, f);
        n++;
      } catch (e) {
        toast(`Impossible d'ajouter ${f.name}`, { tone: 'error' });
      }
    }
    if (n) toast(`${n} document${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''}`);
  }
  async function openDoc(d) {
    const b = await getBlob(d.id);
    if (!b) return;
    const u = URL.createObjectURL(b);
    const w = window.open(u, '_blank');
    if (!w) download(d.name, b);
    setTimeout(() => URL.revokeObjectURL(u), 60000);
  }
  return (
    <div class="stack">
      <div
        class={cx('dropzone', over && 'over')}
        onClick={() => input.current.click()}
        onDragOver={(e) => (e.preventDefault(), setOver(true))}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
      >
        <Icon name="upload" size={22} style={{ margin: '0 auto 8px', color: 'var(--accent-text)' }} />
        <div class="fw-6">Ajouter des documents</div>
        <div class="xs text-3">Plaquettes, présentations, contrats — PDF, Word, Excel, PowerPoint, images</div>
        <input ref={input} type="file" multiple hidden onChange={(e) => (add(e.target.files), (e.target.value = ''))} />
      </div>
      <Card pad={false} title="Bibliothèque" subtitle={`${docs.length} document${docs.length > 1 ? 's' : ''} · stockés sur cet appareil`} icon="folder">
        {docs.length ? (
          docs.map((d) => {
            const ext = (d.name.split('.').pop() || '').toLowerCase();
            return (
              <div class="list-item clickable" onClick={() => openDoc(d)}>
                <span class={cx('file-ic', `tone-${EXT_TONE[ext] || 'slate'}`)}>{ext.slice(0, 4).toUpperCase() || 'FIC'}</span>
                <div class="li-main">
                  <div class="li-title">{d.name}</div>
                  <div class="li-sub">
                    {fmtSize(d.size)} · ajouté le {fmtDateFull(d.date)}
                  </div>
                </div>
                <div class="row gap-4" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    icon="download"
                    label="Télécharger"
                    onClick={async () => {
                      const b = await getBlob(d.id);
                      b && download(d.name, b);
                    }}
                  />
                  <IconButton icon="trash" label="Supprimer" onClick={() => open('confirm', { title: `Supprimer « ${d.name} » ?`, danger: true, confirmLabel: 'Supprimer', onConfirm: () => removeFile(d.id).then(() => toast('Document supprimé')) })} />
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState compact icon="folder" title="Aucun document pour le moment" />
        )}
      </Card>
    </div>
  );
}

function ScriptEditor() {
  const script = useStore(db, (s) => s.script);
  const [draft, setDraft] = useState(() => script.map((s) => ({ ...s, text: s.points.join('\n') })));
  const [dirty, setDirty] = useState(false);
  const upd = (i, k, v) => {
    setDraft((d) => d.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
    setDirty(true);
  };
  const move = (i, dir) => {
    setDraft((d) => {
      const n = [...d];
      const j = i + dir;
      if (j < 0 || j >= n.length) return d;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    setDirty(true);
  };
  function save() {
    db.set({ script: draft.map(({ text, ...s }) => ({ ...s, points: text.split('\n').map((x) => x.trim()).filter(Boolean) })).filter((s) => s.title.trim()) });
    setDirty(false);
    toast("Script d'appel enregistré");
  }
  return (
    <div class="stack">
      <div class="row-wrap between">
        <p class="sm text-2 grow">Votre script s'affiche pendant chaque appel. Une ligne = un point. Utilisez [secteur] et [Prénom], remplacés automatiquement.</p>
        <Button
          variant="ghost"
          icon="refresh"
          onClick={() => {
            setDraft(DEFAULT_SCRIPT.map((s) => ({ ...s, text: s.points.join('\n') })));
            setDirty(true);
          }}
        >
          Script par défaut
        </Button>
        <Button variant="primary" icon="check" disabled={!dirty} onClick={save}>
          Enregistrer
        </Button>
      </div>
      {draft.map((s, i) => (
        <Card>
          <div class="row mb-12">
            <span class="script-num">{i + 1}</span>
            <Input value={s.title} onInput={(e) => upd(i, 'title', e.target.value)} placeholder="Titre de l'étape" class="fw-6" />
            <IconButton icon="chevronUp" label="Monter" onClick={() => move(i, -1)} disabled={i === 0} />
            <IconButton icon="chevronDown" label="Descendre" onClick={() => move(i, 1)} disabled={i === draft.length - 1} />
            <IconButton
              icon="trash"
              label="Supprimer l'étape"
              onClick={() => {
                setDraft((d) => d.filter((_, j) => j !== i));
                setDirty(true);
              }}
            />
          </div>
          <div class="stack-sm">
            <Input value={s.subtitle} onInput={(e) => upd(i, 'subtitle', e.target.value)} placeholder="Sous-titre (objectif de l'étape)" />
            <Textarea value={s.text} onInput={(e) => upd(i, 'text', e.target.value)} rows={4} placeholder="Un point par ligne" />
          </div>
        </Card>
      ))}
      <Button
        icon="plus"
        onClick={() => {
          setDraft((d) => [...d, { title: `${d.length + 1}. Nouvelle étape`, subtitle: '', text: '' }]);
          setDirty(true);
        }}
      >
        Ajouter une étape
      </Button>
    </div>
  );
}

function TemplatesEditor() {
  const templates = useStore(db, (s) => s.templates);
  const [sel, setSel] = useState(templates[0] ? templates[0].id : null);
  const t = templates.find((x) => x.id === sel) || templates[0];
  const upd = (k, v) => db.set((s) => ({ templates: s.templates.map((x) => (x.id === t.id ? { ...x, [k]: v } : x)) }));
  return (
    <div class="layout-2" style={{ gridTemplateColumns: undefined }}>
      <Card
        title={t ? t.label : 'Modèle'}
        icon="mail"
        actions={
          t &&
          templates.length > 1 && (
            <IconButton
              icon="trash"
              label="Supprimer ce modèle"
              onClick={() =>
                open('confirm', {
                  title: `Supprimer le modèle « ${t.label} » ?`,
                  danger: true,
                  confirmLabel: 'Supprimer',
                  onConfirm: () => {
                    db.set((s) => ({ templates: s.templates.filter((x) => x.id !== t.id) }));
                    setSel(null);
                  },
                })
              }
            />
          )
        }
      >
        {t ? (
          <div class="stack">
            <Field label="Nom du modèle">
              <Input value={t.label} onInput={(e) => upd('label', e.target.value)} />
            </Field>
            <Field label="Objet">
              <Input value={t.subject} onInput={(e) => upd('subject', e.target.value)} />
            </Field>
            <Field label="Message" hint={`Variables : ${TEMPLATE_VARS.map((v) => `{${v}}`).join(' ')} — enregistrement automatique.`}>
              <Textarea value={t.body} onInput={(e) => upd('body', e.target.value)} style={{ minHeight: 260 }} />
            </Field>
          </div>
        ) : (
          <EmptyState compact title="Choisissez un modèle" />
        )}
      </Card>
      <Card title="Modèles" icon="list" pad={false} subtitle={`${templates.length} modèles`}>
        {templates.map((x) => (
          <button class={cx('list-item clickable', x.id === (t && t.id) && 'selected')} style={x.id === (t && t.id) ? { background: 'var(--accent-soft)' } : null} onClick={() => setSel(x.id)}>
            <Icon name="mail" size={15} class="text-3" />
            <div class="li-main">
              <div class="li-title sm">{x.label}</div>
              <div class="li-sub">{x.subject}</div>
            </div>
          </button>
        ))}
        <div class="p-section row-wrap">
          <Button
            size="sm"
            icon="plus"
            onClick={() => {
              const id = uid();
              db.set((s) => ({ templates: [...s.templates, { id, label: 'Nouveau modèle', subject: '{entreprise}', body: 'Bonjour {contact},\n\n\n\nCordialement,\n{expediteur}' }] }));
              setSel(id);
            }}
          >
            Nouveau modèle
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon="refresh"
            onClick={() =>
              open('confirm', {
                title: 'Restaurer les modèles par défaut ?',
                text: 'Vos modifications de modèles seront remplacées.',
                confirmLabel: 'Restaurer',
                onConfirm: () => {
                  db.set({ templates: DEFAULT_TEMPLATES });
                  setSel(DEFAULT_TEMPLATES[0].id);
                },
              })
            }
          >
            Par défaut
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Integrations() {
  const apps = [
    { name: 'Simulation d\'appel avec IA', tag: 'Pitchbase.app', text: "Entraînez-vous face à un client virtuel généré par IA avant vos vrais appels : choisissez un scénario (secteur, objections), simulez l'appel et recevez un retour sur votre pitch.", url: 'https://pitchbase.app', cta: 'Lancer une simulation', icon: 'sparkles', tone: 'violet' },
    { name: 'Téléphonie — Ringover', tag: 'ringover.com', text: "Passez vos appels, consultez votre historique et vos statistiques d'appels directement sur Ringover.", url: 'https://www.ringover.com', cta: 'Ouvrir Ringover', icon: 'headset', tone: 'emerald' },
    { name: 'Annuaire des entreprises', tag: 'annuaire-entreprises.data.gouv.fr', text: "Vérifiez une entreprise (SIRET, dirigeants, finances) avant l'appel. La recherche Sirene est aussi intégrée dans « Importer des leads ».", url: 'https://annuaire-entreprises.data.gouv.fr', cta: "Ouvrir l'annuaire", icon: 'building', tone: 'blue' },
    { name: 'Google Agenda', tag: 'calendar.google.com', text: 'Bloquez vos audits et rendez-vous clients dans votre agenda principal.', url: 'https://calendar.google.com', cta: 'Ouvrir Google Agenda', icon: 'calendar', tone: 'amber' },
  ];
  return (
    <div class="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {apps.map((a) => (
        <Card>
          <div class="tool-card">
            <span class={cx('tool-logo', `tone-${a.tone}`)}>
              <Icon name={a.icon} size={20} />
            </span>
            <div class="grow min-w-0">
              <div class="fw-7">{a.name}</div>
              <div class="xs text-3">{a.tag}</div>
              <p class="sm text-2 mt-8">{a.text}</p>
              <a class="btn btn-soft btn-sm mt-12" href={a.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                {a.cta} <Icon name="external" size={13} />
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
