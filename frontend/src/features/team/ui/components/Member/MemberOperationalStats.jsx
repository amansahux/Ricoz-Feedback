import React from "react";
import { UserCheck, Clock, CheckCircle2, MessageSquare } from "lucide-react";

export default function MemberOperationalStats({ stats }) {
  const {
    assigned = 24,
    inProgress = 8,
    resolved = 16,
    replies = 12,
  } = stats || {};

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Assigned */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Assigned
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#fbf2ec] flex items-center justify-center text-[#6e5c3e]">
            <Clock size={15} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {assigned}
          </span>
          <span className="text-xs text-[#5d3f3e]">items</span>
        </div>
        <p className="text-[11px] text-[#7d7461] mt-1 truncate">
          Customer feedback items assigned
        </p>
      </div>

      {/* Stat 2: In Progress */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            In Progress
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#f9dfb9]/40 flex items-center justify-center text-[#6e5c3e]">
            <Clock size={15} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {inProgress}
          </span>
          <span className="text-[11px] font-medium text-[#6e5c3e] bg-[#f9dfb9]/60 px-1.5 py-0.5 rounded">
            33% load
          </span>
        </div>
        <p className="text-[11px] text-[#7d7461] mt-1 truncate">
          Active investigations in flight
        </p>
      </div>

      {/* Stat 3: Resolved */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Resolved
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={15} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {resolved}
          </span>
          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
            +4 this wk
          </span>
        </div>
        <p className="text-[11px] text-[#7d7461] mt-1 truncate">
          Successfully resolved tickets
        </p>
      </div>

      {/* Stat 4: Customer Replies */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Customer Replies
          </span>
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-[#bb0028]">
            <MessageSquare size={15} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {replies}
          </span>
          <span className="text-xs text-[#5d3f3e]">responses</span>
        </div>
        <p className="text-[11px] text-[#7d7461] mt-1 truncate">
          Direct communications handled
        </p>
      </div>
    </section>
  );
}
