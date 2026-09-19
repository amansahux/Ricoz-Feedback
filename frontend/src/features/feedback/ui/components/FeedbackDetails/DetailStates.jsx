import React from "react";
import { Link } from "react-router";
import { AlertCircle, RefreshCw, FileSearch, ArrowLeft } from "lucide-react";

export const DetailSkeleton = () => (
  <div className="flex flex-col gap-8 animate-pulse">
    {/* Header skeleton */}
    <div className="flex justify-between items-start pb-4 border-b border-[#EFE4D6]">
      <div className="space-y-3 w-1/2">
        <div className="h-3 w-28 bg-[#f0e6e1] rounded"></div>
        <div className="h-8 w-64 bg-[#f0e6e1] rounded-md"></div>
        <div className="h-4 w-80 bg-[#f0e6e1] rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-[#f0e6e1] rounded-full"></div>
        <div className="h-7 w-24 bg-[#f0e6e1] rounded-full"></div>
      </div>
    </div>
    {/* Metrics skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white border border-[#EFE4D6] space-y-4"
        >
          <div className="h-3 w-20 bg-[#f0e6e1] rounded"></div>
          <div className="h-10 w-24 bg-[#f0e6e1] rounded"></div>
          <div className="h-4 w-32 bg-[#f0e6e1] rounded"></div>
        </div>
      ))}
    </div>
    {/* Answers skeleton */}
    <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-[#f0e6e1] rounded"></div>
          <div className="h-5 w-3/4 bg-[#f0e6e1] rounded"></div>
          <div className="h-12 w-full bg-[#f0e6e1] rounded-xl"></div>
        </div>
      ))}
    </div>
    {/* Close the loop skeleton */}
    <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] space-y-6">
      <div className="h-6 w-48 bg-[#f0e6e1] rounded"></div>
      <div className="h-10 w-full bg-[#f0e6e1] rounded-xl"></div>
      <div className="h-24 w-full bg-[#f0e6e1] rounded-xl"></div>
    </div>
  </div>
);

export const DetailError = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#ffdad6]/50 flex items-center justify-center mb-5 border border-[#bb0028]/15">
      <AlertCircle size={32} className="text-[#bb0028]" />
    </div>
    <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
      Failed to load feedback response
    </h2>
    <p className="text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      {error?.message || "An unexpected error occurred."}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-sm font-medium transition-colors cursor-pointer shadow-xs"
    >
      <RefreshCw size={16} />
      <span>Try again</span>
    </button>
  </div>
);

export const DetailNotFound = ({ feedbackId }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center mb-5 border border-[#EFE4D6]">
      <FileSearch size={30} className="text-[#7d7461]" />
    </div>
    <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
      Response not found
    </h2>
    <p className="text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      No feedback response was found for ID <strong>{feedbackId}</strong>. It
      may have been deleted or the link is invalid.
    </p>
    <Link
      to="/feedback"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
    >
      <ArrowLeft size={16} />
      <span>Back to inbox</span>
    </Link>
  </div>
);
