'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Gauge, History, LayoutDashboard, Library, PlusCircle, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  dashboard: LayoutDashboard,
  scenarios: Library,
  history: History,
  new: PlusCircle,
  settings: Settings,
  billing: CreditCard,
  team: Users,
  admin: Gauge,
};
export type NavItem = { href: string; label: string; icon: keyof typeof ICONS };
export type NavGroup = { title: string; items: NavItem[] };

export function NavLinks({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  // Le lien le plus précis gagne : /scenarios/new ne doit pas aussi activer /scenarios.
  const all = groups.flatMap((g) => g.items);
  const active = all
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return (
    <nav className="grid gap-6">
      {groups.map((group) => (
        <div key={group.title} className="grid gap-0.5">
          <p className="px-3 pb-1.5 text-[10.5px] font-medium tracking-[0.08em] text-muted-foreground uppercase">{group.title}</p>
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
                  isActive ? 'bg-[#2a2870] text-white ring-1 ring-[#4f49c9]/70' : 'text-[#c4c7d2] hover:bg-white/5 hover:text-foreground',
                )}
              >
                <Icon className={cn('size-4', isActive ? 'text-[#b3a9ff]' : 'text-muted-foreground')} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
