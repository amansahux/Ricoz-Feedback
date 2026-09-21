import React from "react";
import { useDashboard } from "../../hooks/useDashboard.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardMetricsGrid from "../components/DashboardMetricsGrid.jsx";
import DashboardVolumeChart from "../components/DashboardVolumeChart.jsx";
import DashboardSentimentDonut from "../components/DashboardSentimentDonut.jsx";
import DashboardTopicsCard from "../components/DashboardTopicsCard.jsx";
import DashboardRecentFeedback from "../components/DashboardRecentFeedback.jsx";
import DashboardZeroState from "../components/DashboardZeroState.jsx";
import DashboardSkeleton from "../components/DashboardSkeleton.jsx";
import DashboardErrorState from "../components/DashboardErrorState.jsx";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Dashboard() {
  const {
    user,
    organization,
    range,
    setRange,
    chartView,
    setChartView,
    sentimentFilter,
    setSentimentFilter,
    summary,
    responseVolume,
    sentimentMix,
    topTopics,
    latestFeedback,
    rawResponses,
    hasNoData,
    isLoading,
    isError,
    refetch,
    handleExportReport,
    handleTriggerAction,
    toast,
    hideToast,
  } = useDashboard();

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 font-inter pb-12">
      {/* Toast Notification Banner */}
      {toast?.visible && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "error"
              ? "bg-rose-50 text-[#bb0028] border-rose-200"
              : "bg-[#1f1b18] text-white border-white/10"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} className="text-[#bb0028] shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-[#F9DFB9] shrink-0" />
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

      {/* 1. Header Section */}
      <DashboardHeader
        userName={user?.name || "Aman"}
        range={range}
        onRangeChange={setRange}
        onExportReport={handleExportReport}
      />

      {/* State-Based Rendering Canvas */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <DashboardErrorState
          onRetry={refetch}
          onTriggerAction={handleTriggerAction}
        />
      ) : hasNoData ? (
        <DashboardZeroState
          onTriggerAction={handleTriggerAction}
          onSwitchLoaded={() => {}}
        />
      ) : (
        /* Loaded View: Executive Intelligence Grid */
        <div className="space-y-6">
          {/* KPI 4-Metric Cards */}
          <DashboardMetricsGrid
            summary={summary}
            onTriggerAction={handleTriggerAction}
          />

          {/* Middle Row: Response Volume (approx 65%) + Sentiment Mix Donut (approx 35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8">
              <DashboardVolumeChart
                responseVolume={responseVolume}
                chartView={chartView}
                onViewChange={setChartView}
              />
            </div>
            <div className="lg:col-span-4">
              <DashboardSentimentDonut
                sentimentMix={sentimentMix}
                activeFilter={sentimentFilter}
                onFilterChange={setSentimentFilter}
                onTriggerAction={handleTriggerAction}
              />
            </div>
          </div>

          {/* Bottom Row: Top Topics (approx 40%) + Recent Customer Verbatim (approx 60%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5">
              <DashboardTopicsCard
                topics={topTopics}
                onTriggerAction={handleTriggerAction}
              />
            </div>
            <div className="lg:col-span-7">
              <DashboardRecentFeedback
                feedback={latestFeedback}
                totalCount={rawResponses.length || 1}
                onTriggerAction={handleTriggerAction}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}