import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      // We don't have a direct /me endpoint in the initial plan, 
      // but usually we'd check if a cookie exists by making a protected call
      // or decodig a local token. For now, since we use httpOnly cookies,
      // we can try fetching bookings or a profile endpoint.
      // Let's assume we store user info in localStorage for UI persistence 
      // OR better, add a /me endpoint in backend later. 
      // For this step, we'll try to get bookings as a "session check" equivalent
      // If 401, we are not logged in.

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: any) => {
    const res = await api.login(data);
    setUser(res.data.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
  };

  const signUp = async (data: any) => {
    const res = await api.signup(data);
    setUser(res.data.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
