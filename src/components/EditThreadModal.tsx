import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Thread } from '../types/forum';

interface CategoryNode {
  id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
}

interface EditThreadModalProps {
  thread: Thread;
  categories: CategoryNode[];
  onSave: (data: Partial<Thread>) => void;
  onClose: () => void;
}

export default function EditThreadModal({ thread, categories, onSave, onClose }: EditThreadModalProps) {
  const [title, setTitle] = useState(thread.title);
  const [content, setContent] = useState(thread.content);
  const [tags, setTags] = useState<string[]>(thread.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError("Title dan content wajib diisi.");
      return;
    }
    setLoading(true);
    onSave({
      title: title.trim(),
      content: content.trim(),
      tags
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col border border-gray-200">
        {/* Header modal */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-extrabold text-gray-900">Edit Thread</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Tutup modal"
          >
            <X size={22} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold"
              required
              autoFocus
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold resize-none"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">Markdown supported</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tags (opsional)
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition"
                      aria-label="Remove tag"
                      disabled={loading}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length < 5 ? "Tambah tag dan tekan Enter" : "Max 5 tags"}
                disabled={tags.length >= 5 || loading}
                className="w-full outline-none font-semibold"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Tekan Enter untuk tambah tag (max 5)</p>
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-blue-700 font-semibold transition"
              aria-label="Batal"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-bold transition"
              aria-label="Simpan Perubahan"
            >
              {loading ? 'Saving...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
