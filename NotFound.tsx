import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent opacity-20">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  صفحہ نہیں ملا
                </h2>
                <p className="text-amber-200/60 text-lg mb-8">
                  Oops! The page you're looking for doesn't exist.
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold flex items-center gap-2 hover:bg-amber-500/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
                y: [0, -100],
                x: Math.random() * 100 - 50,
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute w-2 h-2 rounded-full bg-amber-400/30"
              style={{ left: `${Math.random() * 100}%`, bottom: 0 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}