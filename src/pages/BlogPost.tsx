import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Heart, Share2, MessageCircle } from 'lucide-react';
import { blogPosts } from '../data/blog';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === Number(id)) || blogPosts[0];
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [comments, setComments] = useState(post.comments);

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

  const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-amber-200/60">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          <div className="prose prose-lg prose-invert max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-amber-100/80 text-lg leading-relaxed mb-6" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between py-8 mt-8 border-t border-b border-amber-500/10">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                <Heart className="w-5 h-5" />
                Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
            <span className="text-amber-200/60 text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {comments.length} Comments
            </span>
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="py-12"
        >
          <h2 className="text-2xl font-bold text-amber-400 mb-8" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
            تبصرے ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8 p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="آپ کا نام"
                className="px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اپنا تبصرہ لکھیں..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              تبصرہ بھیجیں
            </motion.button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{c.name}</span>
                  <span className="text-amber-200/40 text-sm">{c.date}</span>
                </div>
                <p className="text-amber-100/70" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{c.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-12"
        >
          <h2 className="text-2xl font-bold text-amber-400 mb-8" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
            متعلقہ مضامین
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <Link key={p.id} to={`/blog/${p.id}`} className="group">
                <div className="rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="text-amber-400 font-semibold line-clamp-2 group-hover:text-amber-300 transition-colors" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {p.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}