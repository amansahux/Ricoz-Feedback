import React from "react";
import { Plus, Download } from "lucide-react";

export default function TeamHeader({ onOpenInvite, onExportReport, isOwner = true }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#eae1db]/60">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-[#f0e6e1] text-[#5d3f3e]">
            Team
          </span>
          <span className="text-[12px] text-[#6e5c3e] font-medium">
            OrganizationMember RBAC
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1f1b18]">
          Your team
        </h1>
        <p className="text-sm text-[#5d3f3e] max-w-2xl">
          Manage the people who help you collect, understand, and resolve customer feedback across your organization touchpoints.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#f9dfb9]/40 hover:bg-[#f9dfb9]/70 text-[#261903] text-xs font-semibold rounded-lg border border-[#e7bcbb]/60 transition-colors shadow-sm"
          title="Export team members directory as CSV"
        >
          <Download size={15} />
          <span>Export Report</span>
        </button>

        {isOwner && (
          <button
            onClick={onOpenInvite}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold rounded-lg shadow-sm shadow-[#bb0028]/20 hover:shadow-md hover:shadow-[#bb0028]/30 transition-all duration-150"
          >
            <Plus size={16} />
            <span>Invite member</span>
          </button>
        )}
      </div>
    </div>
  );
}
