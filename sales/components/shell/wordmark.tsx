// Logo de l'espace d'entraînement (maquette « RevenuePulse ») : hexagone en double contour et nom de la marque,
// « AI » en dégradé.
export function Wordmark({ brand }: { brand: string }) {
  const [name, ...rest] = brand.split(' ');
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-8 shrink-0">
        <defs>
          <linearGradient id="wm-grad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8ea2ff" />
            <stop offset="0.55" stopColor="#5c55f0" />
            <stop offset="1" stopColor="#3fe0b5" />
          </linearGradient>
        </defs>
        <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25Z" fill="none" stroke="url(#wm-grad)" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M16 9.5 21.6 12.75v6.5L16 22.5l-5.6-3.25v-6.5Z" fill="url(#wm-grad)" opacity="0.85" />
      </svg>
      <span className="text-[17px] font-medium tracking-tight text-[#c9cedb]">
        {name}
        {rest.length > 0 && <span className="ml-1 bg-[linear-gradient(90deg,#8ea2ff,#3fe0b5)] bg-clip-text font-semibold text-transparent">{rest.join(' ')}</span>}
      </span>
    </span>
  );
}
