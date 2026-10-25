'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  EMPTY_STATS,
  SAMPLE_SECONDS,
  VoxScreen,
  type VoxLine,
  type VoxMeter,
  type VoxPhase,
  type VoxSignal,
  type VoxStatic,
  type WaveSample,
} from '@/components/vox/vox-screen';
import { DEFAULT_GAP, estimatedSeconds, type DemoCall } from '@/lib/demo/script';
import type { Locale } from '@/lib/domain';
import type { Dictionary } from '@/lib/i18n';
import { format } from '@/lib/i18n/format';
import { addSellerLine, countFillers, lineSignals, pace, PACE_TARGET, type LiveState } from '@/lib/live/speech';

type DemoText = Dictionary['demo'];
type Speaker = 'seller' | 'prospect' | null;

// Attente réglée sur l'horloge audio : elle s'arrête quand la démo est en pause (contexte suspendu).
function wait(ctx: AudioContext, seconds: number) {
  return new Promise<void>((resolve) => {
    const src = ctx.createConstantSource();
    const mute = ctx.createGain();
    mute.gain.value = 0;
    src.connect(mute).connect(ctx.destination);
    src.onended = () => {
      src.disconnect();
      mute.disconnect();
      resolve();
    };
    src.start();
    src.stop(ctx.currentTime + Math.max(0.01, seconds));
  });
}

// Le prospect est au bout d'une ligne téléphonique : bande 300-3 400 Hz, médium un peu poussé, compression, et un
// léger souffle de ligne. Le vendeur, lui, parle dans son casque : sa voix reste claire.
function phoneLine(ctx: AudioContext, out: AudioNode) {
  const input = ctx.createGain();
  const high = ctx.createBiquadFilter();
  high.type = 'highpass';
  high.frequency.value = 300;
  const low = ctx.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 3400;
  const presence = ctx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 1800;
  presence.gain.value = 4;
  const squeeze = ctx.createDynamicsCompressor();
  squeeze.threshold.value = -24;
  squeeze.ratio.value = 4;
  input.connect(high).connect(low).connect(presence).connect(squeeze).connect(out);
  return input;
}

function hiss(ctx: AudioContext, into: AudioNode) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const level = ctx.createGain();
  level.gain.value = 0.004;
  src.connect(level).connect(into);
  src.start();
  return () => {
    src.stop();
    src.disconnect();
    level.disconnect();
  };
}

// Tonalité d'appel française (440 Hz) puis, à la fin, les trois bips de raccroché.
async function tones(ctx: AudioContext, into: AudioNode, pattern: [on: number, off: number][], hz: number) {
  for (const [on, off] of pattern) {
    const osc = ctx.createOscillator();
    osc.frequency.value = hz;
    const env = ctx.createGain();
    const t = ctx.currentTime;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.12, t + 0.02);
    env.gain.setValueAtTime(0.12, t + on - 0.02);
    env.gain.linearRampToValueAtTime(0, t + on);
    osc.connect(env).connect(into);
    osc.start(t);
    osc.stop(t + on);
    await wait(ctx, on + off);
    osc.disconnect();
    env.disconnect();
  }
}

export function DemoCallScreen({ data, call, lang, text }: { data: VoxStatic; call: DemoCall; lang: Locale; text: DemoText }) {
  const [phase, setPhase] = useState<VoxPhase>('idle');
  const [audio, setAudio] = useState<boolean | null>(null);
  const [soundLost, setSoundLost] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [volumeOn, setVolumeOn] = useState(true);
  const [speaker, setSpeaker] = useState<Speaker>(null);
  const [lines, setLines] = useState<VoxLine[]>([]);
  const [signals, setSignals] = useState<VoxSignal[]>([]);
  const [markers, setMarkers] = useState<number[]>([]);
  const [stats, setStats] = useState<LiveState>(EMPTY_STATS);
  const [elapsed, setElapsed] = useState(0);
  const [db, setDb] = useState<number | null>(null);

  const version = useRef<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const graph = useRef<{ mix: GainNode; master: GainNode; analyser: AnalyserNode; phone: AudioNode } | null>(null);
  const run = useRef(0);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const startedAt = useRef(0);
  const speaking = useRef<Speaker>(null);
  const live = useRef<LiveState>({ ...EMPTY_STATS });
  const history = useRef<WaveSample[]>([]);
  const lastFast = useRef(-Infinity);
  const timeData = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const freqData = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Le son est-il branché sur ce serveur ? La question prépare aussi les voix côté serveur.
  useEffect(() => {
    let alive = true;
    fetch(`/api/demo/voices?lang=${lang}`)
      .then((r) => r.json() as Promise<{ audio: boolean; version?: string }>)
      .then((r) => {
        if (!alive) return;
        version.current = r.version ?? null;
        setAudio(Boolean(r.audio && r.version));
      })
      .catch(() => alive && setAudio(false));
    return () => {
      alive = false;
    };
  }, [lang]);

  useEffect(
    () => () => {
      run.current++;
      void ctxRef.current?.close();
    },
    [],
  );

  const now = () => (ctxRef.current && startedAt.current ? ctxRef.current.currentTime - startedAt.current : 0);

  function rms() {
    const analyser = graph.current?.analyser;
    if (!analyser) return 0;
    timeData.current ??= new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeData.current);
    let sum = 0;
    for (const b of timeData.current) sum += ((b - 128) / 128) ** 2;
    return Math.sqrt(sum / timeData.current.length);
  }

  // Sans le son, l'écran bouge quand même au rythme de la personne qui « parle ».
  function quietLevel() {
    if (!speaking.current) return 0;
    const t = performance.now() / 1000;
    return 0.08 + 0.12 * Math.abs(Math.sin(t * 9.1) * Math.sin(t * 2.3 + 0.5));
  }

  const meter = useMemo<VoxMeter>(
    () => ({
      level: () => (audio ? Math.min(1, rms() * 1.6) : quietLevel()),
      bins: () => {
        const analyser = graph.current?.analyser;
        if (!audio || !analyser) return null;
        freqData.current ??= new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData.current);
        return freqData.current;
      },
      history: () => history.current,
    }),
    [audio],
  );

  // Mesure continue, comme pendant un vrai appel : temps de parole de chacun, niveau et forme d'onde.
  useEffect(() => {
    if (phase !== 'live') return;
    const timer = window.setInterval(() => {
      if (ctxRef.current?.state !== 'running') return;
      const who = speaking.current;
      const level = audio ? Math.min(1, rms() * 1.6) : quietLevel();
      const s = live.current;
      if (who === 'prospect') s.prospectSeconds += SAMPLE_SECONDS;
      else if (who === 'seller') s.sellerSeconds += SAMPLE_SECONDS;
      s.elapsed = now();
      history.current.push({ v: level, who: who === 'prospect' ? 'p' : who === 'seller' ? 's' : '-' });
      setElapsed(s.elapsed);
      setDb(level > 0.001 ? Math.max(-60, Math.round(20 * Math.log10(level))) : -60);
      setStats({ ...s });
    }, SAMPLE_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [phase, audio]);

  function setupAudio() {
    const ctx = (ctxRef.current ??= new AudioContext());
    if (!graph.current) {
      const mix = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      const master = ctx.createGain();
      mix.connect(analyser);
      mix.connect(master).connect(ctx.destination);
      graph.current = { mix, master, analyser, phone: phoneLine(ctx, mix) };
    }
    return { ctx, g: graph.current };
  }

  async function play() {
    const id = ++run.current;
    const alive = () => run.current === id;
    const { ctx, g } = setupAudio();
    await ctx.resume();
    g.master.gain.value = 1;
    live.current = { ...EMPTY_STATS };
    history.current = [];
    lastFast.current = -Infinity;
    startedAt.current = 0;
    speaking.current = null;
    setLines([]);
    setSignals([]);
    setMarkers([]);
    setStats(EMPTY_STATS);
    setElapsed(0);
    setEnded(false);
    setPaused(false);
    setVolumeOn(true);
    setSoundLost(false);
    setSpeaker(null);
    setPhase('starting');

    const withSound = audio === true && version.current !== null;
    const clips: Promise<AudioBuffer | null>[] = [];
    const load = (i: number) => {
      if (!withSound || i >= call.lines.length) return Promise.resolve(null);
      clips[i] ??= fetch(`/api/demo/audio?lang=${lang}&line=${i}&v=${version.current}`)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
        .then((b) => ctx.decodeAudioData(b))
        .catch(() => null);
      return clips[i];
    };
    for (let i = 0; i < 3; i++) void load(i);

    let stopHiss = () => {};
    if (withSound) {
      // Ça sonne pendant que les premières répliques arrivent.
      setRinging(true);
      await Promise.all([tones(ctx, g.phone, [[1.2, 1.8], [0.7, 0.3]], 440), load(0)]);
      setRinging(false);
      if (!alive()) return;
      stopHiss = hiss(ctx, g.phone);
    }
    startedAt.current = ctx.currentTime;
    setPhase('live');

    let lost = false;
    for (let i = 0; i < call.lines.length; i++) {
      const line = call.lines[i];
      if (i > 0) await wait(ctx, line.gap ?? DEFAULT_GAP);
      if (!alive()) return stopHiss();
      for (let k = 1; k <= 3; k++) void load(i + k);
      const buffer = await load(i);
      if (!alive()) return stopHiss();
      if (withSound && !buffer && !lost) {
        lost = true;
        setSoundLost(true);
      }
      const at = now();
      speaking.current = line.role;
      setSpeaker(line.role);
      setLines((prev) => [...prev, { id: i, role: line.role, text: line.text, at }]);
      if (buffer) {
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(line.role === 'prospect' ? g.phone : g.mix);
        source.current = src;
        await new Promise<void>((resolve) => {
          src.onended = () => resolve();
          src.start();
        });
        src.disconnect();
        source.current = null;
      } else {
        await wait(ctx, estimatedSeconds(line));
      }
      if (!alive()) return stopHiss();
      speaking.current = null;
      setSpeaker(null);
      if (line.role === 'seller') {
        // Comme pendant un vrai appel : la réplique du vendeur est mesurée quand il a fini de parler.
        const s = live.current;
        addSellerLine(s, line.text, lang);
        const end = now();
        const found: VoxSignal[] = lineSignals(line.text, at, lang).map((sig) => ({ ...sig, end }));
        const wpm = pace(s);
        if (wpm !== null && wpm > PACE_TARGET.max + 15 && end - lastFast.current > 30) {
          lastFast.current = end;
          found.push({ at, end, kind: 'fast_pace', detail: String(wpm), tone: 'warn' });
        }
        if (found.length) setSignals((prev) => [...prev, ...found]);
        setStats({ ...s });
      }
    }
    await wait(ctx, 0.5);
    stopHiss();
    if (withSound && alive()) await tones(ctx, g.phone, [[0.22, 0.22], [0.22, 0.22], [0.22, 0.1]], 440);
    if (!alive()) return;
    setPhase('idle');
    setEnded(true);
  }

  function stop() {
    run.current++;
    try {
      source.current?.stop();
    } catch {
      // déjà arrêtée
    }
    source.current = null;
    speaking.current = null;
    setSpeaker(null);
    setRinging(false);
    setPaused(false);
    void ctxRef.current?.resume();
    setPhase('idle');
  }

  function togglePause() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (paused) void ctx.resume();
    else void ctx.suspend();
    setPaused(!paused);
  }

  function toggleVolume() {
    const g = graph.current;
    if (!g) return;
    g.master.gain.value = volumeOn ? 0 : 1;
    setVolumeOn(!volumeOn);
  }

  function mark() {
    const t = Math.floor(now());
    if (phase !== 'live' || markers.includes(t)) return;
    setMarkers([...markers, t]);
  }

  const prospectFirst = data.scenario.prospect.name.split(' ')[0];
  const shown = useMemo<VoxStatic>(
    () => ({
      ...data,
      voiceName: audio === false ? text.silentShort : soundLost ? text.soundOff : text.voices,
      labels: {
        ...data.labels,
        start: ended ? text.replay : text.play,
        connecting: ringing ? text.ringing : text.preparing,
        mute: text.pause,
        unmute: text.resume,
        hangUp: text.stop,
        quit: text.home,
        volumeOff: text.volumeOff,
        volumeOn: text.volumeOn,
        newSession: text.cta,
        voice: '{name}',
        prospectSpeaking: format(text.speaking, { name: prospectFirst }),
        listening: speaker === 'seller' ? format(text.speaking, { name: call.seller }) : text.onLine,
        ready: format(text.ready, { seller: call.seller }),
        micHint: audio === false ? text.silent : text.hint,
      },
    }),
    [data, text, audio, soundLost, ended, ringing, speaker, prospectFirst, call.seller],
  );

  return (
    <VoxScreen
      data={shown}
      meter={meter}
      live={{
        // Tant qu'on ne sait pas si le son est branché, le bouton attend.
        phase: audio === null && phase === 'idle' ? 'loading' : phase,
        elapsed,
        lines,
        signals,
        markers,
        stats,
        fillers: countFillers(
          lines.filter((l) => l.role === 'seller').map((l) => l.text),
          lang,
        ),
        db: phase === 'live' && audio ? db : null,
        khz: audio && ctxRef.current ? Math.round(ctxRef.current.sampleRate / 100) / 10 : null,
        isSpeaking: speaker === 'prospect',
        isMuted: paused,
        volumeOn,
        interrupted: false,
        notice: ended ? text.done : undefined,
      }}
      on={{ start: () => void play(), hangUp: stop, toggleMute: togglePause, toggleVolume, mark }}
    />
  );
}
