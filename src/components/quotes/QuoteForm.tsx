import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createQuote, updateQuote, uploadQuoteImage } from "../../services/quoteService";
import type { Quote, QuoteFormData } from "../../types/quotes";

interface QuoteFormProps {
  quote?: Quote | null;
  categories: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

type FormErrors = Partial<Record<"quote" | "author" | "category", string>>;

const initialFormData = Object.freeze<QuoteFormData>({
  quote: "",
  author: "",
  source: "",
  category: "",
  featured: false,
  status: "draft",
  cover_image: "",
});

function getInitialFormData(quote?: Quote | null): QuoteFormData {
  if (!quote) {
    return initialFormData;
  }

  return {
    quote: quote.quote,
    author: quote.author,
    source: quote.source ?? "",
    category: quote.category,
    featured: quote.featured,
    status: quote.status,
    cover_image: quote.cover_image ?? "",
  };
}

export default function QuoteForm({ quote = null, categories, onSuccess, onCancel }: QuoteFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>(() => getInitialFormData(quote));
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(quote?.cover_image ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.quote.trim()) {
      nextErrors.quote = "Quote text is required.";
    }

    if (!formData.author.trim()) {
      nextErrors.author = "Author is required.";
    }

    if (!formData.category.trim()) {
      nextErrors.category = "Please select a category.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTextChange = (field: "quote" | "author" | "source", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));

    if (field === "quote" && errors.quote) {
      setErrors((current) => ({ ...current, quote: undefined }));
    }

    if (field === "author" && errors.author) {
      setErrors((current) => ({ ...current, author: undefined }));
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, category: event.target.value }));

    if (errors.category) {
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
    setPreviewUrl(file ? URL.createObjectURL(file) : quote?.cover_image ?? "");
    setSubmitError("");
  };

  const removeImage = () => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl("");
    setFormData((current) => ({ ...current, cover_image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImageUrl = formData.cover_image;

      if (selectedImage) {
        coverImageUrl = await uploadQuoteImage(selectedImage);
      }

      const payload: QuoteFormData = {
        ...formData,
        quote: formData.quote.trim(),
        author: formData.author.trim(),
        source: formData.source.trim(),
        category: formData.category.trim(),
        cover_image: coverImageUrl,
      };

      if (quote) {
        await updateQuote(quote.id, payload);
      } else {
        await createQuote(payload);
        setFormData({ ...initialFormData });
        setSelectedImage(null);
        setPreviewUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save quote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-6" noValidate>
      {submitError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="quote-text" className="mb-2 block text-sm font-medium text-amber-100/90">
            Quote <span className="text-red-400">*</span>
          </label>
          <textarea
            id="quote-text"
            value={formData.quote}
            onChange={(event) => handleTextChange("quote", event.target.value)}
            aria-invalid={Boolean(errors.quote)}
            aria-describedby={errors.quote ? "quote-text-error" : undefined}
            disabled={isSubmitting}
            rows={5}
            className="w-full resize-y rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.quote && <p id="quote-text-error" className="mt-1 text-sm text-red-400">{errors.quote}</p>}
        </div>

        <div>
          <label htmlFor="quote-author" className="mb-2 block text-sm font-medium text-amber-100/90">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            id="quote-author"
            type="text"
            value={formData.author}
            onChange={(event) => handleTextChange("author", event.target.value)}
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? "quote-author-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.author && <p id="quote-author-error" className="mt-1 text-sm text-red-400">{errors.author}</p>}
        </div>

        <div>
          <label htmlFor="quote-category" className="mb-2 block text-sm font-medium text-amber-100/90">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="quote-category"
            value={formData.category}
            onChange={handleCategoryChange}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "quote-category-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p id="quote-category-error" className="mt-1 text-sm text-red-400">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="quote-source" className="mb-2 block text-sm font-medium text-amber-100/90">
            Source
          </label>
          <input
            id="quote-source"
            type="text"
            value={formData.source}
            onChange={(event) => handleTextChange("source", event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
        </div>

        <div>
          <label htmlFor="quote-status" className="mb-2 block text-sm font-medium text-amber-100/90">
            Status
          </label>
          <select
            id="quote-status"
            value={formData.status}
            onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as QuoteFormData["status"] }))}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-500/10 bg-slate-900/60 p-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-500/20 bg-slate-950/60 px-3 py-2 text-sm font-medium text-amber-200 transition-colors hover:bg-slate-800">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          Upload cover image
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(event) => setFormData((current) => ({ ...current, featured: event.target.checked }))}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-amber-500/20 bg-slate-950 text-amber-500"
          />
          Featured quote
        </label>
      </div>

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

      <div className="flex flex-col-reverse gap-3 border-t border-amber-500/10 pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition-colors disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Saving..." : quote ? "Save changes" : "Create quote"}
        </button>
      </div>
    </form>
  );
}
