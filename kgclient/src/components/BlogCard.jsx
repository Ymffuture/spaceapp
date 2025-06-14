import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { CalendarDaysIcon, UserCircleIcon, CheckCircle } from 'lucide-react'
import clsx from 'clsx'
import { FaArrowRight } from 'react-icons/fa6'

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()
  const createdAt = new Date(blog.createdAt)
  const formattedDate = createdAt.toLocaleDateString("en-GB")

  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const diff = Math.floor((now - createdAt) / 1000) // seconds

      if (diff < 60) {
        setTimeAgo("Just now")
      } else if (diff < 3600) {
        const mins = Math.floor(diff / 60)
        setTimeAgo(`${mins} min${mins > 1 ? 's' : ''} ago`)
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600)
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`)
      } else {
        const days = Math.floor(diff / 86400)
        setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000) // update every minute

    return () => clearInterval(interval)
  }, [blog.createdAt])

  return (
    <div className={clsx(
      "group transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-3xl shadow-xl overflow-hidden",
      "hover:shadow-2xl hover:scale-[1.02] hover:border-blue-500 dark:hover:border-green-500"
    )}>
      
      {/* Only render thumbnail if it exists */}
      {blog.thumbnail && (
        <div className="relative">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-3xl"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-2">
        {/* Author & Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="h-5 w-5 text-blue-500 dark:text-green-400" />
            <span className="font-medium flex items-center gap-1">
              {blog.author?.firstName}
              {blog.author?.email === "futurekgomotso@gmail.com" && (
                <CheckCircle className="h-4 w-4 text-blue-500 dark:text-green-400" title="Verified Admin" />
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800 rounded-full">
              {timeAgo}
            </span>
            <CalendarDaysIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Category Tag */}
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-green-900 dark:text-green-300">
          @{blog.category}
        </span>

        {/* Title & Subtitle */}
        <h2 className="text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100 line-clamp-2">{blog.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{blog.subtitle}</p>

        {/* Read More */}
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all"
            onClick={() => navigate(`/blogs/${blog._id}`)}
          >
            Read Full Article <FaArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BlogCard

