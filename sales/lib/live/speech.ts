// Mesures de la parole du vendeur, calculées sur le texte transcrit : tics de langage, questions, formulations
// hésitantes, concessions de prix, débit et temps de parole. Le même code sert pendant l'appel (navigateur) et
// dans le rapport (serveur). Rien n'est estimé par un modèle : ce sont des comptes sur ce qui a été dit.
import type { Locale } from '../domain.ts';

export type Mark = 'filler' | 'hedge' | 'concession';
export type Piece = { text: string; mark?: Mark; question?: boolean };

type Pattern = { key: string; label: string; source: string };

// Tics de langage recherchés, par langue. « like » ne compte qu'entre virgules : « I like it » n'est pas un tic.
const FILLERS: Record<Locale, Pattern[]> = {
  fr: [
    { key: 'euh', label: 'Euh', source: 'eu+h|heu+|hum+' },
    { key: 'du_coup', label: 'Du coup', source: 'du coup' },
    { key: 'en_fait', label: 'En fait', source: 'en fait' },
    { key: 'genre', label: 'Genre', source: 'genre(?=\\s*,)' },
    { key: 'voila', label: 'Voilà', source: 'voilà|voila' },
    { key: 'ben', label: 'Ben', source: 'ben|bah' },
    { key: 'tu_vois', label: 'Vous voyez', source: 'tu vois|vous voyez' },
  ],
  en: [
    { key: 'um', label: 'Um', source: 'u+m+|u+h+|er+m+|uhm' },
    { key: 'like', label: 'Like', source: '(?<=(?:^|,)\\s*)like(?=\\s*,)' },
    { key: 'you_know', label: 'You know', source: 'you know' },
    { key: 'basically', label: 'Basically', source: 'basically' },
    { key: 'actually', label: 'Actually', source: 'actually' },
    { key: 'i_mean', label: 'I mean', source: 'i mean' },
  ],
};

const HEDGES: Record<Locale, string[]> = {
  fr: ['je pense', 'je crois', 'peut-être', 'un peu', 'normalement', "j'espère", 'en quelque sorte', 'plus ou moins', 'éventuellement', 'je ne sais pas', 'je sais pas'],
  en: ['i think', 'i guess', 'maybe', 'kind of', 'sort of', 'probably', 'hopefully', "i'm not sure", 'perhaps'],
};

const CONCESSIONS: Record<Locale, string[]> = {
  fr: ['remise', 'réduction', 'rabais', 'geste commercial', 'gratuitement', 'gratuit', 'moins cher', 'baisser le prix'],
  en: ['discount', 'for free', 'cheaper', 'lower the price', 'reduce the price', 'rebate'],
};

const OPEN_STARTS: Record<Locale, RegExp> = {
  fr: /^(comment|pourquoi|qu['’]est-ce|quel(le)?s?\b|que\b|quoi\b|qui\b|quand\b|combien|où|dans quelle|racontez|expliquez|décrivez|parlez-moi|qu['’])/i,
  en: /^(how|why|what|which|where|when|who|tell me|walk me|describe|talk me)/i,
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]");
// Limites de mot qui tiennent compte des accents (\b ne connaît que l'ASCII).
const word = (source: string) => `(?<![\\p{L}\\p{N}])(?:${source})(?![\\p{L}\\p{N}])`;

const cache = new Map<Locale, { all: RegExp; fillers: { key: string; label: string; re: RegExp }[]; hedge: RegExp; concession: RegExp }>();
function patterns(locale: Locale) {
  let p = cache.get(locale);
  if (!p) {
    const hedge = HEDGES[locale].map(escape).join('|');
    const concession = CONCESSIONS[locale].map(escape).join('|');
    const filler = FILLERS[locale].map((f) => f.source).join('|');
    p = {
      all: new RegExp(`${word(filler)}|${word(hedge)}|${word(concession)}`, 'giu'),
      fillers: FILLERS[locale].map((f) => ({ key: f.key, label: f.label, re: new RegExp(word(f.source), 'giu') })),
      hedge: new RegExp(`^${word(hedge)}$`, 'iu'),
      concession: new RegExp(`^${word(concession)}$`, 'iu'),
    };
    cache.set(locale, p);
  }
  return p;
}

// Phrases d'une réplique, ponctuation et espaces compris (leur concaténation redonne le texte).
export function sentences(text: string): string[] {
  return text.match(/[^.!?…]+(?:[.!?…]+|$)\s*/g) ?? (text ? [text] : []);
}

export function isQuestion(sentence: string) {
  return /\?\s*$/.test(sentence);
}

export function isOpenQuestion(sentence: string, locale: Locale) {
  return OPEN_STARTS[locale].test(sentence.trim().replace(/^(et|alors|mais|and|so|but)\s*,?\s*/i, ''));
}

// Découpe une réplique du vendeur pour l'afficher surlignée : questions, tics, hésitations, concessions.
export function annotate(text: string, locale: Locale): Piece[] {
  const p = patterns(locale);
  const pieces: Piece[] = [];
  for (const sentence of sentences(text)) {
    const question = isQuestion(sentence) || undefined;
    let last = 0;
    for (const m of sentence.matchAll(p.all)) {
      const start = m.index!;
      if (start > last) pieces.push({ text: sentence.slice(last, start), question });
      const found = m[0];
      const mark: Mark = p.hedge.test(found) ? 'hedge' : p.concession.test(found) ? 'concession' : 'filler';
      pieces.push({ text: found, mark, question });
      last = start + found.length;
    }
    if (last < sentence.length) pieces.push({ text: sentence.slice(last), question });
  }
  return pieces;
}

export function countWords(text: string) {
  return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export type FillerCount = { key: string; label: string; count: number };

export function countFillers(texts: string[], locale: Locale): FillerCount[] {
  const p = patterns(locale);
  return p.fillers
    .map((f) => ({ key: f.key, label: f.label, count: texts.reduce((n, t) => n + (t.match(f.re)?.length ?? 0), 0) }))
    .sort((a, b) => b.count - a.count);
}

export type LineFacts = {
  words: number;
  fillers: string[];
  questions: { text: string; open: boolean }[];
  hedges: string[];
  concessions: string[];
};

// Ce que contient une réplique du vendeur.
export function lineFacts(text: string, locale: Locale): LineFacts {
  const facts: LineFacts = { words: countWords(text), fillers: [], questions: [], hedges: [], concessions: [] };
  for (const sentence of sentences(text)) {
    if (isQuestion(sentence)) facts.questions.push({ text: sentence.trim(), open: isOpenQuestion(sentence, locale) });
  }
  for (const piece of annotate(text, locale)) {
    if (piece.mark === 'filler') facts.fillers.push(piece.text.toLowerCase());
    if (piece.mark === 'hedge') facts.hedges.push(piece.text.toLowerCase());
    if (piece.mark === 'concession') facts.concessions.push(piece.text.toLowerCase());
  }
  return facts;
}

// Débit conversationnel visé, en mots par minute.
export const PACE_TARGET = { min: 120, max: 160, scaleMin: 80, scaleMax: 200 } as const;

export type PaceBand = 'slow' | 'in_range' | 'fast';
export function paceBand(wpm: number): PaceBand {
  return wpm < PACE_TARGET.min ? 'slow' : wpm > PACE_TARGET.max ? 'fast' : 'in_range';
}

// Part de parole du vendeur visée : il écoute plus qu'il ne parle, sans laisser le prospect seul au bout du fil.
export const TALK_TARGET = { min: 35, max: 60 } as const;

export type TalkBand = 'low' | 'in_range' | 'high';
export function talkBand(ratio: number): TalkBand {
  return ratio < TALK_TARGET.min ? 'low' : ratio > TALK_TARGET.max ? 'high' : 'in_range';
}

// Questions posées visées pendant un appel (affichées comme une progression, Q1 à Q5).
export const QUESTION_TARGET = 5;

// ─── Signaux et conseils pendant l'appel ─────────────────────────────────────

export type SignalKind = 'open_question' | 'closed_question' | 'filler_cluster' | 'hedge' | 'concession' | 'interruption' | 'monologue' | 'fast_pace';
export type Signal = { at: number; kind: SignalKind; detail: string; tone: 'good' | 'warn' | 'bad' };

// Signaux d'une réplique du vendeur, horodatés à son arrivée.
export function lineSignals(text: string, at: number, locale: Locale): Signal[] {
  const f = lineFacts(text, locale);
  const out: Signal[] = [];
  for (const q of f.questions) {
    out.push({ at, kind: q.open ? 'open_question' : 'closed_question', detail: clip(q.text, 48), tone: q.open ? 'good' : 'warn' });
  }
  if (f.fillers.length >= 2) out.push({ at, kind: 'filler_cluster', detail: f.fillers.slice(0, 3).join(' · '), tone: 'warn' });
  if (f.hedges.length > 0) out.push({ at, kind: 'hedge', detail: f.hedges.slice(0, 2).join(' · '), tone: 'warn' });
  if (f.concessions.length > 0) out.push({ at, kind: 'concession', detail: f.concessions[0], tone: 'bad' });
  if (f.words > 90) out.push({ at, kind: 'monologue', detail: String(f.words), tone: 'warn' });
  return out;
}

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export type LiveState = {
  elapsed: number;
  sellerSeconds: number;
  prospectSeconds: number;
  sellerWords: number;
  openQuestions: number;
  closedQuestions: number;
  fillers: number;
  concessions: number;
};

// Ajoute une réplique du vendeur aux comptes de l'appel en cours et renvoie ce qu'elle contient.
export function addSellerLine(s: LiveState, text: string, locale: Locale): LineFacts {
  const f = lineFacts(text, locale);
  s.sellerWords += f.words;
  s.openQuestions += f.questions.filter((q) => q.open).length;
  s.closedQuestions += f.questions.filter((q) => !q.open).length;
  s.fillers += f.fillers.length;
  s.concessions += f.concessions.length;
  return f;
}

export type TipKey = 'objective' | 'talk_too_much' | 'no_question' | 'closed_questions' | 'fillers' | 'too_fast' | 'concession';
export type Tip = { key: TipKey; criterion: 'objective' | 'listening' | 'discovery' | 'questioning' | 'clarity' | 'pace' | 'negotiation'; value?: number };

export function talkRatio(s: Pick<LiveState, 'sellerSeconds' | 'prospectSeconds'>): number | null {
  const total = s.sellerSeconds + s.prospectSeconds;
  return total < 5 ? null : Math.round((s.sellerSeconds / total) * 100);
}

export function pace(s: Pick<LiveState, 'sellerSeconds' | 'sellerWords'>): number | null {
  return s.sellerSeconds < 10 ? null : Math.round(s.sellerWords / (s.sellerSeconds / 60));
}

// Conseil du moment, par ordre de priorité. Sans signal particulier, on rappelle l'objectif de l'appel.
export function coachTip(s: LiveState): Tip {
  const ratio = talkRatio(s);
  const wpm = pace(s);
  if (s.concessions > 0) return { key: 'concession', criterion: 'negotiation' };
  if (s.elapsed >= 60 && ratio !== null && ratio > 65) return { key: 'talk_too_much', criterion: 'listening', value: ratio };
  if (s.elapsed >= 90 && s.openQuestions + s.closedQuestions === 0) return { key: 'no_question', criterion: 'discovery' };
  if (s.closedQuestions >= 3 && s.openQuestions === 0) return { key: 'closed_questions', criterion: 'questioning', value: s.closedQuestions };
  if (wpm !== null && wpm > PACE_TARGET.max + 15) return { key: 'too_fast', criterion: 'pace', value: wpm };
  if (s.fillers >= 5) return { key: 'fillers', criterion: 'clarity', value: s.fillers };
  return { key: 'objective', criterion: 'objective' };
}

// ─── Élocution d'un appel terminé (rapport) ──────────────────────────────────

export type TimedTurn = { role: 'seller' | 'prospect'; text: string; at: number; interrupted?: boolean };

export type SpeechReport = {
  sellerWords: number;
  prospectWords: number;
  // Part du temps de parole du vendeur, d'après les horodatages des répliques.
  talkRatio: number | null;
  wordsPerMinute: number | null;
  longestMonologueSeconds: number;
  fillers: FillerCount[];
  fillerTotal: number;
  hedges: number;
  concessions: number;
  questions: { text: string; open: boolean; at: number }[];
  interruptions: number;
};

export function speechReport(turns: TimedTurn[], durationSeconds: number | null, locale: Locale): SpeechReport {
  const end = Math.max(durationSeconds ?? 0, turns.at(-1)?.at ?? 0);
  let sellerSeconds = 0;
  let prospectSeconds = 0;
  let longest = 0;
  let sellerWords = 0;
  let prospectWords = 0;
  let hedges = 0;
  let concessions = 0;
  const questions: SpeechReport['questions'] = [];
  turns.forEach((turn, i) => {
    const words = countWords(turn.text);
    // Durée d'une réplique : jusqu'à la suivante, au plus une seconde par mot (les silences ne comptent pas).
    const span = Math.max(0, (turns[i + 1]?.at ?? end) - turn.at);
    const seconds = Math.min(span, words);
    if (turn.role === 'seller') {
      sellerWords += words;
      sellerSeconds += seconds;
      longest = Math.max(longest, seconds);
      const f = lineFacts(turn.text, locale);
      hedges += f.hedges.length;
      concessions += f.concessions.length;
      for (const q of f.questions) questions.push({ ...q, at: turn.at });
    } else {
      prospectWords += words;
      prospectSeconds += seconds;
    }
  });
  const fillers = countFillers(
    turns.filter((t) => t.role === 'seller').map((t) => t.text),
    locale,
  );
  return {
    sellerWords,
    prospectWords,
    talkRatio: talkRatio({ sellerSeconds, prospectSeconds }),
    wordsPerMinute: pace({ sellerSeconds, sellerWords }),
    longestMonologueSeconds: Math.round(longest),
    fillers,
    fillerTotal: fillers.reduce((n, f) => n + f.count, 0),
    hedges,
    concessions,
    questions,
    interruptions: turns.filter((t) => t.role === 'prospect' && t.interrupted).length,
  };
}
