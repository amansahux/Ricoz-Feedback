import React from "react";
import { Lock, Sparkles } from "lucide-react";

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
  const orgName = organization?.name || (organizationSlug ? organizationSlug.replace(/-/g, " ") : "Recoz Feedback");
  const monogram = orgName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "RF";

  const progressPct = totalQuestions > 0 ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100)) : 0;
  const currentStep = Math.min(totalQuestions, answeredCount + 1);

  return (
    <header className="border-b border-[#EFE4D6] pb-6 mb-7">
      {/* Org Identity & Security Pill */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-[#FFF2DB] border border-[#E6D7C3] flex items-center justify-center text-[#92001D] font-bold text-base shadow-sm uppercase select-none"
            id="org-monogram-badge"
          >
            {monogram}
          </div>
          <div>
            <span
              className="block font-medium text-xs sm:text-sm uppercase tracking-wider text-[#5E5851] font-semibold"
              id="org-name-text"
            >
              {orgName}
            </span>
            <span className="block text-xs text-[#8C847B]" id="org-route-text">
              /f/{organizationSlug || "org"}/{surveySlug || "survey"}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF2DB] border border-[#E6D7C3] text-[#5E5851] shadow-xs">
          <Lock className="w-3.5 h-3.5 text-[#92001D]" />
          <span className="text-xs font-medium">Verified Customer Form</span>
        </div>
      </div>

      {/* Dynamic Title & Editorial Description */}
      <h1
        className="font-serif text-2xl sm:text-[26px] font-semibold text-[#1E1A17] tracking-tight mb-2 leading-snug"
        id="survey-display-title"
      >
        {title || "Customer Experience Survey"}
      </h1>

      {description && (
        <p className="text-sm text-[#5E5851] leading-relaxed" id="survey-display-description">
          {description}
        </p>
      )}

      {/* Subtle Progress Bar */}
      {totalQuestions > 0 && (
        <div className="mt-5 pt-4 border-t border-[#EAE1DB]/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-xs text-[#5E5851] font-medium" id="progress-step-label">
              {progressPct === 100
                ? "All questions answered · 100% completed"
                : `Question ${currentStep} of ${totalQuestions} · ${progressPct}% completed`}
            </span>
            {requiredCount > 0 && (
              <span className="text-xs text-[#8C847B]" id="progress-field-counter">
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
