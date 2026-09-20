import React from "react";

export default function AnalyticsSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      {/* 1. Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white border border-[#EFE4D6]/60 h-36 flex flex-col justify-between shadow-xs"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 bg-[#FBF2EC] rounded"></div>
              <div className="h-8 w-8 bg-[#FBF2EC] rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-24 bg-[#FBF2EC] rounded"></div>
              <div className="h-3 w-36 bg-[#F6ECE7] rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Response Volume Chart Skeleton */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6]/60 h-80 flex flex-col justify-between shadow-xs">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-[#FBF2EC] rounded"></div>
          <div className="h-3 w-64 bg-[#F6ECE7] rounded"></div>
        </div>
        <div className="h-48 w-full bg-[#FBF2EC]/70 rounded-xl"></div>
      </div>

      {/* 3. 2-Column Grid Skeleton (NPS & Topics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6]/60 h-80 space-y-4 shadow-xs">
          <div className="flex justify-between">
            <div className="h-5 w-36 bg-[#FBF2EC] rounded"></div>
            <div className="h-5 w-20 bg-[#FBF2EC] rounded-full"></div>
          </div>
          <div className="h-4 w-full bg-[#F6ECE7] rounded-full mt-4"></div>
          <div className="space-y-3 pt-4">
            <div className="h-10 w-full bg-[#FBF2EC] rounded-lg"></div>
            <div className="h-10 w-full bg-[#FBF2EC] rounded-lg"></div>
            <div className="h-10 w-full bg-[#FBF2EC] rounded-lg"></div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6]/60 h-80 space-y-4 shadow-xs">
          <div className="h-5 w-36 bg-[#FBF2EC] rounded"></div>
          <div className="space-y-4 pt-4">
            {[1, 2, 3, 4].map((t) => (
              <div key={t} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="h-3 w-32 bg-[#FBF2EC] rounded"></div>
                  <div className="h-3 w-20 bg-[#F6ECE7] rounded"></div>
                </div>
                <div className="h-2 w-full bg-[#FBF2EC] rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Sentiment Distribution Skeleton */}
      <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6]/60 space-y-4 shadow-xs">
        <div className="h-5 w-44 bg-[#FBF2EC] rounded"></div>
        <div className="h-3 w-full bg-[#F6ECE7] rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="p-4 rounded-xl bg-[#FBF2EC]/40 h-28 space-y-2">
              <div className="h-4 w-20 bg-[#FBF2EC] rounded"></div>
              <div className="h-6 w-28 bg-[#FBF2EC] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
