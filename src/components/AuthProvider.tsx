'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  AuthContext,
  attemptLogin,
  attemptRegister,
  getSession,
  clearSession,
  type User,
} from '@/lib/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = attemptLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const result = attemptRegister(email, password, displayName);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
