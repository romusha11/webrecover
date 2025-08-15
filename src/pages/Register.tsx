import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Semua field wajib diisi!');
      return;
    }
    setError('');
    login({ name, email });
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#7b90ff' }}>Register Romusha</h2>
      {error && <div className="mb-2" style={{ color: '#7b90ff' }}>{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Nama</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
          style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Email</label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Password</label>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg font-semibold transition-colors"
        style={{ background: '#181818', color: '#7b90ff', border: '1px solid #282828' }}
      >
        Register
      </button>
    </form>
  );
}
