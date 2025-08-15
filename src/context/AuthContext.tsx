import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'user';
  reputation?: number;
  joinDate?: string;
  isOnline?: boolean;
  balance?: number;
  bookmarks?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: { name: string; email: string; avatar?: string }) => void;
  logout: () => void;
  updateProfile: (newData: Partial<User>) => void;
  updateBalance: (amount: number) => void;
  addBookmark: (threadId: string) => void;
  removeBookmark: (threadId: string) => void;
}

const ADMIN_EMAIL = "admin@romusha.com";
const ADMIN_NAME = "BlackQuill";
const ADMIN_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  updateBalance: () => {},
  addBookmark: () => {},
  removeBookmark: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Login logic: if email is admin, role is admin & name is BlackQuill
  const login = ({ name, email, avatar }: { name: string; email: string; avatar?: string }) => {
    if (email === ADMIN_EMAIL) {
      setUser({
        name: ADMIN_NAME,
        email,
        avatar: ADMIN_AVATAR,
        role: 'admin',
        joinDate: new Date().toISOString(),
        isOnline: true,
        balance: 10000000,
        bookmarks: [],
        reputation: 9999,
      });
    } else {
      setUser({
        name,
        email,
        avatar,
        role: 'user',
        joinDate: new Date().toISOString(),
        isOnline: true,
        balance: 0,
        bookmarks: [],
        reputation: 0,
      });
    }
  };

  const logout = () => setUser(null);
  const updateProfile = (newData: Partial<User>) => setUser(prev => prev ? { ...prev, ...newData } : prev);
  const updateBalance = (amount: number) => setUser(prev => prev ? { ...prev, balance: (prev.balance || 0) + amount } : prev);
  const addBookmark = (threadId: string) => setUser(prev => prev ? { ...prev, bookmarks: prev.bookmarks?.includes(threadId) ? prev.bookmarks : [...(prev.bookmarks || []), threadId] } : prev);
  const removeBookmark = (threadId: string) => setUser(prev => prev ? { ...prev, bookmarks: (prev.bookmarks || []).filter(id => id !== threadId) } : prev);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, updateBalance, addBookmark, removeBookmark }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}