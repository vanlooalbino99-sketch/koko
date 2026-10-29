// Ton du prospect. Avec la voix expressive d'ElevenLabs (Eleven v4 Turbo), le prospect place de courtes balises
// avant les mots qu'elles colorent : « [sighs] Écoutez… [shouts] NON ! ». La voix les joue ; à l'écran et dans la
// transcription, on les retire du texte et on garde seulement le ton, pour le rapport et l'analyse.

// Balises que la consigne autorise, en anglais même quand le prospect parle français (c'est ce que la voix comprend).
export const AUDIO_TAGS = [
  'sighs',
  'laughs',
  'clears throat',
  'pause',
  'rushed',
  'snappy',
  'busy',
  'tired',
  'bored',
  'curious',
  'confused',
  'disbelief',
  'mad',
  'aggressive',
  'bitter',
  'shouts',
  'softly',
] as const;

// Familles de ton montrées au vendeur ; une balise inconnue n'en montre aucune.
export const TONES = ['shouts', 'angry', 'sighs', 'laughs', 'rushed', 'doubt', 'calm'] as const;
export type Tone = (typeof TONES)[number];

const FAMILY: Record<string, Tone> = {
  shouts: 'shouts',
  shouting: 'shouts',
  booming: 'shouts',
  yelling: 'shouts',
  mad: 'angry',
  angry: 'angry',
  aggressive: 'angry',
  bitter: 'angry',
  critical: 'angry',
  annoyed: 'angry',
  frustrated: 'angry',
  irritated: 'angry',
  disgusted: 'angry',
  sighs: 'sighs',
  tired: 'sighs',
  bored: 'sighs',
  'let down': 'sighs',
  laughs: 'laughs',
  playful: 'laughs',
  smug: 'laughs',
  rushed: 'rushed',
  snappy: 'rushed',
  busy: 'rushed',
  speedy: 'rushed',
  stressed: 'rushed',
  frazzled: 'rushed',
  confused: 'doubt',
  disbelief: 'doubt',
  puzzled: 'doubt',
  curious: 'doubt',
  softly: 'calm',
  quietly: 'calm',
  thoughtful: 'calm',
  peaceful: 'calm',
  content: 'calm',
  trusting: 'calm',
};

// Une balise : quelques mots en minuscules entre crochets (« [low, threatening] » compris). Les crochets d'un texte
// ordinaire (« [1] », « [Société X] ») ne sont pas touchés.
const TAG = /\[([a-z][a-z ,'-]{0,40})\]\s*/g;

// Texte sans balises, et les tons rencontrés, sans doublon et du plus fort au plus doux (un cri passe avant un soupir).
export function splitTones(raw: string): { text: string; tones: Tone[] } {
  const found = new Set<Tone>();
  const text = raw
    .replace(TAG, (_, tag: string) => {
      for (const part of tag.split(',')) {
        const tone = FAMILY[part.trim()];
        if (tone) found.add(tone);
      }
      return '';
    })
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { text, tones: TONES.filter((t) => found.has(t)) };
}
