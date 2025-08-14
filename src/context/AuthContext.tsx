import React, { createContext, useContext, useState, useEffect } from 'react';

// User interface yang scalable dan siap untuk fitur lanjutan
export interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'user';
  reputation?: number;
  joinDate?: string;
  isOnline?: boolean;
  balance?: number;
  bookmarks?: string[]; // array of thread id
}

// Context type yang mendukung edit profile, saldo, dsb
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (newData: Partial<User>) => void;
  updateBalance: (amount: number) => void; // tambah/kurangi saldo
  addBookmark: (threadId: string) => void;
  removeBookmark: (threadId: string) => void;
}

// Default value
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

  // Login (buat user baru atau ambil dari register/login)
  const login = (userData: User) => setUser({ ...userData, role: userData.role || 'user', joinDate: userData.joinDate || new Date().toISOString(), balance: userData.balance || 0, bookmarks: userData.bookmarks || [] });

  // Logout
  const logout = () => setUser(null);

  // Update profile (edit nama, avatar, dsb)
  const updateProfile = (newData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...newData } : prev);
  };

  // Update saldo (+/-)
  const updateBalance = (amount: number) => {
    setUser(prev => prev ? { ...prev, balance: (prev.balance || 0) + amount } : prev);
  };

  // Bookmark thread
  const addBookmark = (threadId: string) => {
    setUser(prev => prev ? { ...prev, bookmarks: prev.bookmarks?.includes(threadId) ? prev.bookmarks : [...(prev.bookmarks || []), threadId] } : prev);
  };

  // Remove bookmark
  const removeBookmark = (threadId: string) => {
    setUser(prev => prev ? { ...prev, bookmarks: (prev.bookmarks || []).filter(id => id !== threadId) } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, updateBalance, addBookmark, removeBookmark }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook untuk akses context
export function useAuth() {
  return useContext(AuthContext);
}