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
    pagination,
    totalCount,
    totalPages,
    currentPage,
    setCurrentPage,
    filterCounts,
    totalResponses,
    avgCsat,
    isLoading,
    isFetching,
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
    handleOpenShare,
    closeShareModal,
    deleteModalSurvey,
    setDeleteModalSurvey,
    handleDeleteConfirm,
    isDeleting,
    toast,
    showToast,
    hideToast,
  } = useSurveyList();

  // Format avg CSAT for display: scale 1-5 → percentage, or show "N/A"
  const formattedAvgCsat = avgCsat != null
    ? `${((avgCsat / 5) * 100).toFixed(1)}%`
    : "N/A";

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-2">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Header Block with quick metrics */}
      <SurveyHeader
        totalSurveys={filterCounts.published}
        totalResponses={totalResponses}
        avgCsat={formattedAvgCsat}
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

      {/* Fetching overlay indicator */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] text-xs font-inter text-[#7d7461]">
          <span className="w-2 h-2 rounded-full bg-[#bb0028] animate-pulse"></span>
          Refreshing surveys…
        </div>
      )}

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
          pagination={pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onShare={handleOpenShare}
          onDelete={(survey) => setDeleteModalSurvey(survey)}
        />
      )}

      {/* Modals */}
      <ShareSurveyModal
        survey={shareModalSurvey}
        isOpen={Boolean(shareModalSurvey)}
        onClose={closeShareModal}
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
