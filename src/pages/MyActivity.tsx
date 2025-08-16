import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { mockThreads, mockReplies } from '../data/mockData';
import { Thread, Reply } from '../types/forum';

export default function MyActivity() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const [tab, setTab] = useState<'threads' | 'posts' | 'bookmarks'>('threads');

  // Threads dibuat oleh user
  const myThreads = mockThreads.filter(t => t.author.username === user.name);

  // Posts/replies dibuat oleh user
  const myPosts: Reply[] = mockReplies
    ? mockReplies.filter(r => r.author.username === user.name)
    : [];

  // Bookmarks ambil dari context user.bookmarks
  const myBookmarks: Thread[] = user.bookmarks
    ? mockThreads.filter(t => user.bookmarks?.includes(t.id))
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-blue-700 text-center">My Activity - Romusha</h2>
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
              ${tab === 'threads' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
            `}
            onClick={() => setTab('threads')}
          >
            My Threads
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
              ${tab === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
            `}
            onClick={() => setTab('posts')}
          >
            My Posts
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
              ${tab === 'bookmarks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
            `}
            onClick={() => setTab('bookmarks')}
          >
            My Bookmarks
          </button>
        </div>

        {/* Threads */}
        {tab === 'threads' && (
          <section>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Threads Saya</h3>
            <ul className="space-y-2">
              {myThreads.length > 0 ? (
                myThreads.map(t => (
                  <li key={t.id} className="border-b pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-black text-blue-700">{t.title}</span>
                    <div className="flex gap-3 mt-2 sm:mt-0">
                      <span className="text-sm text-gray-500">({t.category.name})</span>
                      <span className="text-xs text-gray-400">Replies: {t.replyCount}</span>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-gray-500 font-bold">Belum ada thread yang dibuat.</div>
              )}
            </ul>
          </section>
        )}
        {/* Posts/Replies */}
        {tab === 'posts' && (
          <section>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Post/Reply Saya</h3>
            <ul className="space-y-2">
              {myPosts.length > 0 ? (
                myPosts.map(p => (
                  <li key={p.id} className="border-b pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-bold text-blue-700">{p.content.substring(0, 50)}...</span>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">(di thread ID: {p.threadId})</span>
                  </li>
                ))
              ) : (
                <div className="text-gray-500 font-bold">Belum ada post/reply yang dibuat.</div>
              )}
            </ul>
          </section>
        )}
        {/* Bookmarks */}
        {tab === 'bookmarks' && (
          <section>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Bookmarks Saya</h3>
            <ul className="space-y-2">
              {myBookmarks.length > 0 ? (
                myBookmarks.map(t => (
                  <li key={t.id} className="border-b pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-black text-blue-700">{t.title}</span>
                    <div className="flex gap-3 mt-2 sm:mt-0">
                      <span className="text-sm text-gray-500">({t.category.name})</span>
                      <span className="text-xs text-gray-400">Replies: {t.replyCount}</span>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-gray-500 font-bold">Belum ada thread yang dibookmark.</div>
              )}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
