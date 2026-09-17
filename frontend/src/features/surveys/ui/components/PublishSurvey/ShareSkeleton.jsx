import React from "react";

export default function ShareSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="w-24 h-4 bg-[#FBF2EC] rounded"></div>
      <div className="flex justify-between items-end pb-6 border-b border-[#EFE4D6]">
        <div className="flex flex-col gap-3">
          <div className="w-16 h-3 bg-[#FBF2EC] rounded"></div>
          <div className="w-64 h-8 bg-[#FBF2EC] rounded"></div>
          <div className="w-80 h-4 bg-[#FBF2EC] rounded"></div>
        </div>
        <div className="w-36 h-12 bg-[#FBF2EC] rounded-xl"></div>
      </div>
      <div className="w-full h-10 bg-[#FBF2EC] rounded-xl"></div>
      <div className="w-full h-64 bg-white border border-[#EFE4D6] rounded-2xl p-8 flex flex-col gap-4">
        <div className="w-32 h-4 bg-[#FBF2EC] rounded"></div>
        <div className="w-full h-12 bg-[#FBF2EC] rounded-xl"></div>
        <div className="w-3/4 h-4 bg-[#FBF2EC] rounded"></div>
      </div>
    </div>
  );
}
