// Créneaux de rendez-vous : horaires d'ouverture, jours fermés, délai de prévenance.
// Tout est exprimé à l'heure de Paris, quel que soit le fuseau du visiteur ou du serveur.
// Module sans dépendance : utilisé côté serveur, côté navigateur et par les tests.

export const booking = {
  timeZone: 'Europe/Paris',
  /** Jours ouverts : 0 = dimanche … 6 = samedi. */
  weekdays: [1, 2, 3, 4, 5],
  /** Plages d'ouverture, [début, fin) en HH:MM. */
  ranges: [
    ['09:00', '12:00'],
    ['14:00', '18:00'],
  ] as [string, string][],
  /** Pas entre deux créneaux et durée d'un rendez-vous, en minutes. */
  stepMinutes: 30,
  durationMinutes: 30,
  /** Délai minimum entre maintenant et le rendez-vous, en minutes. */
  noticeMinutes: 180,
  /** Jusqu'à combien de jours à l'avance on peut réserver (null : sans limite, toutes les années). */
  horizonDays: null as number | null,
  /** Jours fériés fixes (MM-JJ) et fermetures exceptionnelles (AAAA-MM-JJ). */
  closedEveryYear: ['01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25'],
  closedDates: [] as string[],
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isDate = (s: unknown): s is string => typeof s === 'string' && DATE_RE.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z')) && new Date(s + 'T00:00:00Z').toISOString().startsWith(s);
export const isTime = (s: unknown): s is string => typeof s === 'string' && TIME_RE.test(s);

const pad = (n: number) => String(n).padStart(2, '0');
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const fromMin = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

/** Date et heure de Paris pour un instant donné. */
export function zonedNow(at: Date = new Date(), timeZone = booking.timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

export function addDays(date: string, days: number) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const weekday = (date: string) => new Date(date + 'T00:00:00Z').getUTCDay();

/** Jour fermé : week-end, jour férié (fixe ou de Pâques) ou fermeture exceptionnelle. */
export function isClosed(date: string) {
  if (!booking.weekdays.includes(weekday(date))) return true;
  if (booking.closedEveryYear.includes(date.slice(5)) || booking.closedDates.includes(date)) return true;
  const easter = easterSunday(Number(date.slice(0, 4)));
  return [1, 39, 50].some((n) => addDays(easter, n) === date); // lundi de Pâques, Ascension, lundi de Pentecôte
}

/** Dimanche de Pâques (algorithme de Meeus). */
export function easterSunday(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${pad(month)}-${pad(day)}`;
}

/** Tous les créneaux d'une journée ouverte, sans tenir compte des réservations. */
export function daySlots(date: string) {
  if (!isDate(date) || isClosed(date)) return [];
  const out: string[] = [];
  for (const [start, end] of booking.ranges) {
    for (let m = toMin(start); m + booking.durationMinutes <= toMin(end); m += booking.stepMinutes) out.push(fromMin(m));
  }
  return out;
}

/** Premier et dernier jour réservables (to = null : pas de date limite). */
export function bookingWindow(now: Date = new Date()): { from: string; to: string | null } {
  const today = zonedNow(now).date;
  return { from: today, to: booking.horizonDays == null ? null : addDays(today, booking.horizonDays) };
}

/** Créneaux encore libres d'une journée : ouverts, pas déjà pris, et assez loin dans le futur. */
export function availableSlots(date: string, taken: Iterable<string> = [], now: Date = new Date()) {
  const { from, to } = bookingWindow(now);
  if (!isDate(date) || date < from || (to !== null && date > to)) return [];
  const earliest = zonedNow(new Date(now.getTime() + booking.noticeMinutes * 60_000));
  // Un rendez-vous pris à n'importe quelle heure (ex. 10:15, fixé par téléphone) bloque les créneaux qu'il chevauche.
  const busy = [...taken].filter(isTime).map(toMin);
  return daySlots(date).filter(
    (t) => !busy.some((b) => Math.abs(b - toMin(t)) < booking.durationMinutes) && `${date}T${t}` >= `${earliest.date}T${earliest.time}`,
  );
}

export function isSlotAvailable(date: string, time: string, taken: Iterable<string> = [], now: Date = new Date()) {
  return isTime(time) && availableSlots(date, taken, now).includes(time);
}

/** Instant UTC correspondant à une date et une heure de Paris (heure d'été comprise). */
export function zonedToUtc(date: string, time: string, timeZone = booking.timeZone) {
  const target = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), +time.slice(0, 2), +time.slice(3, 5));
  let guess = target;
  for (let i = 0; i < 2; i++) {
    const z = zonedNow(new Date(guess), timeZone);
    const shown = Date.UTC(+z.date.slice(0, 4), +z.date.slice(5, 7) - 1, +z.date.slice(8, 10), +z.time.slice(0, 2), +z.time.slice(3, 5));
    guess += target - shown;
  }
  return new Date(guess);
}

/** « 9 h 30 » */
export const formatTime = (time: string) => time.replace(/^0/, '').replace(':', ' h ');

/** « mardi 14 octobre 2026 à 09:30 » */
export function formatSlot(date: string, time?: string) {
  const d = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
  return time ? `${d} à ${formatTime(time)}` : d;
}
