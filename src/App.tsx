import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ThreadCard from './components/ThreadCard';
import ThreadView from './components/ThreadView';
import CreateThreadModal from './components/CreateThreadModal';
import { mockCategories, mockThreads } from './data/mockData';
import { Thread } from './types/forum';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import MyActivity from './pages/MyActivity';
import { useAuth } from './context/AuthContext';

// Proteksi route dashboard & profile
function ProtectedRoute({ redirect = "/login" }) {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={redirect} />;
}

function ForumHome() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredThreads = useMemo(() => {
    if (!selectedCategory) return mockThreads;
    return mockThreads.filter(thread => thread.category.id === selectedCategory);
  }, [selectedCategory]);

  const sortedThreads = useMemo(() => {
    return [...filteredThreads].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filteredThreads]);

  const handleThreadClick = (thread: Thread) => {
    setSelectedThread(thread);
  };

  const handleBackToThreads = () => {
    setSelectedThread(null);
  };

  if (selectedThread) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onCreateThread={() => setIsCreateModalOpen(true)}
        />
        <div className="flex">
          <Sidebar
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            isOpen={isSidebarOpen}
          />
          <main className="flex-1 p-6">
            <ThreadView
              thread={selectedThread}
              onBack={handleBackToThreads}
            />
          </main>
        </div>
        <CreateThreadModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={mockCategories}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onCreateThread={() => setIsCreateModalOpen(true)}
      />
      <div className="flex">
        <Sidebar
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isOpen={isSidebarOpen}
        />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory
                  ? mockCategories.find(c => c.id === selectedCategory)?.name
                  : 'All Threads'
                }
              </h2>
              <p className="text-gray-600">
                {selectedCategory
                  ? mockCategories.find(c => c.id === selectedCategory)?.description
                  : 'Discover and participate in discussions across all topics'
                }
              </p>
            </div>
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option>Latest Activity</option>
                  <option>Most Votes</option>
                  <option>Most Replies</option>
                  <option>Newest</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Showing {sortedThreads.length} threads</span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                New Thread
              </button>
            </div>
            <div className="space-y-4">
              {sortedThreads.length > 0 ? (
                sortedThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    onThreadClick={handleThreadClick}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="text-gray-500 mb-4">
                    {/* SVG valid untuk React */}
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                      <line x1="8" y1="12" x2="8.01" y2="12" stroke="currentColor" strokeWidth={2} />
                      <line x1="12" y1="12" x2="12.01" y2="12" stroke="currentColor" strokeWidth={2} />
                      <line x1="16" y1="12" x2="16.01" y2="12" stroke="currentColor" strokeWidth={2} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No threads found</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory
                      ? 'There are no threads in this category yet. Be the first to start a discussion!'
                      : 'No threads match your current filters.'}
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create First Thread
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={mockCategories}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/my-activity" element={<MyActivity />} />
        </Route>
        <Route path="/" element={<ForumHome />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
