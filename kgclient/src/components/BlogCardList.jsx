import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

// Utility to format "time ago"
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
  return "just now"
}

const BlogCardList = ({ blog }) => {
  const navigate = useNavigate()
  const createdAt = blog?.createdAt || new Date()
  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const relativeTime = getRelativeTime(createdAt)

  return (
    <div className="relative overflow-hidden group bg-white/90 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl p-5 flex flex-col md:flex-row md:gap-10">
      
      {/* Date Badge */}
      <div className="absolute top-4 right-4 bg-[#7b6800bc] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        {formattedDate}
      </div>

      {/* Thumbnail */}
      <div className="md:w-[300px]">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-lg"
          />
        )}
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-medium">
          By <span className="text-[#1E90FF]">{blog.author?.firstName}</span> | <span>{blog.category}</span>
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{relativeTime}</p>
      </div>

      {/* Blog Content */}
      <div className="flex flex-col justify-between mt-4 md:mt-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{blog.title}</h2>
          <h3 className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">
            {blog.subtitle}
          </h3>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => navigate(`/blogs/${blog._id}`)}
            className="bg-[#1E90FF] hover:bg-blue-700 text-white font-semibold transition-all px-5 py-2 text-sm rounded-full shadow-md"
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BlogCardList
