import React from "react";
import { Link } from "react-router";
import { FileEdit, Rocket } from "lucide-react";

export default function ShareDraftState({ surveyId, onPublishNow }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-[#EFE4D6] my-6 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF2DB] text-[#746243] flex items-center justify-center mb-4 border border-[#F9DFB9]">
        <FileEdit size={32} />
      </div>
      <h2 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18]">
        Survey is currently in Draft
      </h2>
      <p className="text-xs sm:text-sm text-[#7d7461] max-w-md mt-2 mb-6 font-inter leading-relaxed">
        This survey has not been published yet. You need to finalize your questions and publish
        before sharing the public link and distributing widgets.
      </p>
      <div className="flex items-center gap-3">
        {onPublishNow && (
          <button
            onClick={onPublishNow}
            className="px-6 py-2.5 bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Rocket size={15} />
            <span>Publish survey now</span>
          </button>
        )}
        <Link
          to={`/surveys/create?surveyId=${surveyId || ""}`}
          className="px-6 py-2.5 border border-[#EFE4D6] rounded-xl text-xs sm:text-sm font-medium text-[#1f1b18] hover:bg-[#FBF2EC] transition-all"
        >
          Edit questions
        </Link>
      </div>
    </div>
  );
}
