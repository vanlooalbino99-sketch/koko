import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({ title: 'Mentions légales et confidentialité', description: `Mentions légales et politique de confidentialité de ${site.name}.`, path: '/mentions-legales' });

// TEXTE PROVISOIRE : à compléter avec les informations légales réelles (SIRET, hébergeur, directeur de publication).
export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:text-muted-foreground">
      <h1 className="text-4xl font-semibold tracking-tight">Mentions légales et confidentialité</h1>
      <h2>Éditeur</h2>
      <p>{site.name}, {site.address.street}, {site.address.postalCode} {site.address.city}. Contact : {site.email}, {site.phoneDisplay}. SIRET : à compléter.</p>
      <h2>Hébergement</h2>
      <p>À compléter (nom, adresse et téléphone de l’hébergeur).</p>
      <h2>Données personnelles</h2>
      <p>Les informations saisies dans les formulaires de contact et de prise de rendez-vous servent uniquement à vous recontacter et à préparer votre rendez-vous. Elles sont enregistrées dans notre outil de gestion client et conservées au plus trois ans après le dernier échange. Elles ne sont ni vendues ni cédées.</p>
      <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à {site.email}. Vous pouvez aussi saisir la CNIL.</p>
      <h2>Cookies</h2>
      <p>Ce site n’utilise aucun cookie de mesure d’audience ni de publicité. Seule votre préférence de thème (clair ou sombre) est gardée dans votre navigateur.</p>
    </article>
  );
}
