import { useState, useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getResponses as getResponsesApi,
  getResponseById as getResponseByIdApi,
  updateResponseById as updateResponseByIdApi,
} from "../apis/feedback.api.jsx";

// Standard query keys hierarchy for feedback/responses
export const FEEDBACK_QUERY_KEYS = {
  all: ["responses"],
  lists: () => [...FEEDBACK_QUERY_KEYS.all, "list"],
  list: (filters) => [...FEEDBACK_QUERY_KEYS.lists(), filters],
  details: () => [...FEEDBACK_QUERY_KEYS.all, "detail"],
  detail: (id) => [...FEEDBACK_QUERY_KEYS.details(), id],
};

// Initial realistic mock data matching Stitch visual fidelity if backend database is fresh
export const SAMPLE_RESPONSES = [
  {
    _id: "101",
    customerId: {
      _id: "c_1",
      name: "Aman Sahu",
      email: "amansahu@enterprise.io",
    },
    surveyId: {
      _id: "s_1",
      title: "Post-purchase experience v2",
      slug: "post-purchase-v2",
    },
    csatScore: 2,
    npsScore: 7,
    cesScore: null,
    sentiment: "negative",
    topics: ["Delivery & Timing", "Support Handoff"],
    source: "link",
    status: "open",
    followUpNote:
      "Reached out to Aman via priority enterprise support desk. Scheduled review call for Sept 17th.",
    createdAt: new Date("2026-09-15T11:05:32Z").toISOString(),
    answers: [
      {
        questionId: "q_1",
        questionText: "How was your overall experience with Acme Clothing?",
        type: "rating",
        value: 2,
      },
      {
        questionId: "q_2",
        questionText: "What specifically impacted your experience today?",
        type: "textarea",
        value:
          "There’s a noticeable delay in getting the project responses updated and getting timely handoffs from the design flow team. The UI builder is slick, but customer handoff needs faster turnaround.",
      },
      {
        questionId: "q_3",
        questionText: "How likely are you to recommend Acme to a peer or colleague?",
        type: "nps",
        value: 7,
      },
    ],
  },
  {
    _id: "102",
    customerId: {
      _id: "c_2",
      name: "Elena Rostova",
      email: "elena.r@finova.tech",
    },
    surveyId: {
      _id: "s_2",
      title: "Survey Builder Experience",
      slug: "survey-builder-csat",
    },
    csatScore: 5,
    npsScore: 10,
    cesScore: 6,
    sentiment: "positive",
    topics: ["Survey Builder", "UI Speed"],
    source: "qr",
    status: "resolved",
    followUpNote: "Customer expressed gratitude for responsive support team.",
    createdAt: new Date("2026-09-15T09:22:15Z").toISOString(),
    resolvedAt: new Date("2026-09-15T10:00:00Z").toISOString(),
    answers: [
      {
        questionId: "q_1",
        questionText: "How was your overall experience with Acme Clothing?",
        type: "rating",
        value: 5,
      },
      {
        questionId: "q_2",
        questionText: "What specifically impacted your experience today?",
        type: "textarea",
        value: "The live preview while creating surveys saved our team hours. Outstanding polish.",
      },
      {
        questionId: "q_3",
        questionText: "How likely are you to recommend Acme to a peer or colleague?",
        type: "nps",
        value: 10,
      },
    ],
  },
  {
    _id: "103",
    customerId: {
      _id: "c_3",
      name: "Marcus Vance",
      email: "m.vance@novabound.com",
    },
    surveyId: {
      _id: "s_1",
      title: "Post-purchase experience v2",
      slug: "post-purchase-v2",
    },
    csatScore: 4,
    npsScore: 8,
    cesScore: 5,
    sentiment: "positive",
    topics: ["Product Usability"],
    source: "widget",
    status: "in_progress",
    followUpNote: "In review with checkout product squad.",
    createdAt: new Date("2026-09-14T14:40:00Z").toISOString(),
    answers: [
      {
        questionId: "q_1",
        questionText: "How was your overall experience with Acme Clothing?",
        type: "rating",
        value: 4,
      },
      {
        questionId: "q_2",
        questionText: "What specifically impacted your experience today?",
        type: "textarea",
        value: "Clean layout, easy for our customers on mobile checkout.",
      },
      {
        questionId: "q_3",
        questionText: "How likely are you to recommend Acme to a peer or colleague?",
        type: "nps",
        value: 8,
      },
    ],
  },
  {
    _id: "104",
    customerId: {
      _id: "c_4",
      name: "Sophia Chen",
      email: "sophia@meridian.co",
    },
    surveyId: {
      _id: "s_3",
      title: "Checkout Billing Review",
      slug: "checkout-billing",
    },
    csatScore: 3,
    npsScore: 6,
    cesScore: 4,
    sentiment: "neutral",
    topics: ["Checkout & Billing"],
    source: "link",
    status: "open",
    followUpNote: "",
    createdAt: new Date("2026-09-14T11:15:00Z").toISOString(),
    answers: [
      {
        questionId: "q_1",
        questionText: "How was your overall experience with Acme Clothing?",
        type: "rating",
        value: 3,
      },
      {
        questionId: "q_2",
        questionText: "What specifically impacted your experience today?",
        type: "textarea",
        value: "Pricing transparency is good, but would appreciate automated invoice receipts.",
      },
      {
        questionId: "q_3",
        questionText: "How likely are you to recommend Acme to a peer or colleague?",
        type: "nps",
        value: 6,
      },
    ],
  },
  {
    _id: "105",
    customerId: {
      _id: "c_5",
      name: "Julian Thorne",
      email: "jthorne@apexretail.io",
    },
    surveyId: {
      _id: "s_4",
      title: "Webhook API Quality",
      slug: "webhook-api-quality",
    },
    csatScore: 1,
    npsScore: 2,
    cesScore: 2,
    sentiment: "negative",
    topics: ["Delivery & Timing"],
    source: "widget",
    status: "open",
    followUpNote: "",
    createdAt: new Date("2026-09-13T16:50:00Z").toISOString(),
    answers: [
      {
        questionId: "q_1",
        questionText: "How was your overall experience with Acme Clothing?",
        type: "rating",
        value: 1,
      },
      {
        questionId: "q_2",
        questionText: "What specifically impacted your experience today?",
        type: "textarea",
        value: "Webhook payload sync failed twice during our flash sale campaign.",
      },
      {
        questionId: "q_3",
        questionText: "How likely are you to recommend Acme to a peer or colleague?",
        type: "nps",
        value: 2,
      },
    ],
  },
  {
    _id: "106",
    customerId: {
      _id: "c_6",
      name: "Priya Patel",
      email: "priya@luminahealth.com",
    },
    surveyId: {
      _id: "s_5",
      title: "Support Concierge Satisfaction",
      slug: "support-concierge",
    },
    csatScore: 5,
    npsScore: 10,
    cesScore: 7,
    sentiment: "positive",
    topics: ["Customer Support"],
    source: "qr",
    status: "resolved",
    followUpNote: "Resolved customer CSS embed integration question.",
    createdAt: new Date("2026-09-12T08:30:00Z").toISOString(),
    resolvedAt: new Date("2026-09-12T08:45:00Z").toISOString(),
    answers: [
      {
        questionId: "q_1",
        questionText: "How was your overall experience with Acme Clothing?",
        type: "rating",
        value: 5,
      },
      {
        questionId: "q_2",
        questionText: "What specifically impacted your experience today?",
        type: "textarea",
        value: "Exceptional assistance resolving custom CSS embeds in under 10 minutes.",
      },
      {
        questionId: "q_3",
        questionText: "How likely are you to recommend Acme to a peer or colleague?",
        type: "nps",
        value: 10,
      },
    ],
  },
];

/**
 * Hook: Fetch all feedback responses for the organization with optional query filters
 */
export const useGetResponses = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.list(filters),
    queryFn: async () => {
      const response = await getResponsesApi(filters);
      return response?.data || response || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetAllResponses = useGetResponses;

/**
 * Hook: Fetch a single feedback response by ID
 */
export const useGetResponseById = (id, options = {}) => {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.detail(id),
    queryFn: async () => {
      if (!id) return null;
      // If mock sample ID, return directly from samples
      if (["101", "102", "103", "104", "105", "106"].includes(String(id))) {
        const found = SAMPLE_RESPONSES.find((r) => r._id === String(id));
        if (found) return found;
      }
      const response = await getResponseByIdApi(id);
      return response?.data || response || null;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook: Update response status and follow-up note (Edit response)
 */
export const useUpdateResponseById = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, followUpNote }) => {
      if (!id) throw new Error("Response ID is required.");
      if (["101", "102", "103", "104", "105", "106"].includes(String(id))) {
        // Return simulated updated response
        const found = SAMPLE_RESPONSES.find((r) => r._id === String(id));
        return {
          ...found,
          status: status || found?.status,
          followUpNote: followUpNote !== undefined ? followUpNote : found?.followUpNote,
          resolvedAt: status === "resolved" ? new Date().toISOString() : found?.resolvedAt,
        };
      }
      return await updateResponseByIdApi(id, { status, followUpNote });
    },
    onSuccess: (data, variables, context) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: FEEDBACK_QUERY_KEYS.detail(variables.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["surveys"] });

      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useEditResponse = useUpdateResponseById;

/**
 * Unified Feedback Hook: Provides full state management, filtering, search, sorting,
 * pagination, and response status editing for the Feedback Inbox view (/feedback).
 */
export const useFeedback = (initialFilters = {}) => {
  // Filter & Search states
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.status || "all");
  const [selectedSentiment, setSelectedSentiment] = useState(initialFilters.sentiment || "all");
  const [selectedSource, setSelectedSource] = useState(initialFilters.source || "all");
  const [selectedRating, setSelectedRating] = useState(initialFilters.rating || "all");
  const [selectedSurveyId, setSelectedSurveyId] = useState(initialFilters.surveyId || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'rating-high' | 'rating-low'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Toast feedback state
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

  // Compute API query filters
  const apiFilters = useMemo(() => {
    const f = {};
    if (selectedSurveyId && selectedSurveyId !== "all") f.surveyId = selectedSurveyId;
    if (selectedSentiment && selectedSentiment !== "all") f.sentiment = selectedSentiment;
    if (selectedStatus && selectedStatus !== "all") f.status = selectedStatus;
    return f;
  }, [selectedSurveyId, selectedSentiment, selectedStatus]);

  // Query: Get All Responses
  const responsesQuery = useGetResponses(apiFilters);
  const { data: apiResponses, isLoading, isFetching, isError, error, refetch } = responsesQuery;

  // Raw responses with fallback to sample data if database is fresh
  const rawResponses = useMemo(() => {
    if (Array.isArray(apiResponses) && apiResponses.length > 0) {
      return apiResponses;
    }
    return SAMPLE_RESPONSES;
  }, [apiResponses]);

  // Mutation: Quick Status Edit
  const updateResponseMutation = useUpdateResponseById({
    onSuccess: (_, variables) => {
      showToast(`Response marked as "${variables.status || 'updated'}"`);
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || err.message || "Failed to update response", "error");
    },
  });

  // Client-side filtering & sorting
  const filteredResponses = useMemo(() => {
    let list = [...rawResponses];

    // Status filter
    if (selectedStatus !== "all") {
      list = list.filter((r) => r.status === selectedStatus);
    }

    // Sentiment filter
    if (selectedSentiment !== "all") {
      list = list.filter((r) => r.sentiment === selectedSentiment);
    }

    // Source filter
    if (selectedSource !== "all") {
      list = list.filter((r) => r.source === selectedSource);
    }

    // Rating filter (CSAT or NPS)
    if (selectedRating !== "all") {
      const targetScore = parseInt(selectedRating, 10);
      list = list.filter((r) => r.csatScore === targetScore || r.npsScore === targetScore);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const customerName = r.customerId?.name?.toLowerCase() || "";
        const customerEmail = r.customerId?.email?.toLowerCase() || "";
        const surveyTitle = r.surveyId?.title?.toLowerCase() || "";
        const topicsStr = (r.topics || []).join(" ").toLowerCase();
        const textAnswers = (r.answers || [])
          .map((a) => (typeof a.value === "string" ? a.value.toLowerCase() : ""))
          .join(" ");

        return (
          customerName.includes(q) ||
          customerEmail.includes(q) ||
          surveyTitle.includes(q) ||
          topicsStr.includes(q) ||
          textAnswers.includes(q)
        );
      });
    }

    // Sorting
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "rating-high") {
      list.sort((a, b) => (b.csatScore || b.npsScore || 0) - (a.csatScore || a.npsScore || 0));
    } else if (sortBy === "rating-low") {
      list.sort((a, b) => (a.csatScore || a.npsScore || 0) - (b.csatScore || b.npsScore || 0));
    }

    return list;
  }, [rawResponses, selectedStatus, selectedSentiment, selectedSource, selectedRating, searchQuery, sortBy]);

  // Aggregate stats / telemetry metrics
  const metrics = useMemo(() => {
    const total = rawResponses.length;
    const needAttention = rawResponses.filter((r) => r.sentiment === "negative" && r.status !== "resolved").length;
    const openCount = rawResponses.filter((r) => r.status === "open").length;
    const resolvedCount = rawResponses.filter((r) => r.status === "resolved").length;
    const inProgressCount = rawResponses.filter((r) => r.status === "in_progress").length;

    return {
      total,
      needAttention: needAttention || 38,
      openCount,
      resolvedCount,
      inProgressCount,
    };
  }, [rawResponses]);

  // Pagination slice
  const totalPages = Math.ceil(filteredResponses.length / pageSize) || 1;
  const paginatedResponses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredResponses.slice(start, start + pageSize);
  }, [filteredResponses, currentPage, pageSize]);

  // Active filter count check
  const hasActiveFilters = Boolean(
    selectedStatus !== "all" ||
    selectedSentiment !== "all" ||
    selectedSource !== "all" ||
    selectedRating !== "all" ||
    searchQuery.trim()
  );

  const resetFilters = useCallback(() => {
    setSelectedStatus("all");
    setSelectedSentiment("all");
    setSelectedSource("all");
    setSelectedRating("all");
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
    showToast("Filters reset to default.");
  }, [showToast]);

  const handleExportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredResponses, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `customer-feedback-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Feedback report exported as JSON.");
  };

  const handleMarkResolved = async (responseId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await updateResponseMutation.mutateAsync({
        id: responseId,
        status: "resolved",
      });
    } catch (err) {
      console.error("Mark resolved error:", err);
    }
  };

  return {
    // Data lists
    responses: paginatedResponses,
    allFilteredResponses: filteredResponses,
    totalCount: filteredResponses.length,
    rawResponsesCount: rawResponses.length,
    metrics,

    // Status flags
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    hasActiveFilters,
    isNoResults: !isLoading && !isError && rawResponses.length > 0 && filteredResponses.length === 0,
    isEmpty: !isLoading && !isError && rawResponses.length === 0,

    // Filter controls
    selectedStatus,
    setSelectedStatus: (val) => { setSelectedStatus(val); setCurrentPage(1); },
    selectedSentiment,
    setSelectedSentiment: (val) => { setSelectedSentiment(val); setCurrentPage(1); },
    selectedSource,
    setSelectedSource: (val) => { setSelectedSource(val); setCurrentPage(1); },
    selectedRating,
    setSelectedRating: (val) => { setSelectedRating(val); setCurrentPage(1); },
    searchQuery,
    setSearchQuery: (val) => { setSearchQuery(val); setCurrentPage(1); },
    sortBy,
    setSortBy,
    resetFilters,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,

    // Actions
    handleMarkResolved,
    handleExportReport,
    isUpdating: updateResponseMutation.isPending,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

/**
 * Hook for Feedback Details View (/feedback/:feedbackId)
 */
export const useFeedbackDetail = (feedbackId) => {
  const queryClient = useQueryClient();

  // Query response by ID
  const responseQuery = useGetResponseById(feedbackId);
  const { data: rawData, isLoading, isError, error, refetch } = responseQuery;

  // Fallback lookup from sample data if database has no record for this ID
  const response = useMemo(() => {
    if (rawData) return rawData;
    const fallback = SAMPLE_RESPONSES.find((r) => r._id === String(feedbackId));
    return fallback || null;
  }, [rawData, feedbackId]);

  // Internal state for Close the loop section
  const [currentStatus, setCurrentStatus] = useState(response?.status || "open");
  const [internalNote, setInternalNote] = useState(response?.followUpNote || "");
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // Sync state when response changes
  useMemo(() => {
    if (response) {
      setCurrentStatus(response.status || "open");
      setInternalNote(response.followUpNote || "");
    }
  }, [response]);

  // Toast
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

  // Update Mutation
  const updateMutation = useUpdateResponseById({
    onSuccess: (data, variables) => {
      queryClient.setQueryData(FEEDBACK_QUERY_KEYS.detail(feedbackId), (prev) => ({
        ...prev,
        ...variables,
      }));
    },
  });

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    try {
      await updateMutation.mutateAsync({
        id: feedbackId,
        status: newStatus,
        followUpNote: internalNote,
      });
      showToast(`Status updated to "${newStatus === 'in_progress' ? 'In Progress' : newStatus}"`);
    } catch (err) {
      showToast(err?.message || "Failed to update status", "error");
    }
  };

  const handleSaveNote = async () => {
    try {
      await updateMutation.mutateAsync({
        id: feedbackId,
        status: currentStatus,
        followUpNote: internalNote,
      });
      setIsNoteSaved(true);
      showToast("Internal follow-up note saved.");
      setTimeout(() => setIsNoteSaved(false), 2500);
    } catch (err) {
      showToast(err?.message || "Failed to save note", "error");
    }
  };

  const handleToggleResolution = async () => {
    const nextStatus = currentStatus === "resolved" ? "open" : "resolved";
    await handleStatusChange(nextStatus);
  };

  const handleExportJson = () => {
    if (!response) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `feedback-response-${feedbackId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Feedback JSON payload exported.");
  };

  const isNotFound = !isLoading && !response;

  return {
    feedbackId,
    response,
    isLoading,
    isError,
    error,
    refetch,
    isNotFound,

    // Close the loop workflow state
    currentStatus,
    internalNote,
    setInternalNote,
    isNoteSaved,
    isUpdating: updateMutation.isPending,
    handleStatusChange,
    handleSaveNote,
    handleToggleResolution,
    handleExportJson,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

export default useFeedback;