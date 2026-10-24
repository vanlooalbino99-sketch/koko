import type { Locale } from '../domain.ts';

// Voix ElevenLabs choisies pour chaque langue (identifiants de voix, facultatifs). Sans réglage, l'agent
// garde la voix par défaut d'ElevenLabs, qui parle les deux langues avec le modèle multilingue.
export function configuredVoices(): Partial<Record<Locale, string>> {
  const voices: Partial<Record<Locale, string>> = {};
  const fr = process.env.ELEVENLABS_VOICE_FR?.trim();
  const en = process.env.ELEVENLABS_VOICE_EN?.trim();
  if (fr) voices.fr = fr;
  if (en) voices.en = en;
  return voices;
}
