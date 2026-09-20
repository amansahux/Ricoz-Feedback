import React from "react";
import { Info, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function AnalyticsBreakdownGrid({
  npsSummary = {},
  npsBreakdown = {},
  topTopics = [],
}) {
  const {
    promoters = { count: 0, percentage: 0 },
    passives = { count: 0, percentage: 0 },
    detractors = { count: 0, percentage: 0 },
  } = npsBreakdown;

  const npsScore = npsSummary?.value;
  const netScoreFormatted =
    npsScore !== null && npsScore !== undefined
      ? npsScore > 0
        ? `+${npsScore}`
        : `${npsScore}`
      : "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: NPS Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-xs flex flex-col justify-between gap-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18]">NPS breakdown</h2>
            <span className="text-xs font-inter font-semibold text-[#1C7332] bg-[#EBF7ED] px-2.5 py-0.5 rounded-full border border-[#D2EED7]">
              {netScoreFormatted} Net Score
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6e5c3e] font-inter">
            Distribution across promoter tiers
          </p>

          {/* Segmented Visualizer Bar */}
          <div className="w-full h-4 rounded-full bg-[#F6ECE7] overflow-hidden flex gap-1 mt-5 p-0.5">
            <div
              className="h-full bg-[#1C7332] rounded-l-full transition-all duration-500"
              style={{ width: `${Math.max(promoters.percentage || 0, 1)}%` }}
              title={`Promoters: ${promoters.percentage || 0}%`}
            />
            <div
              className="h-full bg-[#dbc39f] transition-all duration-500"
              style={{ width: `${Math.max(passives.percentage || 0, 1)}%` }}
              title={`Passives: ${passives.percentage || 0}%`}
            />
            <div
              className="h-full bg-[#bb0028] rounded-r-full transition-all duration-500"
              style={{ width: `${Math.max(detractors.percentage || 0, 1)}%` }}
              title={`Detractors: ${detractors.percentage || 0}%`}
            />
          </div>

          {/* Detailed Metric Rows */}
          <div className="flex flex-col gap-3 mt-6">
            {/* Promoters (9–10) */}
            <div className="flex items-center justify-between py-2 border-b border-[#EFE4D6]/60">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#1C7332]"></span>
                <div>
                  <span className="text-xs sm:text-sm font-inter text-[#1f1b18] font-medium">
                    Promoters (9–10)
                  </span>
                  <p className="text-xs text-[#6e5c3e] font-inter">High loyalty, active advocates</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-epilogue font-bold text-[#1f1b18]">
                  {promoters.percentage || 0}%
                </span>
                <span className="block text-[11px] font-inter text-[#6e5c3e]">
                  {promoters.count != null ? promoters.count.toLocaleString() : 0} responses
                </span>
              </div>
            </div>

            {/* Passives (7–8) */}
            <div className="flex items-center justify-between py-2 border-b border-[#EFE4D6]/60">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#dbc39f]"></span>
                <div>
                  <span className="text-xs sm:text-sm font-inter text-[#1f1b18] font-medium">
                    Passives (7–8)
                  </span>
                  <p className="text-xs text-[#6e5c3e] font-inter">
                    Satisfied but vulnerable to competitors
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-epilogue font-bold text-[#1f1b18]">
                  {passives.percentage || 0}%
                </span>
                <span className="block text-[11px] font-inter text-[#6e5c3e]">
                  {passives.count != null ? passives.count.toLocaleString() : 0} responses
                </span>
              </div>
            </div>

            {/* Detractors (0–6) */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#bb0028]"></span>
                <div>
                  <span className="text-xs sm:text-sm font-inter text-[#1f1b18] font-medium">
                    Detractors (0–6)
                  </span>
                  <p className="text-xs text-[#6e5c3e] font-inter">
                    Unsatisfied with risk of negative churn
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-epilogue font-bold text-[#bb0028]">
                  {detractors.percentage || 0}%
                </span>
                <span className="block text-[11px] font-inter text-[#6e5c3e]">
                  {detractors.count != null ? detractors.count.toLocaleString() : 0} responses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* NPS Formula Callout */}
        <div className="p-3 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6] flex items-center gap-2 text-xs font-inter text-[#6e5c3e]">
          <Info size={16} className="text-[#bb0028] shrink-0" />
          <span>
            NPS = % Promoters ({promoters.percentage || 0}%) − % Detractors ({detractors.percentage || 0}%) ={" "}
            <strong className="text-[#1f1b18]">{netScoreFormatted}</strong>
          </span>
        </div>
      </div>

      {/* Card 2: Top Topics */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18]">Top topics</h2>
            <Tag size={18} className="text-[#6e5c3e]" />
          </div>
          <p className="text-xs sm:text-sm text-[#6e5c3e] font-inter mt-0.5">
            Most frequent discussion areas detected across feedback
          </p>

          {/* Progress Bars for Topics */}
          <div className="flex flex-col gap-4 mt-6">
            {topTopics && topTopics.length > 0 ? (
              topTopics.slice(0, 5).map((topicItem, index) => {
                const opacityPercent = Math.max(100 - index * 18, 30);
                return (
                  <div key={topicItem.topic || index} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs sm:text-sm font-inter">
                      <span className="font-medium text-[#1f1b18] capitalize">
                        {topicItem.topic}
                      </span>
                      <span className="text-[#6e5c3e]">
                        {topicItem.count} mentions ({topicItem.percentage || 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FBF2EC] overflow-hidden">
                      <div
                        className="h-full bg-[#bb0028] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(topicItem.percentage || 5, 100)}%`,
                          opacity: opacityPercent / 100,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-[#6e5c3e] font-inter">
                No topic keywords identified in responses for this timeframe.
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-[#EFE4D6]/60">
          <Link
            to="/feedback"
            className="text-xs font-inter font-semibold text-[#bb0028] hover:underline flex items-center gap-1 w-fit"
          >
            <span>Explore all customer verbatims &amp; tags</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
