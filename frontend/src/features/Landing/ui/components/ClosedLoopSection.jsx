import React from "react";
import { ChevronRight } from "lucide-react";

export default function ClosedLoopSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FFFAF3] border-t border-[#E8DFD5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
            Close The Loop
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#141210] tracking-tight mb-5">
            Don’t just collect feedback.<br />Do something with it.
          </h2>
          <p className="text-base sm:text-lg text-[#686058] leading-relaxed">
            The true value of customer feedback is what happens next. Recoz equips your team with an operational resolution workflow to turn dissatisfied buyers into loyal advocates.
          </p>
        </div>

        {/* Closed-Loop Card Preview */}
        <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-xl p-6 sm:p-10 max-w-4xl mx-auto">
          {/* Workflow Stepper */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E8DFD5]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#F62440] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <div>
                <p className="text-xs font-semibold text-[#141210]">Feedback Logged</p>
                <p className="text-[11px] text-[#9E948A]">Status: Open</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#E8DFD5] hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FFE5BF] text-amber-950 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <div>
                <p className="text-xs font-semibold text-[#141210]">Investigate & Note</p>
                <p className="text-[11px] text-[#9E948A]">Status: In Progress</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#E8DFD5] hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <div>
                <p className="text-xs font-semibold text-[#141210]">Customer Follow-up</p>
                <p className="text-[11px] text-[#9E948A]">Direct Resolution</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#E8DFD5] hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-emerald-800">Loop Closed</p>
                <p className="text-[11px] text-[#9E948A]">Status: Resolved</p>
              </div>
            </div>
          </div>

          {/* Feedback Detail Mockup Card */}
          <div className="bg-[#FFFAF3] rounded-xl border border-[#E8DFD5] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-base text-[#141210]">
                    Ticket #FB-7910 — Delivery Delay
                  </h4>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Resolved
                  </span>
                </div>
                <p className="text-xs text-[#686058] mt-1">
                  Customer: Aman Sahu (amansahu@enterprise.io)
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-[#9E948A]">Turnaround Time</span>
                <p className="font-heading font-semibold text-sm text-[#141210]">
                  3 hours 40 mins
                </p>
              </div>
            </div>

            {/* Internal Audit Trail / Follow-up Note */}
            <div className="p-4 rounded-lg bg-white border border-[#E8DFD5] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9E948A] border-b border-[#E8DFD5]/50 pb-2">
                <span className="font-semibold text-[#141210]">Team Resolution Log</span>
                <span>Sep 15, 2026 · 14:22</span>
              </div>
              <p className="text-xs sm:text-sm text-[#141210] leading-relaxed">
                “Contacted Aman via priority phone. Clarified courier delay, issued a 20% courtesy credit, and resent replacement items via overnight express. Customer confirmed satisfaction with resolution.”
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#686058]">
                <span className="font-semibold text-[#F62440]">Actioned by:</span>
                <span>Enterprise Support Lead</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Customer Sentiment shifted to Positive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
