import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createGalleryItem, updateGalleryItem, uploadGalleryImage } from "../../services/galleryService";
import type { GalleryItem } from "../../types/gallery";

interface GalleryFormProps {
  gallery?: GalleryItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormErrors = Partial<Record<"title" | "image_url" | "category", string>>;

const initialFormData = Object.freeze({
  title: "",
  description: "",
  image_url: "",
  category: "",
  featured: false,
  status: "draft" as "draft" | "published",
});

function getInitialFormData(gallery?: GalleryItem | null) {
  if (!gallery) return { ...initialFormData };
  return {
    title: gallery.title,
    description: gallery.description,
    image_url: gallery.src,
    category: gallery.category,
    featured: gallery.featured,
    status: gallery.status,
  };
}

export default function GalleryForm({ gallery = null, onSuccess, onCancel }: GalleryFormProps) {
  const [formData, setFormData] = useState(() => getInitialFormData(gallery));
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(gallery?.src ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(gallery);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formData.image_url.trim() && !selectedImage) {
      nextErrors.image_url = "Please upload an image.";
    }

    if (!formData.category.trim()) {
      nextErrors.category = "Please enter a category.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTextChange = (field: "title" | "description" | "category", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (field === "title" && errors.title) {
      setErrors((current) => ({ ...current, title: undefined }));
    }
    if (field === "category" && errors.category) {
      setErrors((current) => ({ ...current, category: undefined }));
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setSubmitError("Image must be smaller than 5MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file && !file.type.startsWith("image/")) {
      setSubmitError("Please select a valid image.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : gallery?.src ?? "");
    setSubmitError("");

    if (errors.image_url) {
      setErrors((current) => ({ ...current, image_url: undefined }));
    }
  };

  const removeImage = () => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl("");
    setFormData((current) => ({ ...current, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      if (selectedImage) {
        imageUrl = await uploadGalleryImage(selectedImage);
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image_url: imageUrl,
        category: formData.category.trim(),
        featured: formData.featured,
        status: formData.status,
      };

      if (gallery) {
        await updateGalleryItem(gallery.id, payload);
      } else {
        await createGalleryItem(payload);
        setFormData({ ...initialFormData });
        setSelectedImage(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save gallery item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-6" noValidate>
      {submitError && (
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="gallery-title" className="mb-2 block text-sm font-medium text-amber-100/90">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="gallery-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleTextChange("title", e.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "gallery-title-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.title && (
            <p id="gallery-title-error" className="mt-1 text-sm text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="gallery-category" className="mb-2 block text-sm font-medium text-amber-100/90">
            Category <span className="text-red-400">*</span>
          </label>
          <input
            id="gallery-category"
            type="text"
            value={formData.category}
            onChange={(e) => handleTextChange("category", e.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "gallery-category-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.category && (
            <p id="gallery-category-error" className="mt-1 text-sm text-red-400">
              {errors.category}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="gallery-description" className="mb-2 block text-sm font-medium text-amber-100/90">
            Description
          </label>
          <textarea
            id="gallery-description"
            value={formData.description}
            onChange={(e) => handleTextChange("description", e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full resize-y rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
        </div>

        <div>
          <label htmlFor="gallery-status" className="mb-2 block text-sm font-medium text-amber-100/90">
            Status
          </label>
          <select
            id="gallery-status"
            value={formData.status}
            onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as "draft" | "published" }))}
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-500/20 bg-slate-950/50 px-4 py-3 text-sm font-medium text-amber-200 transition-colors hover:bg-slate-800">
          <input
            ref={fileInputRef}
            id="gallery-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="hidden"
          />
          Upload Image <span className="text-red-400">*</span>
        </label>
        {errors.image_url && (
          <p className="text-sm text-red-400">{errors.image_url}</p>
        )}

        {previewUrl && (
          <div className="rounded-2xl border border-amber-500/10 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-amber-100/90">Preview</p>
              <button type="button" onClick={removeImage} className="text-sm text-amber-300 transition-colors hover:text-amber-200">
                Remove
              </button>
            </div>
            <img src={previewUrl} alt="Preview" className="h-48 w-full rounded-xl object-cover" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/10 bg-slate-900/60 p-4">
        <label className="inline-flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData((current) => ({ ...current, featured: e.target.checked }))}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-amber-500/20 bg-slate-950 text-amber-500"
          />
          Featured image
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-amber-500/10 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Upload image"}
        </button>
      </div>
    </form>
  );
}
