import React from "react";
import { RefreshCw, CheckCircle2, Save, Loader2 } from "lucide-react";
import { formatDate } from "./DetailHelpers.jsx";

export default function DetailCloseTheLoop({
  feedbackId,
  currentStatus,
  internalNote,
  setInternalNote,
  isNoteSaved,
  isUpdating,
  handleStatusChange,
  handleSaveNote,
  handleToggleResolution,
  createdAt,
}) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_4px_12px_-4px_rgba(94,88,81,0.06)] flex flex-col gap-6 relative overflow-hidden">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EFE4D6]/50">
        <div>
          <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18] flex items-center gap-2">
            <RefreshCw size={18} className="text-[#bb0028]" />
            Close the loop
          </h2>
          <p className="text-xs text-[#7d7461] font-inter mt-0.5">
            Track internal resolution, record customer actions, and resolve this
            ticket.
          </p>
        </div>
        <span className="text-[11px] text-[#7d7461] bg-[#FBF2EC] px-2.5 py-1 rounded-md border border-[#EFE4D6] self-start sm:self-auto font-inter">
          Ticket #{feedbackId?.substring(0, 8) || feedbackId}
        </span>
      </div>

      {/* Status toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
          STATUS WORKFLOW
        </label>
        <div
          className="inline-flex p-1 rounded-xl bg-[#f6ece7] border border-[#EFE4D6] max-w-md w-full"
          role="group"
        >
          {[
            { value: "open", label: "Open" },
            { value: "in_progress", label: "In Progress" },
            { value: "resolved", label: "Resolved" },
          ].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => handleStatusChange(s.value)}
              disabled={isUpdating}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
                currentStatus === s.value
                  ? "bg-white text-[#1f1b18] shadow-sm font-semibold"
                  : "text-[#7d7461] hover:text-[#1f1b18]"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Internal note */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter"
            htmlFor="internal-note"
          >
            INTERNAL FOLLOW-UP NOTE{" "}
            <span className="font-normal lowercase text-[#7d7461]">
              (Visible only to team)
            </span>
          </label>
        </div>
        <textarea
          id="internal-note"
          rows={3}
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          placeholder="Add a note about what actions you took with the customer..."
          className="w-full p-3.5 rounded-xl border border-[#EFE4D6] bg-[#fff8f5] text-[#1f1b18] placeholder:text-[#7d7461]/50 text-sm font-inter focus:ring-1 focus:ring-[#bb0028] focus:border-[#bb0028] transition-all resize-y"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[#7d7461] font-inter">
            {isNoteSaved ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> Saved
              </span>
            ) : (
              "Unsaved changes"
            )}
          </span>
          <button
            type="button"
            onClick={handleSaveNote}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f6ece7] text-[#1f1b18] hover:bg-[#f0e6e1] border border-[#EFE4D6] text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* Resolution controls */}
      <div className="mt-2 pt-5 border-t border-[#EFE4D6]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FBF2EC]/40 p-4 rounded-xl border border-[#EFE4D6]">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[#1f1b18] font-inter">
            {currentStatus === "resolved"
              ? "This feedback has been resolved"
              : "Action required for response closure"}
          </span>
          <span className="text-xs text-[#7d7461] mt-0.5 font-inter">
            Last updated{" "}
            {createdAt ? `• ${formatDate(createdAt)}` : "recently"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleResolution}
            disabled={isUpdating}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
              currentStatus === "resolved"
                ? "bg-white border border-[#EFE4D6] text-[#1f1b18] hover:bg-[#FBF2EC]"
                : "bg-[#bb0028] hover:bg-[#a10022] text-white shadow-[0_2px_6px_rgba(187,0,40,0.25)]"
            }`}
          >
            {isUpdating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>
              {currentStatus === "resolved"
                ? "Reopen Ticket"
                : "Mark as Resolved"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
