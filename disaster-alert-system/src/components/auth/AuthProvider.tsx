'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase/config';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
} 