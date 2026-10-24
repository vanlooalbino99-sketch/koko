'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Library, PlusCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = { dashboard: LayoutDashboard, scenarios: Library, new: PlusCircle, settings: Settings };
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
        <div key={group.title} className="grid gap-1">
          <p className="px-3 pb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{group.title}</p>
          {group.items.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive = item.href === active;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-primary/15 text-foreground ring-1 ring-primary/30' : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                )}
              >
                <Icon className={cn('size-4', isActive && 'text-primary')} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
