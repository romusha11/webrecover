import React, { useState, useMemo } from 'react';
import ThreadCard from '../components/ThreadCard';
import ThreadView from '../components/ThreadView';
import CreateThreadModal from '../components/CreateThreadModal';
import { mockCategories, mockThreads } from '../data/mockData';
import { Thread } from '../types/forum';

export default function ForumHome() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
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

  return (
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
            : 'Diskusi dan partisipasi di semua topik'
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
        {selectedThread ? (
          <ThreadView thread={selectedThread} onBack={handleBackToThreads} />
        ) : sortedThreads.length > 0 ? (
          sortedThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onThreadClick={handleThreadClick}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No threads found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory
                ? 'Belum ada thread di kategori ini. Jadilah yang pertama!'
                : 'Tidak ada thread yang cocok dengan filter.'}
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
      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={mockCategories}
      />
    </div>
  );
}
