// CommentBox.jsx (PREMIUM REDESIGN + moderation + mentions)
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { LuSend } from "react-icons/lu";
import { ThumbsUp, MessageSquare, MoreHorizontal, ChevronDown, Trash2, Flag, AtSign } from 'lucide-react';
import { setComment } from '@/redux/commentSlice';
import CommentSkeleton from './CommentSkeleton';
import TimeAgo from './TimeAgo';

import socket from '@/lib/socket';
const API = "https://kgserver-bjy2.onrender.com/api/v1";

// Matches the mention syntax we insert into the textarea: [@Name](mention:USER_ID)
const MENTION_REGEX = /\[@([^\]]+)\]\(mention:([a-f\d]{24})\)/gi;

const extractMentionIds = (text = '') => {
  const ids = new Set();
  let match;
  const re = new RegExp(MENTION_REGEX);
  while ((match = re.exec(text)) !== null) ids.add(match[2]);
  return Array.from(ids);
};

// Renders @mentions as highlighted chips instead of plain links, everything
// else falls through to a normal markdown link.
const MarkdownLink = ({ href, children }) => {
  if (href?.startsWith('mention:')) {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium text-[0.95em] not-prose">
        {children}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const markdownComponents = { a: MarkdownLink };

const proseClass =
  "prose prose-sm dark:prose-invert max-w-none leading-relaxed " +
  "[&_table]:w-full [&_table]:my-3 [&_table]:border-collapse [&_table]:text-[13px] " +
  "[&_th]:border [&_th]:border-gray-200 dark:[&_th]:border-zinc-700 [&_th]:bg-gray-50 dark:[&_th]:bg-zinc-800 [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold " +
  "[&_td]:border [&_td]:border-gray-200 dark:[&_td]:border-zinc-700 [&_td]:px-2.5 [&_td]:py-1.5 " +
  "[&_pre]:bg-[#1e293b] [&_pre]:text-gray-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-[13px] " +
  "[&_code]:bg-gray-100 dark:[&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px]";

// ─── Mention-aware textarea ────────────────────────────────────────
// Plain <textarea> that shows a user-search dropdown when you type "@".
// Selecting a user inserts [@Name](mention:id) at the cursor — unambiguous
// to parse back out on submit, at the cost of showing raw markdown syntax
// while composing (acceptable tradeoff for a lightweight implementation).
const MentionTextarea = ({ value, onChange, placeholder, className, users, autoFocus, minHeight = 'min-h-[80px]' }) => {
  const ref = useRef(null);
  const [menu, setMenu] = useState(null); // { query, start, end }

  const handleChange = (e) => {
    const text = e.target.value;
    const cursor = e.target.selectionStart;
    onChange(text);

    const upToCursor = text.slice(0, cursor);
    const atMatch = upToCursor.match(/@([a-zA-Z0-9._-]{0,20})$/);
    if (atMatch) {
      setMenu({ query: atMatch[1].toLowerCase(), start: cursor - atMatch[0].length, end: cursor });
    } else {
      setMenu(null);
    }
  };

  const filtered = menu
    ? users
        .filter(u => `${u.firstName} ${u.lastName || ''}`.toLowerCase().includes(menu.query))
        .slice(0, 6)
    : [];

  const pickUser = (u) => {
    if (!menu) return;
    const name = `${u.firstName}${u.lastName ? ' ' + u.lastName : ''}`;
    const insertion = `[@${name}](mention:${u._id}) `;
    const newText = value.slice(0, menu.start) + insertion + value.slice(menu.end);
    onChange(newText);
    setMenu(null);
    requestAnimationFrame(() => ref.current?.focus());
  };

  return (
    <div className="relative">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={className || `w-full ${minHeight} border-none outline-none resize-y bg-transparent text-[15px] leading-relaxed text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 dark:placeholder:text-zinc-500`}
      />
      {menu && filtered.length > 0 && (
        <div className="absolute z-20 left-0 top-full mt-1 w-64 max-h-56 overflow-y-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg py-1">
          {filtered.map(u => (
            <button
              key={u._id}
              type="button"
              onClick={() => pickUser(u)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={u.photoUrl} />
                <AvatarFallback className="text-[10px]">{u.firstName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-800 dark:text-zinc-200">
                {u.firstName} {u.lastName}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [activeReactions, setActiveReactions] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);

  const commentRef = useRef(comment);
  useEffect(() => { commentRef.current = comment }, [comment]);

  const isBlogOwner = user && selectedBlog?.author?._id === user._id;

  useEffect(() => {
    axios.get(`${API}/user/all-users`)
      .then(res => {
        if (res.data.success) {
          setAllUsers((res.data.users || []).filter(u => u._id !== user?._id));
        }
      })
      .catch(() => {});
  }, [user?._id]);

  useEffect(() => {
    socket.on("newComment", (newComment) => {
      if (newComment.postId === selectedBlog._id) {
        const current = Array.isArray(commentRef.current) ? commentRef.current : [];
        dispatch(setComment([...current, newComment]));
      }
    });
    return () => socket.off("newComment");
  }, [selectedBlog._id, dispatch]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/comment/${selectedBlog._id}/comment/all`);
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

  const sendComment = async (parentId = null) => {
    const text = parentId ? replyText : content;
    if (!text.trim()) return toast.error("Comment cannot be empty");
    if (!user) return toast.error("Sign in to comment");

    try {
      const mentions = extractMentionIds(text);
      const res = await axios.post(
        `${API}/comment/${selectedBlog._id}/create`,
        { content: text, parentId, mentions },
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    }
  };

  const handleLike = async (id) => {
    if (!user) return toast.error("Sign in to like comments");
    try {
      const res = await axios.get(`${API}/comment/${id}/like`, { withCredentials: true });
      if (res.data.success) {
        const current = Array.isArray(comment) ? comment : [];
        dispatch(setComment(current.map(c => c._id === id ? res.data.updatedComment : c)));
      }
    } catch {
      toast.error("Like failed");
    }
  };

  const confirmDelete = async () => {
    const id = deleteTarget;
    setDeleteTarget(null);
    if (!id) return;
    try {
      const res = await axios.delete(`${API}/comment/${id}/delete`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Comment deleted");
        const current = Array.isArray(comment) ? comment : [];
        dispatch(setComment(current.filter(c => c._id !== id && c.parentId !== id)));
        setReplyMap(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const confirmReport = async () => {
    const id = reportTarget;
    setReportTarget(null);
    if (!id) return;
    try {
      const res = await axios.post(`${API}/comment/${id}/report`, {}, { withCredentials: true });
      toast.success(res.data.message || "Comment reported");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report comment");
    }
  };

  const toggleReaction = useCallback((commentId, emoji) => {
    setActiveReactions(prev => ({
      ...prev,
      [commentId]: { ...prev[commentId], [emoji]: !prev[commentId]?.[emoji] }
    }));
  }, []);

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const startReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const topLevelComments = Array.isArray(comment) ? comment.filter(c => !c.parentId) : [];

  const renderReactions = (c) => {
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

  const renderReplyComposer = (parentId) => (
    <div className="mt-3 ml-[54px] sm:ml-[54px] p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/5 transition-all">
      <MentionTextarea
        value={replyText}
        onChange={setReplyText}
        placeholder="Write a reply... type @ to mention someone"
        users={allUsers}
        autoFocus
        minHeight="min-h-[60px]"
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

  const renderCommentMenu = (c) => {
    const isOwner = user && c.userId?._id === user._id;
    const canDelete = isOwner || isBlogOwner;
    if (!user) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-600 dark:hover:text-zinc-300 transition-all">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canDelete && (
            <DropdownMenuItem
              onClick={() => setDeleteTarget(c._id)}
              className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          )}
          {!isOwner && (
            <DropdownMenuItem
              onClick={() => setReportTarget(c._id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Flag size={14} />
              Report
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

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
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-gray-900 dark:text-zinc-100">
                  {c.userId?.firstName} {c.userId?.lastName}
                </span>
                <span className="text-[12px] text-gray-400 dark:text-zinc-500">
                  <TimeAgo date={c.createdAt} />
                </span>
              </div>
              {renderCommentMenu(c)}
            </div>
            <div className={`${proseClass} text-[14px] text-gray-600 dark:text-zinc-400`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {c.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={c._id} className="group">
        <div className="flex gap-3.5 p-4 -mx-2 rounded-xl transition-colors hover:bg-white dark:hover:bg-zinc-900/50">
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

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
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
              {renderCommentMenu(c)}
            </div>

            <div className={`${proseClass} text-[15px] text-gray-600 dark:text-zinc-400 mb-2`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {c.content}
              </ReactMarkdown>
            </div>

            {renderReactions(c)}

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
            </div>

            {replyingTo === c._id && renderReplyComposer(c._id)}

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

        {showReplies[c._id] && hasReplies && (
          <div className="ml-[54px] pl-4 border-l-2 border-gray-100 dark:border-zinc-800">
            {replies.map(r => renderComment(r, true))}
          </div>
        )}
      </div>
    );
  };

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
      <div className="flex items-center gap-3 pb-5 border-b border-gray-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Discussion
        </h2>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
          {topLevelComments.length}
        </span>
      </div>

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

        <MentionTextarea
          value={content}
          onChange={setContent}
          placeholder="Share your thoughts... type @ to mention someone, use **bold**, or make a | table |"
          users={allUsers}
          className="w-full min-h-[80px] border-0 shadow-none resize-y text-[15px] leading-relaxed bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <span className="text-xs text-gray-400 dark:text-zinc-500 hidden sm:flex items-center gap-1">
            <AtSign size={12} /> mention · <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[11px] border border-gray-200 dark:border-zinc-700">**bold**</kbd>{' '}
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone. Any replies to this comment will be deleted too.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!reportTarget} onOpenChange={(open) => !open && setReportTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              We'll review it against our community guidelines. Comments reported multiple times are automatically hidden pending review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReport}>
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentBox;
