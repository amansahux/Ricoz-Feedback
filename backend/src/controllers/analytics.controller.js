import { analyticsService } from "../services/analytics.service";


export const analyticsController = {
  async getOverview(req, res, next) {
    try {
      const organizationId = req.user.organizationId;
      const overview = await analyticsService.getOverview(organizationId);

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