import React from "react";
import { useFeedback } from "../../hooks/useFeedback.jsx";
import FeedbackHeader from "../components/FeedbackInbox/FeedbackHeader.jsx";
import FeedbackToolbar from "../components/FeedbackInbox/FeedbackToolbar.jsx";
import FeedbackTable from "../components/FeedbackInbox/FeedbackTable.jsx";
import FeedbackSkeleton from "../components/FeedbackInbox/FeedbackSkeleton.jsx";
import FeedbackEmptyState from "../components/FeedbackInbox/FeedbackEmptyState.jsx";
import FeedbackErrorState from "../components/FeedbackInbox/FeedbackErrorState.jsx";
import FeedbackNoResults from "../components/FeedbackInbox/FeedbackNoResults.jsx";
import FeedbackPagination from "../components/FeedbackInbox/FeedbackPagination.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";

export default function Feedback() {
  const {
    // Data
    responses,
    totalCount,
    rawResponsesCount,
    metrics,

    // Status flags
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    hasActiveFilters,
    isNoResults,
    isEmpty,

    // Filter controls
    selectedStatus,
    setSelectedStatus,
    selectedSentiment,
    setSelectedSentiment,
    selectedSource,
    setSelectedSource,
    selectedRating,
    setSelectedRating,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Actions
    handleMarkResolved,
    handleExportReport,
    isUpdating,

    // Toast
    toast,
    showToast,
    hideToast,
  } = useFeedback();

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-2">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Header Block */}
      <FeedbackHeader
        totalResponses={rawResponsesCount}
        needAttentionCount={metrics.needAttention}
        onExportReport={handleExportReport}
      />

      {/* Filter and Search Toolbar */}
      <FeedbackToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedSentiment={selectedSentiment}
        setSelectedSentiment={setSelectedSentiment}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        hasActiveFilters={hasActiveFilters}
        resetFilters={resetFilters}
      />

      {/* Fetching indicator overlay */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] text-xs font-inter text-[#7d7461]">
          <span className="w-2 h-2 rounded-full bg-[#bb0028] animate-pulse"></span>
          Refreshing data…
        </div>
      )}

      {/* MAIN STATE RENDERING */}
      {isLoading ? (
        <FeedbackSkeleton />
      ) : isError ? (
        <FeedbackErrorState error={error} onRetry={() => refetch()} />
      ) : isEmpty ? (
        <FeedbackEmptyState />
      ) : isNoResults ? (
        <FeedbackNoResults
          searchQuery={searchQuery}
          onResetFilters={resetFilters}
        />
      ) : (
        <>
          {/* Results count strip */}
          <div className="flex items-center justify-between px-1 text-xs font-inter text-[#7d7461]">
            <span>
              Showing{" "}
              <span className="font-semibold text-[#1f1b18]">
                {responses.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#1f1b18]">
                {totalCount}
              </span>{" "}
              results
            </span>
            {isUpdating && (
              <span className="flex items-center gap-1.5 text-[#bb0028] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bb0028] animate-pulse"></span>
                Updating…
              </span>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#EFE4D6] shadow-xs overflow-hidden">
            <FeedbackTable
              responses={responses}
              onMarkResolved={handleMarkResolved}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <FeedbackPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
