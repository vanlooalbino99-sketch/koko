'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { countFillers } from '@/lib/live/speech';
import { EMPTY_STATS, VoxScreen, type VoxStatic } from '@/components/vox/vox-screen';

const noop = () => {};

// Le SDK vocal utilise le micro et WebRTC : il n'est chargé que dans le navigateur. En attendant, l'écran
// s'affiche déjà, au repos (rendu serveur), avec le bouton d'appel inactif.
export function CallRoomLoader({ data }: { data: VoxStatic }) {
  const [Room, setRoom] = useState<ComponentType<{ data: VoxStatic }> | null>(null);
  useEffect(() => {
    let alive = true;
    void import('./call-room').then((m) => {
      if (alive) setRoom(() => m.default);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (Room) return <Room data={data} />;
  return (
    <VoxScreen
      data={data}
      live={{
        phase: 'loading',
        elapsed: 0,
        lines: [],
        signals: [],
        markers: [],
        stats: EMPTY_STATS,
        fillers: countFillers([], data.scenario.language),
        db: null,
        khz: null,
        isSpeaking: false,
        isMuted: false,
        volumeOn: true,
        interrupted: false,
      }}
      on={{ start: noop, hangUp: noop, toggleMute: noop, toggleVolume: noop, mark: noop }}
    />
  );
}
