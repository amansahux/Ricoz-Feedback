import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 10,
  onPageChange,
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-1 text-xs font-inter text-[#7d7461]">
      <div>
        Showing <span className="font-semibold text-[#1f1b18]">{startItem}</span> to{" "}
        <span className="font-semibold text-[#1f1b18]">{endItem}</span> of{" "}
        <span className="font-semibold text-[#1f1b18]">{totalCount}</span> customers
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#EFE4D6] bg-white text-[#1f1b18] hover:bg-[#FBF2EC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="px-3 py-1 font-semibold text-[#1f1b18] bg-white border border-[#EFE4D6] rounded-lg shadow-2xs">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#EFE4D6] bg-white text-[#1f1b18] hover:bg-[#FBF2EC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
