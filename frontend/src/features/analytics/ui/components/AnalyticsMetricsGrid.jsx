import React from "react";
import { MessageSquare, Gauge, Smile, Compass, TrendingUp, TrendingDown, Star } from "lucide-react";

export default function AnalyticsMetricsGrid({ summary = {} }) {
  const {
    totalResponses = { value: 0, changePercent: 0 },
    nps = { value: null, promoterPercent: 0, detractorPercent: 0, changePercent: 0 },
    csat = { value: null, averageRating: null, changePercent: 0 },
    ces = { value: null, scale: 7, effortlessPercent: 0, changePercent: 0 },
  } = summary;

  // Helpers for change percent badges
  const renderChangeBadge = (changePercent, label = "vs previous period") => {
    if (changePercent === null || changePercent === undefined) return null;
    const isPositive = changePercent > 0;
    const isNeutral = changePercent === 0;

    return (
      <div className="flex items-center gap-1.5 mt-2">
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded border ${
            isPositive
              ? "text-[#1C7332] bg-[#EBF7ED] border-[#D2EED7]"
              : isNeutral
              ? "text-[#6e5c3e] bg-[#FBF2EC] border-[#EFE4D6]"
              : "text-[#bb0028] bg-rose-50 border-rose-200"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} className="mr-0.5" />
          ) : isNeutral ? null : (
            <TrendingDown size={12} className="mr-0.5" />
          )}
          {isPositive ? `+${changePercent}%` : `${changePercent}%`}
        </span>
        <span className="text-xs text-[#6e5c3e] font-inter">{label}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Responses */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] hover:border-[#dbc39f] transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6e5c3e] uppercase tracking-wider font-inter">
            Total Responses
          </span>
          <span className="w-8 h-8 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
            <MessageSquare size={16} />
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
            {totalResponses.value != null ? totalResponses.value.toLocaleString() : "0"}
          </div>
          {renderChangeBadge(totalResponses.changePercent)}
        </div>
      </div>

      {/* 2. Net Promoter Score */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] hover:border-[#dbc39f] transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6e5c3e] uppercase tracking-wider font-inter">
            Net Promoter Score
          </span>
          <span className="w-8 h-8 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
            <Gauge size={16} />
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
            {nps.value !== null && nps.value !== undefined
              ? nps.value > 0
                ? `+${nps.value}`
                : `${nps.value}`
              : "—"}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs text-[#6e5c3e] truncate font-inter">
              <span className="text-[#1C7332] font-semibold">{nps.promoterPercent || 0}%</span> Promoters ·{" "}
              <span className="text-[#bb0028] font-semibold">{nps.detractorPercent || 0}%</span> Detractors
            </span>
          </div>
        </div>
      </div>

      {/* 3. CSAT (Customer Satisfaction) */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] hover:border-[#dbc39f] transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6e5c3e] uppercase tracking-wider font-inter">
            Customer Satisfaction
          </span>
          <span className="w-8 h-8 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
            <Smile size={16} />
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
            {csat.value !== null && csat.value !== undefined ? `${csat.value}%` : "—"}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center text-xs font-medium text-[#1f1b18] font-inter">
              <Star size={13} className="text-amber-500 fill-amber-500 mr-1" />
              {csat.averageRating != null ? `${csat.averageRating} avg rating` : "5.0 scale"}
            </span>
            <span className="text-xs text-[#6e5c3e] font-inter">across surveys</span>
          </div>
        </div>
      </div>

      {/* 4. CES (Customer Effort Score) */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] hover:border-[#dbc39f] transition-all duration-200 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6e5c3e] uppercase tracking-wider font-inter">
            Customer Effort Score
          </span>
          <span className="w-8 h-8 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
            <Compass size={16} />
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
            {ces.value !== null && ces.value !== undefined ? (
              <>
                {ces.value} <span className="text-sm font-normal text-[#6e5c3e] font-inter">/ 7</span>
              </>
            ) : (
              "—"
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs text-[#6e5c3e] font-inter">
              <strong className="font-semibold text-[#1f1b18]">{ces.effortlessPercent || 0}%</strong> effortless rating ratio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
