import React from 'react'
import {
  FaUserCircle, FaFacebook, FaInstagram, FaTwitter, FaGithub,
  FaChevronRight, FaHome, FaBlog, FaInfoCircle, FaCrown
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
  const { user } = useSelector(store => store.auth)

  return (
    <div
      className={`
        ${openNav ? "left-0" : "-left-full"}
        fixed top-0 bottom-0 z-50 h-screen w-[70%] sm:w-[50%] lg:w-[20%]
        flex flex-col justify-between px-6 pt-12 pb-6
        bg-gradient-to-br from-[#F0F8FF] via-white to-blue-50 dark:from-gray-900 dark:to-gray-800
        text-black dark:text-white shadow-2xl
        rounded-r-3xl transition-all duration-300 ease-in-out
      `}
    >
      {/* Header / Profile */}
      <div>
        <div className="flex items-center gap-4">
          {user ? (
            <Avatar className="h-14 w-14 shadow-xl ring-4 ring-[#1E90FF]">
              <AvatarImage src={user.photoUrl} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ) : (
            <FaUserCircle className="h-14 w-14 text-[#1E90FF]" />
          )}

          <div className='relative'>
            <h1 className="text-lg font-bold">Hello, {user?.firstName || "Guest"}</h1>
            <p className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-300 bg-[#bb9f0076] p-1 rounded-full top-[-30px] right-[120px] rotate-[-25deg] absolute zoom-[20%]">
              <FaCrown className="text-yellow-500" /> Premium
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-10">
          <ul className="flex flex-col gap-5 text-lg font-semibold tracking-wide">
            <Link to="/" onClick={() => setOpenNav(false)}>
              <li className="flex items-center gap-2 hover:text-[#1E90FF] transition-all duration-200">
                <FaHome /> Home
              </li>
            </Link>
            <Link to="/blogs" onClick={() => setOpenNav(false)}>
              <li className="flex items-center gap-2 hover:text-[#1E90FF] transition-all duration-200">
                <FaBlog /> Blog
              </li>
            </Link>
            <Link to="/about" onClick={() => setOpenNav(false)}>
              <li className="flex items-center gap-2 hover:text-[#1E90FF] transition-all duration-200">
                <FaInfoCircle /> About
              </li>
            </Link>

            {user ? (
              <Button
                variant="glow"
                className="mt-6 w-full bg-[#32CD32] text-white hover:bg-green-700 transition"
                onClick={() => {
                  logoutHandler()
                  setOpenNav(false)
                }}
              >
                Logout
              </Button>
            ) : (
              <Link to="/signup" onClick={() => setOpenNav(false)}>
                <Button className="mt-6 w-full bg-[#1E90FF] text-white hover:bg-blue-700 transition">
                  Signup
                </Button>
              </Link>
            )}
          </ul>
        </nav>
      </div>

      {/* Footer Social Icons + Close */}
      <div className="flex flex-col items-center">
        <div className="flex space-x-6 mt-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="text-[#1E90FF] hover:text-blue-700 text-2xl transition transform hover:scale-110" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="text-pink-600 hover:text-pink-800 text-2xl transition transform hover:scale-110" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="text-sky-500 hover:text-sky-700 text-2xl transition transform hover:scale-110" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-gray-800 dark:text-white hover:text-black text-2xl transition transform hover:scale-110" />
          </a>
        </div>

        {/* Close Button */}
        <div className="mt-10">
          <button
            onClick={() => setOpenNav(false)}
            className="p-3 rounded-full bg-[#FFD700] hover:bg-yellow-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            title="Close Menu"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveMenu
