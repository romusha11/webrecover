import React, { useState, useEffect } from 'react';
import { mockThreads, mockCategories, mockUsers } from '../data/mockData';
import { Search as SearchIcon, User, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ResultType = 'thread' | 'category' | 'user';

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  desc?: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<ResultType>('thread');
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Simulasi pencarian di seluruh data (thread, kategori, user)
    setTimeout(() => {
      let found: SearchResult[] = [];

      if (tab === 'thread') {
        found = mockThreads
          .filter(t =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.content.toLowerCase().includes(query.toLowerCase())
          )
          .map(t => ({
            type: 'thread',
            id: t.id,
            title: t.title,
            desc: t.content.substring(0, 70) + (t.content.length > 70 ? '...' : ''),
            extra: t.category.name,
            color: t.category.color,
          }));
      }
      if (tab === 'category') {
        found = mockCategories
          .filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase())
          )
          .map(c => ({
            type: 'category',
            id: c.id,
            title: c.name,
            desc: c.description,
            extra: `${c.threadCount} thread`,
            color: c.color,
          }));
      }
      if (tab === 'user') {
        found = mockUsers
          .filter(u =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.name.toLowerCase().includes(query.toLowerCase())
          )
          .map(u => ({
            type: 'user',
            id: u.username,
            title: u.username,
            desc: u.name,
            avatar: u.avatar,
            extra: u.email,
          }));
      }

      setResults(found);
      setLoading(false);
    }, 400);
  }, [query, tab]);

  // Navigasi ke detail sesuai hasil
  const handleResultClick = (res: SearchResult) => {
    if (res.type === 'thread') {
      navigate(`/thread/${res.id}`);
    }
    if (res.type === 'category') {
      navigate(`/categories`);
    }
    if (res.type === 'user') {
      navigate(`/profile/${res.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-blue-700 text-center">Global Search - Romusha</h2>
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
                ${tab === 'thread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('thread')}
          >
            Threads
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
                ${tab === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('category')}
          >
            Categories
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
                ${tab === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('user')}
          >
            Users
          </button>
        </div>
        <form
          className="flex items-center gap-3 mb-6"
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder={`Cari ${tab === 'thread' ? 'thread' : tab === 'category' ? 'kategori' : 'user'}...`}
            aria-label="Pencarian global"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition"
            aria-label="Cari"
          >
            <SearchIcon size={22} />
          </button>
        </form>
        <div>
          {loading ? (
            <div className="text-center text-blue-700 font-bold py-6">Mencari...</div>
          ) : results.length > 0 ? (
            <ul className="space-y-3">
              {results.map(res => (
                <li
                  key={res.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                  tabIndex={0}
                  aria-label={`Buka detail ${res.type}`}
                  onClick={() => handleResultClick(res)}
                >
                  {res.type === 'user' && (
                    <img src={res.avatar} alt={res.title} className="w-10 h-10 rounded-full border-2 border-blue-200" />
                  )}
                  {res.type === 'category' && (
                    <span
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${res.color}22` }}
                    >
                      <Tag size={24} style={{ color: res.color }} />
                    </span>
                  )}
                  {res.type === 'thread' && (
                    <span
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${res.color}22` }}
                    >
                      <SearchIcon size={24} style={{ color: res.color }} />
                    </span>
                  )}
                  <div className="flex-1">
                    <div className="font-black text-blue-700 text-lg">{res.title}</div>
                    <div className="text-sm text-gray-500">{res.desc}</div>
                  </div>
                  <span className="bg-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs font-bold">{res.extra}</span>
                </li>
              ))}
            </ul>
          ) : query.trim() ? (
            <div className="text-center text-gray-500 font-bold py-6">Tidak ada hasil ditemukan.</div>
          ) : (
            <div className="text-center text-gray-400 py-6">Masukkan kata kunci untuk mencari...</div>
          )}
        </div>
      </div>
    </main>
  );
}
