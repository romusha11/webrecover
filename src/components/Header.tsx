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
    <header
      className="border-b shadow-sm flex items-center justify-between px-3 sm:px-6 md:px-10 py-2 sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border-gray-900"
      aria-label="Romusha Main Header"
    >
      {/* Kiri: Logo & Menu */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ color: '#4a74ff', background: '#181818' }}
          onClick={onMenuToggle}
          aria-label="Buka menu utama"
        >
          <Menu size={26} />
        </button>
        <a href="/" className="font-black text-xl sm:text-2xl tracking-tight" style={{ color: '#fff' }}>
          Romusha
        </a>
      </div>
      {/* Tengah: Search (responsive) */}
      <div className="flex-1 mx-2 max-w-lg hidden md:flex">
        <input
          type="text"
          placeholder="Cari thread, user, topik..."
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#181818] border border-[#282828] text-[#4a74ff] placeholder:text-[#9ca3af] outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label="Cari thread, user, atau topik"
        />
      </div>
      {/* Kanan: Notif, Auth */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search for mobile */}
        <div className="md:hidden">
          <input
            type="text"
            placeholder="Cari..."
            className="rounded px-2 py-1 text-xs min-w-[80px] border bg-[#181818] text-[#4a74ff] border-[#282828] outline-none"
          />
        </div>
        <button className="relative hover:bg-[#181818] p-2 rounded-lg transition" style={{ color: '#4a74ff' }} aria-label="Notifikasi">
          <Bell size={22} />
          {/* Badge notif (dummy) */}
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold text-base sm:text-lg text-white truncate max-w-[120px] sm:max-w-[200px]">{user.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-lg text-sm font-semibold border border-[#282828] bg-[#181818] text-white hover:bg-[#282828] transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="px-4 py-1 rounded-lg font-semibold text-sm border border-[#282828] bg-[#181818] text-white hover:bg-[#282828] transition"
            aria-label="Login atau Register"
          >
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
}
