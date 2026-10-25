'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, FileText, Gauge, Grip, History, PlusCircle, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  dashboard: Grip,
  scenarios: FileText,
  history: History,
  new: PlusCircle,
  settings: Settings,
  billing: CreditCard,
  team: Users,
  admin: Gauge,
};
export type NavItem = { href: string; label: string; icon: keyof typeof ICONS };
export type NavGroup = { title: string | null; items: NavItem[] };

export function NavLinks({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  // Le lien le plus précis gagne : /scenarios/new ne doit pas aussi activer /scenarios.
  const all = groups.flatMap((g) => g.items);
  const active = all
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <nav className="grid gap-6">
      {groups.map((group, gi) => (
        <div key={group.title ?? gi} className="grid gap-0.5">
          {group.title && <p className="px-3 pb-2 text-[10.5px] font-semibold tracking-[0.06em] text-[#e6e8ee] uppercase">{group.title}</p>}
          {group.items.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive = item.href === active;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors',
                  isActive ? 'bg-[#29294b] font-medium text-[#8f88ff]' : 'text-[#d3d7e1] hover:bg-white/5 hover:text-white',
                )}
              >
                <Icon className={cn('size-4', isActive ? 'text-[#8f88ff]' : 'text-[#c3c8d4]')} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
