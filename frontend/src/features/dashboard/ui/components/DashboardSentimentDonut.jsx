import React from "react";
import { Info } from "lucide-react";

export default function DashboardSentimentDonut({
  sentimentMix,
  activeFilter = "all",
  onFilterChange,
  onTriggerAction,
}) {
  const { positive, neutral, negative, total } = sentimentMix || {
    positive: { count: 0, percentage: 60 },
    neutral: { count: 0, percentage: 25 },
    negative: { count: 1, percentage: 15 },
    total: 1,
  };

  const posPct = positive?.percentage ?? 60;
  const neuPct = neutral?.percentage ?? 25;
  const negPct = negative?.percentage ?? 15;

  // SVG Circle stroke dash calculations (Circumference: 2 * Math.PI * 70 ≈ 440)
  const circumference = 440;
  const negLength = (negPct / 100) * circumference;
  const neuLength = (neuPct / 100) * circumference;
  const posLength = (posPct / 100) * circumference;

  const neuRotation = (negPct / 100) * 360;
  const posRotation = ((negPct + neuPct) / 100) * 360;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFE4D6] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-base sm:text-lg font-epilogue font-semibold text-[#1f1b18]">
            Sentiment mix
          </h3>
          <button
            onClick={() => onTriggerAction && onTriggerAction("Sentiment breakdown criteria")}
            className="text-[#7d7461] hover:text-[#1f1b18] p-1 rounded-lg hover:bg-[#FBF2EC] transition-colors cursor-pointer"
            title="View details"
          >
            <Info size={16} />
          </button>
        </div>
        <p className="text-xs text-[#7d7461] font-inter">
          Distribution across analyzed customer verbatims
        </p>
      </div>

      {/* Donut Chart & Center Stats */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="88"
            cy="88"
            r="70"
            fill="transparent"
            stroke="#eae1db"
            strokeWidth="16"
          ></circle>

          {/* Negative segment (Red) */}
          <circle
            cx="88"
            cy="88"
            r="70"
            fill="transparent"
            stroke="#bb0028"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - negLength}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          ></circle>

          {/* Neutral segment (Warm Gold / Sand) */}
          <circle
            cx="88"
            cy="88"
            r="70"
            fill="transparent"
            stroke="#f9dfb9"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - neuLength}
            strokeLinecap="round"
            style={{
              transform: `rotate(${neuRotation}deg)`,
              transformOrigin: "88px 88px",
            }}
            className="transition-all duration-700 ease-out"
          ></circle>

          {/* Positive segment (Forest Green) */}
          <circle
            cx="88"
            cy="88"
            r="70"
            fill="transparent"
            stroke="#2e7d32"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - posLength}
            strokeLinecap="round"
            style={{
              transform: `rotate(${posRotation}deg)`,
              transformOrigin: "88px 88px",
            }}
            className="transition-all duration-700 ease-out"
          ></circle>
        </svg>

        {/* Center Metric Label */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-epilogue font-bold text-[#1f1b18]">
            {total || 1}
          </span>
          <span className="text-[11px] font-inter text-[#7d7461] font-medium">Logged</span>
        </div>
      </div>

      {/* Segment Breakdown Legend with micro-interactions */}
      <div className="space-y-2 pt-2 border-t border-[#EFE4D6]/70">
        {/* Positive */}
        <div
          onClick={() => onFilterChange && onFilterChange(activeFilter === "positive" ? "all" : "positive")}
          className={`flex items-center justify-between text-xs font-inter p-2 rounded-xl transition-all cursor-pointer ${
            activeFilter === "positive"
              ? "bg-emerald-50 border border-emerald-200"
              : "hover:bg-[#FBF2EC]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-[#1f1b18] font-semibold">Positive</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#7d7461]">{positive?.count ?? 0} msgs</span>
            <span className="font-bold text-[#1f1b18]">{posPct}%</span>
          </div>
        </div>

        {/* Neutral */}
        <div
          onClick={() => onFilterChange && onFilterChange(activeFilter === "neutral" ? "all" : "neutral")}
          className={`flex items-center justify-between text-xs font-inter p-2 rounded-xl transition-all cursor-pointer ${
            activeFilter === "neutral"
              ? "bg-[#F9DFB9]/40 border border-[#DBC39F]"
              : "hover:bg-[#FBF2EC]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dbc39f]"></span>
            <span className="text-[#1f1b18] font-semibold">Neutral</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#7d7461]">{neutral?.count ?? 0} msgs</span>
            <span className="font-bold text-[#1f1b18]">{neuPct}%</span>
          </div>
        </div>

        {/* Negative */}
        <div
          onClick={() => onFilterChange && onFilterChange(activeFilter === "negative" ? "all" : "negative")}
          className={`flex items-center justify-between text-xs font-inter p-2 rounded-xl transition-all cursor-pointer ${
            activeFilter === "negative"
              ? "bg-rose-50 border border-rose-200"
              : "hover:bg-[#FBF2EC]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bb0028]"></span>
            <span className="text-[#1f1b18] font-semibold">Negative / Alert</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#7d7461]">{negative?.count ?? 1} msg</span>
            <span className="font-bold text-[#bb0028]">{negPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
