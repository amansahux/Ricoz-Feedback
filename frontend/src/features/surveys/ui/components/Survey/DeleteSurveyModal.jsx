import React from "react";
import { AlertCircle, Trash2, X } from "lucide-react";

export default function DeleteSurveyModal({ survey, isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !survey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F1B18]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div className="relative bg-white border border-[#EFE4D6] rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-[#bb0028] flex items-center justify-center shrink-0 border border-rose-200">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-epilogue font-semibold text-[#1f1b18]">
                Delete survey?
              </h3>
              <p className="text-xs text-[#7d7461]">Irreversible operation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#5d3f3e] leading-relaxed font-inter">
          Are you sure you want to delete{" "}
          <strong className="text-[#1f1b18]">"{survey.title}"</strong>? All historical
          customer verbatims and response telemetry will be permanently wiped. This
          action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-[#EFE4D6] bg-white text-[#1f1b18] text-xs sm:text-sm font-medium hover:bg-[#FBF2EC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(survey._id)}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-[#bb0028] text-white text-xs sm:text-sm font-semibold hover:bg-[#a10022] transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete survey"}
          </button>
        </div>
      </div>
    </div>
  );
}
