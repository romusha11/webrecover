import React from 'react';
import { mockUsers, mockThreads, mockCategories, mockReplies, mockTransactions } from '../data/mockData';
import { BarChart2, User, MessageSquare, Tag, ArrowUpRight, TrendingUp, Star, Activity, DollarSign } from 'lucide-react';

// Dummy chart data
const threadsPerCategory = mockCategories.map(cat => ({
  name: cat.name,
  value: mockThreads.filter(t => t.category.id === cat.id).length,
  color: cat.color,
}));

const userGrowth = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 180 },
  { month: 'Mar', users: 230 },
  { month: 'Apr', users: 270 },
  { month: 'May', users: 320 },
  { month: 'Jun', users: 400 },
  { month: 'Jul', users: 480 },
  { month: 'Aug', users: 580 },
];

export default function Analytics() {
  // Insight cards
  const bestUser = mockUsers.reduce((max, u) => u.activityCount > max.activityCount ? u : max, mockUsers[0]);
  const topCategory = threadsPerCategory.reduce((max, c) => c.value > max.value ? c : max, threadsPerCategory[0]);
  const topThread = mockThreads.reduce((max, t) => t.replyCount > max.replyCount ? t : max, mockThreads[0]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-blue-700 flex items-center gap-2">
            <BarChart2 size={28} /> Forum Analytics
          </h2>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-blue-50 rounded-xl p-5 flex flex-col items-center border border-blue-200">
            <User size={34} className="text-blue-600 mb-2" />
            <div className="font-black text-2xl text-blue-700">{mockUsers.length}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Total Users</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 flex flex-col items-center border border-purple-200">
            <MessageSquare size={34} className="text-purple-600 mb-2" />
            <div className="font-black text-2xl text-purple-700">{mockThreads.length}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Total Threads</div>
          </div>
          <div className="bg-green-50 rounded-xl p-5 flex flex-col items-center border border-green-200">
            <Activity size={34} className="text-green-600 mb-2" />
            <div className="font-black text-2xl text-green-700">{mockReplies.length}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Total Replies</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-5 flex flex-col items-center border border-yellow-200">
            <Tag size={34} className="text-yellow-600 mb-2" />
            <div className="font-black text-2xl text-yellow-700">{mockCategories.length}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Total Categories</div>
          </div>
        </div>

        {/* Chart: Threads per Category */}
        <div className="mb-10">
          <div className="font-black text-lg text-blue-700 mb-2 flex items-center gap-2">
            <BarChart2 size={20} /> Threads per Category
          </div>
          <div className="flex items-end gap-5 h-32">
            {threadsPerCategory.map(cat => (
              <div key={cat.name} className="flex flex-col items-center flex-1">
                <div
                  className="rounded-t-lg w-7 transition"
                  style={{
                    height: `${cat.value * 12 || 10}px`,
                    backgroundColor: cat.color,
                    minHeight: '10px',
                  }}
                  title={cat.value + ' threads'}
                ></div>
                <div className="text-xs font-bold mt-2 text-gray-600">{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart: User Growth */}
        <div className="mb-10">
          <div className="font-black text-lg text-green-700 mb-2 flex items-center gap-2">
            <TrendingUp size={20} /> User Growth Trend
          </div>
          <div className="relative w-full h-32">
            <svg width="100%" height="100%" viewBox="0 0 500 128" className="absolute left-0 top-0">
              <polyline
                fill="none"
                stroke="#38a169"
                strokeWidth="3"
                points={
                  userGrowth.map((u, i) => {
                    const x = (i / (userGrowth.length - 1)) * 480 + 10;
                    const y = 120 - ((u.users - 100) / 500 * 110);
                    return `${x},${y}`;
                  }).join(' ')
                }
              />
              {userGrowth.map((u, i) => {
                const x = (i / (userGrowth.length - 1)) * 480 + 10;
                const y = 120 - ((u.users - 100) / 500 * 110);
                return (
                  <circle key={u.month} cx={x} cy={y} r={4} fill="#38a169" />
                );
              })}
            </svg>
            <div className="flex justify-between pt-32 px-1 text-xs font-bold text-gray-500">
              {userGrowth.map(u => <div key={u.month}>{u.month}</div>)}
            </div>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="mb-10">
          <div className="font-black text-lg text-yellow-700 mb-2 flex items-center gap-2">
            <DollarSign size={20} /> Total Transactions
          </div>
          <div className="bg-yellow-50 rounded-xl p-5 flex flex-col sm:flex-row items-center border border-yellow-200 gap-6">
            <div className="font-black text-3xl text-yellow-700">{mockTransactions.length}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">Total transaksi (top up, withdraw, transfer)</div>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-blue-200 p-5 flex flex-col items-center shadow-sm">
            <Star size={28} className="text-blue-600 mb-2" />
            <div className="font-black text-lg text-blue-700">Best User</div>
            <img src={bestUser.avatar} alt={bestUser.username} className="w-10 h-10 rounded-full my-2" />
            <div className="font-bold">{bestUser.username}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">{bestUser.activityCount} activity</div>
          </div>
          <div className="bg-white rounded-xl border border-yellow-200 p-5 flex flex-col items-center shadow-sm">
            <Tag size={28} className="text-yellow-600 mb-2" />
            <div className="font-black text-lg text-yellow-700">Top Category</div>
            <div className="font-bold">{topCategory.name}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">{topCategory.value} threads</div>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-5 flex flex-col items-center shadow-sm">
            <MessageSquare size={28} className="text-purple-600 mb-2" />
            <div className="font-black text-lg text-purple-700">Active Thread</div>
            <div className="font-bold">{topThread.title}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">{topThread.replyCount} replies</div>
          </div>
        </div>
      </div>
    </main>
  );
}
