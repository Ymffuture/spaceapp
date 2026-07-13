import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  SquareUser,
  BarChart3,
  MessageSquareText,
  PenLine,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const navItems = [
  { path: '/dashboard/profile', label: 'Profile', icon: SquareUser },
  { path: '/dashboard/your-blog', label: 'Your Blogs', icon: BarChart3 },
  { path: '/dashboard/comments', label: 'Comments', icon: MessageSquareText, badge: 3 },
  { path: '/dashboard/write-blog', label: 'Create Blog', icon: PenLine },
];

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-[240px]';

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-[#0f0f0f] border-r border-gray-100 dark:border-zinc-800/80 flex flex-col transition-all duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarWidth}`}
      >
        {/* ─── Logo ─────────────────────────────────────────────── */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-gray-100 dark:border-zinc-800/80 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-sm shadow-blue-500/20">
            Q
          </div>
          {!collapsed && (
            <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
              Qspace
            </span>
          )}
          {/* Collapse Toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex ml-auto w-6 h-6 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* ─── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Dashboard
            </div>
          )}

          {navItems.map(({ path, label, icon: Icon, badge }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-zinc-200'
                  }
                  ${collapsed ? 'justify-center' : ''}`
                }
              >
                {/* Active indicator bar */}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
                )}

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${collapsed ? '' : ''}`}
                />

                {!collapsed && (
                  <>
                    <span className="truncate">{label}</span>
                    {badge && (
                      <span className="ml-auto px-2 py-0.5 bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full">
                        {badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-zinc-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {label}
                    {badge && ` (${badge})`}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ─── Bottom: User ───────────────────────────────────── */}
        <div className="p-3 border-t border-gray-100 dark:border-zinc-800/80">
          <div
            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer
              ${collapsed ? 'justify-center' : ''}`}
          >
            <Avatar className="w-8 h-8 border-2 border-gray-100 dark:border-zinc-700 flex-shrink-0">
              <AvatarImage src={user?.photoUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                {user?.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                  {user?.firstName || 'Guest'} {user?.lastName || ''}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
                  {user?.email || 'Sign in to continue'}
                </p>
              </div>
            )}

            {/* Collapsed tooltip */}
            {collapsed && (
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-zinc-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {user?.firstName || 'Guest'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Mobile Toggle Button ───────────────────────────── */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-6 left-6 z-50 lg:hidden w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95"
      >
        {mobileOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* ─── Content Spacer ─────────────────────────────────── */}
      <div className={`hidden lg:block transition-all duration-300 ${sidebarWidth}`} />
    </>
  );
};

export default Sidebar;
