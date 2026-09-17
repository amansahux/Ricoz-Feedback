import React from "react";

export default function SurveyHeader({ totalSurveys = 0, totalResponses = 0, avgCsat = "94.2%" }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[#EFE4D6]/60">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#bb0028] uppercase tracking-widest font-mono-tag">
            SURVEYS
          </span>
          <span className="w-1 h-1 rounded-full bg-[#d1c5b0]"></span>
          <span className="text-xs text-[#7d7461] font-medium">Campaign Fleet</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-epilogue font-semibold text-[#1f1b18] tracking-tight leading-tight">
          Your feedback surveys
        </h1>
        <p className="text-sm text-[#6e5c3e] max-w-2xl font-inter leading-relaxed">
          Create, manage, publish, and share surveys to collect customer feedback and elevate sentiment intelligence into enterprise action.
        </p>
      </div>

      {/* Quick Summary Metrics Bar */}
      <div className="flex items-center gap-2 sm:gap-4 bg-white p-2.5 sm:p-3 rounded-xl border border-[#EFE4D6] shadow-xs shrink-0 self-start lg:self-auto">
        <div className="px-3 py-1 border-r border-[#EFE4D6] flex flex-col">
          <span className="text-[11px] font-medium text-[#7d7461] uppercase tracking-wider">
            Active Surveys
          </span>
          <span className="text-lg sm:text-xl font-epilogue font-bold text-[#1f1b18]">
            {totalSurveys}
          </span>
        </div>
        <div className="px-3 py-1 border-r border-[#EFE4D6] flex flex-col">
          <span className="text-[11px] font-medium text-[#7d7461] uppercase tracking-wider">
            Total Verbatims
          </span>
          <span className="text-lg sm:text-xl font-epilogue font-bold text-[#1f1b18]">
            {totalResponses}
          </span>
        </div>
        <div className="px-3 py-1 flex flex-col">
          <span className="text-[11px] font-medium text-[#7d7461] uppercase tracking-wider">
            Avg CSAT
          </span>
          <span className="text-lg sm:text-xl font-epilogue font-bold text-emerald-700">
            {avgCsat}
          </span>
        </div>
      </div>
    </div>
  );
}
