import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Helmet } from 'react-helmet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  LayoutDashboard,
  MessageSquare,
  Flag,
  UserX,
  Mail,
  Trash2,
  ShieldOff,
  ShieldCheck,
  Search,
  ExternalLink,
  Users,
  FileText,
} from 'lucide-react'

const API = 'https://kgserver-bjy2.onrender.com/api/v1/admin'

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'comments', label: 'Comments', icon: MessageSquare },
  { key: 'reports', label: 'Reports', icon: Flag },
  { key: 'blocked', label: 'Blocked Users', icon: UserX },
  { key: 'subscriptions', label: 'Subscriptions', icon: Mail },
]

const StatCard = ({ label, value, icon: Icon, accent = false }) => (
  <div className={`rounded-2xl border p-5 ${accent ? 'bg-[#d97757]/10 border-[#d97757]/25' : 'bg-white dark:bg-[#23201d] border-black/[0.06] dark:border-white/[0.08]'}`}>
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-[#7a6f63] dark:text-[#b7ada4]">{label}</span>
      <Icon size={16} className={accent ? 'text-[#d97757]' : 'text-[#a89f93]'} />
    </div>
    <p className={`text-2xl font-bold mt-2 ${accent ? 'text-[#d97757]' : 'text-[#2D2C29] dark:text-[#F5F4EF]'}`}>
      {value ?? '—'}
    </p>
  </div>
)

const EmptyState = ({ icon: Icon, text }) => (
  <div className="text-center py-16">
    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-black/[0.03] dark:bg-white/[0.06] flex items-center justify-center">
      <Icon size={24} className="text-[#a89f93]" />
    </div>
    <p className="text-sm text-[#7a6f63] dark:text-[#b7ada4]">{text}</p>
  </div>
)

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [comments, setComments] = useState([])
  const [reports, setReports] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [subStats, setSubStats] = useState({ total: 0, activeCount: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Confirmation dialogs
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'comment'|'subscription', id }
  const [blockTarget, setBlockTarget] = useState(null) // user object

  const authHeaders = { withCredentials: true }

  const loadOverview = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/stats`, authHeaders)
      if (res.data.success) setStats(res.data.stats)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load stats')
    }
  }, [])

  const loadComments = useCallback(async (q = '') => {
    try {
      const res = await axios.get(`${API}/comments`, { ...authHeaders, params: { search: q, limit: 50 } })
      if (res.data.success) setComments(res.data.comments)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load comments')
    }
  }, [])

  const loadReports = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/reports`, authHeaders)
      if (res.data.success) setReports(res.data.comments)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load reports')
    }
  }, [])

  const loadBlockedUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users/blocked`, authHeaders)
      if (res.data.success) setBlockedUsers(res.data.users)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load blocked users')
    }
  }, [])

  const loadSubscriptions = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/subscriptions`, { ...authHeaders, params: { limit: 100 } })
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions)
        setSubStats({ total: res.data.total, activeCount: res.data.activeCount })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load subscriptions')
    }
  }, [])

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true)
      await Promise.all([loadOverview(), loadComments(), loadReports(), loadBlockedUsers(), loadSubscriptions()])
      setLoading(false)
    }
    loadAll()
  }, [loadOverview, loadComments, loadReports, loadBlockedUsers, loadSubscriptions])

  const refreshCurrentTab = () => {
    loadOverview()
    if (tab === 'comments') loadComments(search)
    if (tab === 'reports') loadReports()
    if (tab === 'blocked') loadBlockedUsers()
    if (tab === 'subscriptions') loadSubscriptions()
  }

  // ─── Actions ────────────────────────────────────────────────
  const confirmDeleteComment = async () => {
    const id = deleteTarget?.id
    setDeleteTarget(null)
    if (!id) return
    try {
      await axios.delete(`${API}/comments/${id}`, authHeaders)
      toast.success('Comment deleted')
      setComments(prev => prev.filter(c => c._id !== id))
      setReports(prev => prev.filter(c => c._id !== id))
      loadOverview()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment')
    }
  }

  const confirmDeleteSubscription = async () => {
    const id = deleteTarget?.id
    setDeleteTarget(null)
    if (!id) return
    try {
      await axios.delete(`${API}/subscriptions/${id}`, authHeaders)
      toast.success('Subscription removed')
      setSubscriptions(prev => prev.filter(s => s._id !== id))
      setSubStats(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove subscription')
    }
  }

  const resolveReport = async (commentId) => {
    try {
      await axios.post(`${API}/reports/${commentId}/resolve`, {}, authHeaders)
      toast.success('Reports cleared, comment restored')
      setReports(prev => prev.filter(c => c._id !== commentId))
      loadOverview()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve report')
    }
  }

  const confirmBlockUser = async () => {
    const user = blockTarget
    setBlockTarget(null)
    if (!user) return
    try {
      await axios.post(`${API}/users/${user._id}/block`, { reason: 'Violated community guidelines' }, authHeaders)
      toast.success(`${user.firstName} blocked from commenting`)
      refreshCurrentTab()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to block user')
    }
  }

  const unblockUser = async (userId, name) => {
    try {
      await axios.post(`${API}/users/${userId}/unblock`, {}, authHeaders)
      toast.success(`${name} unblocked`)
      setBlockedUsers(prev => prev.filter(u => u._id !== userId))
      loadOverview()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unblock user')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadComments(search)
  }

  const initials = (f, l) => `${f?.[0] || ''}${l?.[0] || ''}`.toUpperCase() || 'U'

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Qspace</title>
      </Helmet>

      <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1A1918] pt-20 pb-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#2D2C29] dark:text-[#F5F4EF]">Admin Dashboard</h1>
            <p className="text-sm text-[#7a6f63] dark:text-[#b7ada4] mt-1">
              Manage comments, reports, and subscribers.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto mb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === key
                    ? 'border-[#d97757] text-[#d97757]'
                    : 'border-transparent text-[#7a6f63] dark:text-[#b7ada4] hover:text-[#2D2C29] dark:hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
                {key === 'reports' && reports.length > 0 && (
                  <Badge className="bg-[#d97757] text-white h-5 min-w-5 px-1.5 rounded-full text-[11px]">
                    {reports.length}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : (
            <>
              {/* ─── Overview ─────────────────────────────────── */}
              {tab === 'overview' && stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Comments" value={stats.totalComments} icon={MessageSquare} />
                  <StatCard label="Reported" value={stats.reportedComments} icon={Flag} accent={stats.reportedComments > 0} />
                  <StatCard label="Hidden" value={stats.hiddenComments} icon={ShieldOff} />
                  <StatCard label="Blocked Users" value={stats.blockedUsers} icon={UserX} />
                  <StatCard label="Subscribers" value={stats.totalSubscriptions} icon={Mail} />
                  <StatCard label="Active Subs" value={stats.activeSubscriptions} icon={ShieldCheck} />
                  <StatCard label="Total Blogs" value={stats.totalBlogs} icon={FileText} />
                  <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
                </div>
              )}

              {/* ─── Comments ─────────────────────────────────── */}
              {tab === 'comments' && (
                <div>
                  <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89f93]" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search comment content..."
                        className="pl-9 rounded-full border-black/[0.08] dark:border-white/[0.1]"
                      />
                    </div>
                    <Button type="submit" variant="outline" className="rounded-full">Search</Button>
                  </form>

                  {comments.length === 0 ? (
                    <EmptyState icon={MessageSquare} text="No comments found." />
                  ) : (
                    <div className="space-y-2">
                      {comments.map(c => (
                        <div
                          key={c._id}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#23201d] border border-black/[0.06] dark:border-white/[0.08]"
                        >
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarImage src={c.userId?.photoUrl} />
                            <AvatarFallback>{initials(c.userId?.firstName, c.userId?.lastName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-[#2D2C29] dark:text-[#F5F4EF]">
                                {c.userId?.firstName || 'Unknown'} {c.userId?.lastName || ''}
                              </span>
                              {c.userId?.isBlockedFromCommenting && (
                                <Badge variant="destructive" className="text-[10px]">Blocked</Badge>
                              )}
                              {c.isHidden && <Badge className="text-[10px] bg-yellow-500 text-white">Hidden</Badge>}
                              <span className="text-xs text-[#a89f93]">on {c.postId?.title || 'deleted post'}</span>
                            </div>
                            <p className="text-sm text-[#4d463f] dark:text-[#d4cfc7] mt-1 line-clamp-3 break-words">
                              {c.content}
                            </p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            {c.postId?._id && (
                              <a
                                href={`/blogs/${c.postId._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 grid place-items-center rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#7a6f63] dark:text-[#b7ada4]"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            {c.userId?._id && !c.userId?.isBlockedFromCommenting && (
                              <button
                                onClick={() => setBlockTarget(c.userId)}
                                title="Block user from commenting"
                                className="w-8 h-8 grid place-items-center rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#7a6f63] dark:text-[#b7ada4]"
                              >
                                <UserX size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteTarget({ type: 'comment', id: c._id })}
                              title="Delete comment"
                              className="w-8 h-8 grid place-items-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── Reports ──────────────────────────────────── */}
              {tab === 'reports' && (
                reports.length === 0 ? (
                  <EmptyState icon={Flag} text="No reported comments. Nice and clean." />
                ) : (
                  <div className="space-y-2">
                    {reports.map(c => (
                      <div
                        key={c._id}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#23201d] border border-red-200/60 dark:border-red-500/20"
                      >
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarImage src={c.userId?.photoUrl} />
                          <AvatarFallback>{initials(c.userId?.firstName, c.userId?.lastName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-[#2D2C29] dark:text-[#F5F4EF]">
                              {c.userId?.firstName || 'Unknown'} {c.userId?.lastName || ''}
                            </span>
                            <Badge variant="destructive" className="text-[10px]">
                              {c.reports?.length || 0} report{c.reports?.length === 1 ? '' : 's'}
                            </Badge>
                            {c.isHidden && <Badge className="text-[10px] bg-yellow-500 text-white">Auto-hidden</Badge>}
                          </div>
                          <p className="text-sm text-[#4d463f] dark:text-[#d4cfc7] mt-1 break-words">{c.content}</p>
                          {c.reports?.length > 0 && (
                            <p className="text-xs text-[#a89f93] mt-2">
                              Reported by: {c.reports.map(r => r.userId?.firstName || 'a user').join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveReport(c._id)}
                            className="rounded-full text-xs h-8"
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setDeleteTarget({ type: 'comment', id: c._id })}
                            className="rounded-full text-xs h-8 bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* ─── Blocked Users ────────────────────────────── */}
              {tab === 'blocked' && (
                blockedUsers.length === 0 ? (
                  <EmptyState icon={UserX} text="No blocked users." />
                ) : (
                  <div className="space-y-2">
                    {blockedUsers.map(u => (
                      <div
                        key={u._id}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#23201d] border border-black/[0.06] dark:border-white/[0.08]"
                      >
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarImage src={u.photoUrl} />
                          <AvatarFallback>{initials(u.firstName, u.lastName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2D2C29] dark:text-[#F5F4EF]">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-[#a89f93]">{u.email}</p>
                          {u.blockedReason && (
                            <p className="text-xs text-red-500 mt-1">Reason: {u.blockedReason}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unblockUser(u._id, u.firstName)}
                          className="rounded-full text-xs h-8 shrink-0"
                        >
                          <ShieldCheck size={13} className="mr-1" />
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* ─── Subscriptions ────────────────────────────── */}
              {tab === 'subscriptions' && (
                <div>
                  <div className="flex gap-3 mb-4">
                    <div className="px-4 py-2 rounded-full bg-[#d97757]/10 text-[#d97757] text-sm font-semibold">
                      {subStats.activeCount} active
                    </div>
                    <div className="px-4 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#7a6f63] dark:text-[#b7ada4] text-sm font-semibold">
                      {subStats.total} total
                    </div>
                  </div>

                  {subscriptions.length === 0 ? (
                    <EmptyState icon={Mail} text="No subscribers yet." />
                  ) : (
                    <div className="space-y-2">
                      {subscriptions.map(s => (
                        <div
                          key={s._id}
                          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#23201d] border border-black/[0.06] dark:border-white/[0.08]"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#d97757]/10 grid place-items-center shrink-0">
                            <Mail size={15} className="text-[#d97757]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#2D2C29] dark:text-[#F5F4EF] truncate">{s.email}</p>
                            <p className="text-xs text-[#a89f93]">
                              {s.active ? 'Active' : 'Unsubscribed'} · {new Date(s.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => setDeleteTarget({ type: 'subscription', id: s._id })}
                            className="w-8 h-8 grid place-items-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation (shared by comments + subscriptions) */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === 'subscription' ? 'Remove this subscriber?' : 'Delete this comment?'}
            </AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTarget?.type === 'subscription' ? confirmDeleteSubscription : confirmDeleteComment}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block user confirmation */}
      <AlertDialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block {blockTarget?.firstName} from commenting?</AlertDialogTitle>
            <AlertDialogDescription>
              They'll no longer be able to post comments on any blog, but their existing comments stay visible unless you delete them separately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlockUser} className="bg-red-600 hover:bg-red-700">
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AdminDashboard
