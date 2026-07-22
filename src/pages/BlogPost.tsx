import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Heart, Share2, MessageCircle } from 'lucide-react';
import { getBlogPostBySlug, getPublishedBlogPosts, updateBlogPostViews, type BlogPostItem } from '../services/blogService';

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [comments, setComments] = useState<{ id: number; name: string; text: string; date: string }[]>([]);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    const loadPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const blogPost = await getBlogPostBySlug(slug);

        if (!isMounted) return;

        if (!blogPost) {
          setError('The requested blog post could not be found.');
          setLoading(false);
          return;
        }

        setPost(blogPost);

        try {
          const nextViews = blogPost.views + 1;
          await updateBlogPostViews(blogPost.id, nextViews);
          setPost((prev) => (prev ? { ...prev, views: nextViews } : prev));
        } catch (viewError) {
          console.error('Failed to update view count:', viewError);
        }

        try {
          const allPosts = await getPublishedBlogPosts();
          if (isMounted) {
            const related = allPosts
              .filter((p) => p.id !== blogPost.id && p.category === blogPost.category)
              .slice(0, 3);
            setRelatedPosts(related);
          }
        } catch (relatedError) {
          console.error('Failed to load related posts:', relatedError);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load this blog post. Please try again shortly.');
          console.error(loadError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && name.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          name,
          text: comment,
          date: new Date().toISOString().split('T')[0],
        },
      ]);
      setComment('');
      setName('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 h-8 w-32 animate-pulse rounded bg-slate-800/80" />
          <div className="mb-8 h-[50vh] animate-pulse rounded-2xl bg-slate-800/80" />
          <div className="space-y-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-800/70" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200">
            {error ?? 'Blog post not found.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="relative h-[50vh] overflow-hidden">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 to-slate-800/80">
            <span className="text-amber-400/40">No cover image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-4xl">
            <Link
              to="/blog"
              className="mb-4 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <span
              className="mb-4 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-400"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              {post.category}
            </span>
            <h1
              className="mb-6 text-3xl font-bold text-white md:text-5xl"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-amber-200/60">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {estimateReadTime(post.content)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <div className="prose prose-lg prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="mb-6 text-lg leading-relaxed text-amber-100/80"
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-b border-t border-amber-500/10 py-8">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-amber-400 transition-colors hover:bg-amber-500/20">
                <Heart className="h-5 w-5" />
                Like
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2 text-amber-400 transition-colors hover:bg-amber-500/20">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>
            <span className="flex items-center gap-2 text-sm text-amber-200/60">
              <MessageCircle className="h-4 w-4" />
              {comments.length} Comments
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-12"
        >
          <h2
            className="mb-8 text-2xl font-bold text-amber-400"
            style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
          >
            تبصرے ({comments.length})
          </h2>

          <form
            onSubmit={handleSubmitComment}
            className="mb-8 rounded-2xl border border-amber-500/10 bg-slate-900/50 p-6 backdrop-blur-xl"
          >
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="آپ کا نام"
                className="rounded-xl border border-amber-500/20 bg-slate-800/50 px-4 py-3 text-white placeholder-amber-200/40 outline-none transition-colors focus:border-amber-500"
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اپنا تبصرہ لکھیں..."
              rows={4}
              className="w-full resize-none rounded-xl border border-amber-500/20 bg-slate-800/50 px-4 py-3 text-white placeholder-amber-200/40 outline-none transition-colors focus:border-amber-500"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-semibold text-slate-950"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              تبصرہ بھیجیں
            </motion.button>
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-amber-500/10 bg-slate-900/50 p-6 backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="font-semibold text-amber-400"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {c.name}
                  </span>
                  <span className="text-sm text-amber-200/40">{c.date}</span>
                </div>
                <p
                  className="text-amber-100/70"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="py-12"
          >
            <h2
              className="mb-8 text-2xl font-bold text-amber-400"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              متعلقہ مضامین
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group">
                  <div className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl transition-all hover:border-amber-500/30">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-amber-500/10 to-slate-800/80">
                        <span className="text-amber-400/40">No cover image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3
                        className="line-clamp-2 font-semibold text-amber-400 transition-colors group-hover:text-amber-300"
                        style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                      >
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
