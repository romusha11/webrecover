import React, { useState } from 'react';
import { Search, Bell, User, Menu, Plus } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  onCreateThread: () => void;
}

export default function Header({ onMenuToggle, onCreateThread }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-purple-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EW</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Ethereum Work</h1>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
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
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCreateThread}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Thread</span>
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-2">
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&crop=face"
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:inline font-medium text-gray-900">TechGuru</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
