import React, { useState } from 'react';

export default function BindDevice() {
  const [email, setEmail] = useState('');
  const [paraphrase, setParaphrase] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const userAgent = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim() || !paraphrase.trim()) {
      setError('Email dan paraphrase wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/bind-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          paraphrase: paraphrase.trim(),
          userAgent,
          screen,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Gagal bind device');
        setLoading(false);
        return;
      }
      // Simpan fingerprint device baru
      if (data.fingerprint) {
        localStorage.setItem('fingerprint', data.fingerprint);
      }
      setSuccess('Device berhasil dibind ke akun Anda!');
      setError('');
      setLoading(false);
    } catch {
      setError('Gagal bind device, coba lagi nanti.');
      setSuccess('');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4" style={{ minHeight: 320 }}>
      <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#7b90ff' }}>Bind/Recovery Device</h2>
      <div className="mb-2 text-xs text-gray-700 text-center">
        Isi dengan email dan paraphrase akun Anda.<br/>
        Device fingerprint otomatis, tidak perlu input manual.
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
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
          placeholder="email@gmail.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#7b90ff' }}>Paraphrase (5 karakter)</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 font-mono text-xl"
          value={paraphrase}
          onChange={e => setParaphrase(e.target.value)}
          required
          disabled={loading}
          maxLength={5}
          style={{ background: '#181818', color: '#8a6cff', borderColor: '#282828', letterSpacing: 2 }}
          placeholder="contoh: aB7zK"
        />
      </div>
      <button
        type="submit"
        disabled={!email.trim() || !paraphrase.trim() || loading}
        className="w-full rounded-lg font-semibold transition-colors"
        style={{ background: '#181818', color: '#7b90ff', border: '1px solid #282828' }}
      >
        {loading ? 'Memproses...' : 'Bind Device'}
      </button>
    </form>
  );
}
