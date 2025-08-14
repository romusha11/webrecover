import React from 'react';
import { MessageSquare, Code, Smartphone, Palette, Briefcase, Home, TrendingUp, Users, LayoutDashboard } from 'lucide-react';
import { Category } from '../types/forum';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  isOpen: boolean;
}

const iconMap = {
  MessageSquare,
  Code,
  Smartphone,
  Palette,
  Briefcase
};

export default function Sidebar({ categories, selectedCategory, onCategorySelect, isOpen }: SidebarProps) {
  const { user } = useAuth();

  return (
    <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="h-full overflow-y-auto p-4">
        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {/* Dashboard button (only if user login) */}
          {user && (
            <Link
              to="/dashboard"
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-blue-700 bg-blue-100 border-blue-200 font-medium"
              style={{ marginBottom: "8px" }}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              selectedCategory === null 
                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            <span className="font-medium">All Threads</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors">
            <TrendingUp size={20} />
            <span className="font-medium">Trending</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors">
            <Users size={20} />
            <span className="font-medium">Following</span>
          </button>
        </nav>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-gray-100 text-gray-900 border-l-4' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{
                    borderLeftColor: selectedCategory === category.id ? category.color : 'transparent'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent size={16} style={{ color: category.color }} />
                    </div>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.threadCount} threads</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Community Stats</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total Threads</span>
              <span className="font-medium">1,245</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span>Online Now</span>
              <span className="font-medium text-green-600">12</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
                      }
