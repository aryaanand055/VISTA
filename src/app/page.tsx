
'use client';

import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading, isNewUser } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Always redirect to dashboard as the main entry point for both guests and users.
      // The dashboard and layout will handle further redirects if needed.
      redirect('/dashboard');
    }
  }, [user, loading, isNewUser]);

  return null; // or a loading spinner
}
