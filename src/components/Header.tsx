import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onAuthClick }: { onAuthClick: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm flex items-center justify-between px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100">
          <Menu size={24} />
        </button>
        <span className="text-2xl font-extrabold text-blue-700 tracking-wide">Romusha</span>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Cari thread, user, topik..."
          className="border rounded px-3 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden md:block min-w-[200px]"
        />
        <button className="relative text-gray-600 hover:text-blue-700">
          <Bell size={20} />
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-blue-700">{user.name}</span>
            <button
              onClick={logout}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-lg font-medium text-sm"
          >
            Login / Register
          </button>
        )}
      </div>
    </header>
  );
}
