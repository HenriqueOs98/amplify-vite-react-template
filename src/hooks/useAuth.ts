import { useState, useEffect } from 'react';
import { db } from '@/src/db';

export function useAuth() {
  const [user, setUser] = useState(db.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStore = db.getAuthStore();
    
    const updateUser = () => {
      setUser(db.getCurrentUser());
      setLoading(false);
    };

    // Initial check
    updateUser();

    // Listen for changes
    const unsubscribe = authStore.onChange(() => {
      updateUser();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await db.authenticate(email, password);
    setUser(authData.record);
    return authData;
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
}

