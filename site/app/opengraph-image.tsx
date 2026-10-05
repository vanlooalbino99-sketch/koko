import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name} · ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Image de partage (réseaux sociaux, messageries), générée au build.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: 'linear-gradient(135deg, #070b14 0%, #0d1424 60%, #15244a 100%)', color: '#e8edf6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#e8edf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: '#4f8cdb' }} />
          </div>
          {site.name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{site.tagline}</div>
          <div style={{ fontSize: 32, color: '#9aa8bf' }}>Assistant téléphonique IA · Prise de rendez-vous · Relances</div>
        </div>
      </div>
    ),
    size,
  );
}
