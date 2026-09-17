import React from "react";
import { Link } from "react-router";

export default function LandingFooter({ isAuthenticated }) {
  return (
    <footer className="bg-white border-t border-[#E8DFD5] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand Identity */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F62440] flex items-center justify-center text-white font-heading font-bold text-sm">
              R
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-[#141210] tracking-tight">
                RECOZ FEEDBACK
              </span>
              <p className="text-xs text-[#9E948A]">
                Feedback that turns into action.
              </p>
            </div>
          </Link>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-[#686058]">
            <a href="#product" className="hover:text-[#141210] transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-[#141210] transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-[#141210] transition-colors">
              Features
            </a>
            <a href="#multi-channel" className="hover:text-[#141210] transition-colors">
              Channels
            </a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-[#F62440] font-semibold hover:underline">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#141210] transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="text-[#F62440] font-semibold hover:underline">
                  Create workspace
                </Link>
              </>
            )}
          </div>

          {/* Right Copyright */}
          <div className="text-xs text-[#9E948A]">
            © 2026 Recoz Feedback. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
