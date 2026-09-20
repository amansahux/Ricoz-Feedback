import React from "react";
import { BarChart3, Plus } from "lucide-react";
import { Link } from "react-router";

export default function AnalyticsEmptyState({ onExpandRange }) {
  return (
    <div className="w-full py-16 sm:py-20 px-6 rounded-2xl bg-white border border-[#EFE4D6] flex flex-col items-center justify-center text-center shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e] mb-4 border border-[#EFE4D6]">
        <BarChart3 size={32} />
      </div>
      <h2 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18]">
        No feedback responses yet
      </h2>
      <p className="text-xs sm:text-sm text-[#6e5c3e] max-w-md mt-2 mb-6 font-inter leading-relaxed">
        There is not enough customer telemetry to construct analytical trends for this time period. Create and share surveys to gather real-time insights.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/surveys/create"
          className="px-4 py-2.5 rounded-xl bg-[#bb0028] text-white font-inter text-xs sm:text-sm font-semibold hover:bg-[#a10022] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Launch new survey</span>
        </Link>
        {onExpandRange && (
          <button
            onClick={() => onExpandRange("90d")}
            className="px-4 py-2.5 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6] text-[#1f1b18] font-inter text-xs sm:text-sm font-medium hover:bg-[#F6ECE7] transition-colors cursor-pointer"
          >
            Expand to 90 Days
          </button>
        )}
      </div>
    </div>
  );
}
