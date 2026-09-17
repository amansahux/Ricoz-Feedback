import React from "react";
import { Sparkles } from "lucide-react";

export default function ResponseAnalysis() {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-[#E8DFD5]">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
          Response Analysis
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#141210] tracking-tight mb-4">
          Extracting meaning from unstructured words.
        </h2>
        <p className="text-base text-[#686058] max-w-2xl mx-auto mb-14">
          Customers don’t write in spreadsheets. Recoz extracts sentiment and actionable topics from open-ended responses automatically.
        </p>

        {/* Analysis Card Visual Transformation */}
        <div className="bg-[#FFFAF3] rounded-2xl border border-[#E8DFD5] p-8 sm:p-12 text-left shadow-sm max-w-3xl mx-auto space-y-8">
          {/* Step A: The Raw Text */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#9E948A] mb-2 uppercase tracking-wider font-semibold">
              <span>Raw Customer Response</span>
              <span>Customer: verified purchase</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E8DFD5]">
              <p className="text-base sm:text-lg text-[#141210] font-medium leading-relaxed">
                “Product quality was great, but delivery took almost 9 days.”
              </p>
            </div>
          </div>

          {/* Center arrow divider */}
          <div className="flex items-center justify-center">
            <div className="h-px bg-[#E8DFD5] flex-1" />
            <span className="px-4 py-1 rounded-full text-xs font-mono font-medium bg-[#FFE5BF]/50 text-[#141210] border border-[#FFE5BF]">
              Recoz Response Analysis
            </span>
            <div className="h-px bg-[#E8DFD5] flex-1" />
          </div>

          {/* Step B: The Extracted Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5]">
              <span className="text-[11px] font-semibold text-[#9E948A] uppercase tracking-wider block mb-1">
                Sentiment
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F62440]" />
                <span className="font-heading font-bold text-base text-[#141210]">
                  Negative / Mixed
                </span>
              </div>
              <p className="text-[11px] text-[#686058] mt-1">
                Dissatisfaction flagged on fulfillment
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5]">
              <span className="text-[11px] font-semibold text-[#9E948A] uppercase tracking-wider block mb-1">
                Detected Topics
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#fff0f2] text-[#F62440] border border-[#F62440]/20">
                  Delivery
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700">
                  Product
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5]">
              <span className="text-[11px] font-semibold text-[#9E948A] uppercase tracking-wider block mb-1">
                Action Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FFE5BF]/30 text-amber-900 border border-[#FFE5BF]">
                  Open for follow-up
                </span>
              </div>
            </div>
          </div>

          {/* Insight Banner */}
          <div className="p-4 rounded-xl bg-[#FFF2DB]/60 border border-[#FFE5BF] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#141210] uppercase tracking-wider block">
                Recoz Intelligence Insight
              </span>
              <p className="text-xs sm:text-sm text-[#141210] mt-0.5">
                Customer is highly satisfied with physical product build, but unhappy with courier transit times. Recommend expediting replacement and logging courier SLA ticket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
