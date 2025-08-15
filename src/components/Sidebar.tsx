import React from 'react';
import { LayoutDashboard, Home, TrendingUp, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockCategories } from '../data/mockData';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-200 p-4">
      <nav className="space-y-2 mb-8">
        {user && (
          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
              location.pathname === "/dashboard" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        )}
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
            location.pathname === "/" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Home size={20} />
          <span>Forum</span>
        </Link>
        <Link
          to="/my-activity"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
            location.pathname === "/my-activity" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <TrendingUp size={20} />
          <span>Activity</span>
        </Link>
        <Link
          to="/profile"
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
            location.pathname === "/profile" ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users size={20} />
          <span>Profile</span>
        </Link>
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium ${
              location.pathname === "/admin" ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
        <div className="space-y-1">
          {mockCategories.map(c => (
            <div key={c.id} className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c.color}20` }}>
                {/* icon */}
              </span>
              <span className="ml-2 font-medium">{c.name}</span>
              <span className="ml-auto text-xs text-gray-500">{c.threadCount} threads</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
