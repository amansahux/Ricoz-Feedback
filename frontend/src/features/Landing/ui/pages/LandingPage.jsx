import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../../auth/hook/useAuth.jsx";
import LandingNavbar from "../components/LandingNavbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ValuePillars from "../components/ValuePillars.jsx";
import ProblemComparison from "../components/ProblemComparison.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import ProductShowcase from "../components/ProductShowcase.jsx";
import ResponseAnalysis from "../components/ResponseAnalysis.jsx";
import ClosedLoopSection from "../components/ClosedLoopSection.jsx";
import MultiChannelSection from "../components/MultiChannelSection.jsx";
import AnalyticsSection from "../components/AnalyticsSection.jsx";
import UseCasesSection from "../components/UseCasesSection.jsx";
import CtaSection from "../components/CtaSection.jsx";
import LandingFooter from "../components/LandingFooter.jsx";

const LandingPage = () => {
  const { isAuthenticated, isHydrating } = useAuth();

  // If user is logged in, redirect directly to /dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // During auth hydration, avoid layout flashing if user already has an active session
  if (isHydrating) {
    return (
      <div className="min-h-screen bg-[#FFFAF3] flex flex-col items-center justify-center text-[#141210]">
        <div className="w-10 h-10 border-4 border-[#F62440]/20 border-t-[#F62440] rounded-full animate-spin mb-4" />
        <p className="text-[#686058] text-sm animate-pulse font-medium">
          Loading Recoz Feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF3] text-[#141210] selection:bg-[#fee2e5] selection:text-[#F62440]">
      {/* 1. Navigation Bar */}
      <LandingNavbar isAuthenticated={isAuthenticated} />

      {/* 2. Hero Section with Interactive Workspace Preview */}
      <HeroSection isAuthenticated={isAuthenticated} />

      {/* 3. 4 Value Pillars */}
      <ValuePillars />

      {/* 4. Problem & Solution Comparison */}
      <ProblemComparison />

      {/* 5. 4-Stage How It Works Flow */}
      <HowItWorks isAuthenticated={isAuthenticated} />

      {/* 6. Unified Feedback Intelligence & Inbox Showcase */}
      <ProductShowcase />

      {/* 7. Response Analysis & NLP Sentiment Extraction */}
      <ResponseAnalysis />

      {/* 8. Closed-Loop Operational Resolution */}
      <ClosedLoopSection />

      {/* 9. Multi-Channel Touchpoints (Link, QR, Widget) */}
      <MultiChannelSection />

      {/* 10. Analytics Command Center */}
      <AnalyticsSection />

      {/* 11. Industry Use Cases */}
      <UseCasesSection />

      {/* 12. Final High-Impact Conversion CTA */}
      <CtaSection isAuthenticated={isAuthenticated} />

      {/* 13. Footer */}
      <LandingFooter isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default LandingPage;