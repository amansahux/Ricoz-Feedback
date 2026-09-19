import React from "react";
import { Link } from "react-router";
import { Inbox, Plus, Sparkles } from "lucide-react";

export default function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FBF2EC] to-[#EFE4D6] flex items-center justify-center shadow-sm border border-[#EFE4D6]">
          <Inbox size={36} className="text-[#7d7461]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#bb0028] flex items-center justify-center shadow-sm">
          <Sparkles size={12} className="text-white" />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-2 tracking-tight">
        No feedback yet
      </h2>
      <p className="text-sm text-[#7d7461] font-inter max-w-md mb-8 leading-relaxed">
        Once customers submit responses to your surveys, they'll appear here in
        your unified feedback inbox. Create a survey to start collecting
        actionable insights.
      </p>

      {/* CTA */}
      <Link
        to="/surveys/create"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
      >
        <Plus size={18} />
        <span>Create your first survey</span>
      </Link>
    </div>
  );
}
