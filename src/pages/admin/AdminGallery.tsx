import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search, Pen, LogOut, Upload, X } from 'lucide-react';
import { deleteGalleryItem, getAllGallery } from '../../services/galleryService';
import GalleryForm from '../../components/gallery/GalleryForm';
import DeleteGalleryModal from '../../components/gallery/DeleteGalleryModal';
import type { GalleryItem } from '../../types/gallery';

export default function AdminGallery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const data = await getAllGallery();
      setImages(data);
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to load gallery images.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/admin');
        return;
      }

      if (!isMounted) return;
      await loadImages();
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, loadImages]);

  const categories = useMemo(() => Array.from(new Set(images.map((image) => image.category))).sort(), [images]);

  const filteredImages = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return images.filter((image) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        image.title.toLowerCase().includes(normalizedQuery) ||
        image.description.toLowerCase().includes(normalizedQuery);

      const matchesCategory = !selectedCategory || image.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [images, searchQuery, selectedCategory]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleCreate = () => {
  console.log("Upload button clicked");
  setEditingItem(null);
  setIsFormOpen(true);
};

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (item: GalleryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);

    try {
      await deleteGalleryItem(itemToDelete.id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setImages((existingImages) => existingImages.filter((image) => image.id !== itemToDelete.id));
      setFeedback({ type: 'success', message: 'Gallery item deleted successfully.' });
    } catch (error) {
      console.error(error);
      setFeedback({ type: 'error', message: 'Failed to delete gallery item.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFeedback({ type: 'success', message: 'Gallery item saved successfully.' });
    await loadImages();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-amber-500/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30">
              <Pen className="h-7 w-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                گیلری انتظام
              </h1>
              <p className="text-sm text-amber-200/60">Manage Gallery</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-amber-500/30"
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 font-semibold text-red-400 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/20 bg-red-500/10 text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        </div>
      )}

      <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full rounded-xl border border-amber-500/20 bg-slate-900/50 py-3 pl-12 pr-4 text-white placeholder-amber-200/40 outline-none backdrop-blur transition-colors focus:border-amber-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-amber-500/20 bg-slate-900/50 px-4 py-3 text-white outline-none backdrop-blur transition-colors focus:border-amber-500 md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="aspect-square animate-pulse rounded-2xl border border-amber-500/10 bg-slate-900/50" />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="rounded-3xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-amber-200/70">
            No images found.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl transition-all hover:border-amber-500/30"
              >
                <img src={image.src} alt={image.title} className="aspect-square w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold text-amber-400" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                      {image.title}
                    </h3>
                    <p className="text-xs text-amber-200/60">{image.category}</p>
                    <p className="mt-1 text-xs text-amber-200/40">
                      {image.status === 'published' ? (
                        <span className="text-emerald-400">Published</span>
                      ) : (
                        <span className="text-amber-400/60">Draft</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(image)}
                    className="rounded-lg bg-blue-500/20 p-1.5 text-blue-400 transition-colors hover:bg-blue-500/30"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(image)}
                    className="rounded-lg bg-red-500/20 p-1.5 text-red-400 transition-colors hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between border-b border-amber-500/10 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-amber-400">
                  {editingItem ? 'Edit gallery item' : 'Upload new image'}
                </h2>
                <p className="text-sm text-slate-400">
                  {editingItem ? 'Update the gallery entry and its metadata.' : 'Add a new image to the gallery.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFormCancel}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
              <GalleryForm
                key={editingItem?.id ?? 'new'}
                gallery={editingItem}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </motion.div>
        </div>
      )}

      <DeleteGalleryModal
        open={isDeleteModalOpen}
        title={itemToDelete?.title ?? "this image"}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
