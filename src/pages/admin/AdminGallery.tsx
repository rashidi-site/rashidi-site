import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Search, Pen, LogOut, Upload } from 'lucide-react';
import { deleteGalleryItem, getAllGallery } from '../../services/galleryService';
import type { GalleryItem } from '../../types/gallery';

export default function AdminGallery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<GalleryItem[]>([]);
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

    const loadImages = async () => {
      try {
        const data = await getAllGallery();
        if (isMounted) {
          setImages(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => Array.from(new Set(images.map((image) => image.category))), [images]);

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) || image.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || image.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [images, searchQuery, selectedCategory]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryItem(id);
      setImages((existingImages) => existingImages.filter((image) => image.id !== id));
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
                گیلری انتظام
              </h1>
              <p className="text-amber-200/60 text-sm">Manage Gallery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/30"
            >
              <Upload className="w-5 h-5" />
              Upload Image
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
              placeholder="Search images..."
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

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="aspect-square animate-pulse rounded-2xl border border-amber-500/10 bg-slate-900/50" />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200/70">No images found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredImages.map((image, index) => (
              <motion.div key={image.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="group relative overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl transition-all hover:border-amber-500/30">
                <img src={image.src} alt={image.title} className="aspect-square w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>{image.title}</h3>
                    <p className="text-xs text-amber-200/60">{image.category}</p>
                  </div>
                </div>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-lg bg-amber-500/20 p-1.5 text-amber-400 transition-colors hover:bg-amber-500/30"><Eye className="h-4 w-4" /></button>
                  <button className="rounded-lg bg-blue-500/20 p-1.5 text-blue-400 transition-colors hover:bg-blue-500/30"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => void handleDelete(image.id)} className="rounded-lg bg-red-500/20 p-1.5 text-red-400 transition-colors hover:bg-red-500/30"><Trash2 className="h-4 w-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
