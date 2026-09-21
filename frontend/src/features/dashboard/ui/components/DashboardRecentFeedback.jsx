import React from "react";
import { ArrowRight, MoreVertical, TrendingDown, Lightbulb, UserCheck, CornerUpLeft } from "lucide-react";
import { Link } from "react-router";

export default function DashboardRecentFeedback({
  feedback,
  totalCount = 1,
  onTriggerAction,
}) {
  const getInitials = (name) => {
    if (!name) return "AS";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFE4D6] shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-epilogue font-semibold text-[#1f1b18]">
              Recent feedback
            </h3>
            <span className="text-[11px] font-mono-tag font-bold px-2 py-0.5 rounded-full bg-[#FFDAD8] text-[#92001D]">
              {totalCount} Verbatim{totalCount === 1 ? "" : "s"}
            </span>
          </div>
          <Link
            to="/feedback"
            className="text-xs font-inter text-[#bb0028] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <p className="text-xs text-[#7d7461] font-inter mb-4">
          Direct customer verbatim voices and operational sentiment
        </p>

        {/* Feedback Verbatim Card item matching Stitch exact layout */}
        <div className="border border-[#EFE4D6] rounded-2xl p-4 bg-[#FFFAF3]/80 hover:bg-[#FFFAF3] transition-all border-l-4 border-l-[#bb0028] relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F9DFB9] text-[#746243] flex items-center justify-center font-bold text-xs font-epilogue shrink-0">
                {getInitials(feedback?.name)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="text-sm font-epilogue font-bold text-[#1f1b18]">
                    {feedback?.name || "Aman Sahu"}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-inter font-bold px-2 py-0.2 rounded-full bg-[#FFDAD6] text-[#93000A]">
                    <TrendingDown size={10} /> Negative
                  </span>
                  <span className="inline-flex items-center text-[10px] font-inter px-2 py-0.2 rounded-full bg-[#F6ECE7] text-[#5d3f3e] font-semibold">
                    Status: {feedback?.status === 'resolved' ? 'Resolved' : 'Open'}
                  </span>
                </div>
                <span className="text-xs font-inter text-[#7d7461] block truncate mt-0.5">
                  {feedback?.email || "aman.sahu@enterprise.io"} · {feedback?.tier || "Enterprise Tier"}
                </span>
              </div>
            </div>

            {/* Date and actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs font-inter text-[#7d7461]">
                {feedback?.date || "Sep 15, 2026"}
              </span>
              <button
                onClick={() => onTriggerAction && onTriggerAction("Feedback Context Options")}
                className="p-1 rounded-lg text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] cursor-pointer"
                title="Options"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Customer Quote Body */}
          <p className="text-xs sm:text-sm font-inter text-[#1f1b18] italic pl-3 border-l-2 border-[#E7BCBB] my-3 leading-relaxed">
            "{feedback?.quote}"
          </p>

          {/* Categorized Topics and Action pills */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EFE4D6]/70">
            <div className="flex flex-wrap items-center gap-1.5">
              {(feedback?.topics || []).map((t, i) => (
                <span
                  key={i}
                  className="text-[11px] font-inter px-2.5 py-0.5 rounded-lg bg-[#F6ECE7] text-[#1f1b18] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTriggerAction && onTriggerAction("Feedback closed and routed to Engineering")}
                className="px-3 py-1.5 rounded-xl bg-[#F6ECE7] hover:bg-[#EAE1DB] text-[#1f1b18] text-xs font-inter font-semibold transition-colors cursor-pointer"
              >
                Assign Ticket
              </button>
              <button
                onClick={() => onTriggerAction && onTriggerAction(`Drafting AI response to ${feedback?.name || 'Customer'}`)}
                className="px-3 py-1.5 rounded-xl bg-[#bb0028] text-white text-xs font-inter font-semibold hover:bg-[#92001d] transition-colors shadow-xs cursor-pointer"
              >
                Reply Verbatim
              </button>
            </div>
          </div>
        </div>

        {/* Subtle AI Insight Callout */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#F9DFB9]/30 border border-[#DBC39F]/60 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#F9DFB9] text-[#746243] shrink-0 mt-0.5">
            <Lightbulb size={16} />
          </div>
          <p className="text-xs font-inter text-[#261903] leading-relaxed">
            <strong className="font-bold">AI Recommended Action:</strong> This user reported slow sync. Automatic correlation indicates 23% of churn warnings stem from sync friction. Schedule proactive check-in.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EFE4D6]/70 text-right">
        <span className="text-[11px] font-inter text-[#7d7461]">
          Last updated 4 minutes ago via Webhook Relay
        </span>
      </div>
    </div>
  );
}
