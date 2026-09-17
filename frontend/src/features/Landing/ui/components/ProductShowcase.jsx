import React from "react";

export default function ProductShowcase() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#FFFAF3] border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Realistic UI Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xl p-6 sm:p-8 space-y-6">
              {/* Mock Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
                <div>
                  <span className="text-[11px] font-semibold tracking-widest text-[#F62440] uppercase">
                    Customer Feedback Inbox
                  </span>
                  <h4 className="font-heading font-bold text-xl text-[#141210]">
                    Operational Signals
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-[#FFFAF3] border border-[#E8DFD5] text-[#686058]">
                    Filter: Open
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-[#FFFAF3] border border-[#E8DFD5] text-[#686058]">
                    Sort: Newest
                  </span>
                </div>
              </div>

              {/* Feedback Item 1 */}
              <div className="p-4 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#FFE5BF]/80 text-[#141210] flex items-center justify-center font-bold text-xs">
                      AS
                    </span>
                    <span className="text-xs font-semibold text-[#141210]">Aman Sahu</span>
                    <span className="text-xs text-[#9E948A]">· Sep 15, 2026</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-[#F62440] border border-red-200">
                    Open Issue
                  </span>
                </div>
                <p className="text-xs text-[#141210] italic">
                  “Checkout was simple, but delivery was delayed by 4 days.”
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#686058] pt-1">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#E8DFD5] font-medium">
                    Rating: 3/5
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-[#E8DFD5] font-medium text-[#F62440]">
                    Topic: Delivery
                  </span>
                  <span className="text-[#9E948A]">Assigned to: Support Lead</span>
                </div>
              </div>

              {/* Feedback Item 2 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8DFD5] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-stone-100 text-[#141210] flex items-center justify-center font-bold text-xs">
                      EL
                    </span>
                    <span className="text-xs font-semibold text-[#141210]">Elena Lewis</span>
                    <span className="text-xs text-[#9E948A]">· Sep 14, 2026</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Resolved
                  </span>
                </div>
                <p className="text-xs text-[#141210] italic">
                  “The new onboarding wizard answered all our team’s questions immediately.”
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#686058] pt-1">
                  <span className="bg-[#FFFAF3] px-2 py-0.5 rounded border border-[#E8DFD5] font-medium">
                    Rating: 5/5
                  </span>
                  <span className="bg-[#FFFAF3] px-2 py-0.5 rounded border border-[#E8DFD5] font-medium text-emerald-700">
                    Sentiment: Positive
                  </span>
                  <span className="bg-[#FFFAF3] px-2 py-0.5 rounded border border-[#E8DFD5] font-medium">
                    Topic: Onboarding
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Explanation */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block">
              Unified Intelligence
            </span>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#141210] tracking-tight leading-tight">
              See what your customers are really saying.
            </h2>

            <p className="text-base text-[#686058] leading-relaxed">
              Recoz turns isolated data points into a high-resolution view of customer sentiment, friction points, and retention indicators.
            </p>

            {/* Core Feature Rows */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] font-bold text-xs shrink-0">
                  NPS
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-recoz-ink text-[#141210]">
                    Understand Brand Loyalty
                  </h4>
                  <p className="text-xs text-[#686058] mt-0.5">
                    Track promoters and detractors with automated calculation formulas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] font-bold text-xs shrink-0">
                  CSAT
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#141210]">
                    Track Real Satisfaction
                  </h4>
                  <p className="text-xs text-[#686058] mt-0.5">
                    Benchmark satisfaction rates across post-purchase and support flows.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] font-bold text-xs shrink-0">
                  CES
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#141210]">
                    Measure Customer Effort
                  </h4>
                  <p className="text-xs text-[#686058] mt-0.5">
                    Pinpoint touchpoints that feel cumbersome or create unexpected friction.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#FFE5BF]/40 border border-[#FFE5BF] flex items-center justify-center text-[#F62440] font-bold text-xs shrink-0">
                  TXT
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#141210]">
                    Response Sentiment & Topics
                  </h4>
                  <p className="text-xs text-[#686058] mt-0.5">
                    Automatically classify feedback into topics like Delivery, Pricing, and Product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
