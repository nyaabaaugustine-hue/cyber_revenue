import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { users, getUserByEmail, currentUser } from './data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      const matched = getUserByEmail(email);
      if (matched) {
        setUser(matched);
      } else {
        setUser({ ...currentUser, email });
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    const roleUser = users.find(u => u.role === role);
    if (roleUser) {
      setUser(roleUser);
    } else if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole, availableUsers: users }}>
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