import mongoose from 'mongoose';
import { ROLES, INVITATION_STATUS } from '../config/roles.js';

const organizationInvitationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.SUPPORT_AGENT],
      default: ROLES.SUPPORT_AGENT,
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(INVITATION_STATUS),
      default: INVITATION_STATUS.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
organizationInvitationSchema.index({ organizationId: 1, email: 1 });
organizationInvitationSchema.index({ tokenHash: 1, status: 1 });
organizationInvitationSchema.index({ expiresAt: 1 });

export const OrganizationInvitation = mongoose.model('OrganizationInvitation', organizationInvitationSchema);
