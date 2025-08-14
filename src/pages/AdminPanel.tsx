import React, { useState } from 'react';
import { mockUsers, mockThreads } from '../data/mockData';
import { Thread, User } from '../types/forum';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  // Simulasi proteksi admin, ganti sesuai kebutuhan
  const isAdmin = user?.email === "admin@romusha.com";
  const [selectedTab, setSelectedTab] = useState<'users' | 'threads'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Admin Panel - Romusha</h2>
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedTab('users')}
          >
            Manajemen User
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === 'threads' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedTab('threads')}
          >
            Manajemen Thread
          </button>
        </div>

        {/* Tab User */}
        {selectedTab === 'users' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">List User</h3>
            <table className="w-full border text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Avatar</th>
                  <th className="p-2">Username</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Reputation</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2 text-center"><img src={u.avatar} alt="" className="w-8 h-8 rounded-full mx-auto" /></td>
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email || '-'}</td>
                    <td className="p-2 text-center">{u.reputation}</td>
                    <td className="p-2 text-center">{u.isOnline ? "Online" : "Offline"}</td>
                    <td className="p-2 text-center">
                      <button className="text-blue-700 hover:underline mr-2" onClick={() => setSelectedUser(u)}>Detail</button>
                      <button className="text-red-600 hover:underline">Ban</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedUser && (
              <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                <h4 className="font-bold text-blue-700 mb-2">Detail User</h4>
                <div className="flex gap-4 items-center">
                  <img src={selectedUser.avatar} alt="" className="w-16 h-16 rounded-full" />
                  <div>
                    <div><span className="font-bold">Username:</span> {selectedUser.username}</div>
                    <div><span className="font-bold">Email:</span> {selectedUser.email || '-'}</div>
                    <div><span className="font-bold">Reputation:</span> {selectedUser.reputation}</div>
                    <div><span className="font-bold">Join Date:</span> {selectedUser.joinDate}</div>
                    <div><span className="font-bold">Status:</span> {selectedUser.isOnline ? "Online" : "Offline"}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium" onClick={() => setSelectedUser(null)}>Close</button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">Ban User</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Thread */}
        {selectedTab === 'threads' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">List Thread</h3>
            <table className="w-full border text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Judul</th>
                  <th className="p-2">Kategori</th>
                  <th className="p-2">Author</th>
                  <th className="p-2">Replies</th>
                  <th className="p-2">Pinned</th>
                  <th className="p-2">Locked</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mockThreads.map(t => (
                  <tr key={t.id} className="border-t">
                    <td className="p-2">{t.title}</td>
                    <td className="p-2">{t.category.name}</td>
                    <td className="p-2">{t.author.username}</td>
                    <td className="p-2 text-center">{t.replyCount}</td>
                    <td className="p-2 text-center">{t.isPinned ? "Yes" : "No"}</td>
                    <td className="p-2 text-center">{t.isLocked ? "Yes" : "No"}</td>
                    <td className="p-2 text-center">
                      <button className="text-blue-700 hover:underline mr-2" onClick={() => setSelectedThread(t)}>Detail</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedThread && (
              <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                <h4 className="font-bold text-blue-700 mb-2">Detail Thread</h4>
                <div>
                  <div><span className="font-bold">Title:</span> {selectedThread.title}</div>
                  <div><span className="font-bold">Author:</span> {selectedThread.author.username}</div>
                  <div><span className="font-bold">Category:</span> {selectedThread.category.name}</div>
                  <div><span className="font-bold">Replies:</span> {selectedThread.replyCount}</div>
                  <div><span className="font-bold">Pinned:</span> {selectedThread.isPinned ? "Yes" : "No"}</div>
                  <div><span className="font-bold">Locked:</span> {selectedThread.isLocked ? "Yes" : "No"}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium" onClick={() => setSelectedThread(null)}>Close</button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">Delete Thread</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}