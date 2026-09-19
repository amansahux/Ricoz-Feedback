import React from "react";
import { Link } from "react-router";
import { ChevronDown, Star, ChevronRight, Inbox } from "lucide-react";
import { sentimentConfig, statusConfig } from "../../../../feedback/ui/components/FeedbackDetails/DetailHelpers.jsx";

export default function CustomerHistoryTable({
  responses = [],
  uniqueSurveys = [],
  surveyFilter,
  setSurveyFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <section
      className="bg-white border border-[#EFE4D6] rounded-2xl shadow-xs overflow-hidden"
      id="feedback-history-list"
    >
      {/* Header & Filter Row */}
      <div className="p-6 border-b border-[#EFE4D6]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-epilogue font-semibold text-lg text-[#1f1b18]">
            Feedback history
          </h2>
          <p className="text-xs font-inter text-[#7d7461] mt-0.5">
            All responses submitted by this customer across surveys.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Survey Filter Dropdown */}
          <div className="relative">
            <select
              value={surveyFilter}
              onChange={(e) => setSurveyFilter(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-xl bg-white border border-[#EFE4D6] text-xs font-medium font-inter text-[#1f1b18] focus:outline-none focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] cursor-pointer appearance-none shadow-2xs hover:border-[#cfc4b6]"
            >
              <option value="all">All surveys</option>
              {uniqueSurveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="text-[#7d7461] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          {/* Sort Order Control */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-xl bg-white border border-[#EFE4D6] text-xs font-medium font-inter text-[#1f1b18] focus:outline-none focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] cursor-pointer appearance-none shadow-2xs hover:border-[#cfc4b6]"
            >
              <option value="newest">Sort: Newest</option>
              <option value="high_rating">Sort: Highest Rating</option>
              <option value="low_rating">Sort: Lowest Rating</option>
            </select>
            <ChevronDown
              size={14}
              className="text-[#7d7461] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Responses Table */}
      {responses.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#FBF2EC] flex items-center justify-center mb-3 border border-[#EFE4D6]">
            <Inbox size={22} className="text-[#7d7461]" />
          </div>
          <p className="text-sm font-semibold text-[#1f1b18] font-epilogue">
            No feedback entries found
          </p>
          <p className="text-xs text-[#7d7461] font-inter mt-1">
            This customer has not submitted responses matching current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFE4D6]/70 bg-[#FBF2EC]/40 text-[#926e6d] text-[11px] font-bold font-inter tracking-wider uppercase">
                <th className="py-3.5 px-6">Survey</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6">Sentiment</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE4D6]/50">
              {responses.map((response) => {
                const sentiment = response.sentiment || "neutral";
                const sentimentStyle = sentimentConfig[sentiment] || sentimentConfig.neutral;
                const status = response.status || "open";
                const surveyTitle = response.surveyId?.title || "Customer Survey";
                const score = response.csatScore ?? response.npsScore ?? "—";

                return (
                  <tr
                    key={response._id}
                    className="hover:bg-[#FBF2EC]/40 transition-colors group"
                  >
                    {/* Survey Details */}
                    <td className="py-4.5 px-6">
                      <Link to={`/feedback/${response._id}`} className="flex flex-col">
                        <span className="font-semibold text-sm font-inter text-[#1f1b18] group-hover:text-[#bb0028] transition-colors">
                          {surveyTitle}
                        </span>
                        <span className="text-[11px] font-inter text-[#7d7461]">
                          ID: #{response._id?.substring(0, 8) || response._id}
                        </span>
                      </Link>
                    </td>

                    {/* Rating */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 font-epilogue font-semibold text-sm text-[#1f1b18]">
                        <span>{score}</span>
                        {score !== "—" && (
                          <Star size={14} className="text-[#f59e0b] fill-[#f59e0b]" />
                        )}
                      </div>
                    </td>

                    {/* Sentiment */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sentimentStyle.bg}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sentimentStyle.dot}`}
                        ></span>
                        <span className="capitalize">{sentiment}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          statusConfig[status] || statusConfig.open
                        }`}
                      >
                        <span className="capitalize">
                          {status === "in_progress" ? "In Progress" : status}
                        </span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4.5 px-6 whitespace-nowrap text-xs font-inter text-[#7d7461]">
                      {new Date(response.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Inspect Link */}
                    <td className="py-4.5 px-6 whitespace-nowrap text-right">
                      <Link
                        to={`/feedback/${response._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold font-inter text-[#bb0028] hover:underline"
                      >
                        <span>Inspect</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
