'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CalendarCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { nav } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive(item.href) && 'text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild className="sheen glow-btn hidden sm:inline-flex" data-magnet>
            <Link href="/rendez-vous">
              <CalendarCheck aria-hidden />
              Réserver un audit
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </Button>
        </div>
      </div>
      <div id="menu-mobile" hidden={!open} className="h-[calc(100dvh-4rem)] border-t bg-background md:hidden">
        <nav aria-label="Navigation mobile" className="px-4 py-6">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined} className={cn('block rounded-lg px-3 py-3 text-lg font-medium', isActive(item.href) ? 'bg-accent text-accent-foreground' : 'hover:bg-muted')}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/rendez-vous">
              <CalendarCheck aria-hidden />
              Réserver un audit gratuit
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
