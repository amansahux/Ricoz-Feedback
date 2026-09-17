import React from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function HowItWorks({ isAuthenticated }) {
  const steps = [
    {
      num: "01",
      title: "Create",
      tag: "Survey Builder",
      desc: "Build focused customer surveys in seconds with rating scales, sentiment fields, and custom branding.",
      route: "/surveys/create",
    },
    {
      num: "02",
      title: "Collect",
      tag: "Multi-Channel",
      desc: "Distribute via clean public URLs, high-res printable QR codes on packaging, or embedded website widgets.",
      route: "/surveys/publish",
    },
    {
      num: "03",
      title: "Understand",
      tag: "Analytics & NLP",
      desc: "Measure NPS, CSAT, and CES. Recoz automatically identifies sentiment drivers and recurring topics.",
      route: "/analytics",
    },
    {
      num: "04",
      title: "Act",
      tag: "Closed Loop",
      desc: "Assign responses, log team follow-ups, reply to customers, and mark tickets definitively resolved.",
      route: "/feedback",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#F62440] block mb-3">
            How It Works
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-5xl text-[#141210] tracking-tight mb-5">
            From response to resolution.
          </h2>
          <p className="text-base sm:text-lg text-[#686058]">
            A calm, dependable four-stage architecture engineered for modern business owners and product leaders.
          </p>
        </div>

        {/* 4 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-[#FFFAF3] border border-[#E8DFD5] hover:border-[#F62440]/40 transition-colors duration-150 relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD5] flex items-center justify-center font-heading font-bold text-sm text-[#F62440] shadow-sm mb-5 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#141210] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs uppercase font-semibold text-[#9E948A] tracking-wider mb-3">
                  {step.tag}
                </p>
                <p className="text-sm text-[#686058] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DFD5]/60 text-xs font-mono text-[#9E948A]">
                {step.route}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Banner CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-[#FFF2DB]/40 border border-[#FFE5BF] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-heading font-semibold text-lg text-[#141210]">
              Ready to try the four-step loop?
            </h4>
            <p className="text-sm text-[#686058] mt-1">
              Set up your workspace in 60 seconds with no credit card required.
            </p>
          </div>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-sm font-semibold tracking-tight shadow-sm shrink-0 transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAuthenticated ? "Go to Dashboard" : "Create workspace"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
