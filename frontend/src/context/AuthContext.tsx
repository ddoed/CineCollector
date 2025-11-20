import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, ApiError, tokenStorage, TokenPair } from '../lib/api';

interface UserResponseRaw {
  name: string;
  email: string;
  role: 'COLLECTOR' | 'THEATER' | 'CREATOR' | 'ADMIN';
  profile_image?: string | null;
  created_at?: string | null;
}

export interface AuthUser {
  name: string;
  email: string;
  role: 'COLLECTOR' | 'THEATER' | 'CREATOR' | 'ADMIN';
  profileImage?: string | null;
  createdAt?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mapUser = (raw: UserResponseRaw): AuthUser => ({
  name: raw.name,
  email: raw.email,
  role: raw.role,
  profileImage: raw.profile_image ?? null,
  createdAt: raw.created_at ?? null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      setIsReady(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const me = await apiRequest<UserResponseRaw>('/users/me');
      setUser(mapUser(me));
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 401 || apiError.status === 403) {
        tokenStorage.clear();
        setUser(null);
      } else {
        setError(apiError.message);
      }
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleAuthSuccess = useCallback(async (tokens: TokenPair) => {
    tokenStorage.setTokens(tokens);
    await refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const tokens = await apiRequest<TokenPair>('/users/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    });
    await handleAuthSuccess(tokens);
  }, [handleAuthSuccess]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    const tokens = await apiRequest<TokenPair>('/users/signup', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ name, email, password }),
    });
    await handleAuthSuccess(tokens);
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setError(null);
    setIsReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isReady,
    error,
    login,
    signup,
    logout,
    refreshUser,
  }), [user, isLoading, isReady, error, login, signup, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('AuthContext는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return ctx;
};

