import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Home,
  BookOpen,
  Info,
  PenLine,
  LogOut,
  User,
  X,
  Facebook,
  Instagram,
  Twitter,
  Github,
} from 'lucide-react';

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/blogs', icon: BookOpen, label: 'Blog' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/dashboard/write-blog', icon: PenLine, label: 'Write a Blog' },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600 hover:text-white' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600 hover:text-white' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500 hover:text-white' },
    { href: 'https://github.com', icon: Github, label: 'GitHub', color: 'hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${openNav ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpenNav(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-[85%] max-w-[340px] bg-white dark:bg-[#0f0f0f] z-[51] flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${openNav ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* ─── Header / Profile ───────────────────────────────── */}
        <div className="px-6 pt-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            {user ? (
              <Avatar className="w-14 h-14 border-[3px] border-blue-100 dark:border-blue-500/20 shadow-sm">
                <AvatarImage src={user.photoUrl} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-lg font-bold">
                  {user.firstName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <User size={28} className="text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Hello, {user?.firstName || 'Guest'}
              </h2>
              {user && (
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 truncate max-w-[180px]">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpenNav(false)}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium text-gray-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150"
            >
              <Icon size={19} strokeWidth={2} />
              {label}
            </Link>
          ))}

          {/* CTA Button */}
          {user ? (
            <button
              onClick={() => {
                logoutHandler();
                setOpenNav(false);
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[15px] font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpenNav(false)}
              className="block mt-4"
            >
              <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[15px] shadow-lg shadow-blue-500/20">
                Get Started
              </Button>
            </Link>
          )}
        </nav>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <div className="px-6 py-5 border-t border-gray-100 dark:border-zinc-800">
          {/* Social Icons */}
          <div className="flex justify-center gap-3 mb-5">
            {socialLinks.map(({ href, icon: Icon, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 flex items-center justify-center transition-all duration-200 ${color} hover:-translate-y-0.5`}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setOpenNav(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-200 transition-all"
          >
            <X size={16} />
            Close Menu
          </button>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
