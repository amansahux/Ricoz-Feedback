import React from "react";
import { CloudOff, RefreshCw } from "lucide-react";

export default function DashboardErrorState({ onRetry, onTriggerAction }) {
  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-[#bb0028] mx-auto flex items-center justify-center mb-4 border border-rose-100">
        <CloudOff size={32} />
      </div>

      <h2 className="text-lg sm:text-xl font-epilogue font-bold text-[#1f1b18] mb-2 tracking-tight">
        Unable to connect to intelligence telemetry
      </h2>
      <p className="text-xs sm:text-sm text-[#7d7461] font-inter mb-6 leading-relaxed">
        We encountered an unexpected timeout while fetching realtime sentiment aggregates from the ingestion node.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#92001d] text-white font-inter text-xs sm:text-sm font-bold shadow-sm shadow-[#bb0028]/20 transition-all cursor-pointer"
        >
          <RefreshCw size={15} />
          <span>Retry connection</span>
        </button>
        <button
          onClick={() => onTriggerAction && onTriggerAction("Diagnostic log generated")}
          className="px-4 py-2.5 rounded-xl border border-[#EFE4D6] bg-white text-[#1f1b18] font-inter text-xs sm:text-sm font-semibold hover:bg-[#FBF2EC] transition-colors cursor-pointer"
        >
          View diagnostics
        </button>
      </div>
    </div>
  );
}
