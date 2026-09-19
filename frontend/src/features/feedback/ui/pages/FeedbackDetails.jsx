import React from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Download,
  MoreHorizontal,
  Star,
  Info,
  ThumbsUp,
  MinusCircle,
  QrCode,
  Link as LinkIcon,
  Code,
  CheckCircle2,
  Flag,
  Brain,
  Save,
  RefreshCw,
  AlertCircle,
  FileSearch,
  Loader2,
} from "lucide-react";
import { useFeedbackDetail } from "../../hooks/useFeedback.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";

// ── Helpers ──────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const sourceLabel = (source) => {
  const map = { qr: "QR Code", link: "Direct Link", widget: "Widget" };
  return map[source] || source || "Link";
};

const SourceIcon = ({ source }) => {
  if (source === "qr") return <QrCode size={14} />;
  if (source === "widget") return <Code size={14} />;
  return <LinkIcon size={14} />;
};

const sentimentConfig = {
  positive: {
    bg: "bg-emerald-50/60 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-600",
  },
  neutral: {
    bg: "bg-[#FBF2EC] text-[#7d7461] border-[#EFE4D6]",
    dot: "bg-[#635b4a]",
  },
  negative: {
    bg: "bg-[#ffdad6]/50 text-[#bb0028] border-[#ffdad6]",
    dot: "bg-[#bb0028] animate-pulse",
  },
};

const statusConfig = {
  open: "bg-[#f0e6e1] text-[#1f1b18] border-[#e1d8d3]",
  in_progress: "bg-[#F9DFB9] text-[#746243] border-[#EFE4D6]",
  resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

// ── Stars ────────────────────────────────────────────────────────
const Stars = ({ rating, max = 5, size = 16 }) => (
  <div className="flex gap-0.5 text-amber-500">
    {Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? "fill-current" : "text-[#e1d8d3] fill-none"}
      />
    ))}
  </div>
);

// ── NPS Segment Bar ──────────────────────────────────────────────
const NpsBar = ({ score, max = 10 }) => (
  <div className="hidden sm:flex items-center gap-1">
    {Array.from({ length: max + 1 }, (_, i) => {
      let bg = "bg-[#e1d8d3]";
      if (i <= score) {
        bg =
          i <= 6
            ? "bg-[#ffdad6]"
            : i <= 8
            ? "bg-[#F9DFB9] ring-1 ring-[#6e5c3e]"
            : "bg-emerald-200";
      }
      return (
        <span key={i} className={`w-5 h-2 rounded-sm ${bg}`}></span>
      );
    })}
  </div>
);

// ── Skeleton ─────────────────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="flex flex-col gap-8 animate-pulse">
    {/* Header skeleton */}
    <div className="flex justify-between items-start pb-4 border-b border-[#EFE4D6]">
      <div className="space-y-3 w-1/2">
        <div className="h-3 w-28 bg-[#f0e6e1] rounded"></div>
        <div className="h-8 w-64 bg-[#f0e6e1] rounded-md"></div>
        <div className="h-4 w-80 bg-[#f0e6e1] rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-[#f0e6e1] rounded-full"></div>
        <div className="h-7 w-24 bg-[#f0e6e1] rounded-full"></div>
      </div>
    </div>
    {/* Metrics skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white border border-[#EFE4D6] space-y-4"
        >
          <div className="h-3 w-20 bg-[#f0e6e1] rounded"></div>
          <div className="h-10 w-24 bg-[#f0e6e1] rounded"></div>
          <div className="h-4 w-32 bg-[#f0e6e1] rounded"></div>
        </div>
      ))}
    </div>
    {/* Answers skeleton */}
    <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-[#f0e6e1] rounded"></div>
          <div className="h-5 w-3/4 bg-[#f0e6e1] rounded"></div>
          <div className="h-12 w-full bg-[#f0e6e1] rounded-xl"></div>
        </div>
      ))}
    </div>
    {/* Close the loop skeleton */}
    <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] space-y-6">
      <div className="h-6 w-48 bg-[#f0e6e1] rounded"></div>
      <div className="h-10 w-full bg-[#f0e6e1] rounded-xl"></div>
      <div className="h-24 w-full bg-[#f0e6e1] rounded-xl"></div>
    </div>
  </div>
);

// ── Error State ──────────────────────────────────────────────────
const DetailError = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#ffdad6]/50 flex items-center justify-center mb-5 border border-[#bb0028]/15">
      <AlertCircle size={32} className="text-[#bb0028]" />
    </div>
    <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
      Failed to load feedback response
    </h2>
    <p className="text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      {error?.message || "An unexpected error occurred."}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-sm font-medium transition-colors cursor-pointer shadow-xs"
    >
      <RefreshCw size={16} />
      <span>Try again</span>
    </button>
  </div>
);

// ── Not Found State ──────────────────────────────────────────────
const DetailNotFound = ({ feedbackId }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center mb-5 border border-[#EFE4D6]">
      <FileSearch size={30} className="text-[#7d7461]" />
    </div>
    <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
      Response not found
    </h2>
    <p className="text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      No feedback response was found for ID <strong>{feedbackId}</strong>. It
      may have been deleted or the link is invalid.
    </p>
    <Link
      to="/feedback"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
    >
      <ArrowLeft size={16} />
      <span>Back to inbox</span>
    </Link>
  </div>
);

// ── MAIN COMPONENT ───────────────────────────────────────────────
export default function FeedbackDetails() {
  const { feedbackId } = useParams();
  const {
    response,
    isLoading,
    isError,
    error,
    refetch,
    isNotFound,

    // Close the loop state
    currentStatus,
    internalNote,
    setInternalNote,
    isNoteSaved,
    isUpdating,
    handleStatusChange,
    handleSaveNote,
    handleToggleResolution,
    handleExportJson,

    // Toast
    toast,
    showToast,
    hideToast,
  } = useFeedbackDetail(feedbackId);

  // Derived data
  const customerName = response?.customerId?.name || "Anonymous Respondent";
  const customerEmail = response?.customerId?.email || "—";
  const surveyTitle = response?.surveyId?.title || "Survey";
  const sentiment = response?.sentiment || "neutral";
  const source = response?.source || "link";
  const sentimentStyle = sentimentConfig[sentiment] || sentimentConfig.neutral;
  const topics = response?.topics?.length
    ? response.topics
    : ["General Feedback"];
  const answers = response?.answers || [];

  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // NPS insight label
  const npsInsight = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 9) return "Promoter";
    if (score >= 7) return "Passive Detractor boundary";
    return "Detractor";
  };

  // CSAT insight label
  const csatInsight = (score) => {
    if (score === null || score === undefined) return null;
    if (score >= 4) return "Satisfied overall";
    if (score >= 3) return "Neutral satisfaction";
    return "Dissatisfied";
  };

  return (
    <div className="w-full flex flex-col min-w-0">
      {/* Toast */}
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* TOP CONTEXTUAL ACTION BAR */}
      <header className="sticky top-0 z-30 bg-[#fff8f5]/90 backdrop-blur-md border-b border-[#EFE4D6]/50 px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Back link + Breadcrumb */}
        <div className="flex items-center gap-4 text-sm">
          <Link
            to="/feedback"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7d7461] hover:text-[#bb0028] transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Back to feedback inbox</span>
          </Link>
          <span className="text-[#e1d8d3] hidden sm:inline">/</span>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#7d7461] font-inter">
            <span>Feedback</span>
            <span className="text-[#e1d8d3]">/</span>
            <span className="text-[#1f1b18] font-semibold">
              Response #{feedbackId?.substring(0, 6) || feedbackId}
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-5xl mx-auto px-6 md:px-10 py-8 flex flex-col gap-8">
        {/* ────── STATE MANAGEMENT ────── */}
        {isLoading ? (
          <DetailSkeleton />
        ) : isError ? (
          <DetailError error={error} onRetry={refetch} />
        ) : isNotFound ? (
          <DetailNotFound feedbackId={feedbackId} />
        ) : (
          <>
            {/* ──────────────────────────────────────── */}
            {/* RESOLVED BANNER */}
            {/* ──────────────────────────────────────── */}
            {currentStatus === "resolved" && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">
                      Feedback marked as Resolved
                    </p>
                    <p className="text-xs text-emerald-700">
                      {response?.resolvedAt
                        ? `Closed on ${formatDate(response.resolvedAt)}`
                        : "Closed recently"}
                      {internalNote ? " • Follow-up note logged" : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusChange("open")}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
                >
                  Reopen Ticket
                </button>
              </div>
            )}

            {/* ──────────────────────────────────────── */}
            {/* 1. HEADER & IDENTITY */}
            {/* ──────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2 border-b border-[#EFE4D6]/60">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                  FEEDBACK RESPONSE
                </span>
                <h1 className="text-2xl sm:text-3xl font-epilogue font-semibold text-[#1f1b18] tracking-tight">
                  {customerName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-[#7d7461] font-inter mt-0.5">
                  <span className="font-medium text-[#1f1b18]">
                    {customerEmail}
                  </span>
                  <span className="text-[#e1d8d3]">•</span>
                  <span>{formatDate(response?.createdAt)}</span>
                  <span className="text-[#e1d8d3]">•</span>
                  <span>{formatTime(response?.createdAt)}</span>
                  <span className="text-[#e1d8d3]">•</span>
                  <span className="inline-flex items-center gap-1 text-[#1f1b18]">
                    <SourceIcon source={source} />
                    Channel: {sourceLabel(source)}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 self-start pt-1">
                {/* Status badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusConfig[currentStatus] || statusConfig.open
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentStatus === "resolved"
                        ? "bg-emerald-600"
                        : currentStatus === "in_progress"
                        ? "bg-[#6e5c3e]"
                        : "bg-[#6e5c3e]"
                    }`}
                  ></span>
                  <span className="capitalize">
                    {currentStatus === "in_progress"
                      ? "In Progress"
                      : currentStatus}
                  </span>
                </span>

                {/* Sentiment pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sentimentStyle.bg}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${sentimentStyle.dot}`}
                  ></span>
                  <span className="capitalize">{sentiment}</span>
                </span>

                {/* Source pill */}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#FBF2EC] text-[#1f1b18] border border-[#EFE4D6]">
                  <SourceIcon source={source} />
                  {sourceLabel(source)}
                </span>
              </div>
            </div>

            {/* ──────────────────────────────────────── */}
            {/* 2. METRIC CARDS */}
            {/* ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* NPS */}
              <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)] flex flex-col justify-between transition-all hover:border-[#e7bcbb]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                    NPS SCORE
                  </span>
                  {response?.npsScore != null && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F9DFB9]/60 text-[#746243]">
                      Score {response.npsScore}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-3xl font-epilogue font-semibold text-[#1f1b18]">
                    {response?.npsScore ?? "—"}
                  </span>
                  <span className="text-lg text-[#7d7461] font-normal">
                    / 10
                  </span>
                </div>
                <p className="text-xs text-[#7d7461] font-inter mt-2 flex items-center gap-1">
                  <Info size={14} className="text-[#635b4a]" />
                  {npsInsight(response?.npsScore) || "Not collected"}
                </p>
              </div>

              {/* CSAT */}
              <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)] flex flex-col justify-between transition-all hover:border-[#e7bcbb]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                    CSAT RATING
                  </span>
                  {response?.csatScore != null && (
                    <Stars rating={response.csatScore} max={5} size={14} />
                  )}
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-3xl font-epilogue font-semibold text-[#1f1b18]">
                    {response?.csatScore ?? "—"}
                  </span>
                  <span className="text-lg text-[#7d7461] font-normal">
                    / 5
                  </span>
                </div>
                <p className="text-xs text-[#7d7461] font-inter mt-2 flex items-center gap-1">
                  <ThumbsUp size={14} className="text-[#6e5c3e]" />
                  {csatInsight(response?.csatScore) || "Not collected"}
                </p>
              </div>

              {/* CES */}
              <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)] flex flex-col justify-between transition-all hover:border-[#e7bcbb]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                    CUSTOMER EFFORT (CES)
                  </span>
                  {response?.cesScore == null && (
                    <span className="text-[11px] text-[#7d7461] font-inter">
                      Not Collected
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-3xl font-epilogue font-light text-[#7d7461]">
                    {response?.cesScore ?? "—"}
                  </span>
                  {response?.cesScore != null && (
                    <span className="text-lg text-[#7d7461] font-normal">
                      / 7
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7d7461] font-inter mt-2 flex items-center gap-1">
                  <MinusCircle size={14} className="text-[#7d7461]" />
                  {response?.cesScore != null
                    ? response.cesScore >= 5
                      ? "Low effort — good"
                      : "High effort — needs improvement"
                    : "Not collected in this survey"}
                </p>
              </div>
            </div>

            {/* ──────────────────────────────────────── */}
            {/* 3. CUSTOMER ANSWERS */}
            {/* ──────────────────────────────────────── */}
            <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EFE4D6]/60 gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18]">
                    Customer Answers
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0e6e1] text-[#1f1b18]">
                    {answers.length} Questions Answered
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#7d7461] bg-[#FBF2EC] px-3 py-1.5 rounded-lg border border-[#EFE4D6] font-inter">
                  Origin:{" "}
                  <strong className="text-[#1f1b18] font-medium">
                    {surveyTitle}
                  </strong>
                </div>
              </div>

              {/* Answers list */}
              <div className="flex flex-col divide-y divide-[#EFE4D6]/50">
                {answers.map((answer, idx) => (
                  <div key={answer.questionId || idx} className="py-6 flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                      QUESTION {idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-medium text-[#1f1b18] font-inter">
                      {answer.questionText || "Question"}
                    </h3>

                    {/* Render based on answer type */}
                    {answer.type === "rating" && (
                      <div className="mt-1 flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6] text-lg font-epilogue font-semibold text-[#1f1b18]">
                          <span>
                            {answer.value} / 5
                          </span>
                          <Stars rating={answer.value} max={5} size={16} />
                        </div>
                        <span className="text-xs text-[#7d7461] font-inter">
                          Rating Scale: 1 (Poor) to 5 (Excellent)
                        </span>
                      </div>
                    )}

                    {answer.type === "nps" && (
                      <div className="mt-1 flex items-center gap-4 flex-wrap">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6]">
                          <span className="text-lg font-epilogue font-bold text-[#1f1b18]">
                            {answer.value}
                          </span>
                          <span className="text-xs text-[#7d7461] font-inter">
                            / 10 (Score: {answer.value})
                          </span>
                        </div>
                        <NpsBar score={answer.value} />
                      </div>
                    )}

                    {(answer.type === "textarea" || answer.type === "text") && (
                      <div className="mt-1 p-5 rounded-xl bg-[#fff8f5] border-l-4 border-[#bb0028] border-t border-r border-b border-[#EFE4D6] shadow-xs">
                        <p className="text-sm sm:text-base text-[#1f1b18] italic leading-relaxed font-inter">
                          "{answer.value}"
                        </p>
                      </div>
                    )}

                    {/* Default fallback */}
                    {!["rating", "nps", "textarea", "text"].includes(
                      answer.type
                    ) && (
                      <div className="mt-1 px-3 py-2 rounded-lg bg-[#FBF2EC] border border-[#EFE4D6] text-sm text-[#1f1b18] font-inter">
                        {String(answer.value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom: Topics & Sentiment Intel */}
              {topics.length > 0 && (
                <div className="mt-4 pt-6 border-t border-[#EFE4D6]/50 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-[#bb0028]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
                      DETECTED TOPICS & SENTIMENT INTEL
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#f6ece7] text-[#1f1b18] border border-[#EFE4D6]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#7d7461] bg-[#FBF2EC]/70 p-3 rounded-lg border border-[#EFE4D6] mt-1">
                    <Flag size={14} className="text-[#bb0028] mt-0.5 shrink-0" />
                    <span>
                      <strong>AI Key Insight:</strong> Detected {sentiment}{" "}
                      sentiment across {topics.length} topic
                      {topics.length > 1 ? "s" : ""}. Review customer verbatim
                      for operational action items.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ──────────────────────────────────────── */}
            {/* 4. CLOSE THE LOOP */}
            {/* ──────────────────────────────────────── */}
            <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_4px_12px_-4px_rgba(94,88,81,0.06)] flex flex-col gap-6 relative overflow-hidden">
              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#EFE4D6]/50">
                <div>
                  <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18] flex items-center gap-2">
                    <RefreshCw size={18} className="text-[#bb0028]" />
                    Close the loop
                  </h2>
                  <p className="text-xs text-[#7d7461] font-inter mt-0.5">
                    Track internal resolution, record customer actions, and
                    resolve this ticket.
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
                    {response?.createdAt
                      ? `• ${formatDate(response.createdAt)}`
                      : "recently"}
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
          </>
        )}
      </main>
    </div>
  );
}