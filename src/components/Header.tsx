import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Menu, LogOut, Settings, Grid, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onMenuToggle: () => void;
}

export default function Header({ onAuthClick, onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  return (
    <header
      className="border-b shadow-sm flex items-center justify-between px-2 sm:px-4 md:px-6 py-3 sticky top-0 z-50 w-full bg-[#111] border-[#191919]"
      aria-label="Header navigasi utama"
    >
      {/* Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded"
          style={{ color: '#4a74ff', background: '#181818' }}
          onClick={onMenuToggle}
          aria-label="Buka menu"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="font-extrabold tracking-wide text-xl sm:text-2xl text-white hover:text-blue-400 transition">
          ROMUSHA
        </Link>
      </div>

      {/* Center: Search */}
      <form className="flex-1 flex justify-center" onSubmit={handleSearch} style={{ maxWidth: 360 }}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Cari thread, user, topik..."
          className="rounded px-3 py-1 text-sm w-full border"
          style={{ background: '#181818', color: '#4a74ff', borderColor: '#282828' }}
          aria-label="Cari thread, user, topik"
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          aria-label="Cari"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Right: Aksi & User */}
      <nav className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="text-blue-400 hover:text-blue-600 transition relative"
          aria-label="Notifications"
        >
          <Bell size={22} />
        </Link>
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-blue-600 transition hidden sm:inline"
              aria-label="Dashboard"
            >
              <Grid size={22} />
            </Link>
            <Link
              to="/settings"
              className="text-gray-400 hover:text-blue-600 transition hidden sm:inline"
              aria-label="Settings"
            >
              <Settings size={22} />
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/analytics"
                className="text-yellow-400 hover:text-yellow-600 transition hidden sm:inline"
                aria-label="Analytics"
              >
                <BarChart2 size={22} />
              </Link>
            )}
            <Link
              to="/profile"
              className="text-blue-400 hover:text-blue-600 transition flex items-center gap-1"
              aria-label="Profile"
            >
              <User size={22} />
              <span className="font-semibold text-base text-white hidden sm:inline">{user.name}</span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="ml-2 px-3 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700 border border-[#282828]"
              aria-label="Logout"
            >
              <LogOut size={18} className="inline" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
        {!user && (
          <button
            onClick={onAuthClick}
            className="px-4 py-1 rounded-lg font-medium text-sm bg-blue-600 text-white border border-[#282828] hover:bg-blue-700 transition"
            aria-label="Login atau Register"
          >
            Login / Register
          </button>
        )}
      </nav>
    </header>
  );
}
