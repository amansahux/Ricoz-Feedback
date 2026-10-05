import React from "react";
import { History, Shield, UserX, UserCheck, ShieldCheck } from "lucide-react";

export default function MemberActivitySidebar({
  member,
  isOwnerView,
  isTargetOwner,
  onToggleStatus,
  isLoadingStatus,
}) {
  const isActive = (member?.status || "").toLowerCase() === "active";

  const timelineItems = [
    {
      id: "act-1",
      dotClass: "border-emerald-600 bg-emerald-600",
      content: (
        <>
          Resolved feedback{" "}
          <span className="text-[#bb0028] font-medium">#RF-1048</span> from Rohit Kumar
        </>
      ),
      time: "2 hours ago",
    },
    {
      id: "act-2",
      dotClass: "border-[#bb0028] bg-[#bb0028]",
      content: (
        <>
          Replied to customer{" "}
          <span className="font-semibold text-[#1f1b18]">Ananya Singh</span> regarding billing query
        </>
      ),
      time: "4 hours ago",
    },
    {
      id: "act-3",
      dotClass: "border-[#6e5c3e] bg-[#6e5c3e]",
      content: (
        <>
          Updated feedback status to{" "}
          <span className="text-[#6e5c3e] font-semibold">In Progress</span> on{" "}
          <span className="text-[#bb0028] font-medium">#RF-1042</span>
        </>
      ),
      time: "Yesterday",
    },
    {
      id: "act-4",
      dotClass: "border-[#926e6d] bg-[#926e6d]",
      content: (
        <>
          Added internal note on <span className="font-semibold">Acme Clothing</span> quarterly survey
        </>
      ),
      time: "Yesterday",
    },
    {
      id: "act-5",
      dotClass: "border-[#dbc39f] bg-[#dbc39f]",
      content: (
        <>
          Assigned feedback <span className="text-[#bb0028] font-medium">#RF-1039</span> to self
        </>
      ),
      time: "Sep 29, 2026",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Recent Activity Timeline */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#1f1b18]">
              Recent activity
            </h3>
            <p className="text-xs text-[#5d3f3e]">
              Actions performed by this member
            </p>
          </div>
          <History size={16} className="text-[#926e6d]" />
        </div>

        {/* Minimal Timeline */}
        <div className="relative pl-5 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#eae1db]">
          {timelineItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -left-5 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#eae1db] flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${item.dotClass}`} />
              </div>
              <div>
                <p className="text-xs text-[#1f1b18] leading-snug">
                  {item.content}
                </p>
                <span className="text-[11px] text-[#926e6d] mt-0.5 block">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Account Status Management Card */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-[#1f1b18] mb-0.5">
          Account status
        </h3>
        <p className="text-xs text-[#5d3f3e] mb-4">
          Governance policy and access controls
        </p>

        <div className="p-3.5 rounded-lg bg-[#fbf2ec] border border-[#eae1db] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isActive
                  ? "bg-emerald-600 ring-4 ring-emerald-100"
                  : "bg-[#926e6d] ring-4 ring-[#eae1db]"
              }`}
            />
            <div>
              <p className="text-xs font-semibold text-[#1f1b18]">
                {isActive ? "Active Member" : "Inactive Member"}
              </p>
              <p className="text-[11px] text-[#5d3f3e]">
                {isTargetOwner
                  ? "Protected Organization Owner"
                  : `${member?.role?.replace("_", " ") || "Member"} permissions`}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[#6e5c3e] bg-[#f9dfb9]/60 px-2 py-0.5 rounded">
            2FA Active
          </span>
        </div>

        {/* Status Toggle Button */}
        {isOwnerView && !isTargetOwner && (
          <button
            onClick={onToggleStatus}
            disabled={isLoadingStatus}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border shadow-xs ${
              isActive
                ? "text-[#bb0028] hover:bg-red-50 border-red-200 bg-white"
                : "text-emerald-700 hover:bg-emerald-50 border-emerald-200 bg-white"
            }`}
          >
            {isActive ? (
              <>
                <UserX size={15} />
                <span>{isLoadingStatus ? "Updating..." : "Deactivate member"}</span>
              </>
            ) : (
              <>
                <UserCheck size={15} />
                <span>{isLoadingStatus ? "Updating..." : "Reactivate member"}</span>
              </>
            )}
          </button>
        )}

        <p className="text-[11px] text-[#926e6d] mt-3 leading-relaxed">
          RBAC access is governed by Enterprise Workspace security protocols. Modifying credentials will trigger an audit log entry.
        </p>
      </div>
    </div>
  );
}
