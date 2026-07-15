import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Database,
  Eye,
  Cookie,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileKey,
  UserX,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'collection',
      icon: Database,
      title: 'Data We Collect',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      points: [
        'Personal information provided during registration (name, email, username)',
        'Profile information and avatar images you upload',
        'Blog content, comments, and interactions you create',
        'Application documents and files submitted through our platform',
        'Usage data and platform interaction patterns',
      ],
    },
    {
      id: 'usage',
      icon: Eye,
      title: 'How We Use Your Information',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      points: [
        'To provide and maintain our blogging and application services',
        'To send important updates, newsletters, and platform notifications',
        'To improve platform performance and user experience',
        'To moderate content and ensure community safety',
        'We never sell your personal data to third parties',
      ],
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookies & Analytics',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      points: [
        'Essential cookies for authentication and session management',
        'Analytics cookies (Google Analytics) to understand traffic patterns',
        'Preference cookies to remember your settings and choices',
        'You can control cookie preferences through your browser settings',
      ],
    },
    {
      id: 'security',
      icon: Lock,
      title: 'Data Security',
      color: 'text-violet-500',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
      points: [
        'Modern encryption standards for data in transit and at rest',
        'Strict access controls and role-based permissions',
        'Regular security audits and vulnerability assessments',
        'Secure file storage for uploaded documents and images',
        'Immediate breach notification procedures',
      ],
    },
    {
      id: 'rights',
      icon: UserX,
      title: 'Your Rights',
      color: 'text-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-500/10',
      points: [
        'Right to access and download your personal data',
        'Right to correct inaccurate or incomplete information',
        'Right to delete your account and associated data',
        'Right to object to certain data processing activities',
        'Right to data portability',
      ],
    },
    {
      id: 'retention',
      icon: Clock,
      title: 'Data Retention',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
      points: [
        'Account data retained while your account is active',
        'Deleted accounts are purged within 30 days',
        'Anonymized analytics data may be retained for platform improvement',
        'Legal obligations may require extended retention for specific data',
      ],
    },
  ];

  const lastUpdated = 'July 15, 2026';

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Qspace</title>
        <meta name="description" content="Understand how Qspace collects, uses, and protects your personal data." />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
                <Shield size={14} />
                Your Data Matters
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="mt-4 text-lg text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">
                We are committed to protecting your privacy. This policy explains how we collect, 
                use, and safeguard your personal information when you use Qspace.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Trust Badges ───────────────────────────────────── */}
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Lock, label: 'Encrypted', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { icon: FileKey, label: 'GDPR Ready', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                { icon: UserX, label: 'No Data Sales', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
                { icon: Clock, label: '30-Day Deletion', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={20} className={color} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">{label}</span>
                </div>
              ))}
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
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-zinc-800/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${section.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <section.icon size={22} className={section.color} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <ul className="space-y-3">
                        {section.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-zinc-400">
                            <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${section.color}`} />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 p-6 sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={22} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Questions About Your Privacy?
                    </h3>
                    <p className="text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">
                      If you have any concerns about how we handle your data, or would like to exercise 
                      your privacy rights, please don't hesitate to reach out.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="mailto:quorvexinstitute@gmail.com"
                        className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                      >
                        <Mail size={16} />
                        Contact Us
                      </a>
                      <Link to="/terms">
                        <Button
                          variant="outline"
                          className="h-11 px-6 rounded-full border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
                          Terms of Service
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Data Request Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-center py-6"
              >
                <div className="inline-flex items-center gap-2 text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border border-gray-100 dark:border-zinc-800">
                  <AlertCircle size={14} />
                  <span className="text-sm">
                    Want to download or delete your data?{' '}
                    <a
                      href="mailto:quorvexinstitute@gmail.com?subject=Data Request"
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Request here
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

export default PrivacyPolicy;
