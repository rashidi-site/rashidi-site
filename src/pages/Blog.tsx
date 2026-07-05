import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { blogPosts } from '../data/blog';

export default function Blog() {
  const featuredPost = blogPosts[0];

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
                بلاگ
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Blog Articles</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Link to={`/blog/${featuredPost.id}`} className="group block">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {featuredPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {featuredPost.title}
                </h2>
                <p className="text-amber-200/80 text-lg mb-4 max-w-2xl" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-amber-200/60 text-sm">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link to={`/blog/${post.id}`} className="group block h-full">
                <div className="relative h-full rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-amber-500/10 hover:border-amber-500/30 transition-all">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs mb-3" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-amber-400 mb-3 group-hover:text-amber-300 transition-colors" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {post.title}
                    </h3>
                    <p className="text-amber-200/60 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-amber-500/10">
                      <span className="text-amber-100/40 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="text-amber-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}