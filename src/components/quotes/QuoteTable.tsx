import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, ImageOff, Pencil, Trash2 } from "lucide-react";
import type { Quote } from "../../types/quotes";

type SortField = "quote" | "category" | "status" | "featured" | "likes" | "views" | "created_at";
type SortDirection = "ascending" | "descending";

interface QuoteTableProps {
  quotes: Quote[];
  loading?: boolean;
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
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

function SortableColumn({ field, label, activeField, direction, onSort }: SortableColumnProps) {
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

function StatusBadge({ status }: Pick<Quote, "status">) {
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

function FeaturedBadge({ featured }: Pick<Quote, "featured">) {
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

function QuoteCover({ quote }: { quote: Quote }) {
  if (!quote.cover_image) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/10 bg-slate-800/80 text-amber-400/50">
        <ImageOff className="h-4 w-4" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={quote.cover_image}
      alt={quote.quote}
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
              {['Quote', 'Category', 'Status', 'Featured', 'Likes', 'Views', 'Date', 'Actions'].map((column) => (
                <th key={column} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {column}
                </th>
              ))}
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
          <div key={index} className="space-y-4 rounded-2xl border border-amber-500/10 bg-slate-900/40 p-4">
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

export default function QuoteTable({ quotes, loading = false, onEdit, onDelete }: QuoteTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("descending");

  const sortedQuotes = useMemo(() => {
    return [...quotes].sort((firstQuote, secondQuote) => {
      const firstValue = firstQuote[sortField];
      const secondValue = secondQuote[sortField];

      if (typeof firstValue === "boolean" && typeof secondValue === "boolean") {
        const comparison = Number(firstValue) - Number(secondValue);
        return sortDirection === "ascending" ? comparison : -comparison;
      }

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        const comparison = firstValue - secondValue;
        return sortDirection === "ascending" ? comparison : -comparison;
      }

      if (sortField === "created_at") {
        const comparison = new Date(firstQuote.created_at).getTime() - new Date(secondQuote.created_at).getTime();
        return sortDirection === "ascending" ? comparison : -comparison;
      }

      const comparison = String(firstValue).localeCompare(String(secondValue));
      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [quotes, sortDirection, sortField]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((currentDirection) => (currentDirection === "ascending" ? "descending" : "ascending"));
      return;
    }

    setSortField(field);
    setSortDirection("ascending");
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl" aria-label="Loading quotes" aria-busy="true">
        <TableSkeleton />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-500/20 bg-slate-900/40 px-6 py-16 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-white">No quotes yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Add a new quote or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/10 bg-slate-900/50 backdrop-blur-xl">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full table-auto">
          <thead className="border-b border-amber-500/10 bg-amber-500/5">
            <motion.tr initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="quote" label="Quote" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="category" label="Category" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="status" label="Status" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="featured" label="Featured" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="likes" label="Likes" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="views" label="Views" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left">
                <SortableColumn field="created_at" label="Date" activeField={sortField} direction={sortDirection} onSort={handleSort} />
              </th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-amber-400">Actions</th>
            </motion.tr>
          </thead>
          <tbody className="divide-y divide-amber-500/10">
            {sortedQuotes.map((quote) => (
              <tr key={quote.id} className="transition-colors hover:bg-slate-800/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <QuoteCover quote={quote} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{quote.quote}</p>
                      <p className="mt-1 text-sm text-slate-400">{quote.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-300">{quote.category}</td>
                <td className="px-5 py-4"><StatusBadge status={quote.status} /></td>
                <td className="px-5 py-4"><FeaturedBadge featured={quote.featured} /></td>
                <td className="px-5 py-4 text-sm text-slate-300">{quote.likes}</td>
                <td className="px-5 py-4 text-sm text-slate-300">{quote.views}</td>
                <td className="px-5 py-4 text-sm text-slate-400">{formatDate(quote.created_at)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onEdit(quote)} className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition-colors hover:bg-amber-500/20" aria-label={`Edit ${quote.quote}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onDelete(quote)} className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20" aria-label={`Delete ${quote.quote}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {sortedQuotes.map((quote) => (
          <div key={quote.id} className="rounded-2xl border border-amber-500/10 bg-slate-900/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <QuoteCover quote={quote} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{quote.quote}</p>
                  <p className="mt-1 text-sm text-slate-400">{quote.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onEdit(quote)} className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300 transition-colors hover:bg-amber-500/20" aria-label={`Edit ${quote.quote}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onDelete(quote)} className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition-colors hover:bg-red-500/20" aria-label={`Delete ${quote.quote}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <StatusBadge status={quote.status} />
              <FeaturedBadge featured={quote.featured} />
              <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300">{quote.category}</span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
              <span>{quote.likes} likes</span>
              <span>{quote.views} views</span>
              <span>{formatDate(quote.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
