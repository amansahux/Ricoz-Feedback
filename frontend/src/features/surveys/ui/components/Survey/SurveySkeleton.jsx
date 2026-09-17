import React from "react";

export default function SurveySkeleton() {
  return (
    <div className="bg-white border border-[#EFE4D6] rounded-2xl p-6 shadow-sm flex flex-col gap-4 animate-pulse">
      <div className="h-6 bg-[#FBF2EC] rounded-md w-1/4 mb-2"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-3.5 border-b border-[#FBF2EC]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FBF2EC] rounded-xl shrink-0"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#FBF2EC] rounded w-48 sm:w-64"></div>
                <div className="h-3 bg-[#F6ECE7] rounded w-28 sm:w-40"></div>
              </div>
            </div>
            <div className="hidden sm:block h-6 bg-[#FBF2EC] rounded-full w-24"></div>
            <div className="hidden md:block h-4 bg-[#FBF2EC] rounded w-16"></div>
            <div className="hidden lg:block h-4 bg-[#FBF2EC] rounded w-20"></div>
            <div className="h-8 bg-[#FBF2EC] rounded-xl w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
