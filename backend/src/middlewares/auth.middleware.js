import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "../utils/generateToken.js";
import { getAccessTokenCookieOptions } from "../config/cookie.js";
import { OrganizationMember } from "../models/organizationMember.model.js";
import { MEMBER_STATUS, ROLE_PERMISSIONS, ROLES } from "../config/roles.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Authentication & Membership Context Middleware.
 * 1. Checks access/refresh tokens.
 * 2. Finds active OrganizationMember record to resolve active role & status.
 * 3. Populates req.user = { userId, organizationId, role, status, permissions }
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.recoz_access ||
      req.headers.authorization?.replace('Bearer ', '');

    const refreshToken = req.cookies?.recoz_refresh;

    if (!accessToken && !refreshToken) {
      return next(new ApiError(401, 'Unauthorized: Access token or refresh token is required'));
    }

    let decoded = null;

    if (accessToken) {
      try {
        decoded = verifyAccessToken(accessToken);
      } catch (err) {
        // If expired and refresh token exists, proceed to refresh token block
        if (err.name !== 'TokenExpiredError' || !refreshToken) {
          return next(new ApiError(401, 'Unauthorized: Invalid or expired access token'));
        }
      }
    }

    // Refresh token fallback
    if (!decoded && refreshToken) {
      try {
        const decodedRefresh = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(decodedRefresh.userId, decodedRefresh.organizationId);

        // Set fresh cookie
        res.cookie('recoz_access', newAccessToken, getAccessTokenCookieOptions());
        decoded = {
          userId: decodedRefresh.userId,
          organizationId: decodedRefresh.organizationId,
        };
      } catch (refreshErr) {
        return next(new ApiError(401, 'Unauthorized: Session expired, please log in again'));
      }
    }

    if (!decoded || !decoded.userId) {
      return next(new ApiError(401, 'Unauthorized: Authentication required'));
    }

    const { userId } = decoded;
    let { organizationId } = decoded;

    // Resolve organization membership
    let membership = null;
    if (organizationId) {
      membership = await OrganizationMember.findOne({
        userId,
        organizationId,
        status: MEMBER_STATUS.ACTIVE,
      })
        .select('_id role status organizationId')
        .lean();
    }

    // Fallback: If no membership found for decoded orgId, find any active membership for this user
    if (!membership) {
      membership = await OrganizationMember.findOne({
        userId,
        status: MEMBER_STATUS.ACTIVE,
      })
        .select('_id role status organizationId')
        .lean();
      if (membership) {
        organizationId = membership.organizationId;
      }
    }

    if (!membership) {
      return next(new ApiError(403, 'Forbidden: You do not have an active membership in any organization.'));
    }

    const role = membership.role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    // Attach verified user context with multi-tenant org & role
    req.user = {
      userId: userId.toString(),
      organizationId: membership.organizationId.toString(),
      role,
      status: membership.status,
      permissions,
      memberId: membership._id.toString(),
    };

    // Also attach req.auth for explicit architecture standard compatibility
    req.auth = {
      userId: req.user.userId,
      organizationId: req.user.organizationId,
      role: req.user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Authorization Middleware: Checks if authenticated user has a specific permission.
 * Usage: requirePermission('survey.create') or requirePermission(PERMISSIONS.SURVEY_CREATE)
 */
export const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'Unauthorized: Authentication required'));
    }

    // OWNER has full system access bypass
    if (req.user.role === ROLES.OWNER) {
      return next();
    }

    const userPermissions = req.user.permissions || ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPermissions.includes(requiredPermission)) {
      return next(new ApiError(403, `Forbidden: You lack permission (${requiredPermission}) to perform this action`));
    }

    return next();
  };
};

/**
 * Authorization Middleware: Checks if authenticated user has one of the allowed roles.
 * Usage: requireRole(ROLES.OWNER) or requireRole([ROLES.OWNER, ROLES.ADMIN])
 */
export const requireRole = (allowedRoles) => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'Unauthorized: Authentication required'));
    }

    if (!rolesArray.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: You do not have the required role to perform this action'));
    }

    return next();
  };
};

/**
 * Optional authentication middleware for public endpoints.
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.recoz_access ||
      req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded && decoded.userId) {
        req.user = decoded;
      }
    }
  } catch {
    // Continue without throwing error
  }
  next();
};