import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const defaultAvatar = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&crop=face";

export default function Profile() {
  const { user, login } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Simulasi join date
  const joinDate = "2023-01-15";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Nama & Email wajib diisi.");
      setSuccess('');
      return;
    }
    login({ name, email }); // update context
    setSuccess("Profil berhasil diperbarui!");
    setError('');
    setEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setAvatar(url || defaultAvatar);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Profil Pengguna - Romusha</h2>
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full mb-2 border-4 border-blue-200 object-cover"
          />
          {!editing ? (
            <>
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-gray-600">{user.email}</div>
              <div className="text-sm text-gray-400 mt-1">Bergabung: {new Date(joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </>
          ) : (
            <form onSubmit={handleSave} className="w-full mt-2 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Avatar (gambar)</label>
                <input
                  type="url"
                  onChange={handleAvatarChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://avatar-url.com"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Simpan Perubahan
              </button>
              <button
                type="button"
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                onClick={() => { setEditing(false); setError(''); setSuccess(''); }}
              >
                Batal
              </button>
            </form>
          )}
        </div>
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
        {!editing && (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
            onClick={() => setEditing(true)}
          >
            Edit Profil
          </button>
        )}
      </div>
    </div>
  );
}