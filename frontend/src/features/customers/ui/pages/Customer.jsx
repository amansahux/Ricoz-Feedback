import React from "react";
import { useCustomerDirectory } from "../../hooks/useCustomer.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";
import CustomerHeader from "../components/Customer/CustomerHeader.jsx";
import CustomerToolbar from "../components/Customer/CustomerToolbar.jsx";
import CustomerTable from "../components/Customer/CustomerTable.jsx";
import CustomerPagination from "../components/Customer/CustomerPagination.jsx";
import {
  CustomerSkeleton,
  CustomerEmptyState,
  CustomerNoResults,
  CustomerErrorState,
} from "../components/Customer/CustomerStates.jsx";

export default function Customer() {
  const {
    customers,
    allCustomers,
    totalCount,
    filteredCount,
    metrics,

    // Statuses
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isEmpty,
    isNoResults,

    // Filter Controls
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    hasSearch,
    resetFilters,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize,

    // Toast
    toast,
    hideToast,
  } = useCustomerDirectory();

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-2">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Header & KPI Summary */}
      <CustomerHeader
        totalCustomers={metrics.totalCustomers}
        avgExperience={metrics.avgExperience}
      />

      {/* Search & Filter Toolbar */}
      <CustomerToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showingCount={customers.length}
        totalCount={totalCount}
      />

      {/* Fetching overlay indicator */}
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] text-xs font-inter text-[#7d7461]">
          <span className="w-2 h-2 rounded-full bg-[#bb0028] animate-pulse"></span>
          Refreshing customer directory…
        </div>
      )}

      {/* Main Content States */}
      {isLoading ? (
        <CustomerSkeleton />
      ) : isError ? (
        <CustomerErrorState error={error} onRetry={() => refetch()} />
      ) : isEmpty ? (
        <CustomerEmptyState />
      ) : isNoResults ? (
        <CustomerNoResults searchQuery={searchQuery} onReset={resetFilters} />
      ) : (
        <>
          {/* Customers Table */}
          <CustomerTable customers={customers} />

          {/* Pagination */}
          {totalPages > 1 && (
            <CustomerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={filteredCount}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
