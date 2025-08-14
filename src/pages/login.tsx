import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana
    if (!email || !password) {
      setError('Email dan password wajib diisi!');
      return;
    }

    // TODO: Integrasi ke backend/Supabase di tahap berikut
    setError('');
    alert('Login berhasil (dummy)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Login - Ethereum Work</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Belum punya akun? <a href="/register" className="text-blue-700 font-bold hover:underline">Register</a>
        </div>
      </div>
    </div>
  );
}
