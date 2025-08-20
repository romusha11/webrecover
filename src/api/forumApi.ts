// API Service: Semua operasi forum, thread, reply, kategori

const BASE_URL = 'http://localhost:3000';

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return await res.json();
}

export async function fetchThreads(categoryId?: string) {
  let url = `${BASE_URL}/threads`;
  if (categoryId) url += `?categoryId=${categoryId}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Gagal mengambil thread');
  return Array.isArray(json.data) ? json.data : [];
}

export async function fetchThreadReplies(threadId: string) {
  const res = await fetch(`${BASE_URL}/replies?threadId=${threadId}`);
  return await res.json();
}

export async function createThread(threadData: any) {
  const res = await fetch(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(threadData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Gagal membuat thread');
  return json.data;
}

export async function editThread(threadId: string, threadData: any) {
  const res = await fetch(`${BASE_URL}/threads/${threadId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(threadData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Gagal edit thread');
  return json.data;
}

export async function deleteThread(threadId: string, author: any) {
  const res = await fetch(`${BASE_URL}/threads/${threadId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Gagal hapus thread');
  return true;
}
