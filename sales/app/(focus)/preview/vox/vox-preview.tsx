'use client';

import { useMemo } from 'react';
import { EMPTY_STATS, SAMPLE_SECONDS, VoxScreen, type VoxLine, type VoxMeter, type VoxSignal, type VoxStatic, type WaveSample } from '@/components/vox/vox-screen';
import { addSellerLine, countFillers, countWords, lineSignals, type LiveState } from '@/lib/live/speech';

// Conversation d'exemple figée à 42 s, passée dans le même moteur de mesure que l'appel réel.
const ELAPSED = 42;
const TURNS: { role: 'seller' | 'prospect'; text: string; at: number }[] = [
  { role: 'prospect', text: 'Allô, oui ?', at: 0 },
  { role: 'seller', text: 'Bonjour Monsieur Lefèvre, euh, Albino de Blackstart. Je vous appelle au sujet des appels que vous manquez en intervention.', at: 2 },
  { role: 'prospect', text: 'Je suis sur un chantier, là. Faites vite.', at: 10 },
  { role: 'seller', text: "Du coup, en fait, combien d'appels pensez-vous rater par semaine quand vous avez les mains prises ?", at: 13 },
  { role: 'prospect', text: "Une dizaine, peut-être plus. Mais ma femme répond déjà le matin.", at: 19 },
  { role: 'seller', text: "D'accord. Je pense qu'on peut vous aider, et euh, je peux vous faire une remise si vous signez cette semaine.", at: 25 },
  { role: 'prospect', text: "Une remise sur quoi ? Vous ne m'avez même pas dit ce que vous vendez.", at: 33 },
  { role: 'seller', text: "Vous avez raison. Qu'est-ce qui se passe aujourd'hui quand un client tombe sur la messagerie ?", at: 37 },
];

const noop = () => {};

export function VoxPreview({ data }: { data: VoxStatic }) {
  const language = data.scenario.language;
  const state = useMemo(() => {
    const stats: LiveState = { ...EMPTY_STATS, elapsed: ELAPSED };
    const signals: VoxSignal[] = [];
    const lines: VoxLine[] = [];
    TURNS.forEach((turn, i) => {
      const seconds = Math.min((TURNS[i + 1]?.at ?? ELAPSED) - turn.at, countWords(turn.text) / 2.5);
      if (turn.role === 'seller') {
        stats.sellerSeconds += seconds;
        addSellerLine(stats, turn.text, language);
        signals.push(...lineSignals(turn.text, turn.at, language).map((s) => ({ ...s, end: turn.at + seconds })));
      } else {
        stats.prospectSeconds += seconds;
      }
      lines.push({ id: i, ...turn });
    });
    const history: WaveSample[] = [];
    for (let t = 0; t < ELAPSED; t += SAMPLE_SECONDS) {
      const turn = TURNS.findLast((x) => x.at <= t);
      const talking = turn && t - turn.at < countWords(turn.text) / 2.5;
      const v = talking ? 0.08 + 0.3 * Math.abs(Math.sin(t * 7.3) * Math.sin(t * 1.7 + 0.4)) : 0.012 * Math.abs(Math.sin(t * 13));
      history.push({ v, who: talking ? (turn.role === 'seller' ? 's' : 'p') : '-' });
    }
    return { stats, signals, lines, history };
  }, [language]);

  const meter = useMemo<VoxMeter>(
    () => ({
      level: () => 0.28 + 0.08 * Math.sin(performance.now() / 260),
      bins: () => {
        const t = performance.now() / 140;
        return Uint8Array.from({ length: 96 }, (_, k) => Math.max(0, 210 - k * 4 + 40 * Math.sin(t + k * 0.9)));
      },
      history: () => state.history,
    }),
    [state],
  );

  return (
    <VoxScreen
      data={data}
      meter={meter}
      live={{
        phase: 'live',
        elapsed: ELAPSED,
        lines: state.lines,
        signals: state.signals,
        markers: [21],
        stats: state.stats,
        fillers: countFillers(
          TURNS.filter((t) => t.role === 'seller').map((t) => t.text),
          language,
        ),
        db: -18,
        khz: 48,
        isSpeaking: false,
        isMuted: false,
        volumeOn: true,
        interrupted: false,
      }}
      on={{ start: noop, hangUp: noop, toggleMute: noop, toggleVolume: noop, mark: noop }}
    />
  );
}
