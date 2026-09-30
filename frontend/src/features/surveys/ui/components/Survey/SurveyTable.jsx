import React from "react";
import SurveyTableRow from "./SurveyTableRow.jsx";

export default function SurveyTable({
  surveys = [],
  pagination = {},
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
  onShare,
  onDelete,
}) {
  const count = totalCount || pagination.total || surveys.length;
  const pages = totalPages || pagination.totalPages || 1;
  const page = currentPage || pagination.page || 1;

  return (
    <div className="bg-white border border-[#EFE4D6] rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FBF2EC]/80 border-b border-[#EFE4D6] text-[11px] font-semibold text-[#7d7461] tracking-wider uppercase font-inter">
              <th className="py-3.5 px-6">TITLE</th>
              <th className="py-3.5 px-4">STATUS</th>
              <th className="py-3.5 px-4">QUESTIONS</th>
              <th className="py-3.5 px-4">RESPONSES</th>
              <th className="py-3.5 px-4">CREATED</th>
              <th className="py-3.5 px-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE4D6]/60">
            {surveys.map((survey) => (
              <SurveyTableRow
                key={survey._id || survey.id || survey.slug}
                survey={survey}
                onShare={onShare}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="px-6 py-3.5 bg-[#FBF2EC]/40 border-t border-[#EFE4D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7d7461] font-inter">
        <span>
          Showing <strong className="text-[#1f1b18]">{surveys.length}</strong> of{" "}
          <strong className="text-[#1f1b18]">{count}</strong> surveys
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-2.5 py-1 rounded-lg border border-[#EFE4D6] bg-white text-[#1f1b18] hover:bg-[#FBF2EC] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
          >
            Previous
          </button>
          <span className="px-3 py-1 rounded-lg bg-[#bb0028] text-white font-medium text-xs shadow-2xs">
            {page} / {pages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page >= pages}
            className="px-2.5 py-1 rounded-lg border border-[#EFE4D6] bg-white text-[#1f1b18] hover:bg-[#FBF2EC] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
