import React, { useState } from "react";
import { useParams, Link } from "react-router";
import useTeam from "../../hooks/useTeam.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";
import MemberProfileHeader from "../components/Member/MemberProfileHeader.jsx";
import MemberInfoCards from "../components/Member/MemberInfoCards.jsx";
import MemberOperationalStats from "../components/Member/MemberOperationalStats.jsx";
import MemberFeedbackWorkload from "../components/Member/MemberFeedbackWorkload.jsx";
import MemberActivitySidebar from "../components/Member/MemberActivitySidebar.jsx";
import {
  ChangeRoleModal,
  DeactivateMemberModal,
  RemoveMemberModal,
} from "../components/TeamModals.jsx";
import { Users, AlertCircle, ArrowLeft } from "lucide-react";

export default function MemberDetail() {
  const { memberId } = useParams();

  const {
    currentUser,
    isCurrentUserOwner,
    selectedMember,
    isLoadingMemberDetails,
    memberDetailsError,
    updateMemberRole,
    isUpdatingRole,
    updateMemberStatus,
    isUpdatingStatus,
    removeMember,
    isRemovingMember,
    toast,
    showToast,
    hideToast,
  } = useTeam({ memberId });

  // Modal active triggers
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Loading skeleton
  if (isLoadingMemberDetails) {
    return (
      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-4 animate-pulse">
        <div className="h-6 w-32 bg-[#eae1db] rounded" />
        <div className="h-32 bg-white rounded-2xl border border-[#eae1db]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 bg-white rounded-xl border border-[#eae1db]" />
          <div className="h-28 bg-white rounded-xl border border-[#eae1db]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-white rounded-xl border border-[#eae1db]" />
          <div className="h-24 bg-white rounded-xl border border-[#eae1db]" />
          <div className="h-24 bg-white rounded-xl border border-[#eae1db]" />
          <div className="h-24 bg-white rounded-xl border border-[#eae1db]" />
        </div>
      </div>
    );
  }

  // Error state
  if (memberDetailsError || !selectedMember) {
    return (
      <div className="w-full max-w-[1440px] mx-auto py-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#bb0028] flex items-center justify-center mb-3">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-semibold text-[#1f1b18]">Team Member Not Found</h2>
        <p className="text-xs text-[#5d3f3e] max-w-sm mt-1 mb-5">
          The requested member could not be loaded or is no longer part of this workspace.
        </p>
        <Link
          to="/team"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#bb0028] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-[#e61337] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Team Directory</span>
        </Link>
      </div>
    );
  }

  const isTargetOwner = selectedMember.role === "owner";

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-2 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* 1. Header Profile Banner */}
      <MemberProfileHeader
        member={selectedMember}
        isOwnerView={isCurrentUserOwner}
        isTargetOwner={isTargetOwner}
        onChangeRole={() => setIsRoleModalOpen(true)}
        onToggleStatus={() => setIsDeactivateModalOpen(true)}
        onRemove={() => setIsRemoveModalOpen(true)}
        showToast={showToast}
      />

      {/* 2. Identity & Governance Cards */}
      <MemberInfoCards member={selectedMember} />

      {/* 3. Operational Performance Stats */}
      <MemberOperationalStats />

      {/* 4. Two-Column Operational Workspace (Workload Table & Activity Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (~65% / 8 Cols): Feedback Workload & Conversations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <MemberFeedbackWorkload memberName={selectedMember.name} />
        </div>

        {/* Right Column (~35% / 4 Cols): Activity Timeline & Status Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <MemberActivitySidebar
            member={selectedMember}
            isOwnerView={isCurrentUserOwner}
            isTargetOwner={isTargetOwner}
            onToggleStatus={() => setIsDeactivateModalOpen(true)}
            isLoadingStatus={isUpdatingStatus}
          />
        </div>
      </div>

      {/* ------------------- ACTION MODALS ------------------- */}

      {/* Change Role Modal */}
      <ChangeRoleModal
        member={selectedMember}
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSubmit={async (payload) => {
          await updateMemberRole(payload);
          setIsRoleModalOpen(false);
        }}
        isLoading={isUpdatingRole}
      />

      {/* Deactivate / Reactivate Modal */}
      <DeactivateMemberModal
        member={selectedMember}
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onSubmit={async (payload) => {
          await updateMemberStatus(payload);
          setIsDeactivateModalOpen(false);
        }}
        isLoading={isUpdatingStatus}
      />

      {/* Remove Member Modal */}
      <RemoveMemberModal
        member={selectedMember}
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onSubmit={async (id) => {
          await removeMember(id);
          setIsRemoveModalOpen(false);
          window.location.href = "/team";
        }}
        isLoading={isRemovingMember}
      />
    </div>
  );
}