import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";

interface DeleteGalleryModalProps {
  open: boolean;
  title: string;
  isDeleting?: boolean;
  onClose: () => void;
  onDelete: () => void | Promise<void>;
}

export default function DeleteGalleryModal({
  open,
  title,
  isDeleting = false,
  onClose,
  onDelete,
}: DeleteGalleryModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDeleting, onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              onClose();
            }
          }}
        >
          <motion.section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-gallery-title"
            aria-describedby="delete-gallery-description"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl border border-red-400/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-300">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <h2 id="delete-gallery-title" className="mt-5 text-xl font-semibold text-white">
              Delete image?
            </h2>

            <p id="delete-gallery-description" className="mt-3 text-sm leading-6 text-slate-300">
              This will permanently remove <span className="font-semibold text-amber-300">{title}</span>. This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
