import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { PanicButton } from '@/components/panic-button';

export default function AppLayout({ children }: { children: ReactNode }) {
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
      <PanicButton />
    </div>
  );
}
