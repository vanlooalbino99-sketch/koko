import { BarChart3, CalendarCheck, MessageSquareText, PhoneCall } from 'lucide-react';
import type { Service } from '@/lib/site';

const ICONS = { phone: PhoneCall, calendar: CalendarCheck, message: MessageSquareText, chart: BarChart3 };

export function ServiceIcon({ icon, className }: { icon: Service['icon']; className?: string }) {
  const Icon = ICONS[icon];
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
      <Icon className={className ?? 'size-5'} aria-hidden />
    </span>
  );
}
