import crypto from 'crypto';
import { Organization } from '../models/organization.model.js';
import { generateUniqueSlug } from '../utils/generateSlug.js';
import { User } from '../models/user.models.js';
import { generateAuthTokens, verifyRefreshToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendOtpEmail } from './email.service.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const authService = {
  /**
   * Register a new user and organization.
   * Sends email verification with link.
   */
  async register(name, email, password, organizationName) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.verified) {
      throw new ApiError(400, 'An account with this email address already exists');
    }

    let user = existingUser;
    let org;

    // Generate random secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (user && !user.verified) {
      // User exists but not verified - update credentials and resend verification
      user.name = name.trim();
      user.password = password;
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      org = await Organization.findById(user.organizationId);
      if (org && organizationName) {
        org.name = organizationName.trim();
        await org.save();
      }
    } else {
      // Create new organization
      org = new Organization({
        name: organizationName.trim(),
        slug: generateUniqueSlug(organizationName.trim()),
      });
      await org.save();

      // Create new unverified user
      user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password,
        organizationId: org._id,
        verified: false,
        verificationToken,
        verificationTokenExpires,
      });
      await user.save();
    }

    // Verification URL pointing directly to backend endpoint which activates user and redirects to login
    const verificationUrl = `${env.SERVER_URL}/api/auth/verify-email?token=${verificationToken}`;

    // Send styled verification email asynchronously
    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
      });
    } catch (emailErr) {
      console.error('Failed to send verification email during registration:', emailErr);
      // We don't fail registration if SMTP fails, but log the error
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      email: user.email,
      requiresVerification: true,
    };
  },

  /**
   * Verify email address using token
   */
  async verifyEmail(token) {
    if (!token) {
      throw new ApiError(400, 'Verification token is required');
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      throw new ApiError(400, 'Invalid or expired verification token. Please request a new one.');
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    const organization = await Organization.findById(user.organizationId);
    const { accessToken, refreshToken } = generateAuthTokens(user._id, user.organizationId);

    return {
      tokens: { accessToken, refreshToken },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
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

  /**
   * Resend verification email
   */
  async resendVerification(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+verificationToken +verificationTokenExpires');

    if (!user) {
      throw new ApiError(404, 'No account found with this email address');
    }

    if (user.verified) {
      throw new ApiError(400, 'This account has already been verified. Please log in.');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verificationUrl = `${env.SERVER_URL}/api/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
    });

    return {
      success: true,
      message: 'A new verification email has been sent to your inbox.',
    };
  },

  /**
   * Login user with email & password
   */
  async login(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.verified) {
      throw new ApiError(403, 'Your account is not verified yet. Please check your email for the verification link.');
    }

    const organization = await Organization.findById(user.organizationId);
    const { accessToken, refreshToken } = generateAuthTokens(user._id, user.organizationId);

    return {
      tokens: { accessToken, refreshToken },
      token: accessToken, // backward compatibility
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
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

  /**
   * Forgot password - Send 6-digit OTP to user's email
   */
  async forgotPassword(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires');

    if (!user) {
      throw new ApiError(404, 'No account found with this email address');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    await sendOtpEmail({
      to: user.email,
      name: user.name,
      otp,
    });

    return {
      success: true,
      message: 'A 6-digit reset code has been sent to your email.',
    };
  },

  /**
   * Resend OTP for password reset
   */
  async resendOtp(email) {
    return this.forgotPassword(email);
  },

  /**
   * Reset password using OTP
   */
  async resetPassword(email, otp, newPassword) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires +password');

    if (!user) {
      throw new ApiError(404, 'No account found with this email address');
    }

    if (!user.otp || user.otp !== otp.trim()) {
      throw new ApiError(400, 'Invalid verification code. Please check and try again.');
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new ApiError(400, 'Verification code has expired. Please request a new one.');
    }

    // Update password (pre-save hook hashes it automatically)
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    if (!user.verified) {
      user.verified = true;
    }
    await user.save();

    return {
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    };
  },

  /**
   * Refresh access token using valid refresh token
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token is required');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    const tokens = generateAuthTokens(user._id, user.organizationId);

    return {
      tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
    };
  },

  /**
   * Google OAuth Callback handler service
   */
  async handleGoogleAuth(profile) {
    if (!profile) {
      throw new ApiError(400, 'Google profile data is missing');
    }

    const googleId = profile.id;
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
    const displayName = profile.displayName || profile.name?.givenName || 'User';

    if (!email) {
      throw new ApiError(400, 'Google account does not provide an email address');
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create Organization
      const orgName = `${displayName}'s Workspace`;
      const org = new Organization({
        name: orgName,
        slug: generateUniqueSlug(orgName),
      });
      await org.save();

      // Create User
      user = new User({
        name: displayName,
        email,
        googleId,
        organizationId: org._id,
        verified: true,
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      user.verified = true;
      await user.save();
    }

    const tokens = generateAuthTokens(user._id, user.organizationId);
    return {
      user,
      tokens,
    };
  },

  /**
   * Get authenticated user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const organization = await Organization.findById(user.organizationId);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
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

  /**
   * Update user and organization details
   */
  async updateUser(userId, name, organizationName, primaryColor, logoUrl) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const organization = await Organization.findById(user.organizationId);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    if (name !== undefined) user.name = name.trim();
    if (organizationName !== undefined) organization.name = organizationName.trim();
    if (primaryColor !== undefined) organization.primaryColor = primaryColor;
    if (logoUrl !== undefined) organization.logo = logoUrl;

    await user.save();
    await organization.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
        verified: user.verified,
      },
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo,
        primaryColor: organization.primaryColor,
      },
    };
  },

  /**
   * Change password for logged in user
   */
  async changePasswordService(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(400, 'Invalid current password');
    }

    // Pre-save hook hashes new password
    user.password = newPassword;
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  },
};