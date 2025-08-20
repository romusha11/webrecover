import React, { useState, useEffect, useMemo } from 'react';
import ThreadCard from '../components/ThreadCard';
import ThreadView from '../components/ThreadView';
import CreateThreadModal from '../components/CreateThreadModal';
import { Thread } from '../types/forum';
import EditThreadModal from '../components/EditThreadModal';
import { useAuth } from '../context/AuthContext';

interface CategoryNode {
  id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
  children?: CategoryNode[];
}

interface ForumHomeProps {
  selectedCategory: string | null;
  onCategorySelect: (cat: string | null) => void;
}

function flattenCategories(tree: CategoryNode[]): CategoryNode[] {
  let result: CategoryNode[] = [];
  for (const cat of tree) {
    if (cat.children && cat.children.length) {
      result = result.concat(flattenCategories(cat.children));
    } else {
      result.push(cat);
    }
  }
  return result;
}

export default function ForumHome({ selectedCategory, onCategorySelect }: ForumHomeProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [errorThreads, setErrorThreads] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editThread, setEditThread] = useState<Thread | null>(null);
  const { user } = useAuth();

  // Flatten subkategori untuk dropdown filter
  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);

  // Fetch kategori tree dari backend
  useEffect(() => {
    setLoadingCategories(true);
    fetch('http://localhost:3000/categories')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil kategori');
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setLoadingCategories(false);
      })
      .catch(() => {
        setLoadingCategories(false);
      });
  }, []);

  // Fetch threads dari backend
  useEffect(() => {
    setLoadingThreads(true);
    setErrorThreads('');
    let url = 'http://localhost:3000/threads';
    if (selectedCategory) url += `?categoryId=${selectedCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (!json.success) throw new Error(json.error || 'Gagal mengambil thread');
        setThreads(Array.isArray(json.data) ? json.data : []);
        setLoadingThreads(false);
      })
      .catch(err => {
        setErrorThreads(err.message || 'Gagal mengambil data thread');
        setLoadingThreads(false);
      });
  }, [isCreateModalOpen, selectedCategory]);

  // Hapus thread
  const handleDeleteThread = async (threadId: string) => {
    if (!user || !user.id) {
      alert("Harus login untuk hapus thread.");
      return;
    }
    if (!window.confirm('Yakin ingin menghapus thread ini?')) return;
    try {
      const res = await fetch(`http://localhost:3000/threads/${threadId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: { id: user.id, role: user.role } })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gagal hapus thread');
      setThreads(threads.filter(t => t.id !== threadId));
    } catch (err: any) {
      alert(err.message || 'Gagal hapus thread');
    }
  };

  // Simpan edit thread
  const handleSaveEditThread = async (newData: Partial<Thread>) => {
    if (!editThread || !user) return;
    try {
      const res = await fetch(`http://localhost:3000/threads/${editThread.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newData,
          author: { id: user.id, role: user.role }
        })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gagal edit thread');
      setEditThread(null);
      setThreads(threads.map(t => t.id === editThread.id ? { ...t, ...json.data } : t));
    } catch (err: any) {
      alert(err.message || 'Gagal edit thread');
    }
  };

  const handleThreadClick = (thread: Thread) => {
    setSelectedThread(thread);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToThreads = () => {
    setSelectedThread(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-2 sm:px-4 py-4 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold mb-2 text-[#181818] dark:text-white">
          {selectedCategory
            ? flatCategories.find(c => c.id === selectedCategory)?.name
            : 'All Threads'
          }
        </h2>
        <p className="text-[#4a74ff]">
          {selectedCategory
            ? flatCategories.find(c => c.id === selectedCategory)?.description
            : 'Diskusi dan partisipasi semua topik'
          }
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6 p-4 rounded-lg border border-gray-200 bg-[#181818] border-[#222]">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {loadingCategories ? (
            <span className="text-sm text-[#4a74ff]">Loading categories...</span>
          ) : (
            <select
              className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-[#181818] text-[#4a74ff] border-[#282828] transition w-[180px]"
              onChange={e => onCategorySelect(e.target.value || null)}
              value={selectedCategory || ""}
              aria-label="Filter kategori"
            >
              <option value="">All Subcategories</option>
              {flatCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
          <span className="text-sm text-[#4a74ff]">{threads.length} threads</span>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg font-semibold text-sm border border-[#282828] bg-[#181818] text-white hover:bg-[#4a74ff] transition"
        >
          New Thread
        </button>
      </div>
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
        ) : threads.length > 0 ? (
          threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onThreadClick={handleThreadClick}
              onEditThread={setEditThread}
              onDeleteThread={handleDeleteThread}
            />
          ))
        ) : (
          <div className="text-center py-12 rounded-lg border border-gray-200 bg-[#181818] border-[#222]">
            <h3 className="text-lg font-semibold mb-2 text-white">No threads found</h3>
            <p className="text-[#4a74ff] mb-4">
              {selectedCategory
                ? 'Belum ada thread di subkategori ini. Jadilah yang pertama!'
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
      <CreateThreadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={flatCategories}
      />
      {editThread && (
        <EditThreadModal
          thread={editThread}
          categories={flatCategories}
          onSave={handleSaveEditThread}
          onClose={() => setEditThread(null)}
        />
      )}
    </main>
  );
}