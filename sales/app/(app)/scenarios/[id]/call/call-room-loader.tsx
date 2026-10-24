'use client';

import dynamic from 'next/dynamic';
import type { CallLabels } from './call-room';

// Le SDK vocal utilise le micro et WebRTC : il n'est chargé que dans le navigateur.
const CallRoom = dynamic(() => import('./call-room'), { ssr: false });

export function CallRoomLoader(props: { scenarioId: string; prospectName: string; labels: CallLabels }) {
  return <CallRoom {...props} />;
}
