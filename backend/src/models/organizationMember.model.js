import mongoose from 'mongoose';
import { ROLES, MEMBER_STATUS } from '../config/roles.js';

const organizationMemberSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.SUPPORT_AGENT,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MEMBER_STATUS),
      default: MEMBER_STATUS.ACTIVE,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: A user cannot have multiple memberships in the same organization
organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
organizationMemberSchema.index({ organizationId: 1, role: 1 });
organizationMemberSchema.index({ organizationId: 1, status: 1 });

export const OrganizationMember = mongoose.model('OrganizationMember', organizationMemberSchema);
