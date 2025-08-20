// FINAL SINKRONISASI DATA FORUM

export interface Author {
  id: string;
  username: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  reputation: number;
  joinDate: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  children?: Category[];
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: Author;
  category: Category;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
  isPinned: boolean;
  tags: string[];
}

export interface Reply {
  id: string;
  content: string;
  author: Author;
  threadId: string;
  parentId?: string;
  createdAt: string;
}