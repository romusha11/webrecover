import React from 'react';
import { ArrowUp, ArrowDown, MessageCircle, Pin, Lock, Clock, Tag, Bookmark } from 'lucide-react';
import { Thread } from '../types/forum';
import { useAuth } from '../context/AuthContext';

interface ThreadCardProps {
  thread: Thread;
  onThreadClick: (thread: Thread) => void;
}

export default function ThreadCard({ thread, onThreadClick }: ThreadCardProps) {
  const { user, addBookmark, removeBookmark } = useAuth();
  const isBookmarked = user?.bookmarks?.includes(thread.id);

  // Format waktu (ID, short)
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes}m lalu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}j lalu`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}h lalu`;
    return `${Math.floor(diffInMinutes / 10080)}mgg lalu`;
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 shadow-sm transition-all cursor-pointer group relative"
      onClick={() => onThreadClick(thread)}
      tabIndex={0}
      role="button"
      aria-label={`Buka thread ${thread.title}`}
    >
      <div className="p-4 sm:p-6 flex items-start gap-3">
        {/* Voting section */}
        <div className="flex flex-col items-center gap-1 min-w-[40px]">
          <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700 transition" aria-label="Vote up">
            <ArrowUp size={16} />
          </button>
          <span className={`text-sm font-bold ${thread.votes > 0 ? 'text-green-600' : thread.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {thread.votes}
          </span>
          <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-700 transition" aria-label="Vote down">
            <ArrowDown size={16} />
          </button>
        </div>
        {/* Main content */}
        <div className="flex-1">
          {/* Title + Badges */}
          <div className="flex items-center gap-2 mb-1">
            {thread.isPinned && <Pin size={16} className="text-green-600" title="Pinned" />}
            {thread.isLocked && <Lock size={16} className="text-gray-500" title="Locked" />}
            <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-blue-700 transition line-clamp-1">
              {thread.title}
            </h3>
          </div>
          {/* Content preview (responsive) */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{thread.content}</p>
          {/* Tags */}
          {thread.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <Tag size={14} className="text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {thread.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img
                src={thread.author.avatar}
                alt={thread.author.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-semibold">{thread.author.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatTimeAgo(thread.createdAt)}</span>
            </div>
            <div 
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{ 
                backgroundColor: `${thread.category.color}20`,
                color: thread.category.color
              }}
            >
              {thread.category.name}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{thread.replyCount}</span>
            </div>
            {user && (
              <button
                className={`ml-2 ${isBookmarked ? "text-blue-600" : "text-gray-400"} hover:text-blue-700 transition`}
                onClick={e => { e.stopPropagation(); isBookmarked ? removeBookmark(thread.id) : addBookmark(thread.id); }}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                aria-label={isBookmarked ? "Hapus bookmark" : "Bookmark thread"}
              >
                <Bookmark size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Bookmark icon mobile */}
      {user && (
        <button
          className={`absolute top-4 right-4 ${isBookmarked ? "text-blue-600" : "text-gray-400"} hover:text-blue-700 md:hidden`}
          onClick={e => { e.stopPropagation(); isBookmarked ? removeBookmark(thread.id) : addBookmark(thread.id); }}
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-label={isBookmarked ? "Hapus bookmark" : "Bookmark thread"}
        >
          <Bookmark size={20} />
        </button>
      )}
    </div>
  );
      }
