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
 * @param {Object} [filters={}] - Query filters (surveyId, sentiment, status, npsScore)
 * @param {Object} [options={}] - React Query options
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

// Alias for get all responses
export const useGetAllResponses = useGetResponses;

/**
 * Hook: Fetch a single feedback response by ID
 * @param {string} id - Response ID
 * @param {Object} [options={}] - React Query options
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
 * @param {Object} [options={}] - Mutation options (onSuccess, onError, etc.)
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

// Alias for edit response
export const useEditResponse = useUpdateResponseById;

/**
 * Unified Feedback Hook: Provides full state management, filtering, search, sorting,
 * selection, and response status editing for feedback management views.
 */
export const useFeedback = (initialFilters = {}) => {
  // Filter & Search states
  const [selectedSurveyId, setSelectedSurveyId] = useState(initialFilters.surveyId || "all");
  const [selectedSentiment, setSelectedSentiment] = useState(initialFilters.sentiment || "all");
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.status || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // 'recent' | 'nps-high' | 'nps-low'
  const [selectedResponseId, setSelectedResponseId] = useState(null);

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
  const { data: rawResponses = [], isLoading, isFetching, isError, error, refetch } = responsesQuery;

  // Query: Selected Single Response Detail
  const selectedResponseQuery = useGetResponseById(selectedResponseId);

  // Mutation: Edit / Update Response Status & Note
  const updateResponseMutation = useUpdateResponseById({
    onSuccess: (_, variables) => {
      showToast(`Response status updated to "${variables.status || 'updated'}"`);
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || err.message || "Failed to update response", "error");
    },
  });

  // Client-side filtering & sorting
  const displayedResponses = useMemo(() => {
    let list = Array.isArray(rawResponses) ? [...rawResponses] : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const customerName = r.customerId?.name?.toLowerCase() || "";
        const customerEmail = r.customerId?.email?.toLowerCase() || "";
        const surveyTitle = r.surveyId?.title?.toLowerCase() || "";
        const followUpNote = r.followUpNote?.toLowerCase() || "";
        const textAnswers = (r.answers || [])
          .map((a) => (typeof a.value === "string" ? a.value.toLowerCase() : ""))
          .join(" ");

        return (
          customerName.includes(q) ||
          customerEmail.includes(q) ||
          surveyTitle.includes(q) ||
          followUpNote.includes(q) ||
          textAnswers.includes(q)
        );
      });
    }

    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "nps-high") {
      list.sort((a, b) => (b.npsScore ?? -1) - (a.npsScore ?? -1));
    } else if (sortBy === "nps-low") {
      list.sort((a, b) => (a.npsScore ?? 11) - (b.npsScore ?? 11));
    }

    return list;
  }, [rawResponses, searchQuery, sortBy]);

  // Aggregate stats
  const metrics = useMemo(() => {
    const list = Array.isArray(rawResponses) ? rawResponses : [];
    const total = list.length;
    const positive = list.filter((r) => r.sentiment === "positive").length;
    const neutral = list.filter((r) => r.sentiment === "neutral").length;
    const negative = list.filter((r) => r.sentiment === "negative").length;
    const openCount = list.filter((r) => r.status === "open").length;
    const inProgressCount = list.filter((r) => r.status === "in_progress").length;
    const resolvedCount = list.filter((r) => r.status === "resolved").length;

    const npsList = list.filter((r) => typeof r.npsScore === "number");
    const avgNps =
      npsList.length > 0
        ? (npsList.reduce((acc, r) => acc + r.npsScore, 0) / npsList.length).toFixed(1)
        : null;

    return {
      total,
      positive,
      neutral,
      negative,
      openCount,
      inProgressCount,
      resolvedCount,
      avgNps,
    };
  }, [rawResponses]);

  // Action: Edit Response Status
  const handleEditStatus = async (id, status, followUpNote) => {
    return updateResponseMutation.mutateAsync({ id, status, followUpNote });
  };

  return {
    // Data lists
    responses: displayedResponses,
    rawResponses,
    metrics,

    // Loading & Query states
    isLoading,
    isFetching,
    isError,
    error,
    refetch,

    // Single Detail Query
    selectedResponseId,
    setSelectedResponseId,
    selectedResponse: selectedResponseQuery.data,
    isLoadingSelectedResponse: selectedResponseQuery.isLoading,

    // Filter controls
    selectedSurveyId,
    setSelectedSurveyId,
    selectedSentiment,
    setSelectedSentiment,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,

    // Mutations & Actions
    handleEditStatus,
    updateResponseMutation,
    isUpdating: updateResponseMutation.isPending,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

export default useFeedback;