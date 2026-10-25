'use client';

import { useRef, useState } from 'react';
import { Play, Printer } from 'lucide-react';

export function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Printer className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}

// Lecteur de l'enregistrement (servi par notre serveur depuis ElevenLabs) et accès direct aux moments marqués.
export function RecordingPlayer({
  src,
  markers,
  labels,
}: {
  src: string;
  markers: { at: number; label: string }[];
  labels: { missing: string; markers: string; markersEmpty: string };
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [missing, setMissing] = useState(false);
  const play = (at: number) => {
    const el = audio.current;
    if (!el) return;
    el.currentTime = at;
    void el.play().catch(() => {});
  };
  return (
    <div className="grid gap-4">
      {missing ? (
        <p role="status" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-muted-foreground">
          {labels.missing}
        </p>
      ) : (
        <audio ref={audio} controls preload="metadata" src={src} onError={() => setMissing(true)} className="w-full" />
      )}
      <div>
        <h3 className="text-sm font-semibold">{labels.markers}</h3>
        {markers.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">{labels.markersEmpty}</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {markers.map((m) => (
              <li key={m.at}>
                <button
                  type="button"
                  onClick={() => play(m.at)}
                  disabled={missing}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-sm hover:bg-surface-2 disabled:opacity-50"
                >
                  <Play className="size-3.5 text-primary" aria-hidden="true" />
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
