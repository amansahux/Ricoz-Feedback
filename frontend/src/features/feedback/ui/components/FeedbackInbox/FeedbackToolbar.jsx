import React from "react";
import { Search, X, ChevronDown, ArrowUpDown, RotateCcw, Filter } from "lucide-react";

export default function FeedbackToolbar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedSentiment,
  setSelectedSentiment,
  selectedSource,
  setSelectedSource,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  hasActiveFilters,
  resetFilters,
}) {
  return (
    <section className="bg-white rounded-2xl border border-[#EFE4D6] p-4 space-y-3.5 shadow-xs">
      {/* Search & Selectors Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7461] pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, text, topic..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm font-inter rounded-xl bg-white border border-[#EFE4D6] text-[#1f1b18] placeholder:text-[#7d7461]/60 focus:outline-none focus:ring-1 focus:ring-[#bb0028] focus:border-[#bb0028] transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7461] hover:text-[#1f1b18] p-0.5 cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dropdown Filters Strip */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Status Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-medium font-inter bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] hover:border-[#7d7461] focus:outline-none focus:ring-1 focus:ring-[#bb0028] cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="open">Status: Open</option>
              <option value="in_progress">Status: In Progress</option>
              <option value="resolved">Status: Resolved</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461]"
            />
          </div>

          {/* Sentiment Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-medium font-inter bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] hover:border-[#7d7461] focus:outline-none focus:ring-1 focus:ring-[#bb0028] cursor-pointer"
            >
              <option value="all">Sentiment: All</option>
              <option value="positive">Sentiment: Positive</option>
              <option value="neutral">Sentiment: Neutral</option>
              <option value="negative">Sentiment: Negative</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461]"
            />
          </div>

          {/* Source Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-medium font-inter bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] hover:border-[#7d7461] focus:outline-none focus:ring-1 focus:ring-[#bb0028] cursor-pointer"
            >
              <option value="all">Source: All</option>
              <option value="link">Source: Link</option>
              <option value="qr">Source: QR</option>
              <option value="widget">Source: Widget</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461]"
            />
          </div>

          {/* Rating Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-medium font-inter bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] hover:border-[#7d7461] focus:outline-none focus:ring-1 focus:ring-[#bb0028] cursor-pointer"
            >
              <option value="all">Rating: All</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461]"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 text-xs font-semibold font-inter bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] hover:border-[#7d7461] focus:outline-none focus:ring-1 focus:ring-[#bb0028] cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="rating-high">Sort: Highest rating</option>
              <option value="rating-low">Sort: Lowest rating</option>
            </select>
            <ArrowUpDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461]"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-[#EFE4D6] pt-3 text-xs font-inter">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[#7d7461] text-[11px] uppercase tracking-wider font-semibold">
              Active filters:
            </span>

            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F9DFB9] text-[#746243] font-medium border border-[#EFE4D6]">
                <span>Status: {selectedStatus === "in_progress" ? "In Progress" : selectedStatus}</span>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("all")}
                  className="hover:text-[#bb0028] cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedSentiment !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6]">
                <span>Sentiment: {selectedSentiment}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSentiment("all")}
                  className="hover:text-[#bb0028] cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedSource !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6]">
                <span>Source: {selectedSource.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => setSelectedSource("all")}
                  className="hover:text-[#bb0028] cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedRating !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6]">
                <span>Rating: {selectedRating}★</span>
                <button
                  type="button"
                  onClick={() => setSelectedRating("all")}
                  className="hover:text-[#bb0028] cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBF2EC] text-[#1f1b18] font-medium border border-[#EFE4D6]">
                <span>Query: "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-[#bb0028] cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[#bb0028] hover:underline font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset all</span>
          </button>
        </div>
      )}
    </section>
  );
}
