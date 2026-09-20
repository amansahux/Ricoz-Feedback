import { analyticsService } from "../services/analytics.service.js";


export const analyticsController = {
  async getOverview(req, res, next) {
    try {
      const organizationId = req.user.organizationId;
      const { range = '30d' } = req.query;

      // Validate range if provided
      const validRanges = ['7d', '30d', '90d'];
      const sanitizedRange = validRanges.includes(range) ? range : '30d';

      const overview = await analyticsService.getOverview(organizationId, sanitizedRange);

      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrends(req, res, next) {
    try {
      const organizationId = req.user.organizationId;
      const { days = 30 } = req.query;

      const trends = await analyticsService.getTrends(organizationId, parseInt(days));

      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  },
};