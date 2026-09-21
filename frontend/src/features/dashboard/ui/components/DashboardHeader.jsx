import React from "react";
import { Download, Plus, Calendar, Activity } from "lucide-react";
import { Link } from "react-router";

export default function DashboardHeader({
  userName = "Aman",
  range = "30d",
  onRangeChange,
  onExportReport,
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedDateRange = () => {
    const now = new Date();
    const days = range === "12m" ? 365 : range === "90d" ? 90 : 30;
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const formatOpts = { month: "short", day: "numeric" };
    return `${past.toLocaleDateString("en-US", formatOpts)} – ${now.toLocaleDateString("en-US", { ...formatOpts, year: "numeric" })}`;
  };

  return (
    <div className="flex flex-col gap-5 pb-2">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Section Tag & Greeting */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono-tag font-bold tracking-wider text-[#6e5c3e] uppercase">
              OVERVIEW
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#bb0028] animate-pulse"></span>
            <span className="text-xs text-[#7d7461] font-inter font-medium flex items-center gap-1">
              Telemetry Connected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
            {getGreeting()}, {userName}.
          </h1>
          <p className="text-xs sm:text-sm text-[#5d3f3e] mt-1 font-inter">
            Here’s how your customer experience is performing over the last {range === '12m' ? '12 months' : range === '90d' ? '90 days' : '30 days'}.
          </p>
        </div>

        {/* Right: Date Range Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Quick Range Pills */}
          <div className="flex items-center bg-white border border-[#EFE4D6] rounded-xl p-1 shadow-xs">
            <button
              onClick={() => onRangeChange("30d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-inter font-medium transition-all cursor-pointer ${
                range === "30d"
                  ? "bg-[#FBF2EC] text-[#1f1b18] font-semibold border border-[#E7BCBB]/60 shadow-xs"
                  : "text-[#7d7461] hover:text-[#1f1b18]"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => onRangeChange("90d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-inter font-medium transition-all cursor-pointer ${
                range === "90d"
                  ? "bg-[#FBF2EC] text-[#1f1b18] font-semibold border border-[#E7BCBB]/60 shadow-xs"
                  : "text-[#7d7461] hover:text-[#1f1b18]"
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => onRangeChange("12m")}
              className={`px-3 py-1.5 rounded-lg text-xs font-inter font-medium transition-all cursor-pointer ${
                range === "12m"
                  ? "bg-[#FBF2EC] text-[#1f1b18] font-semibold border border-[#E7BCBB]/60 shadow-xs"
                  : "text-[#7d7461] hover:text-[#1f1b18]"
              }`}
            >
              12 Months
            </button>
          </div>

          {/* Date Label Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EFE4D6] rounded-xl text-xs font-inter font-medium text-[#1f1b18] shadow-xs">
            <Calendar size={14} className="text-[#7d7461]" />
            <span>{formattedDateRange()}</span>
          </div>

          {/* Export Report CTA */}
          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-inter font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download size={14} className="text-[#6e5c3e]" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          {/* Primary Create Survey CTA */}
          <Link
            to="/surveys/create"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#bb0028] hover:bg-[#92001d] text-white text-xs font-inter font-semibold shadow-sm shadow-[#bb0028]/20 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Create survey</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
