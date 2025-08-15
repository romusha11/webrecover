import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onMenuToggle: () => void;
}

export default function Header({ onAuthClick, onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b shadow-sm flex items-center justify-between px-4 md:px-6 py-3 sticky top-0 z-50"
      style={{ background: '#111', borderColor: '#191919' }}
    >
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden p-2 rounded"
          style={{ color: '#8a6cff', background: '#181818' }}
          onClick={onMenuToggle}
          aria-label="Buka menu"
        >
          <Menu size={24} />
        </button>
        <span className="font-extrabold tracking-wide text-2xl" style={{ color: '#7b90ff' }}>Romusha</span>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Cari thread, user, topik..."
          className="rounded px-3 py-1 text-sm min-w-[180px] border"
          style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
        />
        <button className="relative" style={{ color: '#7b90ff' }} aria-label="Notif">
          <Bell size={20} />
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg" style={{ color: '#7b90ff' }}>{user.name}</span>
            <button
              onClick={logout}
              className="px-2 py-1 rounded text-sm"
              style={{ background: '#181818', color: '#7b90ff', border: '1px solid #282828' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="px-4 py-1 rounded-lg font-medium text-sm"
            style={{ background: '#181818', color: '#7b90ff', border: '1px solid #282828' }}
          >
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
}
