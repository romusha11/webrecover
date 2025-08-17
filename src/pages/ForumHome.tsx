import React, { useState, useEffect, useMemo } from 'react';
import ThreadCard from '../components/ThreadCard';
import ThreadView from '../components/ThreadView';
import CreateThreadModal from '../components/CreateThreadModal';
import { Thread } from '../types/forum';

interface Category {
  id: string;
  name: string;
  description: string;
  color?: string;
}

interface ForumHomeProps {
  selectedCategory: string | null;
  onCategorySelect: (cat: string | null) => void;
}

export default function ForumHome({ selectedCategory, onCategorySelect }: ForumHomeProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [errorThreads, setErrorThreads] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch threads from backend API
  useEffect(() => {
    setLoadingThreads(true);
    setErrorThreads('');
    fetch('http://localhost:3000/threads')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data thread');
        return res.json();
      })
      .then(data => {
        setThreads(Array.isArray(data) ? data : []);
        setLoadingThreads(false);
      })
      .catch(err => {
        setErrorThreads('Gagal mengambil data thread');
        setLoadingThreads(false);
      });
  }, [isCreateModalOpen]); // refresh threads when modal close (after creation)

  // Fetch categories (bisa dari backend jika sudah ada, di sini hardcode agar tidak error)
  useEffect(() => {
    // TODO: Ganti ke fetch('http://localhost:3000/categories') jika sudah ada endpoint categories
    setCategories([
      { id: "c1", name: "General", description: "Diskusi umum dan pengumuman.", color: "#4a74ff" },
      { id: "c2", name: "Blockchain", description: "Diskusi seputar teknologi blockchain.", color: "#ff9800" },
      { id: "c3", name: "AI & Machine Learning", description: "AI, ML, dan Data Science.", color: "#8a6cff" }
    ]);
    setLoadingCategories(false);
  }, []);

  // Filter threads by selected category
  const filteredThreads = useMemo(() => {
    if (!selectedCategory) return threads;
    return threads.filter(thread => thread?.category?.id === selectedCategory);
  }, [threads, selectedCategory]);

  // Sort: pinned first, then terbaru
  const sortedThreads = useMemo(() => {
    return [...filteredThreads].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aUpdate = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
      const bUpdate = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
      return bUpdate - aUpdate;
    });
  }, [filteredThreads]);

  const handleThreadClick = (thread: Thread) => {
    setSelectedThread(thread);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToThreads = () => {
    setSelectedThread(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      {/* Header: Kategori & Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold mb-2 text-[#181818] dark:text-white">
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.name
            : 'All Threads'
          }
        </h2>
        <p className="text-[#4a74ff]">
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.description
            : 'Diskusi dan partisipasi semua topik'
          }
        </p>
      </div>
      {/* Filter & New Thread */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6 p-4 rounded-lg border border-gray-200 bg-[#181818] border-[#222]">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {loadingCategories ? (
            <span className="text-sm text-[#4a74ff]">Loading categories...</span>
          ) : (
            <select
              className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[#181818] text-[#4a74ff] border-[#282828] transition w-[160px]"
              onChange={e => onCategorySelect(e.target.value || null)}
              value={selectedCategory || ""}
              aria-label="Filter kategori"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
          <span className="text-sm text-[#4a74ff]">{sortedThreads.length} threads</span>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg font-semibold text-sm border border-[#282828] bg-[#181818] text-white hover:bg-[#4a74ff] transition"
        >
          New Thread
        </button>
      </div>
      {/* List Thread / Thread View */}
      <section className="space-y-4">
        {selectedThread ? (
          <ThreadView thread={selectedThread} onBack={handleBackToThreads} />
        ) : loadingThreads ? (
          <div className="text-center py-12">
            <span className="text-[#4a74ff] text-lg font-medium">Loading threads...</span>
          </div>
        ) : errorThreads ? (
          <div className="text-center py-12 rounded-lg border border-gray-200 bg-[#181818] border-[#222]">
            <h3 className="text-lg font-semibold mb-2 text-white">Error</h3>
            <p className="text-[#4a74ff] mb-4">{errorThreads}</p>
          </div>
        ) : sortedThreads.length > 0 ? (
          sortedThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onThreadClick={handleThreadClick}
            />
          ))
        ) : (
          <div className="text-center py-12 rounded-lg border border-gray-200 bg-[#181818] border-[#222]">
            <h3 className="text-lg font-semibold mb-2 text-white">No threads found</h3>
            <p className="text-[#4a74ff] mb-4">
              {selectedCategory
                ? 'Belum ada thread di kategori ini. Jadilah yang pertama!'
                : 'Tidak ada thread yang cocok dengan filter.'}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-2 rounded-lg font-semibold text-white border border-[#282828] bg-[#181818] hover:bg-[#4a74ff] transition"
            >
              Create First Thread
            </button>
          </div>
        )}
      </section>
      {/* Modal Create Thread */}
      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
      />
    </main>
  );
} 
