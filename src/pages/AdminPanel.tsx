import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockThreads, mockCategories } from '../data/mockData';
import { Navigate } from 'react-router-dom';
import { Trash2, Edit2, UserCheck, UserX, Lock, Pin } from 'lucide-react';

type AdminTab = 'users' | 'threads' | 'categories';

export default function AdminPanel() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" />;

  const [tab, setTab] = useState<AdminTab>('users');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [message, setMessage] = useState('');

  // Dummy delete/update logic
  const handleDelete = (type: AdminTab, id: string) => {
    setMessage(`Berhasil menghapus ${type.slice(0, -1)} ID: ${id}`);
    setEditId(null);
  };

  const handleEdit = (type: AdminTab, id: string, value: string) => {
    setMessage(`Berhasil update ${type.slice(0, -1)} ID: ${id} menjadi "${value}"`);
    setEditId(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-red-700 text-center">
          Admin Panel - Romusha
        </h2>
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
                ${tab === 'users' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('users')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
                ${tab === 'threads' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('threads')}
          >
            Threads
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition
                ${tab === 'categories' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('categories')}
          >
            Categories
          </button>
        </div>

        {message && (
          <div className="text-center text-sm mb-4 text-red-700 font-bold">{message}</div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <section>
            <h3 className="text-lg font-bold mb-4 text-red-700">Manajemen Pengguna</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-left rounded-lg overflow-hidden">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="py-2 px-3">Avatar</th>
                    <th className="py-2 px-3">Username</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.username} className="border-t">
                      <td className="py-2 px-3">
                        <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full" />
                      </td>
                      <td className="py-2 px-3 font-bold">{u.username}</td>
                      <td className="py-2 px-3">{u.email}</td>
                      <td className="py-2 px-3">{u.role}</td>
                      <td className="py-2 px-3">
                        {u.isActive ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                            <UserCheck size={14} /> Aktif
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                            <UserX size={14} /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          className="text-red-600 hover:text-red-800 transition px-2"
                          aria-label="Delete user"
                          onClick={() => handleDelete('users', u.username)}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 transition px-2"
                          aria-label="Edit user"
                          onClick={() => { setEditId(u.username); setEditValue(u.username); }}
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* Edit inline */}
                        {editId === u.username && (
                          <form
                            onSubmit={e => { e.preventDefault(); handleEdit('users', u.username, editValue); }}
                            className="inline-block ml-2"
                          >
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 font-bold mr-2"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-2 py-1 rounded font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold ml-1"
                              onClick={() => setEditId(null)}
                            >
                              Batal
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Threads Tab */}
        {tab === 'threads' && (
          <section>
            <h3 className="text-lg font-bold mb-4 text-red-700">Manajemen Thread</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-left rounded-lg overflow-hidden">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Author</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mockThreads.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="py-2 px-3 font-bold">{t.title}</td>
                      <td className="py-2 px-3 flex items-center gap-2">
                        <img src={t.author.avatar} alt={t.author.username} className="w-7 h-7 rounded-full" />
                        {t.author.username}
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-1 rounded-full font-semibold text-xs"
                          style={{
                            backgroundColor: `${t.category.color}20`,
                            color: t.category.color,
                          }}
                        >
                          {t.category.name}
                        </span>
                      </td>
                      <td className="py-2 px-3 flex gap-2 items-center">
                        {t.isPinned && (
                          <span className="bg-green-100 text-green-700 px-2 rounded-full text-xs font-bold flex items-center gap-1">
                            <Pin size={14} /> Pinned
                          </span>
                        )}
                        {t.isLocked && (
                          <span className="bg-gray-200 text-gray-700 px-2 rounded-full text-xs font-bold flex items-center gap-1">
                            <Lock size={14} /> Locked
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          className="text-red-600 hover:text-red-800 transition px-2"
                          aria-label="Delete thread"
                          onClick={() => handleDelete('threads', t.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 transition px-2"
                          aria-label="Edit thread"
                          onClick={() => { setEditId(t.id); setEditValue(t.title); }}
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* Edit inline */}
                        {editId === t.id && (
                          <form
                            onSubmit={e => { e.preventDefault(); handleEdit('threads', t.id, editValue); }}
                            className="inline-block ml-2"
                          >
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 font-bold mr-2"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-2 py-1 rounded font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold ml-1"
                              onClick={() => setEditId(null)}
                            >
                              Batal
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Categories Tab */}
        {tab === 'categories' && (
          <section>
            <h3 className="text-lg font-bold mb-4 text-red-700">Manajemen Kategori</h3>
            <div className="overflow-x-auto">
              <table className="w-full border text-left rounded-lg overflow-hidden">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Color</th>
                    <th className="py-2 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCategories.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 px-3 font-bold">{c.name}</td>
                      <td className="py-2 px-3">{c.description}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-1 rounded-full font-semibold text-xs"
                          style={{
                            backgroundColor: `${c.color}20`,
                            color: c.color,
                          }}
                        >
                          {c.color}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          className="text-red-600 hover:text-red-800 transition px-2"
                          aria-label="Delete category"
                          onClick={() => handleDelete('categories', c.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 transition px-2"
                          aria-label="Edit category"
                          onClick={() => { setEditId(c.id); setEditCategory(c.name); }}
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* Edit inline */}
                        {editId === c.id && (
                          <form
                            onSubmit={e => { e.preventDefault(); handleEdit('categories', c.id, editCategory); }}
                            className="inline-block ml-2"
                          >
                            <input
                              type="text"
                              value={editCategory}
                              onChange={e => setEditCategory(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 font-bold mr-2"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-2 py-1 rounded font-bold"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold ml-1"
                              onClick={() => setEditId(null)}
                            >
                              Batal
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
                              }
