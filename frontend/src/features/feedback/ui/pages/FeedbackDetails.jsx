import React from "react";
import { useParams } from "react-router";
import { useFeedbackDetail } from "../../hooks/useFeedback.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";

// Modularized Components
import DetailBreadcrumb from "../components/FeedbackDetails/DetailBreadcrumb.jsx";
import DetailResolvedBanner from "../components/FeedbackDetails/DetailResolvedBanner.jsx";
import DetailIdentityHeader from "../components/FeedbackDetails/DetailIdentityHeader.jsx";
import DetailMetricsGrid from "../components/FeedbackDetails/DetailMetricsGrid.jsx";
import DetailAnswersCard from "../components/FeedbackDetails/DetailAnswersCard.jsx";
import DetailCloseTheLoop from "../components/FeedbackDetails/DetailCloseTheLoop.jsx";
import {
  DetailSkeleton,
  DetailError,
  DetailNotFound,
} from "../components/FeedbackDetails/DetailStates.jsx";

export default function FeedbackDetails() {
  const { feedbackId } = useParams();
  const {
    response,
    isLoading,
    isError,
    error,
    refetch,
    isNotFound,

    // Close the loop state & actions
    currentStatus,
    internalNote,
    setInternalNote,
    isNoteSaved,
    isUpdating,
    handleStatusChange,
    handleSaveNote,
    handleToggleResolution,
    handleExportJson,

    // Toast
    toast,
    hideToast,
  } = useFeedbackDetail(feedbackId);

  // Derived data
  const customerName = response?.customerId?.name || "Anonymous Respondent";
  const customerEmail = response?.customerId?.email || "—";
  const surveyTitle = response?.surveyId?.title || "Survey";
  const sentiment = response?.sentiment || "neutral";
  const source = response?.source || "link";
  const topics = response?.topics?.length
    ? response.topics
    : ["General Feedback"];
  const answers = response?.answers || [];

  return (
    <div className="w-full flex flex-col min-w-0">
      {/* Toast */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Top Contextual Action Bar */}
      <DetailBreadcrumb
        feedbackId={feedbackId}
        onExportJson={handleExportJson}
      />

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto px-6 md:px-10 py-8 flex flex-col gap-8">
        {isLoading ? (
          <DetailSkeleton />
        ) : isError ? (
          <DetailError error={error} onRetry={refetch} />
        ) : isNotFound ? (
          <DetailNotFound feedbackId={feedbackId} />
        ) : (
          <>
            {/* Resolved Banner */}
            {currentStatus === "resolved" && (
              <DetailResolvedBanner
                response={response}
                internalNote={internalNote}
                onReopen={() => handleStatusChange("open")}
              />
            )}

            {/* 1. Header & Identity */}
            <DetailIdentityHeader
              customerName={customerName}
              customerEmail={customerEmail}
              createdAt={response?.createdAt}
              source={source}
              currentStatus={currentStatus}
              sentiment={sentiment}
            />

            {/* 2. Metric Cards */}
            <DetailMetricsGrid
              npsScore={response?.npsScore}
              csatScore={response?.csatScore}
              cesScore={response?.cesScore}
            />

            {/* 3. Customer Answers */}
            <DetailAnswersCard
              answers={answers}
              surveyTitle={surveyTitle}
              topics={topics}
              sentiment={sentiment}
            />

            {/* 4. Close the Loop */}
            <DetailCloseTheLoop
              feedbackId={feedbackId}
              currentStatus={currentStatus}
              internalNote={internalNote}
              setInternalNote={setInternalNote}
              isNoteSaved={isNoteSaved}
              isUpdating={isUpdating}
              handleStatusChange={handleStatusChange}
              handleSaveNote={handleSaveNote}
              handleToggleResolution={handleToggleResolution}
              createdAt={response?.createdAt}
            />
          </>
        )}
      </main>
    </div>
  );
}