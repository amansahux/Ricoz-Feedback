import { getCookieOptions } from "../config/cookie.js";
import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, organizationName } = req.body;

      if (!name || !email || !password || !organizationName) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }

      const result = await authService.register(name, email, password, organizationName);

      res.cookie('recoz_token', result.token, getCookieOptions());

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: result.user,
          organization: result.organization,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password required',
        });
      }

      const result = await authService.login(email, password);

      res.cookie('recoz_token', result.token, getCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      if (error.message.includes('Invalid')) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const result = await authService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    res.clearCookie('recoz_token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  },
};
