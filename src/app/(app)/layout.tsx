
'use client';
import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { PanicButton } from '@/components/panic-button';
import { AuthOverlay } from '@/components/auth-overlay';
import { useAuth } from '@/contexts/auth-context';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const privateRoutes = [
  '/itinerary',
  '/digital-id',
  '/tracking',
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, isNewUser } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect to user-preferences if the user is new AND not already on that page.
    if (!loading && user && isNewUser && pathname !== '/user-preferences') {
      redirect('/user-preferences');
    }
  }, [user, loading, isNewUser, pathname]);

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const showOverlay = !loading && !user && isPrivateRoute;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-0 md:pl-64">
        <Header />
        <main className="relative flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="h-full w-full animate-fade-in-up">
            {children}
          </div>
          {showOverlay && <AuthOverlay />}
        </main>
      </div>
      {user && <PanicButton />}
    </div>
  );
}
