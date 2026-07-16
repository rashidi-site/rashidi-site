import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  createPoetry,
  updatePoetry,
  uploadPoetryImage,
} from "../../services/poetryService";
import { Poetry, PoetryFormData } from "../../types/poetry";
import { slugify } from "../../utils/slugify";
interface PoetryFormProps {
  poetry?: Poetry | null;
  categories: string[];
  onSuccess: () => void;
  onCancel: () => void;
}
type FormErrors = Partial<Record<"title" | "content" | "author" | "category", string>>;
const initialFormData: PoetryFormData = {
  title: "",
  content: "",
  author: "",
  category: "",
  english_translation: "",
  slug: "",
  cover_image: "",
  featured: false,
  status: "draft",
};
function getInitialFormData(poetry?: Poetry | null): PoetryFormData {
  if (!poetry) {
    return initialFormData;
  }
  return {
    title: poetry.title,
    content: poetry.content,
    author: poetry.author,
    category: poetry.category,
    english_translation: poetry.english_translation ?? "",
    slug: poetry.slug,
    cover_image: poetry.cover_image ?? "",
    featured: poetry.featured,
    status: poetry.status,
  };
}
export default function PoetryForm({
  poetry = null,
  categories,
  onSuccess,
  onCancel,
}: PoetryFormProps) {
  const [formData, setFormData] = useState<PoetryFormData>(() =>
    getInitialFormData(poetry),
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    poetry?.cover_image ?? "",
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = Boolean(poetry);
  useEffect(() => {
    setFormData(getInitialFormData(poetry));
    setSelectedImage(null);
    setPreviewUrl(poetry?.cover_image ?? "");
    setErrors({});
    setSubmitError("");
    setIsSlugManuallyEdited(false);
if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
  }, [poetry]);
  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }
const objectUrl = URL.createObjectURL(selectedImage);
setPreviewUrl(objectUrl);

return () => {
  URL.revokeObjectURL(objectUrl);
};
  }, [selectedImage]);
  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
if (!formData.title.trim()) {
  nextErrors.title = "Title is required.";
}

if (!formData.content.trim()) {
  nextErrors.content = "Content is required.";
}

if (!formData.author.trim()) {
  nextErrors.author = "Author is required.";
}

if (!formData.category) {
  nextErrors.category = "Please select a category.";
}

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

if (errors.title) {
  setErrors((current) => ({ ...current, title: undefined }));
}
  };
  const handleTextChange = (
    field: "author" | "content" | "english_translation",
    value: string,
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
if (field === "author" && errors.author) {
  setErrors((current) => ({ ...current, author: undefined }));
}

if (field === "content" && errors.content) {
  setErrors((current) => ({ ...current, content: undefined }));
}
  };
  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    const slug = slugify(event.target.value);
    setIsSlugManuallyEdited(true);
    setFormData((current) => ({ ...current, slug }));
  };
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, category: event.target.value }));
if (errors.category) {
  setErrors((current) => ({ ...current, category: undefined }));
}
  };
  const handleImageChange = (
  event: ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0] ?? null;

  // Image size validation
  if (file && file.size > 5 * 1024 * 1024) {
    setSubmitError("Image must be smaller than 5MB.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    return;
  }

  // Image type validation
  if (file && !file.type.startsWith("image/")) {
    setSubmitError("Please select a valid image.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    return;
  }

  setSelectedImage(file);
  setSubmitError("");
};
  const removeImage = () => {
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
    coverImageUrl = await uploadPoetryImage(selectedImage);
  }

  const payload: PoetryFormData = {
    ...formData,
    title: formData.title.trim(),
    content: formData.content.trim(),
    author: formData.author.trim(),
    english_translation: formData.english_translation.trim(),
    slug: formData.slug.trim() || slugify(formData.title),
    cover_image: coverImageUrl,
  };

  if (poetry) {
    await updatePoetry(poetry.id, payload);
  } else {
    await createPoetry(payload);
    setFormData(initialFormData);
    setSelectedImage(null);
    setPreviewUrl("");
    setIsSlugManuallyEdited(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  onSuccess();
} catch (error: unknown) {
  setSubmitError(
    error instanceof Error
      ? error.message
      : "Unable to save poetry. Please try again.",
  );
} finally {
  setIsSubmitting(false);
}
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl space-y-6"
      noValidate
    >
      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div className="md:col-span-2">
      <label
        htmlFor="poetry-title"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Title <span className="text-red-600">*</span>
      </label>
      <input
        id="poetry-title"
        type="text"
        value={formData.title}
        onChange={handleTitleChange}
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? "poetry-title-error" : undefined}
        disabled={isSubmitting}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
      {errors.title && (
        <p id="poetry-title-error" className="mt-1 text-sm text-red-600">
          {errors.title}
        </p>
      )}
    </div>

    <div>
      <label
        htmlFor="poetry-slug"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Slug
      </label>
      <input
        id="poetry-slug"
        type="text"
        value={formData.slug}
        onChange={handleSlugChange}
        disabled={isSubmitting}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>

    <div>
      <label
        htmlFor="poetry-author"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Author <span className="text-red-600">*</span>
      </label>
      <input
        id="poetry-author"
        type="text"
        value={formData.author}
        onChange={(event) => handleTextChange("author", event.target.value)}
        aria-invalid={Boolean(errors.author)}
        aria-describedby={errors.author ? "poetry-author-error" : undefined}
        disabled={isSubmitting}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
      {errors.author && (
        <p id="poetry-author-error" className="mt-1 text-sm text-red-600">
          {errors.author}
        </p>
      )}
    </div>

    <div>
      <label
        htmlFor="poetry-category"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Category <span className="text-red-600">*</span>
      </label>
      <select
        id="poetry-category"
        value={formData.category}
        onChange={handleCategoryChange}
        aria-invalid={Boolean(errors.category)}
        aria-describedby={
          errors.category ? "poetry-category-error" : undefined
        }
        disabled={isSubmitting}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {errors.category && (
        <p id="poetry-category-error" className="mt-1 text-sm text-red-600">
          {errors.category}
        </p>
      )}
    </div>

    <div>
      <label
        htmlFor="poetry-status"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Status
      </label>
      <select
        id="poetry-status"
        value={formData.status}
        onChange={(event) =>
          setFormData((current) => ({
            ...current,
            status: event.target.value as PoetryFormData["status"],
          }))
        }
        disabled={isSubmitting}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>
  </div>

  <div>
    <label
      htmlFor="poetry-content"
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      Content <span className="text-red-600">*</span>
    </label>
    <textarea
      id="poetry-content"
      value={formData.content}
      onChange={(event) => handleTextChange("content", event.target.value)}
      aria-invalid={Boolean(errors.content)}
      aria-describedby={errors.content ? "poetry-content-error" : undefined}
      disabled={isSubmitting}
      rows={14}
      className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
    />
    {errors.content && (
      <p id="poetry-content-error" className="mt-1 text-sm text-red-600">
        {errors.content}
      </p>
    )}
  </div>

  <div>
    <label
      htmlFor="poetry-translation"
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      English Translation
    </label>
    <textarea
      id="poetry-translation"
      value={formData.english_translation}
      onChange={(event) =>
        handleTextChange("english_translation", event.target.value)
      }
      disabled={isSubmitting}
      rows={7}
      className="w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
    />
  </div>

  <div className="space-y-3">
    <label
      htmlFor="poetry-cover-image"
      className="block text-sm font-medium text-gray-700"
    >
      Cover Image
    </label>
    <input
      ref={fileInputRef}
      id="poetry-cover-image"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      disabled={isSubmitting}
      className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100"
    />

    {previewUrl && (
      <div className="relative w-full max-w-md overflow-hidden rounded-md border border-gray-200 bg-gray-50">
        <img
          src={previewUrl}
          alt="Cover image preview"
          className="h-52 w-full object-cover sm:h-64"
        />
        <button
          type="button"
          onClick={removeImage}
          disabled={isSubmitting}
          className="absolute right-3 top-3 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Remove image
        </button>
      </div>
    )}
  </div>

  <div className="flex items-center gap-3">
    <input
      id="poetry-featured"
      type="checkbox"
      checked={formData.featured}
      onChange={(event) =>
        setFormData((current) => ({
          ...current,
          featured: event.target.checked,
        }))
      }
      disabled={isSubmitting}
      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
    />
    <label
      htmlFor="poetry-featured"
      className="text-sm font-medium text-gray-700"
    >
      Feature this poetry
    </label>
  </div>

  <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
    <button
      type="button"
      onClick={onCancel}
      disabled={isSubmitting}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isSubmitting
        ? isEditMode
          ? "Updating..."
          : "Saving..."
        : isEditMode
          ? "Update Poetry"
          : "Save Poetry"}
    </button>
  </div>
</form>
  );
}