import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ShareErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-rose-200 my-6 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#bb0028] flex items-center justify-center mb-4 border border-rose-200">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18]">
        Unable to load share settings
      </h2>
      <p className="text-xs sm:text-sm text-[#7d7461] max-w-md mt-2 mb-6 font-inter leading-relaxed">
        There was an error communicating with the Recoz intelligence cluster. Your survey is safe,
        but sharing telemetry is momentarily unavailable.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
        >
          <RefreshCw size={15} />
          <span>Retry connection</span>
        </button>
      )}
    </div>
  );
}
