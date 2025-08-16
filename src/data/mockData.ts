// ====================
// MOCK DATA FOR ROMUSHA
// ====================

// USERS
export const mockUsers = [
  {
    id: "u1",
    username: "BlackQuill",
    name: "BlackQuill",
    email: "admin@romusha.com",
    avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    role: "admin",
    reputation: 9999,
    joinDate: "2023-01-01",
    isOnline: true,
    bookmarks: [],
  },
  {
    id: "u2",
    username: "UserOne",
    name: "User One",
    email: "user1@romusha.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&crop=face",
    role: "user",
    reputation: 100,
    joinDate: "2023-02-01",
    isOnline: true,
    bookmarks: [],
  },
  {
    id: "u3",
    username: "UserTwo",
    name: "User Two",
    email: "user2@romusha.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user",
    reputation: 50,
    joinDate: "2023-03-01",
    isOnline: false,
    bookmarks: [],
  },
];

// CATEGORIES
export const mockCategories = [
  {
    id: "c1",
    name: "General",
    description: "Diskusi umum dan pengumuman.",
    color: "#4a74ff",
    threadCount: 4,
  },
  {
    id: "c2",
    name: "Blockchain",
    description: "Diskusi seputar teknologi blockchain.",
    color: "#ff9800",
    threadCount: 3,
  },
  {
    id: "c3",
    name: "AI & Machine Learning",
    description: "AI, ML, dan Data Science.",
    color: "#8a6cff",
    threadCount: 2,
  }
];

// THREADS
export const mockThreads = [
  {
    id: "t1",
    title: "Selamat Datang di Forum Romusha!",
    content: "Thread ini untuk pengumuman dan diskusi umum. Silakan perkenalkan diri.",
    category: mockCategories[0],
    author: mockUsers[0],
    tags: ["pengumuman", "forum"],
    votes: 10,
    replyCount: 2,
    isPinned: true,
    isLocked: false,
    createdAt: "2025-08-10T10:00:00Z",
    updatedAt: "2025-08-12T12:00:00Z",
    replies: [],
  },
  {
    id: "t2",
    title: "Diskusi Blockchain Indonesia",
    content: "Apa pendapat kalian tentang perkembangan blockchain di Indonesia?",
    category: mockCategories[1],
    author: mockUsers[1],
    tags: ["blockchain", "crypto"],
    votes: 7,
    replyCount: 1,
    isPinned: false,
    isLocked: false,
    createdAt: "2025-08-11T15:00:00Z",
    updatedAt: "2025-08-11T20:00:00Z",
    replies: [],
  },
  {
    id: "t3",
    title: "AI dan Masa Depan Kerja",
    content: "Bagaimana AI akan mengubah dunia kerja dan profesi?",
    category: mockCategories[2],
    author: mockUsers[2],
    tags: ["ai", "machine learning"],
    votes: 3,
    replyCount: 0,
    isPinned: false,
    isLocked: false,
    createdAt: "2025-08-12T13:00:00Z",
    updatedAt: "2025-08-12T13:00:00Z",
    replies: [],
  },
];

// REPLIES
export const mockReplies = [
  {
    id: "r1",
    threadId: "t1",
    author: mockUsers[1],
    content: "Halo semuanya! Senang bisa bergabung di forum ini.",
    votes: 2,
    createdAt: "2025-08-10T11:00:00Z",
    replies: [],
  },
  {
    id: "r2",
    threadId: "t1",
    author: mockUsers[2],
    content: "Saya juga baru join, semoga forum ini bermanfaat.",
    votes: 1,
    createdAt: "2025-08-10T12:00:00Z",
    replies: [],
  },
  {
    id: "r3",
    threadId: "t2",
    author: mockUsers[0],
    content: "Blockchain di Indonesia potensinya besar, regulasi harus mendukung.",
    votes: 3,
    createdAt: "2025-08-11T16:00:00Z",
    replies: [],
  },
];

// TRANSACTIONS (ANALYTICS)
export const mockTransactions = [
  {
    id: 'tx1',
    type: 'topup',
    amount: 100000,
    userId: 'u1',
    time: '2025-08-10T12:00:00Z'
  },
  {
    id: 'tx2',
    type: 'withdraw',
    amount: 50000,
    userId: 'u2',
    time: '2025-08-12T14:00:00Z'
  },
  {
    id: 'tx3',
    type: 'transfer',
    amount: 20000,
    userId: 'u1',
    toUserId: 'u3',
    time: '2025-08-13T16:00:00Z'
  },
];

// NOTIFICATIONS
export const mockNotifications = [
  {
    id: 'notif1',
    userId: 'u1',
    message: 'Thread kamu mendapatkan reply baru!',
    time: '2025-08-15T10:00:00Z',
    isRead: false,
    type: 'reply'
  },
  {
    id: 'notif2',
    userId: 'u2',
    message: 'Saldo kamu berhasil di top-up.',
    time: '2025-08-14T09:30:00Z',
    isRead: true,
    type: 'transaction'
  },
  {
    id: 'notif3',
    userId: 'u3',
    message: 'Selamat datang di Romusha!',
    time: '2025-08-10T08:00:00Z',
    isRead: true,
    type: 'welcome'
  },
];
