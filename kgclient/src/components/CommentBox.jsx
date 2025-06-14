import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { LuSend } from "react-icons/lu"
import { FaHeart, FaRegHeart } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setComment } from '@/redux/commentSlice'
import CommentSkeleton from './CommentSkeleton'

const socket = io("https://kgserver-bjy2.onrender.com") // your backend URL

const CommentBox = ({ selectedBlog }) => {
  const { user } = useSelector(state => state.auth)
  const { comment } = useSelector(state => state.comment)
  const dispatch = useDispatch()

  const [content, setContent] = useState("")
  const [replyMap, setReplyMap] = useState({}) // { parentId: [replies] }
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReplies, setShowReplies] = useState({})

  useEffect(() => {
    socket.on("newComment", (newComment) => {
      if (newComment.postId === selectedBlog._id) {
        dispatch(setComment(prev => [...prev, newComment]))
      }
    })

    return () => socket.disconnect()
  }, [])

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
      } catch (error) {
        console.error(error)
        toast.error("Failed to load comments")
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [selectedBlog._id])

  const sendComment = async (parentId = null) => {
    try {
      const text = parentId ? replyText : content
      const res = await axios.post(`https://kgserver-bjy2.onrender.com/api/v1/comment/${selectedBlog._id}/create`, {
        content: text,
        parentId
      }, { withCredentials: true })
      if (res.data.success) {
        toast.success("Comment posted")
        setContent("")
        setReplyText("")
        setReplyingTo(null)
      }
    } catch (err) {
      console.error(err)
      toast.error("Comment failed")
    }
  }

  const handleLike = async (id) => {
    try {
      const res = await axios.get(`https://kgserver-bjy2.onrender.com/api/v1/comment/${id}/like`, {
        withCredentials: true
      })
      if (res.data.success) {
        const updated = res.data.updatedComment
        dispatch(setComment(comment.map(c => c._id === id ? updated : c)))
      }
    } catch (e) {
      toast.error("Like failed")
    }
  }

  const topLevelComments = comment.filter(c => !c.parentId)

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Avatar><AvatarImage src={user.photoUrl} /><AvatarFallback>U</AvatarFallback></Avatar>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="bg-gray-100 dark:bg-gray-800"
        />
        <Button onClick={() => sendComment()}><LuSend /></Button>
      </div>

      {loading ? <CommentSkeleton /> : (
        <div className="space-y-6 mt-4">
          {topLevelComments.map(c => (
            <div key={c._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <div className="flex items-start gap-3">
                <Avatar><AvatarImage src={c.userId?.photoUrl} /><AvatarFallback>U</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{c.userId?.firstName} {c.userId?.lastName}</div>
                  <p>{c.content}</p>
                  <div className="flex gap-4 items-center mt-1 text-sm">
                    <button onClick={() => handleLike(c._id)}>
                      {c.likes.includes(user._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                      {c.numberOfLikes}
                    </button>
                    <button onClick={() => setReplyingTo(c._id)}>Reply</button>
                    {replyMap[c._id]?.length > 0 && (
                      <button onClick={() => toggleReplies(c._id)}>
                        {showReplies[c._id] ? 'Hide Replies' : `View ${replyMap[c._id].length} Replies`}
                      </button>
                    )}
                  </div>

                  {/* Reply Box */}
                  {replyingTo === c._id && (
                    <div className="mt-2 flex gap-2">
                      <Textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        className="bg-gray-200 dark:bg-gray-700"
                        placeholder="Write a reply..."
                      />
                      <Button onClick={() => sendComment(c._id)}><LuSend /></Button>
                    </div>
                  )}

                  {/* Replies */}
                  {showReplies[c._id] && replyMap[c._id]?.map(r => (
                    <div key={r._id} className="mt-3 ml-6 bg-white dark:bg-gray-900 p-2 rounded">
                      <div className="flex items-start gap-2">
                        <Avatar className="w-6 h-6"><AvatarImage src={r.userId?.photoUrl} /><AvatarFallback>U</AvatarFallback></Avatar>
                        <div>
                          <div className="text-xs font-semibold">{r.userId?.firstName} {r.userId?.lastName}</div>
                          <p className="text-sm">{r.content}</p>
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

