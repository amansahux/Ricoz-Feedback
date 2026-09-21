import { useState, useMemo, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  deleteSurvey,
  publishSurvey,
  updateSurvey,
} from "../apis/surveys.api.jsx";



export const DEFAULT_BUILDER_QUESTIONS = [
  {
    _id: "q_1",
    type: "csat",
    question: "How satisfied are you with your overall purchasing experience?",
    required: true,
  },
  {
    _id: "q_2",
    type: "nps",
    question: "How likely are you to recommend Acme to a colleague or friend?",
    required: true,
  },
  {
    _id: "q_3",
    type: "multiple-choice",
    question: "Which factor most influenced your decision today?",
    required: false,
    options: ["Product Quality", "Pricing & Value", "Fast Shipping", "Customer Service"],
  },
  {
    _id: "q_4",
    type: "textarea",
    question: "What could we have done to make your experience even better?",
    required: false,
  },
];

// -------------------------------------------------------------
// Base Queries & Mutations Hook
// -------------------------------------------------------------
export const useSurveysApi = (surveyId = null) => {
  const queryClient = useQueryClient();

  // 1. Get All Surveys (only runs when needed)
  const getAllSurveysQuery = useQuery({
    queryKey: ["surveys"],
    queryFn: getAllSurveys,
    staleTime: 1000 * 60 * 5,
  });

  // 2. Get Survey by ID
  const getSurveyByIdQuery = useQuery({
    queryKey: ["surveys", surveyId],
    queryFn: () => getSurveyById(surveyId),
    enabled: Boolean(surveyId && !surveyId.startsWith("srv_sample_")),
    staleTime: 1000 * 60 * 10,
  });

  // 3. Create Survey
  const createSurveyMutation = useMutation({
    mutationFn: (data) => createSurvey(data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
    },
  });

  // 4. Update Survey
  const updateSurveyMutation = useMutation({
    mutationFn: ({ surveyId: id, data }) => updateSurvey(id, data),
    retry: false,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["surveys", variables.surveyId],
        exact: true,
      });
    },
  });

  // 5. Delete Survey
  const deleteSurveyMutation = useMutation({
    mutationFn: (id) => deleteSurvey(id),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
    },
  });

  // 6. Publish Survey
  const publishSurveyMutation = useMutation({
    mutationFn: (id) => publishSurvey(id),
    retry: false,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["surveys", id], exact: true });
    },
  });

  return {
    getAllSurveysQuery,
    getSurveyByIdQuery,
    createSurveyMutation,
    updateSurveyMutation,
    deleteSurveyMutation,
    publishSurveyMutation,
  };
};

// -------------------------------------------------------------
// 1. Hook for Survey List Page (/surveys)
// -------------------------------------------------------------
export const useSurveyList = () => {
  const { getAllSurveysQuery, deleteSurveyMutation } = useSurveysApi();
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = getAllSurveysQuery;

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [shareModalSurvey, setShareModalSurvey] = useState(null);
  const [deleteModalSurvey, setDeleteModalSurvey] = useState(null);

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

  const rawSurveys = useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }
    return [];
  }, [apiResponse]);

  // Org-wide avg CSAT from backend aggregation
  const avgCsat = useMemo(() => {
    if (apiResponse?.avgCsat != null) {
      return apiResponse.avgCsat;
    }
    return null;
  }, [apiResponse]);

  // Total responses across all surveys
  const totalResponses = useMemo(() => {
    return rawSurveys.reduce((acc, s) => acc + (s.responseCount || 0), 0);
  }, [rawSurveys]);

  const filterCounts = useMemo(() => {
    return {
      all: rawSurveys.length,
      published: rawSurveys.filter((s) => s.status === "published").length,
      draft: rawSurveys.filter((s) => s.status === "draft").length,
      archived: rawSurveys.filter((s) => s.status === "archived").length,
    };
  }, [rawSurveys]);

  const displayedSurveys = useMemo(() => {
    let list = [...rawSurveys];

    if (activeFilter !== "all") {
      list = list.filter((s) => s.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.slug?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "responses") {
      list.sort((a, b) => (b.responseCount || 0) - (a.responseCount || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [rawSurveys, activeFilter, searchQuery, sortBy]);

  const handleOpenShare = useCallback(
    (survey) => {
      if (!survey) return;
      if (survey.status === "draft") {
        showToast("Cannot share draft survey. Please publish it first.", "error");
        return;
      }
      setShareModalSurvey(survey);
    },
    [showToast]
  );

  const handleDeleteConfirm = async (surveyId) => {
    try {
      if (surveyId.startsWith("srv_sample_")) {
        showToast("Survey deleted from overview.");
      } else {
        await deleteSurveyMutation.mutateAsync(surveyId);
        showToast("Survey deleted successfully.");
      }
      setDeleteModalSurvey(null);
    } catch (err) {
      showToast(err.message || "Failed to delete survey", "error");
    }
  };

  return {
    surveys: displayedSurveys,
    rawSurveys,
    filterCounts,
    totalResponses,
    avgCsat,
    isLoading,
    isError,
    error,
    refetch,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    shareModalSurvey,
    setShareModalSurvey,
    handleOpenShare,
    closeShareModal: () => setShareModalSurvey(null),
    deleteModalSurvey,
    setDeleteModalSurvey,
    handleDeleteConfirm,
    isDeleting: deleteSurveyMutation.isPending,
    toast,
    showToast,
    hideToast,
  };
};

// -------------------------------------------------------------
// 2. Hook for Create / Edit Survey Builder Page (/surveys/create)
// -------------------------------------------------------------
export const useCreateSurveyBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surveyIdParam = searchParams.get("surveyId");

  const queryClient = useQueryClient();

  // Load survey by ID query
  const getSurveyByIdQuery = useQuery({
    queryKey: ["surveys", surveyIdParam],
    queryFn: () => getSurveyById(surveyIdParam),
    enabled: Boolean(surveyIdParam && !surveyIdParam.startsWith("srv_sample_")),
    staleTime: 1000 * 60 * 10,
  });

  const createSurveyMutation = useMutation({
    mutationFn: (data) => createSurvey(data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
    },
  });

  const updateSurveyMutation = useMutation({
    mutationFn: ({ surveyId: id, data }) => updateSurvey(id, data),
    retry: false,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["surveys", variables.surveyId],
        exact: true,
      });
    },
  });

  const [title, setTitle] = useState("Post-purchase experience");
  const [description, setDescription] = useState(
    "We'd love to hear your thoughts on your recent order and delivery experience. Takes less than 1 minute."
  );
  const [questions, setQuestions] = useState(DEFAULT_BUILDER_QUESTIONS);
  const [hasValidationError, setHasValidationError] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

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

  // Populate from existing survey data if loaded
  useEffect(() => {
    if (getSurveyByIdQuery.data?.data) {
      const survey = getSurveyByIdQuery.data.data;
      setTitle(survey.title || "");
      setDescription(survey.description || "");
      if (survey.questions && survey.questions.length > 0) {
        setQuestions(survey.questions);
      }
    }
  }, [getSurveyByIdQuery.data]);

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const next = [...questions];
    next[index] = updatedQuestion;
    setQuestions(next);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const next = [...questions];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setQuestions(next);
  };

  const handleMoveDown = (index) => {
    if (index === questions.length - 1) return;
    const next = [...questions];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setQuestions(next);
  };

  const handleDuplicate = (index) => {
    const target = questions[index];
    const duplicate = {
      ...target,
      _id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      question: `${target.question} (Copy)`,
    };
    const next = [...questions];
    next.splice(index + 1, 0, duplicate);
    setQuestions(next);
    showToast("Question duplicated.");
  };

  const handleDelete = (index) => {
    if (questions.length <= 1) {
      showToast("Survey must contain at least 1 question", "error");
      return;
    }
    const next = questions.filter((_, i) => i !== index);
    setQuestions(next);
    showToast("Question removed.");
  };

  const handleAddQuestion = (type = "csat") => {
    const newQ = {
      _id: `q_${Date.now()}`,
      type,
      question:
        type === "nps"
          ? "How likely are you to recommend us to a friend?"
          : type === "csat"
          ? "How satisfied are you with our service?"
          : type === "rating"
          ? "How would you rate your overall experience?"
          : type === "ces"
          ? "The company made it easy for me to handle my issue."
          : type === "multiple-choice"
          ? "Which aspect did you like the most?"
          : type === "yes-no"
          ? "Did we solve your problem today?"
          : "Please share any additional comments:",
      required: true,
      options:
        type === "multiple-choice"
          ? ["Option 1", "Option 2", "Option 3"]
          : type === "yes-no"
          ? ["Yes", "No"]
          : undefined,
    };
    setQuestions((prev) => [...prev, newQ]);
    showToast(`Added new ${type.toUpperCase()} question.`);
  };

  const isSaving = createSurveyMutation.isPending || updateSurveyMutation.isPending;
  const isPublished = getSurveyByIdQuery.data?.data?.status === "published";

  // Single cleanly guarded save draft / save changes handler
  const handleSaveDraft = async () => {
    if (isSaving) return;

    if (!title.trim()) {
      setHasValidationError(true);
      showToast("Survey title is required", "error");
      return;
    }
    setHasValidationError(false);

    try {
      const payload = {
        title,
        description,
        questions: questions.map((q) => ({
          type: q.type,
          question: q.question,
          required: Boolean(q.required),
          options: q.options || [],
        })),
        // Once published, saving updates the published survey without downgrading it to draft
        status: isPublished ? "published" : "draft",
      };

      if (surveyIdParam && !surveyIdParam.startsWith("srv_sample_")) {
        await updateSurveyMutation.mutateAsync({ surveyId: surveyIdParam, data: payload });
      } else {
        const createRes = await createSurveyMutation.mutateAsync(payload);
        const newId = createRes?.data?._id;
        if (newId) {
          navigate(`/surveys/create?surveyId=${newId}`, { replace: true });
        }
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSavedAt(timeStr);
      showToast(isPublished ? `Changes saved at ${timeStr}` : `Draft saved successfully at ${timeStr}`);
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    }
  };

  // Single cleanly guarded publish handler
  const handlePublishConfirm = async () => {
    if (isSaving) return;

    if (!title.trim()) {
      setHasValidationError(true);
      showToast("Survey title is required", "error");
      setIsPublishModalOpen(false);
      return;
    }

    try {
      const payload = {
        title,
        description,
        questions: questions.map((q) => ({
          type: q.type,
          question: q.question,
          required: Boolean(q.required),
          options: q.options || [],
        })),
        status: "published",
      };

      let activeId = surveyIdParam;

      if (!activeId || activeId.startsWith("srv_sample_")) {
        const createRes = await createSurveyMutation.mutateAsync(payload);
        activeId = createRes?.data?._id;
      } else {
        await updateSurveyMutation.mutateAsync({ surveyId: activeId, data: payload });
      }

      setIsPublishModalOpen(false);
      showToast("Survey published successfully! Navigating to distribution hub...");
      setTimeout(() => {
        navigate(`/surveys/publish?surveyId=${activeId || ""}`);
      }, 500);
    } catch (err) {
      showToast(err.message || "Failed to publish survey", "error");
    }
  };

  const openPublishModal = () => {
    if (!title.trim()) {
      setHasValidationError(true);
      showToast("Survey title is required", "error");
      return;
    }
    setIsPublishModalOpen(true);
  };

  const closePublishModal = () => {
    setIsPublishModalOpen(false);
  };

  return {
    surveyIdParam,
    title,
    setTitle,
    description,
    setDescription,
    questions,
    hasValidationError,
    lastSavedAt,
    isSaving,
    isPublished,
    isPublishing: isSaving,
    isPublishModalOpen,
    openPublishModal,
    closePublishModal,
    handleSaveDraft,
    handlePublishConfirm,
    handleUpdateQuestion,
    handleMoveUp,
    handleMoveDown,
    handleDuplicate,
    handleDelete,
    handleAddQuestion,
    toast,
    showToast,
    hideToast,
    isLoadingExisting: getSurveyByIdQuery.isLoading,
  };
};

// -------------------------------------------------------------
// 3. Hook for Publish / Distribution Page (/surveys/publish)
// -------------------------------------------------------------
export const usePublishSurveyHub = () => {
  const [searchParams] = useSearchParams();
  const surveyIdParam = searchParams.get("surveyId");

  const queryClient = useQueryClient();

  const getSurveyByIdQuery = useQuery({
    queryKey: ["surveys", surveyIdParam],
    queryFn: () => getSurveyById(surveyIdParam),
    enabled: Boolean(surveyIdParam && !surveyIdParam.startsWith("srv_sample_")),
    staleTime: 1000 * 60 * 10,
  });

  const publishSurveyMutation = useMutation({
    mutationFn: (id) => publishSurvey(id),
    retry: false,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["surveys", id], exact: true });
    },
  });

  const [activeTab, setActiveTab] = useState("link");
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

  const survey = useMemo(() => {
    if (getSurveyByIdQuery.data?.data) {
      return getSurveyByIdQuery.data.data;
    }
    return {
      _id: surveyIdParam || "srv_acme_post_purchase",
      title: "Post-purchase experience",
      slug: "post-purchase",
      status: "published",
      responseCount: 1428,
    };
  }, [getSurveyByIdQuery.data, surveyIdParam]);

  const organization = useSelector((state) => state.auth?.organization);
  const orgSlug = organization?.slug || "org";

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/f/${orgSlug}/${survey.slug || survey._id}`;

  const handlePublishNow = async () => {
    try {
      if (survey._id && !survey._id.startsWith("srv_sample_")) {
        await publishSurveyMutation.mutateAsync(survey._id);
      }
      showToast("Status updated: Survey Published");
    } catch (err) {
      showToast(err.message || "Failed to publish", "error");
    }
  };

  return {
    surveyIdParam,
    survey,
    publicUrl,
    activeTab,
    setActiveTab,
    isLoading: getSurveyByIdQuery.isLoading,
    isError: getSurveyByIdQuery.isError,
    refetch: getSurveyByIdQuery.refetch,
    isPublishing: publishSurveyMutation.isPending,
    handlePublishNow,
    toast,
    showToast,
    hideToast,
  };
};

export default useSurveysApi;

