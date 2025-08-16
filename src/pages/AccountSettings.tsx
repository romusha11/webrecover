import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LogOut, ShieldCheck, ShieldOff, Key, Mail } from 'lucide-react';

export default function AccountSettings() {
  const { user, updateProfile, logoutAll } = useAuth();
  if (!user) return <Navigate to="/login" />;

  // Form state
  const [email, setEmail] = useState(user.email);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(user.twoFA ?? false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle email update
  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Email tidak valid.');
      setMessage('');
      return;
    }
    updateProfile({ email });
    setMessage('Email berhasil diperbarui!');
    setError('');
  };

  // Handle password update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPw.trim() || !newPw.trim() || newPw.length < 6) {
      setError('Password baru minimal 6 karakter.');
      setMessage('');
      return;
    }
    // Simulasi update password
    setOldPw('');
    setNewPw('');
    setMessage('Password berhasil diperbarui!');
    setError('');
  };

  // Handle 2FA toggle
  const handleToggle2FA = () => {
    setTwoFA(!twoFA);
    updateProfile({ twoFA: !twoFA });
    setMessage(twoFA ? '2FA dinonaktifkan.' : '2FA diaktifkan.');
    setError('');
  };

  // Handle logout all device
  const handleLogoutAll = () => {
    logoutAll();
    setMessage('Berhasil logout dari semua device.');
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 text-blue-700 text-center">Account Settings</h2>
        <div className="space-y-8">

          {/* Ubah Email */}
          <section>
            <form onSubmit={handleEmailUpdate} className="space-y-3">
              <label className="block text-sm font-bold mb-1 flex items-center gap-2">
                <Mail size={18} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition"
              >
                Update Email
              </button>
            </form>
          </section>

          {/* Ubah Password */}
          <section>
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <label className="block text-sm font-bold mb-1 flex items-center gap-2">
                <Key size={18} /> Ubah Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={oldPw}
                onChange={e => setOldPw(e.target.value)}
                placeholder="Password lama"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold"
                required
              />
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Password baru (min 6 karakter)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-semibold"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-xs text-blue-600 underline"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={0}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition"
              >
                Update Password
              </button>
            </form>
          </section>

          {/* 2FA & Logout All */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <label className="text-sm font-bold flex items-center gap-2">
                {twoFA ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
                Two Factor Auth (2FA)
              </label>
              <button
                type="button"
                onClick={handleToggle2FA}
                className={`rounded-full px-3 py-1 font-bold text-xs transition ml-2 
                  ${twoFA ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                {twoFA ? "Disable" : "Enable"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogoutAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
            >
              <LogOut size={18} /> Logout Semua Device
            </button>
          </section>

          {/* Pesan error/sukses */}
          {(error || message) && (
            <div className={`text-center font-bold py-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error || message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
