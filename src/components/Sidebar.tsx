import React from 'react';
import { LayoutDashboard, Home, TrendingUp, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockCategories } from '../data/mockData';

// Helper: get icon component from lucide-react by name string
const lucideIcons: Record<string, React.ElementType> = {
  MessageSquare: Home,
  Code: LayoutDashboard,
  Smartphone: Users,
  Palette: TrendingUp,
  Briefcase: LayoutDashboard,
};

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
      className={`fixed md:static inset-y-0 left-0 z-40 w-72 md:w-64 transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}
      style={{ 
        height: '100vh', 
        background: 'linear-gradient(to bottom, #111 60%, #1e293b 100%)', 
        borderRight: '1px solid #191919',
        boxShadow: '2px 0 6px -2px #0005'
      }}
      aria-label="Sidebar navigasi utama"
    >
      <div className="h-full overflow-y-auto p-4 flex flex-col">
        <nav className="space-y-2 mb-8">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition
              ${location.pathname === "/dashboard" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-[#4a74ff]'}
            `}
            onClick={onCloseSidebar}
            aria-label="Dashboard"
          >
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => { onCategorySelect(null); onCloseSidebar(); }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold w-full text-left transition
              ${selectedCategory === null ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-[#4a74ff]'}
            `}
            aria-label="Semua Thread"
          >
            <Home size={22} />
            <span>All Threads</span>
          </button>
          <Link
            to="/my-activity"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition
              ${location.pathname === "/my-activity" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-[#4a74ff]'}
            `}
            onClick={onCloseSidebar}
            aria-label="Aktivitas Saya"
          >
            <TrendingUp size={22} />
            <span>Activity</span>
          </Link>
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition
              ${location.pathname === "/profile" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-[#4a74ff]'}
            `}
            onClick={onCloseSidebar}
            aria-label="Profil"
          >
            <Users size={22} />
            <span>Profile</span>
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold
                ${location.pathname === "/admin" ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100 text-[#ff5555]'}
              `}
              onClick={onCloseSidebar}
              aria-label="Admin Panel"
            >
              <LayoutDashboard size={22} />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white">Categories</h3>
          <div className="space-y-1">
            {mockCategories.map(c => {
              // Icon dynamic by string name
              const IconComp = lucideIcons[c.icon] || Home;
              return (
                <button
                  key={c.id}
                  onClick={() => { onCategorySelect(c.id); onCloseSidebar(); }}
                  className={`flex items-center px-3 py-2 rounded-lg w-full text-left font-medium transition
                    ${selectedCategory === c.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-[#4a74ff]'}
                  `}
                  aria-label={`Kategori ${c.name}`}
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center mr-2" style={{ backgroundColor: '#181818' }}>
                    <IconComp size={20} />
                  </span>
                  <span className="">{c.name}</span>
                  <span className="ml-auto text-xs text-white">{c.threadCount} threads</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onCloseSidebar}
          className="md:hidden mt-auto mb-2 px-3 py-2 w-full rounded-lg text-[#4a74ff] font-semibold border border-[#282828] hover:bg-[#181818] transition"
          aria-label="Tutup sidebar"
        >
          Tutup Menu
        </button>
      </div>
    </aside>
  );
}
