import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, MessageSquare, Bookmark, Share2, Clock, Calendar, Link2, Facebook } from 'lucide-react';
import { FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CommentBox from '@/components/CommentBox';
import axios from 'axios';
import { setBlog, upsertBlog } from '@/redux/blogSlice';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import io from 'socket.io-client';

const socket = io('https://kgserver-bjy2.onrender.com');
const SITE_URL = 'https://qspaceblog.vercel.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
const stripHtml = (str = '') => String(str).replace(/<[^>]*>/g, '').trim();

const BlogView = () => {
  const { blogId } = useParams();
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const selectedBlog = Array.isArray(blog) ? blog.find((b) => b._id === blogId) : null;

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(selectedBlog?.likes?.length || 0);
  const [dislikeCount, setDislikeCount] = useState(selectedBlog?.dislikes?.length || 0);
  const [loading, setLoading] = useState(true);
  const [markedRead, setMarkedRead] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedBlog && user) {
      setLiked(selectedBlog.likes.includes(user._id));
      setDisliked(selectedBlog.dislikes.includes(user._id));
    }
    setTimeout(() => setLoading(false), 800);
  }, [selectedBlog, user]);

  useEffect(() => {
    if (!selectedBlog && blogId) {
      axios
        .get(`https://kgserver-bjy2.onrender.com/api/v1/blog/${blogId}`)
        .then((res) => {
          if (res.data.success) {
            dispatch(upsertBlog(res.data.blog));
          } else {
            toast.error('Blog not found.');
          }
        })
        .catch(() => toast.error('Failed to load blog.'));
    }
  }, [selectedBlog, blogId, dispatch]);

  useEffect(() => {
    socket.on('reactionUpdate', ({ blogId: updatedId, likes, dislikes }) => {
      if (updatedId === selectedBlog?._id) {
        setLikeCount(likes.length);
        setDislikeCount(dislikes.length);
      }
    });
    return () => socket.off('reactionUpdate');
  }, [selectedBlog]);

  const toggleReaction = async (action) => {
    try {
      const res = await axios.post(
        `https://kgserver-bjy2.onrender.com/api/v1/blog/${selectedBlog?._id}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        socket.emit('updateReaction', selectedBlog._id);

        const updated = res.data.blog;
        const updatedBlog = blog.map((b) => (b._id === updated._id ? updated : b));
        dispatch(setBlog(updatedBlog));

        setLikeCount(updated.likes.length);
        setDislikeCount(updated.dislikes.length);
        setLiked(updated.likes.includes(user._id));
        setDisliked(updated.dislikes.includes(user._id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reaction failed');
    }
  };

  const handleLike = useCallback(() => {
    if (!user) return toast.error('Sign in to like this post');
    liked ? toggleReaction('unlike') : toggleReaction('like');
  }, [liked, user]);

  const handleDislike = useCallback(() => {
    if (!user) return toast.error('Sign in to dislike this post');
    disliked ? toggleReaction('undislike') : toggleReaction('dislike');
  }, [disliked, user]);

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/blogs/${blogId}`;
  const shareTitle = selectedBlog?.title || 'Check out this blog!';
  const shareText = encodeURIComponent(shareTitle);

  const handleNativeShare = useCallback(() => {
    navigator.share({ title: shareTitle, text: selectedBlog?.subtitle || '', url: shareUrl });
  }, [shareUrl, shareTitle, selectedBlog]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  }, [shareUrl]);

  const estimateReadTime = (htmlContent) => {
    if (!htmlContent) return 5;
    const text = htmlContent.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // ─── Skeleton Loader ─────────────────────────────────────────────
  if (loading || !selectedBlog) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f]">
        <div className="max-w-[800px] mx-auto px-6 pt-20 pb-20">
          <Skeleton className="h-5 w-32 mb-6 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-20 mb-8 rounded-full bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-12 w-full mb-3 rounded-lg bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-12 w-3/4 mb-3 rounded-lg bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-6 w-2/3 mb-10 rounded-lg bg-gray-200 dark:bg-zinc-800" />
          
          <div className="flex items-center gap-4 py-6 border-y border-gray-100 dark:border-zinc-800 mb-8">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
            <div>
              <Skeleton className="h-4 w-40 mb-2 rounded bg-gray-200 dark:bg-zinc-800" />
              <Skeleton className="h-3 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
            </div>
          </div>
          
          <Skeleton className="h-[300px] w-full mb-10 rounded-2xl bg-gray-200 dark:bg-zinc-800" />
          
          <div className="space-y-4">
            <Skeleton className="h-5 w-full rounded bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-full rounded bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-5/6 rounded bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-full rounded bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-5 w-4/5 rounded bg-gray-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  const readTime = estimateReadTime(selectedBlog.description);
  const tags = selectedBlog.tags || ['Next.js', 'React', 'Web Dev', 'JavaScript'];
  const ogDescription = stripHtml(selectedBlog.subtitle || selectedBlog.description || '').slice(0, 200);
  const ogImage = selectedBlog.thumbnail || DEFAULT_OG_IMAGE;

  return (
    <>
      <Helmet>
        <title>{selectedBlog.title} | Qspace Blog</title>
        <meta name="description" content={ogDescription} />
        <link rel="canonical" href={shareUrl} />

        {/* Open Graph — note: Facebook/WhatsApp crawlers don't run JS, so
            these tags only help in-app browsers + SEO. Actual crawler
            previews are served by api/share/[blogId].js via vercel.json */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Qspace Blog" />
        <meta property="og:title" content={selectedBlog.title} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={shareUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={selectedBlog.title} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 z-[1000] transition-[width] duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f0f] text-[#1a1a1a] dark:text-[#f5f5f5] font-sans">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 pt-16 pb-20">
          
          {/* ─── Breadcrumb ─────────────────────────────────────── */}
          <nav className="text-[13px] text-gray-400 dark:text-zinc-500 mb-6 pt-6">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <Link to="/blogs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blogs</Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-[#1a1a1a] dark:text-[#f5f5f5] font-medium truncate">{selectedBlog.title}</span>
          </nav>

          {/* ─── Hero Section ─────────────────────────────────────── */}
          <header className="mb-2">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {selectedBlog.category || 'Technology'}
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a] dark:text-white mb-4">
              {selectedBlog.title}
            </h1>

            {/* Subtitle */}
            {selectedBlog.subtitle && (
              <p className="font-serif text-lg sm:text-xl font-light italic text-gray-500 dark:text-zinc-400 leading-relaxed max-w-[700px]">
                {selectedBlog.subtitle}
              </p>
            )}
          </header>

          {/* ─── Author Bar ─────────────────────────────────────── */}
          <div className="flex items-center justify-between flex-wrap gap-4 py-6 my-8 border-y border-gray-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-3.5">
              <Avatar className="w-12 h-12 border-2 border-gray-100 dark:border-zinc-700 shadow-sm">
                <AvatarImage src={selectedBlog?.author?.photoUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold text-sm">
                  {selectedBlog?.author?.firstName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-[15px] font-semibold text-[#1a1a1a] dark:text-white">
                  {selectedBlog?.author?.firstName || 'Unknown'} {selectedBlog?.author?.lastName || ''}
                </h4>
                <span className="text-[13px] text-gray-400 dark:text-zinc-500">
                  {selectedBlog?.author?.occupation || 'Contributor'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-gray-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {changeTimeFormat(selectedBlog.createdAt)}
              </span>
              <span className="text-gray-300 dark:text-zinc-700">·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {readTime} min read
              </span>
            </div>
          </div>

          {/* ─── Featured Image ─────────────────────────────────── */}
          {selectedBlog.thumbnail && (
            <div className="relative rounded-2xl overflow-hidden mb-12 shadow-lg group">
              <img
                src={selectedBlog.thumbnail}
                alt={selectedBlog.title}
                className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="eager"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
              {selectedBlog.imageCaption && (
                <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white/80 text-sm italic">{selectedBlog.imageCaption}</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Article Content ─────────────────────────────────── */}
          <article className="prose dark:prose-invert prose-lg max-w-none font-serif leading-[1.8] text-[#1a1a1a] dark:text-[#e4e4e7]">
            <div
              className="[&_p]:mb-6 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight
                         [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
                         [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-6 [&_blockquote]:my-8
                         [&_blockquote]:italic [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-zinc-400
                         [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-4
                         [&_ul]:my-6 [&_ul]:pl-6 [&_ol]:my-6 [&_ol]:pl-6 [&_li]:mb-2
                         [&_pre]:bg-[#1e293b] [&_pre]:text-gray-100 [&_pre]:p-5 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                         [&_code]:bg-gray-100 dark:[&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
              dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
            />
          </article>

          {/* ─── Tags ───────────────────────────────────────────── */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-[13px] font-medium text-gray-600 dark:text-zinc-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Sticky Floating Reaction Bar ───────────────────── */}
          <div className="sticky bottom-6 z-50 flex justify-center mt-16 mb-8">
            <div className="flex items-center gap-1 px-5 py-3 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-gray-200/50 dark:border-zinc-700/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${liked 
                    ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
                  }`}
              >
                <ThumbsUp size={17} className={liked ? 'fill-blue-600 dark:fill-blue-400' : ''} />
                <span className="tabular-nums min-w-[1ch]">{likeCount}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={handleDislike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${disliked 
                    ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
                  }`}
              >
                <ThumbsDown size={17} className={disliked ? 'fill-red-600 dark:fill-red-400' : ''} />
                <span className="tabular-nums min-w-[1ch]">{dislikeCount}</span>
              </button>

              <div className="w-px h-5 bg-gray-200 dark:bg-zinc-700 mx-1" />

              {/* Comments */}
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200 transition-all duration-200">
                <MessageSquare size={17} />
                <span className="tabular-nums">{selectedBlog.comments?.length || 0}</span>
              </button>

              <div className="w-px h-5 bg-gray-200 dark:bg-zinc-700 mx-1" />

              {/* Bookmark */}
              <button
                onClick={() => setMarkedRead((p) => !p)}
                className={`p-2.5 rounded-full transition-all duration-200
                  ${markedRead 
                    ? 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400' 
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
                  }`}
              >
                <Bookmark size={17} className={markedRead ? 'fill-green-600 dark:fill-green-400' : ''} />
              </button>

              {/* Share */}
              {typeof navigator !== 'undefined' && navigator.share ? (
                <button
                  onClick={handleNativeShare}
                  className="p-2.5 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200 transition-all duration-200"
                >
                  <Share2 size={17} />
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2.5 rounded-full text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200 transition-all duration-200">
                      <Share2 size={17} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FaWhatsapp className="text-green-600" size={16} />
                        WhatsApp
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Facebook className="text-blue-600" size={16} />
                        Facebook
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FaXTwitter size={16} />
                        X (Twitter)
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyLink} className="flex items-center gap-2 cursor-pointer">
                      <Link2 size={16} />
                      Copy link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* ─── Comments Section ───────────────────────────────── */}
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-zinc-800">
            <CommentBox selectedBlog={selectedBlog} />
          </div>

        </div>
      </div>
    </>
  );
};

export default BlogView;
