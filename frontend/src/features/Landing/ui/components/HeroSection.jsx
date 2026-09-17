import React from "react";
import { Link } from "react-router";
import { ArrowRight, Star, Activity, CheckCircle2 } from "lucide-react";

export default function HeroSection({ isAuthenticated }) {
  const primaryHref = isAuthenticated ? "/dashboard" : "/register";
  const primaryText = isAuthenticated ? "Go to Dashboard" : "Create your workspace";
  const secondaryHref = isAuthenticated ? "/dashboard" : "/login";
  const secondaryText = isAuthenticated ? "Open Workspace" : "Sign in to Recoz";

  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-36 bg-grid-subtle overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-outline text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F62440] animate-pulse" />
          Customer Experience Intelligence
        </div>

        {/* Main Editorial Headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#141210] leading-[1.1] mb-6 max-w-4xl mx-auto">
          Turn customer feedback <br className="hidden sm:inline" />
          <span className="relative inline-block">
            into action.
            <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-[#FFE5BF] -z-10 rounded-full" />
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="text-lg sm:text-xl text-[#686058] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Collect customer feedback across every touchpoint, measure experience with NPS, CSAT, and CES, understand what customers are saying, and close the loop on issues that matter.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to={primaryHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-base font-semibold tracking-tight shadow-md hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5"
          >
            <span>{primaryText}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to={secondaryHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-[#F8F4EE] text-[#141210] border border-[#E8DFD5] text-base font-medium shadow-sm transition-all duration-150"
          >
            <span>{secondaryText}</span>
          </Link>
        </div>

        {/* Hero Product Visual Composition */}
        <div className="relative max-w-5xl mx-auto mt-6">
          {/* Background decorative backdrop */}
          <div className="absolute -inset-2 bg-gradient-to-b from-[#FFE5BF]/30 via-[#FFF2DB]/20 to-transparent rounded-3xl blur-xl -z-10" />

          {/* Main Application Workspace Surface Preview */}
          <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-2xl overflow-hidden text-left">
            {/* Mock Header Strip */}
            <div className="bg-[#F8F4EE]/70 px-6 py-4 border-b border-[#E8DFD5]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#E5D8CF]" />
                  <div className="w-3 h-3 rounded-full bg-[#E5D8CF]" />
                  <div className="w-3 h-3 rounded-full bg-[#E5D8CF]" />
                </div>
                <span className="text-xs font-mono text-[#9E948A] pl-2">recoz.io/app/overview</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Pipeline
                </span>
                <span className="text-xs text-[#9E948A]">Acme Workspace</span>
              </div>
            </div>

            {/* Inside Visual Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* 4 Top KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5]">
                  <p className="text-[11px] font-semibold tracking-wider text-[#686058] uppercase">Total Responses</p>
                  <p className="font-heading font-bold text-2xl text-[#141210] mt-1">2,481</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ 14% this month</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5]">
                  <p className="text-[11px] font-semibold tracking-wider text-[#686058] uppercase">Net Promoter Score</p>
                  <p className="font-heading font-bold text-2xl text-[#F62440] mt-1">+48</p>
                  <p className="text-[11px] text-[#686058] mt-1">64% Promoters</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5]">
                  <p className="text-[11px] font-semibold tracking-wider text-[#686058] uppercase">CSAT Score</p>
                  <p className="font-heading font-bold text-2xl text-[#141210] mt-1">87%</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">4.4 avg star rating</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFAF3] border border-[#E8DFD5]">
                  <p className="text-[11px] font-semibold tracking-wider text-[#686058] uppercase">Effort Score (CES)</p>
                  <p className="font-heading font-bold text-2xl text-[#141210] mt-1">6.2 <span className="text-xs font-normal text-[#686058]">/ 7</span></p>
                  <p className="text-[11px] text-[#686058] mt-1">Low customer friction</p>
                </div>
              </div>

              {/* Workflow in Action: Feedback Item with Closed-Loop Flow */}
              <div className="rounded-xl border border-[#E8DFD5]/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#686058]">Incoming Feedback Signal</span>
                    <span className="text-xs text-[#9E948A]">· Just now</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FFE5BF]/30 text-amber-900 border border-[#FFE5BF]">
                    <Activity className="w-3 h-3 text-[#F62440]" /> Real-time Processing
                  </span>
                </div>

                {/* Main Feedback Row with Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#FFFAF3] rounded-lg p-4 border border-[#E8DFD5]">
                  {/* Customer Column */}
                  <div className="lg:col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFE5BF]/60 flex items-center justify-center font-heading font-semibold text-sm text-[#141210] shrink-0">
                      RS
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#141210]">Rahul Sharma</h4>
                      <p className="text-xs text-[#9E948A]">Post-Purchase Survey</p>
                    </div>
                  </div>

                  {/* Rating & Sentiment */}
                  <div className="lg:col-span-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#E8DFD5] text-xs font-semibold text-[#141210]">
                      <span>2 / 5</span>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-[#F62440] border border-red-200/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F62440]" />
                      Negative
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-[#686058] border border-[#E8DFD5]">
                      Delivery
                    </span>
                  </div>

                  {/* Response Quote */}
                  <div className="lg:col-span-4">
                    <p className="text-xs text-[#141210] italic font-normal line-clamp-1">
                      “Product quality was fine, but delivery took 9 days without tracking updates.”
                    </p>
                  </div>

                  {/* Closed Loop Status Action */}
                  <div className="lg:col-span-2 flex justify-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolved
                    </span>
                  </div>
                </div>

                {/* Visual Transformation Micro-Indicator */}
                <div className="mt-4 pt-3 border-t border-[#E8DFD5]/50 flex flex-wrap items-center justify-between text-xs text-[#686058] gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-[#F62440]" />
                    <span className="font-medium text-[#141210]">Workflow:</span>
                    <span>Captured via Link</span>
                    <span>→</span>
                    <span className="text-[#F62440] font-medium">Topic: Delivery</span>
                    <span>→</span>
                    <span>Note: “Called customer &amp; dispatched replacement”</span>
                    <span>→</span>
                    <span className="text-emerald-700 font-semibold">Closed Loop ✓</span>
                  </div>
                  <span className="text-[11px] text-[#9E948A] font-mono">ID: FB-8842</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
