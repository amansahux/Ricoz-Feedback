import React from "react";
import { useParams } from "react-router";
import { useCustomerProfile } from "../../hooks/useCustomer.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";
import CustomerProfileHeader from "../components/CustomerDetails/CustomerProfileHeader.jsx";
import CustomerProfileMetrics from "../components/CustomerDetails/CustomerProfileMetrics.jsx";
import CustomerHistoryTable from "../components/CustomerDetails/CustomerHistoryTable.jsx";
import {
  CustomerProfileSkeleton,
  CustomerProfileNotFound,
  CustomerProfileError,
} from "../components/CustomerDetails/CustomerProfileStates.jsx";

export default function CustomerDetail() {
  const { customerId } = useParams();
  const {
    customer,
    responses,
    uniqueSurveys,
    summary,

    // Statuses
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isNotFound,

    // Filters & Sorting
    surveyFilter,
    setSurveyFilter,
    sortBy,
    setSortBy,

    // Actions
    handleExportJson,

    // Toast
    toast,
    hideToast,
  } = useCustomerProfile(customerId);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-2">
      {/* Toast */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Main Content States */}
      {isLoading ? (
        <CustomerProfileSkeleton />
      ) : isError ? (
        <CustomerProfileError error={error} onRetry={() => refetch()} />
      ) : isNotFound ? (
        <CustomerProfileNotFound customerId={customerId} />
      ) : (
        <>
          {/* Section 1: Back Navigation & Identity Card */}
          <CustomerProfileHeader
            customer={customer}
            onExportJson={handleExportJson}
          />

          {/* Section 2: 3 Metric Cards Grid */}
          <CustomerProfileMetrics
            summary={summary}
            customer={customer}
            totalSurveys={uniqueSurveys.length}
          />

          {/* Section 3: Feedback History Table */}
          <CustomerHistoryTable
            responses={responses}
            uniqueSurveys={uniqueSurveys}
            surveyFilter={surveyFilter}
            setSurveyFilter={setSurveyFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </>
      )}
    </div>
  );
}