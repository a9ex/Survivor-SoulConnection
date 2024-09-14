import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AuthCard } from '@/features/auth';

export default async function AuthPage() {
  const session = await auth();
  if (session) return redirect('/');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <AuthCard />
    </main>
  );
}
