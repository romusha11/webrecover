const express = require('express');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto'); // Tambahkan ini!
const app = express();
app.use(cors());
app.use(express.json());

// Fungsi untuk hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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
app.get('/users', (req, res) => { res.json(loadUsers()); });
app.post('/users', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Semua field wajib diisi' });
  const users = loadUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email sudah terpakai' });
  const hashed = hashPassword(password);
  const newUser = { id: Date.now(), username, email, password: hashed, bookmarks: [] };
  users.push(newUser);
  saveUsers(users);
  // Jangan kirim password ke frontend
  const { password: pw, ...userNoPw } = newUser;
  res.json(userNoPw);
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const hashed = hashPassword(password);
  const user = users.find(u => u.email === email && u.password === hashed);
  if (!user) return res.status(401).json({ error: 'Email/password salah' });
  // Jangan kirim password ke frontend
  const { password: pw, ...userNoPw } = user;
  res.json(userNoPw);
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

// THREADS
const THREADS_FILE = './threads.json';
function loadThreads() {
  if (!fs.existsSync(THREADS_FILE)) return [];
  const data = fs.readFileSync(THREADS_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}
function saveThreads(threads) {
  fs.writeFileSync(THREADS_FILE, JSON.stringify(threads, null, 2));
}
app.get('/threads', (req, res) => { res.json(loadThreads()); });
app.post('/threads', (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) return res.status(400).json({ error: 'Semua field wajib diisi' });
  const threads = loadThreads();
  const newThread = { id: Date.now(), title, content, author, createdAt: Date.now() };
  threads.push(newThread);
  saveThreads(threads);
  res.json(newThread);
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

// Test endpoint
app.get('/', (req, res) => { res.send('API Romusha File JSON Jalan!'); });

app.listen(3000, () => console.log('Server jalan di port 3000 (File JSON)'));
