import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  ArrowRight,
  User,
  Bookmark,
  Share2,
  CheckCircle2,
} from 'lucide-react'

const BlogCard = ({ blog, featured = false, horizontal = false }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [timeAgo, setTimeAgo] = useState('')

  // Calculate reading time
  const readTime = useMemo(() => {
    if (!blog.description) return '5 min'
    const text = blog.description.replace(/<[^>]*>/g, ' ')
    const words = text.trim().split(/\s+/).length
    return `${Math.max(1, Math.ceil(words / 200))} min`
  }, [blog.description])

  // Time ago calculation
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const createdAt = new Date(blog.createdAt)
      const diff = Math.floor((now - createdAt) / 1000)

      if (diff < 60) setTimeAgo('Just now')
      else if (diff < 3600) {
        const mins = Math.floor(diff / 60)
        setTimeAgo(`${mins}m ago`)
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600)
        setTimeAgo(`${hours}h ago`)
      } else if (diff < 604800) {
        const days = Math.floor(diff / 86400)
        setTimeAgo(`${days}d ago`)
      } else {
        setTimeAgo(createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)
    return () => clearInterval(interval)
  }, [blog.createdAt])

  const isAdmin = blog.author?.email === 'futurekgomotso@gmail.com'

  // Category color mapping
  const categoryColors = {
    'Technology': 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    'Web Development': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    'Digital Marketing': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    'Design': 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
    'Cooking': 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
    'Photography': 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400',
    'Sports': 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
    'Science': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    'Finance': 'bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400',
    'Education': 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
    'Health & Wellness': 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
    'Art & Design': 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400',
    'Blogging': 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400',
    'Other': 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400',
  }

  const categoryStyle = categoryColors[blog.category] || categoryColors['Other']

  // Horizontal layout
  if (horizontal) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/blogs/${blog._id}`)}
        className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-zinc-800/50 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
            {blog.thumbnail ? (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Content */}
          <div className="sm:w-3/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryStyle}`}>
                  {blog.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {readTime} read
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4">
                {blog.subtitle}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                  {blog.author?.firstName?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                    {blog.author?.firstName} {blog.author?.lastName}
                    {isAdmin && (
                      <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{timeAgo}</p>
                </div>
              </div>

              <motion.div
                animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
                className="text-blue-600 dark:text-blue-400"
              >
                <ArrowRight size={18} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  // Standard/Featured vertical layout
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className={`group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-zinc-800/50 transition-all duration-300 ${featured ? 'row-span-2' : ''}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        {blog.thumbnail ? (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
        )}
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Handle bookmark
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Bookmark size={14} className="text-gray-600 dark:text-zinc-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryStyle}`}>
            {blog.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
          {blog.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4">
          {blog.subtitle}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              {blog.author?.firstName?.[0] || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-700 dark:text-zinc-300 flex items-center gap-1">
                {blog.author?.firstName}
                {isAdmin && (
                  <CheckCircle2 size={12} className="text-blue-500 fill-blue-500 text-white" />
                )}
              </span>
              <span className="text-[10px] text-gray-400">{timeAgo}</span>
            </div>
          </div>

          <motion.div
            animate={{ x: isHovered ? 0 : -3, opacity: isHovered ? 1 : 0.5 }}
            className="text-blue-600 dark:text-blue-400"
          >
            <ArrowRight size={16} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}

export default BlogCard
