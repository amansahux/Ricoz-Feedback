import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../apis/team.api';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useAuth } from '../../auth/hook/useAuth';

/**
 * Standard Query Keys for Team & Invitations
 */
export const TEAM_QUERY_KEYS = {
  all: ['team'],
  members: () => [...TEAM_QUERY_KEYS.all, 'members'],
  member: (id) => [...TEAM_QUERY_KEYS.all, 'member', id],
  invitation: (token) => ['invitation', token],
};

/**
 * Custom hook to manage all Team operations with TanStack Query & React optimizations
 */
export const useTeam = ({
  memberId,
  invitationToken,
} = {}) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Local UI State (Managed in Hook Layer)
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal and Active Action States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [changeRoleModalData, setChangeRoleModalData] = useState(null); // { member }
  const [deactivateModalData, setDeactivateModalData] = useState(null); // { member }
  const [removeModalData, setRemoveModalData] = useState(null); // { member }

  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // -------------------------------------------------------------
  // 1. Queries
  // -------------------------------------------------------------

  // Fetch all members & pending invitations for the current organization
  const membersQuery = useQuery({
    queryKey: TEAM_QUERY_KEYS.members(),
    queryFn: teamApi.getMembers,
    staleTime: 1000 * 60 * 3, // 3 minutes stale time
    select: (res) => ({
      members: res?.data || [],
      pendingInvitations: res?.pendingInvitations || [],
    }),
  });

  // Fetch individual member details (enabled only if memberId is provided)
  const memberDetailsQuery = useQuery({
    queryKey: TEAM_QUERY_KEYS.member(memberId),
    queryFn: () => teamApi.getMemberById(memberId),
    enabled: Boolean(memberId),
    staleTime: 1000 * 60 * 5,
    select: (res) => res?.data || null,
  });

  // Fetch public invitation details by token (enabled only if invitationToken is provided)
  const invitationQuery = useQuery({
    queryKey: TEAM_QUERY_KEYS.invitation(invitationToken),
    queryFn: () => teamApi.getInvitationByToken(invitationToken),
    enabled: Boolean(invitationToken),
    retry: 1,
    staleTime: 1000 * 60 * 10,
    select: (res) => res?.data || null,
  });

  // -------------------------------------------------------------
  // 2. Mutations
  // -------------------------------------------------------------

  // Invite Member
  const inviteMemberMutation = useMutation({
    mutationFn: (payload) => teamApi.inviteMember(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      setIsInviteModalOpen(false);
      showToast(`Invitation successfully sent to ${variables.email}`, 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send invitation';
      showToast(msg, 'error');
    },
  });

  // Update Member Role
  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ memberId: targetMemberId, role }) =>
      teamApi.updateMemberRole({ memberId: targetMemberId, role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.member(variables.memberId) });
      setChangeRoleModalData(null);
      showToast(`Role updated successfully`, 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update member role';
      showToast(msg, 'error');
    },
  });

  // Update Member Status (Active <-> Inactive)
  const updateMemberStatusMutation = useMutation({
    mutationFn: ({ memberId: targetMemberId, status }) =>
      teamApi.updateMemberStatus({ memberId: targetMemberId, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.member(variables.memberId) });
      setDeactivateModalData(null);
      const isDeactivating = variables.status === 'inactive';
      showToast(
        isDeactivating ? `Member has been deactivated` : `Member reactivated successfully`,
        'success'
      );
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update member status';
      showToast(msg, 'error');
    },
  });

  // Remove Member
  const removeMemberMutation = useMutation({
    mutationFn: (targetMemberId) => teamApi.removeMember(targetMemberId),
    onSuccess: (_, targetMemberId) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      queryClient.removeQueries({ queryKey: TEAM_QUERY_KEYS.member(targetMemberId) });
      setRemoveModalData(null);
      showToast(`Member removed from organization`, 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to remove member';
      showToast(msg, 'error');
    },
  });

  // Accept Public Invitation
  const acceptInvitationMutation = useMutation({
    mutationFn: (payload) => teamApi.acceptInvitation(payload),
    onSuccess: () => {
      showToast('Invitation accepted! Welcome to the team.', 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to accept invitation';
      showToast(msg, 'error');
    },
  });

  // -------------------------------------------------------------
  // 3. React Optimizations (useMemo & Calculations)
  // -------------------------------------------------------------

  const rawMembers = useMemo(() => membersQuery.data?.members || [], [membersQuery.data?.members]);
  const rawPendingInvitations = useMemo(
    () => membersQuery.data?.pendingInvitations || [],
    [membersQuery.data?.pendingInvitations]
  );

  // Optimized Filtering & Search computation on members
  const filteredMembers = useMemo(() => {
    if (!rawMembers.length) return [];

    const normalizedQuery = debouncedSearchQuery.trim().toLowerCase();

    return rawMembers.filter((member) => {
      // Role filter
      if (filterRole !== 'ALL') {
        const targetRole = filterRole.toLowerCase().replace(/\s+/g, '_');
        const memberRole = (member.role || '').toLowerCase();
        if (memberRole !== targetRole && member.role !== filterRole) {
          return false;
        }
      }
      // Status filter
      if (filterStatus !== 'ALL') {
        const targetStatus = filterStatus.toLowerCase();
        const memberStatus = (member.status || '').toLowerCase();
        if (memberStatus !== targetStatus) {
          return false;
        }
      }
      // Search by Name or Email
      if (normalizedQuery) {
        const name = (member.name || '').toLowerCase();
        const email = (member.email || '').toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      }
      return true;
    });
  }, [rawMembers, filterRole, filterStatus, debouncedSearchQuery]);

  // Paginated Members computation
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Optimized statistics calculation
  const stats = useMemo(() => {
    const totalMembers = rawMembers.length;
    const activeMembers = rawMembers.filter((m) => (m.status || '').toLowerCase() === 'active').length;
    const inactiveMembers = totalMembers - activeMembers;
    const pendingCount = rawPendingInvitations.length;

    // Role distributions
    const roleDistribution = rawMembers.reduce((acc, curr) => {
      const role = curr.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const seatUtilization = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      pendingCount,
      roleDistribution,
      seatUtilization,
    };
  }, [rawMembers, rawPendingInvitations]);

  // Reset filters helper
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setCurrentPage(1);
  }, []);

  // Export report helper (CSV trigger)
  const exportTeamReport = useCallback(() => {
    if (!rawMembers.length) {
      showToast('No members to export', 'info');
      return;
    }
    const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
    const rows = rawMembers.map((m) => [
      `"${m.name || 'Unknown'}"`,
      `"${m.email || ''}"`,
      `"${m.role || ''}"`,
      `"${m.status || ''}"`,
      `"${m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `team-members-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Team report exported successfully', 'success');
  }, [rawMembers, showToast]);

  // Helper to check if current logged-in user is Owner
  const isCurrentUserOwner = useMemo(() => {
    return currentUser?.role === 'owner';
  }, [currentUser]);

  // Invalidate queries helper
  const invalidateTeamData = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.all });
  }, [queryClient]);

  // -------------------------------------------------------------
  // 4. Return Object
  // -------------------------------------------------------------
  return {
    // Current User Info
    currentUser,
    isCurrentUserOwner,

    // Data lists & stats
    members: paginatedMembers,
    allFilteredMembers: filteredMembers,
    rawMembers,
    pendingInvitations: rawPendingInvitations,
    selectedMember: memberDetailsQuery.data,
    invitationDetails: invitationQuery.data,
    stats,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,
    totalCount: rawMembers.length,
    filteredCount: filteredMembers.length,

    // Filter controls
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    hasActiveFilters: Boolean(searchQuery.trim() || filterRole !== 'ALL' || filterStatus !== 'ALL'),
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

    // Actions & Handlers
    exportTeamReport,
    inviteMember: inviteMemberMutation.mutateAsync,
    isInvitingMember: inviteMemberMutation.isPending,
    updateMemberRole: updateMemberRoleMutation.mutateAsync,
    isUpdatingRole: updateMemberRoleMutation.isPending,
    updateMemberStatus: updateMemberStatusMutation.mutateAsync,
    isUpdatingStatus: updateMemberStatusMutation.isPending,
    removeMember: removeMemberMutation.mutateAsync,
    isRemovingMember: removeMemberMutation.isPending,
    acceptInvitation: acceptInvitationMutation.mutateAsync,
    isAcceptingInvitation: acceptInvitationMutation.isPending,

    // Query states
    isLoadingMembers: membersQuery.isLoading,
    isFetchingMembers: membersQuery.isFetching,
    isMembersError: membersQuery.isError,
    membersError: membersQuery.error,
    refetchMembers: membersQuery.refetch,
    invalidateTeamData,
  };
};

export default useTeam;
