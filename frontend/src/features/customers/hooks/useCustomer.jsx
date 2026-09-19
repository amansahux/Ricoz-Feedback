import { useState, useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createResponse as createResponseApi,
  getPublicSurvey as getPublicSurveyApi,
  getCustomers as getCustomersApi,
  getCustomerDetail as getCustomerDetailApi,
} from "../apis/customer.api.jsx";
import {
  FEEDBACK_QUERY_KEYS,
  useGetResponses,
  useGetResponseById,
  useUpdateResponseById,
} from "../../feedback/hooks/useFeedback.jsx";

// Re-export for backward compatibility
export { useGetResponses, useGetResponseById, useUpdateResponseById };

// Standard query keys hierarchy
export const RESPONSE_QUERY_KEYS = {
  ...FEEDBACK_QUERY_KEYS,
  publicSurvey: (orgSlug, surveySlug) => ["public-survey", orgSlug, surveySlug],
  customers: () => ["customers"],
  customerList: (params) => ["customers", "list", params],
  customerDetail: (id) => ["customers", "detail", id],
};

// Default fallback survey for visual testing & demo flows
export const DEFAULT_PREVIEW_SURVEY = {
  _id: "preview-survey-1",
  title: "Post Purchase Experience",
  description:
    "Tell us about your recent purchase experience so we can keep improving our fits, fast shipping, and concierge support.",
  status: "published",
  organizationId: {
    name: "Acme Clothing",
    slug: "acme-clothing",
  },
  questions: [
    {
      _id: "q_csat_1",
      type: "csat",
      question: "Overall, how satisfied are you with your purchase?",
      required: true,
    },
    {
      _id: "q_nps_2",
      type: "nps",
      question: "How likely are you to recommend Acme Clothing to a friend or colleague?",
      required: true,
    },
    {
      _id: "q_ces_3",
      type: "ces",
      question: "How easy was it to complete your checkout and delivery?",
      required: false,
    },
    {
      _id: "q_mc_4",
      type: "multiple-choice",
      question: "Which factor mattered most in your decision to shop with us?",
      required: false,
      options: [
        "Product Quality & Craft",
        "Fast & Reliable Delivery",
        "Customer Support & Returns",
        "Value for Money",
      ],
    },
    {
      _id: "q_yn_5",
      type: "yes-no",
      question: "Did your order arrive in perfect condition?",
      required: false,
    },
    {
      _id: "q_txt_6",
      type: "text",
      question: "What did you like most about the experience?",
      required: false,
    },
    {
      _id: "q_textarea_7",
      type: "textarea",
      question: "What could we improve for next time?",
      required: false,
    },
  ],
};

/**
 * Hook: Fetch public survey with optimized caching
 */
export const useGetPublicSurvey = (organizationSlug, surveySlug, options = {}) => {
  return useQuery({
    queryKey: RESPONSE_QUERY_KEYS.publicSurvey(organizationSlug, surveySlug),
    queryFn: async () => {
      if (!organizationSlug || !surveySlug) return null;
      const response = await getPublicSurveyApi(organizationSlug, surveySlug);
      return response?.data || response || null;
    },
    enabled: Boolean(organizationSlug && surveySlug),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};

/**
 * Hook: Submit feedback mutation with cache invalidation
 */
export const useCreateResponse = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ organizationSlug, surveySlug, responseData }) => {
      if (!organizationSlug || !surveySlug) {
        throw new Error("organizationSlug and surveySlug are required.");
      }
      return await createResponseApi(organizationSlug, surveySlug, responseData);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: RESPONSE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: RESPONSE_QUERY_KEYS.customers() });
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

/**
 * Hook: Fetch all customers with query parameters (search, sorting, pagination)
 */
export const useGetCustomers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: RESPONSE_QUERY_KEYS.customerList(params),
    queryFn: async () => {
      const response = await getCustomersApi(params);
      return {
        customers: response?.data || [],
        totalCount: response?.totalCount || 0,
        limit: response?.limit || 50,
        skip: response?.skip || 0,
      };
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook: Fetch single customer details by ID with response telemetry
 */
export const useGetCustomerDetail = (customerId, options = {}) => {
  return useQuery({
    queryKey: RESPONSE_QUERY_KEYS.customerDetail(customerId),
    queryFn: async () => {
      if (!customerId) return null;
      const response = await getCustomerDetailApi(customerId);
      return response?.data || response || null;
    },
    enabled: Boolean(customerId),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetCustomerById = useGetCustomerDetail;

/**
 * Full Feature Hook for Customer Management (/customers)
 * Encapsulates search, sorting, client pagination, metric calculations, and toast notifications.
 */
export const useCustomerDirectory = (initialParams = {}) => {
  const [searchQuery, setSearchQuery] = useState(initialParams.search || "");
  const [sortBy, setSortBy] = useState(initialParams.sortBy || "recent"); // recent | most_feedback | high_rating | low_rating | name_asc | name_desc
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // API query
  const queryParams = useMemo(() => {
    return {
      search: searchQuery.trim() || undefined,
    };
  }, [searchQuery]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomers(queryParams);

  const rawCustomers = useMemo(() => {
    return data?.customers || [];
  }, [data]);

  // Client-side sorting
  const sortedCustomers = useMemo(() => {
    const list = [...rawCustomers];

    if (sortBy === "recent") {
      list.sort((a, b) => {
        const timeA = a.stats?.latestResponseAt || a.createdAt;
        const timeB = b.stats?.latestResponseAt || b.createdAt;
        return new Date(timeB) - new Date(timeA);
      });
    } else if (sortBy === "most_feedback") {
      list.sort((a, b) => (b.stats?.totalResponses || 0) - (a.stats?.totalResponses || 0));
    } else if (sortBy === "high_rating") {
      list.sort((a, b) => (b.stats?.avgCsat || b.stats?.avgNps || 0) - (a.stats?.avgCsat || a.stats?.avgNps || 0));
    } else if (sortBy === "low_rating") {
      list.sort((a, b) => (a.stats?.avgCsat || a.stats?.avgNps || 0) - (b.stats?.avgCsat || b.stats?.avgNps || 0));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return list;
  }, [rawCustomers, sortBy]);

  // Metrics summary
  const metrics = useMemo(() => {
    const total = data?.totalCount || rawCustomers.length;
    const ratedCustomers = rawCustomers.filter((c) => c.stats?.avgCsat != null || c.stats?.avgNps != null);
    
    let avgExp = "—";
    if (ratedCustomers.length > 0) {
      const sum = ratedCustomers.reduce((acc, c) => {
        const score = c.stats?.avgCsat || (c.stats?.avgNps ? (c.stats.avgNps / 2).toFixed(1) : 0);
        return acc + Number(score);
      }, 0);
      avgExp = (sum / ratedCustomers.length).toFixed(1);
    }

    return {
      totalCustomers: total,
      avgExperience: avgExp,
    };
  }, [data, rawCustomers]);

  // Pagination slice
  const totalPages = Math.ceil(sortedCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  const hasSearch = Boolean(searchQuery.trim());

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSortBy("recent");
    setCurrentPage(1);
    showToast("Customer search reset.");
  }, [showToast]);

  return {
    customers: paginatedCustomers,
    allCustomers: sortedCustomers,
    totalCount: data?.totalCount || rawCustomers.length,
    filteredCount: sortedCustomers.length,
    metrics,

    // Statuses
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isEmpty: !isLoading && !isError && rawCustomers.length === 0 && !hasSearch,
    isNoResults: !isLoading && !isError && rawCustomers.length === 0 && hasSearch,

    // Filter controls
    searchQuery,
    setSearchQuery: (val) => {
      setSearchQuery(val);
      setCurrentPage(1);
    },
    sortBy,
    setSortBy,
    hasSearch,
    resetFilters,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

/**
 * Full Feature Hook for Customer Detail View (/customers/:customerId)
 * Encapsulates single customer fetching, response history filtering, metrics, and export.
 */
export const useCustomerProfile = (customerId) => {
  const [surveyFilter, setSurveyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest | high_rating | low_rating

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

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomerDetail(customerId);

  const customer = data?.customer || null;
  const rawResponses = useMemo(() => data?.responses || [], [data]);
  const summary = data?.summary || {};

  // Extract unique survey titles for filter dropdown
  const uniqueSurveys = useMemo(() => {
    const map = new Map();
    rawResponses.forEach((r) => {
      if (r.surveyId?._id) {
        map.set(r.surveyId._id.toString(), r.surveyId.title || "Survey");
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [rawResponses]);

  // Filter & sort responses
  const filteredResponses = useMemo(() => {
    let list = [...rawResponses];

    if (surveyFilter !== "all") {
      list = list.filter((r) => r.surveyId?._id?.toString() === surveyFilter);
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "high_rating") {
      list.sort((a, b) => (b.csatScore || b.npsScore || 0) - (a.csatScore || a.npsScore || 0));
    } else if (sortBy === "low_rating") {
      list.sort((a, b) => (a.csatScore || a.npsScore || 0) - (b.csatScore || b.npsScore || 0));
    }

    return list;
  }, [rawResponses, surveyFilter, sortBy]);

  const handleExportJson = () => {
    if (!data) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `customer-profile-${customerId}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Customer profile exported as JSON.");
  };

  const isNotFound = !isLoading && !isError && !customer;

  return {
    customerId,
    customer,
    responses: filteredResponses,
    allResponses: rawResponses,
    uniqueSurveys,
    summary,

    // Statuses
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isNotFound,
    isEmptyHistory: !isLoading && !isError && rawResponses.length === 0,

    // Filters
    surveyFilter,
    setSurveyFilter,
    sortBy,
    setSortBy,

    // Actions
    handleExportJson,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

/**
 * Public Form Feedback Hook
 */
export const useGiveFeedback = ({ organizationSlug, surveySlug, source = "link" }) => {
  const [answersState, setAnswersState] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const {
    data: surveyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPublicSurvey(organizationSlug, surveySlug, {
    retry: 1,
  });

  const createResponseMutation = useCreateResponse({
    onSuccess: () => {
      setIsSubmittedSuccess(true);
      setSubmissionError(null);
    },
    onError: (err) => {
      console.error("Submission error in useGiveFeedback:", err);
      setSubmissionError(
        err?.response?.data?.message ||
          "There was a brief network interruption. Please review your answers and try again."
      );
    },
  });

  const activeSurvey = useMemo(() => {
    if (surveyData) return surveyData;
    if (
      organizationSlug === "acme-clothing" ||
      organizationSlug === "demo" ||
      !surveyData
    ) {
      return {
        ...DEFAULT_PREVIEW_SURVEY,
        organizationId: {
          name: organizationSlug
            ? organizationSlug.replace(/-/g, " ")
            : "Recoz Feedback",
          slug: organizationSlug || "demo",
        },
      };
    }
    return null;
  }, [surveyData, organizationSlug]);

  const questions = useMemo(() => activeSurvey?.questions || [], [activeSurvey]);
  const requiredQuestions = useMemo(
    () => questions.filter((q) => q.required),
    [questions]
  );

  const answeredCount = useMemo(() => {
    return Object.keys(answersState).filter((key) => {
      const val = answersState[key];
      return val !== undefined && val !== null && val !== "";
    }).length;
  }, [answersState]);

  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswersState((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setValidationErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    let firstErrorElementId = null;

    questions.forEach((q) => {
      const qId = q._id;
      const answerVal = answersState[qId];
      if (
        q.required &&
        (answerVal === undefined || answerVal === null || answerVal === "")
      ) {
        errors[qId] = "Please answer this required question before submitting.";
        if (!firstErrorElementId) {
          firstErrorElementId = `question-group-${qId}`;
        }
      }
    });

    setValidationErrors(errors);

    if (firstErrorElementId) {
      const el = document.getElementById(firstErrorElementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }

    return true;
  }, [questions, answersState]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setSubmissionError(null);

      if (!validateForm()) return;

      const formattedAnswers = Object.entries(answersState)
        .filter(([_, val]) => val !== undefined && val !== null && val !== "")
        .map(([questionId, value]) => ({
          questionId,
          value,
        }));

      if (formattedAnswers.length === 0) {
        setSubmissionError("Please answer at least one question before submitting.");
        return;
      }

      const payload = {
        name: customerName?.trim() || undefined,
        email: customerEmail?.trim() || undefined,
        answers: formattedAnswers,
        source: ["link", "qr", "widget"].includes(source) ? source : "link",
      };

      createResponseMutation.mutate({
        organizationSlug:
          organizationSlug || activeSurvey?.organizationId?.slug || "org",
        surveySlug: surveySlug || activeSurvey?.slug || "survey",
        responseData: payload,
      });
    },
    [
      validateForm,
      answersState,
      customerName,
      customerEmail,
      source,
      createResponseMutation,
      organizationSlug,
      surveySlug,
      activeSurvey,
    ]
  );

  const handleReset = useCallback(() => {
    setAnswersState({});
    setCustomerName("");
    setCustomerEmail("");
    setValidationErrors({});
    setSubmissionError(null);
    setIsSubmittedSuccess(false);
  }, []);

  const dismissSubmissionError = useCallback(() => {
    setSubmissionError(null);
  }, []);

  return {
    activeSurvey,
    questions,
    requiredQuestions,
    totalQuestions: questions.length,
    answeredCount,
    requiredCount: requiredQuestions.length,
    answersState,
    customerName,
    setCustomerName,
    customerEmail,
    setEmail: setCustomerEmail,
    validationErrors,
    submissionError,
    dismissSubmissionError,
    isSubmittedSuccess,
    isLoading,
    isDraft: surveyData?.status === "draft",
    isUnavailable: isError && !activeSurvey,
    errorMessage: error?.response?.data?.message,
    isSubmitting: createResponseMutation.isPending,
    handleAnswerChange,
    handleSubmit,
    handleReset,
    refetch,
  };
};

/**
 * Unified Root Hook
 */
export const useCustomer = (params = {}) => {
  const directory = useCustomerDirectory(params);
  const responsesQuery = useGetResponses(params);
  const createResponseMutation = useCreateResponse();
  const updateResponseMutation = useUpdateResponseById();

  return {
    ...directory,
    responses: responsesQuery.data || [],
    isLoadingResponses: responsesQuery.isLoading,
    isFetchingResponses: responsesQuery.isFetching,
    responsesError: responsesQuery.error,
    refetchResponses: responsesQuery.refetch,
    submitResponse: (orgSlug, surveySlug, data) =>
      createResponseMutation.mutateAsync({ organizationSlug: orgSlug, surveySlug, responseData: data }),
    updateResponse: (id, data) => updateResponseMutation.mutateAsync({ id, ...data }),
    useGetCustomerDetail,
    useGetCustomerById,
    useGetResponseById,
    useCustomerDirectory,
    useCustomerProfile,
  };
};

export default useCustomer;
