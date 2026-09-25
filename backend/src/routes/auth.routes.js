import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateResendVerification,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile,
} from '../validators/auth.validator.js';
import { env } from '../config/env.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);

// Email verification
router.post('/verify-email', validate(validateVerifyEmail), authController.verifyEmail);
router.get('/verify-email', validate(validateVerifyEmail), authController.verifyEmail);
router.post('/resend-verification', validate(validateResendVerification), authController.resendVerification);

// Forgot & Reset Password with OTP
router.post('/forgot-password', validate(validateForgotPassword), authController.forgotPassword);
router.post('/resend-otp', validate(validateForgotPassword), authController.resendOtp);
router.post('/reset-password', validate(validateResetPassword), authController.resetPassword);

// Token refresh
router.post('/refresh-token', authController.refreshToken);
router.post('/refresh', authController.refreshToken);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  authController.googleCallback
);

// Protected endpoints
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.patch('/update-profile', authMiddleware, validate(validateUpdateProfile), authController.update);
router.patch('/change-password', authMiddleware, validate(validateChangePassword), authController.changePassword);

export default router;