
'use client';
import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { PanicButton } from '@/components/panic-button';
import { useAuth } from '@/contexts/auth-context';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const privateRoutes = [
  '/itinerary',
  '/digital-id',
  '/tracking',
  '/community',
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, isNewUser } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, but new, redirect to preferences
        if (isNewUser) {
          redirect('/user-preferences');
        }
      } else {
        // If user is not logged in and tries to access a private route, redirect to login
        if (privateRoutes.some(route => pathname.startsWith(route))) {
          redirect('/login');
        }
      }
    }
  }, [user, loading, isNewUser, pathname]);

  // Always show a loading spinner while checking auth state, especially for private routes
  if (loading && privateRoutes.some(route => pathname.startsWith(route))) {
    return null; // or a loading spinner
  }

  // If user is not logged in but trying to access a private page, show loader until redirect kicks in
  if (!loading && !user && privateRoutes.some(route => pathname.startsWith(route))) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-0 md:pl-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
      {user && <PanicButton />}
    </div>
  );
}
