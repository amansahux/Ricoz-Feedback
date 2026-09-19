import React from "react";
import { Search, X, ChevronDown, ArrowUpDown } from "lucide-react";

export default function CustomerToolbar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showingCount,
  totalCount,
}) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#EFE4D6] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Field */}
      <div className="relative w-full md:w-96">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7461]/70 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer by name or email..."
          className="w-full h-10 pl-10 pr-9 bg-[#FBF2EC]/50 border border-[#EFE4D6] rounded-xl text-xs sm:text-sm font-inter text-[#1f1b18] placeholder:text-[#7d7461]/60 focus:bg-white focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7461] hover:text-[#1f1b18] p-1 rounded-full cursor-pointer"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Trailing Count & Sort Selector */}
      <div className="flex items-center justify-between md:justify-end gap-5 flex-wrap">
        <span className="text-xs font-inter text-[#7d7461] order-2 md:order-1">
          Showing <span className="font-semibold text-[#1f1b18]">{showingCount}</span> of{" "}
          <span className="font-semibold text-[#1f1b18]">{totalCount}</span> customers
        </span>

        <div className="flex items-center gap-2 order-1 md:order-2">
          <label className="text-xs font-inter text-[#7d7461] hidden sm:inline" htmlFor="sortDropdown">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sortDropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 pl-3.5 pr-8 bg-white border border-[#EFE4D6] rounded-xl text-xs font-medium font-inter text-[#1f1b18] appearance-none focus:outline-none focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] cursor-pointer transition-colors shadow-2xs hover:border-[#cfc4b6]"
            >
              <option value="recent">Recently active</option>
              <option value="most_feedback">Most feedback</option>
              <option value="high_rating">Highest rating</option>
              <option value="low_rating">Lowest rating</option>
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
