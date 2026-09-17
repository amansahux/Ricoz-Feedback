import React, { useState } from "react";

export default function AnalyticsSection() {
  const [range, setRange] = useState("30d");

  return (
    <section className="py-24 md:py-32 bg-[#FFFAF3] border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
            Analytics Command Center
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#141210] tracking-tight mb-5">
            From hundreds of responses<br />to a clearer picture.
          </h2>
          <p className="text-base sm:text-lg text-[#686058] leading-relaxed">
            Monitor your customer experience health in real time without drowning in enterprise BI complexity.
          </p>
        </div>

        {/* High-fidelity analytics preview */}
        <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xl p-6 sm:p-10 space-y-8">
          {/* Header with Segmented Date Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD5]">
            <div>
              <h4 className="font-heading font-bold text-xl text-[#141210]">
                Insights & Trends
              </h4>
              <p className="text-xs text-[#686058]">
                Aggregated performance across {range === "7d" ? "7" : range === "30d" ? "30" : "90"} days
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-[#E8DFD5] bg-[#FFFAF3] p-1 text-xs font-medium text-[#686058]">
              {["7d", "30d", "90d"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRange(tab)}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    range === tab
                      ? "bg-white font-semibold text-[#F62440] shadow-sm"
                      : "text-[#686058] hover:text-[#141210]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 2 Column Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: NPS Breakdown */}
            <div className="p-6 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-[#141210]">NPS Breakdown</h5>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  +48 Score
                </span>
              </div>

              {/* Horizontal stacked bar */}
              <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full transition-all duration-500"
                  style={{ width: "64%" }}
                  title="Promoters: 64%"
                />
                <div
                  className="bg-[#FFE5BF] h-full transition-all duration-500"
                  style={{ width: "20%" }}
                  title="Passives: 20%"
                />
                <div
                  className="bg-[#F62440] h-full transition-all duration-500"
                  style={{ width: "16%" }}
                  title="Detractors: 16%"
                />
              </div>

              <div className="grid grid-cols-3 text-xs pt-2">
                <div>
                  <span className="text-[#9E948A] block">Promoters (9-10)</span>
                  <span className="font-semibold text-[#141210]">64%</span>
                </div>
                <div>
                  <span className="text-[#9E948A] block">Passives (7-8)</span>
                  <span className="font-semibold text-[#141210]">20%</span>
                </div>
                <div>
                  <span className="text-[#9E948A] block">Detractors (0-6)</span>
                  <span className="font-semibold text-[#F62440]">16%</span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#9E948A] pt-2 border-t border-[#E8DFD5]/60">
                Formula: Promoters (64%) - Detractors (16%) = +48 NPS
              </p>
            </div>

            {/* Column 2: Top Topics Frequency */}
            <div className="p-6 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold text-[#141210]">Top Discussion Topics</h5>
                <span className="text-xs text-[#9E948A]">Frequency</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-[#141210]">Delivery & Courier</span>
                    <span className="font-semibold text-[#141210]">32%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-[#F62440] h-full rounded-full" style={{ width: "32%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-[#141210]">Support & Service</span>
                    <span className="font-semibold text-[#141210]">24%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-[#FFE5BF] h-full rounded-full" style={{ width: "24%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-[#141210]">Product Usability</span>
                    <span className="font-semibold text-[#141210]">18%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-stone-400 h-full rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
