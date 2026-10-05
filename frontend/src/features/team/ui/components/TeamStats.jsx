import React from "react";
import { Users, ShieldCheck, Mail } from "lucide-react";

export default function TeamStats({ stats }) {
  const {
    totalMembers = 0,
    activeMembers = 0,
    pendingCount = 0,
    seatUtilization = 0,
  } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
      {/* Stat 1: Total Members */}
      <div className="bg-white p-5 lg:p-6 rounded-xl border border-[#eae1db] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Total Members
          </span>
          <Users size={18} className="text-[#926e6d]" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {totalMembers}
          </span>
          <span className="text-xs text-[#5d3f3e]">Active accounts</span>
        </div>
        <div className="mt-2 text-xs text-[#6e5c3e] font-medium">
          Across 3 access tiers (Owner, Admin, Agent)
        </div>
      </div>

      {/* Stat 2: Active Operators */}
      <div className="bg-white p-5 lg:p-6 rounded-xl border border-[#eae1db] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Active Operators
          </span>
          <ShieldCheck size={18} className="text-[#6e5c3e]" />
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {activeMembers}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Operational</span>
          </span>
        </div>
        <div className="mt-2 text-xs text-[#5d3f3e]">
          {seatUtilization}% total organization seat utilization
        </div>
      </div>

      {/* Stat 3: Pending Invites */}
      <div className="bg-white p-5 lg:p-6 rounded-xl border border-[#eae1db] shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#6e5c3e]/50 transition-colors">
        <div className="flex items-center justify-between text-[#5d3f3e]">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Pending Invites
          </span>
          <Mail size={18} className="text-[#926e6d]" />
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-[#1f1b18] tracking-tight">
            {pendingCount}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f9dfb9] text-[#261903] border border-[#dbc39f]">
            <span>Awaiting acceptance</span>
          </span>
        </div>
        <div className="mt-2 text-xs text-[#5d3f3e]">
          Links valid for 24 hours
        </div>
      </div>
    </div>
  );
}
