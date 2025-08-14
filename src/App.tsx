import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ThreadCard from './components/ThreadCard';
import ThreadView from './components/ThreadView';
import CreateThreadModal from './components/CreateThreadModal';
import { mockCategories, mockThreads } from './data/mockData';
import { Thread } from './types/forum';

function App() {
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
      // Pinned threads first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then by update time
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
            {/* Header */}
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

            {/* Filter/Sort bar */}
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

            {/* Threads */}
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
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No threads found</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory 
                      ? 'There are no threads in this category yet. Be the first to start a discussion!'
                      : 'No threads match your current filters.'
                    }
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

      {/* Sidebar overlay for mobile */}
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

export default App;