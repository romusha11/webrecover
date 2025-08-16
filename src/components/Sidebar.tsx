import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Bell, Search, Settings, BarChart2, User, Layers, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  isOpen,
  onCloseSidebar,
  selectedCategory,
  onCategorySelect,
}: {
  isOpen: boolean;
  onCloseSidebar: () => void;
  selectedCategory: string | null;
  onCategorySelect: (cat: string | null) => void;
}) {
  const location = useLocation();
  const { user } = useAuth();

  const navItem = (to: string, label: string, icon: React.ReactNode, show: boolean = true) => (
    show && (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition
          ${location.pathname === to ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
        onClick={onCloseSidebar}
      >
        {icon}
        <span>{label}</span>
      </Link>
    )
  );

  return (
    <aside
      className={`fixed md:static top-0 left-0 z-40 h-full bg-white shadow-lg border-r w-64 transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      aria-label="Sidebar navigasi"
    >
      <div className="py-8 flex flex-col gap-2 h-full">
        {navItem('/', 'Home', <Home size={22} />)}
        {navItem('/categories', 'Categories', <Layers size={22} />)}
        {navItem('/search', 'Search', <Search size={22} />)}
        {navItem('/notifications', 'Notifications', <Bell size={22} />)}
        {navItem('/dashboard', 'Dashboard', <Grid size={22} />)}
        {navItem('/my-activity', 'My Activity', <Activity size={22} />)}
        {navItem('/profile', 'Profile', <User size={22} />)}
        {navItem('/settings', 'Settings', <Settings size={22} />)}
        {navItem('/analytics', 'Analytics', <BarChart2 size={22} />, user?.role === 'admin')}
        {navItem('/admin', 'Admin Panel', <Grid size={22} />, user?.role === 'admin')}
      </div>
    </aside>
  );
}
