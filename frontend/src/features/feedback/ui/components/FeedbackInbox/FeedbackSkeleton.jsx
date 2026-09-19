import React from "react";

export default function FeedbackSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
        <div className="h-4 w-36 bg-[#EFE4D6] rounded"></div>
        <div className="h-4 w-24 bg-[#EFE4D6] rounded"></div>
      </div>

      {/* Skeleton Rows */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 w-1/4">
              <div className="w-8 h-8 rounded-full bg-[#EFE4D6] shrink-0"></div>
              <div className="space-y-1.5 w-full">
                <div className="h-3.5 bg-[#EFE4D6] rounded w-3/4"></div>
                <div className="h-2.5 bg-[#EFE4D6]/70 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-4 bg-[#EFE4D6] rounded w-16"></div>
            <div className="h-4 bg-[#EFE4D6] rounded w-20"></div>
            <div className="h-4 bg-[#EFE4D6] rounded w-1/3"></div>
            <div className="h-4 bg-[#EFE4D6] rounded w-14"></div>
            <div className="h-4 bg-[#EFE4D6] rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
