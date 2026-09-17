import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";

export default function LandingNavbar({ isAuthenticated }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFFAF3]/90 border-b border-[#E8DFD5]/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#F62440] rounded-lg p-1 shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F62440] flex items-center justify-center text-white font-heading font-bold text-base sm:text-xl shadow-sm transition-transform duration-200 group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-[#141210]">
                RECOZ
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-[#FFE5BF]/60 text-[#141210] border border-[#FFE5BF]">
                Feedback
              </span>
            </div>
            <span className="hidden xs:inline-block text-[10px] sm:text-[11px] font-medium text-[#9E948A] tracking-wider uppercase">
              Experience Platform
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#686058]">
          <a
            href="#product"
            className="hover:text-[#141210] transition-colors duration-150"
          >
            Product
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#141210] transition-colors duration-150"
          >
            How it works
          </a>
          <a
            href="#features"
            className="hover:text-[#141210] transition-colors duration-150"
          >
            Features
          </a>
          <a
            href="#multi-channel"
            className="hover:text-[#141210] transition-colors duration-150"
          >
            Channels
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-sm transition-all duration-150 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F62440]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-[#141210] hover:text-[#F62440] px-2 sm:px-3 py-1.5 sm:py-2 transition-colors duration-150 hidden sm:inline-flex"
              >
                Sign in
              </Link>
              {/* Only show 'Create workspace' on tablet and desktop screens (md+), hidden on mobile */}
              <Link
                to="/register"
                className="hidden md:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-sm transition-all duration-150 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F62440] focus:ring-offset-2"
              >
                <span>Create workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#686058] hover:text-[#141210] hover:bg-[#F8F4EE] transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DFD5] bg-[#FFFAF3] px-6 py-5 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-[#686058] hover:text-[#141210] transition-colors"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-[#686058] hover:text-[#141210] transition-colors"
            >
              How it works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-[#686058] hover:text-[#141210] transition-colors"
            >
              Features
            </a>
            <a
              href="#multi-channel"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-medium text-[#686058] hover:text-[#141210] transition-colors"
            >
              Channels
            </a>
          </nav>

          <div className="pt-3 border-t border-[#E8DFD5] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-sm font-semibold tracking-tight shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F62440] hover:bg-[#d91833] text-white text-sm font-semibold tracking-tight shadow-sm"
                >
                  <span>Create workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-white hover:bg-[#F8F4EE] text-[#141210] border border-[#E8DFD5] text-sm font-medium shadow-sm transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

