import { EllipsisVertical, LogOut } from 'lucide-react';
import { logOutAction } from '@/app/actions/auth';
import { LanguageSwitch } from '@/components/shell/language-switch';
import type { Locale } from '@/lib/domain';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// Bas de la barre latérale : avatar, nom, rôle, et un menu « ⋮ » pour la langue et la déconnexion.
export function AccountMenu({
  name,
  detail,
  locale,
  labels,
}: {
  name: string;
  detail: string;
  locale: Locale;
  labels: { menu: string; language: string; logout: string };
}) {
  return (
    <div className="flex items-center gap-3 px-1.5 py-2">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#8ea2ff,#5c55f0_55%,#3fe0b5)] text-xs font-semibold text-white ring-2 ring-white/10"
      >
        {initials(name)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-[13px] font-medium">{name}</span>
        <span className="block truncate text-[11.5px] text-[#9aa1b2]">{detail}</span>
      </span>
      <details className="relative">
        <summary className="grid size-8 cursor-pointer list-none place-items-center rounded-lg text-[#9aa1b2] hover:bg-white/5 hover:text-foreground" aria-label={labels.menu}>
          <EllipsisVertical className="size-4" aria-hidden="true" />
        </summary>
        <div className="absolute right-0 bottom-10 z-30 grid w-48 gap-2 rounded-xl border border-border bg-surface-2 p-2 shadow-2xl">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[12px] text-[#9aa1b2]">{labels.language}</span>
            <LanguageSwitch locale={locale} label={labels.language} />
          </div>
          <form action={logOutAction}>
            <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] hover:bg-white/5">
              <LogOut className="size-4 text-[#9aa1b2]" aria-hidden="true" /> {labels.logout}
            </button>
          </form>
        </div>
      </details>
    </div>
  );
}
