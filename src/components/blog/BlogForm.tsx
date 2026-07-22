import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createBlogPost, updateBlogPost, uploadBlogImage, type BlogPostItem, type BlogPostFormData } from "../../services/blogService";
import { slugify } from "../../utils/slugify";

interface BlogFormProps {
  blog?: BlogPostItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormErrors = Partial<Record<"title" | "content" | "category" | "author", string>>;

const initialFormData = Object.freeze<BlogPostFormData>({
  title: "",
  content: "",
  excerpt: "",
  slug: "",
  author: "",
  cover_image: "",
  featured: false,
  status: "draft",
  category: "",
});

function getInitialFormData(blog?: BlogPostItem | null): BlogPostFormData {
  if (!blog) return { ...initialFormData };
  return {
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt,
    slug: blog.slug,
    author: blog.author,
    cover_image: blog.cover_image ?? "",
    featured: blog.featured,
    status: blog.status,
    category: blog.category,
  };
}

export default function BlogForm({ blog = null, onSuccess, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogPostFormData>(() => getInitialFormData(blog));
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(blog?.cover_image ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(blog);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.title.trim()) nextErrors.title = "Title is required.";
    if (!formData.content.trim()) nextErrors.content = "Content is required.";
    if (!formData.category.trim()) nextErrors.category = "Category is required.";
    if (!formData.author.trim()) nextErrors.author = "Author is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setFormData((current) => ({
      ...current,
      title,
      slug: isSlugManuallyEdited ? current.slug : slugify(title),
    }));
    if (errors.title) setErrors((current) => ({ ...current, title: undefined }));
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setFormData((current) => ({ ...current, slug: slugify(event.target.value) }));
  };

  const handleTextChange = (field: "author" | "content" | "excerpt" | "category", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (field === "author" && errors.author) setErrors((current) => ({ ...current, author: undefined }));
    if (field === "content" && errors.content) setErrors((current) => ({ ...current, content: undefined }));
    if (field === "category" && errors.category) setErrors((current) => ({ ...current, category: undefined }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setSubmitError("Image must be smaller than 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file && !file.type.startsWith("image/")) {
      setSubmitError("Please select a valid image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : blog?.cover_image ?? "");
    setSubmitError("");
  };

  const removeImage = () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl("");
    setFormData((current) => ({ ...current, cover_image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let coverImageUrl = formData.cover_image;

      if (selectedImage) {
        coverImageUrl = await uploadBlogImage(selectedImage);
      }

      const payload: BlogPostFormData = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        author: formData.author.trim(),
        category: formData.category.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        cover_image: coverImageUrl,
      };

      if (blog) {
        await updateBlogPost(blog.id, payload);
      } else {
        await createBlogPost(payload);
        setFormData({ ...initialFormData });
        setSelectedImage(null);
        setPreviewUrl("");
        setIsSlugManuallyEdited(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save blog post.");
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
          <label htmlFor="blog-title" className="mb-2 block text-sm font-medium text-amber-100/90">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="blog-title"
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "blog-title-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.title && <p id="blog-title-error" className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="blog-slug" className="mb-2 block text-sm font-medium text-amber-100/90">
            Slug
          </label>
          <input
            id="blog-slug"
            type="text"
            value={formData.slug}
            onChange={handleSlugChange}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
        </div>

        <div>
          <label htmlFor="blog-author" className="mb-2 block text-sm font-medium text-amber-100/90">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            id="blog-author"
            type="text"
            value={formData.author}
            onChange={(e) => handleTextChange("author", e.target.value)}
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? "blog-author-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.author && <p id="blog-author-error" className="mt-1 text-sm text-red-400">{errors.author}</p>}
        </div>

        <div>
          <label htmlFor="blog-category" className="mb-2 block text-sm font-medium text-amber-100/90">
            Category <span className="text-red-400">*</span>
          </label>
          <input
            id="blog-category"
            type="text"
            value={formData.category}
            onChange={(e) => handleTextChange("category", e.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "blog-category-error" : undefined}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
          {errors.category && <p id="blog-category-error" className="mt-1 text-sm text-red-400">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="blog-status" className="mb-2 block text-sm font-medium text-amber-100/90">
            Status
          </label>
          <select
            id="blog-status"
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

      <div>
        <label htmlFor="blog-excerpt" className="mb-2 block text-sm font-medium text-amber-100/90">
          Excerpt
        </label>
        <textarea
          id="blog-excerpt"
          value={formData.excerpt}
          onChange={(e) => handleTextChange("excerpt", e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="w-full resize-y rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
        />
      </div>

      <div>
        <label htmlFor="blog-content" className="mb-2 block text-sm font-medium text-amber-100/90">
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="blog-content"
          value={formData.content}
          onChange={(e) => handleTextChange("content", e.target.value)}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? "blog-content-error" : undefined}
          disabled={isSubmitting}
          rows={14}
          className="w-full resize-y rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:cursor-not-allowed disabled:bg-slate-900"
        />
        {errors.content && <p id="blog-content-error" className="mt-1 text-sm text-red-400">{errors.content}</p>}
      </div>

      <div className="space-y-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-amber-500/20 bg-slate-950/50 px-4 py-3 text-sm font-medium text-amber-200 transition-colors hover:bg-slate-800">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          Upload cover image
        </label>

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
          Featured post
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-amber-500/10 pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition-colors disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}
