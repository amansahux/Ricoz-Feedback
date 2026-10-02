import express from 'express';
import { teamController } from '../controllers/team.controller.js';
import { authMiddleware, requireRole, requirePermission } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { ROLES, PERMISSIONS } from '../config/roles.js';
import {
  validateInviteMember,
  validateUpdateRole,
  validateUpdateStatus,
} from '../validators/team.validator.js';

const router = express.Router();

// Protected team management endpoints (OWNER only)
router.use(authMiddleware);

router.post(
  '/invitations',
  requireRole(ROLES.OWNER),
  validate(validateInviteMember),
  teamController.inviteMember
);

router.get(
  '/members',
  requireRole(ROLES.OWNER),
  teamController.getMembers
);

router.get(
  '/members/:memberId',
  requireRole(ROLES.OWNER),
  teamController.getMemberById
);

router.patch(
  '/members/:memberId/role',
  requireRole(ROLES.OWNER),
  validate(validateUpdateRole),
  teamController.updateMemberRole
);

router.patch(
  '/members/:memberId/status',
  requireRole(ROLES.OWNER),
  validate(validateUpdateStatus),
  teamController.updateMemberStatus
);

router.delete(
  '/members/:memberId',
  requireRole(ROLES.OWNER),
  teamController.removeMember
);

export default router;
