import { useSurveyList } from "../../hooks/useSurvay.jsx";
import SurveyHeader from "../components/Survey/SurveyHeader.jsx";
import SurveyToolbar from "../components/Survey/SurveyToolbar.jsx";
import SurveyTable from "../components/Survey/SurveyTable.jsx";
import SurveySkeleton from "../components/Survey/SurveySkeleton.jsx";
import SurveyEmptyState from "../components/Survey/SurveyEmptyState.jsx";
import SurveyErrorState from "../components/Survey/SurveyErrorState.jsx";
import ShareSurveyModal from "../components/Survey/ShareSurveyModal.jsx";
import DeleteSurveyModal from "../components/Survey/DeleteSurveyModal.jsx";
import ToastNotification from "../components/shared/ToastNotification.jsx";

export default function Survey() {
  const {
    surveys,
    rawSurveys,
    filterCounts,
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
    deleteModalSurvey,
    setDeleteModalSurvey,
    handleDeleteConfirm,
    isDeleting,
    toast,
    showToast,
    hideToast,
  } = useSurveyList();

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-2">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Header Block with quick metrics */}
      <SurveyHeader
        totalSurveys={filterCounts.published}
        totalResponses={rawSurveys.reduce((acc, curr) => acc + (curr.responseCount || 0), 0)}
        avgCsat="94.2%"
      />

      {/* Filter and Search Toolbar */}
      <SurveyToolbar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filterCounts={filterCounts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* MAIN STATE RENDERING */}
      {isLoading ? (
        <SurveySkeleton />
      ) : isError ? (
        <SurveyErrorState error={error} onRetry={() => refetch()} />
      ) : surveys.length === 0 ? (
        <SurveyEmptyState
          onSelectTemplate={() => {
            showToast("Template chosen: Executive NPS");
          }}
        />
      ) : (
        <SurveyTable
          surveys={surveys}
          onShare={(survey) => setShareModalSurvey(survey)}
          onDelete={(survey) => setDeleteModalSurvey(survey)}
        />
      )}

      {/* Modals */}
      <ShareSurveyModal
        survey={shareModalSurvey}
        isOpen={Boolean(shareModalSurvey)}
        onClose={() => setShareModalSurvey(null)}
        onCopySuccess={(msg) => showToast(msg)}
      />

      <DeleteSurveyModal
        survey={deleteModalSurvey}
        isOpen={Boolean(deleteModalSurvey)}
        onClose={() => setDeleteModalSurvey(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
