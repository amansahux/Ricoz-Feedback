import React from "react";
import { CheckCircle, AlertTriangle, FileText, RefreshCw, ArrowLeft } from "lucide-react";

/**
 * Success / Thank You Card after submitting feedback
 */
export const ThankYouState = ({
  organizationName = "the team",
  onReset,
}) => {
  return (
    <div
      className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-2xl shadow-warm-card p-8 sm:p-12 text-center animate-fadeIn"
      id="survey-thankyou-card"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#EBF7ED] border border-[#D2EED7] text-[#1C7332] flex items-center justify-center mx-auto mb-5 shadow-xs">
        <CheckCircle className="w-8 h-8 text-[#1C7332]" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full bg-[#FFF2DB] border border-[#E6D7C3] text-xs font-semibold text-[#5E5851] mb-3">
        Response Recorded
      </span>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A17] mb-2.5">
        Thank you for your feedback!
      </h2>

      <p className="text-sm sm:text-base text-[#5E5851] max-w-md mx-auto mb-8 leading-relaxed">
        Your insights have been securely delivered to{" "}
        <span className="font-semibold text-[#1E1A17]">{organizationName}</span>. We
        appreciate your time in helping us elevate our customer journey.
      </p>

      {onReset && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFF2DB] hover:bg-[#FFE5BF] text-[#1E1A17] border border-[#E6D7C3] text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            Submit another response
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Unavailable / 404 State Card
 */
export const UnavailableState = ({
  message = "This feedback form could not be found or is no longer accepting public responses. Please verify the URL or contact the organization.",
  onRetry,
}) => {
  return (
    <div
      className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-2xl shadow-warm-card p-8 sm:p-12 text-center animate-fadeIn"
      id="survey-unavailable-card"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#FFF2DB] border border-[#E6D7C3] text-[#5E5851] flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7 text-[#7D7461]" />
      </div>

      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1A17] mb-2">
        Survey Unavailable
      </h2>

      <p className="text-sm text-[#5E5851] max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      <div className="inline-block text-xs font-mono bg-[#FFF8F5] border border-[#E8DFD5] px-3 py-1.5 rounded-lg text-[#8C847B] mb-6">
        HTTP 404 · Survey Expired, Inactive or Not Found
      </div>

      {onRetry && (
        <div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF2DB] hover:bg-[#FFE5BF] text-[#1E1A17] border border-[#E6D7C3] text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Draft / Not Published State Card
 */
export const DraftState = () => {
  return (
    <div
      className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-2xl shadow-warm-card p-8 sm:p-12 text-center animate-fadeIn"
      id="survey-draft-card"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F9DFB9]/60 border border-[#E6D7C3] text-[#746243] flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-[#746243]" />
      </div>

      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1A17] mb-2">
        This survey isn't available yet
      </h2>

      <p className="text-sm text-[#5E5851] max-w-md mx-auto mb-6 leading-relaxed">
        The survey creator is still finalizing question drafts and distribution settings. Check back soon.
      </p>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2DB] border border-[#E6D7C3] text-xs font-semibold text-[#5E5851]">
        Status: Draft Mode
      </span>
    </div>
  );
};

/**
 * Skeleton Loader matching Stitch public survey layout
 */
export const SurveySkeletonLoader = () => {
  return (
    <div
      className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-2xl shadow-warm-card p-6 sm:p-9 space-y-6 animate-pulse"
      id="survey-skeleton-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8DFD5]/70" />
          <div className="space-y-1.5">
            <div className="w-28 h-3.5 rounded bg-[#E8DFD5]/70" />
            <div className="w-40 h-2.5 rounded bg-[#E8DFD5]/50" />
          </div>
        </div>
        <div className="w-28 h-6 rounded-full bg-[#E8DFD5]/50" />
      </div>

      <div className="w-3/4 h-7 rounded-lg bg-[#E8DFD5]/70" />
      <div className="w-full h-4 rounded bg-[#E8DFD5]/40" />
      <div className="w-5/6 h-4 rounded bg-[#E8DFD5]/40" />

      {/* Question 1 Skeleton */}
      <div className="pt-4 border-t border-[#EFE4D6] space-y-3">
        <div className="w-52 h-4 rounded bg-[#E8DFD5]/70" />
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-[#E8DFD5]/40" />
          ))}
        </div>
      </div>

      {/* Question 2 Skeleton */}
      <div className="pt-4 border-t border-[#EFE4D6] space-y-3">
        <div className="w-64 h-4 rounded bg-[#E8DFD5]/70" />
        <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[#E8DFD5]/40" />
          ))}
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="w-full h-12 rounded-xl bg-[#E8DFD5]/60 mt-6" />
    </div>
  );
};
