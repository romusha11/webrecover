import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, ArrowLeft, Edit2, Trash2, Send, User } from 'lucide-react';

export default function ThreadDetail() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();

  // Get thread detail
  // NOTE: Replace mockThreads with fetch API in production
  const thread = mockThreads.find(t => t.id === threadId);
  if (!thread) return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 text-center max-w-md">
        <div className="text-xl font-black text-red-700 mb-4">Thread tidak ditemukan.</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold transition"
        >
          <ArrowLeft size={18} className="inline mr-2" /> Kembali
        </button>
      </div>
    </main>
  );

  // Replies
  // NOTE: Replace mockReplies with fetch API in production
  const [replies, setReplies] = useState(
    mockReplies.filter(r => r.threadId === thread.id)
  );
  const [replyContent, setReplyContent] = useState('');
  const [replyError, setReplyError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Dummy user login
  // NOTE: Replace mockUsers[0] with actual user context
  const user = mockUsers[0];

  // Reply submit
  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      setReplyError('Isi reply tidak boleh kosong.');
      return;
    }
    setReplies([
      ...replies,
      {
        id: Date.now().toString(),
        threadId: thread.id,
        author: user,
        content: replyContent,
        time: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' }),
      }
    ]);
    setReplyContent('');
    setSuccess('Reply berhasil dikirim!');
    setReplyError('');
  };

  // Edit reply
  const handleEditReply = (id: string) => {
    setEditingReplyId(id);
    const reply = replies.find(r => r.id === id);
    setEditingContent(reply?.content || '');
    setSuccess('');
    setReplyError('');
  };

  // Simpan edit reply
  const handleSaveEditReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent.trim()) {
      setReplyError('Reply tidak boleh kosong.');
      return;
    }
    setReplies(replies.map(r => r.id === editingReplyId ? { ...r, content: editingContent } : r));
    setEditingReplyId(null);
    setEditingContent('');
    setSuccess('Reply berhasil diubah!');
    setReplyError('');
  };

  // Hapus reply
  const handleDeleteReply = (id: string) => {
    setReplies(replies.filter(r => r.id !== id));
    setSuccess('Reply berhasil dihapus!');
    setReplyError('');
  };

  // Bookmark thread
  const [bookmarked, setBookmarked] = useState(false);
  const handleBookmark = () => setBookmarked(!bookmarked);

  // Share thread
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSuccess('Link thread berhasil disalin!');
  };

  // Edit/hapus thread (dummy, hanya author/admin)
  const isThreadOwner = user.username === thread.author.username || user.role === 'admin';
  const handleEditThread = () => {};
  const handleDeleteThread = () => {
    navigate('/forum');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-700 font-bold hover:underline"
        >
          <ArrowLeft size={18} /> Kembali ke forum
        </button>
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <div className="flex gap-3 items-center">
              <span
                className="px-3 py-1 rounded-full font-bold text-xs"
                style={{ backgroundColor: thread.category.color, color: '#fff' }}
              >
                {thread.category.name}
              </span>
              <span className="text-gray-400 text-xs">{thread.time}</span>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1
                  ${bookmarked ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-yellow-600'}
                `}
                aria-label="Bookmark thread"
                onClick={handleBookmark}
              >
                <Bookmark size={16} /> {bookmarked ? "Tersimpan" : "Bookmark"}
              </button>
              <button
                className="px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-blue-100 text-blue-700"
                aria-label="Share thread"
                onClick={handleShare}
              >
                <Share2 size={16} /> Share
              </button>
              {isThreadOwner && (
                <>
                  <button
                    className="px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-green-100 text-green-700"
                    aria-label="Edit thread"
                    onClick={handleEditThread}
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    className="px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-red-100 text-red-700"
                    aria-label="Delete thread"
                    onClick={handleDeleteThread}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 mb-2">{thread.title}</div>
          <div className="flex items-center gap-3 mb-2">
            <img src={thread.author.avatar} alt={thread.author.username} className="w-9 h-9 rounded-full border-2 border-blue-200" />
            <div>
              <div className="font-bold text-gray-700">{thread.author.username}</div>
              <div className="text-xs text-gray-400">Author</div>
            </div>
          </div>
          <div className="text-base text-gray-800 mt-3 whitespace-pre-line">{thread.content}</div>
        </div>
        <div className="mb-8">
          <div className="font-black text-lg text-blue-700 mb-2">Replies</div>
          <ul className="space-y-4">
            {replies.length > 0 ? replies.map(r => (
              <li key={r.id} className="bg-blue-50 rounded-xl p-4 border border-gray-200 flex flex-col sm:flex-row gap-4 items-start">
                <img src={r.author.avatar} alt={r.author.username} className="w-8 h-8 rounded-full border-2 border-blue-200" />
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="font-bold text-blue-700">{r.author.username}</span>
                    <span className="text-xs text-gray-400">{r.time}</span>
                  </div>
                  {editingReplyId === r.id ? (
                    <form onSubmit={handleSaveEditReply} className="flex flex-col gap-2 mt-2">
                      <textarea
                        value={editingContent}
                        onChange={e => setEditingContent(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold resize-none"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-bold transition">Simpan</button>
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-1 rounded-lg font-bold" onClick={() => setEditingReplyId(null)}>Batal</button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-sm text-gray-800 mt-1 whitespace-pre-line">{r.content}</div>
                  )}
                </div>
                {(user.username === r.author.username || user.role === 'admin') && editingReplyId !== r.id && (
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      className="text-green-600 hover:text-green-800 transition px-2 py-1 rounded font-bold text-xs"
                      aria-label="Edit reply"
                      onClick={() => handleEditReply(r.id)}
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition px-2 py-1 rounded font-bold text-xs"
                      aria-label="Delete reply"
                      onClick={() => handleDeleteReply(r.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </li>
            )) : (
              <div className="text-center text-gray-500 font-bold py-8">Belum ada reply.</div>
            )}
          </ul>
        </div>
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <form onSubmit={handleReply} className="flex flex-col gap-3">
            <label className="font-bold text-blue-700 flex gap-2 items-center mb-1">
              <User size={18} /> Balas Thread
            </label>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold resize-none"
              required
              placeholder="Tulis balasan kamu di sini..."
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition flex gap-2 items-center"
            >
              <Send size={18} /> Kirim Reply
            </button>
          </form>
          {replyError && <div className="text-red-600 mt-2 text-center font-bold">{replyError}</div>}
          {success && <div className="text-green-600 mt-2 text-center font-bold">{success}</div>}
        </div>
      </div>
    </main>
  );
}