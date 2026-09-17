import React from "react";
import { Link } from "react-router";
import {
  Share2,
  Edit,
  Trash2,
  TrendingUp,
  ClipboardList,
  Sparkles,
  HelpCircle,
  Archive,
} from "lucide-react";

export default function SurveyTableRow({ survey, onShare, onDelete }) {
  const isPublished = survey.status === "published";
  const isDraft = survey.status === "draft";
  const isArchived = survey.status === "archived";

  const questionCount = survey.questions?.length || 0;
  const responsesCount = survey.responseCount || 0;

  // Formatted creation date
  const createdDateStr = survey.createdAt
    ? new Date(survey.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Sep 15, 2026";

  // Icon depending on title/type
  const getIcon = () => {
    if (survey.title?.toLowerCase().includes("nps")) {
      return <Sparkles size={18} className="text-[#bb0028]" />;
    }
    if (isArchived) {
      return <Archive size={18} className="text-[#7d7461]" />;
    }
    if (isDraft) {
      return <HelpCircle size={18} className="text-[#6e5c3e]" />;
    }
    return <ClipboardList size={18} className="text-[#bb0028]" />;
  };

  return (
    <tr
      className={`hover:bg-[#FBF2EC]/60 transition-colors duration-150 border-b border-[#EFE4D6]/60 ${
        isArchived ? "opacity-75" : ""
      }`}
    >
      {/* Title & Slug */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBF2EC] flex items-center justify-center shrink-0 border border-[#EFE4D6]">
            {getIcon()}
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              to={`/surveys/create?surveyId=${survey._id}`}
              className="text-sm font-semibold text-[#1f1b18] hover:text-[#bb0028] transition-colors truncate max-w-xs md:max-w-md font-epilogue"
            >
              {survey.title}
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#7d7461]">
              <span className="font-mono text-[11px] truncate">
                /slug: {survey.slug || "custom-slug"}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#d1c5b0]"></span>
              <span className="px-1.5 py-0.5 rounded bg-[#EAE1DB] text-[#5d3f3e] text-[10px] font-medium font-inter">
                {survey.description
                  ? survey.description.slice(0, 24) + "..."
                  : "Feedback Survey"}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4 whitespace-nowrap">
        {isPublished && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF7ED] text-[#1C7332] border border-[#D2EED7] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1C7332] animate-pulse"></span>
            Published
          </span>
        )}
        {isDraft && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF2DB] text-[#746243] border border-[#F9DFB9] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Draft
          </span>
        )}
        {isArchived && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAE1DB] text-[#7d7461] border border-[#EFE4D6] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#926e6d]"></span>
            Archived
          </span>
        )}
      </td>

      {/* Questions */}
      <td className="py-4 px-4 text-xs sm:text-sm text-[#1f1b18] font-inter whitespace-nowrap">
        {questionCount} {questionCount === 1 ? "question" : "questions"}
      </td>

      {/* Responses */}
      <td className="py-4 px-4 min-w-[120px]">
        {isDraft ? (
          <span className="text-xs text-[#7d7461] italic">0 (Draft)</span>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-[#1f1b18] font-inter">
                {responsesCount}
              </span>
              {responsesCount > 0 && (
                <span className="text-[11px] text-[#1C7332] font-semibold flex items-center gap-0.5">
                  <TrendingUp size={12} /> Active
                </span>
              )}
            </div>
            <div className="w-24 bg-[#EAE1DB] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#1C7332] h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(15, responsesCount * 2))}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </td>

      {/* Created Date */}
      <td className="py-4 px-4 text-xs text-[#7d7461] font-inter whitespace-nowrap">
        {createdDateStr}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          {/* Share Button */}
          <button
            onClick={() => onShare(survey)}
            title={isDraft ? "Publish survey to share" : "Share survey link & widget"}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDraft
                ? "text-[#a3978d] hover:text-[#1f1b18] hover:bg-[#FBF2EC]"
                : "text-[#7d7461] hover:text-[#bb0028] hover:bg-[#FBF2EC]"
            }`}
          >
            <Share2 size={16} />
          </button>

          {/* Edit Button */}
          <Link
            to={`/surveys/create?surveyId=${survey._id}`}
            title="Edit survey questions"
            className="p-2 rounded-lg text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] transition-colors"
          >
            <Edit size={16} />
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(survey)}
            title="Delete survey"
            className="p-2 rounded-lg text-[#7d7461] hover:text-[#bb0028] hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
