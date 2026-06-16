import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Privacy Policy | Maxtronize',
  description: 'Privacy Policy for Maxtronize - Learn how we protect your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header with Maxtronize Logo */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-[96rem] z-50 flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 rounded-xl border bg-white/90 border-black/10 shadow-md backdrop-blur-xl md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-36 lg:w-48">
            <Image
              src="/images/new-main-logo.png"
              alt="Maxtronize"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#222222] hover:text-black transition-colors duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </header>

      {/* Content */}
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">1. Introduction</h2>
              <p>
                Welcome to Maxtronize. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you as to how we look after your personal data when you visit our website
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

