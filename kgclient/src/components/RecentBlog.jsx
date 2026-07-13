import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import BlogCardList from './BlogCardList';
import { setBlog } from '@/redux/blogSlice';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Sparkles,
  Send,
  Mail,
  CheckCircle2,
  TrendingUp,
  Tag,
} from 'lucide-react';

const tags = [
  'Blogging', 'Web Development', 'Digital Marketing', 'Cooking',
  'Photography', 'Sports', 'Science', 'Finance',
  'Education', 'Health & Wellness', 'Technology', 'Art & Design',
];

const suggestedReads = [
  { title: '10 Tips to Master React Hooks in 2026', author: 'Alex Chen', readTime: '5 min' },
  { title: 'Understanding Server Components Architecture', author: 'Sarah Mitchell', readTime: '8 min' },
  { title: 'The Complete Guide to TypeScript Generics', author: 'James Wilson', readTime: '12 min' },
];

const RecentBlog = () => {
  const { blog } = useSelector(store => store.blog);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllPublishedBlogs = async () => {
      try {
        const res = await axios.get(
          `https://kgserver-bjy2.onrender.com/api/v1/blog/get-published-blogs`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllPublishedBlogs();
  }, [dispatch]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    // Simulate API call
    setSubscribed(true);
    toast.success('Welcome aboard! Check your inbox for confirmation.');
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ─── Header ───────────────────────────────────────────── */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full mb-5">
            <Sparkles size={13} />
            Fresh Content
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Recent Blogs
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Explore the freshest insights, tutorials, and stories from top creators around the world.
          </p>
        </div>

        {/* ─── Main Layout ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
          
          {/* Blog Feed */}
          <div className="space-y-5">
            {blog?.slice(0, 6)?.map((item, index) => (
              <BlogCardList key={item._id || index} blog={item} />
            ))}
          </div>

          {/* ─── Sidebar ────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            
            {/* Newsletter Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-[#1e40af] to-[#2563eb] p-7 text-white shadow-lg">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/3 rounded-full" />
              
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5">
                  <Mail size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1.5">Stay in the loop</h3>
                <p className="text-sm text-blue-100/70 leading-relaxed mb-5">
                  Get the latest blogs, tutorials, and tech tips delivered to your inbox. No spam, ever.
                </p>
                
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={subscribed}
                      className="h-10 bg-white/12 border-white/15 text-white placeholder:text-white/40 text-sm rounded-full px-4 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={subscribed}
                    className={`h-10 px-5 rounded-full text-sm font-bold transition-all ${subscribed
                      ? 'bg-green-500 hover:bg-green-500 text-white'
                      : 'bg-white text-blue-900 hover:bg-blue-50 hover:-translate-y-px hover:shadow-lg'
                    }`}
                  >
                    {subscribed ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <>
                        <Send size={14} className="mr-1.5" />
                        Join
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="flex items-center gap-1.5 mt-4 text-[11px] text-blue-200/50">
                  <CheckCircle2 size={11} />
                  Join 2,400+ readers. Unsubscribe anytime.
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-gray-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                  Categories
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                    className="px-3.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-full text-[13px] font-medium text-gray-600 dark:text-zinc-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white hover:-translate-y-px hover:shadow-md transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Reads */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={14} className="text-gray-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                  Trending Now
                </h4>
              </div>
              <div className="space-y-0">
                {suggestedReads.map((read, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate('/blogs')}
                    className="group flex items-start gap-3 py-3.5 border-b border-gray-50 dark:border-zinc-800/50 last:border-0 last:pb-0 first:pt-0 cursor-pointer transition-colors"
                  >
                    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg text-xs font-extrabold text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-500/15 dark:group-hover:text-blue-400 transition-all">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {read.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                        {read.author} · {read.readTime} read
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default RecentBlog;
