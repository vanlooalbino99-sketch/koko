// Fichier d'invitation calendrier (.ics) joint à l'e-mail de confirmation de rendez-vous.
import { booking, zonedToUtc } from './slots.ts';

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const text = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);

export function bookingIcs({ uid, date, heure, title, description, organizer, location }: {
  uid: string; date: string; heure: string; title: string; description: string; organizer: string; location: string;
}) {
  const start = zonedToUtc(date, heure);
  const end = new Date(start.getTime() + booking.durationMinutes * 60_000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Blackstart AI//Site//FR',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${text(title)}`,
    `DESCRIPTION:${text(description)}`,
    `LOCATION:${text(location)}`,
    `ORGANIZER:mailto:${organizer}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${text(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
