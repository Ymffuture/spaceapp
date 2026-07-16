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
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Blogs' },
    { to: '/about', label: 'About Us' },
    { to: '/faqs', label: 'FAQs' },
  ]

  const socialLinks = [
    { href: 'https://facebook.com', icon: FaFacebookF, label: 'Facebook' },
    { href: 'https://instagram.com', icon: FaInstagram, label: 'Instagram' },
    { href: 'https://twitter.com', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://pinterest.com', icon: FaPinterestP, label: 'Pinterest' },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-[#ded4c7] bg-[#f4f3ee] text-[#191817] dark:border-[#2b2623] dark:bg-[#141413] dark:text-[#f8f3ed]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-10 h-64 w-64 rounded-full bg-[#c96442]/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-[#0866ff]/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#191817] shadow-sm transition-transform duration-300 group-hover:scale-105 dark:bg-[#f8f3ed]">
                <img src={Logo} alt="Qspace" className="h-7 w-7 object-contain invert dark:invert-0" />
              </div>
              <span className="text-xl font-semibold tracking-[-0.02em]">Qspace</span>
            </Link>

            <p className="max-w-sm text-sm leading-6 text-[#5a554e] dark:text-[#b7ada4]">
              Empowering future minds through coding, AI, and innovation. Building the next generation of tech leaders.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-[#5a554e] dark:text-[#b7ada4]">
                <MapPin size={16} className="mt-0.5 text-[#8a847a]" />
                <span>2354, JHB South, 1841</span>
              </div>
              <a
                href="mailto:quorvexinstitute@gmail.com"
                className="flex items-center gap-3 text-sm text-[#5a554e] transition-colors hover:text-[#0866ff] dark:text-[#b7ada4]"
              >
                <Mail size={16} className="text-[#8a847a]" />
                <span>quorvexinstitute@gmail.com</span>
              </a>
              <a
                href="tel:+27634414863"
                className="flex items-center gap-3 text-sm text-[#5a554e] transition-colors hover:text-[#0866ff] dark:text-[#b7ada4]"
              >
                <Phone size={16} className="text-[#8a847a]" />
                <span>+27 63 441 4863</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#5a554e] dark:text-[#b7ada4]">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2 text-sm text-[#5a554e] transition-colors hover:text-[#0866ff] dark:text-[#b7ada4]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#cfc7bc] transition-colors group-hover:bg-[#0866ff]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#5a554e] dark:text-[#b7ada4]">
              Connect
            </h3>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#ded4c7] bg-white text-[#5a554e] transition-all duration-300 hover:border-[#0866ff] hover:bg-[#0866ff] hover:text-white dark:border-[#2b2623] dark:bg-[#1a1a18] dark:text-[#b7ada4]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#8a847a] dark:text-[#8f857c]">
              Follow us for daily updates and tech insights.
            </p>
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#5a554e] dark:text-[#b7ada4]">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm leading-6 text-[#5a554e] dark:text-[#b7ada4]">
              Get the latest articles, tutorials, and updates delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 flex-1 rounded-full border border-[#ded4c7] bg-white px-4 text-sm text-[#191817] outline-none transition-all placeholder:text-[#8a847a] focus:border-[#0866ff] focus:ring-2 focus:ring-[#0866ff]/15 dark:border-[#2b2623] dark:bg-[#1a1a18] dark:text-[#f8f3ed]"
              />
              <button
                type="submit"
                disabled={subscribed}
                className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 ${
                  subscribed
                    ? 'bg-[#6b7a3d] text-white'
                    : 'bg-[#0866ff] text-white hover:bg-[#0143b5]'
                }`}
              >
                {subscribed ? 'Subscribed!' : <>Subscribe <ArrowRight size={14} /></>}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-[#ded4c7] bg-white/70 p-4 dark:border-[#2b2623] dark:bg-[#1a1a18]">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#8a847a]">
                Powered By
              </p>
              <a
                href="https://quorvexinstitute.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2"
              >
                <span className="font-semibold text-[#c96442] transition-colors group-hover:text-[#b55738]">
                  Quorvex Institute
                </span>
                <ExternalLink size={12} className="text-[#8a847a] transition-colors group-hover:text-[#0866ff]" />
              </a>
              <p className="mt-1 text-xs italic text-[#8a847a] dark:text-[#8f857c]">
                Learn. Code. Transform.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#ded4c7] pt-8 dark:border-[#2b2623]">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="flex items-center gap-1.5 text-xs text-[#8a847a] dark:text-[#8f857c]">
              &copy; {currentYear} Qspace. Made with
              <Heart size={12} className="fill-[#c96442] text-[#c96442]" />
              in South Africa.
            </p>

            <div className="flex items-center gap-5 text-xs text-[#8a847a] dark:text-[#8f857c]">
              <Link to="/privacy" className="transition-colors hover:text-[#0866ff]">
                Privacy Policy
              </Link>
              <span className="h-1 w-1 rounded-full bg-[#cfc7bc]" />
              <Link to="/terms" className="transition-colors hover:text-[#0866ff]">
                Terms of Service
              </Link>
              <span className="h-1 w-1 rounded-full bg-[#cfc7bc]" />
              <Link to="/about" className="inline-flex items-center gap-1 transition-colors hover:text-[#0866ff]">
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
