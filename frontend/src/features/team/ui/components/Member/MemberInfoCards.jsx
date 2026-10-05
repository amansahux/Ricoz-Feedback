import React from "react";
import { Shield, BadgeCheck, Clock, Mail, User } from "lucide-react";

export default function MemberInfoCards({ member }) {
  const roleDescription =
    member?.role === "owner"
      ? "Has complete administrative ownership of the workspace, including subscription billing, custom domain routing, and all team member permissions."
      : member?.role === "admin"
      ? "Can configure integrations, manage team members, launch surveys, export analytics, and adjust workspace settings."
      : "Handles incoming customer feedback tickets, tags issues, updates resolution status, and replies directly to respondents.";

  const joinedFormatted = member?.joinedAt
    ? new Date(member.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Profile Dossier Card */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#eae1db]/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e]">
            Profile Dossier
          </span>
          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {member?.verified ? "Verified Account" : "Registered"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3.5">
          <div>
            <p className="text-[11px] text-[#926e6d] font-medium">Full Name</p>
            <p className="text-xs sm:text-sm font-semibold text-[#1f1b18] mt-0.5 truncate">
              {member?.name || "Unnamed"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#926e6d] font-medium">Email Contact</p>
            <p
              className="text-xs sm:text-sm font-medium text-[#1f1b18] mt-0.5 truncate"
              title={member?.email}
            >
              {member?.email || "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#926e6d] font-medium">Date Joined</p>
            <p className="text-xs sm:text-sm font-medium text-[#1f1b18] mt-0.5">
              {joinedFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Governance & RBAC Card */}
      <div className="bg-white border border-[#eae1db] rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#eae1db]/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e]">
            Governance & RBAC
          </span>
          <span className="text-[11px] font-medium text-[#6e5c3e] bg-[#f9dfb9]/50 px-2 py-0.5 rounded border border-[#dbc39f]/50 capitalize">
            {member?.role?.replace("_", " ") || "Member"}
          </span>
        </div>

        <div className="flex items-start gap-3 pt-3.5">
          <div className="p-2 rounded-lg bg-[#fbf2ec] text-[#6e5c3e] shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-[#1f1b18] capitalize">
              {member?.role?.replace("_", " ") || "Support Agent"}
            </h4>
            <p className="text-xs text-[#5d3f3e] mt-1 leading-relaxed">
              {roleDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
