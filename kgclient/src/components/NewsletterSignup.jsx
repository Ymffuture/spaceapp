import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Mail, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const API = 'https://kgserver-bjy2.onrender.com/api/v1/subscription'

const NewsletterSignup = ({ className = '' }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return toast.error('Enter your email first')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/subscribe`, { email })
      if (res.data.success) {
        toast.success(res.data.message || 'Subscribed!')
        setEmail('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-2xl bg-[#d97757]/10 border border-[#d97757]/20 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Mail size={18} className="text-[#d97757]" />
        <h3 className="text-base font-semibold text-[#2D2C29] dark:text-[#F5F4EF]">
          Get new posts in your inbox
        </h3>
      </div>
      <p className="text-sm text-[#7a6f63] dark:text-[#b7ada4] mb-4">
        No spam, just new articles when they're published.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-full border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#23201d]"
        />
        <Button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#d97757] hover:bg-[#bd5d3a] text-white gap-2 shrink-0"
        >
          <Send size={14} />
          Subscribe
        </Button>
      </form>
    </div>
  )
}

export default NewsletterSignup
