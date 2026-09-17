import React, { useState } from "react";
import { Link2, QrCode, Code2, Check, Copy } from "lucide-react";

export default function MultiChannelSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText("recoz.io/f/acme-flow/q3-pulse");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="multi-channel" className="py-24 md:py-32 bg-white border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
            Feedback Touchpoints
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#141210] tracking-tight mb-5">
            Meet customers wherever they are.
          </h2>
          <p className="text-base sm:text-lg text-[#686058]">
            One survey design instantly adapts across online channels, mobile touchpoints, and physical packaging.
          </p>
        </div>

        {/* 3 Distribution Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Channel 1: Public Link */}
          <div className="p-8 rounded-2xl bg-[#FFFAF3] border border-[#E8DFD5] hover:border-[#F62440]/30 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] mb-6">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#141210] mb-2">
                Public Survey Link
              </h3>
              <p className="text-sm text-[#686058] leading-relaxed mb-6">
                Share clean, branded URLs in follow-up emails, SMS, receipts, or post-purchase thank-you screens.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E8DFD5] text-xs font-mono text-[#686058] flex items-center justify-between">
              <span className="truncate">recoz.io/f/acme-flow/q3-pulse</span>
              <button
                onClick={handleCopy}
                className="text-[#F62440] font-bold text-[11px] uppercase ml-2 shrink-0 flex items-center gap-1 hover:underline cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channel 2: QR Code */}
          <div className="p-8 rounded-2xl bg-[#FFFAF3] border border-[#E8DFD5] hover:border-[#F62440]/30 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] mb-6">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#141210] mb-2">
                High-Res QR Codes
              </h3>
              <p className="text-sm text-[#686058] leading-relaxed mb-6">
                Download vector and PNG QR codes for restaurant tables, physical product boxes, and checkout counters.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E8DFD5] flex items-center gap-3">
              <div className="w-9 h-9 bg-stone-900 rounded flex items-center justify-center text-white shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-medium text-[#141210] block">Vector / SVG Ready</span>
                <span className="text-[#9E948A]">Instant mobile scanning</span>
              </div>
            </div>
          </div>

          {/* Channel 3: Embedded Widget */}
          <div className="p-8 rounded-2xl bg-[#FFFAF3] border border-[#E8DFD5] hover:border-[#F62440]/30 transition-all duration-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#141210] mb-2">
                Embeddable Widget
              </h3>
              <p className="text-sm text-[#686058] leading-relaxed mb-6">
                Embed clean feedback forms directly into your web application or marketing site with a lightweight script.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E8DFD5] text-xs font-mono text-[#686058]">
              <code>&lt;script src="recoz.js"&gt;&lt;/script&gt;</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
