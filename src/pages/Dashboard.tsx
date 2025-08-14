import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  // Data dummy
  const [balance, setBalance] = React.useState(1500000);
  const [showTopUp, setShowTopUp] = React.useState(false);
  const [showWithdraw, setShowWithdraw] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(amount, 10);
    if (isNaN(nominal) || nominal <= 0) {
      setMessage('Nominal harus lebih dari 0!');
      return;
    }
    setBalance(balance + nominal);
    setMessage(`Top up Rp${nominal.toLocaleString()} berhasil!`);
    setShowTopUp(false);
    setAmount('');
  };

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
    setMessage(`Withdraw Rp${nominal.toLocaleString()} berhasil!`);
    setShowWithdraw(false);
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Dashboard Ethereum Work</h2>
        <div className="mb-6 text-center">
          <div className="text-gray-700 font-medium mb-2">Selamat datang, <span className="font-bold">{user.name}</span></div>
          <div className="text-4xl font-bold text-green-600 mb-1">Rp{balance.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Saldo kamu</div>
        </div>
        {message && (
          <div className="text-center text-sm mb-4 text-blue-700">{message}</div>
        )}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => { setShowTopUp(true); setShowWithdraw(false); setMessage(''); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Top Up
          </button>
          <button
            onClick={() => { setShowWithdraw(true); setShowTopUp(false); setMessage(''); }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Withdraw
          </button>
        </div>
        {showTopUp && (
          <form onSubmit={handleTopUp} className="mt-6">
            <label className="block mb-2 font-medium">Nominal Top Up (Rp)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Konfirmasi Top Up
            </button>
            <button
              type="button"
              onClick={() => setShowTopUp(false)}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
          </form>
        )}
        {showWithdraw && (
          <form onSubmit={handleWithdraw} className="mt-6">
            <label className="block mb-2 font-medium">Nominal Withdraw (Rp)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Konfirmasi Withdraw
            </button>
            <button
              type="button"
              onClick={() => setShowWithdraw(false)}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
