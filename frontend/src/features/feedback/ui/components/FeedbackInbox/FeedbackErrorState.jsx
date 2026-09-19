import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function FeedbackErrorState({ error, onRetry }) {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong while loading feedback responses.";

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#ffdad6]/50 flex items-center justify-center mb-5 border border-[#bb0028]/15">
        <AlertCircle size={32} className="text-[#bb0028]" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
        Failed to load feedback
      </h2>
      <p className="text-sm text-[#7d7461] font-inter max-w-md mb-2 leading-relaxed">
        {message}
      </p>
      <p className="text-xs text-[#7d7461]/70 font-inter mb-6">
        Check your network connection and try again.
      </p>

      {/* Retry Button */}
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-sm font-medium transition-colors cursor-pointer shadow-xs"
      >
        <RotateCcw size={16} />
        <span>Try again</span>
      </button>
    </div>
  );
}
