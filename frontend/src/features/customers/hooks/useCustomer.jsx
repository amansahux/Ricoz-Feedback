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
 * Hook: Fetch public survey with optimized caching and zero unnecessary re-fetching
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
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection time
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
 * Hook: Fetch all customers with search, pagination, and sorting
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
    staleTime: 1000 * 60 * 2, // 2 minutes
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
 * Hook: Encapsulates all public feedback form business logic, state management,
 * validation, answer formatting, progress calculation, and submission.
 */
export const useGiveFeedback = ({ organizationSlug, surveySlug, source = "link" }) => {
  // Form State
  const [answersState, setAnswersState] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // 1. Fetch survey with deduplication and caching
  const {
    data: surveyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPublicSurvey(organizationSlug, surveySlug, {
    retry: 1,
  });

  // 2. Submit Response Mutation
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

  // 3. Derive active survey
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

  // Handle single answer change & clear inline error
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

  // Form Validation logic
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

  // Submit Feedback Handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      setSubmissionError(null);

      if (!validateForm()) {
        return;
      }

      // Format payload answers according to backend model schema: [{ questionId, value }]
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

  // Reset form handler
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
    // Survey Data & Meta
    activeSurvey,
    questions,
    requiredQuestions,
    totalQuestions: questions.length,
    answeredCount,
    requiredCount: requiredQuestions.length,

    // Form inputs and validation state
    answersState,
    customerName,
    setCustomerName,
    customerEmail,
    setEmail: setCustomerEmail,
    validationErrors,
    submissionError,
    dismissSubmissionError,
    isSubmittedSuccess,

    // Statuses
    isLoading,
    isDraft: surveyData?.status === "draft",
    isUnavailable: isError && !activeSurvey,
    errorMessage: error?.response?.data?.message,
    isSubmitting: createResponseMutation.isPending,

    // Action handlers
    handleAnswerChange,
    handleSubmit,
    handleReset,
    refetch,
  };
};

/**
 * Unified customer and feedback hook
 */
export const useCustomer = (params = {}) => {
  const customersQuery = useGetCustomers(params);
  const responsesQuery = useGetResponses(params);
  const createResponseMutation = useCreateResponse();
  const updateResponseMutation = useUpdateResponseById();

  const submitResponse = async (organizationSlug, surveySlug, responseData) => {
    return createResponseMutation.mutateAsync({
      organizationSlug,
      surveySlug,
      responseData,
    });
  };

  const updateResponse = async (id, updateData) => {
    return updateResponseMutation.mutateAsync({
      id,
      ...updateData,
    });
  };

  return {
    // Customers data & states
    customers: customersQuery.data?.customers || [],
    totalCustomers: customersQuery.data?.totalCount || 0,
    isLoadingCustomers: customersQuery.isLoading,
    isFetchingCustomers: customersQuery.isFetching,
    customersError: customersQuery.error,
    refetchCustomers: customersQuery.refetch,

    // Responses data & states
    responses: responsesQuery.data || [],
    isLoadingResponses: responsesQuery.isLoading,
    isFetchingResponses: responsesQuery.isFetching,
    responsesError: responsesQuery.error,
    refetchResponses: responsesQuery.refetch,

    // Submissions
    submitResponse,
    isSubmittingResponse: createResponseMutation.isPending,
    submitResponseError: createResponseMutation.error,
    createResponseMutation,

    // Updates
    updateResponse,
    isUpdatingResponse: updateResponseMutation.isPending,
    updateResponseError: updateResponseMutation.error,
    updateResponseMutation,

    // Sub-hooks
    useGetCustomerDetail,
    useGetCustomerById,
    useGetResponseById,
  };
};

export default useCustomer;
