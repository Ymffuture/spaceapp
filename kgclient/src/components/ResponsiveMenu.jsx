import React, { useRef } from 'react';
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

  // ─── Swipe left (anywhere on the open drawer) to close it ───────
  const touchStartX = useRef(0);
  const touchTracking = useRef(false);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchTracking.current = true;
  };
  const onTouchMove = (e) => {
    if (!touchTracking.current) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (delta < -60) {
      setOpenNav(false);
      touchTracking.current = false;
    }
  };
  const onTouchEnd = () => { touchTracking.current = false; };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/blogs', icon: BookOpen, label: 'Blog' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/dashboard/write-blog', icon: PenLine, label: 'Write a Blog' },
  ];

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://github.com', icon: Github, label: 'GitHub' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[#1A1918]/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${openNav ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpenNav(false)}
      />

      {/* Drawer — Claude.ai-style: warm cream surface, terracotta accent, soft rounded corners */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`fixed top-0 bottom-0 left-0 w-[86%] max-w-[340px] bg-[#FAF9F5] dark:bg-[#1A1918] z-[51] flex flex-col shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] rounded-r-[28px] overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${openNav ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* ─── Header / Profile ───────────────────────────────── */}
        <div className="px-6 pt-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {user ? (
                <Avatar className="w-[52px] h-[52px] border-2 border-[#D97757]/25">
                  <AvatarImage src={user.photoUrl} />
                  <AvatarFallback className="bg-[#D97757] text-white text-lg font-semibold">
                    {user.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-[52px] h-[52px] rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center">
                  <User size={24} className="text-[#87867F]" />
                </div>
              )}
              <div>
                <h2 className="text-[15px] font-semibold text-[#2D2C29] dark:text-[#F5F4EF]">
                  {user ? `Hi, ${user.firstName}` : 'Welcome'}
                </h2>
                {user && (
                  <p className="text-[13px] text-[#87867F] dark:text-[#8E8D86] mt-0.5 truncate max-w-[170px]">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setOpenNav(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#87867F] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ─── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpenNav(false)}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-medium text-[#3D3C38] dark:text-[#D4D3CC] hover:bg-[#D97757]/10 hover:text-[#BD5D3A] dark:hover:text-[#E08D6D] transition-colors duration-150"
            >
              <Icon size={19} strokeWidth={1.75} />
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
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] text-[#87867F] dark:text-[#B8B7B0] text-[15px] font-medium hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-[#3D3C38] dark:hover:text-white transition-all"
            >
              <LogOut size={17} strokeWidth={1.75} />
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpenNav(false)}
              className="block mt-4"
            >
              <Button className="w-full h-11 rounded-2xl bg-[#D97757] hover:bg-[#BD5D3A] text-white font-medium text-[15px] shadow-sm transition-colors">
                Get Started
              </Button>
            </Link>
          )}
        </nav>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <div className="px-6 py-5 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex justify-center gap-2.5">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-black/[0.03] dark:bg-white/[0.06] text-[#87867F] dark:text-[#B8B7B0] flex items-center justify-center hover:bg-[#D97757]/15 hover:text-[#BD5D3A] dark:hover:text-[#E08D6D] transition-colors duration-150"
              >
                <Icon size={16} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
