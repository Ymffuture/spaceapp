import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-0 text-gray-800 dark:text-gray-200">
      <Helmet>
        <title>Privacy Policy | Qspace Blog</title>
        <meta name="description" content="Understand how we handle your data on Qspace Blog." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. This policy explains how Qspace Blog collects, uses, and protects your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data We Collect</h2>
      <p className="mb-4">
        We collect personal information you provide when registering, commenting, or applying — such as name, email,
        documents, and blog contributions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to provide services, send updates, and improve platform performance. We do not sell your
        data to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Cookies & Analytics</h2>
      <p className="mb-4">
        Qspace may use cookies and analytics tools (like Google Analytics) to enhance user experience and understand
        traffic behavior.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="mb-4">
        Your data is stored securely using modern encryption and access control. Sensitive files (e.g. uploads) are kept
        private.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contact</h2>
      <p className="mb-4">
        For any privacy concerns or data requests, email us at <a href="mailto:quorvexinstitute@gmail.com" className="text-blue-500 underline">quorvexinstitute@gmail.com</a>.
      </p>
    </section>
  );
};

export default PrivacyPolicy;

