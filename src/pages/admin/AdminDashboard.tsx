import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Quote, Image, FileText, Mail, Users, LogOut, Pen, Plus } from 'lucide-react';
import { getAllBlogPosts } from '../../services/blogService';
import { getAllGallery } from '../../services/galleryService';
import { getMessages } from '../../services/messageService';
import { getAllPoetry } from '../../services/poetryService';
import { getAllQuotes } from '../../services/quoteService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ poetry: 0, quotes: 0, gallery: 0, blog: 0, messages: 0 });

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
    const loadCounts = async () => {
      try {
        const [poetry, quotes, gallery, blog, messages] = await Promise.all([
          getAllPoetry(),
          getAllQuotes(),
          getAllGallery(),
          getAllBlogPosts(),
          getMessages(),
        ]);

        setCounts({
          poetry: poetry.length,
          quotes: quotes.length,
          gallery: gallery.length,
          blog: blog.length,
          messages: messages.length,
        });
      } catch (error) {
        console.error(error);
      }
    };

    void loadCounts();
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Poetry', value: counts.poetry, color: 'from-amber-500 to-yellow-500' },
    { icon: Quote, label: 'Quotes', value: counts.quotes, color: 'from-yellow-500 to-orange-500' },
    { icon: Image, label: 'Gallery', value: counts.gallery, color: 'from-orange-500 to-red-500' },
    { icon: FileText, label: 'Blog Posts', value: counts.blog, color: 'from-red-500 to-pink-500' },
    { icon: Mail, label: 'Messages', value: counts.messages, color: 'from-pink-500 to-purple-500' },
    { icon: Users, label: 'Subscribers', value: 1250, color: 'from-purple-500 to-indigo-500' },
  ];

  const menuItems = [
    { path: '/admin/poetry', label: 'Poetry', labelUrdu: 'شاعری', icon: BookOpen },
    { path: '/admin/quotes', label: 'Quotes', labelUrdu: 'اقتباسات', icon: Quote },
    { path: '/admin/gallery', label: 'Gallery', labelUrdu: 'گیلری', icon: Image },
    { path: '/admin/blog', label: 'Blog', labelUrdu: 'بلاگ', icon: FileText },
    { path: '/admin/messages', label: 'Messages', labelUrdu: 'پیغامات', icon: Mail },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30">
              <Pen className="h-7 w-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>انتظامی پنل</h1>
              <p className="text-sm text-amber-200/60">Admin Dashboard</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20">
            <LogOut className="h-5 w-5" />
            Logout
          </motion.button>
        </div>
      </div>

      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="rounded-2xl border border-amber-500/10 bg-slate-900/50 p-6 text-center backdrop-blur-xl transition-all hover:border-amber-500/30">
              <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-slate-950" />
              </div>
              <p className="mb-1 text-3xl font-bold text-amber-400">{stat.value}</p>
              <p className="text-sm text-amber-200/60">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>فوری کارروائی</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { path: '/admin/poetry', label: 'Add Poetry', labelUrdu: 'شاعری شامل', color: 'from-amber-500 to-yellow-500' },
            { path: '/admin/quotes', label: 'Add Quote', labelUrdu: 'اقتباس شامل', color: 'from-yellow-500 to-orange-500' },
            { path: '/admin/gallery', label: 'Upload Image', labelUrdu: 'تصویر اپلوڈ', color: 'from-orange-500 to-red-500' },
            { path: '/admin/blog', label: 'New Blog Post', labelUrdu: 'بلاگ پوسٹ', color: 'from-red-500 to-pink-500' },
          ].map((action, index) => (
            <motion.button key={index} type="button" whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(action.path)} className={`flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r ${action.color} p-6 font-semibold text-slate-950 shadow-lg`}>
              <Plus className="h-5 w-5" />
              <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{action.labelUrdu}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>مینو</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }}>
              <Link to={item.path} className="flex items-center gap-4 rounded-2xl border border-amber-500/10 bg-slate-900/50 p-6 backdrop-blur-xl transition-all hover:border-amber-500/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500">
                  <item.icon className="h-6 w-6 text-slate-950" />
                </div>
                <div>
                  <p className="font-semibold text-amber-400">{item.label}</p>
                  <p className="text-sm text-amber-200/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{item.labelUrdu}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
