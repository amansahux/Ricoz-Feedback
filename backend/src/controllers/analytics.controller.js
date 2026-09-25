import { analyticsService } from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analyticsController = {
  getOverview: asyncHandler(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { range = '30d' } = req.query;

    const validRanges = ['7d', '30d', '90d'];
    const sanitizedRange = validRanges.includes(range) ? range : '30d';

    const overview = await analyticsService.getOverview(organizationId, sanitizedRange);

    res.status(200).json({
      success: true,
      data: overview,
    });
  }),

  getTrends: asyncHandler(async (req, res) => {
    const organizationId = req.user.organizationId;
    const { days = 30 } = req.query;

    const trends = await analyticsService.getTrends(organizationId, parseInt(days) || 30);

    res.status(200).json({
      success: true,
      data: trends,
    });
  }),
};