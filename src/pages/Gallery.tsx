import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages, galleryCategories } from '../data/gallery';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('تمام');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = selectedCategory === 'تمام'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: typeof galleryImages[0], index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
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
                گیلری
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Photo Gallery</p>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {galleryCategories.map((cat) => (
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

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-square"
              onClick={() => openLightbox(image, i)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-amber-400 font-semibold" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {image.title}
                </h3>
                <p className="text-amber-200/60 text-sm" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {image.description}
                </p>
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-500/20 backdrop-blur-sm text-amber-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {image.category}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-6 p-3 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-6 p-3 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh] mx-4"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
              <div className="text-center mt-4">
                <h3 className="text-xl text-amber-400 font-semibold" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {selectedImage.title}
                </h3>
                <p className="text-amber-200/60" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}