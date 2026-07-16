import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'sonner'

// UI Components
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Icons
import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from 'react-icons/fa'
import {
  Loader2,
  MapPin,
  Briefcase,
  Calendar,
  Edit3,
  Link as LinkIcon,
  ExternalLink,
  Mail,
  FileText,
  MessageSquare,
  Heart,
  Eye,
} from 'lucide-react'

// Redux & Assets
import { setUser } from '@/redux/authSlice'
import userLogo from '../assets/user.jpg'
import TotalProperty from '@/components/TotalProperty'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(store => store.auth)

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('about')

  const [input, setInput] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    occupation: user?.occupation || '',
    bio: user?.bio || '',
    facebook: user?.facebook || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    instagram: user?.instagram || '',
    file: user?.photoUrl || null,
  })

  const changeEventHandler = (e) => {
    const { name, value } = e.target
    setInput(prev => ({ ...prev, [name]: value }))
  }

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0]
    if (file) setInput(prev => ({ ...prev, file }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!input.firstName?.trim() || !input.lastName?.trim()) {
      toast.error('First name and last name are required.')
      return
    }

    const formData = new FormData()
    formData.append('firstName', input.firstName)
    formData.append('lastName', input.lastName)
    formData.append('bio', input.bio)
    formData.append('occupation', input.occupation)
    formData.append('facebook', input.facebook)
    formData.append('linkedin', input.linkedin)
    formData.append('instagram', input.instagram)
    formData.append('github', input.github)
    if (input?.file && typeof input.file === 'object') {
      formData.append('file', input.file)
    }

    try {
      setLoading(true)
      const res = await axios.put(
        `https://kgserver-bjy2.onrender.com/api/v1/user/profile/update`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        setOpen(false)
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  // Social links config
  const socialLinks = [
    {
      key: 'github',
      icon: FaGithub,
      label: 'GitHub',
      color: 'hover:text-gray-900 dark:hover:text-white',
      bg: 'hover:bg-gray-100 dark:hover:bg-zinc-800',
    },
    {
      key: 'linkedin',
      icon: FaLinkedin,
      label: 'LinkedIn',
      color: 'hover:text-[#0a66c2]',
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-500/10',
    },
    {
      key: 'twitter',
      icon: FaInstagram,
      label: 'Instagram',
      color: 'hover:text-[#e4405f]',
      bg: 'hover:bg-pink-50 dark:hover:bg-pink-500/10',
    },
    {
      key: 'facebook',
      icon: FaFacebook,
      label: 'Facebook',
      color: 'hover:text-[#1877f2]',
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-500/10',
    },
  ]

  // Stats data
  const stats = [
    { label: 'Articles', value: '24', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Comments', value: '156', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Likes', value: '1.2k', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { label: 'Views', value: '8.5k', icon: Eye, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ]

  const profileImage = useMemo(() => {
    if (input.file instanceof File) return URL.createObjectURL(input.file)
    return user?.photoUrl || userLogo
  }, [input.file, user?.photoUrl])

  useEffect(() => {
    return () => {
      if (input.file instanceof File) URL.revokeObjectURL(profileImage)
    }
  }, [profileImage])

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'

  return (
    <>
      <Helmet>
        <title>{fullName}'s Profile | Qspace</title>
        <meta name="description" content={user?.bio || "User profile on Qspace."} />
        <meta property="og:image" content={user?.photoUrl || userLogo} />
        <meta property="og:title" content={`${fullName}'s Profile`} />
        <meta property="og:description" content={user?.bio} />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-20">
        
        {/* ─── Cover Image ───────────────────────────────────────── */}
        <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-700">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.5" fill="white" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fafafa] dark:from-[#0a0a0a] to-transparent" />
        </div>

        {/* ─── Main Content ────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ─── Left Column: Profile Card ─────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Header Card */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  
                  {/* Avatar */}
                  <div className="relative -mt-16 sm:-mt-20 flex-shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ring-4 ring-white dark:ring-zinc-900 shadow-xl overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={profileImage} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-3xl font-bold">
                          {user?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {/* Online Status */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white dark:border-zinc-900 rounded-full" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-2 sm:pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {fullName}
                        </h1>
                        <p className="mt-1 text-base text-gray-500 dark:text-zinc-400 font-medium">
                          {user?.occupation || 'Contributor'}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400 dark:text-zinc-500 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            Johannesburg, South Africa
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Mail size={14} />
                            {user?.email}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setOpen(true)}
                        variant="outline"
                        className="h-9 px-4 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 gap-2 text-sm font-medium"
                      >
                        <Edit3 size={14} />
                        Edit
                      </Button>
                    </div>

                    {/* Social Links */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {socialLinks.map(({ key, icon: Icon, label, color, bg }) => {
                        const url = user?.[key]
                        return (
                          <a
                            key={key}
                            href={url || '#'}
                            target={url ? '_blank' : undefined}
                            rel={url ? 'noopener noreferrer' : undefined}
                            onClick={e => !url && e.preventDefault()}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                              ${url
                                ? `text-gray-600 dark:text-zinc-300 ${color} ${bg}`
                                : 'text-gray-300 dark:text-zinc-600 cursor-not-allowed'
                              }`}
                          >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{label}</span>
                            {url && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* About Section */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={18} className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
                </div>
                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                  {user?.bio || (
                    <span className="italic text-gray-400 dark:text-zinc-500">
                      No bio yet. Click edit to add a description about yourself.
                    </span>
                  )}
                </p>
              </Card>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-zinc-800/50 rounded-xl w-fit">
                {[
                  { id: 'about', label: 'About', icon: Briefcase },
                  { id: 'activity', label: 'Activity', icon: Calendar },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${activeTab === id
                        ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                      }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TotalProperty />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Right Column: Stats & Info ────────────────────── */}
            <div className="space-y-6">
              
              {/* Stats Card */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-4">
                  Statistics
                </h3>
                <div className="space-y-4">
                  {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <Icon size={18} className={color} />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-zinc-400 font-medium">{label}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Joined Date Card */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3">
                  Member Since
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                    <Calendar size={18} className="text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Recently'
                      }
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">Joined Qspace</p>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 shadow-lg text-white">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/dashboard/write-blog"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
                  >
                    <Edit3 size={16} />
                    Write New Article
                  </Link>
                  <Link
                    to="/dashboard/your-blog"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
                  >
                    <FileText size={16} />
                    View Your Blogs
                  </Link>
                  <Link
                    to="/dashboard/comments"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
                  >
                    <MessageSquare size={16} />
                    Check Comments
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Edit Profile Dialog ───────────────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-0 overflow-hidden">
          
          {/* Dialog Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
            <DialogTitle className="text-xl font-bold text-white">Edit Profile</DialogTitle>
            <DialogDescription className="text-white/70 mt-1">
              Update your personal information and social links.
            </DialogDescription>
          </div>

          <form onSubmit={submitHandler} className="p-6 space-y-5">
            
            {/* Profile Image Upload */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-4 ring-gray-100 dark:ring-zinc-800">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xl font-bold">
                    {user?.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors">
                  <Edit3 size={14} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">First Name</Label>
                <Input
                  name="firstName"
                  value={input.firstName}
                  onChange={changeEventHandler}
                  placeholder="First name"
                  className="h-11 rounded-xl border-gray-200 dark:border-zinc-700 focus-visible:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Last Name</Label>
                <Input
                  name="lastName"
                  value={input.lastName}
                  onChange={changeEventHandler}
                  placeholder="Last name"
                  className="h-11 rounded-xl border-gray-200 dark:border-zinc-700 focus-visible:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Occupation</Label>
              <Input
                name="occupation"
                value={input.occupation}
                onChange={changeEventHandler}
                placeholder="e.g. Senior Frontend Engineer"
                className="h-11 rounded-xl border-gray-200 dark:border-zinc-700 focus-visible:ring-blue-500/20"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Bio</Label>
              <Textarea
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                placeholder="Tell us about yourself..."
                rows={3}
                className="rounded-xl border-gray-200 dark:border-zinc-700 resize-none focus-visible:ring-blue-500/20"
              />
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Social Links</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'github', icon: FaGithub, placeholder: 'github.com/username', color: 'text-gray-700 dark:text-zinc-300' },
                  { name: 'linkedin', icon: FaLinkedin, placeholder: 'linkedin.com/in/username', color: 'text-[#0a66c2]' },
                  { name: 'instagram', icon: FaInstagram, placeholder: 'instagram.com/username', color: 'text-[#e4405f]' },
                  { name: 'facebook', icon: FaFacebook, placeholder: 'facebook.com/username', color: 'text-[#1877f2]' },
                ].map(({ name, icon: Icon, placeholder, color }) => (
                  <div key={name} className="relative">
                    <Icon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${color}`} />
                    <Input
                      name={name}
                      value={input[name]}
                      onChange={changeEventHandler}
                      placeholder={placeholder}
                      className="h-11 pl-10 rounded-xl border-gray-200 dark:border-zinc-700 focus-visible:ring-blue-500/20 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 px-6 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Profile
