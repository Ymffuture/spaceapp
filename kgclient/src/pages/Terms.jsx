
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <section className="min-h-screen bg-[#F0F8FF] dark:bg-gray-950 px-4 py-12 text-gray-800 dark:text-gray-200 flex flex-col items-center">
      <Helmet>
        <title>Terms of Service | Qspace Blog</title>
        <meta name="description" content="Review the terms and conditions for using Qspace Blog." />
      </Helmet>

      {/* Top Navigation */}
      <div className="w-full max-w-5xl flex justify-end mb-6">
        <Link to="/">
          <Button className="bg-[#1E90FF] hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-lg">
            Home
          </Button>
        </Link>
      </div>

      {/* Terms Content */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 p-6 md:p-10 rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>

        <p className="mb-4">
          Welcome to Qspace Blog! By using our website and services, you agree to the following terms:
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. User Accounts</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account. You agree to provide accurate, current,
          and complete information during registration and application.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Blog Content</h2>
        <p className="mb-4">
          All blog content you publish must be your original work or properly attributed. We reserve the right to remove
          or moderate any content that violates our community standards.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Applications</h2>
        <p className="mb-4">
          When submitting applications (e.g. for tutoring or job roles), you consent to us storing and reviewing your
          provided documents and personal information securely. Misuse of the platform may lead to disqualification.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Modifications</h2>
        <p className="mb-4">
          Qspace reserves the right to modify these terms at any time. Continued use of the platform means you accept any
          updated terms.
        </p>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          If you have questions, contact us at{" "}
          <a href="mailto:quorvexinstitute@gmail.com" className="text-[#1E90FF] underline">
            quorvexinstitute@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default Terms;
