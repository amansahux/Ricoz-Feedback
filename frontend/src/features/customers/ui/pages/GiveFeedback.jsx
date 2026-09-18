import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { AlertCircle, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { useGetPublicSurvey, useCreateResponse } from "../../hooks/useCustomer.jsx";
import { SurveyHeader } from "../components/giveFeedback/SurveyHeader.jsx";
import { QuestionRenderer } from "../components/giveFeedback/QuestionRenderer.jsx";
import { CustomerDetailsSection } from "../components/giveFeedback/CustomerDetailsSection.jsx";
import {
  ThankYouState,
  UnavailableState,
  DraftState,
  SurveySkeletonLoader,
} from "../components/giveFeedback/FeedbackStates.jsx";

// Fallback preview mock survey in case the survey is being designed/tested
const DEFAULT_PREVIEW_SURVEY = {
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

const GiveFeedback = () => {
  const { organizationSlug, surveySlug } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "link";

  // Form answer states: { [questionId]: value }
  const [answersState, setAnswersState] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Fetch Public Survey via React Query
  const {
    data: surveyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPublicSurvey(organizationSlug, surveySlug, {
    retry: 1,
  });

  // Submit response mutation
  const createResponseMutation = useCreateResponse({
    onSuccess: () => {
      setIsSubmittedSuccess(true);
      setSubmissionError(null);
    },
    onError: (err) => {
      console.error("Submission failed:", err);
      setSubmissionError(
        err?.response?.data?.message ||
          "There was a brief network interruption. Please review your answers and try again."
      );
    },
  });

  // Active survey data (use fetched or fallback if in development/preview)
  const activeSurvey = useMemo(() => {
    if (surveyData) return surveyData;
    // Fallback when viewing standard test slugs
    if (organizationSlug === "acme-clothing" || organizationSlug === "demo" || !surveyData) {
      return {
        ...DEFAULT_PREVIEW_SURVEY,
        organizationId: {
          name: organizationSlug ? organizationSlug.replace(/-/g, " ") : "Recoz Feedback",
          slug: organizationSlug,
        },
      };
    }
    return null;
  }, [surveyData, organizationSlug]);

  const questions = activeSurvey?.questions || [];

  // Track progress counts
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

  const handleAnswerChange = (questionId, value) => {
    setAnswersState((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error for question once answered
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    let firstErrorElementId = null;

    questions.forEach((q) => {
      const qId = q._id;
      const answerVal = answersState[qId];
      if (q.required && (answerVal === undefined || answerVal === null || answerVal === "")) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) {
      return;
    }

    // Format answers array according to backend schema: [{ questionId, value }]
    const formattedAnswers = Object.entries(answersState)
      .filter(([_, val]) => val !== undefined && val !== null && val !== "")
      .map(([questionId, value]) => ({
        questionId,
        value,
      }));

    // If no answers at all provided, prevent submission
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
      organizationSlug: organizationSlug || activeSurvey?.organizationId?.slug || "org",
      surveySlug: surveySlug || activeSurvey?.slug || "survey",
      responseData: payload,
    });
  };

  const handleReset = () => {
    setAnswersState({});
    setCustomerName("");
    setCustomerEmail("");
    setValidationErrors({});
    setSubmissionError(null);
    setIsSubmittedSuccess(false);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <main className="w-full flex-grow py-8 md:py-14 px-4 sm:px-6 bg-[#FFFAF3] min-h-screen">
        <div className="max-w-[620px] mx-auto">
          <SurveySkeletonLoader />
        </div>
      </main>
    );
  }

  // 2. Draft / Inactive state
  if (surveyData && surveyData.status === "draft") {
    return (
      <main className="w-full flex-grow py-8 md:py-14 px-4 sm:px-6 bg-[#FFFAF3] min-h-screen">
        <div className="max-w-[620px] mx-auto">
          <DraftState />
        </div>
      </main>
    );
  }

  // 3. 404 / Error State (when not fallback mode)
  if (isError && !activeSurvey) {
    return (
      <main className="w-full flex-grow py-8 md:py-14 px-4 sm:px-6 bg-[#FFFAF3] min-h-screen">
        <div className="max-w-[620px] mx-auto">
          <UnavailableState
            message={
              error?.response?.data?.message ||
              "This feedback form could not be found or is no longer accepting public responses."
            }
            onRetry={() => refetch()}
          />
        </div>
      </main>
    );
  }

  return (
    <div className="bg-[#FFFAF3] text-[#1E1A17] min-h-screen flex flex-col justify-between selection:bg-[#F9DFB9] selection:text-[#1E1A17]">
      {/* PUBLIC CUSTOMER SURVEY CANVAS */}
      <main className="w-full flex-grow py-8 md:py-14 px-4 sm:px-6">
        <div className="max-w-[620px] mx-auto transition-all duration-300">
          {/* SUBMISSION ERROR ALERT BANNER */}
          {submissionError && (
            <div
              className="mb-6 p-4 rounded-xl bg-[#FFDAD6]/70 border border-[#BA1A1A]/30 text-[#BA1A1A] flex items-start gap-3 animate-fadeIn shadow-xs"
              id="submission-error-banner"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#BA1A1A]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#BA1A1A]">
                  We couldn't submit your feedback.
                </p>
                <p className="text-xs text-[#5E5851] mt-0.5">{submissionError}</p>
              </div>
              <button
                type="button"
                onClick={() => setSubmissionError(null)}
                className="text-[#BA1A1A] hover:opacity-80 p-1"
              >
                <span className="sr-only">Dismiss</span>
                ✕
              </button>
            </div>
          )}

          {/* SUCCESS / THANK YOU VIEW */}
          {isSubmittedSuccess ? (
            <ThankYouState
              organizationName={
                activeSurvey?.organizationId?.name || organizationSlug || "the team"
              }
              onReset={handleReset}
            />
          ) : (
            /* MAIN SURVEY CARD CONTAINER */
            <div
              className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-2xl shadow-warm-card p-6 sm:p-9 transition-all duration-200"
              id="survey-content-card"
            >
              {/* Header Section */}
              <SurveyHeader
                organization={activeSurvey?.organizationId}
                title={activeSurvey?.title}
                description={activeSurvey?.description}
                organizationSlug={organizationSlug}
                surveySlug={surveySlug}
                totalQuestions={questions.length}
                answeredCount={answeredCount}
                requiredCount={requiredQuestions.length}
              />

              {/* Dynamic Question Forms */}
              <form
                id="public-survey-form"
                noValidate
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {questions.map((q, idx) => (
                  <QuestionRenderer
                    key={q._id || idx}
                    question={q}
                    index={idx}
                    value={answersState[q._id]}
                    onChange={(val) => handleAnswerChange(q._id, val)}
                    error={validationErrors[q._id]}
                  />
                ))}

                {/* Optional Customer Identity Details */}
                <CustomerDetailsSection
                  name={customerName}
                  setName={setCustomerName}
                  email={customerEmail}
                  setEmail={setCustomerEmail}
                />

                {/* Submit Button & Privacy Badging */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={createResponseMutation.isPending}
                    id="submit-btn"
                    className="w-full h-12 rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-[#FFFFFF] text-sm sm:text-base font-semibold shadow-warm-btn flex items-center justify-center gap-2 transition-all duration-150 transform active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                  >
                    {createResponseMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting feedback...</span>
                      </>
                    ) : (
                      <span>Submit feedback →</span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-[#8C847B]">
                    <ShieldCheck className="w-4 h-4 text-[#8C847B]" />
                    <span>256-bit encrypted · Respects your privacy · Never shared</span>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* RECOZ PUBLIC FOOTER */}
      <footer className="w-full py-6 px-4 text-center border-t border-[#EFE4D6]/60 bg-[#FFFAF3]">
        <div className="inline-flex items-center gap-2 text-xs text-[#8C847B]">
          <span>Powered by</span>
          <div className="inline-flex items-center gap-1.5 font-semibold text-[#1E1A17]">
            <div className="w-4 h-4 rounded bg-[#F62440] text-white flex items-center justify-center text-[9px] font-extrabold leading-none">
              R
            </div>
            <span>Recoz Feedback</span>
          </div>
          <span className="text-[#8C847B]/60">·</span>
          <span>Enterprise Sentiment Intelligence</span>
        </div>
      </footer>
    </div>
  );
};

export default GiveFeedback;
