import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Share2, X, Facebook, MessageCircle, Send } from 'lucide-react';
import { quotes } from '../data/quotes';

const categories = [...new Set(quotes.map(q => q.category))];

export default function IslamicQuotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<typeof quotes[0] | null>(null);

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = quote.urduText.includes(searchQuery) || 
                         quote.englishText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || quote.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const shareToFacebook = (quote: typeof quotes[0]) => {
    const text = encodeURIComponent(`${quote.urduText}\n\n${quote.source}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, '_blank');
  };

  const shareToWhatsApp = (quote: typeof quotes[0]) => {
    const text = encodeURIComponent(`${quote.urduText}\n\n${quote.englishText}\n\n${quote.source}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToTelegram = (quote: typeof quotes[0]) => {
    const text = encodeURIComponent(`${quote.urduText}\n\n${quote.englishText}\n\n${quote.source}`);
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
                اسلامی اقتباسات
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Islamic Quotes Collection</p>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
            }`}
            style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
          >
            تمام
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
              }`}
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اقتباس تلاش کریں..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 backdrop-blur border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
            style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
          />
        </motion.div>
      </div>

      {/* Quotes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote, i) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedQuote(quote)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all h-full flex flex-col">
                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    {quote.category}
                  </span>
                </div>
                <p className="text-xl text-amber-200 leading-relaxed flex-1 mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  "{quote.urduText}"
                </p>
                <p className="text-amber-100/50 italic text-sm mb-4">
                  "{quote.englishText}"
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-amber-500/10">
                  <span className="text-amber-500 font-semibold text-sm" style={{ fontFamily: 'Amiri, serif' }}>
                    {quote.source}
                  </span>
                  <button className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-200/60 text-lg" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              کوئی اقتباس نہیں ملا
            </p>
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {selectedQuote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          onClick={() => setSelectedQuote(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl"
          >
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {selectedQuote.category}
              </span>
            </div>

            <div className="p-8 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-6">
              <p className="text-2xl text-amber-200 leading-loose text-center" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {selectedQuote.urduText}
              </p>
            </div>

            <p className="text-amber-100/60 italic text-center text-lg mb-4">
              "{selectedQuote.englishText}"
            </p>

            <p className="text-amber-500 font-semibold text-center mb-8" style={{ fontFamily: 'Amiri, serif' }}>
              {selectedQuote.source}
            </p>

            <div className="flex items-center justify-center gap-4 pt-6 border-t border-amber-500/10">
              <button
                onClick={() => shareToFacebook(selectedQuote)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
              <button
                onClick={() => shareToWhatsApp(selectedQuote)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={() => shareToTelegram(selectedQuote)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 transition-colors"
              >
                <Send className="w-5 h-5" />
                Telegram
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}