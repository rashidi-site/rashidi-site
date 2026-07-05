import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, BookOpen, Quote, Users, ArrowRight, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { poems } from '../data/poetry';
import { quotes } from '../data/quotes';

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredPoems = poems.filter((p) => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-amber-950/30 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0, 0.3, 0],
                y: -100,
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute w-2 h-2 rounded-full bg-amber-400/30"
              style={{ left: `${5 + i * 5}%`, bottom: 0 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent to-amber-500" />
              <div className="w-3 h-3 rotate-45 border border-amber-500" />
              <div className="w-24 h-px bg-gradient-to-l from-transparent to-amber-500" />
            </div>

            {/* Arabic Bismillah */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-amber-400/80 text-2xl md:text-3xl mb-6"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </motion.p>

            {/* Main Title */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                عبدالواحد راشدی
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-amber-200/80 mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              اردو شاعری اور اسلامی اقتباسات کا حسین ذخیرہ
            </p>

            <p className="text-amber-100/60 text-lg max-w-xl mx-auto mb-12">
              Discover the beauty of Urdu poetry and Islamic wisdom. A collection of heartfelt verses 
              and inspiring quotes that touch the soul.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/poetry"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 font-bold text-lg shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-shadow flex items-center gap-2"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  شاعری پڑھیں
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/quotes"
                  className="px-8 py-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-lg hover:bg-amber-500/20 transition-colors flex items-center gap-2"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  اقتباسات دیکھیں
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-amber-400/60" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'شاعری', titleEn: 'Poetry', desc: 'روحانی شاعری کا حسین ذخیرہ', gradient: 'from-amber-500 to-yellow-500' },
              { icon: Quote, title: 'اقتباسات', titleEn: 'Quotes', desc: 'اسلامی اقتباسات اور احادیث', gradient: 'from-yellow-500 to-orange-500' },
              { icon: Users, title: 'برادری', titleEn: 'Community', desc: 'ہزاروں قارئین کا خاندان', gradient: 'from-orange-500 to-red-500' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="relative p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-amber-200/60 text-sm mb-2">{feature.titleEn}</p>
                  <p className="text-amber-100/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Slider */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-16 h-16 text-amber-500/30 mx-auto mb-8" />

          <div className="relative h-64 flex items-center justify-center">
            {quotes.map((quote, i) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentQuote === i ? 1 : 0,
                  x: currentQuote === i ? 0 : currentQuote > i ? -100 : 100,
                }}
                transition={{ duration: 0.5 }}
                className={`w-full ${currentQuote === i ? 'relative' : 'absolute'}`}
              >
                <p
                  className="text-3xl md:text-4xl text-amber-200 mb-6 leading-relaxed"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  {quote.urduText}
                </p>
                <p className="text-lg text-amber-100/60 italic mb-4">
                  "{quote.englishText}"
                </p>
                <p className="text-amber-500 font-semibold" style={{ fontFamily: 'Amiri, serif' }}>
                  {quote.source}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)}
              className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuote(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentQuote === i ? 'w-8 bg-amber-500' : 'w-2 bg-amber-500/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentQuote((prev) => (prev + 1) % quotes.length)}
              className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Poetry */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                منتخب شاعری
              </span>
            </h2>
            <p className="text-amber-200/60 text-lg">Featured Poetry Collection</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPoems.map((poem, i) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all h-full">
                  <div className="flex items-start justify-between mb-6">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {poem.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400/60">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{poem.likes}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {poem.title}
                  </h3>
                  <p className="text-xl text-amber-200/80 leading-loose mb-4 whitespace-pre-line" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {poem.urduText}
                  </p>
                  <p className="text-amber-100/50 italic text-sm leading-relaxed">
                    {poem.englishTranslation}
                  </p>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-amber-500/10">
                    <Link
                      to="/poetry"
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-2 text-sm"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/poetry"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              مزید شاعری دیکھیں
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                نیوزلیٹر میں شامل ہوں
              </span>
            </h2>
            <p className="text-xl text-amber-200/80 mb-8" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              نئی شاعری اور اسلامی اقتباسات اپنے انباکس میں حاصل کریں
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="اپنا ای میل درج کریں"
                className="w-full px-6 py-4 rounded-xl bg-slate-800/50 backdrop-blur border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 whitespace-nowrap"
              >
                Subscribe Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}