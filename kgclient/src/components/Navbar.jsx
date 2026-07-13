// Navbar.jsx (PREMIUM REDESIGN)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Logo from "../assets/Qspace.svg";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setUser } from '@/redux/authSlice';
import { toggleTheme } from '@/redux/themeSlice';
import {
  Search,
  Home,
  BookOpen,
  Info,
  PenLine,
  Moon,
  Sun,
  Bell,
  LogOut,
  User,
  BarChart3,
  MessageSquareText,
  Settings,
  Menu,
  X,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveMenu from './ResponsiveMenu';

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const { theme } = useSelector(store => store.theme);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [openNav, setOpenNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // ─── Scroll Detection ────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Click Outside Dropdown ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Keyboard Shortcut: Cmd+K ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `https://kgserver-bjy2.onrender.com/api/v1/user/logout`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/blogs', icon: BookOpen, label: 'Blogs' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-white dark:bg-gray-900 border-b border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 lg:px-6">
          
          {/* ─── LEFT: Logo + Search ───────────────────────────────── */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpenNav(!openNav)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {openNav ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
                Q
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white hidden sm:block">
                Qspace
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:block relative group">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              />
              <Input
                ref={searchRef}
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[320px] lg:w-[420px] h-10 pl-10 pr-16 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-full text-sm focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-all placeholder:text-gray-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                <Command size={10} />K
              </kbd>
            </form>
          </div>

          {/* ─── CENTER: Nav Links (Pill) ───────────────────────────── */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 p-1 bg-gray-100/80 dark:bg-gray-800/50 rounded-full border border-gray-200/50 dark:border-gray-700/50">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 group ${isActive
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                    }`
                  }
                  title={label}
                >
                  <Icon size={17} strokeWidth={2} />
                  {isActive(to) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-white dark:bg-gray-700 shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              ))}
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            </div>
          </nav>

          {/* ─── RIGHT: Actions + Avatar ────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Write Button */}
            <button
              onClick={() => navigate('/dashboard/write-blog')}
              className="hidden sm:flex items-center gap-2 h-9 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:-translate-y-px hover:shadow-lg active:translate-y-0"
            >
              <PenLine size={15} />
              <span>Write</span>
            </button>

            {/* Mobile Write Icon */}
            <button
              onClick={() => navigate('/dashboard/write-blog')}
              className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              <PenLine size={18} />
            </button>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <Avatar className="w-8 h-8 border-2 border-transparent hover:border-blue-500 transition-colors">
                    <AvatarImage src={user.photoUrl || '/user.png'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                      {user.firstName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-4 bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600">
                        <p className="text-sm font-bold text-white">
                          {user?.firstName || 'Qspace'}
                        </p>
                        <p className="text-xs text-blue-100 truncate mt-0.5">
                          {user.email}
                        </p>
                        {user.email === 'futurekgomotso@gmail.com' && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-yellow-400/20 text-yellow-200 text-[10px] font-bold uppercase tracking-wider rounded-full border border-yellow-400/30">
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-0.5">
                        <DropdownItem
                          icon={User}
                          label="Profile"
                          onClick={() => { navigate('/dashboard/profile'); setDropdownOpen(false); }}
                        />
                        <DropdownItem
                          icon={BarChart3}
                          label="Your Blog"
                          onClick={() => { navigate('/dashboard/your-blog'); setDropdownOpen(false); }}
                        />
                        <DropdownItem
                          icon={MessageSquareText}
                          label="Comments"
                          onClick={() => { navigate('/dashboard/comments'); setDropdownOpen(false); }}
                        />
                        <DropdownItem
                          icon={PenLine}
                          label="Write Blog"
                          onClick={() => { navigate('/dashboard/write-blog'); setDropdownOpen(false); }}
                        />
                      </div>

                      <div className="h-px bg-gray-100 dark:bg-gray-700 mx-2" />

                      <div className="p-2 space-y-0.5">
                        <DropdownItem
                          icon={Settings}
                          label="Settings"
                          onClick={() => { navigate('/dashboard/settings'); setDropdownOpen(false); }}
                        />
                        <DropdownItem
                          icon={LogOut}
                          label="Log out"
                          danger
                          onClick={() => { logoutHandler(); setDropdownOpen(false); }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="h-9 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  >
                    Log in
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ─── Mobile Search (visible only on small screens) ──────── */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full text-sm"
            />
          </form>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-16" />

      {/* Mobile Menu Overlay */}
      <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler} />
    </>
  );
};

// ─── Dropdown Item Component ───────────────────────────────────────
const DropdownItem = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
      ${danger
        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
  >
    <Icon size={16} className={danger ? 'text-red-500' : 'text-gray-400'} />
    {label}
  </button>
);

export default Navbar;
