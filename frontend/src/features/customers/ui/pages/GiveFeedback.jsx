import React from "react";
import { useParams, useSearchParams } from "react-router";
import { AlertCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useGiveFeedback } from "../../hooks/useCustomer.jsx";
import { SurveyHeader } from "../components/giveFeedback/SurveyHeader.jsx";
import { QuestionRenderer } from "../components/giveFeedback/QuestionRenderer.jsx";
import { CustomerDetailsSection } from "../components/giveFeedback/CustomerDetailsSection.jsx";
import {
  ThankYouState,
  UnavailableState,
  DraftState,
  SurveySkeletonLoader,
} from "../components/giveFeedback/FeedbackStates.jsx";

const GiveFeedback = () => {
  const { organizationSlug, surveySlug } = useParams();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "link";

  // All business logic, caching, anti-refetching, form validation, and submissions are managed via useGiveFeedback
  const {
    activeSurvey,
    questions,
    totalQuestions,
    answeredCount,
    requiredCount,
    answersState,
    customerName,
    setCustomerName,
    customerEmail,
    setEmail,
    validationErrors,
    submissionError,
    dismissSubmissionError,
    isSubmittedSuccess,
    isLoading,
    isDraft,
    isUnavailable,
    errorMessage,
    isSubmitting,
    handleAnswerChange,
    handleSubmit,
    handleReset,
    refetch,
  } = useGiveFeedback({ organizationSlug, surveySlug, source });

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
  if (isDraft) {
    return (
      <main className="w-full flex-grow py-8 md:py-14 px-4 sm:px-6 bg-[#FFFAF3] min-h-screen">
        <div className="max-w-[620px] mx-auto">
          <DraftState />
        </div>
      </main>
    );
  }

  // 3. 404 / Unavailable State
  if (isUnavailable) {
    return (
      <main className="w-full flex-grow py-8 md:py-14 px-4 sm:px-6 bg-[#FFFAF3] min-h-screen">
        <div className="max-w-[620px] mx-auto">
          <UnavailableState
            message={
              errorMessage ||
              "This feedback form could not be found or is no longer accepting public responses."
            }
            onRetry={refetch}
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
                <p className="text-xs text-[#5E5851] mt-0.5">
                  {submissionError}
                </p>
              </div>
              <button
                type="button"
                onClick={dismissSubmissionError}
                className="text-[#BA1A1A] hover:opacity-80 p-1 cursor-pointer"
              >
                <span className="sr-only">Dismiss</span>✕
              </button>
            </div>
          )}

          {/* SUCCESS / THANK YOU VIEW */}
          {isSubmittedSuccess ? (
            <ThankYouState
              organizationName={
                activeSurvey?.organizationId?.name ||
                organizationSlug ||
                "the team"
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
                totalQuestions={totalQuestions}
                answeredCount={answeredCount}
                requiredCount={requiredCount}
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
                    organization={activeSurvey?.organizationId}
                    question={q}
                    index={idx}
                    value={answersState[q._id]}
                    onChange={(val) => handleAnswerChange(q._id, val)}
                    error={validationErrors[q._id]}
                  />
                ))}

                {/* Optional Customer Identity Details */}
                <CustomerDetailsSection
                  organization={activeSurvey?.organizationId}
                  name={customerName}
                  setName={setCustomerName}
                  email={customerEmail}
                  setEmail={setEmail}
                />

                {/* Submit Button & Privacy Badging */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-btn"
                    className="w-full h-12 rounded-xl text-[#FFFFFF] text-sm sm:text-base font-semibold shadow-warm-btn flex items-center justify-center gap-2 transition-all duration-150 transform active:scale-[0.99] hover:brightness-90 active:brightness-75 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                    style={{ backgroundColor: activeSurvey?.organizationId?.primaryColor || '#F62440' }}
                  >
                    {isSubmitting ? (
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
                    <span>
                      256-bit encrypted · Respects your privacy · Never shared
                    </span>
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
