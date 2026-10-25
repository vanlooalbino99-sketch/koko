import { redirect } from 'next/navigation';
import { AuthFrame } from '@/components/shell/auth-frame';
import { getAuth } from '@/lib/server/context';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getAuth()) redirect('/dashboard');
  return <AuthFrame>{children}</AuthFrame>;
}
