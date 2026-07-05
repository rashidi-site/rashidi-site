import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/" className="text-amber-400 hover:text-amber-300 mb-8 inline-block">
            ← Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-amber-400 mb-8" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
            رازداری کی پالیسی
          </h1>
          <p className="text-amber-200/60 mb-4">Privacy Policy</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Introduction</h2>
              <p className="text-amber-100/70 leading-relaxed">
                At Abdul Wahed Rashidi's website, we are committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Information We Collect</h2>
              <p className="text-amber-100/70 leading-relaxed mb-4">
                We may collect information about you in a variety of ways:
              </p>
              <ul className="list-disc list-inside text-amber-100/70 space-y-2">
                <li>Personal Data: Name, email address, and contact information when you subscribe to our newsletter or contact us.</li>
                <li>Usage Data: Information about how you interact with our website, including pages visited and time spent.</li>
                <li>Device Data: Information about your device, browser type, and IP address.</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">How We Use Your Information</h2>
              <p className="text-amber-100/70 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-amber-100/70 space-y-2">
                <li>Send you newsletters and updates about new poetry and content</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and user experience</li>
                <li>Analyze usage patterns to enhance our content</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Contact Us</h2>
              <p className="text-amber-100/70 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at: info@abdulwahed.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}