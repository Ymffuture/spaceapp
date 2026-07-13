// Dashboard.jsx (PREMIUM REDESIGN)
import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar'

// Optional: Import if you want a top header bar inside the dashboard
import { Bell, Search, Menu, X, ChevronRight, PanelsTopLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Dashboard = () => {
  const { user } = useSelector((store) => store.auth)
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  // Derive page title from route
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Overview'
    if (path.includes('/profile')) return 'Profile'
    if (path.includes('/your-blog')) return 'Your Blogs'
    if (path.includes('/comments')) return 'Comments'
    if (path.includes('/write-blog')) return 'Write Blog'
    if (path.includes('/settings')) return 'Settings'
    return 'Dashboard'
  }

  const getPageDescription = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Track your activity, stats, and recent updates.'
    if (path.includes('/profile')) return 'Manage your personal information and preferences.'
    if (path.includes('/your-blog')) return 'View and manage all your published articles.'
    if (path.includes('/comments')) return 'Monitor and respond to reader comments.'
    if (path.includes('/write-blog')) return 'Create and publish new blog posts.'
    if (path.includes('/settings')) return 'Configure your account and dashboard preferences.'
    return 'Manage your Qspace account'
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | Dashboard | Qspace</title>
        <meta name="description" content={getPageDescription()} />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex">
        
        {/* ─── Mobile Sidebar Overlay ─────────────────────────────── */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-[280px] z-50 lg:hidden"
              >
                <Sidebar 
                  collapsed={false} 
                  onCollapse={() => {}} 
                  isMobile={true}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ─── Desktop Sidebar ──────────────────────────────────── */}
        <div className={`hidden lg:block transition-all duration-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>

        {/* ─── Main Content Area ────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col">
          
          {/* Top Header Bar */}
          <header 
            className={`sticky top-0 z-30 h-[60px] flex items-center justify-between px-6 lg:px-8 transition-all duration-300
              ${scrolled 
                ? 'bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] shadow-sm' 
                : 'bg-transparent'
              }`}
          >
            {/* Left: Mobile Toggle + Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <PanelsTopLeft size={20} />
              </button>

              <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-400 dark:text-zinc-500">
                <span className="hover:text-gray-600 dark:hover:text-zinc-300 cursor-pointer transition-colors">Dashboard</span>
                <ChevronRight size={14} />
                <span className="text-gray-800 dark:text-zinc-200 font-medium">{getPageTitle()}</span>
              </nav>
            </div>

            {/* Right: Search + Notifications + Avatar */}
            <div className="flex items-center gap-2">
              {/* Quick Search */}
              <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-zinc-400 transition-colors">
                <Search size={18} />
              </button>

              {/* Notifications */}
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-zinc-400 transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0a0a0a]" />
              </button>

              {/* User Avatar */}
              
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <motion.h1 
                key={location.pathname}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {getPageTitle()}
              </motion.h1>
              <motion.p
                key={location.pathname + '-desc'}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400"
              >
                {getPageDescription()}
              </motion.p>
            </div>

            {/* Outlet with animation */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Dashboard
