import React from 'react'
import { FaUserCircle, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa"
import { FaChevronRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
  const { user } = useSelector(store => store.auth)

  return (
    <div
      className={`
        fixed top-0 bottom-0 z-50 h-screen w-[70%] md:w-[50%] lg:w-[30%]
        flex flex-col justify-between px-6 pt-10 pb-6
        bg-gradient-to-br from-[#F0F8FF] via-white to-[#E0F7FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
        text-black dark:text-white shadow-2xl rounded-r-3xl
        transition-all duration-500 ease-in-out
        ${openNav ? "left-0" : "-left-full"}
      `}
    >
      {/* User Profile */}
      <div>
        <div className="flex items-center gap-4">
          {user ? (
            <Avatar className="h-14 w-14 shadow-lg ring-2 ring-[#1E90FF]">
              <AvatarImage src={user.photoUrl} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ) : (
            <FaUserCircle className="h-14 w-14 text-[#1E90FF]" />
          )}
          <div>
            <h1 className="text-lg font-semibold">Hello, {user?.firstName || "Guest"}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Premium Member</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-10">
          <ul className="flex flex-col gap-6 text-base font-medium tracking-wide">
            <Link to="/" onClick={() => setOpenNav(false)}>
              <li className="hover:text-[#1E90FF] transition">🏠 Home</li>
            </Link>
            <Link to="/blogs" onClick={() => setOpenNav(false)}>
              <li className="hover:text-[#32CD32] transition">📝 Blog</li>
            </Link>
            <Link to="/about" onClick={() => setOpenNav(false)}>
              <li className="hover:text-[#FFD700] transition">📘 About</li>
            </Link>

            {user ? (
              <Button
                onClick={() => {
                  logoutHandler()
                  setOpenNav(false)
                }}
                className="mt-6 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white font-semibold shadow-xl"
              >
                Logout
              </Button>
            ) : (
              <Link to="/signup" onClick={() => setOpenNav(false)}>
                <Button className="mt-6 w-full bg-[#1E90FF] text-white hover:bg-[#0073e6]">
                  Signup
                </Button>
              </Link>
            )}
          </ul>
        </nav>
      </div>

      {/* Social Icons + Close */}
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-xl">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#333] dark:hover:text-white">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5]">
              <FaLinkedin />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1DA1F2]">
              <FaXTwitter />
            </a>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setOpenNav(false)}
            className="p-2 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 transition"
            aria-label="Close Menu"
          >
            <FaChevronRight size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center dark:text-gray-400">© {new Date().getFullYear()} Quorvex. All rights reserved.</p>
      </div>
    </div>
  )
}

export default ResponsiveMenu
