import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 4 Metric KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-[#EFE4D6] space-y-3 shadow-xs"
          >
            <div className="w-24 h-4 bg-[#F6ECE7] rounded-md"></div>
            <div className="w-16 h-9 bg-[#F6ECE7] rounded-lg"></div>
            <div className="w-32 h-3 bg-[#F6ECE7] rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Middle Row (Volume + Donut) Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#EFE4D6] space-y-4 shadow-xs">
          <div className="w-48 h-6 bg-[#F6ECE7] rounded-md"></div>
          <div className="w-full h-56 bg-[#F6ECE7] rounded-xl"></div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#EFE4D6] space-y-4 shadow-xs">
          <div className="w-36 h-6 bg-[#F6ECE7] rounded-md"></div>
          <div className="w-40 h-40 mx-auto rounded-full bg-[#F6ECE7]"></div>
          <div className="space-y-2 pt-2">
            <div className="w-full h-4 bg-[#F6ECE7] rounded"></div>
            <div className="w-full h-4 bg-[#F6ECE7] rounded"></div>
          </div>
        </div>
      </div>

      {/* Bottom Row (Topics + Recent Verbatim) Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EFE4D6] space-y-4 shadow-xs">
          <div className="w-36 h-5 bg-[#F6ECE7] rounded-md"></div>
          <div className="space-y-3 pt-2">
            <div className="w-full h-3 bg-[#F6ECE7] rounded-full"></div>
            <div className="w-full h-3 bg-[#F6ECE7] rounded-full"></div>
            <div className="w-full h-3 bg-[#F6ECE7] rounded-full"></div>
          </div>
        </div>
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#EFE4D6] space-y-4 shadow-xs">
          <div className="w-44 h-5 bg-[#F6ECE7] rounded-md"></div>
          <div className="p-4 rounded-2xl border border-[#EFE4D6] space-y-3 bg-[#FFFAF3]">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-[#F6ECE7]"></div>
              <div className="space-y-2 flex-1">
                <div className="w-32 h-4 bg-[#F6ECE7] rounded"></div>
                <div className="w-24 h-3 bg-[#F6ECE7] rounded"></div>
              </div>
            </div>
          </div>
          <div className="w-full h-8 bg-[#F6ECE7] rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
