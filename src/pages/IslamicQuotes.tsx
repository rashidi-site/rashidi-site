import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Share2, X, Facebook, MessageCircle, Send } from 'lucide-react';
import { getPublishedQuotes, getQuoteCategories } from '../services/quoteService';
import type { Quote } from '../types/quotes';

export default function IslamicQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const [quoteData, categoryData] = await Promise.all([getPublishedQuotes(), getQuoteCategories()]);

        if (isMounted) {
          setQuotes(quoteData);
          setCategories(categoryData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load the quotes collection right now.');
          console.error(loadError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadQuotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredQuotes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [quote.quote, quote.author, quote.category, quote.source ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesCategory = !selectedCategory || quote.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [quotes, searchQuery, selectedCategory]);

  const shareToFacebook = (quote: Quote) => {
    const text = encodeURIComponent(`${quote.quote}\n\n${quote.source ?? quote.author}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = (quote: Quote) => {
    const text = encodeURIComponent(`${quote.quote}\n\n${quote.author}\n\n${quote.source ?? ''}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToTelegram = (quote: Quote) => {
    const text = encodeURIComponent(`${quote.quote}\n\n${quote.author}\n\n${quote.source ?? ''}`);
    window.open(`https://t.me/share/url?url=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">اسلامی اقتباسات</span>
            </h1>
            <p className="text-xl text-amber-200/60">Islamic Quotes Collection</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-3">
          <button onClick={() => setSelectedCategory('')} className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${!selectedCategory ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950' : 'border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`} style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
            تمام
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950' : 'border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`} style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mb-12 max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/60" />
          <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="اقتباس تلاش کریں..." className="w-full rounded-xl border border-amber-500/20 bg-slate-900/50 py-4 pl-12 pr-4 text-white placeholder-amber-200/40 transition-colors outline-none focus:border-amber-500" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }} />
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-56 animate-pulse rounded-2xl border border-amber-500/10 bg-slate-900/50" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200">{error}</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-12 text-center text-amber-200/70">No quotes matched your search.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuotes.map((quote, i) => (
              <motion.div key={quote.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="group relative cursor-pointer" onClick={() => setSelectedQuote(quote)}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <div className="relative flex h-full flex-col rounded-2xl border border-amber-500/10 bg-slate-900/50 p-6 backdrop-blur-xl transition-all hover:border-amber-500/30">
                  <div className="mb-4">
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {quote.category}
                    </span>
                  </div>
                  <p className="mb-4 flex-1 text-xl leading-relaxed text-amber-200" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    “{quote.quote}”
                  </p>
                  <p className="mb-4 text-sm italic text-amber-100/50">“{quote.author}”</p>
                  <div className="flex items-center justify-between border-t border-amber-500/10 pt-4">
                    <span className="text-sm font-semibold text-amber-500" style={{ fontFamily: 'Amiri, serif' }}>
                      {quote.source ?? 'Islamic Wisdom'}
                    </span>
                    <button className="rounded-lg bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedQuote && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl" onClick={() => setSelectedQuote(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="relative w-full max-w-2xl rounded-2xl border border-amber-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl">
            <button onClick={() => setSelectedQuote(null)} className="absolute right-4 top-4 rounded-full bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20">
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {selectedQuote.category}
              </span>
            </div>

            <div className="mb-6 rounded-xl border border-amber-500/10 bg-amber-500/5 p-8">
              <p className="text-center text-2xl leading-loose text-amber-200" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {selectedQuote.quote}
              </p>
            </div>

            <p className="mb-4 text-center text-lg italic text-amber-100/60">“{selectedQuote.author}”</p>
            <p className="mb-8 text-center font-semibold text-amber-500" style={{ fontFamily: 'Amiri, serif' }}>
              {selectedQuote.source ?? 'Islamic Wisdom'}
            </p>

            <div className="flex items-center justify-center gap-4 border-t border-amber-500/10 pt-6">
              <button onClick={() => shareToFacebook(selectedQuote)} className="flex items-center gap-2 rounded-lg bg-blue-600/20 px-4 py-2 text-blue-400 transition-colors hover:bg-blue-600/30">
                <Facebook className="h-5 w-5" />
                Facebook
              </button>
              <button onClick={() => shareToWhatsApp(selectedQuote)} className="flex items-center gap-2 rounded-lg bg-green-600/20 px-4 py-2 text-green-400 transition-colors hover:bg-green-600/30">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </button>
              <button onClick={() => shareToTelegram(selectedQuote)} className="flex items-center gap-2 rounded-lg bg-sky-600/20 px-4 py-2 text-sky-400 transition-colors hover:bg-sky-600/30">
                <Send className="h-5 w-5" />
                Telegram
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
