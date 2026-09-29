// Sons discrets générés (aucun fichier externe) + notifications navigateur.
import { uiCfg } from './theme.js';

let ctx = null;
function ac() {
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  if (!ctx) ctx = new C();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function play(notes, vol = 0.14) {
  if (!uiCfg().sound) return;
  try {
    const c = ac();
    if (!c) return;
    const now = c.currentTime;
    notes.forEach(([f, start, dur]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(g);
      g.connect(c.destination);
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(vol, now + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      o.start(now + start);
      o.stop(now + start + dur + 0.05);
    });
  } catch (e) {
    /* le son ne doit jamais bloquer l'app */
  }
}
export const chimeStartup = () => play([[587.33, 0, 0.22], [880, 0.1, 0.3]]);
export const chimeAlert = () => play([[880, 0, 0.55], [1108.73, 0.1, 0.55]], 0.2);
export const chimeSuccess = () => play([[659.25, 0, 0.18], [987.77, 0.09, 0.28]], 0.12);

export async function askNotifications() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    return (await Notification.requestPermission()) === 'granted';
  } catch (e) {
    return false;
  }
}
export function notify(title, body) {
  try {
    if (uiCfg().notifications && 'Notification' in window && Notification.permission === 'granted') new Notification(title, { body, tag: title + body });
  } catch (e) {
    /* notifications non supportées (ex. iOS hors PWA) */
  }
}
