import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MoreVertical,
  Lock,
  Star,
  Eye,
  Edit3,
  UserX,
  UserCheck,
  Trash2,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Helper to extract initials from name
 */
function getInitials(name = "") {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Format role label nicely
 */
function formatRole(role = "") {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "support_agent") return "Support Agent";
  return role;
}

/**
 * Single Row Dropdown Action Menu
 */
function RowActionMenu({
  member,
  isCurrentUser,
  isOwnerRole,
  isTargetOwner,
  onView,
  onChangeRole,
  onToggleStatus,
  onRemove,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // If the target member is the OWNER, show protected Lock badge
  if (isTargetOwner) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5d3f3e] bg-[#f0e6e1] px-2.5 py-1 rounded-md"
        title="Organization owners cannot be modified or removed"
      >
        <Lock size={12} className="text-[#926e6d]" />
        <span>Owner</span>
      </span>
    );
  }

  // Non-owner viewers cannot modify others
  if (!isOwnerRole) {
    return (
      <span className="text-xs text-[#7d7461] italic">View only</span>
    );
  }

  const isActive = (member.status || "").toLowerCase() === "active";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-[#5d3f3e] hover:bg-[#f6ece7] transition-colors focus:outline-none"
        title="Member actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#eae1db] z-30 py-1.5 text-left animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => {
              setIsOpen(false);
              onView?.(member);
            }}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#1f1b18] hover:bg-[#fbf2ec] flex items-center gap-2"
          >
            <Eye size={14} className="text-[#926e6d]" />
            <span>View details</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onChangeRole?.(member);
            }}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#1f1b18] hover:bg-[#fbf2ec] flex items-center gap-2"
          >
            <Edit3 size={14} className="text-[#926e6d]" />
            <span>Change role</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onToggleStatus?.(member);
            }}
            className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2 hover:bg-[#fbf2ec] ${
              isActive ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {isActive ? (
              <>
                <UserX size={14} className="text-amber-600" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <UserCheck size={14} className="text-emerald-600" />
                <span>Reactivate</span>
              </>
            )}
          </button>

          <div className="h-px bg-[#eae1db] my-1" />

          <button
            onClick={() => {
              setIsOpen(false);
              onRemove?.(member);
            }}
            className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#bb0028] hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={14} className="text-[#bb0028]" />
            <span>Remove member</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function TeamTable({
  members = [],
  filteredCount = 0,
  searchQuery = "",
  setSearchQuery,
  filterRole = "ALL",
  setFilterRole,
  filterStatus = "ALL",
  setFilterStatus,
  hasActiveFilters = false,
  resetFilters,
  currentPage = 1,
  setCurrentPage,
  totalPages = 1,
  isLoading = false,
  isError = false,
  currentUserId,
  isOwner = true,
  onViewMember,
  onChangeRole,
  onToggleStatus,
  onRemoveMember,
}) {
  return (
    <section className="bg-white rounded-xl border border-[#eae1db] shadow-sm overflow-hidden flex flex-col">
      {/* Table Controls Header */}
      <div className="p-5 lg:p-6 border-b border-[#eae1db] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1f1b18]">Team members</h2>
          <p className="text-xs text-[#5d3f3e] mt-0.5">
            People currently connected to this organization workspace.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px] sm:min-w-[260px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#926e6d]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="h-9.5 pl-9 pr-4 text-xs bg-[#fff8f5] border border-[#eae1db] rounded-lg focus:outline-none focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] w-full text-[#1f1b18] placeholder:text-[#926e6d]"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-9.5 pl-3 pr-8 text-xs bg-[#fff8f5] border border-[#eae1db] rounded-lg text-[#1f1b18] focus:outline-none focus:border-[#bb0028] font-medium"
            >
              <option value="ALL">All roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="support_agent">Support Agent</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9.5 pl-3 pr-8 text-xs bg-[#fff8f5] border border-[#eae1db] rounded-lg text-[#1f1b18] focus:outline-none focus:border-[#bb0028] font-medium"
            >
              <option value="ALL">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Members Table Content */}
      <div className="overflow-x-auto min-h-[280px]">
        {isLoading ? (
          /* Loading Skeleton */
          <div className="p-6 divide-y divide-[#f6ece7]">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="py-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f6ece7]" />
                  <div className="flex flex-col gap-2">
                    <div className="h-3.5 w-32 bg-[#f6ece7] rounded" />
                    <div className="h-3 w-48 bg-[#f6ece7] rounded" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-[#f6ece7] rounded hidden sm:block" />
                <div className="h-4 w-16 bg-[#f6ece7] rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#bb0028] flex items-center justify-center mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-semibold text-[#1f1b18]">
              Unable to load team members
            </h3>
            <p className="text-xs text-[#5d3f3e] max-w-sm mt-1">
              There was an issue connecting to the organization directory service.
            </p>
          </div>
        ) : members.length === 0 ? (
          /* Empty / No Results State */
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#f0e6e1] text-[#926e6d] flex items-center justify-center mb-3">
              <Users size={24} />
            </div>
            <h4 className="text-sm font-semibold text-[#1f1b18]">
              {hasActiveFilters ? "No matching members found" : "No team members yet"}
            </h4>
            <p className="text-xs text-[#5d3f3e] max-w-sm mt-1">
              {hasActiveFilters
                ? "Try adjusting your search query or reset role & status filters."
                : "Invite your teammates to collaborate on feedback."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 px-3.5 py-1.5 bg-[#f6ece7] hover:bg-[#eae1db] text-[#1f1b18] text-xs font-semibold rounded-lg transition-colors"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          /* Table Rows */
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf2ec] text-[#5d3f3e] border-b border-[#eae1db]">
                <th className="py-3 px-5 sm:px-6 text-[11px] font-semibold uppercase tracking-wider">
                  Member
                </th>
                <th className="py-3 px-5 sm:px-6 text-[11px] font-semibold uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-5 sm:px-6 text-[11px] font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-5 sm:px-6 text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell">
                  Joined
                </th>
                <th className="py-3 px-5 sm:px-6 text-[11px] font-semibold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6ece7]">
              {members.map((member) => {
                const isTargetOwner = member.role === "owner";
                const isCurrentLoggedInUser =
                  member.userId === currentUserId || member.id === currentUserId;
                const isActive = (member.status || "").toLowerCase() === "active";

                // Format role badge styling
                const roleBadge = isTargetOwner ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f9dfb9]/80 text-[#554428] border border-[#dbc39f]">
                    <Star size={11} className="text-[#bb0028] fill-[#bb0028]" />
                    <span>Owner</span>
                  </span>
                ) : member.role === "admin" ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#f0e6e1] text-[#1f1b18] border border-[#eae1db]">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#eee1cb] text-[#4e4635] border border-[#e7bcbb]/50">
                    Support Agent
                  </span>
                );

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-[#fbf2ec]/50 transition-colors ${
                      !isActive ? "opacity-75" : ""
                    }`}
                  >
                    {/* Member Column */}
                    <td className="py-3.5 px-5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                            isTargetOwner
                              ? "bg-[#f9dfb9] text-[#261903] border border-[#dbc39f]"
                              : "bg-[#eae1db] text-[#1f1b18]"
                          }`}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-semibold text-[#1f1b18] truncate">
                              {member.name || "Unnamed"}
                            </span>
                            {isCurrentLoggedInUser && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#f0e6e1] text-[#5d3f3e] font-medium">
                                (You)
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] sm:text-xs text-[#5d3f3e] truncate">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="py-3.5 px-5 sm:px-6">{roleBadge}</td>

                    {/* Status Column */}
                    <td className="py-3.5 px-5 sm:px-6">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f6ece7] text-[#5d3f3e] border border-[#e7bcbb]/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#926e6d]" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* Joined Date Column */}
                    <td className="py-3.5 px-5 sm:px-6 text-xs text-[#5d3f3e] hidden md:table-cell">
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Action Menu Column */}
                    <td className="py-3.5 px-5 sm:px-6 text-right">
                      <RowActionMenu
                        member={member}
                        isCurrentUser={isCurrentLoggedInUser}
                        isOwnerRole={isOwner}
                        isTargetOwner={isTargetOwner}
                        onView={onViewMember}
                        onChangeRole={onChangeRole}
                        onToggleStatus={onToggleStatus}
                        onRemove={onRemoveMember}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer with Pagination Summary */}
      <div className="p-4 px-6 border-t border-[#eae1db] bg-white flex items-center justify-between text-xs text-[#5d3f3e]">
        <span>
          Showing {members.length} of {filteredCount} members
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border border-[#eae1db] ${
                currentPage === 1
                  ? "text-[#926e6d]/40 cursor-not-allowed bg-[#fff8f5]"
                  : "text-[#1f1b18] hover:bg-[#f6ece7]"
              }`}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-medium text-[#1f1b18]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, Math.min(totalPages, p + 1)))}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border border-[#eae1db] ${
                currentPage === totalPages
                  ? "text-[#926e6d]/40 cursor-not-allowed bg-[#fff8f5]"
                  : "text-[#1f1b18] hover:bg-[#f6ece7]"
              }`}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
