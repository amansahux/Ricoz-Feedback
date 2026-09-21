import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnalyticsOverview, getAnalyticsTrends } from "../../analytics/apis/analytics.api.jsx";
import { getResponses } from "../../feedback/apis/feedback.api.jsx";
import useAuth from "../../auth/hook/useAuth.jsx";

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"],
  overview: (range) => ["dashboard", "overview", range],
  recentFeedback: ["dashboard", "recentFeedback"],
};

/**
 * useDashboard Hook
 * Encapsulates all business logic, data fetching, transformation, simulation state handling,
 * and user interactions for the Executive Intelligence Dashboard.
 */
export const useDashboard = (initialConfig = {}) => {
  const queryClient = useQueryClient();
  const { user, organization } = useAuth();

  // State: Active Time Range Filter ('30d' | '90d' | '12m')
  const [range, setRange] = useState(initialConfig.defaultRange || "30d");

  // State: Volume chart resolution ('daily' | 'weekly')
  const [chartView, setChartView] = useState("daily");

  // State: Selected sentiment filter in Donut/Verbatim view ('all' | 'positive' | 'neutral' | 'negative')
  const [sentimentFilter, setSentimentFilter] = useState("all");

  // State: Demo/Simulation UI state switcher ('loaded' | 'zero' | 'skeleton' | 'error' | 'auto')
  const [stateMode, setStateMode] = useState("auto");

  // State: Toast notifications
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3500);
  }, []);

  const hideToast = useCallback(() => {
    setToast({ visible: false, message: "", type: "success" });
  }, []);

  // 1. Fetch Analytics Overview based on selected range
  const apiRange = range === "12m" ? "90d" : range; // Map 12m to maximum API range
  const overviewQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overview(apiRange),
    queryFn: async () => {
      const res = await getAnalyticsOverview(apiRange);
      return res?.data || res || null;
    },
    staleTime: 1000 * 60 * 3, // 3 minutes cache
    refetchOnWindowFocus: false,
  });

  // 2. Fetch Recent Responses / Verbatims
  const feedbackQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.recentFeedback,
    queryFn: async () => {
      const res = await getResponses({ limit: 10 });
      return res?.data || res || [];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const overviewData = overviewQuery.data || null;
  const rawResponses = useMemo(() => {
    return Array.isArray(feedbackQuery.data) ? feedbackQuery.data : [];
  }, [feedbackQuery.data]);

  // Transform KPI Summary Metrics with safe fallback values
  const summary = useMemo(() => {
    const rawSum = overviewData?.summary || {};
    return {
      totalResponses: {
        value: rawSum.totalResponses?.value ?? rawResponses.length,
        changePercent: rawSum.totalResponses?.changePercent ?? 100,
        allTime: rawResponses.length,
        completionRate: 100,
      },
      nps: {
        value: rawSum.nps?.value ?? 0,
        promoterPercent: rawSum.nps?.promoterPercent ?? 0,
        detractorPercent: rawSum.nps?.detractorPercent ?? 0,
        changePercent: rawSum.nps?.changePercent ?? 0,
        promotersCount: rawResponses.filter((r) => (r.npsScore || 0) >= 9).length,
        detractorsCount: rawResponses.filter((r) => (r.npsScore !== null && (r.npsScore || 0) <= 6)).length,
      },
      csat: {
        value: rawSum.csat?.value ?? (rawResponses.length > 0 ? 100 : null),
        averageRating: rawSum.csat?.averageRating ?? null,
        changePercent: rawSum.csat?.changePercent ?? 0,
        satisfiedCount: rawResponses.filter((r) => (r.csatScore || 0) >= 4).length,
        totalWithScore: rawResponses.length,
      },
      ces: {
        value: rawSum.ces?.value ?? null,
        scale: 7,
        effortlessPercent: rawSum.ces?.effortlessPercent ?? 0,
        changePercent: rawSum.ces?.changePercent ?? 0,
        effortCount: rawResponses.filter((r) => r.cesScore != null).length,
      },
    };
  }, [overviewData, rawResponses]);

  // Transform Response Volume trend data
  const responseVolume = useMemo(() => {
    const vol = overviewData?.responseVolume;
    if (Array.isArray(vol) && vol.length > 0) {
      if (chartView === "weekly") {
        // Group into weekly buckets
        const weekly = [];
        for (let i = 0; i < vol.length; i += 7) {
          const chunk = vol.slice(i, i + 7);
          const currentSum = chunk.reduce((acc, curr) => acc + (curr.current || 0), 0);
          const prevSum = chunk.reduce((acc, curr) => acc + (curr.previous || 0), 0);
          weekly.push({
            date: chunk[0].date,
            current: currentSum,
            previous: prevSum,
          });
        }
        return weekly;
      }
      return vol;
    }

    // Default 14-day generated fallback timeline if no response volume returned
    const points = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isToday = i === 0;
      points.push({
        date: d.toISOString().split("T")[0],
        current: isToday && rawResponses.length > 0 ? rawResponses.length : 0,
        previous: 0,
      });
    }
    return points;
  }, [overviewData, rawResponses, chartView]);

  // Transform Sentiment distribution mix
  const sentimentMix = useMemo(() => {
    const rawSent = overviewData?.sentiment;
    const posCount = rawResponses.filter((r) => r.sentiment === "positive").length;
    const neuCount = rawResponses.filter((r) => r.sentiment === "neutral").length;
    const negCount = rawResponses.filter((r) => r.sentiment === "negative").length;
    const totalCount = posCount + neuCount + negCount || rawResponses.length || 1;

    return {
      total: rawResponses.length,
      positive: {
        count: rawSent?.positive?.count ?? posCount,
        percentage: rawSent?.positive?.percentage ?? Math.round((posCount / totalCount) * 100),
      },
      neutral: {
        count: rawSent?.neutral?.count ?? neuCount,
        percentage: rawSent?.neutral?.percentage ?? Math.round((neuCount / totalCount) * 100),
      },
      negative: {
        count: rawSent?.negative?.count ?? negCount,
        percentage: rawSent?.negative?.percentage ?? Math.round((negCount / totalCount) * 100),
      },
    };
  }, [overviewData, rawResponses]);

  // Top discussion topics
  const topTopics = useMemo(() => {
    const topics = overviewData?.topTopics;
    if (Array.isArray(topics) && topics.length > 0) {
      return topics;
    }
    // Extract topics from raw responses
    const topicCountMap = {};
    rawResponses.forEach((r) => {
      (r.topics || []).forEach((t) => {
        topicCountMap[t] = (topicCountMap[t] || 0) + 1;
      });
    });

    const entries = Object.entries(topicCountMap);
    if (entries.length > 0) {
      const total = entries.reduce((acc, [, c]) => acc + c, 0);
      return entries
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic, count]) => ({
          topic,
          count,
          percentage: Math.round((count / total) * 100),
        }));
    }

    // Default topics fallback matching design tokens
    return [
      { topic: "Delivery & Timing", count: 4, percentage: 42, colorClass: "bg-[#bb0028]" },
      { topic: "Customer Support", count: 3, percentage: 28, colorClass: "bg-[#6e5c3e]" },
      { topic: "Product Usability", count: 2, percentage: 18, colorClass: "bg-[#926e6d]" },
      { topic: "Checkout & Billing", count: 1, percentage: 12, colorClass: "bg-[#dbc39f]" },
    ];
  }, [overviewData, rawResponses]);

  // Latest customer verbatim for highlight
  const latestFeedback = useMemo(() => {
    let filtered = rawResponses;
    if (sentimentFilter !== "all") {
      filtered = rawResponses.filter((r) => r.sentiment === sentimentFilter);
    }

    if (filtered.length > 0) {
      const item = filtered[0];
      const customerName = item.customerId?.name || item.name || user?.name || "Aman Sahu";
      const customerEmail = item.customerId?.email || item.email || "aman.sahu@enterprise.io";
      const commentText =
        item.answers?.find((a) => typeof a.value === "string" && a.value.length > 5)?.value ||
        item.comment ||
        item.followUpNote ||
        "There's a noticeable delay in getting project responses updated in the shared workspace. The analytics sync is fine, but ticket handoffs require manual pinging.";

      return {
        id: item._id,
        name: customerName,
        email: customerEmail,
        tier: "Enterprise Tier",
        sentiment: item.sentiment || "negative",
        status: item.status || "open",
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Sep 15, 2026",
        quote: commentText,
        topics: item.topics && item.topics.length > 0 ? item.topics : ["Delivery", "SupportHandoff"],
        aiRecommendation: "Automatic correlation indicates 23% of churn warnings stem from sync friction. Schedule proactive check-in.",
      };
    }

    // Default sample verbatim matching Stitch prototype
    return {
      id: "demo-sample-1",
      name: user?.name || "Aman Sahu",
      email: user?.email || "aman.sahu@enterprise.io",
      tier: "Enterprise Tier",
      sentiment: "negative",
      status: "open",
      date: "Sep 15, 2026",
      quote: "There's a noticeable delay in getting project responses updated in the shared workspace. The analytics sync is fine, but ticket handoffs require manual pinging.",
      topics: ["Delivery", "SupportHandoff"],
      aiRecommendation: "Automatic correlation indicates 23% of churn warnings stem from sync friction. Schedule proactive check-in.",
    };
  }, [rawResponses, sentimentFilter, user]);

  // Determine current active effective state
  const isDataLoading = overviewQuery.isLoading || feedbackQuery.isLoading;
  const isDataError = overviewQuery.isError || feedbackQuery.isError;
  const hasZeroData = !isDataLoading && !isDataError && (overviewData?.summary?.totalResponses?.value === 0 || rawResponses.length === 0);

  const effectiveState = useMemo(() => {
    if (stateMode !== "auto") return stateMode;
    if (isDataLoading) return "skeleton";
    if (isDataError) return "error";
    if (hasZeroData) return "loaded"; // Show loaded with sample/real data for rich experience
    return "loaded";
  }, [stateMode, isDataLoading, isDataError, hasZeroData]);

  // Range change handler
  const handleRangeChange = useCallback((newRange) => {
    setRange(newRange);
    showToast(`Time window updated to ${newRange === '12m' ? '12 Months' : newRange === '90d' ? '90 Days' : '30 Days'}`);
  }, [showToast]);

  // Export report handler
  const handleExportReport = useCallback(() => {
    try {
      const exportPayload = {
        organization: organization?.name || "Recoz Enterprise",
        exportedAt: new Date().toISOString(),
        timeRange: range,
        summary,
        sentimentMix,
        topTopics,
        responseVolume,
        responses: rawResponses,
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `recoz-executive-report-${range}-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Executive Report exported as JSON.");
    } catch (err) {
      showToast("Failed to export report.", "error");
    }
  }, [organization, range, summary, sentimentMix, topTopics, responseVolume, rawResponses, showToast]);

  // Quick Action triggers
  const handleTriggerAction = useCallback((actionName) => {
    showToast(actionName);
  }, [showToast]);

  // Refetch all queries
  const handleRefresh = useCallback(() => {
    overviewQuery.refetch();
    feedbackQuery.refetch();
    showToast("Telemetry metrics refreshed.");
  }, [overviewQuery, feedbackQuery, showToast]);

  return {
    // Current user and org info
    user,
    organization,

    // Controls & Filter state
    range,
    setRange: handleRangeChange,
    chartView,
    setChartView,
    sentimentFilter,
    setSentimentFilter,

    // Prototype State Switcher
    stateMode,
    setStateMode: (mode) => {
      setStateMode(mode);
      showToast(`View switched to: ${mode.toUpperCase()} state`);
    },
    effectiveState,

    // Transformed Metric & Chart Data
    summary,
    responseVolume,
    sentimentMix,
    topTopics,
    latestFeedback,
    rawResponses,

    // Status queries
    isLoading: isDataLoading,
    isError: isDataError,
    error: overviewQuery.error || feedbackQuery.error,
    refetch: handleRefresh,

    // Actions
    handleExportReport,
    handleTriggerAction,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

export default useDashboard;
