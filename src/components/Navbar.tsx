import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Pen } from 'lucide-react';
import { useTheme } from '../context/useTheme';

const navLinks = [
  { path: '/', label: 'ہوم', labelEn: 'Home' },
  { path: '/poetry', label: 'شاعری', labelEn: 'Poetry' },
  { path: '/quotes', label: 'اقتباسات', labelEn: 'Quotes' },
  { path: '/about', label: 'مصنف', labelEn: 'About' },
  { path: '/gallery', label: 'گیلری', labelEn: 'Gallery' },
  { path: '/blog', label: 'بلاگ', labelEn: 'Blog' },
  { path: '/contact', label: 'رابطہ', labelEn: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-amber-500/10 border-b border-amber-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Pen className="w-6 h-6 text-slate-950" />
              </motion.div>
              <div className="hidden sm:block">
                <h1
                  className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  عبدالواحد راشدی
                </h1>
                <p className="text-xs text-amber-200/60 tracking-wider">URDU POETRY & ISLAMIC QUOTES</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-amber-400'
                      : 'text-amber-100/80 hover:text-amber-400'
                  }`}
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold text-sm hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/30"
              >
                <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>سبسکرائب</span>
              </motion.button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute top-20 right-0 bottom-0 w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-amber-500/20 p-6"
            >
              <div className="space-y-2 mt-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-lg transition-all ${
                        location.pathname === link.path
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'text-amber-100/80 hover:bg-amber-500/10 hover:text-amber-400'
                      }`}
                      style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20"
              >
                <p className="text-amber-200/80 text-sm mb-3" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  نیوزلیٹر حاصل کریں
                </p>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 text-sm focus:outline-none focus:border-amber-500"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold text-sm"
                >
                  Subscribe
                </motion.button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
