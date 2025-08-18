import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Ambil fingerprint dari localStorage (hasil register/bind)
  const getFingerprint = () => {
    const fingerprint = localStorage.getItem('fingerprint');
    return fingerprint || '';
  };

  const challengeResponse = 'accepted';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim() || !totp.trim()) {
      setError('Email, password, dan kode TOTP wajib diisi!');
      return;
    }
    setLoading(true);

    const fingerprint = getFingerprint();

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          fingerprint,
          totp: totp.trim(),
          challengeResponse,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Login gagal!');
        setLoading(false);
        return;
      }
      login(data);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch {
      setError('Gagal login, coba lagi nanti.');
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4" style={{ minHeight: 320 }}>
        <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#7b90ff' }}>Login Romusha Multi-Entitas</h2>
        {error && <div className="mb-2" style={{ color: '#ff3333' }}>{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
            style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
              placeholder="Password"
            />
            <span
              className="absolute right-3 top-2 cursor-pointer"
              title={showPassword ? "Sembunyikan" : "Lihat Password"}
              onClick={() => setShowPassword(s => !s)}
              style={{ color: showPassword ? "#ff0055" : "#8a6cff", fontSize: 22 }}
            >
              {/* Mata custom: psikopat style */}
              {showPassword ? (
                <span role="img" aria-label="hide">👁️‍🗨️</span>
              ) : (
                <span role="img" aria-label="show">👁️</span>
              )}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Kode TOTP (Google Authenticator)</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]*"
            className="w-full border rounded-lg px-3 py-2"
            value={totp}
            onChange={e => setTotp(e.target.value)}
            required
            disabled={loading}
            style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828' }}
          />
          <small className="text-xs text-gray-400">Masukkan 6 digit kode dari Google Authenticator.</small>
        </div>
        <button
          type="submit"
          disabled={!email.trim() || !password.trim() || !totp.trim() || loading}
          className="w-full rounded-lg font-semibold transition-colors"
          style={{ background: '#181818', color: '#7b90ff', border: '1px solid #282828' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link
          to="/bind-device"
          style={{
            color: '#7b90ff',
            textDecoration: 'underline',
            fontWeight: 'bold',
            fontSize: '0.98em',
            display: 'inline-block',
            marginTop: 12,
          }}
        >
          Bind/Recovery Device &rarr;
        </Link>
      </div>
    </div>
  );
}
