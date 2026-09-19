import React from "react";
import { MessageSquare, Star, Calendar, TrendingUp, CheckCircle, ShieldCheck } from "lucide-react";

export default function CustomerProfileMetrics({ summary = {}, customer, totalSurveys = 0 }) {
  const totalFeedback = summary.totalResponses ?? 0;
  const avgRating = summary.avgCsat || summary.avgNps || "—";
  const resolvedCount = summary.resolvedResponses ?? 0;
  const resolutionRate =
    totalFeedback > 0 ? Math.round((resolvedCount / totalFeedback) * 100) : 100;

  const firstActiveDate = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Metric 1: Total Feedback */}
      <div className="bg-white border border-[#EFE4D6] rounded-2xl p-6 shadow-xs hover:border-[#e7bcbb]/60 transition flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#7d7461]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
            TOTAL FEEDBACK
          </span>
          <MessageSquare size={18} className="text-[#7d7461]/70" />
        </div>
        <div className="mt-4">
          <div className="text-3xl font-epilogue font-semibold text-[#1f1b18]">
            {totalFeedback}
          </div>
          <div className="text-xs font-inter text-[#7d7461] mt-1">
            Across {totalSurveys} survey{totalSurveys === 1 ? "" : "s"}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/50 flex items-center gap-1.5 text-xs font-inter text-emerald-700 font-medium">
          <TrendingUp size={14} className="text-emerald-600" />
          <span>{resolutionRate}% issues resolved</span>
        </div>
      </div>

      {/* Metric 2: Avg Rating */}
      <div className="bg-white border border-[#EFE4D6] rounded-2xl p-6 shadow-xs hover:border-[#e7bcbb]/60 transition flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#7d7461]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
            AVG RATING
          </span>
          <Star size={18} className="text-[#f59e0b] fill-[#f59e0b]" />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-epilogue font-semibold text-[#1f1b18]">
              {avgRating}
            </span>
            {avgRating !== "—" && (
              <span className="text-sm font-inter text-[#7d7461]">/ 5.0</span>
            )}
          </div>
          <div className="text-xs font-inter text-[#7d7461] mt-1">
            Overall customer perception
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/50 flex items-center gap-1.5 text-xs font-inter text-[#7d7461]">
          <CheckCircle size={14} className="text-emerald-600" />
          <span>Verified customer telemetry</span>
        </div>
      </div>

      {/* Metric 3: First Active */}
      <div className="bg-white border border-[#EFE4D6] rounded-2xl p-6 shadow-xs hover:border-[#e7bcbb]/60 transition flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#7d7461]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
            FIRST ACTIVE
          </span>
          <Calendar size={18} className="text-[#7d7461]/70" />
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-[26px] font-epilogue font-semibold text-[#1f1b18]">
            {firstActiveDate}
          </div>
          <div className="text-xs font-inter text-[#7d7461] mt-1">
            Registered customer contact
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#EFE4D6]/50 flex items-center gap-1.5 text-xs font-inter text-emerald-700 font-medium">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Verified response source</span>
        </div>
      </div>
    </div>
  );
}
