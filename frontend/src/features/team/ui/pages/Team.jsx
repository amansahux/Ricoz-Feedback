import React, { useState } from "react";
import { useNavigate } from "react-router";
import useTeam from "../../hooks/useTeam.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";
import TeamHeader from "../components/TeamHeader.jsx";
import TeamStats from "../components/TeamStats.jsx";
import TeamTable from "../components/TeamTable.jsx";
import PendingInvitations from "../components/PendingInvitations.jsx";
import {
  InviteMemberModal,
  ChangeRoleModal,
  DeactivateMemberModal,
  RemoveMemberModal,
  MemberDetailsModal,
} from "../components/TeamModals.jsx";

export default function Team() {
  const navigate = useNavigate();
  const {
    // Current User
    currentUser,
    isCurrentUserOwner,

    // Data lists & stats
    members,
    filteredCount,
    pendingInvitations,
    stats,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Filter controls
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    hasActiveFilters,
    resetFilters,

    // Modals state & handlers
    isInviteModalOpen,
    setIsInviteModalOpen,
    changeRoleModalData,
    setChangeRoleModalData,
    deactivateModalData,
    setDeactivateModalData,
    removeModalData,
    setRemoveModalData,

    // Toast
    toast,
    showToast,
    hideToast,

    // Actions
    exportTeamReport,
    inviteMember,
    isInvitingMember,
    updateMemberRole,
    isUpdatingRole,
    updateMemberStatus,
    isUpdatingStatus,
    removeMember,
    isRemovingMember,

    // Query states
    isLoadingMembers,
    isMembersError,
  } = useTeam();

  // Local state for view details modal
  const [viewMemberData, setViewMemberData] = useState(null);

  // Resend invitation handler
  const handleResendInvite = async (invitation) => {
    try {
      await inviteMember({ email: invitation.email, role: invitation.role });
    } catch (err) {
      // Error handled inside hook
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-7 py-2 animate-in fade-in duration-200">
      {/* Global Toast Notification */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* 1. Header Section */}
      <TeamHeader
        onOpenInvite={() => setIsInviteModalOpen(true)}
        onExportReport={exportTeamReport}
        isOwner={isCurrentUserOwner}
      />

      {/* 2. Summary Metrics KPI Cards */}
      <TeamStats stats={stats} />

      {/* 3. Team Members Directory Table */}
      <TeamTable
        members={members}
        filteredCount={filteredCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        isLoading={isLoadingMembers}
        isError={isMembersError}
        currentUserId={currentUser?._id || currentUser?.id}
        isOwner={isCurrentUserOwner}
        onViewMember={(member) => navigate(`/team/${member.id || member._id}`)}
        onChangeRole={(member) => setChangeRoleModalData(member)}
        onToggleStatus={(member) => setDeactivateModalData(member)}
        onRemoveMember={(member) => setRemoveModalData(member)}
      />

      {/* 4. Pending Invitations Section */}
      <PendingInvitations
        pendingInvitations={pendingInvitations}
        onOpenInvite={() => setIsInviteModalOpen(true)}
        onResendInvite={handleResendInvite}
        isResending={isInvitingMember}
        isOwner={isCurrentUserOwner}
      />

      {/* ------------------- MODALS ------------------- */}
      
      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={inviteMember}
        isLoading={isInvitingMember}
      />

      {/* Change Role Modal */}
      <ChangeRoleModal
        member={changeRoleModalData}
        isOpen={Boolean(changeRoleModalData)}
        onClose={() => setChangeRoleModalData(null)}
        onSubmit={updateMemberRole}
        isLoading={isUpdatingRole}
      />

      {/* Deactivate / Reactivate Modal */}
      <DeactivateMemberModal
        member={deactivateModalData}
        isOpen={Boolean(deactivateModalData)}
        onClose={() => setDeactivateModalData(null)}
        onSubmit={updateMemberStatus}
        isLoading={isUpdatingStatus}
      />

      {/* Remove Member Modal */}
      <RemoveMemberModal
        member={removeModalData}
        isOpen={Boolean(removeModalData)}
        onClose={() => setRemoveModalData(null)}
        onSubmit={removeMember}
        isLoading={isRemovingMember}
      />

      {/* View Member Profile Modal */}
      <MemberDetailsModal
        member={viewMemberData}
        isOpen={Boolean(viewMemberData)}
        onClose={() => setViewMemberData(null)}
      />
    </div>
  );
}