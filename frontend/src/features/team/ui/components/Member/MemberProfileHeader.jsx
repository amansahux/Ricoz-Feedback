import React, { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Star,
  Lock,
  Edit3,
  MoreHorizontal,
  UserX,
  UserCheck,
  Trash2,
  Activity,
} from "lucide-react";

export default function MemberProfileHeader({
  member,
  isOwnerView,
  isTargetOwner,
  onChangeRole,
  onToggleStatus,
  onRemove,
  showToast,
}) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const initials = (member?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (member?.status || "").toLowerCase() === "active";
  const roleFormatted =
    member?.role === "owner"
      ? "Workspace Owner"
      : member?.role === "admin"
      ? "Workspace Admin"
      : "Support Agent";

  const handleCopyEmail = () => {
    if (member?.email) {
      navigator.clipboard.writeText(member.email);
      setCopied(true);
      showToast?.("Email copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2">
        <Link
          to="/team"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#f6ece7] transition-colors border border-[#eae1db]"
        >
          <ArrowLeft size={14} />
          <span>Back to Team</span>
        </Link>
        <span className="text-[#926e6d]/40">/</span>
        <span className="text-xs text-[#5d3f3e] font-medium">Member Profile</span>
      </div>

      {/* Main Profile Header Card */}
      <section className="bg-white border border-[#eae1db] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        {/* Left: Avatar & Identity Details */}
        <div className="flex items-start sm:items-center gap-4.5">
          {/* Avatar */}
          <div
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shrink-0 shadow-sm ${
              isTargetOwner
                ? "bg-[#f9dfb9] text-[#261903] border-2 border-[#dbc39f]"
                : "bg-[#eae1db] text-[#1f1b18] border-2 border-[#f0e6e1]"
            }`}
          >
            {initials}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#1f1b18] tracking-tight">
                {member?.name || "Team Member"}
              </h1>

              {/* Role Badge */}
              {isTargetOwner ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#f9dfb9] text-[#554428] border border-[#dbc39f]">
                  <Star size={12} className="text-[#bb0028] fill-[#bb0028]" />
                  <span>Owner</span>
                </span>
              ) : member?.role === "admin" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#f0e6e1] text-[#1f1b18] border border-[#eae1db]">
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#eee1cb] text-[#4e4635] border border-[#e7bcbb]/60">
                  Support Agent
                </span>
              )}

              {/* Status Pill */}
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f6ece7] text-[#5d3f3e] border border-[#e7bcbb]/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#926e6d]" />
                  <span>Inactive</span>
                </span>
              )}

              {isTargetOwner && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5d3f3e] bg-[#f0e6e1] px-2 py-0.5 rounded">
                  <Lock size={11} className="text-[#926e6d]" />
                  <span>Protected</span>
                </span>
              )}
            </div>

            {/* Email & Copy */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5d3f3e]">
              <span>{member?.email}</span>
              <button
                onClick={handleCopyEmail}
                className="text-[#926e6d] hover:text-[#1f1b18] transition-colors p-0.5"
                title="Copy email"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
              <span className="text-[#eae1db]">•</span>
              <span className="text-[#6e5c3e] font-medium">
                Member ID: #{String(member?.id || member?._id || "MEM").slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          {isOwnerView && !isTargetOwner && (
            <>
              <button
                onClick={onChangeRole}
                className="px-3.5 py-2 text-xs font-semibold text-[#1f1b18] bg-white hover:bg-[#fbf2ec] border border-[#eae1db] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 size={14} className="text-[#926e6d]" />
                <span>Change role</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#fbf2ec] rounded-lg border border-[#eae1db] transition-colors"
                  title="More options"
                >
                  <MoreHorizontal size={17} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#eae1db] shadow-xl z-50 py-1.5 text-left animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onToggleStatus?.();
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2 hover:bg-[#fbf2ec] ${
                        isActive ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <UserX size={14} className="text-amber-600" />
                          <span>Deactivate member</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={14} className="text-emerald-600" />
                          <span>Reactivate member</span>
                        </>
                      )}
                    </button>

                    <div className="h-px bg-[#eae1db] my-1" />

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onRemove?.();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#bb0028] hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} className="text-[#bb0028]" />
                      <span>Remove member</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
