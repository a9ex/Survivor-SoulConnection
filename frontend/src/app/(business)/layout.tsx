import '@/styles/tailwind.css';

import { NextUIProvider } from '@nextui-org/react';
import { NavBar } from '@/features/navbar';
import { Nunito } from 'next/font/google';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import NextAuthProvider from '../context/next-auth-provider';

interface LayoutProps {
  children: React.ReactNode;
}

const nunito = Nunito({ subsets: ['latin'] });

export default async function Layout(props: LayoutProps) {
  const session = await auth();
  if (!session) return redirect('/login');

  return (
    <html suppressHydrationWarning>
      <body className={`min-h-screen ${nunito.className} dark:bg-background bg-gray-100`}>
        <NextAuthProvider>
          <NextUIProvider locale="fr-FR">
            <NavBar role={session.user.role} />
            <main className="py-8 px-6">{props.children}</main>
          </NextUIProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
