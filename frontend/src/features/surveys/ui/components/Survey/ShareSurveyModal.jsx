import React, { useState } from "react";
import { Link } from "react-router";
import { X, Copy, Check, Code, QrCode, ShieldCheck, ExternalLink } from "lucide-react";

export default function ShareSurveyModal({ survey, isOpen, onClose, onCopySuccess }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !survey) return null;

  const publicUrl = `${window.location.origin}/f/${survey.slug || survey._id}`;
  const embedCode = `<script src="${window.location.origin}/widget.js" data-survey="${survey._id}" async></script>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    onCopySuccess?.("Survey link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    onCopySuccess?.("Widget snippet copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F1B18]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white border border-[#EFE4D6] rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#bb0028] uppercase tracking-wider font-mono-tag">
              DISTRIBUTION HUB
            </span>
            <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mt-0.5">
              Share your survey
            </h2>
            <p className="text-xs text-[#7d7461] mt-0.5 font-inter">
              {survey.title || "Feedback Survey"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Public Direct Link Block */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5d3f3e]">
            Public Direct Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1f1b18] truncate select-all">
              {publicUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              {copiedLink ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedLink ? "Copied" : "Copy link"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#7d7461] pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-700" />
              <span>SSL Protected & SOC2 Verified</span>
            </span>
            <Link
              to={`/surveys/publish?surveyId=${survey._id}`}
              className="text-[#bb0028] font-medium hover:underline flex items-center gap-1"
            >
              <QrCode size={13} />
              <span>Full Share Center</span>
            </Link>
          </div>
        </div>

        {/* Widget Embed Code Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#5d3f3e]">
              Website Widget Embed Code
            </label>
            <span className="text-[11px] text-[#7d7461]">HTML script</span>
          </div>
          <div className="bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl p-3 text-xs font-mono text-[#5d3f3e] overflow-x-auto select-all">
            {embedCode}
          </div>
          <button
            onClick={handleCopyCode}
            className="w-full py-2.5 rounded-xl bg-[#FFF2DB] text-[#746243] border border-[#F9DFB9] text-xs font-medium hover:bg-[#F9DFB9]/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedCode ? <Check size={15} /> : <Code size={15} />}
            <span>{copiedCode ? "Widget code copied!" : "Copy widget code"}</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-[#EFE4D6] flex items-center justify-between">
          <Link
            to={`/surveys/publish?surveyId=${survey._id}`}
            className="text-xs font-semibold text-[#bb0028] hover:underline flex items-center gap-1"
          >
            <span>Open in Share Hub</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FBF2EC] text-[#1f1b18] text-xs font-medium hover:bg-[#F6ECE7] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
