import React from "react";
import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";

export default function CtaSection({ isAuthenticated }) {
  const primaryHref = isAuthenticated ? "/dashboard" : "/register";
  const primaryText = isAuthenticated ? "Open Workspace" : "Create your workspace";
  const secondaryHref = isAuthenticated ? "/dashboard" : "/login";
  const secondaryText = isAuthenticated ? "Go to Dashboard" : "Sign in";

  return (
    <section className="py-24 md:py-32 bg-[#FFF2DB]/40 border-t border-[#E8DFD5] relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-grid-subtle opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-outline text-xs font-semibold tracking-wide uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F62440]" />
          Get Started In Minutes
        </div>

        <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#141210] tracking-tight mb-6">
          Your customers are already<br />telling you something.
        </h2>

        <p className="text-lg sm:text-xl text-[#686058] max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Give their feedback a place to become action. Create your workspace today and launch your first survey in minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to={primaryHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-base font-semibold tracking-tight shadow-md hover:shadow-lg transition-all duration-150 transform hover:-translate-y-0.5"
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

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#686058]">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> No credit card required
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> Free workspace creation
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" /> Instant setup
          </span>
        </div>
      </div>
    </section>
  );
}
