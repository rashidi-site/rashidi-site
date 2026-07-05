import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Terms() {
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
            شرائط و ضوابط
          </h1>
          <p className="text-amber-200/60 mb-4">Terms & Conditions</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Acceptance of Terms</h2>
              <p className="text-amber-100/70 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provisions 
                of this agreement. If you do not agree to these terms, please do not use this website.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Intellectual Property</h2>
              <p className="text-amber-100/70 leading-relaxed">
                All content on this website, including poetry, quotes, images, and other materials, is the intellectual 
                property of Abdul Wahed Rashidi. You may not reproduce, distribute, or create derivative works without 
                explicit written permission.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">User Conduct</h2>
              <p className="text-amber-100/70 leading-relaxed mb-4">
                You agree to use this website only for lawful purposes. You are prohibited from:
              </p>
              <ul className="list-disc list-inside text-amber-100/70 space-y-2">
                <li>Posting or transmitting any harmful or offensive content</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Using the website in a manner that violates any applicable laws</li>
                <li>Impersonating any person or entity</li>
              </ul>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Disclaimer</h2>
              <p className="text-amber-100/70 leading-relaxed">
                The content on this website is provided "as is" without any warranties, expressed or implied. 
                We do not guarantee that the website will be available at all times or that the content is error-free.
              </p>
            </section>

            <section className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Contact</h2>
              <p className="text-amber-100/70 leading-relaxed">
                For questions about these Terms & Conditions, please contact us at: info@abdulwahed.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}