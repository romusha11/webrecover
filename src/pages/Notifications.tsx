import React, { useState } from 'react';
import { Bell, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();

  // Mark satu notif as read
  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  // Hapus satu notif
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Hapus semua notif
  const handleDeleteAll = () => {
    setNotifications([]);
  };

  // Mark semua as read
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Navigasi ke sumber notif
  const handleGoTo = (n: typeof notifications[0]) => {
    if (n.link) navigate(n.link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-blue-700 flex items-center gap-2">
            <Bell size={26} /> Notifikasi
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllRead}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold transition text-xs"
              disabled={notifications.every(n => n.isRead)}
            >
              Tandai semua sudah dibaca
            </button>
            <button
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-bold transition text-xs"
              disabled={notifications.length === 0}
            >
              Hapus semua
            </button>
          </div>
        </div>
        <div>
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 font-bold py-8">Belum ada notifikasi.</div>
          ) : (
            <ul className="space-y-3">
              {notifications.map(n => (
                <li
                  key={n.id}
                  className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 transition
                    ${n.isRead ? 'bg-gray-50' : 'bg-purple-50'}
                  `}
                  tabIndex={0}
                  aria-label={`Notifikasi: ${n.title}`}
                >
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => handleGoTo(n)}>
                    <span className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: n.isRead ? '#e5e7eb' : '#c4b5fd' }}
                    >
                      {n.type === 'reply' ? <ArrowRight size={26} className="text-blue-700" /> :
                        n.type === 'transaction' ? <CheckCircle2 size={26} className="text-green-700" /> :
                        <Bell size={26} className="text-purple-700" />}
                    </span>
                    <div>
                      <div className={`font-bold text-base ${n.isRead ? 'text-gray-600' : 'text-purple-700'}`}>{n.title}</div>
                      <div className="text-sm text-gray-500">{n.body}</div>
                      <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end ml-4">
                    {!n.isRead && (
                      <button
                        className="text-blue-600 hover:text-blue-800 transition px-2 py-0.5 rounded font-bold text-xs"
                        aria-label="Tandai sudah dibaca"
                        onClick={() => handleMarkRead(n.id)}
                      >
                        Tandai dibaca
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-800 transition px-2 py-0.5 rounded font-bold text-xs"
                      aria-label="Hapus notifikasi"
                      onClick={() => handleDelete(n.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
