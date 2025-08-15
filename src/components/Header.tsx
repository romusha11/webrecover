import React, { useState } from 'react';
import { Search, Bell, Menu, Plus, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  onCreateThread: () => void;
}

const defaultAvatar = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&crop=face";
const ADMIN_NAME = "BlackQuill";

export default function Header({ onMenuToggle, onCreateThread }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const avatar = user?.avatar || defaultAvatar;
  const isAdmin = user?.role === "admin" && user?.name === ADMIN_NAME;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };
  const handleProfile = () => {
    navigate('/profile');
    setUserMenuOpen(false);
  };
  const handleDashboard = () => {
    navigate('/dashboard');
    setUserMenuOpen(false);
  };
  const handleActivity = () => {
    navigate('/my-activity');
    setUserMenuOpen(false);
  };
  const handleAdminPanel = () => {
    navigate('/admin');
    setUserMenuOpen(false);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic if needed
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block group-hover:text-blue-700 transition-colors">
                Romusha
              </h1>
            </Link>
          </div>
          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search threads, users, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </form>
          </div>
          {/* Right */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 font-semibold hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={onCreateThread}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New Thread</span>
                </button>
                <Link
                  to="/notifications"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Link>
                {/* Avatar User + Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                  >
                    <img
                      src={avatar}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                    />
                    <span
                      className={
                        isAdmin
                          ? "hidden sm:inline font-bold text-red-600 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] blur-[0.5px] animate-pulse"
                          : "hidden sm:inline font-medium text-gray-900"
                      }
                      style={isAdmin ? { textShadow: "0 0 10px #ff0000,0 0 20px #ff0000,0 0 40px #f00" } : {}}
                    >
                      {user.name}
                    </span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        onClick={handleProfile}
                      >
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        onClick={handleDashboard}
                      >
                        Dashboard
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        onClick={handleActivity}
                      >
                        My Activity
                      </button>
                      {isAdmin && (
                        <button
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          onClick={handleAdminPanel}
                        >
                          Admin Panel
                        </button>
                      )}
                      <button
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}