'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

// Onglets de l'Intelligence IA (pastille claire sur l'onglet actif, comme la maquette). Les panneaux arrivent
// déjà rendus par le serveur : seul le choix de l'onglet vit dans le navigateur.
export function IntelTabs({ tabs, label }: { tabs: { key: string; label: string; panel: React.ReactNode }[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const id = useId();
  const move = (from: number, step: number) => {
    const next = tabs[(from + step + tabs.length) % tabs.length];
    setActive(next.key);
    document.getElementById(`${id}-tab-${next.key}`)?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            id={`${id}-tab-${tab.key}`}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`${id}-panel-${tab.key}`}
            tabIndex={active === tab.key ? 0 : -1}
            onClick={() => setActive(tab.key)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') move(i, 1);
              if (e.key === 'ArrowLeft') move(i, -1);
            }}
            className={cn(
              'shrink-0 rounded-xl px-5 py-3 text-[14px] font-medium whitespace-nowrap transition-colors sm:px-8',
              active === tab.key ? 'bg-[#2b2c36] text-white' : 'text-[#9aa1b2] hover:text-[#d3d7e1]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          id={`${id}-panel-${tab.key}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tab.key}`}
          hidden={active !== tab.key}
          className="mt-8"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
