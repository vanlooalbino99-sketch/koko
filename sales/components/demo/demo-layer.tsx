import { Suspense } from 'react';
import type { AuthContext } from '@/lib/auth/service';
import type { Dictionary } from '@/lib/i18n';
import { DemoBanner } from './demo-banner';

export function DemoLayer({ auth, t }: { auth: AuthContext; t: Dictionary }) {
  if (!auth.demo) return null;
  return (
    <Suspense>
      <DemoBanner text={t.demo} />
    </Suspense>
  );
}
