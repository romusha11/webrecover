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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer hover:shadow-md group relative"
      onClick={() => onThreadClick(thread)}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Vote section */}
          <div className="flex flex-col items-center space-y-1 min-w-[48px]">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowUp size={16} />
            </button>
            <span className={`text-sm font-medium ${thread.votes > 0 ? 'text-green-600' : thread.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {thread.votes}
            </span>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowDown size={16} />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Title with badges */}
                <div className="flex items-center space-x-2 mb-2">
                  {thread.isPinned && (
                    <Pin size={16} className="text-green-600 flex-shrink-0" />
                  )}
                  {thread.isLocked && (
                    <Lock size={16} className="text-gray-500 flex-shrink-0" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {thread.title}
                  </h3>
                </div>
                {/* Content preview */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {thread.content}
                </p>
                {/* Tags */}
                {thread.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag size={14} className="text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {thread.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Meta info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <img
                        src={thread.author.avatar}
                        alt={thread.author.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium">{thread.author.username}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{formatTimeAgo(thread.createdAt)}</span>
                    </div>
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${thread.category.color}20`,
                        color: thread.category.color
                      }}
                    >
                      {thread.category.name}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} />
                      <span>{thread.replyCount}</span>
                    </div>
                    {user && (
                      <button
                        className={`ml-2 ${isBookmarked ? "text-blue-600" : "text-gray-400"} hover:text-blue-700`}
                        onClick={e => { e.stopPropagation(); isBookmarked ? removeBookmark(thread.id) : addBookmark(thread.id); }}
                        title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        <Bookmark size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Responsive: show bookmark icon on mobile */}
      {user && (
        <button
          className={`absolute top-4 right-4 ${isBookmarked ? "text-blue-600" : "text-gray-400"} hover:text-blue-700 md:hidden`}
          onClick={e => { e.stopPropagation(); isBookmarked ? removeBookmark(thread.id) : addBookmark(thread.id); }}
          title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark size={20} />
        </button>
      )}
    </div>
  );
}
