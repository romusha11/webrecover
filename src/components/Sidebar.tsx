import React from 'react';
import { LayoutDashboard, Home, TrendingUp, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockCategories } from '../data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onCloseSidebar: () => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function Sidebar({
  isOpen,
  onCloseSidebar,
  selectedCategory,
  onCategorySelect,
}: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}
      style={{ height: '100vh', background: '#111', borderRight: '1px solid #191919' }}
      aria-label="Sidebar navigasi"
    >
      <div className="h-full overflow-y-auto p-4">
        <nav className="space-y-2 mb-8">
          {/* Dashboard SELALU tampil untuk user yang login */}
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
              location.pathname === "/dashboard" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
            style={{ color: '#4a74ff' }}
            onClick={onCloseSidebar}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => { onCategorySelect(null); onCloseSidebar(); }}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium w-full text-left ${
              selectedCategory === null
                ? 'bg-blue-100'
                : 'hover:bg-gray-100'
            }`}
            style={{ color: '#4a74ff' }}
          >
            <Home size={20} />
            <span>All Threads</span>
          </button>
          <Link
            to="/my-activity"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
              location.pathname === "/my-activity" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
            style={{ color: '#4a74ff' }}
            onClick={onCloseSidebar}
          >
            <TrendingUp size={20} />
            <span>Activity</span>
          </Link>
          <Link
            to="/profile"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
              location.pathname === "/profile" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
            style={{ color: '#4a74ff' }}
            onClick={onCloseSidebar}
          >
            <Users size={20} />
            <span>Profile</span>
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
                location.pathname === "/admin" ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
              }`}
              style={{ color: '#fff' }}
              onClick={onCloseSidebar}
            >
              <LayoutDashboard size={20} />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#fff' }}>Categories</h3>
          <div className="space-y-1">
            {mockCategories.map(c => (
              <button
                key={c.id}
                onClick={() => { onCategorySelect(c.id); onCloseSidebar(); }}
                className={`flex items-center px-3 py-2 rounded-lg w-full text-left transition-colors
                  ${selectedCategory === c.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                style={{ color: '#4a74ff' }}
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#181818' }}>
                  {/* icon */}
                </span>
                <span className="ml-2 font-medium">{c.name}</span>
                <span className="ml-auto text-xs" style={{ color: '#fff' }}>{c.threadCount} threads</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
