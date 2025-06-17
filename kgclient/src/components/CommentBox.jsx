import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LuSend } from "react-icons/lu"
import { FaThumbsUp } from "react-icons/fa6"

import { setComment } from '@/redux/commentSlice'
import CommentSkeleton from './CommentSkeleton'

const socket = io("https://kgserver-bjy2.onrender.com")

const CommentBox = ({ selectedBlog }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { comment } = useSelector(state => state.comment)

  const [content, setContent] = useState("")
  const [replyMap, setReplyMap] = useState({})
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReplies, setShowReplies] = useState({})

  // Real-time new comment via socket
  useEffect(() => {
    socket.on("newComment", (newComment) => {
      if (newComment.postId === selectedBlog._id) {
        dispatch(setComment(prev => [...prev, newComment]))
      }
    })

    return () => {
      socket.off("newComment") // clean up listener
    }
  }, [selectedBlog._id, dispatch])

  // Fetch comments from server
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/comment/${selectedBlog._id}/comment/all`)
        const comments = res.data.comments
        dispatch(setComment(comments))

        const map = {}
        comments.forEach(c => {
          if (c.parentId) {
            if (!map[c.parentId]) map[c.parentId] = []
            map[c.parentId].push(c)
          }
        })
        setReplyMap(map)
      } catch {
        toast.error("Failed to load comments")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [selectedBlog._id, dispatch])

  // Submit new or reply comment
  const sendComment = async (parentId = null) => {
    const text = parentId ? replyText : content
    if (!text.trim()) return toast.error("Comment cannot be empty")

    try {
      const res = await axios.post(
        `https://kgserver-bjy2.onrender.com/api/v1/comment/${selectedBlog._id}/create`,
        { content: text, parentId },
        { withCredentials: true }
      )

      if (res.data.success) {
        toast.success("Comment posted")
        if (parentId) {
          setReplyText("")
          setReplyingTo(null)
        } else {
          setContent("")
        }
      }
    } catch {
      toast.error("Comment failed")
    }
  }

  // Like handler with socket update
  const handleLike = async (id) => {
    try {
      const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/comment/${id}/like`, {
        withCredentials: true,
      })
      if (res.data.success) {
        dispatch(setComment(comment.map(c => c._id === id ? res.data.updatedComment : c)))
      }
    } catch {
      toast.error("Like failed")
    }
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const past = new Date(date)
    const diff = Math.floor((now - past) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return past.toLocaleDateString()
  }

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }))
  }

  const topLevelComments = comment.filter(c => !c.parentId)

  return (
    <div className="space-y-4">
      {/* Write New Comment */}
      <div className="flex items-start gap-3">
        <Avatar><AvatarImage src={user?.photoUrl} /><AvatarFallback>U</AvatarFallback></Avatar>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a comment with @username or *markdown*..."
          className="bg-muted resize-none"
        />
        <Button onClick={() => sendComment()} className="h-10"><LuSend /></Button>
      </div>

      {/* Comments List */}
      {loading ? <CommentSkeleton /> : (
        <div className="space-y-6 mt-4">
          {topLevelComments.map(c => (
            <div key={c._id} className="bg-muted/30 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <Avatar><AvatarImage src={c.userId?.photoUrl} /><AvatarFallback>U</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{c.userId?.firstName} {c.userId?.lastName}</div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="text-sm mt-1 prose prose-sm"
                  >
                    {c.content}
                  </ReactMarkdown>

                  {/* Action Bar */}
                  <div className="flex gap-4 items-center mt-1 text-xs text-muted-foreground">
                    <button onClick={() => handleLike(c._id)} className="flex items-center gap-1 hover:text-primary">
                      <FaThumbsUp className={c.likes.includes(user._id) ? "text-blue-600" : ""} size={14} />
                      <span>{c.numberOfLikes || 0}</span>
                    </button>
                    <button onClick={() => setReplyingTo(c._id)} className="hover:underline">Reply</button>
                    <span>{getTimeAgo(c.createdAt)}</span>
                    {replyMap[c._id]?.length > 0 && (
                      <button onClick={() => toggleReplies(c._id)} className="hover:underline">
                        {showReplies[c._id] ? 'Hide Replies' : `View ${replyMap[c._id].length} Replies`}
                      </button>
                    )}
                  </div>

                  {/* Reply Input */}
                  {replyingTo === c._id && (
                    <div className="mt-2 flex items-start gap-2">
                      <Textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        className="bg-muted resize-none"
                        placeholder="Write a reply with markdown..."
                      />
                      <Button onClick={() => sendComment(c._id)} className="h-10"><LuSend /></Button>
                    </div>
                  )}

                  {/* Replies */}
                  {showReplies[c._id] && replyMap[c._id]?.map(r => (
                    <div key={r._id} className="mt-4 ml-6 border-l-2 border-gray-300 pl-4">
                      <div className="flex items-start gap-2">
                        <Avatar className="w-6 h-6"><AvatarImage src={r.userId?.photoUrl} /><AvatarFallback>U</AvatarFallback></Avatar>
                        <div>
                          <div className="text-xs font-semibold">{r.userId?.firstName} {r.userId?.lastName}</div>
                          <ReactMarkdown className="text-sm" remarkPlugins={[remarkGfm]}>
                            {r.content}
                          </ReactMarkdown>
                          <div className="text-xs text-muted-foreground mt-1">{getTimeAgo(r.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentBox

