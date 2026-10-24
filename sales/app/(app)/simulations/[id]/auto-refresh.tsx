'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { refreshSimulationAction } from '@/app/actions/simulations';

// Tant que la transcription n'est pas prête, interroge le serveur puis recharge la page quand le statut change.
export function AutoRefresh({ simulationId, status }: { simulationId: string; status: string }) {
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
      if (res && res.status !== status) {
        stopped = true;
        window.clearInterval(timer);
        router.refresh();
      }
    }, 3000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [simulationId, status, router]);
  return null;
}
