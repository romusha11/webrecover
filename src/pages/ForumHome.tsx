import React, { useState, useMemo } from 'react';
import ThreadCard from '../components/ThreadCard';
import ThreadView from '../components/ThreadView';
import CreateThreadModal from '../components/CreateThreadModal';
import { mockCategories, mockThreads } from '../data/mockData';
import { Thread } from '../types/forum';

interface ForumHomeProps {
  selectedCategory: string | null;
  onCategorySelect: (cat: string | null) => void;
}

export default function ForumHome({ selectedCategory, onCategorySelect }: ForumHomeProps) {
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#fff' }}>
          {selectedCategory
            ? mockCategories.find(c => c.id === selectedCategory)?.name
            : 'All Threads'
          }
        </h2>
        <p style={{ color: '#4a74ff' }}>
          {selectedCategory
            ? mockCategories.find(c => c.id === selectedCategory)?.description
            : 'Diskusi dan partisipasi di semua topik'
          }
        </p>
      </div>
      <div className="flex items-center justify-between mb-6 p-4 rounded-lg border border-gray-200" style={{ background: '#181818', borderColor: '#222' }}>
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            style={{ background: '#181818', color: '#4a74ff', borderColor: '#282828' }}
            onChange={e => onCategorySelect(e.target.value || null)}
            value={selectedCategory || ""}
          >
            <option value="">All Categories</option>
            {mockCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 text-sm" style={{ color: '#4a74ff' }}>
            <span>Showing {sortedThreads.length} threads</span>
          </div>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          style={{ background: '#181818', color: '#fff', border: '1px solid #282828' }}
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
          <div className="text-center py-12 rounded-lg border border-gray-200" style={{ background: '#181818', borderColor: '#222' }}>
            <h3 className="text-lg font-medium mb-2" style={{ color: '#fff' }}>No threads found</h3>
            <p style={{ color: '#4a74ff' }} className="mb-4">
              {selectedCategory
                ? 'Belum ada thread di kategori ini. Jadilah yang pertama!'
                : 'Tidak ada thread yang cocok dengan filter.'}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{ background: '#181818', color: '#fff', border: '1px solid #282828' }}
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
