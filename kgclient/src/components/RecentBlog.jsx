import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCardList from './BlogCardList'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import { Sparkles, Send } from 'lucide-react'

const tags = [
  { category: 'Blogging' },
  { category: 'Web Development' },
  { category: 'Digital Marketing' },
  { category: 'Cooking' },
  { category: 'Photography' },
  { category: 'Sports' },
  { category: 'Science' },
  { category: 'Finance' },
  { category: 'Education' },
  { category: 'Health & Wellness' },
  { category: 'Technology' },
  { category: 'Art & Design' },
];


const RecentBlog = () => {
  const { blog } = useSelector(store => store.blog)
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const getAllPublsihedBlogs = async () => {
      try {
        const res = await axios.get(
          `https://kgserver-bjy2.onrender.com/api/v1/blog/get-published-blogs`,
          { withCredentials: true }
        )
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs))
        }
      } catch (error) {
        console.error(error)
      }
    }
    getAllPublsihedBlogs()
  }, [dispatch])

  return (
    <div className="bg-gradient-to-br from-[#F0F8FF] to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="text-[#1E90FF]" />
            Recent Blogs
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Explore the freshest insights from top creators
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Blog Feed */}
          <div className="space-y-6">
            {blog?.slice(0, 4)?.map((item, index) => (
              <BlogCardList key={index} blog={item} />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            {/* Categories */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Popular Categories
              </h2>
              <div className="flex flex-wrap gap-3 mt-4">
                {tags.map((item, index) => (
                  <Badge
                    key={index}
                    onClick={() => navigate(`/search?q=${item.category}`)}
                    className="cursor-pointer hover:scale-105 transition-transform bg-[#32CD32]/20 dark:bg-[#32CD32]/10 text-[#32CD32] font-semibold"
                  >
                    {item.category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            
            {/* <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                📬 Stay in the loop
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to get the latest blogs, ideas and tech tips.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-100 dark:bg-gray-800 text-sm"
                />
                <Button size="sm" className="bg-[#1E90FF] hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-1" /> Subscribe
                </Button>
              </div>
            </div> */}

            {/* Suggestions */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🔥 Suggested Reads
              </h2>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                {[
                  '10 Tips to Master React',
                  'Understanding Tailwind CSS',
                  'Improve SEO in 2024',
                ].map((title, idx) => (
                  <li
                    key={idx}
                    className="hover:underline hover:text-[#1E90FF] cursor-pointer transition"
                  >
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default RecentBlog
