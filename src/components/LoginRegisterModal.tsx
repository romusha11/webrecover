import React, { useState } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function LoginRegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between mb-4">
          <button
            className={`flex-1 py-2 ${tab === 'login' ? 'font-bold border-b-2 border-blue-700' : ''}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${tab === 'register' ? 'font-bold border-b-2 border-blue-700' : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>
        {tab === 'login' ? <Login onSuccess={onClose} /> : <Register onSuccess={onClose} />}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-blue-700 underline block mx-auto"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
