import React from "react";
import { formatDate, formatTime, sourceLabel, SourceIcon, sentimentConfig, statusConfig } from "./DetailHelpers.jsx";

export default function DetailIdentityHeader({
  customerName,
  customerEmail,
  createdAt,
  source,
  currentStatus,
  sentiment,
}) {
  const sentimentStyle = sentimentConfig[sentiment] || sentimentConfig.neutral;

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2 border-b border-[#EFE4D6]/60">
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
          FEEDBACK RESPONSE
        </span>
        <h1 className="text-2xl sm:text-3xl font-epilogue font-semibold text-[#1f1b18] tracking-tight">
          {customerName}
        </h1>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-[#7d7461] font-inter mt-0.5">
          <span className="font-medium text-[#1f1b18]">{customerEmail}</span>
          <span className="text-[#e1d8d3]">•</span>
          <span>{formatDate(createdAt)}</span>
          <span className="text-[#e1d8d3]">•</span>
          <span>{formatTime(createdAt)}</span>
          <span className="text-[#e1d8d3]">•</span>
          <span className="inline-flex items-center gap-1 text-[#1f1b18]">
            <SourceIcon source={source} />
            Channel: {sourceLabel(source)}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2.5 self-start pt-1">
        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            statusConfig[currentStatus] || statusConfig.open
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              currentStatus === "resolved"
                ? "bg-emerald-600"
                : currentStatus === "in_progress"
                ? "bg-[#6e5c3e]"
                : "bg-[#6e5c3e]"
            }`}
          ></span>
          <span className="capitalize">
            {currentStatus === "in_progress" ? "In Progress" : currentStatus}
          </span>
        </span>

        {/* Sentiment pill */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sentimentStyle.bg}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${sentimentStyle.dot}`}
          ></span>
          <span className="capitalize">{sentiment}</span>
        </span>

        {/* Source pill */}
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#FBF2EC] text-[#1f1b18] border border-[#EFE4D6]">
          <SourceIcon source={source} />
          {sourceLabel(source)}
        </span>
      </div>
    </div>
  );
}
