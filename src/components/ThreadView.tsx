import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Share, MoreHorizontal, Clock, Tag, Pin, Lock } from 'lucide-react';
import { Thread, Reply } from '../types/forum';

interface ThreadViewProps {
  thread: Thread;
  onBack: () => void;
}

function ReplyComponent({ reply, depth = 0 }: { reply: Reply; depth?: number }) {
  const [showReplies, setShowReplies] = useState(true);

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
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-start space-x-3">
          {/* Vote section */}
          <div className="flex flex-col items-center space-y-1">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowUp size={14} />
            </button>
            <span className={`text-xs font-medium ${reply.votes > 0 ? 'text-green-600' : reply.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {reply.votes}
            </span>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowDown size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={reply.author.avatar}
                alt={reply.author.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-medium text-gray-900">{reply.author.username}</span>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{reply.author.reputation} rep</span>
                  <span>•</span>
                  <span>{formatTimeAgo(reply.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3 leading-relaxed">
              {reply.content}
            </p>
            
            <div className="flex items-center space-x-4 text-sm">
              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                Reply
              </button>
              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                Share
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {reply.replies && reply.replies.length > 0 && (
        <div className={showReplies ? '' : 'hidden'}>
          {reply.replies.map((nestedReply) => (
            <ReplyComponent key={nestedReply.id} reply={nestedReply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ThreadView({ thread, onBack }: ThreadViewProps) {
  const [replyText, setReplyText] = useState('');

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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to threads</span>
        </button>

        {/* Thread header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            {/* Vote section */}
            <div className="flex flex-col items-center space-y-1">
              <button className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowUp size={20} />
              </button>
              <span className={`text-lg font-bold ${thread.votes > 0 ? 'text-green-600' : thread.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {thread.votes}
              </span>
              <button className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowDown size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                {thread.isPinned && (
                  <Pin size={18} className="text-green-600" />
                )}
                {thread.isLocked && (
                  <Lock size={18} className="text-gray-500" />
                )}
                <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <img
                    src={thread.author.avatar}
                    alt={thread.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{thread.author.username}</span>
                  <span>•</span>
                  <span>{thread.author.reputation} rep</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{formatTimeAgo(thread.createdAt)}</span>
                </div>
                
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${thread.category.color}20`,
                    color: thread.category.color
                  }}
                >
                  {thread.category.name}
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed text-base">
                {thread.content}
              </p>

              {/* Tags */}
              {thread.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <Tag size={16} className="text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {thread.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                  <MessageCircle size={16} />
                  <span>{thread.replyCount} replies</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                  <Share size={16} />
                  <span>Share</span>
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Replies ({thread.replyCount})
        </h2>
        
        {thread.replies.map((reply) => (
          <ReplyComponent key={reply.id} reply={reply} />
        ))}
      </div>

      {/* Reply form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add your reply</h3>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            <span>Markdown supported</span>
          </div>
          <button
            disabled={!replyText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
}