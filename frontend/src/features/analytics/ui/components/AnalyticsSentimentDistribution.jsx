import React from "react";

export default function AnalyticsSentimentDistribution({ sentiment = {} }) {
  const {
    positive = { count: 0, percentage: 0 },
    neutral = { count: 0, percentage: 0 },
    negative = { count: 0, percentage: 0 },
  } = sentiment;

  return (
    <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18]">
            Sentiment distribution
          </h2>
          <p className="text-xs sm:text-sm text-[#6e5c3e] font-inter">
            Automated sentiment classification on qualitative verbatims
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-inter text-[#6e5c3e] flex-wrap">
          <span className="w-2 h-2 rounded-full bg-[#1C7332]"></span>
          <span>{positive.percentage || 0}% Positive</span>
          <span className="w-2 h-2 rounded-full bg-[#dbc39f] ml-2"></span>
          <span>{neutral.percentage || 0}% Neutral</span>
          <span className="w-2 h-2 rounded-full bg-[#bb0028] ml-2"></span>
          <span>{negative.percentage || 0}% Negative</span>
        </div>
      </div>

      {/* Multi-Segment Distribution Bar */}
      <div className="w-full h-3 rounded-full bg-[#FBF2EC] overflow-hidden flex gap-1">
        <div
          className="h-full bg-[#1C7332] rounded-l-full transition-all duration-500"
          style={{ width: `${Math.max(positive.percentage || 0, 1)}%` }}
        />
        <div
          className="h-full bg-[#dbc39f] transition-all duration-500"
          style={{ width: `${Math.max(neutral.percentage || 0, 1)}%` }}
        />
        <div
          className="h-full bg-[#bb0028] rounded-r-full transition-all duration-500"
          style={{ width: `${Math.max(negative.percentage || 0, 1)}%` }}
        />
      </div>

      {/* 3 Segment Summary Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Positive */}
        <div className="p-4 rounded-xl bg-[#FBF2EC]/40 border border-[#D2EED7]/70 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-inter font-semibold text-[#1f1b18]">
              Positive
            </span>
            <span className="text-xs font-inter font-semibold text-[#1C7332] bg-[#EBF7ED] px-2 py-0.5 rounded-full border border-[#D2EED7]">
              {positive.percentage || 0}% Overall
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-epilogue font-bold text-[#1f1b18]">
            {positive.count != null ? positive.count.toLocaleString() : 0} responses
          </div>
          <p className="text-xs text-[#6e5c3e] font-inter leading-relaxed">
            High customer satisfaction centered primarily in product value, customer delight, and smooth checkout.
          </p>
        </div>

        {/* Neutral */}
        <div className="p-4 rounded-xl bg-[#FBF2EC]/40 border border-[#EFE4D6] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-inter font-semibold text-[#1f1b18]">
              Neutral
            </span>
            <span className="text-xs font-inter font-medium text-[#6e5c3e] bg-[#F6ECE7] px-2 py-0.5 rounded-full border border-[#EFE4D6]">
              {neutral.percentage || 0}% Overall
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-epilogue font-bold text-[#1f1b18]">
            {neutral.count != null ? neutral.count.toLocaleString() : 0} responses
          </div>
          <p className="text-xs text-[#6e5c3e] font-inter leading-relaxed">
            Routine questions, minor feature requests, and baseline inquiries with no critical points of friction.
          </p>
        </div>

        {/* Negative */}
        <div className="p-4 rounded-xl bg-[#FBF2EC]/40 border border-rose-200 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-inter font-semibold text-[#1f1b18]">
              Negative
            </span>
            <span className="text-xs font-inter font-semibold text-[#bb0028] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {negative.percentage || 0}% Overall
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-epilogue font-bold text-[#bb0028]">
            {negative.count != null ? negative.count.toLocaleString() : 0} responses
          </div>
          <p className="text-xs text-[#6e5c3e] font-inter leading-relaxed">
            Actionable friction signals highlighting support lag, delivery issues, or unmet product expectations.
          </p>
        </div>
      </div>
    </div>
  );
}
