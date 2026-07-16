import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  ArrowRight,
  User,
  Bookmark,
  Share2,
  CheckCircle2,
  MessageCircle,
  ThumbsUp,
  MoreHorizontal,
} from 'lucide-react'

const BlogCard = ({ blog, featured = false, horizontal = false }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [timeAgo, setTimeAgo] = useState('')

  const readTime = useMemo(() => {
    if (!blog.description) return '5 min'
    const text = blog.description.replace(/<[^>]*>/g, ' ')
    const words = text.trim().split(/\s+/).length
    return `${Math.max(1, Math.ceil(words / 200))} min`
  }, [blog.description])

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const createdAt = new Date(blog.createdAt)
      const diff = Math.floor((now - createdAt) / 1000)

      if (diff < 60) setTimeAgo('Just now')
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)}m ago`)
      else if (diff < 86400) setTimeAgo(`${Math.floor(diff / 3600)}h ago`)
      else if (diff < 604800) setTimeAgo(`${Math.floor(diff / 86400)}d ago`)
      else {
        setTimeAgo(createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }))
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)
    return () => clearInterval(interval)
  }, [blog.createdAt])

  const isAdmin = blog.author?.email === 'futurekgomotso@gmail.com'

  const categoryColors = {
    Technology: 'bg-[#f3ece6] text-[#141413] ring-1 ring-[#d8c8bd] dark:bg-[#2a2624] dark:text-[#f6efe8] dark:ring-[#4a403a]',
    'Web Development': 'bg-[#eef4ff] text-[#0866ff] ring-1 ring-[#c9dafc] dark:bg-[#142033] dark:text-[#9fc0ff] dark:ring-[#28406b]',
    'Digital Marketing': 'bg-[#fff3e6] text-[#c96a3a] ring-1 ring-[#f3d2b8] dark:bg-[#2d241c] dark:text-[#ffbf93] dark:ring-[#5a4330]',
    Design: 'bg-[#f5ecff] text-[#8b5cf6] ring-1 ring-[#dfcdfd] dark:bg-[#221a2e] dark:text-[#c4a7ff] dark:ring-[#4a3564]',
    Cooking: 'bg-[#fff1e8] text-[#d97757] ring-1 ring-[#f0c9b5] dark:bg-[#2f231e] dark:text-[#ffbf9f] dark:ring-[#5a4339]',
    Photography: 'bg-[#ffeaf3] text-[#db2777] ring-1 ring-[#f5c4da] dark:bg-[#2e1d27] dark:text-[#ffb2d0] dark:ring-[#5f3950]',
    Sports: 'bg-[#e9fbff] text-[#0891b2] ring-1 ring-[#c4edf6] dark:bg-[#12262c] dark:text-[#8de6fa] dark:ring-[#224654]',
    Science: 'bg-[#eef0ff] text-[#4f46e5] ring-1 ring-[#cfd4ff] dark:bg-[#1a1d34] dark:text-[#b8c0ff] dark:ring-[#313a66]',
    Finance: 'bg-[#f2f8e8] text-[#5d7a2f] ring-1 ring-[#dce8bf] dark:bg-[#232b1b] dark:text-[#cfe89a] dark:ring-[#3d4f2f]',
    Education: 'bg-[#fff0f0] text-[#be123c] ring-1 ring-[#f4c7cf] dark:bg-[#2f1a22] dark:text-[#ffb6c8] dark:ring-[#5a2f41]',
    'Health & Wellness': 'bg-[#eafaf3] text-[#0f766e] ring-1 ring-[#c5eee0] dark:bg-[#132824] dark:text-[#95e6d4] dark:ring-[#244943]',
    'Art & Design': 'bg-[#fff0fb] text-[#c026d3] ring-1 ring-[#f0c2ef] dark:bg-[#2c192d] dark:text-[#f0b4f7] dark:ring-[#563259]',
    Blogging: 'bg-[#f6f4ef] text-[#4a403a] ring-1 ring-[#ded7cd] dark:bg-[#24201e] dark:text-[#d6cbc2] dark:ring-[#433c38]',
    Other: 'bg-[#f6f4ef] text-[#4a403a] ring-1 ring-[#ded7cd] dark:bg-[#24201e] dark:text-[#d6cbc2] dark:ring-[#433c38]',
  }

  const categoryStyle = categoryColors[blog.category] || categoryColors.Other

  const CardShell = horizontal ? 'flex flex-col sm:flex-row' : 'flex flex-col'
  const imageSize = horizontal ? 'sm:w-[38%] h-52 sm:h-auto' : featured ? 'h-64' : 'h-52'

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className={[
        'group cursor-pointer overflow-hidden rounded-[28px] border transition-all duration-300',
        'bg-[#faf9f5] border-[#e6dfd4] shadow-[0_8px_30px_rgba(20,20,19,0.06)]',
        'dark:bg-[#141413] dark:border-[#2b2623] dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)]',
        'hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,20,19,0.12)]',
        'dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.4)]',
        featured ? 'ring-1 ring-[#d97757]/20' : '',
      ].join(' ')}
    >
      <div className={CardShell}>
        <div className={`${imageSize} relative overflow-hidden bg-gradient-to-br from-[#f1ece6] to-[#e9e2d8] dark:from-[#211d1b] dark:to-[#181614]`}>
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl">📝</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${categoryStyle}`}>
              {blog.category}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[#141413] opacity-0 backdrop-blur-sm transition-all hover:scale-105 group-hover:opacity-100 dark:bg-[#1f1b19]/92 dark:text-white"
          >
            <Bookmark size={14} />
          </button>
        </div>

        <div className={`flex flex-1 flex-col p-5 ${horizontal ? 'justify-between' : ''}`}>
          <div>
            <div className="mb-3 flex items-center gap-3 text-[11px] text-[#6b6258] dark:text-[#b7ada4]">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readTime} read
              </span>
              <span className="h-1 w-1 rounded-full bg-[#cdbfb1]" />
              <span>{timeAgo}</span>
            </div>

            <h3 className={[
              'leading-tight font-semibold tracking-[-0.02em] transition-colors',
              'text-[#141413] group-hover:text-[#d97757] dark:text-[#f8f3ed] dark:group-hover:text-[#ffb18d]',
              featured ? 'text-[1.6rem]' : 'text-[1.1rem]',
            ].join(' ')}>
              {blog.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5f564c] dark:text-[#b7ada4]">
              {blog.subtitle}
            </p>
          </div>

          <div className="mt-5 border-t border-[#ece4d8] pt-4 dark:border-[#2b2623]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#d97757] to-[#0866ff] text-white text-[11px] font-bold shadow-sm">
                  {blog.author?.firstName?.[0] || 'U'}
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#2f2a25] dark:text-[#f2ebe4]">
                    <span>{blog.author?.firstName} {blog.author?.lastName}</span>
                    {isAdmin && <CheckCircle2 size={14} className="text-[#0866ff] fill-[#0866ff]" />}
                  </div>
                  <div className="text-[11px] text-[#7a6f63] dark:text-[#b7ada4]">{timeAgo}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#7a6f63] dark:text-[#b7ada4]">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe7] transition-colors hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]"
                >
                  <ThumbsUp size={15} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe7] transition-colors hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]"
                >
                  <MessageCircle size={15} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe7] transition-colors hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0866ff]">
                Read more <ArrowRight size={14} />
              </span>
              <MoreHorizontal size={16} className="text-[#b0a799]" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default BlogCard
