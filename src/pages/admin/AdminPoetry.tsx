import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Pen, LogOut } from 'lucide-react';
import { poems, categories } from '../../data/poetry';

export default function AdminPoetry() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<typeof poems[0] | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const filteredPoems = poems.filter((poem) => {
    const matchesSearch = poem.title.includes(searchQuery) || poem.urduText.includes(searchQuery);
    const matchesCategory = !selectedCategory || poem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleEdit = (poem: typeof poems[0]) => {
    setEditingPoem(poem);
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    alert(`Poetry with ID ${id} would be deleted`);
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
                شاعری انتظام
              </h1>
              <p className="text-amber-200/60 text-sm">Manage Poetry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEditingPoem(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/30"
            >
              <Plus className="w-5 h-5" />
              Add Poetry
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

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search poetry..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full md:w-48 px-4 py-3 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Poetry Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-500/10">
              <tr>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Likes</th>
                <th className="px-6 py-4 text-left text-amber-400 font-semibold">Featured</th>
                <th className="px-6 py-4 text-right text-amber-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {filteredPoems.map((poem, i) => (
                <motion.tr
                  key={poem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-amber-500/5 transition-colors"
                >
                  <td className="px-6 py-4 text-amber-200" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{poem.title}</td>
                  <td className="px-6 py-4 text-amber-200/60">{poem.category}</td>
                  <td className="px-6 py-4 text-amber-200/60">{poem.date}</td>
                  <td className="px-6 py-4 text-amber-200/60">{poem.likes}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs ${poem.featured ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {poem.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(poem)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(poem.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              {editingPoem ? 'شاعری ترمیم' : 'شاعری شامل'}
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>عنوان</label>
                <input
                  type="text"
                  defaultValue={editingPoem?.title || ''}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                />
              </div>
              <div>
                <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>زمرہ</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white focus:outline-none focus:border-amber-500 transition-colors">
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-amber-200/80 text-sm mb-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>شاعری</label>
                <textarea
                  defaultValue={editingPoem?.urduText || ''}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                />
              </div>
              <div>
                <label className="block text-amber-200/80 text-sm mb-2">English Translation</label>
                <textarea
                  defaultValue={editingPoem?.englishTranslation || ''}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={editingPoem?.featured} className="w-5 h-5 rounded" />
                <label className="text-amber-200/80 text-sm">Featured</label>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30"
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              >
                {editingPoem ? 'ترمیم' : 'شامل'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}