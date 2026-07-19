import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, Eye, Filter, Heart, ImageOff, Search, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPoetryBySlug, getPublishedPoetry, updatePoetry } from '../services/poetryService';
import type { Poetry } from '../types/poetry';

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function LoadingCard() {
  return (
    <div className="rounded-3xl border border-amber-500/10 bg-slate-900/50 p-5 backdrop-blur-xl">
      <div className="h-36 animate-pulse rounded-2xl bg-slate-800/80" />
      <div className="mt-4 h-4 w-24 animate-pulse rounded bg-slate-800/80" />
      <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-800/80" />
      <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-800/70" />
      <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-slate-800/80" />
    </div>
  );
}

export default function Poetry() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const [poems, setPoems] = useState<Poetry[]>([]);
  const [selectedPoem, setSelectedPoem] = useState<Poetry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [activeDetailSlug, setActiveDetailSlug] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPoems = async () => {
      setLoading(true);
      setError(null);

      try {
        const publishedPoems = await getPublishedPoetry();

        if (isMounted) {
          setPoems(publishedPoems);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load poetry right now. Please try again shortly.');
          console.error(loadError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPoems();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadSelectedPoem = async () => {
      setDetailLoading(true);
      setError(null);

      try {
        const poem = await getPoetryBySlug(slug);

        if (isMounted) {
          setSelectedPoem(poem);
          if (!poem) {
            setError('The requested poetry entry could not be found.');
          }
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load this poetry entry. Please try again shortly.');
          console.error(loadError);
        }
      } finally {
        if (isMounted) {
          setDetailLoading(false);
        }
      }
    };

    void loadSelectedPoem();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        poems
          .map((poem) => poem.category)
          .filter((category): category is string => Boolean(category)),
      ),
    ).sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory));
  }, [poems]);

  const filteredPoems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return poems.filter((poem) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [poem.title, poem.author, poem.category, poem.content]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory =
        selectedCategory.length === 0 || poem.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [poems, searchQuery, selectedCategory]);

  useEffect(() => {
    if (!slug || !selectedPoem || slug === activeDetailSlug) {
      return;
    }

    const incrementViews = async () => {
      try {
        const nextViews = selectedPoem.views + 1;
        await updatePoetry(selectedPoem.id, { views: nextViews });
        setPoems((currentPoems) =>
          currentPoems.map((poem) => (poem.id === selectedPoem.id ? { ...poem, views: nextViews } : poem)),
        );
        setSelectedPoem((currentPoem) => (currentPoem ? { ...currentPoem, views: nextViews } : currentPoem));
      } catch (viewError) {
        console.error(viewError);
      } finally {
        setActiveDetailSlug(slug);
      }
    };

    void incrementViews();
  }, [activeDetailSlug, selectedPoem, slug]);

  const handleReadMore = (poem: Poetry) => {
    navigate(`/poetry/${poem.slug}`);
  };

  const handleLike = async (poem: Poetry) => {
    if (likingId === poem.id) {
      return;
    }

    setLikingId(poem.id);

    try {
      const nextLikes = poem.likes + 1;
      await updatePoetry(poem.id, { likes: nextLikes });
      setPoems((currentPoems) =>
        currentPoems.map((currentPoem) => (currentPoem.id === poem.id ? { ...currentPoem, likes: nextLikes } : currentPoem)),
      );
      setSelectedPoem((currentPoem) => (currentPoem && currentPoem.id === poem.id ? { ...currentPoem, likes: nextLikes } : currentPoem));
    } catch (likeError) {
      console.error(likeError);
    } finally {
      setLikingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  if (slug) {
    return (
      <div className="min-h-screen bg-slate-950/95 pb-16 pt-24 text-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/poetry')}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-slate-900/60 px-4 py-2 text-sm font-medium text-amber-200 transition-colors hover:border-amber-500/40 hover:bg-slate-800/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to poetry
          </button>

          {detailLoading && (
            <div className="rounded-3xl border border-amber-500/10 bg-slate-900/60 p-8 backdrop-blur-xl">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-800/80" />
              <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-slate-800/80" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-800/70" />
              <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-slate-800/70" />
            </div>
          )}

          {!detailLoading && error && (
            <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-8 text-center backdrop-blur-xl">
              <p className="text-lg text-amber-200">{error}</p>
            </div>
          )}

          {!detailLoading && selectedPoem && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] border border-amber-500/10 bg-slate-900/60 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="border-b border-amber-500/10 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">
                    {selectedPoem.category}
                  </span>
                  {selectedPoem.featured && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-sm font-medium text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      Featured
                    </span>
                  )}
                </div>

                <h1
                  className="mt-6 text-3xl font-bold text-amber-400 sm:text-4xl"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  {selectedPoem.title}
                </h1>
                <p className="mt-3 text-lg text-amber-200/70">By {selectedPoem.author}</p>
              </div>

              <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  {selectedPoem.cover_image ? (
                    <img
                      src={selectedPoem.cover_image}
                      alt={selectedPoem.title}
                      className="h-72 w-full rounded-3xl border border-amber-500/10 object-cover shadow-lg shadow-black/20"
                    />
                  ) : (
                    <div className="flex h-72 w-full items-center justify-center rounded-3xl border border-dashed border-amber-500/20 bg-slate-800/50 text-amber-400/60">
                      <ImageOff className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-amber-500/10 bg-slate-950/50 p-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-amber-200/70">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(selectedPoem.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        {selectedPoem.likes} likes
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {selectedPoem.views} views
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-amber-500/10 bg-amber-500/5 p-6">
                    <p
                      className="whitespace-pre-line text-xl leading-9 text-amber-100"
                      style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                    >
                      {selectedPoem.content}
                    </p>
                  </div>

                  {selectedPoem.english_translation && (
                    <div className="rounded-3xl border border-amber-500/10 bg-slate-950/50 p-6">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                        English Translation
                      </h2>
                      <p className="mt-3 leading-8 text-amber-100/80">
                        {selectedPoem.english_translation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950/95 pb-16 pt-24 text-slate-100">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1
              className="mb-4 text-5xl font-bold md:text-6xl"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                شاعری کا مجموعہ
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Poetry Collection</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
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
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search poetry..."
              className="w-full rounded-2xl border border-amber-500/20 bg-slate-900/50 py-4 pl-12 pr-4 text-white placeholder-amber-200/40 transition-colors outline-none focus:border-amber-500"
            />
          </div>

          <div className="relative md:w-72">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/60" />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-amber-500/20 bg-slate-900/50 py-4 pl-12 pr-10 text-white transition-colors outline-none focus:border-amber-500"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedCategory) && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-amber-500/20 bg-slate-900/50 px-4 py-4 text-sm font-medium text-amber-200 transition-colors hover:border-amber-500/40 hover:bg-slate-800/80"
            >
              Clear
            </button>
          )}
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center backdrop-blur-xl">
            <p className="text-lg text-amber-200">{error}</p>
          </div>
        ) : filteredPoems.length === 0 ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-amber-400">No poetry found</h2>
            <p className="mt-3 text-amber-200/70">
              Try a different search term or reset the filters to explore the collection.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPoems.map((poem, index) => (
              <motion.article
                key={poem.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group overflow-hidden rounded-[1.75rem] border border-amber-500/10 bg-slate-900/60 backdrop-blur-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  {poem.cover_image ? (
                    <img
                      src={poem.cover_image}
                      alt={poem.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 to-slate-800/80 text-amber-400/60">
                      <ImageOff className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-amber-500/20 bg-slate-950/70 px-3 py-1 text-xs font-medium text-amber-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {poem.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    {poem.featured ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-sm text-amber-200/50">Standard</span>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void handleLike(poem);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-500/10 bg-slate-950/50 px-2.5 py-1 text-amber-400/70 transition-colors hover:border-amber-500/30 hover:text-amber-300"
                      aria-label={`Like ${poem.title}`}
                      disabled={likingId === poem.id}
                    >
                      <Heart className={`h-4 w-4 ${likingId === poem.id ? 'animate-pulse' : ''}`} />
                      <span className="text-sm">{poem.likes}</span>
                    </button>
                  </div>

                  <h3
                    className="mt-5 text-xl font-semibold text-amber-400"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {poem.title}
                  </h3>
                  <p className="mt-2 text-sm text-amber-200/70">By {poem.author}</p>

                  <p
                    className="mt-4 line-clamp-4 text-sm leading-7 text-amber-100/80"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {poem.content}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-amber-500/10 pt-4 text-sm text-amber-200/60">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(poem.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-amber-400/80">
                      <Eye className="h-4 w-4" />
                      {poem.views}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReadMore(poem)}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition-colors hover:border-amber-500/40 hover:bg-amber-500/20"
                  >
                    Read More
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
