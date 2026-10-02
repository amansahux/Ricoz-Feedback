import crypto from 'crypto';
import { Organization } from '../models/organization.model.js';
import { OrganizationMember } from '../models/organizationMember.model.js';
import { OrganizationInvitation } from '../models/organizationInvitation.model.js';
import { User } from '../models/user.models.js';
import { ROLES, MEMBER_STATUS, INVITATION_STATUS } from '../config/roles.js';
import { sendEmployeeInvitationEmail } from './email.service.js';
import { generateAuthTokens } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const teamService = {
  /**
   * Send an invitation to an employee.
   * Only callable by OWNER of the organization.
   */
  async inviteMember(organizationId, invitedByUserId, { email, role }) {
    // 1. Mandatory Parameter Validations
    if (!organizationId) {
      throw new ApiError(400, 'Organization ID is required');
    }

    if (!invitedByUserId) {
      throw new ApiError(400, 'Inviter user ID (invitedByUserId) is required');
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new ApiError(400, 'A valid email address is required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const targetRole = role || ROLES.SUPPORT_AGENT;

    if (![ROLES.ADMIN, ROLES.SUPPORT_AGENT].includes(targetRole)) {
      throw new ApiError(400, 'Invalid role for invitation. Allowed roles are: admin, support_agent');
    }

    // 2. Run independent initial queries concurrently with Promise.all
    const [org, inviter, inviterMembership, existingUser, existingPendingInvite] = await Promise.all([
      Organization.findById(organizationId),
      User.findById(invitedByUserId).select('name email'),
      OrganizationMember.findOne({
        organizationId,
        userId: invitedByUserId,
        status: MEMBER_STATUS.ACTIVE,
      }).select('role status').lean(),
      User.findOne({ email: normalizedEmail }).select('_id'),
      OrganizationInvitation.findOne({
        organizationId,
        email: normalizedEmail,
        status: INVITATION_STATUS.PENDING,
        expiresAt: { $gt: new Date() },
      }).select('_id').lean(),
    ]);

    if (!org) {
      throw new ApiError(404, 'Organization not found');
    }

    if (!inviter) {
      throw new ApiError(404, 'Inviter user not found');
    }

    // 3. Strict Ownership Authorization: Ensure inviter is the actual active OWNER of THIS organization
    const isOwner =
      inviterMembership?.role === ROLES.OWNER ||
      org.ownerId?.toString() === invitedByUserId.toString();

    if (!isOwner) {
      throw new ApiError(403, 'Forbidden: Only the owner of this organization can send invitations');
    }

    // 4. Prevent inviter from inviting themselves
    if (inviter.email?.toLowerCase().trim() === normalizedEmail) {
      throw new ApiError(400, 'You cannot send an invitation to your own email address');
    }

    // 5. Check if user already exists and is already a member of this organization
    if (existingUser) {
      const existingMember = await OrganizationMember.findOne({
        organizationId,
        userId: existingUser._id,
      }).select('status').lean();

      if (existingMember) {
        if (existingMember.status === MEMBER_STATUS.ACTIVE) {
          throw new ApiError(400, 'A user with this email is already an active member of this organization');
        } else {
          throw new ApiError(400, 'This user is already a member with inactive status. Please reactivate them instead.');
        }
      }
    }

    // 6. Check if there is already an active/pending invitation for this email in this org
    if (existingPendingInvite) {
      throw new ApiError(400, 'A pending invitation has already been sent to this email address');
    }

    // 7. Generate raw cryptographically secure token & sha256 hash for DB storage
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Invitation URL pointing to frontend or accept route
    const invitationUrl = `${env.CLIENT_URL}/invitations/${rawToken}`;

    // Concurrently create the invitation in DB and send the invitation email in parallel
    const [invitation] = await Promise.all([
      OrganizationInvitation.create({
        organizationId,
        email: normalizedEmail,
        role: targetRole,
        tokenHash,
        invitedBy: invitedByUserId,
        expiresAt,
        status: INVITATION_STATUS.PENDING,
      }),
      sendEmployeeInvitationEmail({
        to: normalizedEmail,
        organizationName: org.name,
        role: targetRole,
        invitationUrl,
        invitedByName: inviter?.name || 'Your Team Lead',
      }).catch((emailErr) => {
        console.error('Failed to send employee invitation email:', emailErr);
      }),
    ]);

    return {
      success: true,
      message: `Invitation successfully sent to ${normalizedEmail}`,
      invitation: {
        id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        status: invitation.status,
      },
    };
  },

  /**
   * Get all team members of an organization
   */
  async getMembers(organizationId) {
    const [members, pendingInvitations] = await Promise.all([
      OrganizationMember.find({ organizationId })
        .populate('userId', 'name email verified createdAt')
        .sort({ createdAt: -1 })
        .lean(),
      OrganizationInvitation.find({
        organizationId,
        status: INVITATION_STATUS.PENDING,
        expiresAt: { $gt: new Date() },
      })
        .populate('invitedBy', 'name email')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return {
      members: members.map((m) => ({
        id: m._id,
        userId: m.userId?._id,
        name: m.userId?.name || 'Unknown',
        email: m.userId?.email || '',
        role: m.role,
        status: m.status,
        joinedAt: m.joinedAt || m.createdAt,
        verified: m.userId?.verified || false,
      })),
      pendingInvitations: pendingInvitations.map((inv) => ({
        id: inv._id,
        email: inv.email,
        role: inv.role,
        expiresAt: inv.expiresAt,
        status: inv.status,
        invitedBy: inv.invitedBy?.name || 'Owner',
        createdAt: inv.createdAt,
      })),
    };
  },

  /**
   * Get single team member by member ID
   */
  async getMemberById(organizationId, memberId) {
    const member = await OrganizationMember.findOne({
      _id: memberId,
      organizationId,
    })
      .populate('userId', 'name email verified createdAt')
      .lean();

    if (!member) {
      throw new ApiError(404, 'Team member not found in this organization');
    }

    return {
      id: member._id,
      userId: member.userId?._id,
      name: member.userId?.name || 'Unknown',
      email: member.userId?.email || '',
      role: member.role,
      status: member.status,
      joinedAt: member.joinedAt || member.createdAt,
      verified: member.userId?.verified || false,
    };
  },

  /**
   * Update team member role (e.g. admin <-> support_agent)
   * Cannot demote OWNER
   */
  async updateMemberRole(organizationId, memberId, newRole, currentUserId) {
    if (![ROLES.ADMIN, ROLES.SUPPORT_AGENT].includes(newRole)) {
      throw new ApiError(400, 'Invalid role. Only admin or support_agent can be assigned');
    }

    const member = await OrganizationMember.findOne({
      _id: memberId,
      organizationId,
    });

    if (!member) {
      throw new ApiError(404, 'Team member not found in this organization');
    }

    // Protection: Prevent modifying OWNER membership
    if (member.role === ROLES.OWNER) {
      throw new ApiError(400, 'Cannot change the role of the Organization Owner. Transfer ownership instead.');
    }

    // Protection: Prevent self-role modification
    if (member.userId.toString() === currentUserId.toString()) {
      throw new ApiError(400, 'You cannot modify your own role.');
    }

    member.role = newRole;
    await member.save();

    return {
      id: member._id,
      userId: member.userId,
      role: member.role,
      status: member.status,
    };
  },

  /**
   * Update member status (active <-> inactive)
   * Cannot deactivate OWNER
   */
  async updateMemberStatus(organizationId, memberId, newStatus, currentUserId) {
    if (![MEMBER_STATUS.ACTIVE, MEMBER_STATUS.INACTIVE].includes(newStatus)) {
      throw new ApiError(400, 'Invalid status. Allowed values: active, inactive');
    }

    const member = await OrganizationMember.findOne({
      _id: memberId,
      organizationId,
    });

    if (!member) {
      throw new ApiError(404, 'Team member not found in this organization');
    }

    // Protection: Cannot deactivate owner
    if (member.role === ROLES.OWNER) {
      throw new ApiError(400, 'Cannot deactivate the Organization Owner');
    }

    // Protection: Prevent self-deactivation
    if (member.userId.toString() === currentUserId.toString()) {
      throw new ApiError(400, 'You cannot deactivate your own account.');
    }

    member.status = newStatus;
    await member.save();

    return {
      id: member._id,
      userId: member.userId,
      role: member.role,
      status: member.status,
    };
  },

  /**
   * Remove team member from organization
   * Cannot remove OWNER
   */
  async removeMember(organizationId, memberId, currentUserId) {
    const member = await OrganizationMember.findOne({
      _id: memberId,
      organizationId,
    });

    if (!member) {
      throw new ApiError(404, 'Team member not found in this organization');
    }

    // Protection: Cannot remove owner
    if (member.role === ROLES.OWNER) {
      throw new ApiError(400, 'Cannot delete or remove the Organization Owner');
    }

    // Protection: Prevent self-removal through team API
    if (member.userId.toString() === currentUserId.toString()) {
      throw new ApiError(400, 'You cannot remove yourself from the organization.');
    }

    await OrganizationMember.deleteOne({ _id: memberId });

    return {
      success: true,
      message: 'Member removed from organization successfully',
    };
  },

  /**
   * Validate invitation token and return invitation details for UI
   */
  async getInvitationByToken(rawToken) {
    if (!rawToken) {
      throw new ApiError(400, 'Invitation token is required');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const invitation = await OrganizationInvitation.findOne({
      tokenHash,
    }).populate('organizationId', 'name slug logo primaryColor');

    if (!invitation) {
      throw new ApiError(404, 'Invalid or non-existent invitation');
    }

    if (invitation.status === INVITATION_STATUS.ACCEPTED) {
      throw new ApiError(400, 'This invitation has already been accepted');
    }

    if (invitation.status === INVITATION_STATUS.CANCELLED) {
      throw new ApiError(400, 'This invitation has been cancelled');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = INVITATION_STATUS.EXPIRED;
      await invitation.save();
      throw new ApiError(400, 'This invitation has expired. Please request a new invite.');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitation.email }).select('_id').lean();

    return {
      id: invitation._id,
      email: invitation.email,
      role: invitation.role,
      organization: invitation.organizationId,
      expiresAt: invitation.expiresAt,
      userExists: !!existingUser,
    };
  },

  /**
   * Accept an invitation
   * Handles:
   * 1. Existing user -> links to organization with assigned role
   * 2. New user -> creates User account -> links to organization with assigned role
   */
  async acceptInvitation(rawToken, { name, email, password }) {
    if (!rawToken) {
      throw new ApiError(400, 'Invitation token is required');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const invitation = await OrganizationInvitation.findOne({
      tokenHash,
    });

    if (!invitation) {
      throw new ApiError(404, 'Invalid or non-existent invitation');
    }

    if (invitation.status === INVITATION_STATUS.ACCEPTED) {
      throw new ApiError(400, 'This invitation has already been accepted');
    }

    if (invitation.status === INVITATION_STATUS.CANCELLED) {
      throw new ApiError(400, 'This invitation has been cancelled');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = INVITATION_STATUS.EXPIRED;
      await invitation.save();
      throw new ApiError(400, 'This invitation has expired. Please request a new invite.');
    }

    const inviteEmail = invitation.email.toLowerCase().trim();
    if (email && email.toLowerCase().trim() !== inviteEmail) {
      throw new ApiError(400, 'The provided email address does not match this invitation');
    }

    const normalizedEmail = inviteEmail;
    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      // New user creating account during invite acceptance
      if (!name || !name.trim()) {
        throw new ApiError(400, 'Name is required to create your account');
      }
      if (!password || password.length < 6) {
        throw new ApiError(400, 'Password must be at least 6 characters');
      }

      user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password,
        organizationId: invitation.organizationId,
        verified: true, // Auto-verified through email invite token
      });
      await user.save();
    } else {
      // Existing user: Ensure user is marked verified
      if (!user.verified) {
        user.verified = true;
        await user.save();
      }
    }

    // Create or activate OrganizationMember relationship
    let membership = await OrganizationMember.findOne({
      organizationId: invitation.organizationId,
      userId: user._id,
    });

    let membershipPromise;
    if (membership) {
      membership.role = invitation.role;
      membership.status = MEMBER_STATUS.ACTIVE;
      membershipPromise = membership.save();
    } else {
      membershipPromise = OrganizationMember.create({
        organizationId: invitation.organizationId,
        userId: user._id,
        role: invitation.role,
        status: MEMBER_STATUS.ACTIVE,
        joinedAt: new Date(),
      }).then((created) => {
        membership = created;
      });
    }

    // Mark invitation as accepted
    invitation.status = INVITATION_STATUS.ACCEPTED;

    // Parallelize membership save/creation, invitation update, and organization lookup
    const [_, __, organization] = await Promise.all([
      membershipPromise,
      invitation.save(),
      Organization.findById(invitation.organizationId),
    ]);

    // Generate auth tokens
    const { accessToken, refreshToken } = generateAuthTokens(user._id, invitation.organizationId);

    return {
      tokens: { accessToken, refreshToken },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: invitation.organizationId,
        role: membership.role,
        verified: user.verified,
      },
      organization: organization
        ? {
            id: organization._id,
            name: organization.name,
            slug: organization.slug,
            logo: organization.logo,
            primaryColor: organization.primaryColor,
          }
        : null,
    };
  },
};
