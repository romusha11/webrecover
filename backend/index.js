const express = require('express');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const security = require('./security');
const app = express();
app.use(cors());
app.use(express.json());

// USERS
const USERS_FILE = './users.json';
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate paraphrase: 5 karakter acak (huruf besar, kecil, angka)
function generateParaphrase() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let p = '';
  for (let i = 0; i < 5; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

 function hashWithSalt(value, salt) {
  return crypto.pbkdf2Sync(value, salt, 10000, 64, 'sha512').toString('hex');
}

// REGISTER user multi-entitas
app.post('/users', async (req, res) => {
  const { username, email, password, userAgent, screen } = req.body;
  if (!username || !email || !password || !userAgent || !screen)
    return res.status(400).json({ error: 'Semua field wajib diisi' });

  // Validasi hanya Gmail
  if (!/@gmail\.com$/i.test(email.trim()))
    return res.status(400).json({ error: 'Hanya email Gmail yang diizinkan' });

  const users = loadUsers();
  if (users.find(u => u.email === email))
    return res.status(400).json({ error: 'Email sudah terpakai' });

  // Generate paraphrase
  const paraphrasePlain = generateParaphrase();
  const paraphraseSalt = crypto.randomBytes(8).toString('hex');
  const paraphraseHash = hashWithSalt(paraphrasePlain, paraphraseSalt);

  // Generate fingerprint
  const salt = crypto.randomBytes(8).toString('hex');
  const fingerprint = security.generateDeviceFingerprint({ userAgent, screen, salt });

  // Generate TOTP secret and QR code
  const totpSecretObj = security.generateTOTPSecret(email);
  const totpSecret = totpSecretObj.base32;
  const otpauth_url = totpSecretObj.otpauth_url;
  const qrCode = await security.generateQRCode(otpauth_url);

  // Generate RSA keypair for device
  const { publicKey } = security.generateKeypair();

  // Save user
  const hashed = hashPassword(password);
  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashPassword(password),
    paraphraseHash,
    paraphraseSalt,
    bookmarks: [],
    balance: 0,
    totpSecret,
    trustedDevices: [
      { fingerprint, salt, userAgent, screen, registeredAt: Date.now() }
    ],
    publicKey,
  };
  users.push(newUser);
  saveUsers(users);

  res.json({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    totpQR: qrCode,
    totpSecret,
    fingerprint,
    salt,
    paraphrase: paraphrasePlain
  });
});

// LOGIN multi-entitas
app.post('/login', (req, res) => {
  const { email, password, fingerprint, totp, challengeResponse } = req.body;
  const users = loadUsers();
  const hashed = hashPassword(password);
  const user = users.find(u => u.email === email && u.password === hashed);
  if (!user) return res.status(401).json({ error: 'Email/password salah' });

  // Device check
  const trusted = user.trustedDevices?.find(d => d.fingerprint === fingerprint);
  if (!trusted) return res.status(403).json({ error: 'Device not trusted' });

  // Verify TOTP
  if (!security.verifyTOTP(user.totpSecret, totp))
    return res.status(403).json({ error: 'Kode TOTP salah' });

  if (challengeResponse !== 'accepted')
    return res.status(403).json({ error: 'Challenge response invalid' });

  const { password: pw, totpSecret, trustedDevices, ...userNoPw } = user;
  res.json(userNoPw);
});

// Bind device via email + paraphrase
app.post('/bind-device', (req, res) => {
  const { email, paraphrase, userAgent, screen } = req.body;
  if (!email || !paraphrase || !userAgent || !screen)
    return res.status(400).json({ error: 'Email, paraphrase, userAgent, screen wajib diisi' });

  const users = loadUsers();
  const user = users.find(
    u => u.email === email);

  if (!user) return res.status(404).json({ error: 'User/paraphrase tidak cocok' });

  // Verifikasi paraphrase
  const paraphraseCheck = hashWithSalt(paraphrase, user.paraphraseSalt);
  if (paraphraseCheck !== user.paraphraseHash)
  return res.status(400).json({ error: 'Paraphrase salah' });

  // Generate new fingerprint untuk perangkat ini
  const salt = crypto.randomBytes(8).toString('hex');
  const fingerprint = security.generateDeviceFingerprint({ userAgent, screen, salt });

  if (user.trustedDevices?.find(d => d.fingerprint === fingerprint))
    return res.status(400).json({ error: 'Device sudah terdaftar' });

  user.trustedDevices = user.trustedDevices || [];
  user.trustedDevices.push({
    fingerprint,
    salt,
    userAgent,
    screen,
    registeredAt: Date.now()
  });
  saveUsers(users);
  res.json({ trustedDevices: user.trustedDevices, fingerprint });
});

// GET user by email (untuk frontend lookup userId, jika perlu)
app.get('/users', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email wajib diisi' });
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
  });
});

// BOOKMARK
app.post('/users/:userId/bookmark', (req, res) => {
  const { threadId } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.bookmarks = user.bookmarks || [];
  if (!user.bookmarks.includes(threadId)) user.bookmarks.push(threadId);
  saveUsers(users);
  res.json({ bookmarks: user.bookmarks });
});
app.post('/users/:userId/unbookmark', (req, res) => {
  const { threadId } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.bookmarks = user.bookmarks?.filter(id => id !== threadId) || [];
  saveUsers(users);
  res.json({ bookmarks: user.bookmarks });
});

// ===== SALDO / BALANCE ENDPOINTS =====

// Get saldo user
app.get('/users/:userId/balance', (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ balance: user.balance || 0 });
});

// Top up saldo
app.post('/users/:userId/topup', (req, res) => {
  const { amount } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const nominal = parseInt(amount, 10);
  if (isNaN(nominal) || nominal <= 0) return res.status(400).json({ error: 'Nominal harus lebih dari 0' });
  user.balance = (user.balance || 0) + nominal;
  saveUsers(users);
  res.json({ balance: user.balance });
});

// Withdraw saldo
app.post('/users/:userId/withdraw', (req, res) => {
  const { amount } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const nominal = parseInt(amount, 10);
  if (isNaN(nominal) || nominal <= 0) return res.status(400).json({ error: 'Nominal harus lebih dari 0' });
  if ((user.balance || 0) < nominal) return res.status(400).json({ error: 'Saldo tidak cukup' });
  user.balance -= nominal;
  saveUsers(users);
  res.json({ balance: user.balance });
});

// Transfer saldo ke user lain
app.post('/users/:userId/transfer', (req, res) => {
  const { toUserId, amount } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.id == req.params.userId);
  const toUser = users.find(u => u.id == toUserId);
  if (!user) return res.status(404).json({ error: 'User asal tidak ditemukan' });
  if (!toUser) return res.status(404).json({ error: 'User tujuan tidak ditemukan' });
  const nominal = parseInt(amount, 10);
  if (isNaN(nominal) || nominal <= 0) return res.status(400).json({ error: 'Nominal transfer harus lebih dari 0' });
  if ((user.balance || 0) < nominal) return res.status(400).json({ error: 'Saldo tidak cukup' });
  user.balance -= nominal;
  toUser.balance = (toUser.balance || 0) + nominal;
  saveUsers(users);
  res.json({ balance: user.balance, toUserBalance: toUser.balance });
});

// THREADS - CRUD PRODUCTION READY
const THREADS_FILE = './threads.json';
function loadThreads() {
  if (!fs.existsSync(THREADS_FILE)) return [];
  const data = fs.readFileSync(THREADS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
function saveThreads(threads) {
  fs.writeFileSync(THREADS_FILE, JSON.stringify(threads, null, 2));
}

// Helper: get user by id
function getUserById(userId) {
  const users = loadUsers();
  return users.find(u => u.id == userId);
}

// Helper: find subcategory (recursive)
function findSubcategory(categoryTree, id) {
  for (const cat of categoryTree) {
    if (cat.id === id) return cat;
    if (cat.children && cat.children.length) {
      const found = findSubcategory(cat.children, id);
      if (found) return found;
    }
  }
  return null;
}

// GET /threads?categoryId=...
app.get('/threads', (req, res) => {
  const { categoryId } = req.query;
  let threads = loadThreads();
  if (categoryId) {
    threads = threads.filter(t => t.categoryId === categoryId);
  }
  // Sort: terbaru paling atas
  threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, data: threads });
});

// POST /threads
app.post('/threads', (req, res) => {
  const { title, content, categoryId, tags, author } = req.body;
  if (!title || !content || !categoryId || !author || !author.id) {
    return res.status(400).json({ success: false, error: 'Semua field wajib diisi' });
  }
  // Validasi kategoriId hanya boleh subkategori (tidak root)
  const categories = loadCategories();
  const catObj = findSubcategory(categories, categoryId);
  if (!catObj) {
    return res.status(400).json({ success: false, error: 'Kategori tidak valid' });
  }
  if (catObj.children && catObj.children.length > 0) {
    return res.status(400).json({ success: false, error: 'Tidak boleh post di root kategori, hanya subkategori' });
  }
  // Validasi user
  const userObj = getUserById(author.id);
  if (!userObj) {
    return res.status(401).json({ success: false, error: 'User tidak ditemukan / belum login' });
  }
  // Build thread
  const newThread = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content.trim(),
    categoryId: catObj.id,
    category: {
      id: catObj.id,
      name: catObj.name,
      icon: catObj.icon,
      color: catObj.color,
      description: catObj.description,
    },
    tags: Array.isArray(tags) ? tags : [],
    author: {
      id: userObj.id,
      username: userObj.username,
      name: userObj.name,
      avatar: userObj.avatar,
      email: userObj.email,
      role: userObj.role,
      reputation: userObj.reputation,
      joinDate: userObj.joinDate,
    },
    isPinned: false,
    isLocked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const threads = loadThreads();
  threads.push(newThread);
  saveThreads(threads);
  res.json({ success: true, data: newThread });
});

// PUT /threads/:id
app.put('/threads/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, tags, author } = req.body;
  if (!author || !author.id) return res.status(401).json({ success: false, error: 'User belum login' });
  const threads = loadThreads();
  const idx = threads.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Thread tidak ditemukan' });
  // Hanya author atau admin bisa edit
  if (threads[idx].author.id !== author.id && author.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Tidak punya hak edit thread ini' });
  }
  threads[idx].title = title ? title.trim() : threads[idx].title;
  threads[idx].content = content ? content.trim() : threads[idx].content;
  threads[idx].tags = Array.isArray(tags) ? tags : threads[idx].tags;
  threads[idx].updatedAt = new Date().toISOString();
  saveThreads(threads);
  res.json({ success: true, data: threads[idx] });
});

// DELETE /threads/:id
app.delete('/threads/:id', (req, res) => {
  const { id } = req.params;
  const { author } = req.body; // frontend kirim author.id di body
  if (!author || !author.id) return res.status(401).json({ success: false, error: 'User belum login' });
  const threads = loadThreads();
  const idx = threads.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Thread tidak ditemukan' });
  // Hanya author atau admin bisa hapus
  if (threads[idx].author.id !== author.id && author.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Tidak punya hak hapus thread ini' });
  }
  threads.splice(idx, 1);
  saveThreads(threads);
  res.json({ success: true });
});

// REPLIES
const REPLIES_FILE = './replies.json';
function loadReplies() {
  if (!fs.existsSync(REPLIES_FILE)) return [];
  const data = fs.readFileSync(REPLIES_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
function saveReplies(replies) {
  fs.writeFileSync(REPLIES_FILE, JSON.stringify(replies, null, 2));
}
app.get('/replies', (req, res) => {
  const { threadId } = req.query;
  const replies = loadReplies();
  if (threadId) { return res.json(replies.filter(r => r.threadId == threadId)); }
  res.json(replies);
});
app.post('/replies', (req, res) => {
  const { threadId, author, content } = req.body;
  if (!threadId || !author || !content) return res.status(400).json({ error: 'Semua field wajib' });
  const replies = loadReplies();
  const newReply = { id: Date.now(), threadId, author, content, createdAt: Date.now() };
  replies.push(newReply);
  saveReplies(replies);
  res.json(newReply);
});

// NOTIFICATIONS
const NOTIF_FILE = './notifications.json';
function loadNotifs() {
  if (!fs.existsSync(NOTIF_FILE)) return [];
  const data = fs.readFileSync(NOTIF_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
function saveNotifs(notifs) {
  fs.writeFileSync(NOTIF_FILE, JSON.stringify(notifs, null, 2));
}
app.get('/notifications', (req, res) => {
  const { userId } = req.query;
  const notifs = loadNotifs();
  if (userId) { return res.json(notifs.filter(n => n.userId == userId)); }
  res.json(notifs);
});
app.post('/notifications', (req, res) => {
  const { userId, message, type } = req.body;
  if (!userId || !message || !type) return res.status(400).json({ error: 'Semua field wajib' });
  const notifs = loadNotifs();
  const newNotif = { id: Date.now(), userId, message, type, isRead: false, time: Date.now() };
  notifs.push(newNotif);
  saveNotifs(notifs);
  res.json(newNotif);
});

  const CATEGORIES_FILE = './categories.json';
function loadCategories() {
  if (!fs.existsSync(CATEGORIES_FILE)) return [];
  const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
app.get('/categories', (req, res) => {
  res.json(loadCategories());
});

// Test endpoint
app.get('/', (req, res) => { res.send('API Romusha File JSON Jalan!'); });

app.listen(3000, () => console.log('Server jalan di port 3000 (File JSON, Multi-Entitas Security)'));
