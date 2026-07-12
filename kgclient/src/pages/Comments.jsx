import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { Eye, MessageSquare, FileText } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import TimeAgo from './TimeAgo'

const Comments = () => {
  const [allComments, setAllComments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getTotalComments = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `https://kgserver-bjy2.onrender.com/api/v1/comment/my-blogs/comments`,
        { withCredentials: true }
      )
      if (res.data.success) {
        setAllComments(res.data.comments || [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTotalComments()
  }, [])

  const initials = (first, last) =>
    `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || 'U'

  return (
    <>
      <Helmet>
        <title>Comments | Qspace</title>
        <meta name="description" content="Read our latest tech, coding, and career articles." />
      </Helmet>

      <div className="pb-10 pt-20 md:ml-[320px] min-h-screen bg-gradient-to-br from-[#F0F8FF] to-white dark:from-[#0b0f19] dark:to-[#111827]">
        <div className="max-w-2xl mx-auto mt-8 px-4">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-blue-600 dark:text-green-400" size={22} />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Comments on your blogs
            </h1>
            {!loading && (
              <Badge variant="secondary" className="ml-1 rounded-full">
                {allComments.length}
              </Badge>
            )}
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 dark:bg-gray-800">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && allComments.length === 0 && (
            <Card className="p-10 text-center dark:bg-gray-800">
              <MessageSquare className="mx-auto mb-3 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">
                No comments yet on your blogs.
              </p>
            </Card>
          )}

          {!loading && allComments.length > 0 && (
            <div className="space-y-3">
              {allComments.map((comment, index) => {
                const blog = comment.postId
                const author = comment.userId

                return (
                  <Card
                    key={comment._id || index}
                    className="p-4 dark:bg-gray-800 hover:shadow-md transition-shadow duration-200 rounded-2xl border dark:border-gray-700"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={author?.photoUrl} />
                        <AvatarFallback>
                          {initials(author?.firstName, author?.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 dark:bg-gray-900/60 rounded-2xl px-4 py-2.5">
                          <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                              {author?.firstName || 'Unknown'} {author?.lastName || ''}
                            </span>
                            {blog?.title && (
                              <span className="text-xs text-muted-foreground">
                                commented on{' '}
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {blog.title}
                                </span>
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 break-words">
                            {comment.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-1.5 pl-3 text-xs text-muted-foreground">
                          {comment.createdAt && <TimeAgo date={comment.createdAt} />}
                          {blog?._id ? (
                            <button
                              onClick={() => navigate(`/blogs/${blog._id}`)}
                              className="flex items-center gap-1 font-medium hover:text-blue-600 dark:hover:text-green-400 hover:underline"
                            >
                              <Eye size={13} />
                              View post
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 italic">
                              <FileText size={13} />
                              Original post unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Comments
