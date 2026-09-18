import React from "react";
import { Lock } from "lucide-react";

export const SurveyHeader = ({
  organization,
  title,
  description,
  organizationSlug,
  surveySlug,
  totalQuestions = 0,
  answeredCount = 0,
  requiredCount = 0,
}) => {
  const orgName =
    organization?.name ||
    (organizationSlug ? organizationSlug.replace(/-/g, " ") : "Recoz Feedback");
  const monogram =
    orgName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "RF";

  const progressPct =
    totalQuestions > 0
      ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100))
      : 0;
  const currentStep = Math.min(totalQuestions, answeredCount + 1);

  return (
    <header className="border-b border-[#EFE4D6] pb-5 sm:pb-6 mb-6 sm:mb-7 w-full overflow-hidden">
      {/* 1. Org Identity & Security Badge - Flex-wrap row for all screen sizes */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 w-full">
        {/* Left: Monogram and Org details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 max-w-full">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-[#FFF2DB] border border-[#E6D7C3] flex items-center justify-center text-[#92001D] font-bold text-sm sm:text-base shadow-xs uppercase select-none"
            id="org-monogram-badge"
          >
            {monogram}
          </div>
          <div className="min-w-0 flex-1">
            <span
              className="block font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#5E5851] truncate"
              id="org-name-text"
              title={orgName}
            >
              {orgName}
            </span>
            <span
              className="block text-[11px] sm:text-xs text-[#8C847B] truncate font-mono"
              id="org-route-text"
              title={`/f/${organizationSlug || "org"}/${surveySlug || "survey"}`}
            >
              /f/{organizationSlug || "org"}/{surveySlug || "survey"}
            </span>
          </div>
        </div>

        {/* Right: Security Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF2DB] border border-[#E6D7C3] text-[#5E5851] text-xs shadow-2xs shrink-0 self-center">
          <Lock className="w-3.5 h-3.5 text-[#92001D] shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs whitespace-nowrap">
            Verified Customer Form
          </span>
        </div>
      </div>

      {/* 2. Dynamic Title & Editorial Description with wrapping */}
      <div className="space-y-1.5 w-full">
        <h1
          className="font-serif text-xl sm:text-2xl lg:text-[26px] font-semibold text-[#1E1A17] tracking-tight leading-snug break-words"
          id="survey-display-title"
        >
          {title || "Customer Experience Survey"}
        </h1>

        {description && (
          <p
            className="text-xs sm:text-sm text-[#5E5851] leading-relaxed break-words"
            id="survey-display-description"
          >
            {description}
          </p>
        )}
      </div>

      {/* 3. Responsive Progress Bar */}
      {totalQuestions > 0 && (
        <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-[#EAE1DB]/60 w-full">
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs mb-2">
            <span
              className="text-[11px] sm:text-xs text-[#5E5851] font-medium"
              id="progress-step-label"
            >
              {progressPct === 100
                ? "All questions answered · 100% completed"
                : `Question ${currentStep} of ${totalQuestions} · ${progressPct}% completed`}
            </span>
            {requiredCount > 0 && (
              <span
                className="text-[11px] sm:text-xs text-[#8C847B] shrink-0"
                id="progress-field-counter"
              >
                {requiredCount} required {requiredCount === 1 ? "question" : "questions"}
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-[#FFF2DB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F62440] rounded-full transition-all duration-300 ease-out"
              id="progress-bar-fill"
              style={{ width: `${Math.max(5, progressPct)}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default SurveyHeader;
