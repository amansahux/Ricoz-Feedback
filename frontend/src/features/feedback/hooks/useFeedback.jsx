import { useState, useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  getResponses as getResponsesApi,
  getResponseById as getResponseByIdApi,
  updateResponseById as updateResponseByIdApi,
} from "../apis/feedback.api.jsx";
import { useDebounce } from "../../../shared/hooks/useDebounce.js";

// Standard query keys hierarchy for feedback/responses
export const FEEDBACK_QUERY_KEYS = {
  all: ["responses"],
  lists: () => [...FEEDBACK_QUERY_KEYS.all, "list"],
  list: (filters) => [...FEEDBACK_QUERY_KEYS.lists(), filters],
  details: () => [...FEEDBACK_QUERY_KEYS.all, "detail"],
  detail: (id) => [...FEEDBACK_QUERY_KEYS.details(), id],
};

/**
 * Hook: Fetch all feedback responses for the organization with optional query filters and pagination
 */
export const useGetResponses = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.list(filters),
    queryFn: async () => {
      const response = await getResponsesApi(filters);
      return {
        responses: response?.data || (Array.isArray(response) ? response : []),
        pagination: response?.pagination || {
          total: Array.isArray(response?.data) ? response.data.length : 0,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    },
    placeholderData: keepPreviousData,
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
    onMutate: async ({ id, status, followUpNote }) => {
      // Cancel outgoing queries for responses to prevent race conditions
      await queryClient.cancelQueries({ queryKey: FEEDBACK_QUERY_KEYS.all });

      // Snapshot previous cache values for rollback on error
      const previousResponses = queryClient.getQueriesData({ queryKey: FEEDBACK_QUERY_KEYS.all });

      // Optimistically update single detail query in cache
      if (id) {
        queryClient.setQueryData(FEEDBACK_QUERY_KEYS.detail(id), (old) => {
          if (!old) return old;
          return {
            ...old,
            status: status !== undefined ? status : old.status,
            followUpNote: followUpNote !== undefined ? followUpNote : old.followUpNote,
          };
        });
      }

      return { previousResponses };
    },
    onError: (error, variables, context) => {
      // Rollback to snapshot on failure
      if (context?.previousResponses) {
        context.previousResponses.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      const updatedItem = data?.data || data;

      // 1. Confirm and reconcile detail query cache with server response
      if (variables?.id) {
        queryClient.setQueryData(FEEDBACK_QUERY_KEYS.detail(variables.id), (old) => {
          if (!old) return old;
          return {
            ...old,
            ...(typeof updatedItem === "object" ? updatedItem : {}),
            status: variables.status ?? updatedItem?.status ?? old.status,
            followUpNote:
              variables.followUpNote !== undefined
                ? variables.followUpNote
                : updatedItem?.followUpNote ?? old.followUpNote,
          };
        });
      }

      // 2. Invalidate queries to maintain consistency across the entire app
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
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

  // 1-second debounce on searching
  const debouncedSearch = useDebounce(searchQuery, 1000);

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
    const f = {
      page: currentPage,
      limit: pageSize,
      sortBy,
    };
    if (selectedSurveyId && selectedSurveyId !== "all") f.surveyId = selectedSurveyId;
    if (selectedSentiment && selectedSentiment !== "all") f.sentiment = selectedSentiment;
    if (selectedStatus && selectedStatus !== "all") f.status = selectedStatus;
    if (selectedSource && selectedSource !== "all") f.source = selectedSource;
    if (selectedRating && selectedRating !== "all") f.rating = selectedRating;
    if (debouncedSearch.trim()) f.search = debouncedSearch.trim();
    return f;
  }, [selectedSurveyId, selectedSentiment, selectedStatus, selectedSource, selectedRating, debouncedSearch, sortBy, currentPage, pageSize]);

  // Query: Get All Responses from real backend database
  const responsesQuery = useGetResponses(apiFilters);
  const { data: queryData, isLoading, isFetching, isError, error, refetch } = responsesQuery;

  const responses = useMemo(() => queryData?.responses || [], [queryData]);
  const pagination = useMemo(() => queryData?.pagination || {
    total: responses.length,
    page: currentPage,
    limit: pageSize,
    totalPages: Math.ceil(responses.length / pageSize) || 1,
    hasNextPage: false,
    hasPrevPage: false,
  }, [queryData, responses.length, currentPage, pageSize]);

  // Mutation: Quick Status Edit
  const updateResponseMutation = useUpdateResponseById({
    onSuccess: (_, variables) => {
      showToast(`Response marked as "${variables.status || "updated"}"`);
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || err.message || "Failed to update response", "error");
    },
  });

  // Aggregate stats / telemetry metrics
  const metrics = useMemo(() => {
    const total = pagination.total || responses.length;
    const needAttention = responses.filter((r) => r.sentiment === "negative" && r.status !== "resolved").length;
    const openCount = responses.filter((r) => r.status === "open").length;
    const resolvedCount = responses.filter((r) => r.status === "resolved").length;
    const inProgressCount = responses.filter((r) => r.status === "in_progress").length;

    return {
      total,
      needAttention,
      openCount,
      resolvedCount,
      inProgressCount,
    };
  }, [pagination.total, responses]);

  const totalPages = pagination.totalPages || 1;
  const totalCount = pagination.total || responses.length;

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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return {
    // Data lists
    responses,
    pagination,
    totalCount,
    rawResponsesCount: totalCount,
    metrics,

    // Status flags
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    hasActiveFilters,
    isNoResults: !isLoading && !isError && totalCount === 0 && hasActiveFilters,
    isEmpty: !isLoading && !isError && totalCount === 0 && !hasActiveFilters,

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
    setSearchQuery: handleSearchChange,
    sortBy,
    setSortBy: (val) => { setSortBy(val); setCurrentPage(1); },
    resetFilters,

    // Pagination
    currentPage,
    setCurrentPage: handlePageChange,
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