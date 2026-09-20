import React from "react";
import { Loader2 } from "lucide-react";

export const SaveActionBar = ({
  isDirty,
  isSaving,
  onDiscard,
  onSave,
}) => {
  return (
    <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 z-30 bg-[#FFFAF3]/95 backdrop-blur-md border-t border-[#E1D8D3] px-6 py-3.5 transition-all duration-300 shadow-md">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Indicator Message */}
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <p className="text-xs sm:text-sm text-[#7d7461] font-medium">
            {isDirty ? "You have unsaved changes" : "All changes saved to cloud"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={onDiscard}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] rounded-xl transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={onSave}
            className="px-5 py-2.5 rounded-xl bg-[#bb0028] text-white text-xs sm:text-sm font-semibold hover:bg-[#92001d] active:scale-98 transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            <span>{isSaving ? "Saving changes..." : "Save changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveActionBar;
