import React from "react";
import { Link } from "react-router";
import { Plus, Download, SlidersHorizontal, Radio } from "lucide-react";

export default function FeedbackHeader({
  totalResponses = 1428,
  needAttentionCount = 38,
  onExportReport,
}) {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#EFE4D6]">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#bb0028] font-mono-tag">
            INBOX
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EFE4D6]"></span>
          <span className="text-xs text-[#7d7461] font-inter flex items-center gap-1">
            <Radio size={12} className="text-emerald-700 animate-pulse" />
            Live telemetry
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-epilogue font-semibold text-[#1f1b18] tracking-tight">
          Customer feedback
        </h1>
        <p className="text-xs sm:text-sm text-[#7d7461] mt-1 font-inter">
          View and manage everything your customers are saying.
        </p>
      </div>

      {/* Badges & Actions */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Total Collected Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#EFE4D6] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#635b4a]"></span>
          <span className="text-xs font-medium text-[#1f1b18] font-inter">
            {totalResponses.toLocaleString()} responses collected
          </span>
        </div>

        {/* Needs Attention Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffdad8]/50 border border-[#bb0028]/20 text-[#bb0028] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#bb0028] animate-ping inline-flex"></span>
          <span className="text-xs font-semibold font-inter">
            {needAttentionCount} need attention
          </span>
        </div>

        {/* Export Report Action */}
        <button
          type="button"
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-medium transition cursor-pointer shadow-2xs"
          title="Export report as JSON"
        >
          <Download size={15} />
          <span>Export Report</span>
        </button>

        {/* Create Survey Action */}
        <Link
          to="/surveys/create"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          <span>Create survey</span>
        </Link>
      </div>
    </section>
  );
}
