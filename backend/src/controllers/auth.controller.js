import { authService } from "../services/auth.service.js";
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from "../config/cookie.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const authController = {
  /**
   * User registration with email verification trigger
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password, organizationName } = req.body;
    const result = await authService.register(name, email, password, organizationName);

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        email: result.email,
        requiresVerification: result.requiresVerification,
      },
    });
  }),

  /**
   * Verify email via token
   */
  verifyEmail: asyncHandler(async (req, res) => {
    const token = req.body?.token || req.query?.token;
    const result = await authService.verifyEmail(token);

    // Set authentication cookies upon successful verification
    res.cookie('recoz_access', result.tokens.accessToken, getAccessTokenCookieOptions());
    res.cookie('recoz_refresh', result.tokens.refreshToken, getRefreshTokenCookieOptions());

    // If request comes from a browser GET redirect, redirect to login page
    if (req.method === 'GET') {
      return res.redirect(`${env.CLIENT_URL}/login?verified=true`);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      data: {
        user: result.user,
        organization: result.organization,
      },
    });
  }),

  /**
   * Resend verification link to user's email
   */
  resendVerification: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendVerification(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),

  /**
   * Login with email and password
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Set dual-token cookies: recoz_access and recoz_refresh
    res.cookie('recoz_access', result.tokens.accessToken, getAccessTokenCookieOptions());
    res.cookie('recoz_refresh', result.tokens.refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        organization: result.organization,
      },
    });
  }),

  /**
   * Forgot password - sends 6-digit OTP to user's email
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),

  /**
   * Resend OTP code for password reset
   */
  resendOtp: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendOtp(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),

  /**
   * Reset password after entering valid OTP
   */
  resetPassword: asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }),

  /**
   * Refresh access token
   */
  refreshToken: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.recoz_refresh || req.body?.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);

    res.cookie('recoz_access', result.tokens.accessToken, getAccessTokenCookieOptions());
    res.cookie('recoz_refresh', result.tokens.refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        user: result.user,
      },
    });
  }),

  /**
   * Google OAuth Callback controller
   */
  googleCallback: asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.redirect(`${env.CLIENT_URL}/login?error=google_auth_failed`);
    }

    const result = await authService.handleGoogleAuth(req.user);

    // Set dual-token cookies: recoz_access and recoz_refresh
    res.cookie('recoz_access', result.tokens.accessToken, getAccessTokenCookieOptions());
    res.cookie('recoz_refresh', result.tokens.refreshToken, getRefreshTokenCookieOptions());

    return res.redirect(`${env.CLIENT_URL}/dashboard`);
  }),

  /**
   * Get current authenticated user details
   */
  getMe: asyncHandler(async (req, res) => {
    const result = await authService.getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  /**
   * Update profile details
   */
  update: asyncHandler(async (req, res) => {
    const { name, organizationName, primaryColor, logoUrl } = req.body;
    const result = await authService.updateUser(req.user.userId, name, organizationName, primaryColor, logoUrl);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: result.user,
        organization: result.organization,
      },
    });
  }),

  /**
   * Change password for logged-in user
   */
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePasswordService(req.user.userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message || 'Password changed successfully',
    });
  }),

  /**
   * Log out and clear recoz_access and recoz_refresh cookies
   */
  logout: asyncHandler(async (req, res) => {
    const accessCookieOptions = getAccessTokenCookieOptions();
    const refreshCookieOptions = getRefreshTokenCookieOptions();

    res.clearCookie('recoz_access', accessCookieOptions);
    res.clearCookie('recoz_refresh', refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }),
};
