import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Quote, Image, FileText, Mail, Users, LogOut, Pen, Plus } from 'lucide-react';
import { poems } from '../../data/poetry';
import { quotes } from '../../data/quotes';
import { galleryImages } from '../../data/gallery';
import { blogPosts } from '../../data/blog';

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/admin');
    }
  };

  checkSession();
}, [navigate]);

  const stats = [
    { icon: BookOpen, label: 'Poetry', value: poems.length, color: 'from-amber-500 to-yellow-500' },
    { icon: Quote, label: 'Quotes', value: quotes.length, color: 'from-yellow-500 to-orange-500' },
    { icon: Image, label: 'Gallery', value: galleryImages.length, color: 'from-orange-500 to-red-500' },
    { icon: FileText, label: 'Blog Posts', value: blogPosts.length, color: 'from-red-500 to-pink-500' },
    { icon: Mail, label: 'Messages', value: 12, color: 'from-pink-500 to-purple-500' },
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
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Pen className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                انتظامی پنل
              </h1>
              <p className="text-amber-200/60 text-sm">Admin Dashboard</p>
            </div>
          </div>
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

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="w-6 h-6 text-slate-950" />
              </div>
              <p className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</p>
              <p className="text-amber-200/60 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-xl font-bold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
          فوری کارروائی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { path: '/admin/poetry', label: 'Add Poetry', labelUrdu: 'شاعری شامل', color: 'from-amber-500 to-yellow-500' },
            { path: '/admin/quotes', label: 'Add Quote', labelUrdu: 'اقتباس شامل', color: 'from-yellow-500 to-orange-500' },
            { path: '/admin/gallery', label: 'Upload Image', labelUrdu: 'تصویر اپلوڈ', color: 'from-orange-500 to-red-500' },
            { path: '/admin/blog', label: 'New Blog Post', labelUrdu: 'بلاگ پوسٹ', color: 'from-red-500 to-pink-500' },
          ].map((action, i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(action.path)}
              className={`p-6 rounded-2xl bg-gradient-to-r ${action.color} text-slate-950 font-semibold flex items-center justify-center gap-3 shadow-lg`}
            >
              <Plus className="w-5 h-5" />
              <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{action.labelUrdu}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
          مینو
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={item.path}
                className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <p className="text-amber-400 font-semibold">{item.label}</p>
                  <p className="text-amber-200/60 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{item.labelUrdu}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
