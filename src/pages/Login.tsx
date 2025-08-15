import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi!');
      return;
    }
    const name = email === "admin@romusha.com" ? "BlackQuill" : "User";
    login({ name, email });
    setError('');
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Login Romusha</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition-colors">
        Login
      </button>
    </form>
  );
}
