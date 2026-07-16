import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import {
  Clock,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from 'lucide-react'

const API = 'https://kgserver-bjy2.onrender.com/api/v1'

const getRelativeTime = (date) => {
  const now = new Date()
  const seconds = Math.floor((now - new Date(date)) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value)
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

const BlogCardList = ({ blog }) => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0)
  const [liking, setLiking] = useState(false)
  const commentCount = blog.comments?.length || 0

  useEffect(() => {
    if (user && Array.isArray(blog.likes)) {
      setLiked(blog.likes.some(id => (id?._id || id) === user._id))
    }
  }, [user, blog.likes])

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!user) return toast.error('Sign in to like posts')
    if (liking) return
    setLiking(true)

    const wasLiked = liked
    setLiked(!wasLiked)
    setLikeCount(c => wasLiked ? Math.max(0, c - 1) : c + 1)

    try {
      const res = await axios.post(
        `${API}/blog/${blog._id}/${wasLiked ? 'unlike' : 'like'}`,
        {},
        { withCredentials: true }
      )
      if (res.data.success && res.data.blog) {
        setLikeCount(res.data.blog.likes?.length ?? likeCount)
      }
    } catch (err) {
      setLiked(wasLiked)
      setLikeCount(c => wasLiked ? c + 1 : Math.max(0, c - 1))
      toast.error(err.response?.data?.message || 'Reaction failed')
    } finally {
      setLiking(false)
    }
  }

  const handleComment = (e) => {
    e.stopPropagation()
    navigate(`/blogs/${blog._id}`)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/blogs/${blog._id}`
    if (navigator.share) {
      navigator.share({ title: blog.title, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  const createdAt = blog?.createdAt || new Date()
  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const relativeTime = getRelativeTime(createdAt)

  const categoryColors = {
    Technology: 'bg-[#f3ece6] text-[#141413] ring-1 ring-[#ded4c7]',
    'Web Development': 'bg-[#eef4ff] text-[#0866ff] ring-1 ring-[#c9dafc]',
    'Digital Marketing': 'bg-[#fff3e6] text-[#c96a3a] ring-1 ring-[#f3d2b8]',
    Design: 'bg-[#f5ecff] text-[#8b5cf6] ring-1 ring-[#dfcdfd]',
    Cooking: 'bg-[#fff1e8] text-[#d97757] ring-1 ring-[#f0c9b5]',
    Photography: 'bg-[#ffeaf3] text-[#db2777] ring-1 ring-[#f5c4da]',
    Sports: 'bg-[#e9fbff] text-[#0891b2] ring-1 ring-[#c4edf6]',
    Science: 'bg-[#eef0ff] text-[#4f46e5] ring-1 ring-[#cfd4ff]',
    Finance: 'bg-[#f2f8e8] text-[#5d7a2f] ring-1 ring-[#dce8bf]',
    Education: 'bg-[#fff0f0] text-[#be123c] ring-1 ring-[#f4c7cf]',
    'Health & Wellness': 'bg-[#eafaf3] text-[#0f766e] ring-1 ring-[#c5eee0]',
    'Art & Design': 'bg-[#fff0fb] text-[#c026d3] ring-1 ring-[#f0c2ef]',
    Blogging: 'bg-[#f6f4ef] text-[#4a403a] ring-1 ring-[#ded7cd]',
    Other: 'bg-[#f6f4ef] text-[#4a403a] ring-1 ring-[#ded7cd]',
  }

  const categoryStyle = categoryColors[blog.category] || categoryColors.Other

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-[#e6dfd4] bg-[#faf9f5] shadow-[0_8px_30px_rgba(20,20,19,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(20,20,19,0.12)] dark:border-[#2b2623] dark:bg-[#141413] dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <div className="absolute right-4 top-4 z-10 rounded-full bg-[#f4efe7]/95 px-3 py-1 text-[11px] font-semibold text-[#6b6258] backdrop-blur-sm dark:bg-[#23201d]/95 dark:text-[#b7ada4]">
        {formattedDate}
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-[320px] shrink-0">
          {blog.thumbnail ? (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-[240px] w-full items-center justify-center bg-gradient-to-br from-[#f1ece6] to-[#e9e2d8] dark:from-[#211d1b] dark:to-[#181614]">
              <span className="text-5xl">📝</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${categoryStyle}`}>
              {blog.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#7a6f63] dark:text-[#b7ada4]">
              <Clock size={12} />
              {relativeTime}
            </span>
          </div>

          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#141413] transition-colors group-hover:text-[#d97757] dark:text-[#f8f3ed] dark:group-hover:text-[#ffb18d] md:text-[1.8rem]">
            {blog.title}
          </h2>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f564c] dark:text-[#b7ada4]">
            {blog.subtitle}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-[#ece4d8] pt-4 dark:border-[#2b2623]">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#d97757] to-[#0866ff] text-[11px] font-bold text-white shadow-sm">
                {blog.author?.firstName?.[0] || 'U'}
              </div>

              <div>
                <p className="text-sm font-medium text-[#2f2a25] dark:text-[#f2ebe4]">
                  By <span className="text-[#0866ff]">{blog.author?.firstName}</span>
                </p>
                <p className="text-[11px] text-[#7a6f63] dark:text-[#b7ada4]">
                  {blog.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#7a6f63] dark:text-[#b7ada4]">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-full transition-colors ${
                  liked
                    ? 'bg-[#d97757]/15 text-[#d97757]'
                    : 'bg-[#f4efe7] hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]'
                }`}
              >
                <Heart size={15} className={liked ? 'fill-[#d97757]' : ''} />
                <span className="text-xs font-semibold tabular-nums">{likeCount}</span>
              </button>
              <button
                onClick={handleComment}
                className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#f4efe7] transition-colors hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]"
              >
                <MessageCircle size={15} />
                <span className="text-xs font-semibold tabular-nums">{commentCount}</span>
              </button>
              <button
                onClick={handleShare}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe7] transition-colors hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe7] transition-colors hover:bg-[#e9dfd3] dark:bg-[#23201d] dark:hover:bg-[#2b2623]"
              >
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="rounded-full bg-[#0866ff] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#0143b5]"
            >
              Read More
            </Button>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0866ff]">
              Open post <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCardList
