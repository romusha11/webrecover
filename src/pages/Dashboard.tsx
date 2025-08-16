import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { mockUsers } from '../data/mockData';

export default function Dashboard() {
  const { user, updateBalance } = useAuth();
  if (!user) return <Navigate to="/login" />;

  // Saldo & modal state
  const [balance, setBalance] = React.useState(user.balance ?? 0);
  const [showTopUp, setShowTopUp] = React.useState(false);
  const [showWithdraw, setShowWithdraw] = React.useState(false);
  const [showTransfer, setShowTransfer] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [transferAmount, setTransferAmount] = React.useState('');
  const [transferTo, setTransferTo] = React.useState('');
  const [message, setMessage] = React.useState('');

  // Users lain (tidak termasuk user sendiri)
  const otherUsers = React.useMemo(
    () => mockUsers.filter(u => u.username !== user.name),
    [user]
  );

  // Top Up
  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(amount, 10);
    if (isNaN(nominal) || nominal <= 0) {
      setMessage('Nominal harus lebih dari 0!');
      return;
    }
    setBalance(balance + nominal);
    updateBalance(nominal);
    setMessage(`Top up Rp${nominal.toLocaleString()} berhasil!`);
    setShowTopUp(false);
    setAmount('');
  };

  // Withdraw
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(amount, 10);
    if (isNaN(nominal) || nominal <= 0) {
      setMessage('Nominal harus lebih dari 0!');
      return;
    }
    if (nominal > balance) {
      setMessage('Saldo tidak cukup!');
      return;
    }
    setBalance(balance - nominal);
    updateBalance(-nominal);
    setMessage(`Withdraw Rp${nominal.toLocaleString()} berhasil!`);
    setShowWithdraw(false);
    setAmount('');
  };

  // Transfer antar pengguna
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(transferAmount, 10);
    if (!transferTo) {
      setMessage('Pilih user tujuan!');
      return;
    }
    if (isNaN(nominal) || nominal <= 0) {
      setMessage('Nominal transfer harus lebih dari 0!');
      return;
    }
    if (nominal > balance) {
      setMessage('Saldo tidak cukup!');
      return;
    }
    // Dummy logic: saldo user sendiri berkurang, tampil pesan sukses
    setBalance(balance - nominal);
    updateBalance(-nominal);
    setMessage(`Transfer Rp${nominal.toLocaleString()} ke ${transferTo} berhasil!`);
    setShowTransfer(false);
    setTransferAmount('');
    setTransferTo('');
    // Untuk user tujuan, update saldo di backend/mock jika ada
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-8 px-2">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-black mb-4 text-blue-700 text-center">Dashboard Romusha</h2>
        <div className="mb-6 text-center">
          <div className="text-gray-700 font-medium mb-1">
            Selamat datang, <span className="font-black">{user.name}</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-green-600 mb-2 tracking-wide">Rp{balance.toLocaleString()}</div>
          <div className="text-gray-500 text-xs sm:text-sm">Saldo kamu</div>
        </div>
        {message && (
          <div className="text-center text-sm mb-4 text-blue-700 font-bold">{message}</div>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
          <button
            onClick={() => { setShowTopUp(true); setShowWithdraw(false); setShowTransfer(false); setMessage(''); }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Top Up
          </button>
          <button
            onClick={() => { setShowWithdraw(true); setShowTopUp(false); setShowTransfer(false); setMessage(''); }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Withdraw
          </button>
          <button
            onClick={() => { setShowTransfer(true); setShowWithdraw(false); setShowTopUp(false); setMessage(''); }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Transfer
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <Link
            to="/profile"
            className="text-blue-700 font-bold hover:underline transition"
          >
            Lihat & Edit Profil
          </Link>
        </div>
        {/* Top Up Modal */}
        {showTopUp && (
          <form onSubmit={handleTopUp} className="mt-6">
            <label className="block mb-2 font-bold">Nominal Top Up (Rp)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-bold transition"
            >
              Konfirmasi Top Up
            </button>
            <button
              type="button"
              onClick={() => setShowTopUp(false)}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
            >
              Batal
            </button>
          </form>
        )}
        {/* Withdraw Modal */}
        {showWithdraw && (
          <form onSubmit={handleWithdraw} className="mt-6">
            <label className="block mb-2 font-bold">Nominal Withdraw (Rp)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-bold transition"
            >
              Konfirmasi Withdraw
            </button>
            <button
              type="button"
              onClick={() => setShowWithdraw(false)}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
            >
              Batal
            </button>
          </form>
        )}
        {/* Transfer Modal */}
        {showTransfer && (
          <form onSubmit={handleTransfer} className="mt-6">
            <label className="block mb-2 font-bold">Transfer ke Pengguna</label>
            <select
              value={transferTo}
              onChange={e => setTransferTo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 font-bold outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Pilih pengguna</option>
              {otherUsers.map(u => (
                <option key={u.username} value={u.username}>
                  {u.username} ({u.avatar && <img src={u.avatar} alt="" className="inline w-4 h-4 rounded-full" />})
                </option>
              ))}
            </select>
            <label className="block mb-2 font-bold">Nominal Transfer (Rp)</label>
            <input
              type="number"
              min={1}
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 font-bold outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-bold transition"
            >
              Konfirmasi Transfer
            </button>
            <button
              type="button"
              onClick={() => setShowTransfer(false)}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold transition"
            >
              Batal
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
