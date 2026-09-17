import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import useSurveys from "../../hooks/useSurvay.jsx";
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
  const [searchParams] = useSearchParams();
  const surveyIdParam = searchParams.get("surveyId");

  const { useGetSurveyById, usePublishSurvey } = useSurveys();
  const { data: apiResponse, isLoading, isError, refetch } = useGetSurveyById(surveyIdParam);
  const publishMutation = usePublishSurvey();

  // Active tab state: 'link' | 'qr' | 'widget'
  const [activeTab, setActiveTab] = useState("link");



  // Toast feedback
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3500);
  };

  const survey = useMemo(() => {
    if (apiResponse?.data) {
      return apiResponse.data;
    }
    return {
      _id: surveyIdParam || "srv_acme_post_purchase",
      title: "Post-purchase experience",
      slug: "post-purchase",
      status: "published",
      responseCount: 1428,
    };
  }, [apiResponse, surveyIdParam]);

  const publicUrl = `${window.location.origin}/f/${survey.slug || survey._id}`;

  const handlePublishNow = async () => {
    try {
      if (survey._id && !survey._id.startsWith("srv_sample_")) {
        await publishMutation.mutateAsync(survey._id);
      }

      showToast("Status updated: Survey Published");
    } catch (err) {
      showToast(err.message || "Failed to publish", "error");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-4">
      <ToastNotification toast={toast} onClose={() => setToast({ visible: false, message: "" })} />

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
            <TabQrContent onCopySuccess={(msg) => showToast(msg)} />
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
