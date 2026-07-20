import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pen, Plus, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PoetryFilters, { type PoetryFeaturedFilter, type PoetryStatusFilter } from "../../components/poetry/PoetryFilters";
import PoetryTable from "../../components/poetry/PoetryTable";
import PoetryForm from "../../components/poetry/PoetryForm";
import DeletePoetryModal from "../../components/poetry/DeletePoetryModal";
import { supabase } from "../../lib/supabase";
import { deletePoetry, getAllPoetry } from "../../services/poetryService";
import type { Poetry } from "../../types/poetry";

export default function AdminPoetry() {
  const navigate = useNavigate();
  const [poems, setPoems] = useState<Poetry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PoetryStatusFilter>("");
  const [selectedFeatured, setSelectedFeatured] = useState<PoetryFeaturedFilter>("all");
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poetry | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState<Poetry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const getCategoryOptions = (poetryItems: Poetry[]): string[] =>
    Array.from(
      new Set(
        poetryItems
          .map((poem) => poem.category)
          .filter((category): category is string => Boolean(category)),
      ),
    ).sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory));

  const refreshPoetry = useCallback(async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const poetryData = await getAllPoetry();

      setPoems(poetryData);
      setCategories(getCategoryOptions(poetryData));
    } catch (error) {
      console.error("Unable to load poetry data.", error);
      setFeedback({ type: "error", message: "Failed to load poetry." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const verifySession = async () => {
      const {
       data: { session },
       } = await supabase.auth.getSession();

      if (!session) {
        navigate("/admin");
        return;
      }

      if (!isActive) {
        return;
      }

      await refreshPoetry();
    };

    void verifySession();

    return () => {
      isActive = false;
    };
  }, [navigate, refreshPoetry]);

  const filteredPoems = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase();

    return poems.filter((poem) => {
      const matchesQuery =
        loweredQuery.length === 0 ||
        [poem.title, poem.author, poem.category, poem.content]
          .join(" ")
          .toLowerCase()
          .includes(loweredQuery);

      const matchesCategory =
        selectedCategory.length === 0 || poem.category === selectedCategory;

      const matchesStatus =
        selectedStatus.length === 0 || poem.status === selectedStatus;

      const matchesFeatured =
        selectedFeatured === "all" ||
        (selectedFeatured === "featured" ? poem.featured : !poem.featured);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesStatus &&
        matchesFeatured
      );
    });
  }, [poems, searchQuery, selectedCategory, selectedStatus, selectedFeatured]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/admin", {
    replace: true,
   });
  };

  const handleCreate = () => {
    setEditingPoem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (poem: Poetry) => {
    setEditingPoem(poem);
    setIsFormOpen(true);
  };

  const handleDelete = (poem: Poetry) => {
    setPoemToDelete(poem);
    setIsDeleteModalOpen(true);
  };

  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    setEditingPoem(null);
    setFeedback({ type: "success", message: "Poetry saved successfully." });
    await refreshPoetry();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingPoem(null);
  };

  const handleDeleteConfirm = async () => {
    if (!poemToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deletePoetry(poemToDelete.id);
      setIsDeleteModalOpen(false);
      setPoemToDelete(null);
      setFeedback({ type: "success", message: "Poetry deleted successfully." });
      await refreshPoetry();
    } catch (error) {
      console.error("FULL ERROR:", error);
      alert(JSON.stringify(error));
      console.error("Unable to delete poetry.", error);
      setFeedback({ type: "error", message: "Failed to delete poetry." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/95 pb-16 pt-24 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-amber-500/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 shadow-lg shadow-amber-500/30">
              <Pen className="h-7 w-7 text-slate-950" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-amber-400"
                style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
              >
                شاعری انتظام
              </h1>
              <p className="text-sm text-amber-200/60">Manage poetry entries</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-amber-500/30"
            >
              <Plus className="h-5 w-5" />
              Add Poetry
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
        </header>

        {feedback && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <PoetryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedFeatured={selectedFeatured}
          setSelectedFeatured={setSelectedFeatured}
          categories={categories}
        />

        <PoetryTable
          poems={filteredPoems}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
                  {editingPoem ? "Edit poetry" : "Add poetry"}
                </h2>
                <p className="text-sm text-slate-400">
                  {editingPoem
                    ? "Update the poetry entry and its metadata."
                    : "Create a new poetry entry for the website."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleFormCancel}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close poetry form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
              <PoetryForm
                key={editingPoem?.id ?? "new"}
                poetry={editingPoem}
                categories={categories}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </motion.div>
        </div>
      )}

      <DeletePoetryModal
        open={isDeleteModalOpen}
        title={poemToDelete?.title ?? "this poetry entry"}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPoemToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
