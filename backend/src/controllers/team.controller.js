import { teamService } from '../services/team.service.js';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '../config/cookie.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const teamController = {
  /**
   * POST /api/team/invitations
   * Invite an employee to the organization (OWNER only)
   */
  inviteMember: asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const organizationId = req.user.organizationId;
    const invitedByUserId = req.user.userId;

    const result = await teamService.inviteMember(organizationId, invitedByUserId, { email, role });

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.invitation,
    });
  }),

  /**
   * GET /api/team/members
   * List all members & pending invitations for the current organization
   */
  getMembers: asyncHandler(async (req, res) => {
    const organizationId = req.user.organizationId;
    const result = await teamService.getMembers(organizationId);

    res.status(200).json({
      success: true,
      data: result.members,
      pendingInvitations: result.pendingInvitations,
    });
  }),

  /**
   * GET /api/team/members/:memberId
   * Get details of a specific team member
   */
  getMemberById: asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const organizationId = req.user.organizationId;

    const member = await teamService.getMemberById(organizationId, memberId);

    res.status(200).json({
      success: true,
      data: member,
    });
  }),

  /**
   * PATCH /api/team/members/:memberId/role
   * Update team member role (e.g. admin <-> support_agent)
   */
  updateMemberRole: asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const { role } = req.body;
    const organizationId = req.user.organizationId;
    const currentUserId = req.user.userId;

    const result = await teamService.updateMemberRole(organizationId, memberId, role, currentUserId);

    res.status(200).json({
      success: true,
      message: 'Member role updated successfully',
      data: result,
    });
  }),

  /**
   * PATCH /api/team/members/:memberId/status
   * Activate or deactivate member (active <-> inactive)
   */
  updateMemberStatus: asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const { status } = req.body;
    const organizationId = req.user.organizationId;
    const currentUserId = req.user.userId;

    const result = await teamService.updateMemberStatus(organizationId, memberId, status, currentUserId);

    res.status(200).json({
      success: true,
      message: `Member status updated to ${status}`,
      data: result,
    });
  }),

  /**
   * DELETE /api/team/members/:memberId
   * Remove member from organization
   */
  removeMember: asyncHandler(async (req, res) => {
    const { memberId } = req.params;
    const organizationId = req.user.organizationId;
    const currentUserId = req.user.userId;

    const result = await teamService.removeMember(organizationId, memberId, currentUserId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),

  /**
   * GET /api/invitations/:token
   * Public endpoint: Validate invitation token
   */
  getInvitationByToken: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const result = await teamService.getInvitationByToken(token);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * POST /api/invitations/:token/accept
   * Accept an invitation and sign in
   */
  acceptInvitation: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { name, password } = req.body;

    const result = await teamService.acceptInvitation(token, { name, password });

    // Set dual-token auth cookies
    res.cookie('recoz_access', result.tokens.accessToken, getAccessTokenCookieOptions());
    res.cookie('recoz_refresh', result.tokens.refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully! You are now part of the workspace.',
      data: {
        user: result.user,
        organization: result.organization,
      },
    });
  }),
};
