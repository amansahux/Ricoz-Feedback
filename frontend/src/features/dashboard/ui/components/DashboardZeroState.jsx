import React from "react";
import { MessageSquare, Zap, Cpu, MailCheck } from "lucide-react";
import { Link } from "react-router";

export default function DashboardZeroState({ onTriggerAction, onSwitchLoaded }) {
  return (
    <div className="bg-white rounded-3xl border border-[#EFE4D6] p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xs my-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#F9DFB9]/60 text-[#bb0028] mx-auto flex items-center justify-center mb-6 shadow-inner">
        <MessageSquare size={38} className="text-[#bb0028]" />
      </div>

      <h2 className="text-xl sm:text-2xl font-epilogue font-bold text-[#1f1b18] mb-2 tracking-tight">
        No customer responses yet
      </h2>
      <p className="text-xs sm:text-sm text-[#5d3f3e] max-w-lg mx-auto mb-8 font-inter leading-relaxed">
        Your intelligence pipeline is configured and awaiting incoming verbatims. Launch your first survey link, in-app widget, or email embed to start collecting sentiment signals.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/surveys/create"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#bb0028] hover:bg-[#92001d] text-white font-inter text-xs sm:text-sm font-bold shadow-sm shadow-[#bb0028]/20 transition-all cursor-pointer"
        >
          + Create your first survey
        </Link>
        <button
          onClick={() => {
            if (onTriggerAction) onTriggerAction("Sample test telemetry ingested");
            if (onSwitchLoaded) onSwitchLoaded();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#EFE4D6] bg-white hover:bg-[#FBF2EC] text-[#1f1b18] font-inter text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          Ingest sample dataset
        </button>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-[#EFE4D6]/70 text-left">
        <div className="p-4 bg-[#FBF2EC] rounded-2xl border border-[#EFE4D6]/60">
          <Zap size={20} className="text-[#bb0028] mb-2" />
          <h4 className="text-xs font-epilogue font-bold text-[#1f1b18]">
            5-Minute Deployment
          </h4>
          <p className="text-[11px] font-inter text-[#7d7461] mt-1 leading-relaxed">
            Embed lightweight vanilla JS snippet into your app or send instant links.
          </p>
        </div>

        <div className="p-4 bg-[#FBF2EC] rounded-2xl border border-[#EFE4D6]/60">
          <Cpu size={20} className="text-[#bb0028] mb-2" />
          <h4 className="text-xs font-epilogue font-bold text-[#1f1b18]">
            Automated NLP
          </h4>
          <p className="text-[11px] font-inter text-[#7d7461] mt-1 leading-relaxed">
            Sentiment, intent, and driver clustering calculated automatically.
          </p>
        </div>

        <div className="p-4 bg-[#FBF2EC] rounded-2xl border border-[#EFE4D6]/60">
          <MailCheck size={20} className="text-[#bb0028] mb-2" />
          <h4 className="text-xs font-epilogue font-bold text-[#1f1b18]">
            Executive Digests
          </h4>
          <p className="text-[11px] font-inter text-[#7d7461] mt-1 leading-relaxed">
            Weekly summaries sent to Slack, Email, or webhook endpoints.
          </p>
        </div>
      </div>
    </div>
  );
}
