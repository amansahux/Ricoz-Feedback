import React from "react";
import { SearchX, RotateCcw } from "lucide-react";

export default function FeedbackNoResults({ searchQuery, onResetFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center mb-5 border border-[#EFE4D6]">
        <SearchX size={30} className="text-[#7d7461]" />
      </div>

      {/* Text */}
      <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
        No matching results
      </h2>
      <p className="text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
        {searchQuery ? (
          <>
            No feedback responses match <strong>"{searchQuery}"</strong> with
            the current filters applied. Try broadening your search or clearing
            filters.
          </>
        ) : (
          <>
            No feedback responses match the current filter criteria. Try
            adjusting or resetting your filters.
          </>
        )}
      </p>

      {/* Reset Filters */}
      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-sm font-medium transition-colors cursor-pointer shadow-xs"
      >
        <RotateCcw size={16} />
        <span>Reset all filters</span>
      </button>
    </div>
  );
}
