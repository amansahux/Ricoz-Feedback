import React from "react";
import { Users, Star } from "lucide-react";

export default function CustomerHeader({ totalCustomers = 0, avgExperience = "—" }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold font-inter text-[#7d7461]/80 tracking-widest uppercase">
        <span className="text-[#7d7461]">Portal</span>
        <span className="text-xs text-[#EFE4D6]">/</span>
        <span className="text-[#bb0028] font-semibold">Customers</span>
      </div>

      {/* Title & KPI Cards Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[#EFE4D6]/60">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-epilogue font-medium tracking-tight text-[#1f1b18]">
            Customers
          </h1>
          <p className="text-xs sm:text-sm font-inter text-[#7d7461] max-w-xl leading-relaxed">
            Browse customer profiles, response frequencies, and survey feedback trends across your enterprise workspace.
          </p>
        </div>

        {/* Quiet Refined KPI Stats */}
        <div className="flex items-center gap-3.5 shrink-0 flex-wrap">
          {/* Total Customers */}
          <div className="px-4 py-3 rounded-xl bg-white border border-[#EFE4D6] shadow-xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#7d7461]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7d7461] font-inter leading-tight">
                Total Customers
              </p>
              <p className="text-lg sm:text-xl font-epilogue font-semibold text-[#1f1b18] mt-0.5">
                {totalCustomers.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Avg Experience */}
          <div className="px-4 py-3 rounded-xl bg-white border border-[#EFE4D6] shadow-xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#FBF2EC] flex items-center justify-center text-[#f59e0b]">
              <Star size={18} className="fill-[#f59e0b]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7d7461] font-inter leading-tight">
                Avg Experience
              </p>
              <p className="text-lg sm:text-xl font-epilogue font-semibold text-[#1f1b18] mt-0.5 flex items-baseline gap-1">
                <span>{avgExperience}</span>
                <span className="text-xs font-normal text-[#7d7461] font-inter">/ 5.0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
