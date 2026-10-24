'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { refreshSimulationAction } from '@/app/actions/simulations';

// Tant que la transcription ou l'analyse n'est pas prête, interroge le serveur puis recharge la page
// dès que l'une ou l'autre change.
export function AutoRefresh({ simulationId, status, analysis }: { simulationId: string; status: string; analysis: string | null }) {
  const router = useRouter();
  useEffect(() => {
    let tries = 0;
    let stopped = false;
    const timer = window.setInterval(async () => {
      if (stopped) return;
      if (++tries > 60) {
        window.clearInterval(timer);
        return;
      }
      const res = await refreshSimulationAction(simulationId).catch(() => null);
      if (res && (res.status !== status || res.analysis !== analysis)) {
        stopped = true;
        window.clearInterval(timer);
        router.refresh();
      }
    }, 3000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [simulationId, status, analysis, router]);
  return null;
}
