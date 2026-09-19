import React from "react";
import { Info, ThumbsUp, MinusCircle } from "lucide-react";
import { Stars } from "./DetailHelpers.jsx";

export default function DetailMetricsGrid({ npsScore, csatScore, cesScore }) {
  // NPS insight label
  const npsInsight = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 9) return "Promoter";
    if (score >= 7) return "Passive Detractor boundary";
    return "Detractor";
  };

  // CSAT insight label
  const csatInsight = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 4) return "Satisfied overall";
    if (score >= 3) return "Neutral satisfaction";
    return "Dissatisfied";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* NPS */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)] flex flex-col justify-between transition-all hover:border-[#e7bcbb]/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
            NPS SCORE
          </span>
          {npsScore != null && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F9DFB9]/60 text-[#746243]">
              Score {npsScore}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl font-epilogue font-semibold text-[#1f1b18]">
            {npsScore ?? "—"}
          </span>
          <span className="text-lg text-[#7d7461] font-normal">/ 10</span>
        </div>
        <p className="text-xs text-[#7d7461] font-inter mt-2 flex items-center gap-1">
          <Info size={14} className="text-[#635b4a]" />
          {npsInsight(npsScore) || "Not collected"}
        </p>
      </div>

      {/* CSAT */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)] flex flex-col justify-between transition-all hover:border-[#e7bcbb]/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
            CSAT RATING
          </span>
          {csatScore != null && (
            <Stars rating={csatScore} max={5} size={14} />
          )}
        </div>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl font-epilogue font-semibold text-[#1f1b18]">
            {csatScore ?? "—"}
          </span>
          <span className="text-lg text-[#7d7461] font-normal">/ 5</span>
        </div>
        <p className="text-xs text-[#7d7461] font-inter mt-2 flex items-center gap-1">
          <ThumbsUp size={14} className="text-[#6e5c3e]" />
          {csatInsight(csatScore) || "Not collected"}
        </p>
      </div>

      {/* CES */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)] flex flex-col justify-between transition-all hover:border-[#e7bcbb]/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
            CUSTOMER EFFORT (CES)
          </span>
          {cesScore == null && (
            <span className="text-[11px] text-[#7d7461] font-inter">
              Not Collected
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-3xl font-epilogue font-light text-[#7d7461]">
            {cesScore ?? "—"}
          </span>
          {cesScore != null && (
            <span className="text-lg text-[#7d7461] font-normal">/ 7</span>
          )}
        </div>
        <p className="text-xs text-[#7d7461] font-inter mt-2 flex items-center gap-1">
          <MinusCircle size={14} className="text-[#7d7461]" />
          {cesScore != null
            ? cesScore >= 5
              ? "Low effort — good"
              : "High effort — needs improvement"
            : "Not collected in this survey"}
        </p>
      </div>
    </div>
  );
}
