import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <section className="min-h-screen bg-[#F0F8FF] dark:bg-gray-950 px-4 py-12 text-gray-800 dark:text-gray-200 flex flex-col items-center">
      <Helmet>
        <title>Privacy Policy | Qspace Blog</title>
        <meta name="description" content="Understand how we handle your data on Qspace Blog." />
      </Helmet>

      {/* Top Navigation */}
      <div className="w-full max-w-5xl flex justify-end mb-6">
        <Link to="/">
          <Button className="bg-[#1E90FF] hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-lg">
            Home
          </Button>
        </Link>
      </div>

      {/* Policy Content */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 p-6 md:p-10 rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

        <p className="mb-4">
          Your privacy is important to us. This policy explains how Qspace Blog collects, uses, and protects your data.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. Data We Collect</h2>
        <p className="mb-4">
          We collect personal information you provide when registering, commenting, or applying — such as name, email,
          documents, and blog contributions.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your information to provide services, send updates, and improve platform performance. We do not sell your
          data to third parties.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Cookies & Analytics</h2>
        <p className="mb-4">
          Qspace may use cookies and analytics tools (like Google Analytics) to enhance user experience and understand
          traffic behavior.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p className="mb-4">
          Your data is stored securely using modern encryption and access control. Sensitive files (e.g. uploads) are kept
          private.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Contact</h2>
        <p className="mb-4">
          For any privacy concerns or data requests, email us at{" "}
          <a href="mailto:quorvexinstitute@gmail.com" className="text-[#1E90FF] underline">
            quorvexinstitute@gmail.com
          </a>.
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;

