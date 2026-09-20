import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsOverview,
  getAnalyticsTrends,
} from "../apis/analytics.api.jsx";

// Query keys hierarchy for analytics caching
export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"],
  overview: (range) => ["analytics", "overview", range],
  trends: (days) => ["analytics", "trends", days],
};

/**
 * Hook: Fetch Analytics Overview for a specified range (7d, 30d, 90d)
 * @param {string} [range='30d'] - Range filter
 * @param {Object} [options={}] - Additional useQuery options
 */
export const useGetAnalyticsOverview = (range = "30d", options = {}) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(range),
    queryFn: async () => {
      const res = await getAnalyticsOverview(range);
      return res?.data || res || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook: Fetch Analytics Trends for a specified number of days
 * @param {number} [days=30] - Number of days
 * @param {Object} [options={}] - Additional useQuery options
 */
export const useGetAnalyticsTrends = (days = 30, options = {}) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.trends(days),
    queryFn: async () => {
      const res = await getAnalyticsTrends(days);
      return res?.data || res || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Comprehensive Analytics Dashboard Hook
 * Provides state for active range selector, data transformations, metric fallbacks, and refetch helpers.
 * @param {Object} [initialConfig={}] - Default configuration
 */
export const useAnalytics = (initialConfig = {}) => {
  const [range, setRange] = useState(initialConfig.defaultRange || "30d");

  const overviewQuery = useGetAnalyticsOverview(range);

  const overviewData = overviewQuery.data || null;

  // Extracted summary metrics with safe defaults
  const summary = useMemo(() => {
    return (
      overviewData?.summary || {
        totalResponses: { value: 0, changePercent: 0 },
        nps: { value: null, promoterPercent: 0, detractorPercent: 0, changePercent: 0 },
        csat: { value: null, averageRating: null, changePercent: 0 },
        ces: { value: null, scale: 7, effortlessPercent: 0, changePercent: 0 },
      }
    );
  }, [overviewData]);

  // Day-by-day response volume array
  const responseVolume = useMemo(() => {
    return overviewData?.responseVolume || [];
  }, [overviewData]);

  // NPS breakdown (promoters, passives, detractors)
  const npsBreakdown = useMemo(() => {
    return (
      overviewData?.npsBreakdown || {
        detractors: { count: 0, percentage: 0 },
        passives: { count: 0, percentage: 0 },
        promoters: { count: 0, percentage: 0 },
      }
    );
  }, [overviewData]);

  // Top customer feedback topics
  const topTopics = useMemo(() => {
    return overviewData?.topTopics || [];
  }, [overviewData]);

  // Sentiment distribution
  const sentiment = useMemo(() => {
    return (
      overviewData?.sentiment || {
        positive: { count: 0, percentage: 0 },
        neutral: { count: 0, percentage: 0 },
        negative: { count: 0, percentage: 0 },
      }
    );
  }, [overviewData]);

  // Check if overview has zero responses
  const hasNoData = useMemo(() => {
    if (overviewQuery.isLoading) return false;
    return !overviewData || overviewData.summary?.totalResponses?.value === 0;
  }, [overviewData, overviewQuery.isLoading]);

  const handleRangeChange = useCallback((newRange) => {
    if (["7d", "30d", "90d"].includes(newRange)) {
      setRange(newRange);
    }
  }, []);

  return {
    range,
    setRange: handleRangeChange,
    summary,
    responseVolume,
    npsBreakdown,
    topTopics,
    sentiment,
    rawData: overviewData,
    hasNoData,
    isLoading: overviewQuery.isLoading,
    isFetching: overviewQuery.isFetching,
    isError: overviewQuery.isError,
    error: overviewQuery.error,
    refetch: overviewQuery.refetch,
  };
};

export default useAnalytics;
