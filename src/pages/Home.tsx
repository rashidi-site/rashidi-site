import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, BookOpen, Quote, Users, ArrowRight, ChevronLeft, ChevronRight, Share2, ImageIcon, FileText, MessageSquareText } from 'lucide-react';
import { getPublishedPoetry } from '../services/poetryService';
import { getPublishedQuotes } from '../services/quoteService';
import { getPublishedGallery } from '../services/galleryService';
import { getPublishedBlogPosts } from '../services/blogService';
import type { Poetry } from '../types/poetry';
import type { Quote } from '../types/quotes';
import type { GalleryItem } from '../types/gallery';
import type { BlogPostItem } from '../services/blogService';

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [poetry, setPoetry] = useState<Poetry[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const [poetryData, quoteData, galleryData, blogData] = await Promise.all([
          getPublishedPoetry(),
          getPublishedQuotes(),
          getPublishedGallery(),
          getPublishedBlogPosts(),
        ]);

        if (isMounted) {
          setPoetry(poetryData);
          setQuotes(quoteData);
          setGallery(galleryData);
          setBlogs(blogData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load the latest content right now. Please try again shortly.');
          console.error(loadError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (quotes.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [quotes.length]);

  const featuredPoems = useMemo(() => poetry.filter((item) => item.featured).slice(0, 2), [poetry]);
  const featuredQuotes = useMemo(() => quotes.filter((item) => item.featured).slice(0, 5), [quotes]);
  const featuredGallery = useMemo(() => gallery.filter((item) => item.featured).slice(0, 4), [gallery]);
  const latestBlogs = useMemo(() => blogs.slice(0, 3), [blogs]);
  const counters = useMemo(
    () => [
      { label: 'Poetry', value: poetry.length, icon: BookOpen },
      { label: 'Quotes', value: quotes.length, icon: Quote },
      { label: 'Gallery', value: gallery.length, icon: ImageIcon },
      { label: 'Blog Posts', value: blogs.length, icon: FileText },
    ],
    [blogs.length, gallery.length, poetry.length, quotes.length],
  );

  const quoteSlides = featuredQuotes.length > 0 ? featuredQuotes : quotes.slice(0, 5);

  return (
    <div className="min-h-screen">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-amber-950/30 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1),transparent_70%)]" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0, 0.3, 0],
                y: -100,
              }}
              transition={{
                duration: 10 + (i % 5) * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute h-2 w-2 rounded-full bg-amber-400/30"
              style={{ left: `${5 + i * 5}%`, bottom: 0 }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-500" />
              <div className="h-3 w-3 rotate-45 border border-amber-500" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-500" />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-2xl text-amber-400/80 md:text-3xl"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </motion.p>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl lg:text-8xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                عبدالواحد راشدی
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl text-amber-200/80 md:text-2xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              اردو شاعری اور اسلامی اقتباسات کا حسین ذخیرہ
            </p>

            <p className="mx-auto mb-12 max-w-xl text-lg text-amber-100/60">
              Discover the beauty of Urdu poetry and Islamic wisdom. A collection of heartfelt verses and inspiring quotes that touch the soul.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/poetry" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-2xl shadow-amber-500/40 transition-shadow hover:shadow-amber-500/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  شاعری پڑھیں
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/quotes" className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-8 py-4 text-lg font-semibold text-amber-400 transition-colors hover:bg-amber-500/20" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  اقتباسات دیکھیں
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <ChevronDown className="h-8 w-8 text-amber-400/60" />
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: BookOpen, title: 'شاعری', titleEn: 'Poetry', desc: 'روحانی شاعری کا حسین ذخیرہ', gradient: 'from-amber-500 to-yellow-500' },
              { icon: Quote, title: 'اقتباسات', titleEn: 'Quotes', desc: 'اسلامی اقتباسات اور احادیث', gradient: 'from-yellow-500 to-orange-500' },
              { icon: Users, title: 'برادری', titleEn: 'Community', desc: 'ہزاروں قارئین کا خاندان', gradient: 'from-orange-500 to-red-500' },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="group relative">
                <div className="relative rounded-2xl border border-amber-500/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:border-amber-500/30">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-slate-950" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {feature.title}
                  </h3>
                  <p className="mb-2 text-sm text-amber-200/60">{feature.titleEn}</p>
                  <p className="text-amber-100/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {counters.map((counter, index) => (
              <div key={counter.label} className="rounded-2xl border border-amber-500/10 bg-slate-900/50 p-4 text-center backdrop-blur-xl" style={{ animationDelay: `${index * 80}ms` }}>
                <counter.icon className="mx-auto mb-3 h-6 w-6 text-amber-400" />
                <p className="text-2xl font-bold text-amber-400">{counter.value}</p>
                <p className="text-sm text-amber-200/60">{counter.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Quote className="mx-auto mb-8 h-16 w-16 text-amber-500/30" />

          <div className="relative flex h-64 items-center justify-center">
            {quoteSlides.map((quote, i) => (
              <motion.div key={quote.id} initial={{ opacity: 0, x: 100 }} animate={{ opacity: currentQuote === i ? 1 : 0, x: currentQuote === i ? 0 : currentQuote > i ? -100 : 100 }} transition={{ duration: 0.5 }} className={`w-full ${currentQuote === i ? 'relative' : 'absolute'}`}>
                <p className="mb-6 text-3xl leading-relaxed text-amber-200 md:text-4xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {quote.quote}
                </p>
                <p className="mb-4 text-lg italic text-amber-100/60">“{quote.author}”</p>
                <p className="font-semibold text-amber-500" style={{ fontFamily: 'Amiri, serif' }}>
                  {quote.source ?? 'Islamic Wisdom'}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => setCurrentQuote((prev) => (prev - 1 + quoteSlides.length) % quoteSlides.length)} className="rounded-full border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {quoteSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentQuote(i)} className={`h-2 rounded-full transition-all ${currentQuote === i ? 'w-8 bg-amber-500' : 'w-2 bg-amber-500/30'}`} />
              ))}
            </div>
            <button onClick={() => setCurrentQuote((prev) => (prev + 1) % quoteSlides.length)} className="rounded-full border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">منتخب شاعری</span>
            </h2>
            <p className="text-lg text-amber-200/60">Featured Poetry Collection</p>
          </motion.div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-2xl border border-amber-500/10 bg-slate-900/50" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200">{error}</div>
          ) : featuredPoems.length === 0 ? (
            <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200">No featured poetry is available right now.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featuredPoems.map((poem, i) => (
                <motion.div key={poem.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                  <div className="relative h-full rounded-2xl border border-amber-500/10 bg-slate-900/50 p-8 backdrop-blur-xl transition-all hover:border-amber-500/30">
                    <div className="mb-6 flex items-start justify-between">
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                        {poem.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400/60">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{poem.likes}</span>
                      </div>
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {poem.title}
                    </h3>
                    <p className="mb-4 whitespace-pre-line text-xl leading-loose text-amber-200/80" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {poem.content}
                    </p>
                    {poem.english_translation ? <p className="text-sm leading-relaxed text-amber-100/50">{poem.english_translation}</p> : null}
                    <div className="mt-6 flex items-center justify-between border-t border-amber-500/10 pt-6">
                      <Link to="/poetry" className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
            <Link to="/poetry" className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-8 py-4 font-semibold text-amber-400 transition-colors hover:bg-amber-500/20" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              مزید شاعری دیکھیں
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-amber-500/10 bg-slate-900/50 p-8 backdrop-blur-xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400"><ImageIcon className="h-5 w-5" /></div>
                <h3 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>Featured Gallery</h3>
              </div>
              {featuredGallery.length === 0 ? (
                <p className="text-amber-200/60">No gallery images are available right now.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {featuredGallery.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-2xl border border-amber-500/10">
                      <img src={image.src} alt={image.title} className="h-36 w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-amber-500/10 bg-slate-900/50 p-8 backdrop-blur-xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400"><MessageSquareText className="h-5 w-5" /></div>
                <h3 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>Latest Blogs</h3>
              </div>
              {latestBlogs.length === 0 ? (
                <p className="text-amber-200/60">No blog posts are available at the moment.</p>
              ) : (
                <div className="space-y-4">
                  {latestBlogs.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="flex items-start gap-4 rounded-2xl border border-amber-500/10 bg-slate-950/40 p-4 transition-colors hover:border-amber-500/30">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-amber-400">{post.category}</p>
                        <h4 className="mt-1 font-semibold text-amber-200" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{post.title}</h4>
                        <p className="mt-2 text-sm text-amber-100/60">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">نیوزلیٹر میں شامل ہوں</span>
            </h2>
            <p className="mb-8 text-xl text-amber-200/80" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              نئی شاعری اور اسلامی اقتباسات اپنے انباکس میں حاصل کریں
            </p>
            <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
              <input type="email" placeholder="اپنا ای میل درج کریں" className="w-full rounded-xl border border-amber-500/20 bg-slate-800/50 px-6 py-4 text-white placeholder-amber-200/40 transition-colors focus:border-amber-500 focus:outline-none" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }} />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full whitespace-nowrap rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-amber-500/30 sm:w-auto">
                Subscribe Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
