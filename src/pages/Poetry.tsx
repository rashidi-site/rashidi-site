import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Share2, X, Facebook, MessageCircle, Send } from 'lucide-react';
import { poems, categories } from '../data/poetry';

export default function Poetry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPoem, setSelectedPoem] = useState<typeof poems[0] | null>(null);

  const filteredPoems = poems.filter((poem) => {
    const matchesSearch = poem.title.includes(searchQuery) || 
                         poem.urduText.includes(searchQuery) ||
                         poem.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || poem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const shareToFacebook = (poem: typeof poems[0]) => {
    const text = encodeURIComponent(`${poem.title}\n\n${poem.urduText}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, '_blank');
  };

  const shareToWhatsApp = (poem: typeof poems[0]) => {
    const text = encodeURIComponent(`${poem.title}\n\n${poem.urduText}\n\n${poem.englishTranslation}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToTelegram = (poem: typeof poems[0]) => {
    const text = encodeURIComponent(`${poem.title}\n\n${poem.urduText}\n\n${poem.englishTranslation}`);
    window.open(`https://t.me/share/url?url=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                شاعری کا مجموعہ
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Poetry Collection</p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="تلاش کریں..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full md:w-64 pl-12 pr-10 py-4 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="">تمام زمرے</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Poetry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem, i) => (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedPoem(poem)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all h-full">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {poem.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400/60">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{poem.likes}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-amber-400 mb-3" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {poem.title}
                </h3>
                <p className="text-amber-200/80 leading-relaxed line-clamp-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {poem.urduText}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-500/10">
                  <span className="text-amber-100/40 text-sm">{poem.date}</span>
                  <button className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">
                    Read More <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPoems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-200/60 text-lg" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              کوئی شاعری نہیں ملی
            </p>
          </div>
        )}
      </div>

      {/* Poem Modal */}
      {selectedPoem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          onClick={() => setSelectedPoem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl"
          >
            <button
              onClick={() => setSelectedPoem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {selectedPoem.category}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-amber-400 mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              {selectedPoem.title}
            </h2>

            <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-6">
              <p className="text-2xl text-amber-200 leading-loose text-center whitespace-pre-line" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {selectedPoem.urduText}
              </p>
            </div>

            <p className="text-amber-100/60 italic text-center leading-relaxed mb-8">
              {selectedPoem.englishTranslation}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-amber-500/10">
              <span className="text-amber-100/40 text-sm">{selectedPoem.date}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => shareToFacebook(selectedPoem)}
                  className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareToWhatsApp(selectedPoem)}
                  className="p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => shareToTelegram(selectedPoem)}
                  className="p-2 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}