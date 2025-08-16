import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, MessageCircle, Share, MoreHorizontal, Clock, Tag, Pin, Lock } from 'lucide-react';
import { Thread, Reply } from '../types/forum';

interface ThreadViewProps {
  thread: Thread;
  onBack: () => void;
}

// Komponen Reply (nested, responsive)
function ReplyComponent({ reply, depth = 0 }: { reply: Reply; depth?: number }) {
  const [showReplies, setShowReplies] = useState(true);

  // Format waktu reply
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
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-start gap-3">
          {/* Voting reply */}
          <div className="flex flex-col items-center gap-1">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700 transition" aria-label="Vote up">
              <ArrowUp size={14} />
            </button>
            <span className={`text-xs font-bold ${reply.votes > 0 ? 'text-green-600' : reply.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {reply.votes}
            </span>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-700 transition" aria-label="Vote down">
              <ArrowDown size={14} />
            </button>
          </div>
          {/* Content reply */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={reply.author.avatar}
                alt={reply.author.username}
                className="w-7 h-7 rounded-full"
              />
              <span className="font-semibold text-gray-900">{reply.author.username}</span>
              <span className="text-xs text-gray-500">{reply.author.reputation} rep</span>
              <span className="text-xs text-gray-400">• {formatTimeAgo(reply.createdAt)}</span>
            </div>
            <p className="text-gray-700 mb-2 leading-relaxed break-words">{reply.content}</p>
            <div className="flex items-center gap-4 text-xs">
              <button className="text-blue-500 hover:text-blue-700 transition font-bold" aria-label="Balas">Reply</button>
              <button className="text-gray-500 hover:text-blue-600 transition" aria-label="Share reply">Share</button>
              <button className="text-gray-500 hover:text-gray-700 transition" aria-label="Lainnya">
                <MoreHorizontal size={14} />
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

  // Format waktu thread
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
    <div className="max-w-4xl mx-auto">
      {/* Navigasi back */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-900 transition mb-4 font-semibold"
          aria-label="Kembali ke list thread"
        >
          <ArrowLeft size={20} />
          <span>Back to threads</span>
        </button>
        {/* Thread utama */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            {/* Voting thread */}
            <div className="flex flex-col items-center gap-1">
              <button className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-700 transition" aria-label="Vote up">
                <ArrowUp size={20} />
              </button>
              <span className={`text-lg font-bold ${thread.votes > 0 ? 'text-green-600' : thread.votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {thread.votes}
              </span>
              <button className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-red-700 transition" aria-label="Vote down">
                <ArrowDown size={20} />
              </button>
            </div>
            {/* Content thread */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {thread.isPinned && <Pin size={18} className="text-green-600" title="Pinned" />}
                {thread.isLocked && <Lock size={18} className="text-gray-500" title="Locked" />}
                <h1 className="text-2xl font-black text-gray-900">{thread.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={thread.author.avatar}
                    alt={thread.author.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-semibold">{thread.author.username}</span>
                  <span>{thread.author.reputation} rep</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatTimeAgo(thread.createdAt)}</span>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    backgroundColor: `${thread.category.color}20`,
                    color: thread.category.color
                  }}
                >
                  {thread.category.name}
                </div>
              </div>
              <p className="text-gray-700 mb-3 leading-relaxed text-base break-words">{thread.content}</p>
              {/* Tags */}
              {thread.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {thread.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-sm">
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-900 transition font-semibold" aria-label="Reply">
                  <MessageCircle size={16} />
                  <span>{thread.replyCount} replies</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition" aria-label="Share thread">
                  <Share size={16} />
                  <span>Share</span>
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition" aria-label="Lainnya">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Replies */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-black text-gray-900 mb-2">
          Replies ({thread.replyCount})
        </h2>
        {thread.replies.length > 0 ? (
          thread.replies.map((reply) => (
            <ReplyComponent key={reply.id} reply={reply} />
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">Belum ada balasan di thread ini.</div>
        )}
      </div>
      {/* Form reply */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add your reply</h3>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Tulis pendapatmu, jawaban, atau pertanyaan..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-400">Markdown supported</div>
          <button
            disabled={!replyText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-bold transition"
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
                    }}
