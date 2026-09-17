import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useSurveys from "../../hooks/useSurvay.jsx";
import BuilderHeader from "../components/CreateSurvey/BuilderHeader.jsx";
import SurveyDetailsForm from "../components/CreateSurvey/SurveyDetailsForm.jsx";
import QuestionCard from "../components/CreateSurvey/QuestionCard.jsx";
import QuestionTypeSelector from "../components/CreateSurvey/QuestionTypeSelector.jsx";
import LivePreviewPhone from "../components/CreateSurvey/LivePreviewPhone.jsx";
import PublishSurveyModal from "../components/CreateSurvey/PublishSurveyModal.jsx";
import ToastNotification from "../components/shared/ToastNotification.jsx";

const DEFAULT_QUESTIONS = [
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

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surveyIdParam = searchParams.get("surveyId");

  const { useGetSurveyById, useCreateSurvey, useUpdateSurvey, usePublishSurvey } = useSurveys();

  // If editing an existing survey
  const { data: existingSurveyData, isLoading: isLoadingSurvey } = useGetSurveyById(surveyIdParam);
  const createMutation = useCreateSurvey();
  const updateMutation = useUpdateSurvey();
  const publishMutation = usePublishSurvey();

  // Form states
  const [title, setTitle] = useState("Post-purchase experience");
  const [description, setDescription] = useState(
    "We'd love to hear your thoughts on your recent order and delivery experience. Takes less than 1 minute."
  );
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [hasValidationError, setHasValidationError] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3500);
  };

  // Populate from existing survey if editing
  useEffect(() => {
    if (existingSurveyData?.data) {
      const survey = existingSurveyData.data;
      setTitle(survey.title || "");
      setDescription(survey.description || "");
      if (survey.questions && survey.questions.length > 0) {
        setQuestions(survey.questions);
      }
    }
  }, [existingSurveyData]);

  // Handle Question Reordering & Management
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

  // Save Draft logic
  const handleSaveDraft = async () => {
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
        status: "draft",
      };

      if (surveyIdParam && !surveyIdParam.startsWith("srv_sample_")) {
        await updateMutation.mutateAsync({ surveyId: surveyIdParam, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLastSavedAt(timeStr);
      showToast(`Draft saved successfully at ${timeStr}`);
    } catch (err) {
      showToast(err.message || "Failed to save draft", "error");
    }
  };

  // Publish flow
  const handlePublishConfirm = async () => {
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
        const createRes = await createMutation.mutateAsync(payload);
        activeId = createRes?.data?._id;
      } else {
        await updateMutation.mutateAsync({ surveyId: activeId, data: payload });
        await publishMutation.mutateAsync(activeId);
      }

      setIsPublishModalOpen(false);
      showToast("Survey published successfully! Navigating to distribution hub...");
      setTimeout(() => {
        navigate(`/surveys/publish?surveyId=${activeId || ""}`);
      }, 800);
    } catch (err) {
      showToast(err.message || "Failed to publish survey", "error");
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FFFAF3]">
      <ToastNotification toast={toast} onClose={() => setToast({ visible: false, message: "" })} />

      {/* Sticky Top Global Builder Header */}
      <BuilderHeader
        onSaveDraft={handleSaveDraft}
        onPublish={() => {
          if (!title.trim()) {
            setHasValidationError(true);
            showToast("Survey title is required", "error");
            return;
          }
          setIsPublishModalOpen(true);
        }}
        isSaving={createMutation.isPending || updateMutation.isPending}
        isPublishing={publishMutation.isPending}
        lastSavedAt={lastSavedAt}
      />

      {/* Main Dual-Column Builder Container */}
      <div className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start pb-16 px-1">
        {/* LEFT COLUMN: EDITOR & QUESTIONS */}
        <div className="min-w-0 flex flex-col gap-6">
          {/* Section Intro Banner */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE4D6] shadow-2xs">
            <p className="text-xs sm:text-sm text-[#7d7461] font-inter leading-relaxed">
              Create a feedback experience your customers will actually want to complete. Design
              questions, reorder logic, and verify customer perception in real-time.
            </p>
          </div>

          {/* 1. Survey Details Card */}
          <SurveyDetailsForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            hasError={hasValidationError}
          />

          {/* 2. Questions List */}
          <div className="flex flex-col gap-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q._id || `card_${idx}`}
                question={q}
                index={idx}
                totalQuestions={questions.length}
                onUpdate={(upd) => handleUpdateQuestion(idx, upd)}
                onMoveUp={() => handleMoveUp(idx)}
                onMoveDown={() => handleMoveDown(idx)}
                onDuplicate={() => handleDuplicate(idx)}
                onDelete={() => handleDelete(idx)}
              />
            ))}
          </div>

          {/* 3. Add Question Type Selector */}
          <QuestionTypeSelector onAddQuestion={handleAddQuestion} />
        </div>

        {/* RIGHT COLUMN: STICKY PHONE PREVIEW */}
        <div className="min-w-0 hidden lg:block">
          <LivePreviewPhone
            title={title}
            description={description}
            questions={questions}
          />
        </div>
      </div>

      {/* Launch Confirmation Modal */}
      <PublishSurveyModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        surveyTitle={title}
        questionCount={questions.length}
        isPublishing={publishMutation.isPending}
      />
    </div>
  );
}
