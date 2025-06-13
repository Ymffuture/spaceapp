import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import axios from 'axios'

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`http://localhost:9123/api/v1/blog/all`, {
          withCredentials: true
        })
        if (res.data.success) setBlogs(res.data.blogs)
      } catch (err) {
        console.error(err)
      }
    }

    fetchBlogs()
  }, [])

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] to-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🛠 Admin Blog Management</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Input
            placeholder="Search blog by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96"
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Title</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Created</th>
                <th className="text-center px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-5 text-gray-500">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-600">
                    <td className="px-4 py-3">{blog.title}</td>
                    <td className="px-4 py-3">{blog.category || 'Uncategorized'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={blog.published ? 'default' : 'outline'}>
                        {blog.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminBlogs
