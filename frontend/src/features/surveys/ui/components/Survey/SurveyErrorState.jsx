import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SurveyErrorState({ error, onRetry }) {
  return (
    <div className="bg-white border border-[#bb0028]/25 rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm my-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#bb0028] flex items-center justify-center mb-4 border border-rose-200">
        <AlertTriangle size={28} />
      </div>
      <h3 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2">
        Failed to load surveys
      </h3>
      <p className="text-xs sm:text-sm text-[#7d7461] mb-6 max-w-md font-inter">
        {error?.message ||
          "Unable to connect to the Recoz Enterprise telemetry endpoint. Please verify network permissions or retry synchronization."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-[#bb0028] text-white font-inter text-xs sm:text-sm font-semibold hover:bg-[#a10022] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
