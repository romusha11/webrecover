import { User, Thread, Category, Reply } from '../types/forum';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'TechGuru',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&crop=face',
    reputation: 1250,
    joinDate: '2023-01-15',
    isOnline: true
  },
  {
    id: '2',
    username: 'CodeMaster',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&crop=face',
    reputation: 890,
    joinDate: '2023-03-22',
    isOnline: false
  },
  {
    id: '3',
    username: 'DevNewbie',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&crop=face',
    reputation: 245,
    joinDate: '2024-11-01',
    isOnline: true
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'Talk about anything and everything',
    color: '#6366f1',
    threadCount: 245,
    icon: 'MessageSquare'
  },
  {
    id: '2',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack development',
    color: '#059669',
    threadCount: 189,
    icon: 'Code'
  },
  {
    id: '3',
    name: 'Mobile Apps',
    description: 'iOS, Android, and cross-platform development',
    color: '#dc2626',
    threadCount: 156,
    icon: 'Smartphone'
  },
  {
    id: '4',
    name: 'Design & UI/UX',
    description: 'User interface and experience design',
    color: '#7c3aed',
    threadCount: 98,
    icon: 'Palette'
  },
  {
    id: '5',
    name: 'Career Advice',
    description: 'Job hunting, interviews, and career growth',
    color: '#ea580c',
    threadCount: 167,
    icon: 'Briefcase'
  }
];

export const mockReplies: Reply[] = [
  {
    id: 'r1',
    content: 'Great question! I\'ve been using React hooks extensively and they\'ve really simplified my component logic. The useEffect hook is particularly powerful for handling side effects.',
    author: mockUsers[1],
    threadId: '1',
    createdAt: '2024-12-15T10:30:00Z',
    votes: 12,
    replies: [
      {
        id: 'r1-1',
        content: 'Totally agree! Have you tried the new useMemo hook for performance optimization?',
        author: mockUsers[2],
        threadId: '1',
        parentId: 'r1',
        createdAt: '2024-12-15T11:00:00Z',
        votes: 5,
        replies: []
      }
    ]
  },
  {
    id: 'r2',
    content: 'I recommend checking out the official React documentation. It has some excellent examples and best practices.',
    author: mockUsers[0],
    threadId: '1',
    createdAt: '2024-12-15T14:15:00Z',
    votes: 8,
    replies: []
  }
];

export const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Best practices for React hooks in 2024?',
    content: 'I\'ve been diving deeper into React hooks lately and wondering what the community considers best practices. What are your thoughts on custom hooks vs built-in ones?',
    author: mockUsers[0],
    category: mockCategories[1],
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-15T14:15:00Z',
    votes: 23,
    replyCount: 3,
    isLocked: false,
    isPinned: true,
    tags: ['react', 'hooks', 'best-practices'],
    replies: mockReplies
  },
  {
    id: '2',
    title: 'How to optimize mobile app performance?',
    content: 'My React Native app is running slow on older devices. Looking for tips on performance optimization and best practices for mobile development.',
    author: mockUsers[1],
    category: mockCategories[2],
    createdAt: '2024-12-14T16:45:00Z',
    updatedAt: '2024-12-14T16:45:00Z',
    votes: 15,
    replyCount: 7,
    isLocked: false,
    isPinned: false,
    tags: ['react-native', 'performance', 'mobile'],
    replies: []
  },
  {
    id: '3',
    title: 'UI/UX trends for 2025',
    content: 'What design trends are you excited about for 2025? I\'m particularly interested in micro-interactions and accessibility improvements.',
    author: mockUsers[2],
    category: mockCategories[3],
    createdAt: '2024-12-14T11:20:00Z',
    updatedAt: '2024-12-14T11:20:00Z',
    votes: 31,
    replyCount: 12,
    isLocked: false,
    isPinned: false,
    tags: ['ui-ux', 'design-trends', 'accessibility'],
    replies: []
  },
  {
    id: '4',
    title: 'Landing your first tech job - Tips and experiences',
    content: 'Recently landed my first developer position! Happy to share what worked for me and would love to hear others\' experiences.',
    author: mockUsers[0],
    category: mockCategories[4],
    createdAt: '2024-12-13T20:10:00Z',
    updatedAt: '2024-12-13T20:10:00Z',
    votes: 45,
    replyCount: 18,
    isLocked: false,
    isPinned: false,
    tags: ['career', 'job-search', 'advice'],
    replies: []
  },
  {
    id: '5',
    title: 'Welcome to our community! Introduce yourself',
    content: 'New members, feel free to introduce yourself here! Tell us about your background, interests, and what you hope to learn.',
    author: mockUsers[1],
    category: mockCategories[0],
    createdAt: '2024-12-12T08:00:00Z',
    updatedAt: '2024-12-15T12:30:00Z',
    votes: 67,
    replyCount: 34,
    isLocked: false,
    isPinned: true,
    tags: ['introduction', 'community', 'welcome'],
    replies: []
  }
];