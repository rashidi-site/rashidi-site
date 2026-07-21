import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Quote } from "../../types/quotes";

export type QuoteStatusFilter = Quote["status"] | "";
export type QuoteFeaturedFilter = "all" | "featured" | "standard";

interface QuoteFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedStatus?: QuoteStatusFilter;
  setSelectedStatus?: (value: QuoteStatusFilter) => void;
  selectedFeatured?: QuoteFeaturedFilter;
  setSelectedFeatured?: (value: QuoteFeaturedFilter) => void;
  categories: string[];
}

export default function QuoteFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus = "",
  setSelectedStatus,
  selectedFeatured = "all",
  setSelectedFeatured,
  categories,
}: QuoteFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory.length > 0 ||
    selectedStatus.length > 0 ||
    selectedFeatured !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus?.("");
    setSelectedFeatured?.("all");
  };

  return (
    <section
      className="rounded-2xl border border-amber-500/10 bg-slate-900/50 p-4 backdrop-blur-xl sm:p-5"
      aria-label="Filter quotes"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="quote-search" className="mb-2 block text-sm font-medium text-amber-100/80">
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400/60"
              aria-hidden="true"
            />
            <input
              id="quote-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search quote, author, or category..."
              className="w-full rounded-xl border border-amber-500/20 bg-slate-950/50 py-3 pl-12 pr-11 text-sm text-white placeholder:text-slate-500 transition-colors outline-none hover:border-amber-500/35 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:items-end">
          <div className="min-w-40">
            <label htmlFor="quote-category-filter" className="mb-2 block text-sm font-medium text-amber-100/80">
              Category
            </label>
            <select
              id="quote-category-filter"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-sm text-white transition-colors outline-none hover:border-amber-500/35 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            >
              <option value="">All categories</option>
              {[...new Set(categories)]
                .sort((a, b) => a.localeCompare(b))
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {setSelectedStatus && (
            <div className="min-w-36">
              <label htmlFor="quote-status-filter" className="mb-2 block text-sm font-medium text-amber-100/80">
                Status
              </label>
              <select
                id="quote-status-filter"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as QuoteStatusFilter)}
                className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-sm text-white transition-colors outline-none hover:border-amber-500/35 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          )}

          {setSelectedFeatured && (
            <div className="min-w-36">
              <label htmlFor="quote-featured-filter" className="mb-2 block text-sm font-medium text-amber-100/80">
                Visibility
              </label>
              <select
                id="quote-featured-filter"
                value={selectedFeatured}
                onChange={(event) => setSelectedFeatured(event.target.value as QuoteFeaturedFilter)}
                className="w-full cursor-pointer rounded-xl border border-amber-500/20 bg-slate-950/50 px-3 py-3 text-sm text-white transition-colors outline-none hover:border-amber-500/35 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="all">All entries</option>
                <option value="featured">Featured only</option>
                <option value="standard">Standard only</option>
              </select>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-500/20 px-4 py-3 text-sm font-medium text-amber-200 transition-colors hover:border-amber-400/50 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}
