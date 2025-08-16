// ...data dummy lain di atas

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

// ...export lain tetap ada di sini!
