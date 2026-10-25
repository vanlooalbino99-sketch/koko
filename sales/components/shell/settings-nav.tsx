'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, CircleUserRound, ReceiptText, Settings, UserRound, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  profile: UserRound,
  organization: Building2,
  team: Users,
  billing: ReceiptText,
  account: CircleUserRound,
  settings: Settings,
};
export type SettingsNavItem = { href: string; label: string; icon: keyof typeof ICONS };

// Sous-navigation des réglages : une colonne sur ordinateur, une rangée qui défile sur téléphone.
export function SettingsNav({ title, label, items }: { title: string; label: string; items: SettingsNavItem[] }) {
  const pathname = usePathname();
  const list = useRef<HTMLUListElement>(null);
  // Sur téléphone, la rangée défile jusqu'à la section ouverte.
  useEffect(() => {
    const ul = list.current;
    const active = ul?.querySelector<HTMLElement>('[aria-current="page"]');
    if (ul && active && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = active.offsetLeft - (ul.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);
  return (
    <nav aria-label={label} className="min-w-0 rounded-xl border border-border bg-surface p-2 md:self-start md:p-3">
      <p className="hidden px-2 pt-0.5 pb-3 text-[13px] font-medium md:block">{title}</p>
      <ul ref={list} className="relative flex gap-1 overflow-x-auto md:grid md:overflow-visible">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] whitespace-nowrap transition-colors md:whitespace-normal',
                  active ? 'bg-[#eaf1ff] font-medium text-primary' : 'text-[#3d4048] hover:bg-surface-2',
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
