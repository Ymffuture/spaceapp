// Navbar.jsx (PREMIUM REDESIGN)
import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

// UI Components
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Icons
import {
  Home,
  BookOpen,
  Info,
  PenLine,
  Moon,
  Sun,
  Search,
  LogOut,
  User,
  BarChart3,
  MessageSquareText,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { FaCheckCircle, FaSignInAlt } from 'react-icons/fa'

// Redux
import { setUser } from '@/redux/authSlice'
import { toggleTheme } from '@/redux/themeSlice'

// Assets
import Logo from "../assets/Qspace.svg"
import ResponsiveMenu from './ResponsiveMenu'

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const { theme } = useSelector(store => store.theme)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchTerm, setSearchTerm] = useState('')
  const [openNav, setOpenNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  // ─── Scroll Detection ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ─── Close mobile menu on route change ───────────────────────
  useEffect(() => {
    setOpenNav(false)
  }, [location.pathname])

  // ─── Logout ──────────────────────────────────────────────────
  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `https://kgserver-bjy2.onrender.com/api/v1/user/logout`,
        { withCredentials: true }
      )
      if (res.data.success) {
        navigate("/")
        dispatch(setUser(null))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Logout failed')
    }
  }

  // ─── Search ────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  // ─── Nav Links Config ────────────────────────────────────────
  const navLinks = [
    { to: '/', icon: Home, label: 'Home', tooltip: 'Home' },
    { to: '/blogs', icon: BookOpen, label: 'Blogs', tooltip: 'Blogs' },
    { to: '/about', icon: Info, label: 'About', tooltip: 'About' },
    { to: '/dashboard/write-blog', icon: PenLine, label: 'Write', tooltip: 'Write a Blog' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/85 dark:bg-[#0f0f0f]/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] border-b border-black/[0.06] dark:border-white/[0.06]'
            : 'bg-white/60 dark:bg-[#0f0f0f]/60 backdrop-blur-md border-b border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-4">
            
            {/* ─── Left: Logo + Mobile Toggle ────────────────────── */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => setOpenNav(!openNav)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {openNav ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                  Q
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">Qspace</span>
              </Link>
            </div>

            {/* ─── Center: Search Bar ────────────────────────────── */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[520px] mx-4">
              <div className="relative w-full group">
                <Input
                  type="search"
                  placeholder="Search articles, topics, authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-4 pr-11 rounded-full border border-black/[0.08] bg-black/[0.02] dark:bg-white/[0.03] dark:border-white/[0.08] text-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all group-hover:bg-white dark:group-hover:bg-white/[0.05]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-all"
                >
                  <Search size={15} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            {/* ─── Right: Nav + Auth ─────────────────────────────── */}
            <div className="flex items-center gap-1.5">
              
              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
                {navLinks.map(({ to, icon: Icon, label, tooltip }) => (
                  <NavLink
                    key={to}
                    to={to}
                    data-tooltip-id="nav-tooltip"
                    data-tooltip-content={tooltip}
                    className={({ isActive }) =>
                      `relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-gray-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-zinc-200'
                      }`
                    }
                  >
                    <Icon size={17} strokeWidth={2} />
                  </NavLink>
                ))}

                {/* Theme Toggle */}
                <button
                  onClick={() => dispatch(toggleTheme())}
                  data-tooltip-id="nav-tooltip"
                  data-tooltip-content="Toggle Theme"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-zinc-200 transition-all"
                >
                  {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
                </button>
              </nav>

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {/* ─── Auth Section ──────────────────────────────── */}
              {user ? (
                <div className="ml-2">
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <div
                      className="relative"
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Avatar className="w-9 h-9 cursor-pointer border-2 border-transparent hover:border-blue-500/30 transition-all hover:scale-105 shadow-sm">
                          <AvatarImage src={user.photoUrl || '/user.png'} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                            {user.firstName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>

                      {/* Hover Preview Card */}
                      <AnimatePresence>
                        {hovered && !dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className="absolute right-0 top-12 w-64 bg-white dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-5 z-50 pointer-events-none"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user.photoUrl} />
                                <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                                  {user.firstName?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  {user?.firstName || 'Qspace'} {user?.lastName || ''}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate max-w-[180px]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            {user.email === 'futurekgomotso@gmail.com' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 rounded-full">
                                Admin <FaCheckCircle size={10} />
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-64 p-2 bg-white dark:bg-zinc-900 border border-black/[0.06] dark:border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                    >
                      <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500">
                        {user.email === 'futurekgomotso@gmail.com' ? (
                          <>Admin <FaCheckCircle size={14} /></>
                        ) : (
                          'My Account'
                        )}
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator className="my-1.5 bg-black/[0.06] dark:bg-white/[0.06]" />

                      <DropdownMenuGroup className="space-y-0.5">
                        <DropdownMenuItem
                          onClick={() => { navigate('/dashboard/profile'); setDropdownOpen(false) }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                        >
                          <User size={16} className="text-blue-500" />
                          <span>Profile</span>
                          <DropdownMenuShortcut className="text-xs text-gray-400">⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => { navigate('/dashboard/your-blog'); setDropdownOpen(false) }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                        >
                          <BarChart3 size={16} className="text-emerald-500" />
                          <span>Your Blog</span>
                          <DropdownMenuShortcut className="text-xs text-gray-400">⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => { navigate('/dashboard/comments'); setDropdownOpen(false) }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                        >
                          <MessageSquareText size={16} className="text-amber-500" />
                          <span>Comments</span>
                          <DropdownMenuShortcut className="text-xs text-gray-400">⌘C</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => { navigate('/dashboard/write-blog'); setDropdownOpen(false) }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                        >
                          <PenLine size={16} className="text-blue-500" />
                          <span>Write Blog</span>
                          <DropdownMenuShortcut className="text-xs text-gray-400">⌘W</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="my-1.5 bg-black/[0.06] dark:bg-white/[0.06]" />

                      <DropdownMenuItem
                        onClick={logoutHandler}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Log out</span>
                        <DropdownMenuShortcut className="text-xs text-gray-400">⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link to="/login" className="ml-2">
                  <Button
                    variant="outline"
                    className="h-9 px-5 rounded-full border-black/10 dark:border-white/10 bg-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-sm font-medium gap-2"
                  >
                    <FaSignInAlt size={14} />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tooltips */}
      <Tooltip id="nav-tooltip" className="z-[60]" />

      {/* Mobile Menu */}
      <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler} />

      {/* Spacer for fixed header */}
      <div className="h-[60px]" />
    </>
  )
}

export default Navbar
