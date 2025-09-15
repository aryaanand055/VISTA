
'use client';

import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading, isNewUser } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (isNewUser) {
          redirect('/user-preferences');
        } else {
          redirect('/dashboard');
        }
      } else {
        redirect('/login');
      }
    }
  }, [user, loading, isNewUser]);

  return null; // or a loading spinner
}
