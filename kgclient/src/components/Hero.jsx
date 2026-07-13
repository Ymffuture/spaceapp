import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from './ui/button'
import { ArrowRight, Play, Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react'

const Hero = () => {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    document.title = "Home | Qspace-Blog"
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Explore the latest tech & web trends. In-depth articles, tutorials, and insights on web development, digital marketing, and tech innovations.")
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      setMousePosition({
        x: (clientX - innerWidth / 2) / 50,
        y: (clientY - innerHeight / 2) / 50
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = [
    { icon: BookOpen, label: 'Articles', value: '500+', color: 'text-blue-500' },
    { icon: Users, label: 'Readers', value: '10K+', color: 'text-emerald-500' },
    { icon: TrendingUp, label: 'Trending', value: '50+', color: 'text-amber-500' },
  ]

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a]"
    >
      {/* ─── Background Elements ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <motion.div 
          style={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ x: mousePosition.x * -1.5, y: mousePosition.y * -1.5 }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ x: mousePosition.x * 1, y: mousePosition.y * 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* ─── Main Content ────────────────────────────────────── */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="space-y-8">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                <Sparkles size={14} />
                <span>Your daily dose of tech insights</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                <span className="text-gray-900 dark:text-white">Explore the</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                  Latest Tech
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">& Web Trends</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-500 dark:text-zinc-400 leading-relaxed max-w-xl"
            >
              Stay ahead with in-depth articles, tutorials, and insights on web development, 
              digital marketing, and cutting-edge tech innovations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/dashboard/write-blog">
                <Button 
                  size="lg"
                  className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 group"
                >
                  Start Writing
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/blogs">
                <Button 
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 font-semibold text-base gap-2 group"
                >
                  <Play size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  Browse Articles
                </Button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-8 pt-4"
            >
              {stats.map(({ icon: Icon, label, value, color }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 ml-4" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-100 dark:border-zinc-800">
                <img
                  src="/api/placeholder/600/450"
                  alt="Tech blog preview"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Trending Now</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">React 19 Features</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-6 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 border-2 border-white dark:border-zinc-900" />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Active Writers</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">1,200+ this week</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative ring */}
              <div className="absolute -z-10 -inset-4 rounded-[2rem] border border-blue-500/10 dark:border-blue-500/5" />
            </div>
          </motion.div>
        </div>

        {/* ─── Scroll Indicator ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-gray-200 dark:border-zinc-700 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-zinc-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
