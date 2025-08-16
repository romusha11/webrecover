import React, { useState } from 'react';
import { mockCategories } from '../data/mockData';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState('#4a74ff');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal open: edit atau create
  const handleOpenModal = (cat?: typeof categories[0]) => {
    setShowModal(true);
    if (cat) {
      setEditId(cat.id);
      setFormName(cat.name);
      setFormDesc(cat.description);
      setFormColor(cat.color);
    } else {
      setEditId(null);
      setFormName('');
      setFormDesc('');
      setFormColor('#4a74ff');
    }
    setError('');
    setSuccess('');
  };

  // Simulasi tambah/edit kategori
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDesc.trim()) {
      setError('Nama & Deskripsi wajib diisi.');
      return;
    }
    if (editId) {
      setCategories(categories.map(c =>
        c.id === editId ? { ...c, name: formName, description: formDesc, color: formColor } : c
      ));
      setSuccess('Kategori berhasil diperbarui.');
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: formName,
          description: formDesc,
          color: formColor,
          icon: 'Tag',
          threadCount: 0,
        },
      ]);
      setSuccess('Kategori berhasil dibuat.');
    }
    setShowModal(false);
  };

  // Simulasi hapus
  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setSuccess('Kategori berhasil dihapus.');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-blue-700">Kategori Forum</h2>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition"
          >
            <Plus size={20} /> Buat Kategori
          </button>
        </div>
        {success && (
          <div className="text-center text-sm mb-4 text-green-700 font-bold">{success}</div>
        )}
        <div className="space-y-4">
          {categories.length > 0 ? categories.map(cat => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-[#181818] hover:bg-[#232323] transition cursor-pointer"
              tabIndex={0}
              aria-label={`Kategori ${cat.name}`}
              style={{ boxShadow: '0 2px 8px -2px #0002' }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}22` }}
                >
                  <Tag size={28} style={{ color: cat.color }} />
                </span>
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="text-lg font-black text-white">{cat.name}</span>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold text-xs"
                      style={{ backgroundColor: cat.color, color: '#fff' }}
                    >
                      {cat.threadCount} thread
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{cat.description}</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  className="text-blue-500 hover:text-blue-700 transition px-2"
                  aria-label="Edit kategori"
                  onClick={e => { e.stopPropagation(); handleOpenModal(cat); }}
                >
                  <Edit2 size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition px-2"
                  aria-label="Delete kategori"
                  onClick={e => { e.stopPropagation(); handleDelete(cat.id); }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-500 font-bold py-8">Belum ada kategori.</div>
          )}
        </div>

        {/* Modal Buat/Edit Kategori */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 border border-gray-200 flex flex-col gap-4"
            >
              <h3 className="text-xl font-black mb-2 text-blue-700">
                {editId ? 'Edit Kategori' : 'Buat Kategori'}
              </h3>
              <div>
                <label className="block text-sm font-bold mb-1">Nama *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Deskripsi *</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Warna Badge</label>
                <input
                  type="color"
                  value={formColor}
                  onChange={e => setFormColor(e.target.value)}
                  className="w-12 h-8 border-2 border-gray-300 rounded-lg"
                />
              </div>
              {error && <div className="text-red-600 mb-2 text-center font-bold">{error}</div>}
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-blue-700 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition"
                >
                  {editId ? 'Simpan Perubahan' : 'Buat Kategori'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
                                                  }
