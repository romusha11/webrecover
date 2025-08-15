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

  // Bookmarks ambil dari context user.bookmarks, bukan dari tag "bookmark"
  const myBookmarks: Thread[] = user.bookmarks
    ? mockThreads.filter(t => user.bookmarks?.includes(t.id))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">My Activity - Romusha</h2>
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'threads' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('threads')}
          >
            My Threads
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('posts')}
          >
            My Posts
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'bookmarks' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('bookmarks')}
          >
            My Bookmarks
          </button>
        </div>

        {tab === 'threads' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Threads Saya</h3>
            <ul className="space-y-2">
              {myThreads.length > 0 ? (
                myThreads.map(t => (
                  <li key={t.id} className="border-b pb-2 flex justify-between items-center">
                    <span>
                      <span className="font-bold text-blue-700">{t.title}</span>
                      <span className="text-sm text-gray-500 ml-2">({t.category.name})</span>
                    </span>
                    <span className="text-xs text-gray-400">Replies: {t.replyCount}</span>
                  </li>
                ))
              ) : (
                <div className="text-gray-500">Belum ada thread yang dibuat.</div>
              )}
            </ul>
          </div>
        )}

        {tab === 'posts' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Post/Reply Saya</h3>
            <ul className="space-y-2">
              {myPosts.length > 0 ? (
                myPosts.map(p => (
                  <li key={p.id} className="border-b pb-2">
                    <span className="font-bold text-blue-700">{p.content.substring(0, 50)}...</span>
                    <span className="text-sm text-gray-500 ml-2">(di thread ID: {p.threadId})</span>
                  </li>
                ))
              ) : (
                <div className="text-gray-500">Belum ada post/reply yang dibuat.</div>
              )}
            </ul>
          </div>
        )}

        {tab === 'bookmarks' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bookmarks Saya</h3>
            <ul className="space-y-2">
              {myBookmarks.length > 0 ? (
                myBookmarks.map(t => (
                  <li key={t.id} className="border-b pb-2 flex justify-between items-center">
                    <span>
                      <span className="font-bold text-blue-700">{t.title}</span>
                      <span className="text-sm text-gray-500 ml-2">({t.category.name})</span>
                    </span>
                    <span className="text-xs text-gray-400">Replies: {t.replyCount}</span>
                  </li>
                ))
              ) : (
                <div className="text-gray-500">Belum ada thread yang dibookmark.</div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}