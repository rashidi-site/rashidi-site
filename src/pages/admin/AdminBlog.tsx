import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Pen, LogOut } from 'lucide-react';
import { deleteBlogPost, getAllBlogPosts } from '../../services/blogService';
import type { BlogPostItem } from '../../services/blogService';

export default function AdminBlog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/admin');
      }
    };

    void checkSession();
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const data = await getAllBlogPosts();
        if (isMounted) {
          setPosts(data);
        }
      } catch (error) {
        console.error(error);
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

  const filteredPosts = posts.filter((post) => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPost(id);
      setPosts((existingPosts) => existingPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Pen className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                بلاگ انتظام
              </h1>
              <p className="text-amber-200/60 text-sm">Manage Blog Posts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/30"
            >
              <Plus className="w-5 h-5" />
              New Post
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-500/10">
              <tr>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Comments</th>
                <th className="px-6 py-4 text-right text-amber-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-amber-200/70">Loading blog posts…</td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-amber-200/70">No posts found.</td>
                </tr>
              ) : filteredPosts.map((post, index) => (
                <motion.tr key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="transition-colors hover:bg-amber-500/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.cover_image ?? ''} alt={post.title} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="text-amber-200" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-amber-200/60">{post.category}</td>
                  <td className="px-6 py-4 text-amber-200/60">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-amber-200/60">0</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20"><Eye className="h-4 w-4" /></button>
                      <button className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => void handleDelete(post.id)} className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}