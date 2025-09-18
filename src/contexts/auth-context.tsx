
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, get, child, update } from 'firebase/database';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isNewUser: boolean | null;
  location: string | null;
  setLocation: (location: string) => void;
  refreshUserStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [location, setLocationState] = useState<string | null>(null);


  const setLocation = useCallback((newLocation: string) => {
    setLocationState(newLocation);
    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      update(userRef, { location: newLocation });
    }
  }, [user]);

  const refreshUserStatus = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${currentUser.uid}`));
        const userData = snapshot.val();
        setIsNewUser(!snapshot.exists() || !userData.preferences);
    }
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Check if user has preferences set in Realtime Database
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `users/${user.uid}`));
        const userData = snapshot.val();

        if (snapshot.exists() && userData.location) {
          setLocationState(userData.location);
        } else {
            // Default location if not set
            setLocationState(null);
        }

        // A user is "new" if they don't have a record or preferences in our `users` node.
        setIsNewUser(!snapshot.exists() || !userData.preferences);
      } else {
        setUser(null);
        setIsNewUser(null);
        setLocationState(null); // Default for guests
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, isNewUser, location, setLocation, refreshUserStatus };

  // Render a global loading state while we check for an active user session.
  if (loading && !user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
