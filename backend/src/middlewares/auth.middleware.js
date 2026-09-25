import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "../utils/generateToken.js";
import { getAccessTokenCookieOptions } from "../config/cookie.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Authentication middleware with dual-token support.
 * 1. Checks access token in cookies / auth header.
 * 2. If access token expired, attempts seamless rotation using refresh token.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.recoz_access_token ||
      req.cookies?.recoz_token ||
      req.headers.authorization?.replace('Bearer ', '');

    const refreshToken = req.cookies?.recoz_refresh_token;

    if (!accessToken && !refreshToken) {
      return next(new ApiError(401, 'Unauthorized: Access token or refresh token is required'));
    }

    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        req.user = decoded;
        return next();
      } catch (err) {
        // If error is not token expiration or no refresh token available, fail
        if (err.name !== 'TokenExpiredError' || !refreshToken) {
          return next(new ApiError(401, 'Unauthorized: Invalid or expired access token'));
        }
      }
    }

    // Attempt refresh token fallback
    if (refreshToken) {
      try {
        const decodedRefresh = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(decodedRefresh.userId, decodedRefresh.organizationId);

        // Issue new access token cookie
        res.cookie('recoz_access_token', newAccessToken, getAccessTokenCookieOptions());
        res.cookie('recoz_token', newAccessToken, getAccessTokenCookieOptions());

        req.user = {
          userId: decodedRefresh.userId,
          organizationId: decodedRefresh.organizationId,
        };
        return next();
      } catch (refreshErr) {
        return next(new ApiError(401, 'Unauthorized: Session expired, please log in again'));
      }
    }

    return next(new ApiError(401, 'Unauthorized: Authentication required'));
  } catch (error) {
    return next(error);
  }
};

/**
 * Optional authentication middleware for public endpoints that can enhance responses for logged-in users.
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies?.recoz_access_token ||
      req.cookies?.recoz_token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
  } catch {
    // Continue anonymously without throwing error
  }
  next();
};