'use server';

import { redirect } from 'next/navigation';
import { LogInSchema, logIn, logOut, setUserLocale, signUp, SignUpSchema } from '@/lib/auth/service';
import { hit } from '@/lib/auth/rate-limit';
import { getDb } from '@/lib/db/client';
import { LOCALES, isOneOf } from '@/lib/domain';
import { echo, fieldErrorsFrom, safeNext, type FormState } from '@/lib/forms';
import {
  clearDemoCookie,
  clearSessionCookie,
  clientIp,
  getAuth,
  getI18n,
  isDemo,
  setDemoCookie,
  setLocaleCookie,
  setSessionCookie,
  SESSION_COOKIE,
} from '@/lib/server/context';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { locale, t } = await getI18n();
  if (!hit(`signup:${await clientIp()}`, 10, FIFTEEN_MINUTES)) return { error: t.auth.rateLimited, values: echo(formData, ['password']) };
  const parsed = SignUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    locale,
  });
  if (!parsed.success) {
    return {
      error: t.common.errorValidation,
      fieldErrors: fieldErrorsFrom(parsed.error, (issue) => (issue.path[0] === 'password' ? t.auth.passwordHint : t.common.required)),
      values: echo(formData, ['password']),
    };
  }
  const result = await signUp(await getDb(), parsed.data);
  if (!result.ok) return { fieldErrors: { email: t.auth.emailTaken }, values: echo(formData, ['password']) };
  await clearDemoCookie();
  await setSessionCookie(result.token);
  redirect(safeNext(formData.get('next')) ?? '/onboarding');
}

export async function logInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getI18n();
  const parsed = LogInSchema.safeParse({ email: formData.get('email'), password: formData.get('password') });
  if (!parsed.success) return { error: t.auth.invalid, values: echo(formData, ['password']) };
  const ip = await clientIp();
  // Deux compteurs : par adresse IP et par compte visé.
  if (!hit(`login-ip:${ip}`, 30, FIFTEEN_MINUTES) || !hit(`login:${parsed.data.email}`, 8, FIFTEEN_MINUTES)) {
    return { error: t.auth.rateLimited, values: echo(formData, ['password']) };
  }
  const session = await logIn(await getDb(), parsed.data.email, parsed.data.password);
  if (!session) return { error: t.auth.invalid, values: echo(formData, ['password']) };
  await clearDemoCookie();
  await setSessionCookie(session.token);
  redirect(safeNext(formData.get('next')) ?? '/dashboard');
}

// Visite de l'application avec l'équipe fictive : aucune inscription, rien n'est enregistré.
export async function enterDemoAction() {
  await setDemoCookie();
  redirect('/dashboard');
}

// Sortie de la démo, vers l'accueil ou vers l'inscription (« Créer mon compte »).
export async function exitDemoAction(formData?: FormData) {
  await clearDemoCookie();
  redirect(formData?.get('next') === '/signup' ? '/signup' : '/');
}

export async function logOutAction(formData?: FormData) {
  if (await isDemo()) return exitDemoAction();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  await logOut(await getDb(), token);
  await clearSessionCookie();
  const next = safeNext(formData?.get('next'));
  redirect(next ? `/login?next=${encodeURIComponent(next)}` : '/login');
}

export async function setLocaleAction(formData: FormData) {
  const locale = formData.get('locale');
  if (!isOneOf(LOCALES, locale)) return;
  await setLocaleCookie(locale);
  const auth = await getAuth();
  if (auth && !auth.demo) await setUserLocale(await getDb(), auth.user.id, locale);
  revalidatePath('/', 'layout');
}
