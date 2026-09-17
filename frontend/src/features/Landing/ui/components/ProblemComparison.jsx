import React from "react";
import { FileSpreadsheet, HelpCircle, MailWarning, CheckCircle } from "lucide-react";

export default function ProblemComparison() {
  return (
    <section id="product" className="py-24 md:py-32 bg-[#FFFAF3]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
            The Feedback Problem
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#141210] tracking-tight mb-5">
            Feedback is everywhere.<br />Action shouldn’t be.
          </h2>
          <p className="text-base sm:text-lg text-[#686058] leading-relaxed">
            Customer feedback gets scattered across ad-hoc Google Forms, unorganized spreadsheets, random support chats, and buried emails. Recoz consolidates those signals into one clear, actionable operational workflow.
          </p>
        </div>

        {/* Before vs After Comparison Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* BEFORE: Chaos */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E8DFD5] flex flex-col justify-between shadow-sm">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100 text-[#686058] text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                Before Recoz: Fragmented Noise
              </div>

              <h3 className="font-heading font-semibold text-xl text-[#141210] mb-4">
                Scattered responses that go nowhere
              </h3>

              <p className="text-sm text-[#686058] mb-6 leading-relaxed">
                Surveys get sent, responses get dumped into spreadsheets, and no one knows who followed up on the unhappy customer who rated a 2/5 yesterday.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-[#686058]">
                  <FileSpreadsheet className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Stale Google Sheets with 100+ unreviewed rows</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-[#686058]">
                  <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>No automated calculation for NPS or CSAT baselines</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-[#686058]">
                  <MailWarning className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Negative feedback forgotten until customer cancels contract</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8DFD5] text-xs text-stone-400 flex items-center justify-between">
              <span>Result: Unaddressed friction</span>
              <span className="text-red-500 font-medium">High customer churn</span>
            </div>
          </div>

          {/* AFTER: Recoz Clarity */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border-2 border-[#F62440]/40 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE5BF]/30 rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#fff0f2] text-[#F62440] text-xs font-semibold uppercase tracking-wider mb-6 border border-[#F62440]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F62440]" />
                With Recoz: The Feedback Loop
              </div>

              <h3 className="font-heading font-semibold text-xl text-[#141210] mb-4">
                Collect, understand, and resolve
              </h3>

              <p className="text-sm text-[#686058] mb-6 leading-relaxed">
                Every submission is immediately mapped to customer records, sentiment-analyzed, and routed directly into your action inbox.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] text-xs text-[#141210]">
                  <CheckCircle className="w-4 h-4 text-[#F62440] shrink-0" />
                  <span>Instant automated metrics: NPS +48, CSAT 87%, CES 6.2</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] text-xs text-[#141210]">
                  <CheckCircle className="w-4 h-4 text-[#F62440] shrink-0" />
                  <span>Automatic topic detection (Delivery, Product, Checkout)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5] text-xs text-[#141210]">
                  <CheckCircle className="w-4 h-4 text-[#F62440] shrink-0" />
                  <span>Built-in closed-loop tracking: Open → In Progress → Resolved</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8DFD5] text-xs flex items-center justify-between">
              <span className="text-[#686058]">Result: Zero dropped feedback</span>
              <span className="text-[#F62440] font-semibold">Continuous Retention</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
