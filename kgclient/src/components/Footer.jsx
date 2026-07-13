import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/Qspace.svg'
import { toast } from 'sonner'
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from 'react-icons/fa'
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  Heart,
} from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setSubscribed(true)
    toast.success('Thanks for subscribing!')
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  const currentYear = new Date().getFullYear()

  const navLinks = [
    { to: '/', label: 'Home', color: 'hover:text-blue-400' },
    { to: '/blogs', label: 'Blogs', color: 'hover:text-emerald-400' },
    { to: '/about', label: 'About Us', color: 'hover:text-amber-400' },
    { to: '/faqs', label: 'FAQs', color: 'hover:text-rose-400' },
  ]

  const socialLinks = [
    {
      href: 'https://facebook.com',
      icon: FaFacebookF,
      label: 'Facebook',
      color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white',
    },
    {
      href: 'https://instagram.com',
      icon: FaInstagram,
      label: 'Instagram',
      color: 'bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-white',
    },
    {
      href: 'https://twitter.com',
      icon: FaTwitter,
      label: 'Twitter',
      color: 'bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white',
    },
    {
      href: 'https://pinterest.com',
      icon: FaPinterestP,
      label: 'Pinterest',
      color: 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white',
    },
  ]

  return (
    <footer className="relative bg-[#0a0a0f] text-white overflow-hidden">
      {/* Top gradient accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* ─── Brand Column ───────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-300">
                <img
                  src={Logo}
                  alt="Qspace"
                  className="w-7 h-7 object-contain invert"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">Qspace</span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering future minds through coding, AI, and innovation. Building the next generation of tech leaders.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400 group">
                <MapPin size={16} className="mt-0.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-gray-300 transition-colors">
                  2354, JHB South, 1841
                </span>
              </div>
              <a
                href="mailto:quorvexinstitute@gmail.com"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <Mail size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                <span>quorvexinstitute@gmail.com</span>
              </a>
              <a
                href="tel:+27634414863"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <Phone size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                <span>+27 63 441 4863</span>
              </a>
            </div>
          </div>

          {/* ─── Navigation Column ──────────────────────────────── */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-5">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map(({ to, label, color }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`group flex items-center gap-2 text-sm text-gray-400 ${color} transition-all duration-200`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-current transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Connect Column ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-5">
              Connect
            </h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300 ${color}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Follow us for daily updates and tech insights.
            </p>
          </div>

          {/* ─── Newsletter Column ──────────────────────────────── */}
          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-5">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Get the latest articles, tutorials, and updates delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-11 pl-4 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribed}
                  className={`h-11 px-5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                    subscribed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {subscribed ? (
                    'Subscribed!'
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Powered By */}
            <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
                Powered By
              </p>
              <a
                href="https://quorvexinstitute.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2"
              >
                <span className="text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
                  Quorvex Institute
                </span>
                <ExternalLink size={12} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
              </a>
              <p className="mt-1 text-xs text-gray-500 italic">
                Learn. Code. Transform.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              &copy; {currentYear} Qspace. Made with
              <Heart size={12} className="text-red-500 fill-red-500" />
              in South Africa.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <Link to="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                Learn more <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
