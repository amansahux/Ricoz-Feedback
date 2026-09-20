import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AnalyticsErrorState({ error, onRetry }) {
  return (
    <div className="w-full py-16 px-6 rounded-2xl bg-white border border-[#bb0028]/25 flex flex-col items-center justify-center text-center shadow-xs my-4 max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#bb0028] flex items-center justify-center mb-4 border border-rose-200">
        <AlertTriangle size={28} />
      </div>
      <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18]">
        Unable to load analytics
      </h2>
      <p className="text-xs sm:text-sm text-[#6e5c3e] max-w-md mt-2 mb-6 font-inter leading-relaxed">
        {error?.message ||
          "We encountered an issue aggregating customer responses from our telemetry cluster. Please check your network or retry synchronization."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2.5 rounded-xl bg-[#bb0028] text-white font-inter text-xs sm:text-sm font-semibold hover:bg-[#a10022] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
