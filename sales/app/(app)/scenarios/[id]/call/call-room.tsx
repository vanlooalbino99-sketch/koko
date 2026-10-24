'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationProvider, useConversation, type DisconnectionDetails } from '@elevenlabs/react';
import { Loader2, Mic, MicOff, PhoneOff, Phone } from 'lucide-react';
import { finishSimulationAction, markConnectedAction, startSimulationAction } from '@/app/actions/simulations';
import { Button } from '@/components/ui/button';
import { FormAlert } from '@/components/ui/field';
import { cn } from '@/lib/utils';

export type CallLabels = {
  start: string;
  connecting: string;
  prospectSpeaking: string;
  listening: string;
  interrupted: string;
  mute: string;
  unmute: string;
  muted: string;
  hangUp: string;
  ended: string;
  saving: string;
  live: string;
  liveEmpty: string;
  you: string;
  micHint: string;
  errors: Record<'not_configured' | 'quota_exceeded' | 'provider_error' | 'not_found' | 'mic_denied' | 'connection', string>;
};

type Line = { id: number; role: 'seller' | 'prospect'; text: string };
type Phase = 'idle' | 'starting' | 'live' | 'ending';

function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function Room({ scenarioId, prospectName, labels }: { scenarioId: string; prospectName: string; labels: CallLabels }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string>();
  const [lines, setLines] = useState<Line[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [interrupted, setInterrupted] = useState(false);
  const simulationId = useRef<string | null>(null);
  const finished = useRef(false);
  const connected = useRef(false);
  const orb = useRef<HTMLDivElement>(null);
  const transcriptEnd = useRef<HTMLDivElement>(null);

  // Fin d'appel, quelle qu'en soit la cause : le serveur récupère la transcription, puis on ouvre la session.
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
      router.push(`/simulations/${id}`);
    },
    [router],
  );

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      connected.current = true;
      setPhase('live');
      if (simulationId.current) void markConnectedAction(simulationId.current, conversationId);
    },
    onDisconnect: (details: DisconnectionDetails) => {
      if (details.reason === 'error') setError(labels.errors.connection);
      void finish(details.reason, details.reason === 'error' ? details.message : undefined);
    },
    onError: (message) => {
      setError(labels.errors.connection);
      console.error('[voice]', message);
      // Échec avant la connexion (réseau, jeton refusé) : le SDK ne signale pas toujours de déconnexion.
      if (!connected.current) void finish('error', message);
    },
    onMessage: ({ message, role }) => {
      const text = message.trim();
      if (!text) return;
      setLines((prev) => [...prev, { id: prev.length, role: role === 'user' ? 'seller' : 'prospect', text }]);
    },
    onInterruption: () => {
      setInterrupted(true);
      window.setTimeout(() => setInterrupted(false), 2500);
    },
  });
  const { status, isSpeaking, isMuted, setMuted, endSession, startSession, getInputVolume, getOutputVolume } = conversation;

  // Chronomètre de l'appel.
  useEffect(() => {
    if (phase !== 'live') return;
    const timer = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  // L'orbe suit le volume de la voix qui parle, sans re-rendu React à chaque image.
  useEffect(() => {
    if (phase !== 'live') return;
    let frame = 0;
    const tick = () => {
      const level = isSpeaking ? getOutputVolume() : getInputVolume();
      orb.current?.style.setProperty('--level', String(Math.min(1, level * 2.5)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, isSpeaking, getInputVolume, getOutputVolume]);

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);

  // Quitter la page raccroche : le serveur rattrapera la transcription plus tard.
  useEffect(() => () => endSession(), [endSession]);

  async function start() {
    setError(undefined);
    setPhase('starting');
    try {
      // Demande explicite du micro avant d'ouvrir l'appel, pour expliquer un refus clairement.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setError(labels.errors.mic_denied);
      setPhase('idle');
      return;
    }
    const res = await startSimulationAction(scenarioId).catch(() => ({ ok: false as const, error: 'provider_error' as const }));
    if (!res.ok) {
      setError(labels.errors[res.error]);
      setPhase('idle');
      return;
    }
    simulationId.current = res.simulationId;
    finished.current = false;
    connected.current = false;
    setElapsed(0);
    setLines([]);
    startSession({ conversationToken: res.token, connectionType: 'webrtc' });
  }

  const live = phase === 'live' && status === 'connected';
  const stateLabel =
    phase === 'ending' ? labels.saving : !live ? labels.connecting : isSpeaking ? labels.prospectSpeaking : labels.listening;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,22rem)]">
      <div className="relative grid min-h-[22rem] place-items-center overflow-hidden rounded-2xl border border-border bg-surface p-6">
        <div aria-hidden="true" className="glow pointer-events-none absolute inset-0 opacity-60" />
        {phase === 'idle' ? (
          <div className="relative grid max-w-sm justify-items-center gap-4 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-primary/20 text-primary">
              <Phone className="size-7" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">{labels.micHint}</p>
            <FormAlert message={error} />
            <Button size="lg" onClick={start}>
              <Phone /> {labels.start}
            </Button>
          </div>
        ) : (
          <div className="relative grid justify-items-center gap-6 text-center">
            <div
              ref={orb}
              aria-hidden="true"
              className={cn(
                'size-36 rounded-full transition-colors duration-300 [transform:scale(calc(1+var(--level,0)*0.35))] motion-reduce:[transform:none]',
                isSpeaking && live ? 'bg-gradient-to-br from-primary to-teal shadow-[0_0_60px] shadow-primary/40' : 'bg-gradient-to-br from-surface-2 to-primary/40',
              )}
            />
            <div className="grid gap-1">
              <p className="text-lg font-medium" role="status" aria-live="polite">
                {(phase === 'starting' || phase === 'ending') && <Loader2 className="mr-2 inline size-4 animate-spin" aria-hidden="true" />}
                {stateLabel}
              </p>
              <p className="font-mono text-sm text-muted-foreground tabular-nums">{clock(elapsed)}</p>
              <p className={cn('h-5 text-sm text-warning transition-opacity', interrupted ? 'opacity-100' : 'opacity-0')} aria-live="polite">
                {interrupted ? labels.interrupted : ''}
              </p>
            </div>
            <FormAlert message={error} />
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="lg" disabled={!live} onClick={() => setMuted(!isMuted)} aria-pressed={isMuted}>
                {isMuted ? <MicOff /> : <Mic />} {isMuted ? labels.unmute : labels.mute}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                disabled={phase === 'ending'}
                onClick={() => {
                  // Avant la connexion, raccrocher annule l'appel ; ensuite, la fin est gérée par onDisconnect.
                  endSession();
                  if (!connected.current) void finish('user');
                }}
              >
                <PhoneOff /> {labels.hangUp}
              </Button>
            </div>
            {isMuted && live && <p className="text-xs text-muted-foreground">{labels.muted}</p>}
          </div>
        )}
      </div>

      <section aria-labelledby="live-title" className="flex max-h-[32rem] min-h-[16rem] flex-col rounded-2xl border border-border bg-surface">
        <h2 id="live-title" className="border-b border-border px-5 py-3 text-sm font-semibold">
          {labels.live}
        </h2>
        <ol className="grid flex-1 content-start gap-3 overflow-y-auto p-5" aria-live="polite">
          {lines.length === 0 && <li className="text-sm text-muted-foreground">{labels.liveEmpty}</li>}
          {lines.map((line) => (
            <li key={line.id} className={cn('grid gap-0.5', line.role === 'seller' && 'justify-items-end text-right')}>
              <span className="text-xs text-muted-foreground">{line.role === 'seller' ? labels.you : prospectName}</span>
              <span
                className={cn(
                  'max-w-[90%] rounded-xl px-3 py-2 text-sm',
                  line.role === 'seller' ? 'bg-primary/20 text-foreground' : 'bg-surface-2 text-foreground',
                )}
              >
                {line.text}
              </span>
            </li>
          ))}
          <div ref={transcriptEnd} />
        </ol>
      </section>
    </div>
  );
}

export default function CallRoom(props: { scenarioId: string; prospectName: string; labels: CallLabels }) {
  return (
    <ConversationProvider>
      <Room {...props} />
    </ConversationProvider>
  );
}
