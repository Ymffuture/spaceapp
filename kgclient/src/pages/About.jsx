import React from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import {
  PenLine,
  Users,
  Globe,
  Heart,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Shield,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import aboutImg from "../assets/About-blog.avif"

const About = () => {
  const values = [
    {
      icon: PenLine,
      title: 'Create Freely',
      description: 'Express your thoughts without boundaries. Our platform gives you the tools to write, publish, and share your unique perspective with the world.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Users,
      title: 'Connect Deeply',
      description: 'Build meaningful relationships with readers and writers who share your passions. Engage through comments, discussions, and collaborative learning.',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Globe,
      title: 'Grow Together',
      description: 'Join a thriving community of thinkers, creators, and innovators. Learn from diverse perspectives and expand your horizons with every article.',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
      textColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      icon: Heart,
      title: 'Inspire Change',
      description: 'Words have power. Use them to motivate, educate, and transform lives. Every story you share has the potential to make a real difference.',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-500/10',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
  ]

  const stats = [
    { icon: BookOpen, value: '500+', label: 'Articles Published', color: 'text-blue-500' },
    { icon: Users, value: '10K+', label: 'Active Readers', color: 'text-emerald-500' },
    { icon: MessageCircle, value: '50K+', label: 'Comments', color: 'text-violet-500' },
    { icon: TrendingUp, value: '98%', label: 'Growth Rate', color: 'text-amber-500' },
  ]

  const features = [
    { icon: Target, title: 'Focused Content', desc: 'Curated articles that matter' },
    { icon: Zap, title: 'Fast Publishing', desc: 'Write and publish in seconds' },
    { icon: Shield, title: 'Safe Community', desc: 'Respectful, inclusive space' },
  ]

  return (
    <>
      <Helmet>
        <title>About Us | Qspace</title>
        <meta name="description" content="Learn about Qspace - a platform for readers, writers, and thinkers to connect through stories, tutorials, and creative insights." />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        
        {/* ─── Hero Section ────────────────────────────────────── */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
                <Sparkles size={14} />
                Our Story
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                <span className="text-gray-900 dark:text-white">About</span>{' '}
                <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                  Qspace
                </span>
              </h1>

              <p className="mt-6 text-xl text-gray-500 dark:text-zinc-400 leading-relaxed">
                A place to share thoughts, inspire others, and grow together through 
                the power of written words.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Image + Mission Section ─────────────────────────── */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
                  <img
                    src={aboutImg}
                    alt="Blog Illustration"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-4 -z-10 rounded-[2rem] border border-blue-500/10 dark:border-blue-500/5" />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                    Our Mission
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-zinc-400 leading-relaxed">
                    <p>
                      Welcome to Qspace! We created this platform for readers, writers, and 
                      thinkers to connect through stories, tutorials, and creative insights. 
                      Whether you're a passionate blogger or someone who loves reading, this 
                      space is built for you.
                    </p>
                    <p>
                      Our mission is to empower individuals to express themselves freely. 
                      We offer simple tools to write, publish, and engage with others in 
                      meaningful ways.
                    </p>
                    <p>
                      Thank you for being a part of our growing community. Together, we're 
                      building something special.
                    </p>
                  </div>
                </div>

                {/* Quick Features */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {features.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                      <Icon size={20} className="text-blue-500 mb-2" />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                      <p className="text-xs text-gray-400 mt-1">{desc}</p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/dashboard/write-blog"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
                >
                  Start Writing
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Stats Section ───────────────────────────────────── */}
        <section className="py-16 border-y border-gray-100 dark:border-zinc-800/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map(({ icon: Icon, value, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 ${color}`}>
                    <Icon size={22} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Values Section ──────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                What We Believe In
              </h2>
              <p className="mt-4 text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
                Our core values guide everything we do, from product decisions to community interactions.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {values.map(({ icon: Icon, title, description, color, bgColor, textColor }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-zinc-800/50 transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={textColor} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">{description}</p>
                  
                  {/* Hover gradient accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-full blur-3xl transition-opacity`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Quote Section ───────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-500/5 dark:to-violet-500/5" />
          
          <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl text-blue-200 dark:text-blue-500/20 font-serif mb-6">"</div>
              <blockquote className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Words are powerful.
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {' '}Use them to inspire.
                </span>
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">The Qspace Team</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Built with passion in South Africa</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA Section ─────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-violet-600 to-blue-700 p-12 text-center"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="0.5" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Start Writing?
                </h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of writers and readers on Qspace. Share your story today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/dashboard/write-blog">
                    <button className="h-12 px-8 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                      Start Writing
                    </button>
                  </Link>
                  <Link to="/blogs">
                    <button className="h-12 px-8 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/20">
                      Explore Articles
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
