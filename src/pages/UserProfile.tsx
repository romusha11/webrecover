import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Bookmark, UserPlus, UserMinus } from 'lucide-react';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  // Get user detail
  const user = mockUsers.find(u => u.username === username);
  if (!user) return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 text-center max-w-md">
        <div className="text-xl font-black text-red-700 mb-4">User tidak ditemukan.</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold transition"
        >
          <ArrowLeft size={18} className="inline mr-2" /> Kembali
        </button>
      </div>
    </main>
  );

  // Threads dibuat user ini
  const userThreads = mockThreads.filter(t => t.author.username === user.username);

  // Dummy: stats
  const stats = {
    threads: userThreads.length,
    replies: user.activityCount ?? 0,
    bookmarks: user.bookmarks?.length ?? 0,
  };

  // Dummy follow state (ganti dengan API jika sudah ready)
  const [isFollowed, setIsFollowed] = useState(false);
  const handleFollow = () => setIsFollowed(!isFollowed);

  // Dummy DM/message
  const handleMessage = () => {
    // Integrasi ke fitur message/DM
    alert(`Fitur DM ke ${user.username} belum tersedia.`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-700 font-bold hover:underline"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-6 flex-wrap">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
          />
          <div>
            <div className="text-2xl font-black text-blue-700">{user.username}</div>
            <div className="font-bold text-gray-700">{user.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              Bergabung: {new Date(user.joinDate ?? '2023-01-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {user.bio && (
              <div className="text-gray-600 mt-2 italic">{user.bio}</div>
            )}
            <div className="flex gap-2 mt-3">
              <button
                className={`px-4 py-1 rounded-lg font-bold transition flex items-center gap-1
                  ${isFollowed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}
                `}
                onClick={handleFollow}
                aria-label={isFollowed ? "Unfollow user" : "Follow user"}
              >
                {isFollowed ? <UserMinus size={16} /> : <UserPlus size={16} />}
                {isFollowed ? "Unfollow" : "Follow"}
              </button>
              <button
                className="px-4 py-1 rounded-lg font-bold transition flex items-center gap-1 bg-blue-100 text-blue-700"
                onClick={handleMessage}
                aria-label="Kirim pesan"
              >
                <MessageSquare size={16} /> DM
              </button>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-200">
            <MessageSquare size={24} className="text-blue-600 mb-1" />
            <div className="font-black text-lg text-blue-700">{stats.threads}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Threads</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center border border-purple-200">
            <MessageSquare size={24} className="text-purple-600 mb-1" />
            <div className="font-black text-lg text-purple-700">{stats.replies}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Replies</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center border border-yellow-200">
            <Bookmark size={24} className="text-yellow-600 mb-1" />
            <div className="font-black text-lg text-yellow-700">{stats.bookmarks}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Bookmarks</div>
          </div>
        </div>
        {/* List thread */}
        <div>
          <div className="font-black text-lg text-blue-700 mb-2">Threads oleh {user.username}</div>
          <ul className="space-y-3">
            {userThreads.length > 0 ? userThreads.map(t => (
              <li
                key={t.id}
                className="border-b pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-blue-50 transition"
                onClick={() => navigate(`/thread/${t.id}`)}
                tabIndex={0}
                aria-label={`Buka thread ${t.title}`}
              >
                <span className="font-black text-blue-700">{t.title}</span>
                <div className="flex gap-3 mt-2 sm:mt-0">
                  <span className="text-sm text-gray-500">({t.category.name})</span>
                  <span className="text-xs text-gray-400">Replies: {t.replyCount}</span>
                </div>
              </li>
            )) : (
              <div className="text-gray-500 font-bold py-8">Belum ada thread yang dibuat.</div>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
