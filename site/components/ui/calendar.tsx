'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { fr } from 'react-day-picker/locale';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// Calendrier shadcn/ui (react-day-picker v9), en français.
function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  const d = getDefaultClassNames();
  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: cn('w-fit', d.root, classNames?.root),
        months: cn('relative flex flex-col gap-4', d.months, classNames?.months),
        month: cn('flex w-full flex-col gap-4', d.month),
        nav: cn('absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1', d.nav),
        button_previous: cn(buttonVariants({ variant: 'ghost' }), 'size-9 p-0 aria-disabled:opacity-40', d.button_previous),
        button_next: cn(buttonVariants({ variant: 'ghost' }), 'size-9 p-0 aria-disabled:opacity-40', d.button_next),
        month_caption: cn('flex h-9 w-full items-center justify-center px-10', d.month_caption),
        caption_label: cn('text-sm font-semibold capitalize', d.caption_label),
        weekdays: cn('flex', d.weekdays),
        weekday: cn('flex-1 select-none text-[0.8rem] font-normal text-muted-foreground capitalize', d.weekday),
        week: cn('mt-1.5 flex w-full', d.week),
        day: cn('relative aspect-square w-full p-0 text-center select-none', d.day),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-10 sm:size-11 p-0 font-normal aria-selected:opacity-100',
          'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary',
          d.day_button,
        ),
        today: cn('[&>button]:ring-1 [&>button]:ring-primary/50', d.today),
        outside: cn('text-muted-foreground/60', d.outside),
        disabled: cn('text-muted-foreground opacity-40 [&>button]:line-through decoration-muted-foreground/40', d.disabled),
        hidden: cn('invisible', d.hidden),
      }}
      components={{
        Chevron: ({ orientation, className: c, ...rest }) =>
          orientation === 'left' ? <ChevronLeft className={cn('size-4', c)} {...rest} /> : <ChevronRight className={cn('size-4', c)} {...rest} />,
        DayButton: ({ day, modifiers, ...rest }) => {
          void day;
          return <button data-selected={modifiers.selected || undefined} {...rest} />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
