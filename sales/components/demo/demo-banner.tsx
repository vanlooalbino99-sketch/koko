'use client';

import { useSearchParams } from 'next/navigation';
import { FlaskConical } from 'lucide-react';
import { exitDemoAction } from '@/app/actions/auth';

type Text = { bannerTitle: string; bannerText: string; bannerReadOnly: string; bannerSignup: string; bannerExit: string };

// Bandeau de la visite de démo, toujours visible : les données sont fictives et rien n'est enregistré.
export function DemoBanner({ text }: { text: Text }) {
  const refused = useSearchParams().get('demo') === 'lecture-seule';
  return (
    <>
      <div aria-hidden="true" className="h-24 sm:hidden" />
      <aside
        role="status"
        className={`fixed inset-x-4 bottom-4 z-50 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border px-4 py-3 text-[13px] shadow-[0_18px_50px_-12px_rgb(20_10_60/0.45)] backdrop-blur sm:left-auto sm:max-w-[560px] ${
          refused ? 'border-amber-400/70 bg-amber-50/95 text-amber-950' : 'border-violet-300/60 bg-white/95 text-[#1d1638]'
        }`}
      >
        <FlaskConical className="size-4 shrink-0 text-violet-600" aria-hidden="true" />
        <p className="min-w-0 flex-1">
          <strong className="font-semibold">{text.bannerTitle}</strong>
          <span className="block text-[12px] opacity-80">{refused ? text.bannerReadOnly : text.bannerText}</span>
        </p>
        <form action={exitDemoAction} className="flex gap-2">
          <button
            name="next"
            value="/signup"
            className="h-8 rounded-lg bg-violet-600 px-3 text-[12px] font-medium text-white hover:bg-violet-700"
          >
            {text.bannerSignup}
          </button>
          <button className="h-8 rounded-lg border border-black/10 px-3 text-[12px] hover:bg-black/5">{text.bannerExit}</button>
        </form>
      </aside>
    </>
  );
}
