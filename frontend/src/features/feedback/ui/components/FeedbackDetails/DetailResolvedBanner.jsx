import React from "react";
import { CheckCircle2 } from "lucide-react";
import { formatDate } from "./DetailHelpers.jsx";

export default function DetailResolvedBanner({ response, internalNote, onReopen }) {
  return (
    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Feedback marked as Resolved</p>
          <p className="text-xs text-emerald-700">
            {response?.resolvedAt
              ? `Closed on ${formatDate(response.resolvedAt)}`
              : "Closed recently"}
            {internalNote ? " • Follow-up note logged" : ""}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReopen}
        className="px-3 py-1 text-xs font-medium rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
      >
        Reopen Ticket
      </button>
    </div>
  );
}
