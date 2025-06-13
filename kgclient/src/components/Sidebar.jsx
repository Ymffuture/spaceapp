import { ChartColumnBig, FolderPlus, SquareUser } from 'lucide-react';
import { LiaCommentSolid } from "react-icons/lia";
import { FaRegEdit } from 'react-icons/fa';
import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [

  { path: '/dashboard/profile', label: 'Profile', icon: <SquareUser /> },
  { path: '/dashboard/your-blog', label: 'Your Blogs', icon: <ChartColumnBig /> },
  { path: '/dashboard/comments', label: 'Comments', icon: <LiaCommentSolid /> },
  { path: '/dashboard/write-blog', label: 'Create Blog', icon: <FaRegEdit /> },
];

const Sidebar = () => {
  return (
    <div className="hidden mt-10 fixed md:block border-r-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-lg border-gray-300 dark:border-gray-700 w-[220px] px-2 py-12 space-y-6 h-screen z-20 shadow-xl rounded-tr-3xl rounded-br-3xl transition-all duration-300">
      <div className="space-y-4">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 font-semibold px-4 py-2 rounded-2xl text-sm transition-all duration-200 group 
              ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'}`
            }
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
