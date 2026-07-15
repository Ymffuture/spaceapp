import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  FileText,
  UserCheck,
  BookOpen,
  Settings,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
  const sections = [
    {
      id: 'accounts',
      icon: UserCheck,
      title: 'User Accounts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      content: `You are responsible for maintaining the confidentiality of your account. You agree to provide accurate, current, and complete information during registration and application. Any misuse of account credentials or provision of false information may result in immediate termination of access.`
    },
    {
      id: 'content',
      icon: BookOpen,
      title: 'Blog Content',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      content: `All blog content you publish must be your original work or properly attributed. We reserve the right to remove or moderate any content that violates our community standards, including but not limited to plagiarism, hate speech, harassment, or illegal material.`
    },
    {
      id: 'applications',
      icon: FileText,
      title: 'Applications',
      color: 'text-violet-500',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
      content: `When submitting applications (e.g. for tutoring or job roles), you consent to us storing and reviewing your provided documents and personal information securely. Misuse of the platform may lead to disqualification. We handle all data in accordance with our Privacy Policy.`
    },
    {
      id: 'modifications',
      icon: Settings,
      title: 'Modifications',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      content: `Qspace reserves the right to modify these terms at any time. Continued use of the platform means you accept any updated terms. We will notify users of significant changes via email or platform announcements.`
    },
  ];

  const lastUpdated = 'July 15, 2026';

  return (
    <>
      <Helmet>
        <title>Terms of Service | Qspace</title>
        <meta name="description" content="Review the terms and conditions for using Qspace Blog platform." />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
        
        {/* ─── Header ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <span className="text-xs text-gray-400 dark:text-zinc-500">
              Last updated: {lastUpdated}
            </span>
          </div>
        </header>

        {/* ─── Hero Section ───────────────────────────────────── */}
        <section className="pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <Shield size={14} />
                Legal
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="mt-4 text-lg text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
                Please read these terms carefully before using the Qspace platform. 
                By accessing our services, you agree to be bound by these conditions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Content Sections ───────────────────────────────── */}
        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-zinc-800/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${section.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <section.icon size={22} className={section.color} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {index + 1}. {section.title}
                      </h2>
                      <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Acceptance Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-500/5 dark:to-violet-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Acceptance of Terms
                    </h3>
                    <p className="text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">
                      By accessing or using Qspace, you acknowledge that you have read, understood, 
                      and agree to be bound by these Terms of Service. If you do not agree to these terms, 
                      please do not use our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/signup">
                        <Button className="h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                          Create Account
                          <ArrowLeft size={16} className="rotate-180" />
                        </Button>
                      </Link>
                      <Link to="/privacy">
                        <Button
                          variant="outline"
                          className="h-11 px-6 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
                          Privacy Policy
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                  <AlertCircle size={16} />
                  <span className="text-sm">
                    Have questions about these terms?{' '}
                    <a
                      href="mailto:quorvexinstitute@gmail.com"
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <Mail size={14} />
                      Contact us
                    </a>
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <footer className="border-t border-gray-100 dark:border-zinc-800 py-8">
          <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} Qspace. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-zinc-500">
              <Link to="/privacy" className="hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/about" className="hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                About
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Terms;
