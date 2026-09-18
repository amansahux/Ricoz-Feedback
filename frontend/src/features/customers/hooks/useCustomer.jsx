import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createResponse as createResponseApi,
  getResponses as getResponsesApi,
  getResponseById as getResponseByIdApi,
  updateResponseById as updateResponseByIdApi,
  getPublicSurvey as getPublicSurveyApi,
} from "../apis/customer.api.jsx";

// Query key constants for cache management
export const RESPONSE_QUERY_KEYS = {
  all: ["responses"],
  lists: () => [...RESPONSE_QUERY_KEYS.all, "list"],
  list: (filters) => [...RESPONSE_QUERY_KEYS.lists(), filters],
  details: () => [...RESPONSE_QUERY_KEYS.all, "detail"],
  detail: (id) => [...RESPONSE_QUERY_KEYS.details(), id],
  publicSurvey: (orgSlug, surveySlug) => ["public-survey", orgSlug, surveySlug],
};

/**
 * Query Hook: Fetch a public survey by organizationSlug and surveySlug
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
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    ...options,
  });
};

/**
 * Mutation Hook: Submit customer feedback response to a public survey.
 * Handles customer creation/linkage and sentiment/topic analysis on backend.
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
      // Invalidate responses cache so dashboard and feedback lists refresh
      queryClient.invalidateQueries({ queryKey: RESPONSE_QUERY_KEYS.all });
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
 * Query Hook: Fetch responses with optional filters (surveyId, sentiment, status, etc.)
 */
export const useGetResponses = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: RESPONSE_QUERY_KEYS.list(filters),
    queryFn: async () => {
      const response = await getResponsesApi(filters);
      return response?.data || response || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  });
};

/**
 * Query Hook: Fetch a single response by ID with populated customer and survey details
 */
export const useGetResponseById = (id, options = {}) => {
  return useQuery({
    queryKey: RESPONSE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await getResponseByIdApi(id);
      return response?.data || response || null;
    },
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Mutation Hook: Update response status ('open'|'in_progress'|'resolved') and follow-up note
 */
export const useUpdateResponseById = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, followUpNote }) => {
      if (!id) throw new Error("Response ID is required.");
      return await updateResponseByIdApi(id, { status, followUpNote });
    },
    onSuccess: (data, variables, context) => {
      // Invalidate specific response and list caches
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: RESPONSE_QUERY_KEYS.detail(variables.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: RESPONSE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });

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
 * Unified customer & response management hook
 * Provides high-level methods and state for easy integration in components.
 */
export const useCustomer = (filters = {}) => {
  const responsesQuery = useGetResponses(filters);
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
    // Data & Queries
    responses: responsesQuery.data || [],
    isLoadingResponses: responsesQuery.isLoading,
    isFetchingResponses: responsesQuery.isFetching,
    responsesError: responsesQuery.error,
    refetchResponses: responsesQuery.refetch,

    // Mutation states & actions
    submitResponse,
    isSubmittingResponse: createResponseMutation.isPending,
    submitResponseError: createResponseMutation.error,
    createResponseMutation,

    updateResponse,
    isUpdatingResponse: updateResponseMutation.isPending,
    updateResponseError: updateResponseMutation.error,
    updateResponseMutation,

    // Query hooks exposed directly
    useGetResponseById,
  };
};

export default useCustomer;
