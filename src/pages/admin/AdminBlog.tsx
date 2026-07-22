import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Pen, LogOut, X } from 'lucide-react';
import { deleteBlogPost, getAllBlogPosts, type BlogPostItem } from '../../services/blogService';
import BlogForm from '../../components/blog/BlogForm';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function AdminBlog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to load blog posts.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/admin');
        return;
      }

      if (!isMounted) return;
      await loadPosts();
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, loadPosts]);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter(Boolean))).sort(),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.excerpt.toLowerCase().includes(normalizedQuery) ||
        post.author.toLowerCase().includes(normalizedQuery);

      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: BlogPostItem) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteBlogPost(id);
      setPosts((existingPosts) => existingPosts.filter((post) => post.id !== id));
      setFeedback({ type: 'success', message: 'Blog post deleted successfully.' });
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to delete blog post.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setEditingPost(null);
    setFeedback({ type: 'success', message: 'Blog post saved successfully.' });
    await loadPosts();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-amber-500/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30">
              <Pen className="h-7 w-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                بلاگ انتظام
              </h1>
              <p className="text-sm text-amber-200/60">Manage Blog Posts</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-amber-500/30"
            >
              <Plus className="h-5 w-5" />
              New Post
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 font-semibold text-red-400 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/20 bg-red-500/10 text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        </div>
      )}

      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full rounded-xl border border-amber-500/20 bg-slate-900/50 py-3 pl-12 pr-4 text-white placeholder-amber-200/40 outline-none backdrop-blur transition-colors focus:border-amber-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-amber-500/20 bg-slate-900/50 px-4 py-3 text-white outline-none backdrop-blur transition-colors focus:border-amber-500 md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl">
          <table className="w-full">
            <thead className="bg-amber-500/10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-amber-400">Title</th>
                <th className="px-6 py-4 text-left font-semibold text-amber-400">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-amber-400">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-amber-400">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-amber-400">Views</th>
                <th className="px-6 py-4 text-right font-semibold text-amber-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-amber-200/70">
                    Loading blog posts…
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-amber-200/70">
                    No posts found.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="transition-colors hover:bg-amber-500/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-amber-400/40 text-xs">
                            No img
                          </div>
                        )}
                        <div>
                          <span
                            className="text-amber-200"
                            style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                          >
                            {post.title}
                          </span>
                          {post.featured && (
                            <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-amber-200/60">{post.category}</td>
                    <td className="px-6 py-4">
                      {post.status === 'published' ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-400/60">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-amber-200/60">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4 text-amber-200/60">{post.views}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void handleDelete(post.id)}
                          className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between border-b border-amber-500/10 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-amber-400">
                  {editingPost ? 'Edit blog post' : 'Create new post'}
                </h2>
                <p className="text-sm text-slate-400">
                  {editingPost
                    ? 'Update the blog post and its metadata.'
                    : 'Create a new blog post for the website.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFormCancel}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
              <BlogForm
                key={editingPost?.id ?? 'new'}
                blog={editingPost}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
