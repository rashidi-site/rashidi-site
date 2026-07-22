import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPublishedGallery } from '../services/galleryService';
import type { GalleryItem } from '../types/gallery';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublishedGallery();
        if (isMounted) {
          setImages(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError('Unable to load the gallery right now. Please try again shortly.');
          console.error(loadError);
        }
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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(images.map((img) => img.category).filter(Boolean)),
    );
    return uniqueCategories.sort();
  }, [images]);

  const filteredImages = useMemo(() => {
    if (!selectedCategory) return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const openLightbox = (image: GalleryItem, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % filteredImages.length
        : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1
              className="mb-4 text-5xl font-bold md:text-6xl"
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                گیلری
              </span>
            </h1>
            <p className="text-xl text-amber-200/60">Photo Gallery</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-10 w-24 animate-pulse rounded-xl bg-slate-800/80" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <button
              onClick={() => setSelectedCategory('')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                  : 'border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
              }`}
              style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
            >
              تمام
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                    : 'border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                }`}
                style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        ) : null}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl border border-amber-500/10 bg-slate-900/50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200">
            {error}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-12 text-center text-amber-200/70">
            No gallery images are available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredImages.map((image, i) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => openLightbox(image, i)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <h3
                    className="font-semibold text-amber-400"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {image.title}
                  </h3>
                  <p
                    className="text-sm text-amber-200/60"
                    style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                  >
                    {image.description}
                  </p>
                </div>
                <div className="absolute right-3 top-3 rounded-lg bg-amber-500/20 px-2 py-1 text-xs text-amber-400 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  {image.category}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

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
              className="absolute right-6 top-6 z-10 rounded-full bg-amber-500/10 p-3 text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-6 z-10 rounded-full bg-amber-500/10 p-3 text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-6 z-10 rounded-full bg-amber-500/10 p-3 text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 max-w-5xl"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[75vh] max-w-full rounded-xl object-contain"
              />
              <div className="mt-4 text-center">
                <h3
                  className="text-xl font-semibold text-amber-400"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
                  {selectedImage.title}
                </h3>
                <p
                  className="text-amber-200/60"
                  style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}
                >
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
