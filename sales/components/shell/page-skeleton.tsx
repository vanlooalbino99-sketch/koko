// Squelettes affichés dès le clic, le temps que le serveur prépare la page (fichiers loading.tsx) : la coque reste
// en place et le contenu apparaît sans écran figé. Les autres pages ont la barre de navigation (nav-progress.tsx).

const block = 'animate-pulse rounded-xl bg-white/[0.045]';

// Espace d'entraînement (thème sombre) : une rangée d'indicateurs puis des cartes.
export function AppSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-2.5">
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${block} h-[150px]`} style={{ animationDelay: `${i * 70}ms` }} />
        ))}
      </div>
      <div className="grid gap-2.5 xl:grid-cols-[1.15fr_1.45fr_1fr]">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={`${block} h-[280px]`} style={{ animationDelay: `${200 + i * 70}ms` }} />
        ))}
      </div>
      <div className={`${block} h-[180px]`} style={{ animationDelay: '400ms' }} />
    </div>
  );
}

// Réglages (thème clair) : un titre et quelques blocs de formulaire.
export function SettingsSkeleton({ label }: { label: string }) {
  const light = 'animate-pulse rounded-xl bg-[#eef0f6]';
  return (
    <div role="status" aria-label={label} className="grid gap-4 p-3">
      <div className={`${light} h-7 w-56`} />
      <div className={`${light} h-4 w-80 max-w-full`} />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className={`${light} h-[120px]`} style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}
