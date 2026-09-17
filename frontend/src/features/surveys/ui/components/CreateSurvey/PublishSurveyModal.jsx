import React from "react";
import { Rocket, X, ShieldCheck } from "lucide-react";

export default function PublishSurveyModal({
  surveyTitle,
  questionCount,
  isOpen,
  onClose,
  onConfirm,
  isPublishing,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F1B18]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl border border-[#EFE4D6] p-6 max-w-md w-full mx-4 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#EFE4D6]/60 pb-3">
          <div className="flex items-center gap-2 text-[#bb0028] font-epilogue font-semibold text-lg">
            <Rocket size={20} />
            <span>Publish Survey</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#7d7461] hover:text-[#1f1b18] p-1 rounded-lg hover:bg-[#FBF2EC]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#5d3f3e] leading-relaxed font-inter">
          You are about to launch <strong className="text-[#1f1b18]">"{surveyTitle}"</strong> to
          production. Customers will immediately begin receiving this survey trigger via direct link
          and embedded widgets.
        </p>

        <div className="p-3.5 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] flex flex-col gap-2 text-xs font-inter">
          <div className="flex justify-between">
            <span className="text-[#7d7461]">Total Questions:</span>
            <span className="font-semibold text-[#1f1b18]">{questionCount} Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7d7461]">Distribution Ready:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck size={14} /> Instant Link, QR & Widget
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl border border-[#EFE4D6] text-xs sm:text-sm font-medium hover:bg-[#FBF2EC] transition cursor-pointer"
          >
            Keep editing
          </button>
          <button
            onClick={onConfirm}
            disabled={isPublishing}
            className="px-5 py-2 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <Rocket size={15} />
            <span>{isPublishing ? "Publishing..." : "Confirm & Launch"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
