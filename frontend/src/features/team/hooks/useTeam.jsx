import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { teamApi } from '../apis/team.api';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useAuth } from '../../auth/hook/useAuth';

/**
 * Standard Query Keys for Team & Invitations
 */
export const TEAM_QUERY_KEYS = {
  all: ['team'],
  members: () => [...TEAM_QUERY_KEYS.all, 'members'],
  membersList: (params) => [...TEAM_QUERY_KEYS.members(), params],
  member: (id) => [...TEAM_QUERY_KEYS.all, 'member', id],
  invitation: (token) => ['invitation', token],
};

/**
 * Custom hook to manage all Team operations with Server-side Pagination/Search/Filters, TanStack Query & React optimizations
 */
export const useTeam = ({
  memberId,
  invitationToken,
} = {}) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 350);
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [changeRoleModalData, setChangeRoleModalData] = useState(null);
  const [deactivateModalData, setDeactivateModalData] = useState(null);
  const [removeModalData, setRemoveModalData] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Handler to safely set search query and reset pagination to page 1
  const handleSetSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Handler to safely set filter role and reset pagination to page 1
  const handleSetFilterRole = useCallback((role) => {
    setFilterRole(role);
    setCurrentPage(1);
  }, []);

  // Handler to safely set filter status and reset pagination to page 1
  const handleSetFilterStatus = useCallback((status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  }, []);

  // -------------------------------------------------------------
  // 1. Server-side Query Parameters
  // -------------------------------------------------------------
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }
    if (filterRole !== 'ALL') {
      params.role = filterRole;
    }
    if (filterStatus !== 'ALL') {
      params.status = filterStatus;
    }
    return params;
  }, [currentPage, pageSize, debouncedSearchQuery, filterRole, filterStatus]);

  // -------------------------------------------------------------
  // 2. TanStack Query
  // -------------------------------------------------------------

  // Fetch paginated, filtered members & aggregate org stats from server
  const membersQuery = useQuery({
    queryKey: TEAM_QUERY_KEYS.membersList(queryParams),
    queryFn: () => teamApi.getMembers(queryParams),
    placeholderData: keepPreviousData, // Smooth transitions between pagination & search
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    select: (res) => ({
      members: res?.data || [],
      pendingInvitations: res?.pendingInvitations || [],
      pagination: res?.pagination || {
        total: res?.data?.length || 0,
        page: currentPage,
        limit: pageSize,
        totalPages: 1,
      },
      stats: res?.stats || {
        totalMembers: res?.data?.length || 0,
        activeMembers: (res?.data || []).filter((m) => m.status === 'active').length,
        inactiveMembers: 0,
        pendingCount: (res?.pendingInvitations || []).length,
        seatUtilization: 100,
        roleDistribution: {},
      },
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
  // 3. Mutations
  // -------------------------------------------------------------

  // Invite Member Mutation
  const inviteMemberMutation = useMutation({
    mutationFn: (payload) => teamApi.inviteMember(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      setIsInviteModalOpen(false);
      showToast(`Invitation successfully sent to ${variables.email}`, 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send invitation';
      showToast(msg, 'error');
    },
  });

  // Update Member Role Mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ memberId: targetMemberId, role }) =>
      teamApi.updateMemberRole({ memberId: targetMemberId, role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.member(variables.memberId) });
      setChangeRoleModalData(null);
      showToast('Role updated successfully', 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update member role';
      showToast(msg, 'error');
    },
  });

  // Update Member Status Mutation (Active <-> Inactive)
  const updateMemberStatusMutation = useMutation({
    mutationFn: ({ memberId: targetMemberId, status }) =>
      teamApi.updateMemberStatus({ memberId: targetMemberId, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.member(variables.memberId) });
      setDeactivateModalData(null);
      const isDeactivating = variables.status === 'inactive';
      showToast(
        isDeactivating ? 'Member has been deactivated' : 'Member reactivated successfully',
        'success'
      );
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update member status';
      showToast(msg, 'error');
    },
  });

  // Remove Member Mutation
  const removeMemberMutation = useMutation({
    mutationFn: (targetMemberId) => teamApi.removeMember(targetMemberId),
    onSuccess: (_, targetMemberId) => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.members() });
      queryClient.removeQueries({ queryKey: TEAM_QUERY_KEYS.member(targetMemberId) });
      setRemoveModalData(null);
      showToast('Member removed from organization', 'success');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to remove member';
      showToast(msg, 'error');
    },
  });

  // Accept Public Invitation Mutation
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
  // 4. Memoized Data Selectors
  // -------------------------------------------------------------

  const members = useMemo(() => membersQuery.data?.members || [], [membersQuery.data?.members]);
  const pendingInvitations = useMemo(
    () => membersQuery.data?.pendingInvitations || [],
    [membersQuery.data?.pendingInvitations]
  );
  const pagination = useMemo(
    () => membersQuery.data?.pagination || { total: 0, page: 1, limit: pageSize, totalPages: 1 },
    [membersQuery.data?.pagination, pageSize]
  );
  const stats = useMemo(
    () =>
      membersQuery.data?.stats || {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        pendingCount: 0,
        roleDistribution: {},
        seatUtilization: 0,
      },
    [membersQuery.data?.stats]
  );

  // Filter indicator
  const hasActiveFilters = useMemo(() => {
    return Boolean(searchQuery.trim() || filterRole !== 'ALL' || filterStatus !== 'ALL');
  }, [searchQuery, filterRole, filterStatus]);

  // Reset filters helper
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setCurrentPage(1);
  }, []);

  // Check if current user is owner
  const isCurrentUserOwner = useMemo(() => {
    return currentUser?.role === 'owner';
  }, [currentUser?.role]);

  // Export report helper (CSV trigger)
  const exportTeamReport = useCallback(async () => {
    try {
      showToast('Preparing export report...', 'info');
      // Fetch all members for export without pagination limits
      const allMembersData = await teamApi.getMembers({ limit: 1000 });
      const rawList = allMembersData?.data || [];
      if (!rawList.length) {
        showToast('No members to export', 'info');
        return;
      }
      const headers = ['Name', 'Email', 'Role', 'Status', 'Joined Date'];
      const rows = rawList.map((m) => [
        `"${m.name || 'Unknown'}"`,
        `"${m.email || ''}"`,
        `"${m.role || ''}"`,
        `"${m.status || ''}"`,
        `"${m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : ''}"`,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `team-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Team report exported successfully', 'success');
    } catch (err) {
      showToast('Failed to export team report', 'error');
    }
  }, [showToast]);

  // Invalidate queries helper
  const invalidateTeamData = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEYS.all });
  }, [queryClient]);

  // -------------------------------------------------------------
  // 5. Return Hook API
  // -------------------------------------------------------------
  return {
    // Current User Info
    currentUser,
    isCurrentUserOwner,

    // Data lists & stats
    members,
    pendingInvitations,
    selectedMember: memberDetailsQuery.data,
    invitationDetails: invitationQuery.data,
    stats,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages: pagination.totalPages,
    pageSize,
    totalCount: stats.totalMembers,
    filteredCount: pagination.total,

    // Filter controls
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filterRole,
    setFilterRole: handleSetFilterRole,
    filterStatus,
    setFilterStatus: handleSetFilterStatus,
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
