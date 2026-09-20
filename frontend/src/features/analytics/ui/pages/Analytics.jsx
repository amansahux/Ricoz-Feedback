import React from "react";
import { useAnalytics } from "../../hooks/useAnalytics.jsx";
import AnalyticsHeader from "../components/AnalyticsHeader.jsx";
import AnalyticsMetricsGrid from "../components/AnalyticsMetricsGrid.jsx";
import AnalyticsResponseChart from "../components/AnalyticsResponseChart.jsx";
import AnalyticsBreakdownGrid from "../components/AnalyticsBreakdownGrid.jsx";
import AnalyticsSentimentDistribution from "../components/AnalyticsSentimentDistribution.jsx";
import AnalyticsSkeleton from "../components/AnalyticsSkeleton.jsx";
import AnalyticsEmptyState from "../components/AnalyticsEmptyState.jsx";
import AnalyticsErrorState from "../components/AnalyticsErrorState.jsx";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Analytics() {
  const {
    range,
    setRange,
    summary,
    responseVolume,
    npsBreakdown,
    topTopics,
    sentiment,
    hasNoData,
    isLoading,
    isError,
    error,
    refetch,
    isExporting,
    handleExportReport,
    toast,
    hideToast,
  } = useAnalytics();

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 font-inter">
      {/* Toast Notification */}
      {toast?.visible && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "error"
              ? "bg-rose-50 text-[#bb0028] border-rose-200"
              : "bg-[#1C7332] text-white border-emerald-600"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={hideToast}
            className="ml-2 hover:opacity-75 p-0.5 rounded cursor-pointer"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Page Header & Range Controls */}
      <AnalyticsHeader
        range={range}
        onRangeChange={setRange}
        onExportReport={handleExportReport}
        isExporting={isExporting}
      />

      {/* 2. State-Based View Rendering */}
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : isError ? (
        <AnalyticsErrorState error={error} onRetry={() => refetch()} />
      ) : hasNoData ? (
        <AnalyticsEmptyState onExpandRange={(r) => setRange(r)} />
      ) : (
        <div className="flex flex-col gap-6">
          {/* KPI 4-Card Summary Metrics */}
          <AnalyticsMetricsGrid summary={summary} />

          {/* Response Volume Area & Line Chart */}
          <AnalyticsResponseChart responseVolume={responseVolume} />

          {/* 2-Column Grid: NPS Breakdown & Top Discussion Topics */}
          <AnalyticsBreakdownGrid
            npsSummary={summary.nps}
            npsBreakdown={npsBreakdown}
            topTopics={topTopics}
          />

          {/* Full-width Sentiment Distribution */}
          <AnalyticsSentimentDistribution sentiment={sentiment} />
        </div>
      )}
    </div>
  );
}
