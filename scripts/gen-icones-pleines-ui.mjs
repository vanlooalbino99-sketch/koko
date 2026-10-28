// Génère app/modules/bs-icones-pleines-ui.js : la version pleine deux tons (style « Bulk » d'Iconsax) des icônes
// de l'interface (boutons, en-têtes de cartes, onglets…), comme celles du menu (bs-icones-pleines.js).
//
//   npm pack iconsax-react@0.0.8 && tar xzf iconsax-react-0.0.8.tgz
//   node scripts/gen-icones-pleines-ui.mjs <dossier>/package
//
// Tracés d'iconsax-react 0.0.8 (licence MIT, https://github.com/rendinjast/iconsax-react), icônes Iconsax de Vuesax.
// Les signes simples (croix, coches, flèches, chevrons, plus, points) restent au trait : ils n'ont pas de version pleine.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PKG = process.argv[2];
if (!PKG) { console.error('Usage : node scripts/gen-icones-pleines-ui.mjs <dossier du paquet iconsax-react>'); process.exit(1); }

// Nom utilisé dans le CRM → icône Iconsax.
const NOMS = {

  phone: 'Call', tel: 'Call', phoneCall: 'CallCalling', 'phone-call': 'CallCalling', phoneOff: 'CallSlash',
  mail: 'Sms', sms: 'MessageText', 'message-circle': 'Message', 'message-square': 'Message', 'messages-square': 'Messages2',
  calendar: 'Calendar', calendrier: 'Calendar', 'calendar-days': 'Calendar', calendarClock: 'CalendarTick', 'calendar-check': 'CalendarTick', 'cal-plus': 'CalendarAdd', 'calendar-plus': 'CalendarAdd',
  users: 'People', user: 'User', userPlus: 'UserAdd', 'user-plus': 'UserAdd', 'user-search': 'UserSearch', contact: 'Personalcard', 'user-round': 'User',
  building: 'Building', batiment: 'Building', 'building-2': 'Building3', briefcase: 'Briefcase',
  fileText: 'DocumentText', 'file-text': 'DocumentText', doc: 'DocumentText', file: 'Document', files: 'DocumentCopy', fileSheet: 'Document',
  receipt: 'Receipt', card: 'Card', 'credit-card': 'Card', wallet: 'EmptyWallet',
  checkSquare: 'TickSquare', 'square-check': 'TickSquare', 'circle-check': 'TickCircle', 'check-circle': 'TickCircle',
  clock: 'Clock', history: 'Timer1', timer: 'Timer1',
  trash: 'Trash', 'trash-2': 'Trash', pencil: 'Edit2', crayon: 'Edit2', copy: 'Copy',
  download: 'Import', telecharger: 'Import', upload: 'Export', printer: 'Printer', send: 'Send2', 'ia-send': 'Send2',
  alert: 'Warning2', 'triangle-alert': 'Warning2', info: 'InfoCircle',
  sparkles: 'MagicStar', zap: 'Flash', mic: 'Microphone2', micro: 'Microphone2', micOff: 'MicrophoneSlash',
  play: 'Play', lecture: 'Play', pause: 'Pause', stop: 'Stop',
  folder: 'Folder2', external: 'ExportSquare', 'external-link': 'ExportSquare',
  filter: 'Filter', 'list-filter': 'Filter', list: 'Task', table: 'Grid5', kanban: 'Kanban', grid: 'Category',
  moon: 'Moon', sun: 'Sun1', monitor: 'Monitor', bell: 'Notification',
  star: 'Star1', etoile: 'Star1', tag: 'Tag', flag: 'Flag', target: 'Radar2',
  euro: 'Coin', barChart: 'Chart', 'chart-column': 'Chart', 'chart-bar': 'Chart', lineChart: 'Graph', 'chart-line': 'Graph', 'chart-spline': 'Graph',
  'chart-pie': 'Chart2', dashboard: 'Element3', activity: 'Activity',
  wrench: 'Setting3', settings: 'Setting2', sliders: 'Setting4', palette: 'ColorSwatch', database: 'Data',
  mapPin: 'Location', 'map-pin': 'Location', globe: 'Global', link: 'Link', lien: 'Link',
  eye: 'Eye', keyboard: 'Keyboard', book: 'Book', library: 'Book1', inbox: 'DirectInbox', headset: 'Headphone', logout: 'Logout',
  video: 'Video', camera: 'Camera', award: 'Award', trophy: 'Cup', crown: 'Crown', lock: 'Lock', 'shield-check': 'ShieldTick',
  bookmark: 'Bookmark', trombone: 'Paperclip2', paperclip: 'Paperclip2', 'clipboard-list': 'ClipboardText', sourire: 'EmojiHappy', note: 'Note',
  repeat: 'Repeat', refresh: 'Refresh2', shapes: 'Shapes', percent: 'PercentageSquare', 'rap-pourcent': 'PercentageSquare',
  'graduation-cap': 'Teacher', gift: 'Gift', lightbulb: 'Lamp', heart: 'Heart', medal: 'Medal', map: 'Map1', ticket: 'Ticket',
  hierarchy: 'Hierarchy', network: 'Hierarchy', volume: 'VolumeHigh', box: 'Box', package: 'Box', cpu: 'Cpu', code: 'Code',
  'thumbs-up': 'Like1', 'hand-coins': 'MoneyRecive', banknote: 'Money', coins: 'Moneys', 'circle-dollar-sign': 'DollarCircle',
};

// Rend une icône Bulk en SVG : on exécute sa fonction React avec un faux createElement.
function bulk(nom) {
  const src = readFileSync(join(PKG, 'dist/esm', nom + '.js'), 'utf8');
  const a = src.indexOf('var Bulk = function Bulk(');
  const b = src.indexOf('\nvar ', a + 10);
  if (a < 0 || b < 0) throw new Error('Pas de variante Bulk pour ' + nom);
  const attr = (k) => ({ strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin', strokeMiterlimit: 'stroke-miterlimit', fillRule: 'fill-rule', clipRule: 'clip-rule' }[k] || k);
  const React = {
    Fragment: 'frag',
    createElement(tag, props, ...kids) {
      const inner = kids.flat().filter(Boolean).join('');
      if (tag === 'frag') return inner;
      const p = Object.assign({}, props || {});
      // Couleur → currentColor ; les parties pleines n'ont pas de trait (le composant d'icône en met un par défaut).
      for (const k of Object.keys(p)) if (p[k] === '#COL') p[k] = 'currentColor';
      if (p.fill === 'currentColor' && !p.stroke) p.stroke = 'none';
      if (p.stroke === 'currentColor' && !p.fill) p.fill = 'none';
      const s = Object.entries(p).map(([k, v]) => ` ${attr(k)}="${String(v)}"`).join('');
      return `<${tag}${s}${inner ? `>${inner}</${tag}>` : '/>'}`;
    },
  };
  const fn = new Function('React', src.slice(a, b) + '\nreturn Bulk;')(React);
  return fn({ color: '#COL' }).replace(/opacity="\.4"/g, 'opacity=".4"');
}

const svg = {};
for (const n of new Set(Object.values(NOMS))) svg[n] = bulk(n);
const tete = `/* Blackstart CRM : icônes pleines en deux tons de l'interface (boutons, en-têtes de cartes, onglets…), style « Bulk »,
 * comme celles du menu. Tracés repris d'iconsax-react 0.0.8 (licence MIT, https://github.com/rendinjast/iconsax-react),
 * icônes Iconsax de Vuesax. Généré par scripts/gen-icones-pleines-ui.mjs : ne pas modifier à la main.
 * svg : tracé de chaque icône Iconsax ; noms : nom d'icône du CRM → icône Iconsax.
 *
 * Copyright (c) Erfan Khadivar (iconsax-react). Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions: The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */
`;
const lignes = (o) => '{\n' + Object.entries(o).map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n') + '\n  }';
writeFileSync(new URL('../app/modules/bs-icones-pleines-ui.js', import.meta.url), tete + 'window.bsIconesPleinesUi = {\n  noms: ' + lignes(NOMS) + ',\n  svg: ' + lignes(svg) + '\n};\n');
console.log('✔ app/modules/bs-icones-pleines-ui.js — ' + Object.keys(NOMS).length + ' noms, ' + Object.keys(svg).length + ' icônes');
