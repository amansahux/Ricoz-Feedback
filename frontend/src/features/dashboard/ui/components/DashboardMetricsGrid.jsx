import React from "react";
import { MessageSquare, Gauge, Smile, Sliders, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router";

export default function DashboardMetricsGrid({ summary, onTriggerAction }) {
  const { totalResponses, nps, csat, ces } = summary || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TOTAL RESPONSES */}
      <div className="bg-white rounded-2xl p-5 border border-[#EFE4D6] shadow-xs relative overflow-hidden transition-all duration-200 hover:border-[#D1C5B0] hover:shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#7d7461] mb-2.5">
            <span className="text-[11px] font-mono-tag font-bold uppercase tracking-wider">
              TOTAL RESPONSES
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
              <MessageSquare size={14} />
            </div>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
              {totalResponses?.value ?? 0}
            </span>
            <span className="inline-flex items-center text-[11px] font-inter font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight size={12} className="mr-0.5" />
              +{totalResponses?.changePercent ?? 100}% vs last mo
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/70 flex items-center justify-between text-xs font-inter text-[#7d7461]">
          <span>All time: {totalResponses?.allTime ?? totalResponses?.value ?? 0}</span>
          <span className="text-[#bb0028] font-semibold">100% completed</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#bb0028]/70 to-[#bb0028]"></div>
      </div>

      {/* 2. NET PROMOTER SCORE (NPS) */}
      <div className="bg-white rounded-2xl p-5 border border-[#EFE4D6] shadow-xs relative overflow-hidden transition-all duration-200 hover:border-[#D1C5B0] hover:shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#7d7461] mb-2.5">
            <span className="text-[11px] font-mono-tag font-bold uppercase tracking-wider">
              NET PROMOTER SCORE (NPS)
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
              <Gauge size={14} />
            </div>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
              {nps?.value ?? 0}
            </span>
            <span className="text-xs font-inter text-[#7d7461] bg-[#FBF2EC] px-2 py-0.5 rounded-md font-medium border border-[#EFE4D6]">
              {nps?.value > 30 ? "Strong" : nps?.value >= 0 ? "Neutral baseline" : "Needs Attention"}
            </span>
          </div>
        </div>

        {/* Score scale indicator visual */}
        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/70 flex flex-col gap-1.5">
          <div className="w-full bg-[#F6ECE7] h-1.5 rounded-full overflow-hidden flex">
            <div className="w-1/3 bg-rose-300" title="Detractors"></div>
            <div className="w-1/3 bg-[#F9DFB9]" title="Passives"></div>
            <div className="w-1/3 bg-emerald-300" title="Promoters"></div>
          </div>
          <div className="flex justify-between text-[11px] font-inter text-[#7d7461]">
            <span>
              {nps?.promotersCount ?? 0} promoters · {nps?.detractorsCount ?? 0} detractors
            </span>
            <span className="font-medium text-[#1f1b18]">Range: -100 to 100</span>
          </div>
        </div>
      </div>

      {/* 3. CUSTOMER SATISFACTION (CSAT) */}
      <div className="bg-white rounded-2xl p-5 border border-[#EFE4D6] shadow-xs relative overflow-hidden transition-all duration-200 hover:border-[#D1C5B0] hover:shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#7d7461] mb-2.5">
            <span className="text-[11px] font-mono-tag font-bold uppercase tracking-wider">
              CUSTOMER SATISFACTION (CSAT)
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
              <Smile size={14} />
            </div>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-epilogue font-bold text-[#1f1b18] tracking-tight">
              {csat?.value !== null && csat?.value !== undefined ? `${csat.value}%` : "—"}
            </span>
            <span className="inline-flex items-center text-xs font-inter font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {csat?.value >= 80 ? "Excellent" : csat?.value >= 60 ? "Good" : "Awaiting data"}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/70 flex items-center justify-between text-xs font-inter text-[#7d7461]">
          <span>
            {csat?.satisfiedCount ?? 1} satisfied of {csat?.totalWithScore ?? 1} response
          </span>
          <span className="text-emerald-700 font-semibold">Goal: &gt;85%</span>
        </div>
      </div>

      {/* 4. CUSTOMER EFFORT SCORE (CES) */}
      <div className="bg-white rounded-2xl p-5 border border-[#EFE4D6] shadow-xs relative overflow-hidden transition-all duration-200 hover:border-[#D1C5B0] hover:shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[#7d7461] mb-2.5">
            <span className="text-[11px] font-mono-tag font-bold uppercase tracking-wider">
              CUSTOMER EFFORT SCORE (CES)
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#6e5c3e]">
              <Sliders size={14} />
            </div>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-epilogue font-bold text-[#7d7461] tracking-tight">
              {ces?.value != null ? `${ces.value}/7` : "—"}
            </span>
            <span className="text-xs font-inter text-[#7d7461] bg-[#FBF2EC] px-2 py-0.5 rounded-md border border-[#EFE4D6]">
              {ces?.effortCount ?? 0} responses
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/70 flex items-center justify-between text-xs font-inter text-[#7d7461]">
          <span>{ces?.value != null ? "Effort rating recorded" : "No effort ratings yet"}</span>
          <Link
            to="/surveys/create"
            className="text-[#bb0028] hover:underline font-medium cursor-pointer"
          >
            Activate CES
          </Link>
        </div>
      </div>
    </div>
  );
}
