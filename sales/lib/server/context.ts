import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getAuthContext, SESSION_DAYS, type AuthContext } from '@/lib/auth/service';
import { getDb } from '@/lib/db/client';
import { getDictionary, LOCALE_COOKIE, resolveLocale } from '@/lib/i18n';
import { getProfile } from '@/lib/profile/service';

export const SESSION_COOKIE = 'bs_session';

const secure = process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== '1';

// Une seule lecture de session par requête, partagée par le layout et la page.
export const getAuth = cache(async (): Promise<AuthContext | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return getAuthContext(await getDb(), token);
});

export async function requireAuth(): Promise<AuthContext> {
  const auth = await getAuth();
  if (!auth) redirect('/login');
  return auth;
}

export const getCurrentProfile = cache(async () => {
  const auth = await requireAuth();
  return getProfile(await getDb(), auth.user.id);
});

// Les pages de l'espace d'entraînement exigent un onboarding terminé.
export async function requireOnboarded() {
  const auth = await requireAuth();
  const profile = await getCurrentProfile();
  if (!profile) redirect('/onboarding');
  return { auth, profile };
}

export const getI18n = cache(async () => {
  const auth = await getAuth();
  const jar = await cookies();
  const locale = resolveLocale({
    user: auth?.user.locale,
    cookie: jar.get(LOCALE_COOKIE)?.value,
    acceptLanguage: (await headers()).get('accept-language'),
  });
  return { locale, t: getDictionary(locale) };
});

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function setLocaleCookie(locale: string) {
  (await cookies()).set(LOCALE_COOKIE, locale, { secure, sameSite: 'lax', path: '/', maxAge: 365 * 24 * 60 * 60 });
}

// Adresse du client derrière le proxy de l'hébergeur (première adresse de X-Forwarded-For).
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local';
}
