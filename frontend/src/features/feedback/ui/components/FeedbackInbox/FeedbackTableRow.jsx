import React from "react";
import { useNavigate } from "react-router";
import {
  Star,
  Link as LinkIcon,
  QrCode,
  Code,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function FeedbackTableRow({ response, onMarkResolved }) {
  const navigate = useNavigate();

  const customerName = response.customerId?.name || "Anonymous Respondent";
  const customerEmail = response.customerId?.email || "anonymous@respondent.io";

  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AN";

  // Sentiment color style mapping
  const sentiment = response.sentiment || "neutral";
  const sentimentStyles = {
    positive: {
      bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-600",
      avatarBg: "bg-emerald-100 text-emerald-800",
    },
    neutral: {
      bg: "bg-[#FBF2EC] text-[#7d7461] border-[#EFE4D6]",
      dot: "bg-[#635b4a]",
      avatarBg: "bg-[#FBF2EC] text-[#1f1b18]",
    },
    negative: {
      bg: "bg-[#ffdad6]/70 text-[#ba1a1a] border-[#ba1a1a]/20",
      dot: "bg-[#ba1a1a]",
      avatarBg: "bg-[#ffdad8] text-[#bb0028]",
    },
  }[sentiment] || {
    bg: "bg-[#FBF2EC] text-[#7d7461] border-[#EFE4D6]",
    dot: "bg-[#635b4a]",
    avatarBg: "bg-[#FBF2EC] text-[#1f1b18]",
  };

  // Status mapping
  const status = response.status || "open";
  const statusStyles = {
    open: "bg-[#FBF2EC] text-[#1f1b18] border-[#EFE4D6]",
    in_progress: "bg-[#F9DFB9] text-[#746243] border-[#EFE4D6]",
    resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  }[status] || "bg-[#FBF2EC] text-[#1f1b18] border-[#EFE4D6]";

  // Source mapping
  const source = response.source || "link";
  const SourceIcon = source === "qr" ? QrCode : source === "widget" ? Code : LinkIcon;

  // Format Date
  const dateFormatted = new Date(response.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract verbatim quote from text/textarea answer or note
  const textAnswer =
    response.answers?.find((a) => typeof a.value === "string" && a.value.length > 5)?.value ||
    response.followUpNote ||
    "Response submitted successfully.";

  const scoreDisplay =
    response.csatScore !== undefined && response.csatScore !== null
      ? { score: response.csatScore, max: 5 }
      : response.npsScore !== undefined && response.npsScore !== null
      ? { score: response.npsScore, max: 10 }
      : { score: 5, max: 5 };

  return (
    <tr
      onClick={() => navigate(`/feedback/${response._id}`)}
      className={`hover:bg-[#FBF2EC]/50 transition-colors cursor-pointer group ${
        sentiment === "negative" && status === "open" ? "border-l-2 border-l-[#bb0028]" : ""
      }`}
    >
      {/* 1. Customer Name & Avatar */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center text-xs shrink-0 ${sentimentStyles.avatarBg}`}
          >
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs sm:text-sm text-[#1f1b18] group-hover:text-[#bb0028] transition-colors truncate">
              {customerName}
            </span>
            <span className="text-xs text-[#7d7461] truncate">{customerEmail}</span>
          </div>
        </div>
      </td>

      {/* 2. Rating Score */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <div className="flex items-center gap-1 font-medium text-xs sm:text-sm text-[#1f1b18]">
          <span className="font-bold">{scoreDisplay.score}</span>
          <span className="text-[#7d7461]/60">/ {scoreDisplay.max}</span>
          <Star
            size={14}
            className={`fill-current ml-0.5 ${
              scoreDisplay.score >= 4
                ? "text-amber-500"
                : scoreDisplay.score <= 2
                ? "text-[#bb0028]"
                : "text-amber-500"
            }`}
          />
        </div>
      </td>

      {/* 3. Sentiment Tag */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sentimentStyles.bg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${sentimentStyles.dot}`}></span>
          <span className="capitalize">{sentiment}</span>
        </span>
      </td>

      {/* 4. Topics & Feedback Snippet */}
      <td className="py-3.5 px-4 max-w-xs md:max-w-md">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          {(response.topics && response.topics.length > 0
            ? response.topics
            : ["General Feedback"]
          ).map((topic, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FBF2EC] text-[#7d7461] border border-[#EFE4D6]"
            >
              {topic}
            </span>
          ))}
        </div>
        <p className="text-xs text-[#7d7461] font-inter truncate italic">
          "{textAnswer}"
        </p>
      </td>

      {/* 5. Source */}
      <td className="py-3.5 px-3 whitespace-nowrap text-[#7d7461]">
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase font-mono">
          <SourceIcon size={14} className="text-[#1f1b18]" />
          <span>{source}</span>
        </div>
      </td>

      {/* 6. Status */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusStyles}`}
        >
          {status === "in_progress" ? "In Progress" : status}
        </span>
      </td>

      {/* 7. Date */}
      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-[#7d7461] font-inter">
        {dateFormatted}
      </td>

      {/* 8. Actions */}
      <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => navigate(`/feedback/${response._id}`)}
            className="p-1.5 rounded-lg hover:bg-[#FBF2EC] text-[#7d7461] hover:text-[#1f1b18] transition cursor-pointer"
            title="View details"
          >
            <Eye size={16} />
          </button>
          {status !== "resolved" && (
            <button
              type="button"
              onClick={(e) => onMarkResolved(response._id, e)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 text-[#7d7461] hover:text-emerald-700 transition cursor-pointer"
              title="Mark resolved"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
