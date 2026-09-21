import React from "react";
import { Link } from "react-router";
import { HelpCircle, Plus, Sparkles } from "lucide-react";

export default function SurveyEmptyState({ onSelectTemplate }) {
  return (
    <div className="bg-white border border-[#EFE4D6] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] text-[#bb0028] flex items-center justify-center mb-4 border border-[#EFE4D6]">
        <HelpCircle size={32} />
      </div>
      <h3 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18] mb-2">
        No feedback surveys yet
      </h3>
      <p className="text-xs sm:text-sm text-[#7d7461] mb-6 leading-relaxed max-w-md font-inter">
        Gather valuable sentiment intelligence directly from your operators and customers. Choose from proven CSAT, NPS, or open-ended verbatim templates.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onSelectTemplate && (
          <button
            onClick={onSelectTemplate}
            className="px-4 py-2.5 rounded-xl bg-[#FFF2DB] text-[#746243] border border-[#F9DFB9] text-xs sm:text-sm font-medium hover:bg-[#F9DFB9]/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Explore Templates</span>
          </button>
        )}
        <Link
          to="/surveys/create"
          className="px-4 py-2.5 rounded-xl bg-[#bb0028] text-white text-xs sm:text-sm font-semibold hover:bg-[#a10022] transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Create survey</span>
        </Link>
      </div>
    </div>
  );
}
