import React from "react";
import { Users, Search, AlertCircle, RefreshCw, Plus } from "lucide-react";
import { Link } from "react-router";

export const CustomerSkeleton = () => (
  <div className="bg-white rounded-2xl border border-[#EFE4D6] shadow-xs overflow-hidden p-6 space-y-4 animate-pulse">
    <div className="h-6 w-48 bg-[#f0e6e1] rounded"></div>
    <div className="space-y-3 pt-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 border border-[#EFE4D6]/50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f0e6e1]"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-[#f0e6e1] rounded"></div>
              <div className="h-3 w-48 bg-[#f0e6e1] rounded"></div>
            </div>
          </div>
          <div className="h-4 w-24 bg-[#f0e6e1] rounded hidden sm:block"></div>
          <div className="h-4 w-16 bg-[#f0e6e1] rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const CustomerEmptyState = () => (
  <div className="bg-white rounded-2xl border border-[#EFE4D6] shadow-xs p-12 text-center flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center mb-4 border border-[#EFE4D6] shadow-2xs">
      <Users size={30} className="text-[#7d7461]" />
    </div>
    <h3 className="text-lg font-epilogue font-semibold text-[#1f1b18] mb-1.5">
      No customers registered yet
    </h3>
    <p className="text-xs sm:text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      Once respondents submit feedback on your surveys, their contact identity, response telemetry, and sentiment history will appear here automatically.
    </p>
    <Link
      to="/surveys/create"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
    >
      <Plus size={16} />
      <span>Create and publish a survey</span>
    </Link>
  </div>
);

export const CustomerNoResults = ({ searchQuery, onReset }) => (
  <div className="bg-white rounded-2xl border border-[#EFE4D6] shadow-xs p-12 text-center flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center mb-4 border border-[#EFE4D6]">
      <Search size={28} className="text-[#7d7461]" />
    </div>
    <h3 className="text-lg font-epilogue font-semibold text-[#1f1b18] mb-1.5">
      No matching customers found
    </h3>
    <p className="text-xs sm:text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      We couldn't find any customer matching "<strong>{searchQuery}</strong>". Check the spelling or clear search filters.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-semibold transition cursor-pointer shadow-xs"
    >
      <RefreshCw size={14} />
      <span>Clear search query</span>
    </button>
  </div>
);

export const CustomerErrorState = ({ error, onRetry }) => (
  <div className="bg-white rounded-2xl border border-[#EFE4D6] shadow-xs p-12 text-center flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-[#ffdad6]/50 flex items-center justify-center mb-4 border border-[#bb0028]/20">
      <AlertCircle size={30} className="text-[#bb0028]" />
    </div>
    <h3 className="text-lg font-epilogue font-semibold text-[#1f1b18] mb-1.5">
      Unable to load customers
    </h3>
    <p className="text-xs sm:text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      {error?.message || "There was an error communicating with the server. Please try again."}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-semibold transition cursor-pointer shadow-xs"
    >
      <RefreshCw size={14} />
      <span>Retry loading</span>
    </button>
  </div>
);
