'use client';

import { Button } from '@/components/ui/button';

// Bouton d'envoi qui demande confirmation avant une action destructive.
export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <Button
      type="submit"
      variant="destructive"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
