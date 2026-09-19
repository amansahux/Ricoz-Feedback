import React from "react";
import { Star, QrCode, Link as LinkIcon, Code } from "lucide-react";

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const sourceLabel = (source) => {
  const map = { qr: "QR Code", link: "Direct Link", widget: "Widget" };
  return map[source] || source || "Link";
};

export const SourceIcon = ({ source, size = 14 }) => {
  if (source === "qr") return <QrCode size={size} />;
  if (source === "widget") return <Code size={size} />;
  return <LinkIcon size={size} />;
};

export const sentimentConfig = {
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

export const statusConfig = {
  open: "bg-[#f0e6e1] text-[#1f1b18] border-[#e1d8d3]",
  in_progress: "bg-[#F9DFB9] text-[#746243] border-[#EFE4D6]",
  resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export const Stars = ({ rating, max = 5, size = 16 }) => (
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

export const NpsBar = ({ score, max = 10 }) => (
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
      return <span key={i} className={`w-5 h-2 rounded-sm ${bg}`}></span>;
    })}
  </div>
);
