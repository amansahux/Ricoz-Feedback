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

  // Query: Get All Responses from real backend database
  const responsesQuery = useGetResponses(apiFilters);
  const { data: apiResponses, isLoading, isFetching, isError, error, refetch } = responsesQuery;

  // Only real data from backend
  const rawResponses = useMemo(() => {
    if (Array.isArray(apiResponses)) {
      return apiResponses;
    }
    return [];
  }, [apiResponses]);

  // Mutation: Quick Status Edit
  const updateResponseMutation = useUpdateResponseById({
    onSuccess: (_, variables) => {
      showToast(`Response marked as "${variables.status || "updated"}"`);
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

  // Aggregate stats / telemetry metrics based on real database records
  const metrics = useMemo(() => {
    const total = rawResponses.length;
    const needAttention = rawResponses.filter((r) => r.sentiment === "negative" && r.status !== "resolved").length;
    const openCount = rawResponses.filter((r) => r.status === "open").length;
    const resolvedCount = rawResponses.filter((r) => r.status === "resolved").length;
    const inProgressCount = rawResponses.filter((r) => r.status === "in_progress").length;

    return {
      total,
      needAttention,
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

  // Query real response by ID from backend
  const responseQuery = useGetResponseById(feedbackId);
  const { data: rawData, isLoading, isError, error, refetch } = responseQuery;

  const response = rawData || null;

  // Internal state for Close the loop section
  const [currentStatus, setCurrentStatus] = useState(response?.status || "open");
  const [internalNote, setInternalNote] = useState(response?.followUpNote || "");
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // Sync state when real response arrives or changes
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

  const isNotFound = !isLoading && !response && !isError;

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