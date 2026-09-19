import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeedbackPagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}) {
  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages = [];
    const delta = 1;

    // Always include first page
    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    // Always include last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between px-1 pt-2 pb-4">
      {/* Left: Page info */}
      <span className="text-xs text-[#7d7461] font-inter">
        Page{" "}
        <span className="font-semibold text-[#1f1b18]">{currentPage}</span> of{" "}
        <span className="font-semibold text-[#1f1b18]">{totalPages}</span>
        <span className="text-[#7d7461]/70 ml-1">
          ({totalCount} total)
        </span>
      </span>

      {/* Right: Page controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#7d7461] hover:text-[#1f1b18] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-xs text-[#7d7461] select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 rounded-lg text-xs font-medium font-inter transition cursor-pointer ${
                page === currentPage
                  ? "bg-[#bb0028] text-white shadow-sm border border-[#bb0028]"
                  : "bg-white border border-[#EFE4D6] text-[#1f1b18] hover:bg-[#FBF2EC] hover:border-[#7d7461]"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#7d7461] hover:text-[#1f1b18] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
