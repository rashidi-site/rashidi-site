import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User, Search } from 'lucide-react';
import { getPublishedBlogPosts, getFeaturedBlogPosts, type BlogPostItem } from '../services/blogService';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const [allPosts, featured] = await Promise.all([
          getPublishedBlogPosts(),
          getFeaturedBlogPosts(),
        ]);

        if (isMounted) {
          setPosts(allPosts);
          setFeaturedPosts(featured);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load blog posts right now. Please try again shortly.');
          console.error(loadError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(posts.map((post) => post.category).filter(Boolean)),
    );
    return uniqueCategories.sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [post.title, post.excerpt, post.category, post.author]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        !selectedCategory || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredArticle = featuredPosts.length > 0 ? featuredPosts[0] : posts[0] ?? null;
  const remainingPosts = featuredArticle
    ? posts.filter((p) => p.id !== featuredArticle.id)
    : posts;

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1
              className="mb-4 text-5xl font-bold md:text-6xl"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                بلاگ
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Blog Articles</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <>
            <div className="mb-8 h-10 w-full animate-pulse rounded-xl bg-slate-800/80" />
            <div className="mb-12 h-[400px] animate-pulse rounded-2xl bg-slate-800/80" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-800/80" />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-4 md:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blog posts..."
                    className="w-full rounded-xl border border-amber-500/20 bg-slate-900/50 py-3 pl-12 pr-4 text-white placeholder-amber-200/40 outline-none transition-colors focus:border-amber-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="cursor-pointer appearance-none rounded-xl border border-amber-500/20 bg-slate-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-amber-500 md:w-56"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {featuredArticle ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <Link to={`/blog/${featuredArticle.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl">
                    {featuredArticle.cover_image ? (
                      <img
                        src={featuredArticle.cover_image}
                        alt={featuredArticle.title}
                        className="h-[400px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-[400px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-800/80">
                        <span className="text-amber-400/40">No cover image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span
                        className="mb-4 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-400"
                        style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                      >
                        {featuredArticle.category}
                      </span>
                      <h2
                        className="mb-4 text-3xl font-bold text-white transition-colors group-hover:text-amber-400 md:text-4xl"
                        style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                      >
                        {featuredArticle.title}
                      </h2>
                      <p
                        className="mb-4 max-w-2xl text-lg text-amber-200/80"
                        style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                      >
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-amber-200/60">
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {featuredArticle.author}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredArticle.created_at)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {estimateReadTime(featuredArticle.content)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ) : null}

            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-12 text-center text-amber-200/70">
                No blog posts matched your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(featuredArticle ? remainingPosts.filter((p) => filteredPosts.some((fp) => fp.id === p.id)) : filteredPosts).map(
                  (post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link to={`/blog/${post.slug}`} className="group block h-full">
                        <div className="relative h-full overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl transition-all hover:border-amber-500/30">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-48 w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-amber-500/10 to-slate-800/80">
                              <span className="text-amber-400/40">No cover image</span>
                            </div>
                          )}
                          <div className="p-6">
                            <span
                              className="mb-3 inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400"
                              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                            >
                              {post.category}
                            </span>
                            <h3
                              className="mb-3 text-xl font-bold text-amber-400 transition-colors group-hover:text-amber-300"
                              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                            >
                              {post.title}
                            </h3>
                            <p
                              className="mb-4 line-clamp-2 text-sm text-amber-200/60"
                              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                            >
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between border-t border-amber-500/10 pt-4">
                              <span className="flex items-center gap-2 text-sm text-amber-100/40">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.created_at)}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-amber-400 transition-all group-hover:gap-2">
                                Read <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
