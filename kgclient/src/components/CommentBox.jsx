// CommentBox.jsx (PREMIUM REDESIGN)
import React, { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { LuSend } from "react-icons/lu";
import { ThumbsUp, MessageSquare, MoreHorizontal, ChevronDown } from 'lucide-react';
import { setComment } from '@/redux/commentSlice';
import CommentSkeleton from './CommentSkeleton';
import TimeAgo from './TimeAgo';

const socket = io("https://kgserver-bjy2.onrender.com");

// ─── Reaction Emojis Config ──────────────────────────────────────
const REACTION_EMOJIS = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '🔥', label: 'Fire' },
];

const CommentBox = ({ selectedBlog }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { comment } = useSelector(state => state.comment);

  const [content, setContent] = useState("");
  const [replyMap, setReplyMap] = useState({});
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplies, setShowReplies] = useState({});
  const [activeReactions, setActiveReactions] = useState({}); // { commentId: { emoji: boolean } }

  const commentRef = useRef(comment);
  useEffect(() => { commentRef.current = comment }, [comment]);

  // ─── Socket Listeners ──────────────────────────────────────────
  useEffect(() => {
    socket.on("newComment", (newComment) => {
      if (newComment.postId === selectedBlog._id) {
        const current = Array.isArray(commentRef.current) ? commentRef.current : [];
        dispatch(setComment([...current, newComment]));
      }
    });
    return () => socket.off("newComment");
  }, [selectedBlog._id, dispatch]);

  // ─── Fetch Comments ──────────────────────────────────────────────
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://kgserver-bjy2.onrender.com/api/v1/comment/${selectedBlog._id}/comment/all`
        );
        // Guard against a non-array response (failed request, unexpected
        // shape, etc.) — .forEach on anything else would crash the page.
        const comments = Array.isArray(res.data.comments) ? res.data.comments : [];
        dispatch(setComment(comments));

        const map = {};
        comments.forEach(c => {
          if (c.parentId) {
            if (!map[c.parentId]) map[c.parentId] = [];
            map[c.parentId].push(c);
          }
        });
        setReplyMap(map);
      } catch {
        toast.error("Failed to load comments");
        dispatch(setComment([]));
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [selectedBlog._id, dispatch]);

  // ─── Send Comment / Reply ────────────────────────────────────────
  const sendComment = async (parentId = null) => {
    const text = parentId ? replyText : content;
    if (!text.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await axios.post(
        `https://kgserver-bjy2.onrender.com/api/v1/comment/${selectedBlog._id}/create`,
        { content: text, parentId },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(parentId ? "Reply posted" : "Comment posted");
        if (parentId) {
          setReplyText("");
          setReplyingTo(null);
          setShowReplies(prev => ({ ...prev, [parentId]: true }));
        } else {
          setContent("");
        }
      }
    } catch {
      toast.error("Failed to post");
    }
  };

  // ─── Like Comment ────────────────────────────────────────────────
  const handleLike = async (id) => {
    try {
      const res = await axios.get(
        `https://kgserver-bjy2.onrender.com/api/v1/comment/${id}/like`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const current = Array.isArray(comment) ? comment : [];
        dispatch(setComment(current.map(c => c._id === id ? res.data.updatedComment : c)));
      }
    } catch {
      toast.error("Like failed");
    }
  };

  // ─── Toggle Reactions ────────────────────────────────────────────
  const toggleReaction = useCallback((commentId, emoji) => {
    setActiveReactions(prev => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        [emoji]: !prev[commentId]?.[emoji]
      }
    }));
  }, []);

  // ─── Toggle Replies Visibility ───────────────────────────────────
  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // ─── Start Reply ─────────────────────────────────────────────────
  const startReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  // ─── Cancel Reply ──────────────────────────────────────────────
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const topLevelComments = Array.isArray(comment) ? comment.filter(c => !c.parentId) : [];

  // ─── Render Reactions for a Comment ────────────────────────────
  const renderReactions = (c) => {
    // c.reactions is a Mongoose Map on the backend, which serializes to a
    // plain object ({}) in JSON — never an array. `{} || fallback` doesn't
    // fall through since {} is truthy, so this must be an explicit
    // Array.isArray check, or reactions.map() below crashes on every comment.
    const reactions = Array.isArray(c.reactions) && c.reactions.length > 0
      ? c.reactions
      : [
      { emoji: '👍', count: c.numberOfLikes || 0, active: user && c.likes?.includes(user._id) }
    ];

    return (
      <div className="flex gap-1.5 mt-2.5 mb-1">
        {reactions.map((r, i) => (
          <button
            key={i}
            onClick={() => toggleReaction(c._id, r.emoji)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border transition-all duration-150 select-none
              ${activeReactions[c._id]?.[r.emoji] || r.active
                ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
          >
            <span className="text-base leading-none">{r.emoji}</span>
            <span className="text-xs font-semibold tabular-nums min-w-[1ch] text-center">
              {r.count + (activeReactions[c._id]?.[r.emoji] ? 1 : 0)}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // ─── Render Reply Composer ─────────────────────────────────────
  const renderReplyComposer = (parentId) => (
    <div className="mt-3 ml-[54px] sm:ml-[54px] p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/5 transition-all">
      <textarea
        value={replyText}
        onChange={e => setReplyText(e.target.value)}
        placeholder="Write a reply..."
        className="w-full min-h-[60px] border-none outline-none resize-y bg-transparent text-[15px] leading-relaxed text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <button
          onClick={cancelReply}
          className="px-4 py-1.5 text-[13px] font-semibold text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          onClick={() => sendComment(parentId)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-full transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0"
        >
          <LuSend size={13} />
          Reply
        </button>
      </div>
    </div>
  );

  // ─── Render Single Comment ─────────────────────────────────────
  const renderComment = (c, isReply = false) => {
    const replies = replyMap[c._id] || [];
    const hasReplies = replies.length > 0;
    const isLiked = user && c.likes?.includes(user._id);

    if (isReply) {
      return (
        <div key={c._id} className="flex gap-3 py-3.5">
          <Avatar className="w-8 h-8 flex-shrink-0 border-2 border-gray-100 dark:border-zinc-800">
            <AvatarImage src={c.userId?.photoUrl} />
            <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs font-bold">
              {c.userId?.firstName?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[13px] font-semibold text-gray-900 dark:text-zinc-100">
                {c.userId?.firstName} {c.userId?.lastName}
              </span>
              <span className="text-[12px] text-gray-400 dark:text-zinc-500">
                <TimeAgo date={c.createdAt} />
              </span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-[14px] leading-relaxed text-gray-600 dark:text-zinc-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {c.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      );
    }

    // Top-level comment
    return (
      <div key={c._id} className="group">
        <div className="flex gap-3.5 p-4 -mx-2 rounded-xl transition-colors hover:bg-white dark:hover:bg-zinc-900/50">
          {/* Avatar Column with Thread Line */}
          <div className="flex flex-col items-center flex-shrink-0">
            <Avatar className="w-10 h-10 border-2 border-gray-100 dark:border-zinc-800 shadow-sm">
              <AvatarImage src={c.userId?.photoUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold">
                {c.userId?.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            {(hasReplies || replyingTo === c._id) && (
              <div className="w-[2px] flex-1 bg-gray-100 dark:bg-zinc-800 mt-2 rounded-full" />
            )}
          </div>

          {/* Comment Body */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                {c.userId?.firstName} {c.userId?.lastName}
              </span>
              {c.userId?._id === selectedBlog?.author?._id && (
                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Author
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-zinc-500">
                <TimeAgo date={c.createdAt} />
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed text-gray-600 dark:text-zinc-400 mb-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {c.content}
              </ReactMarkdown>
            </div>

            {/* Reactions */}
            {renderReactions(c)}

            {/* Action Bar */}
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <button
                onClick={() => handleLike(c._id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all
                  ${isLiked
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-zinc-300'
                  }`}
              >
                <ThumbsUp size={14} className={isLiked ? 'fill-blue-600 dark:fill-blue-400' : ''} />
                <span className="tabular-nums">{c.numberOfLikes || 0}</span>
              </button>

              <button
                onClick={() => startReply(c._id)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-zinc-300 transition-all"
              >
                <MessageSquare size={14} />
                Reply
              </button>

              <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700 mx-1" />

              <button className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-zinc-300 transition-all">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Inline Reply Composer */}
            {replyingTo === c._id && renderReplyComposer(c._id)}

            {/* View Replies Toggle */}
            {hasReplies && replyingTo !== c._id && (
              <button
                onClick={() => toggleReplies(c._id)}
                className="inline-flex items-center gap-1.5 mt-3 ml-0 text-[13px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-all"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showReplies[c._id] ? 'rotate-180' : ''}`}
                />
                {showReplies[c._id] ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
              </button>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {showReplies[c._id] && hasReplies && (
          <div className="ml-[54px] pl-4 border-l-2 border-gray-100 dark:border-zinc-800">
            {replies.map(r => renderComment(r, true))}
          </div>
        )}
      </div>
    );
  };

  // ─── Skeleton Loader ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex-shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3.5 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Discussion
        </h2>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
          {topLevelComments.length}
        </span>
      </div>

      {/* Main Composer */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl p-5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/5">
        <div className="flex items-center gap-3 mb-3.5">
          <Avatar className="w-9 h-9 border-2 border-gray-100 dark:border-zinc-800">
            <AvatarImage src={user?.photoUrl} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold">
              {user?.firstName?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </div>
            <div className="text-xs text-gray-400 dark:text-zinc-500">
              {user ? 'Posting as yourself' : 'Sign in to comment'}
            </div>
          </div>
        </div>

        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share your thoughts on this article... Use **bold**, *italic*, or `code`."
          className="border-0 shadow-none resize-y min-h-[80px] text-[15px] leading-relaxed bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <span className="text-xs text-gray-400 dark:text-zinc-500 hidden sm:inline">
            Supports <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[11px] border border-gray-200 dark:border-zinc-700">**bold**</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[11px] border border-gray-200 dark:border-zinc-700">*italic*</kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[11px] border border-gray-200 dark:border-zinc-700">`code`</kbd>
          </span>
          <Button
            onClick={() => sendComment()}
            disabled={!content.trim()}
            className="h-9 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0"
          >
            <LuSend size={14} />
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments Thread */}
      <div className="space-y-1">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <MessageSquare size={28} className="text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No comments yet</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Be the first to share your thoughts on this article.</p>
          </div>
        ) : (
          topLevelComments.map(c => renderComment(c))
        )}
      </div>
    </div>
  );
};

export default CommentBox;
