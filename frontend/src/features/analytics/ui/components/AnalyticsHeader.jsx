import React from "react";
import { Download } from "lucide-react";

export default function AnalyticsHeader({
  range = "30d",
  onRangeChange,
  onExportReport,
  isExporting = false,
}) {
  const ranges = [
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
    { label: "90d", value: "90d" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#EFE4D6]/60">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-[#bb0028] uppercase tracking-widest font-mono-tag">
          ANALYTICS
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-epilogue font-semibold text-[#1f1b18] tracking-tight leading-tight">
          Insights &amp; trends
        </h1>
        <p className="text-sm text-[#6e5c3e] font-inter">
          Understand how customers are experiencing your business in real time.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
        {/* Segmented Date Range Selector */}
        <div
          className="inline-flex p-1 bg-white rounded-xl border border-[#EFE4D6] shadow-xs"
          role="group"
          aria-label="Date Range Selector"
        >
          {ranges.map((r) => {
            const isActive = range === r.value;
            return (
              <button
                key={r.value}
                onClick={() => onRangeChange && onRangeChange(r.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-inter transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#F9DFB9] text-[#1f1b18] font-semibold shadow-xs border border-[#DBC39F]"
                    : "text-[#6e5c3e] hover:text-[#1f1b18] font-medium"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Export Report CTA */}
        {onExportReport && (
          <button
            onClick={onExportReport}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#EFE4D6] bg-white text-[#1f1b18] font-inter text-xs sm:text-sm font-medium hover:bg-[#FBF2EC] transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download size={16} className="text-[#6e5c3e]" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        )}
      </div>
    </div>
  );
}
