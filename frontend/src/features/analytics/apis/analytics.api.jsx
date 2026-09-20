import apiClient from "../../../../config/axiosInsstance";

/**
 * Fetch analytics overview data for a given range (7d, 30d, 90d).
 * @param {string} [range='30d'] - Range period ('7d' | '30d' | '90d')
 * @returns {Promise<any>}
 */
export const getAnalyticsOverview = async (range = "30d") => {
  try {
    const response = await apiClient.get("/analytics/overview", {
      params: { range },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    throw error;
  }
};

/**
 * Fetch analytics trends data over a number of days.
 * @param {number} [days=30] - Number of days to retrieve trends for
 * @returns {Promise<any>}
 */
export const getAnalyticsTrends = async (days = 30) => {
  try {
    const response = await apiClient.get("/analytics/trends", {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics trends:", error);
    throw error;
  }
};
