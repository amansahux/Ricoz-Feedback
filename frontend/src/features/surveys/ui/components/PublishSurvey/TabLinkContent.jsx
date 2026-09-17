import React, { useState } from "react";
import { Globe, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";

export default function TabLinkContent({ url, onCopySuccess }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    onCopySuccess?.("Survey link copied to clipboard!");
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#EFE4D6] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7461] font-mono-tag">
              PUBLIC URL
            </span>
            <span className="text-xs text-[#7d7461] font-inter">
              SSL Encrypted • Global Fast CDN
            </span>
          </div>

          {/* Readonly URL Box & Action Controls */}
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            <div className="flex-1 relative flex items-center">
              <Globe
                size={16}
                className="absolute left-3.5 text-[#7d7461] pointer-events-none"
              />
              <input
                type="text"
                readOnly
                value={url}
                className="w-full pl-10 pr-4 py-3 bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl font-mono text-xs sm:text-sm text-[#1f1b18] select-all focus:outline-none focus:ring-1 focus:ring-[#bb0028] focus:border-[#bb0028]"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopy}
                className="px-5 py-3 rounded-xl border border-[#F9DFB9] bg-[#FFF2DB]/50 hover:bg-[#FFF2DB] text-[#1f1b18] text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? "Copied" : "Copy link"}</span>
              </button>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#bb0028] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-[#a10022] shadow-sm transition"
              >
                <span>Open survey</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          {/* Contextual Explainer */}
          <p className="text-xs sm:text-sm text-[#7d7461] font-inter leading-relaxed">
            Anyone with this link can submit feedback. No account is required. Responses are automatically
            consolidated into your customer telemetry dashboard.
          </p>

          {/* Telemetry Channel Notice */}
          <div className="mt-2 p-4 rounded-xl bg-[#FBF2EC]/80 border border-[#EFE4D6] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#bb0028] shadow-2xs">
              <ShieldCheck size={18} className="text-emerald-700" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs font-inter text-[#7d7461]">
              <span className="font-semibold text-[#1f1b18]">Direct link channel</span>
              <span className="hidden sm:inline text-[#d1c5b0]">•</span>
              <span>Instant response capture</span>
              <span className="hidden sm:inline text-[#d1c5b0]">•</span>
              <span>QR & embed compatible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
