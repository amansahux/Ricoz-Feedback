import React from "react";
import { Link } from "react-router";
import { ArrowLeft, Download } from "lucide-react";

export default function DetailBreadcrumb({ feedbackId, onExportJson }) {
  return (
    <header className="sticky top-0 z-30 bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#EFE4D6]/50 px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Back link + Breadcrumb */}
      <div className="flex items-center gap-4 text-sm">
        <Link
          to="/feedback"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7d7461] hover:text-[#bb0028] transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back to feedback inbox</span>
        </Link>
        <span className="text-[#e1d8d3] hidden sm:inline">/</span>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#7d7461] font-inter">
          <span>Feedback</span>
          <span className="text-[#e1d8d3]">/</span>
          <span className="text-[#1f1b18] font-semibold">
            Response #{feedbackId?.substring(0, 6) || feedbackId}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExportJson}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-medium transition-colors shadow-xs cursor-pointer"
        >
          <Download size={14} />
          <span>Export JSON</span>
        </button>
      </div>
    </header>
  );
}
