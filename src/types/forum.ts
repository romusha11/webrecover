export interface User {
  id: string;
  username: string;
  avatar: string;
  reputation: number;
  joinDate: string;
  isOnline: boolean;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  category: Category;
  createdAt: string;
  updatedAt: string;
  votes: number;
  replyCount: number;
  isLocked: boolean;
  isPinned: boolean;
  tags: string[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  threadId: string;
  parentId?: string;
  createdAt: string;
  votes: number;
  replies: Reply[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  threadCount: number;
  icon: string;
}