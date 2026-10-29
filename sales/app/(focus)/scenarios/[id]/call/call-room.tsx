'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationProvider, useConversation, type DisconnectionDetails } from '@elevenlabs/react';
import { finishSimulationAction, markConnectedAction, saveMarkersAction, startSimulationAction } from '@/app/actions/simulations';
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
import { addSellerLine, countFillers, countWords, lineSignals, pace, PACE_TARGET, type LiveState } from '@/lib/live/speech';
import { splitTones } from '@/lib/voice/emotion';

// Volume du micro au-delà duquel on considère que le vendeur parle (le micro capte aussi la pièce).
const VOICE_THRESHOLD = 0.06;
// Débit moyen d'une phrase parlée, pour situer le début d'une réplique transcrite à sa fin.
const WORDS_PER_SECOND = 2.5;

function Room({ data }: { data: VoxStatic }) {
  const router = useRouter();
  const c = data.labels;
  const language = data.scenario.language;
  const errors = {
    not_configured: c.notConfigured,
    quota_exceeded: c.quotaExceeded,
    concurrent_limit: c.concurrentLimit,
    platform_saturated: c.platformSaturated,
    provider_error: c.providerError,
    not_found: c.notFound,
  };

  const [phase, setPhase] = useState<VoxPhase>('idle');
  const [error, setError] = useState<string>();
  const [lines, setLines] = useState<VoxLine[]>([]);
  const [signals, setSignals] = useState<VoxSignal[]>([]);
  const [markers, setMarkers] = useState<number[]>([]);
  const [stats, setStats] = useState<LiveState>(EMPTY_STATS);
  const [elapsed, setElapsed] = useState(0);
  const [db, setDb] = useState<number | null>(null);
  const [khz, setKhz] = useState<number | null>(null);
  const [volumeOn, setVolumeOn] = useState(true);
  const [interrupted, setInterrupted] = useState(false);
  const [dropped, setDropped] = useState<{ resumeHref: string; reportHref: string }>();

  const simulationId = useRef<string | null>(null);
  const maxSeconds = useRef(Infinity);
  const finished = useRef(false);
  const connected = useRef(false);
  const startedAt = useRef(0);
  const live = useRef<LiveState>({ ...EMPTY_STATS });
  const history = useRef<WaveSample[]>([]);
  const lastFast = useRef(-Infinity);
  const lastAt = useRef(0);
  const lineId = useRef(0);
  const speaking = useRef(false);
  const muted = useRef(false);

  const now = () => (startedAt.current ? (performance.now() - startedAt.current) / 1000 : 0);

  // Fin d'appel, quelle qu'en soit la cause : le serveur récupère la transcription, puis on ouvre le rapport.
  // Un appel jamais connecté est simplement clos côté serveur et l'écran revient au départ, avec l'erreur.
  const finish = useCallback(
    async (reason: 'user' | 'agent' | 'error', message?: string) => {
      const id = simulationId.current;
      if (!id || finished.current) return;
      finished.current = true;
      if (!connected.current) {
        await finishSimulationAction(id, reason === 'user' ? 'user' : 'error', message).catch(() => null);
        simulationId.current = null;
        setPhase('idle');
        return;
      }
      setPhase('ending');
      await finishSimulationAction(id, reason, message).catch(() => null);
      // Coupure en cours d'appel : on propose de reprendre tout de suite plutôt que d'ouvrir le rapport.
      if (reason === 'error') {
        setDropped({ resumeHref: `/scenarios/${data.scenario.id}/call?reprise=${id}`, reportHref: `/simulations/${id}` });
        setPhase('idle');
        return;
      }
      router.push(`/simulations/${id}`);
    },
    [router, data.scenario.id],
  );

  // Réplique du vendeur : comptes (mots, questions, tics, concessions) et signaux, horodatés à son début.
  function sellerLine(text: string, arrival: number) {
    const at = Math.max(lastAt.current, arrival - countWords(text) / WORDS_PER_SECOND);
    const s = live.current;
    addSellerLine(s, text, language);
    const found: VoxSignal[] = lineSignals(text, at, language).map((sig) => ({ ...sig, end: arrival }));
    const wpm = pace(s);
    if (wpm !== null && wpm > PACE_TARGET.max + 15 && arrival - lastFast.current > 30) {
      lastFast.current = arrival;
      found.push({ at, end: arrival, kind: 'fast_pace', detail: String(wpm), tone: 'warn' });
    }
    if (found.length) setSignals((prev) => [...prev, ...found]);
    setStats({ ...s });
    return at;
  }

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      connected.current = true;
      startedAt.current = performance.now();
      setPhase('live');
      if (simulationId.current) void markConnectedAction(simulationId.current, conversationId);
    },
    onDisconnect: (details: DisconnectionDetails) => {
      if (details.reason === 'error') setError(c.connectionError);
      void finish(details.reason, details.reason === 'error' ? details.message : undefined);
    },
    onError: (message) => {
      setError(c.connectionError);
      console.error('[voice]', message);
      // Échec avant la connexion (réseau, jeton refusé) : le SDK ne signale pas toujours de déconnexion.
      if (!connected.current) void finish('error', message);
    },
    onMessage: ({ message, role }) => {
      const seller = role === 'user';
      // Les balises de voix du prospect (« [sighs] ») ne s'affichent pas : seul son ton est montré.
      const { text, tones } = seller ? { text: message.trim(), tones: [] } : splitTones(message);
      if (!text) return;
      const arrival = now();
      // La réplique du prospect arrive quand il commence à parler ; celle du vendeur, quand il a fini.
      const at = seller ? sellerLine(text, arrival) : Math.max(lastAt.current, arrival);
      lastAt.current = at;
      const id = lineId.current++;
      setLines((prev) => [...prev, { id, role: seller ? 'seller' : 'prospect', text, at, ...(tones.length ? { tones } : {}) }]);
    },
    onInterruption: () => {
      const at = now();
      setSignals((prev) => [...prev, { at, end: at + 1, kind: 'interruption', detail: '', tone: 'warn' }]);
      setInterrupted(true);
      window.setTimeout(() => setInterrupted(false), 2500);
    },
  });
  const { isSpeaking, isMuted, setMuted, setVolume, endSession, startSession } = conversation;
  const controls = useRef(conversation);
  useEffect(() => {
    controls.current = conversation;
    speaking.current = isSpeaking;
    muted.current = isMuted;
  });

  // Mesure continue : temps de parole de chacun, niveau du micro et forme d'onde de l'appel.
  useEffect(() => {
    if (phase !== 'live') return;
    const timer = window.setInterval(() => {
      const conv = controls.current;
      const input = muted.current ? 0 : conv.getInputVolume();
      const output = conv.getOutputVolume();
      const prospect = speaking.current;
      const seller = !prospect && input > VOICE_THRESHOLD;
      const s = live.current;
      if (prospect) s.prospectSeconds += SAMPLE_SECONDS;
      else if (seller) s.sellerSeconds += SAMPLE_SECONDS;
      s.elapsed = (performance.now() - startedAt.current) / 1000;
      history.current.push({ v: Math.max(input, output), who: prospect ? 'p' : seller ? 's' : '-' });
      setElapsed(s.elapsed);
      // Durée maximale de l'offre (5 minutes pendant l'essai) : l'appel raccroche tout seul.
      if (s.elapsed >= maxSeconds.current) conv.endSession();
      setDb(input > 0.001 ? Math.max(-60, Math.round(20 * Math.log10(input))) : -60);
      setStats({ ...s });
    }, SAMPLE_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const meter = useMemo<VoxMeter>(
    () => ({
      level: () => (speaking.current ? controls.current.getOutputVolume() : controls.current.getInputVolume()),
      bins: () => (speaking.current ? controls.current.getOutputByteFrequencyData() : controls.current.getInputByteFrequencyData()) ?? null,
      history: () => history.current,
    }),
    [],
  );

  const fillers = useMemo(
    () =>
      countFillers(
        lines.filter((l) => l.role === 'seller').map((l) => l.text),
        language,
      ),
    [lines, language],
  );

  // Quitter la page raccroche : le serveur rattrapera la transcription plus tard.
  useEffect(() => () => endSession(), [endSession]);

  async function start() {
    setError(undefined);
    setDropped(undefined);
    setPhase('starting');
    try {
      // Demande explicite du micro avant d'ouvrir l'appel, pour expliquer un refus clairement.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rate = stream.getAudioTracks()[0]?.getSettings().sampleRate;
      setKhz(rate ? Math.round(rate / 100) / 10 : null);
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setError(c.micDenied);
      setPhase('idle');
      return;
    }
    const res = await startSimulationAction(data.scenario.id, data.drill?.ref ?? undefined).catch(() => ({ ok: false as const, error: 'provider_error' as const }));
    if (!res.ok) {
      setError(errors[res.error]);
      setPhase('idle');
      return;
    }
    simulationId.current = res.simulationId;
    maxSeconds.current = res.maxSeconds;
    finished.current = false;
    connected.current = false;
    startedAt.current = 0;
    live.current = { ...EMPTY_STATS };
    history.current = [];
    lastFast.current = -Infinity;
    lastAt.current = 0;
    lineId.current = 0;
    setElapsed(0);
    setLines([]);
    setSignals([]);
    setMarkers([]);
    setStats(EMPTY_STATS);
    setVolumeOn(true);
    // Exercice ciblé ou reprise : le prospect décroche sur la réplique choisie par le serveur.
    startSession({
      conversationToken: res.token,
      connectionType: 'webrtc',
      ...(res.firstMessage ? { overrides: { agent: { firstMessage: res.firstMessage } } } : {}),
    });
  }

  function mark() {
    const t = Math.floor(now());
    if (!simulationId.current || markers.includes(t)) return;
    const next = [...markers, t];
    setMarkers(next);
    void saveMarkersAction(simulationId.current, next);
  }

  return (
    <VoxScreen
      data={data}
      meter={meter}
      live={{
        phase,
        elapsed,
        lines,
        signals,
        markers,
        stats,
        fillers,
        db: phase === 'live' ? db : null,
        khz,
        isSpeaking,
        isMuted,
        volumeOn,
        interrupted,
        error,
        dropped,
      }}
      on={{
        start: () => void start(),
        hangUp: () => {
          // Avant la connexion, raccrocher annule l'appel ; ensuite, la fin est gérée par onDisconnect.
          endSession();
          if (!connected.current) void finish('user');
        },
        toggleMute: () => setMuted(!isMuted),
        toggleVolume: () => {
          setVolume({ volume: volumeOn ? 0 : 1 });
          setVolumeOn(!volumeOn);
        },
        mark,
      }}
    />
  );
}

export default function CallRoom({ data }: { data: VoxStatic }) {
  return (
    <ConversationProvider>
      <Room data={data} />
    </ConversationProvider>
  );
}
