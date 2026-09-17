import React from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ShareHeader({
  surveyTitle = "Post-purchase experience",
  isPublished = true,
  responseCount = 1428,
  completionRate = "89.4%",
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-[#EFE4D6] pb-6">
      {/* Navigation Back Link */}
      <div>
        <Link
          to="/surveys"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#7d7461] hover:text-[#bb0028] transition-colors group font-inter"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          <span>All surveys</span>
        </Link>
      </div>

      {/* Editorial Page Header with Telemetry Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#bb0028] font-mono-tag">
            SHARE & DISTRIBUTE
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-epilogue font-semibold text-[#1f1b18] tracking-tight leading-tight">
            Your survey is live
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-base sm:text-lg font-epilogue font-semibold text-[#5d3f3e]">
              {surveyTitle}
            </span>
            {isPublished ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF2DB] text-[#746243] border border-[#E6D7C3]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Draft
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#7d7461] max-w-xl font-inter mt-1 leading-relaxed">
            Your survey is ready to collect customer feedback. Choose a way to share it across your
            operational touchpoints.
          </p>
        </div>

        {/* Quick Telemetry Mini Stat */}
        <div className="flex items-center gap-3 sm:gap-4 bg-white p-3 rounded-2xl border border-[#EFE4D6] shadow-xs shrink-0 self-start md:self-auto">
          <div className="flex flex-col px-2">
            <span className="text-[10px] font-medium text-[#7d7461] uppercase tracking-wider font-mono-tag">
              Responses
            </span>
            <span className="text-lg sm:text-xl font-epilogue font-bold text-[#1f1b18]">
              {responseCount}
            </span>
          </div>
          <div className="w-px h-8 bg-[#EFE4D6]"></div>
          <div className="flex flex-col px-2">
            <span className="text-[10px] font-medium text-[#7d7461] uppercase tracking-wider font-mono-tag">
              Completion Rate
            </span>
            <span className="text-lg sm:text-xl font-epilogue font-bold text-emerald-700">
              {completionRate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
