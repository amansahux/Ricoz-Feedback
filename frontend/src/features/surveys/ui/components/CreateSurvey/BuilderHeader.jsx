import React from "react";
import { Link } from "react-router";
import { Save, Rocket, ArrowLeft } from "lucide-react";

export default function BuilderHeader({
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  lastSavedAt,
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFAF3]/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-[#EFE4D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mx-5 sm:-mx-7 lg:-mx-8  mb-6">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Link
            to="/surveys"
            className="text-xs text-[#7d7461] hover:text-[#bb0028] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Surveys</span>
          </Link>
          <span className="text-[#d1c5b0]">•</span>
          <span className="text-[11px] uppercase tracking-widest text-[#bb0028] font-bold font-mono-tag">
            Survey Builder
          </span>
          <span className="text-[#d1c5b0]">•</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF2DB] text-[#746243] text-[11px] font-medium border border-[#E6D7C3]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {lastSavedAt ? `Auto-saved ${lastSavedAt}` : "Draft • Live Sync"}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18] tracking-tight mt-0.5">
          Survey builder
        </h1>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSaveDraft}
          disabled={isSaving || isPublishing}
          className="px-4 py-2 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-xs sm:text-sm font-medium flex items-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save size={16} className="text-[#7d7461]" />
          <span>{isSaving ? "Saving..." : "Save draft"}</span>
        </button>

        <button
          onClick={onPublish}
          disabled={isSaving || isPublishing}
          className="px-5 py-2 rounded-xl bg-[#e61337] hover:bg-[#bb0028] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm shadow-[#e61337]/25 transition cursor-pointer disabled:opacity-50"
        >
          <Rocket size={16} />
          <span>{isPublishing ? "Publishing..." : "Publish"}</span>
        </button>
      </div>
    </header>
  );
}
