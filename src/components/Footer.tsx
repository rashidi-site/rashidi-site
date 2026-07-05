import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-amber-500/20">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Pen className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h3
                  className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  عبدالواحد راشدی
                </h3>
                <p className="text-xs text-amber-200/60">URDU POETRY</p>
              </div>
            </Link>
            <p className="text-amber-100/60 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              اردو شاعری اور اسلامی اقتباسات کا ایک منفرد ذخیرہ۔ یہاں آپ کو روحانی سکون اور ادبی لطف ملے گا۔
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              فوری لنکس
            </h4>
            <ul className="space-y-3">
              {[
                { path: '/poetry', label: 'شاعری' },
                { path: '/quotes', label: 'اقتباسات' },
                { path: '/gallery', label: 'گیلری' },
                { path: '/blog', label: 'بلاگ' },
                { path: '/about', label: 'مصنف' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-amber-100/60 hover:text-amber-400 transition-colors text-sm"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              قانونی
            </h4>
            <ul className="space-y-3">
              {[
                { path: '/privacy', label: 'رازداری کی پالیسی' },
                { path: '/terms', label: 'شرائط و ضوابط' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-amber-100/60 hover:text-amber-400 transition-colors text-sm"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              رابطہ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-amber-100/60 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  کراچی، پاکستان
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="mailto:info@abdulwahed.com" className="text-amber-100/60 hover:text-amber-400 transition-colors text-sm">
                  info@abdulwahed.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <a href="tel:+923001234567" className="text-amber-100/60 hover:text-amber-400 transition-colors text-sm">
                  +92 300 123 4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold text-amber-400 mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                نیوزلیٹر میں شامل ہوں
              </h4>
              <p className="text-amber-100/60 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                نئی شاعری اور اقتباسات اپنے انباکس میں حاصل کریں
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="اپنا ای میل درج کریں"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold text-sm whitespace-nowrap shadow-lg shadow-amber-500/30"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-amber-100/40 text-sm flex items-center gap-2">
            <span>© 2024 Abdul Wahed Rashidi. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for Urdu Poetry</span>
          </p>
          <p className="text-amber-100/40 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
            تمام حقوق محفوظ ہیں
          </p>
        </div>
      </div>
    </footer>
  );
}