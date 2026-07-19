import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ImageOff,
  Pencil,
  Trash2,
} from "lucide-react";
import { Poetry } from "../../types/poetry";

type SortField =
  | "title"
  | "category"
  | "status"
  | "featured"
  | "likes"
  | "views"
  | "created_at";

type SortDirection = "ascending" | "descending";

interface PoetryTableProps {
  poems: Poetry[];
  loading?: boolean;
  onEdit: (poem: Poetry) => void;
  onDelete: (poem: Poetry) => void;
  onPreview?: (poem: Poetry) => void;
}

interface SortableColumnProps {
  field: SortField;
  label: string;
  activeField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

function formatDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function SortableColumn({
  field,
  label,
  activeField,
  direction,
  onSort,
}: SortableColumnProps) {
  const isActive = activeField === field;
  const Icon = direction === "ascending" ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1.5 rounded-lg text-left text-xs font-semibold uppercase tracking-wider text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      aria-label={`Sort by ${label}`}
      aria-pressed={isActive}
    >
      {label}
      {isActive && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
    </button>
  );
}

function StatusBadge({ status }: Pick<Poetry, "status">) {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        isPublished
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-amber-400/20 bg-amber-400/10 text-amber-300"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function FeaturedBadge({ featured }: Pick<Poetry, "featured">) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        featured
          ? "border-amber-400/30 bg-amber-400/15 text-amber-300"
          : "border-slate-600 bg-slate-800 text-slate-300"
      }`}
    >
      {featured ? "Featured" : "Standard"}
    </span>
  );
}

function PoetryCover({ poetry }: { poetry: Poetry }) {
  if (!poetry.cover_image) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/10 bg-slate-800/80 text-amber-400/50">
        <ImageOff className="h-4 w-4" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={poetry.cover_image}
      alt={poetry.title}
      decoding="async"
      loading="lazy"
      className="h-11 w-11 shrink-0 rounded-xl border border-amber-500/15 object-cover"
    />
  );
}

function TableSkeleton() {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full table-auto">
          <thead className="border-b border-amber-500/10 bg-amber-500/5">
            <motion.tr>
              {["Title", "Category", "Status", "Featured", "Likes", "Views", "Date", "Actions"].map(
                (column) => (
                  <th
                    key={column}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-amber-400"
                  >
                    {column}
                  </th>
                ),
              )}
            </motion.tr>
          </thead>
          <tbody className="divide-y divide-amber-500/10">
            {skeletonRows.map((index) => (
              <tr key={index}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />
                    <div className="space-y-2">
                      <div className="h-4 w-36 animate-pulse rounded bg-slate-800" />
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: 7 }, (_, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {skeletonRows.map((index) => (
          <div
            key={index}
            className="space-y-4 rounded-2xl border border-amber-500/10 bg-slate-900/40 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-800" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
              </div>
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function PoetryTable({
  poems,
  loading = false,
  onEdit,
  onDelete,
  onPreview,
}: PoetryTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("descending");

  const sortedPoetry = useMemo(() => {
    return [...poems].sort((firstPoetry, secondPoetry) => {
      const firstValue = firstPoetry[sortField];
      const secondValue = secondPoetry[sortField];

      if (typeof firstValue === "boolean" && typeof secondValue === "boolean") {
        const comparison = Number(firstValue) - Number(secondValue);
        return sortDirection === "ascending" ? comparison : -comparison;
      }

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        const comparison = firstValue - secondValue;
        return sortDirection === "ascending" ? comparison : -comparison;
      }
      if (sortField === "created_at") {
        const comparison =
            new Date(firstPoetry.created_at).getTime() -
            new Date(secondPoetry.created_at).getTime();

        return sortDirection === "ascending"
            ? comparison
            : -comparison;
      }
      const comparison = String(firstValue).localeCompare(String(secondValue));
      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [poems, sortDirection, sortField]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((currentDirection) =>
        currentDirection === "ascending" ? "descending" : "ascending",
      );
      return;
    }

    setSortField(field);
    setSortDirection("ascending");
  };

  if (loading) {
    return (
      <div
        className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl"
        aria-label="Loading poetry"
        aria-busy="true"
      >
        <TableSkeleton />
      </div>
    );
  }

  if (poems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-500/20 bg-slate-900/40 px-6 py-16 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-white">کوئی شاعری موجود نہیں</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
          نئی شاعری شامل کریں یا فلٹر تبدیل کریں۔
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full table-auto">
          <thead className="border-b border-amber-500/10 bg-amber-500/5">
            <motion.tr
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="title"
                  label="Poetry"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="category"
                  label="Category"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="status"
                  label="Status"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="featured"
                  label="Visibility"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="likes"
                  label="Likes"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="views"
                  label="Views"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn
                  field="created_at"
                  label="Created"
                  activeField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-amber-400">
                Actions
              </th>
            </motion.tr>
          </thead>

          <tbody className="divide-y divide-amber-500/10">
            {sortedPoetry.map((poetryItem) => (
              <tr
                key={poetryItem.id}
                className="transition-colors hover:bg-amber-500/5"
              >
                <td className="px-5 py-4">
                  <div className="flex min-w-60 items-center gap-3">
                    <PoetryCover poetry={poetryItem} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-amber-200"
                    style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}>
                        {poetryItem.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {poetryItem.author}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-300">
                  {poetryItem.category}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={poetryItem.status} />
                </td>
                <td className="px-5 py-4">
                  <FeaturedBadge featured={poetryItem.featured} />
                </td>
                <td className="px-5 py-4 text-sm tabular-nums text-slate-300">
                  {poetryItem.likes.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-sm tabular-nums text-slate-300">
                  {poetryItem.views.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-sm text-slate-400">
                  {formatDate(poetryItem.created_at)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {onPreview && (
                      <button
                        type="button"
                        onClick={() => onPreview(poetryItem)}
                        className="rounded-lg p-2 text-amber-300 transition-colors hover:bg-amber-500/15 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        aria-label={`Preview ${poetryItem.title}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit(poetryItem)}
                      className="rounded-lg p-2 text-sky-300 transition-colors hover:bg-sky-400/10 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                      aria-label={`Edit ${poetryItem.title}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(poetryItem)}
                      className="rounded-lg p-2 text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      aria-label={`Delete ${poetryItem.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {sortedPoetry.map((poetryItem) => (
          <article
            key={poetryItem.id}
            className="rounded-2xl border border-amber-500/10 bg-slate-950/30 p-4"
          >
            <div className="flex items-start gap-3">
              <PoetryCover poetry={poetryItem} />
              <div className="min-w-0 flex-1">
                <motion.h2 
                  className="truncate font-semibold text-amber-200" 
                  style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {poetryItem.title}
                </motion.h2>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {poetryItem.author}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {onPreview && (
                  <button
                    type="button"
                    onClick={() => onPreview(poetryItem)}
                    className="rounded-lg p-2 text-amber-300 transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label={`Preview ${poetryItem.title}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(poetryItem)}
                  className="rounded-lg p-2 text-sky-300 transition-colors hover:bg-sky-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  aria-label={`Edit ${poetryItem.title}`}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(poetryItem)}
                  className="rounded-lg p-2 text-red-300 transition-colors hover:bg-red-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  aria-label={`Delete ${poetryItem.title}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge status={poetryItem.status} />
              <FeaturedBadge featured={poetryItem.featured} />
              <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                {poetryItem.category}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-amber-500/10 pt-4 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Likes</dt>
                <dd className="mt-1 font-medium tabular-nums text-slate-200">
                  {poetryItem.likes.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Views</dt>
                <dd className="mt-1 font-medium tabular-nums text-slate-200">
                  {poetryItem.views.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Created</dt>
                <dd className="mt-1 font-medium text-slate-200">
                  {formatDate(poetryItem.created_at)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}