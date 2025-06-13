import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter,FaLink } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className= "bg-gradient-to-br from-[#F0F8FF] to-white dark:from-[#111827] dark:to-[#1f2937] pt-12 pb-6 relative z-10 ">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            {/* <img src={Logo} alt="Quorvex Logo" className="w-12 h-12 object-contain rounded-full border border-gray-500 p-1" /> */}
            <h1 className="text-2xl font-bold ">Qspace</h1>
          </Link>
          <p className="mt-3 text-sm">
            Empowering future minds through coding, AI, and innovation.
          </p>
          <p className="mt-1 text-sm opacity-70">2354, JHB South, 1841</p>
          <p className="text-sm opacity-70">Email: <a href="mailto:quorvexinstitute@gmail.com" className="underline">quorvexinstitute@gmail.com</a></p>
          <p className="text-sm opacity-70">Phone: <a href="tel:+27634414863" className="underline">+27 63 441 4863</a></p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-all">Home</Link></li>
            <li><Link to="/blogs" className="hover:text-green-400 transition-all">Blogs</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400 transition-all">About Us</Link></li>
            <li><Link to="/faqs" className="hover:text-pink-400 transition-all">FAQs</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect with Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-all">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-all">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-all">
              <FaTwitter />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-all">
              <FaPinterestP />
            </a>
          </div>
        </div>

        {/* Powered by */}
        <div>
          <h3 className="text-lg font-semibold mb-3 ">Powered By</h3>
          <p className="text-sm">
            This platform is proudly developed and maintained by the team at
             <span className="text-green-400 font-small"> <a href='https//quorvexinstitute.vercel.app'> Quorvex Institute</a> </span>.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Learn. Code. Transform.
          </p>
          <Link
            to="/about"
            className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-500 transition font-semibold underline"
          >
            Learn more →
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Qspace. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
