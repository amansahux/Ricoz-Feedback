import apiClient from '../../../../config/axiosInsstance';

/**
 * Team and Invitations API Service
 */
export const teamApi = {
  /**
   * Invite a new member to the organization
   * @param {{ email: string, role: string }} data
   */
  inviteMember: async (data) => {
    const response = await apiClient.post('/team/invitations', data);
    return response.data;
  },

  /**
   * List members & pending invitations with server-side searching, filtering, and pagination
   * @param {Object} [params]
   * @param {string} [params.search]
   * @param {string} [params.role]
   * @param {string} [params.status]
   * @param {number} [params.page]
   * @param {number} [params.limit]
   * @param {string} [params.sortBy]
   * @param {number} [params.sortOrder]
   */
  getMembers: async (params = {}) => {
    const response = await apiClient.get('/team/members', { params });
    return response.data;
  },

  /**
   * Get details of a specific team member
   * @param {string} memberId
   */
  getMemberById: async (memberId) => {
    const response = await apiClient.get(`/team/members/${memberId}`);
    return response.data;
  },

  /**
   * Update team member role (e.g. admin, support_agent)
   * @param {{ memberId: string, role: string }} params
   */
  updateMemberRole: async ({ memberId, role }) => {
    const response = await apiClient.patch(`/team/members/${memberId}/role`, { role });
    return response.data;
  },

  /**
   * Activate or deactivate member (status: 'active' | 'inactive')
   * @param {{ memberId: string, status: string }} params
   */
  updateMemberStatus: async ({ memberId, status }) => {
    const response = await apiClient.patch(`/team/members/${memberId}/status`, { status });
    return response.data;
  },

  /**
   * Remove member from organization
   * @param {string} memberId
   */
  removeMember: async (memberId) => {
    const response = await apiClient.delete(`/team/members/${memberId}`);
    return response.data;
  },

  /**
   * Public: Validate invitation token
   * @param {string} token
   */
  getInvitationByToken: async (token) => {
    const response = await apiClient.get(`/invitations/${token}`);
    return response.data;
  },

  /**
   * Public: Accept an invitation and sign up / sign in
   * @param {{ token: string, name: string, email?: string, password?: string }} params
   */
  acceptInvitation: async ({ token, ...userData }) => {
    const response = await apiClient.post(`/invitations/${token}/accept`, userData);
    return response.data;
  },
};

export default teamApi;
