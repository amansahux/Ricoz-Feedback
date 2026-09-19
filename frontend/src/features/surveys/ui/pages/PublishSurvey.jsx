import { usePublishSurveyHub } from "../../hooks/useSurvay.jsx";
import ShareHeader from "../components/PublishSurvey/ShareHeader.jsx";
import ShareTabs from "../components/PublishSurvey/ShareTabs.jsx";
import TabLinkContent from "../components/PublishSurvey/TabLinkContent.jsx";
import TabQrContent from "../components/PublishSurvey/TabQrContent.jsx";
import TabWidgetContent from "../components/PublishSurvey/TabWidgetContent.jsx";
import ShareSkeleton from "../components/PublishSurvey/ShareSkeleton.jsx";
import ShareDraftState from "../components/PublishSurvey/ShareDraftState.jsx";
import ShareErrorState from "../components/PublishSurvey/ShareErrorState.jsx";
import ToastNotification from "../components/shared/ToastNotification.jsx";

export default function PublishSurvey() {
  const {
    survey,
    publicUrl,
    activeTab,
    setActiveTab,
    isLoading,
    isError,
    refetch,
    handlePublishNow,
    toast,
    showToast,
    hideToast,
  } = usePublishSurveyHub();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-4">
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Header with Title & Live Telemetry Stat */}
      <ShareHeader
        surveyTitle={survey.title}
        isPublished={survey.status === "published"}
        responseCount={survey.responseCount || 1428}
        completionRate="89.4%"
      />

      {/* 3-Tab Interactive Navigation Bar */}
      <ShareTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Content / State Switching */}
      {isLoading && !survey ? (
        <ShareSkeleton />
      ) : isError ? (
        <ShareErrorState onRetry={() => refetch()} />
      ) : survey.status === "draft" ? (
        <ShareDraftState
          surveyId={survey._id}
          onPublishNow={handlePublishNow}
        />
      ) : (
        <div>
          {activeTab === "link" && (
            <TabLinkContent
              url={publicUrl}
              onCopySuccess={(msg) => showToast(msg)}
            />
          )}

          {activeTab === "qr" && (
            <TabQrContent
              url={publicUrl}
              survey={survey}
              onCopySuccess={(msg) => showToast(msg)}
            />
          )}

          {activeTab === "widget" && (
            <TabWidgetContent
              surveyId={survey._id}
              onCopySuccess={(msg) => showToast(msg)}
            />
          )}
        </div>
      )}
    </div>
  );
}
