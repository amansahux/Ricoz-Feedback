import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../apis/team.api';

/**
 * Standard Query Keys for Team & Invitations
 */
export const teamKeys = {
  all: ['team'],
  members: () => [...teamKeys.all, 'members'],
  member: (id) => [...teamKeys.all, 'member', id],
  invitation: (token) => ['invitation', token],
};

/**
 * Custom hook to manage all Team operations with TanStack Query & React optimizations
 * 
 * @param {Object} options
 * @param {string} [options.memberId] - Optional member ID to fetch specific member details
 * @param {string} [options.invitationToken] - Optional invitation token to fetch/verify invitation
 * @param {string} [options.filterRole] - Optional filter for member list by role
 * @param {string} [options.filterStatus] - Optional filter for member list by status
 * @param {string} [options.searchQuery] - Optional search query to filter by name/email
 */
export const useTeam = ({
  memberId,
  invitationToken,
  filterRole = 'all',
  filterStatus = 'all',
  searchQuery = '',
} = {}) => {
  const queryClient = useQueryClient();

  // -------------------------------------------------------------
  // 1. Queries
  // -------------------------------------------------------------

  // Fetch all members & pending invitations for the current organization
  const membersQuery = useQuery({
    queryKey: teamKeys.members(),
    queryFn: teamApi.getMembers,
    staleTime: 1000 * 60 * 3, // 3 minutes stale time
    select: (data) => ({
      members: data?.data || [],
      pendingInvitations: data?.pendingInvitations || [],
    }),
  });

  // Fetch individual member details (enabled only if memberId is provided)
  const memberDetailsQuery = useQuery({
    queryKey: teamKeys.member(memberId),
    queryFn: () => teamApi.getMemberById(memberId),
    enabled: Boolean(memberId),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data || null,
  });

  // Fetch public invitation details by token (enabled only if invitationToken is provided)
  const invitationQuery = useQuery({
    queryKey: teamKeys.invitation(invitationToken),
    queryFn: () => teamApi.getInvitationByToken(invitationToken),
    enabled: Boolean(invitationToken),
    retry: 1,
    staleTime: 1000 * 60 * 10,
    select: (data) => data?.data || null,
  });

  // -------------------------------------------------------------
  // 2. Mutations
  // -------------------------------------------------------------

  // Invite Member
  const inviteMemberMutation = useMutation({
    mutationFn: (payload) => teamApi.inviteMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
    },
  });

  // Update Member Role
  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ memberId: targetMemberId, role }) =>
      teamApi.updateMemberRole({ memberId: targetMemberId, role }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamKeys.member(variables.memberId) });
    },
  });

  // Update Member Status
  const updateMemberStatusMutation = useMutation({
    mutationFn: ({ memberId: targetMemberId, status }) =>
      teamApi.updateMemberStatus({ memberId: targetMemberId, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      queryClient.invalidateQueries({ queryKey: teamKeys.member(variables.memberId) });
    },
  });

  // Remove Member
  const removeMemberMutation = useMutation({
    mutationFn: (targetMemberId) => teamApi.removeMember(targetMemberId),
    onSuccess: (_, targetMemberId) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members() });
      queryClient.removeQueries({ queryKey: teamKeys.member(targetMemberId) });
    },
  });

  // Accept Public Invitation
  const acceptInvitationMutation = useMutation({
    mutationFn: (payload) => teamApi.acceptInvitation(payload),
  });

  // -------------------------------------------------------------
  // 3. React Optimizations (useMemo & calculations)
  // -------------------------------------------------------------

  const rawMembers = membersQuery.data?.members || [];
  const rawPendingInvitations = membersQuery.data?.pendingInvitations || [];

  // Optimized Filtering & Search computation on members
  const filteredMembers = useMemo(() => {
    if (!rawMembers.length) return [];

    const normalizedQuery = searchQuery.trim().toLowerCase();

    return rawMembers.filter((member) => {
      // Role filter
      if (filterRole !== 'all' && member.role !== filterRole) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'all' && member.status !== filterStatus) {
        return false;
      }
      // Search by Name or Email
      if (normalizedQuery) {
        const name = (member.name || member.user?.name || '').toLowerCase();
        const email = (member.email || member.user?.email || '').toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      }
      return true;
    });
  }, [rawMembers, filterRole, filterStatus, searchQuery]);

  // Optimized statistics calculation
  const stats = useMemo(() => {
    const totalMembers = rawMembers.length;
    const activeMembers = rawMembers.filter((m) => m.status === 'active').length;
    const inactiveMembers = totalMembers - activeMembers;
    const pendingCount = rawPendingInvitations.length;

    // Role distributions
    const roleDistribution = rawMembers.reduce((acc, curr) => {
      const role = curr.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      pendingCount,
      roleDistribution,
    };
  }, [rawMembers, rawPendingInvitations]);

  // Callback helper to manually invalidate all team data
  const invalidateTeamData = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: teamKeys.all });
  }, [queryClient]);

  // -------------------------------------------------------------
  // 4. Return Object
  // -------------------------------------------------------------
  return {
    // Queries Data & States
    members: filteredMembers,
    rawMembers,
    pendingInvitations: rawPendingInvitations,
    selectedMember: memberDetailsQuery.data,
    invitationDetails: invitationQuery.data,
    stats,

    // Query Loading & Error states
    isLoadingMembers: membersQuery.isLoading,
    isFetchingMembers: membersQuery.isFetching,
    membersError: membersQuery.error,
    isLoadingMemberDetails: memberDetailsQuery.isLoading,
    memberDetailsError: memberDetailsQuery.error,
    isLoadingInvitation: invitationQuery.isLoading,
    invitationError: invitationQuery.error,

    // Mutations & Actions
    inviteMember: inviteMemberMutation.mutateAsync,
    isInvitingMember: inviteMemberMutation.isPending,
    inviteError: inviteMemberMutation.error,

    updateMemberRole: updateMemberRoleMutation.mutateAsync,
    isUpdatingRole: updateMemberRoleMutation.isPending,
    updateRoleError: updateMemberRoleMutation.error,

    updateMemberStatus: updateMemberStatusMutation.mutateAsync,
    isUpdatingStatus: updateMemberStatusMutation.isPending,
    updateStatusError: updateMemberStatusMutation.error,

    removeMember: removeMemberMutation.mutateAsync,
    isRemovingMember: removeMemberMutation.isPending,
    removeError: removeMemberMutation.error,

    acceptInvitation: acceptInvitationMutation.mutateAsync,
    isAcceptingInvitation: acceptInvitationMutation.isPending,
    acceptInvitationError: acceptInvitationMutation.error,

    // Utilities / Helpers
    refetchMembers: membersQuery.refetch,
    refetchMemberDetails: memberDetailsQuery.refetch,
    refetchInvitation: invitationQuery.refetch,
    invalidateTeamData,
  };
};

export default useTeam;
