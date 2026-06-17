import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { users, getUserByEmail, currentUser } from './data';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  user: User | null;
  originalUser: User | null;
  isImpersonating: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAs: (targetUser: User) => void;
  stopImpersonation: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USE_MOCK = import.meta.env.VITE_USE_MOCK_BACKEND === 'true' || !import.meta.env.VITE_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (USE_MOCK) {
      return null;
    }
    const storeUser = useAuthStore.getState().user;
    if (storeUser) return storeUser as User;
    return null;
  });
  const [originalUser, setOriginalUser] = useState<User | null>(null);

  useEffect(() => {
    if (!USE_MOCK) {
      const hasToken = !!useAuthStore.getState().token;
      if (hasToken && !user) {
        loadCurrentUser();
      } else if (!hasToken) {
        setUser(null);
      }
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const mod = await import('../api/client');
      const response = await mod.api.get<User>('/auth/me');
      const userData = response.data;
      setUser(userData);
      useAuthStore.getState().setUser(userData as any);
    } catch {
      setUser(null);
      useAuthStore.getState().clearAuth();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!USE_MOCK) {
      try {
        const mod = await import('../api/client');
        const response = await mod.api.post<{ user: User; token: string; refreshToken: string }>('/auth/login', { email, password });
        const { user: userData, token, refreshToken } = response.data;
        useAuthStore.getState().login(userData as any, token, refreshToken);
        setUser(userData);
        return true;
      } catch (err) {
        const matched = getUserByEmail(email);
        if (matched && password) {
          setUser(matched);
          return true;
        }
        return false;
      }
    }
    if (email && password) {
      const matched = getUserByEmail(email);
      const foundUser = matched || { ...currentUser, email };
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (!USE_MOCK) {
      useAuthStore.getState().clearAuth();
      localStorage.removeItem('auth-store');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setUser(null);
    setOriginalUser(null);
  };

  const switchRole = (role: UserRole) => {
    const roleUser = users.find(u => u.role === role);
    if (roleUser) {
      setUser(roleUser);
    } else if (user) {
      setUser({ ...user, role });
    }
  };

  const loginAs = (targetUser: User) => {
    setOriginalUser(user);
    setUser(targetUser);
  };

  const stopImpersonation = () => {
    if (originalUser) {
      setUser(originalUser);
      setOriginalUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      originalUser,
      isImpersonating: !!originalUser,
      isAuthenticated: !!user,
      login,
      loginAs,
      stopImpersonation,
      logout,
      switchRole,
      availableUsers: users
    }}>
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
