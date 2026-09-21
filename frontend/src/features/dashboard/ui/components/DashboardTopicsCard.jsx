import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

export default function DashboardTopicsCard({
  topics = [],
  onTriggerAction,
}) {
  const defaultColors = ["bg-[#bb0028]", "bg-[#6e5c3e]", "bg-[#926e6d]", "bg-[#dbc39f]"];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFE4D6] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base sm:text-lg font-epilogue font-semibold text-[#1f1b18]">
            Top topics
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono-tag font-bold text-[#6e5c3e] bg-[#FBF2EC] px-2 py-0.5 rounded-full border border-[#EFE4D6]">
            <Sparkles size={11} className="text-[#bb0028]" /> AI Categorized
          </span>
        </div>
        <p className="text-xs text-[#7d7461] font-inter mb-4">
          Core subject clusters detected in verbatim analysis
        </p>

        {/* Topic Distribution Progress Bars */}
        <div className="space-y-4">
          {topics.map((item, idx) => {
            const barColor = item.colorClass || defaultColors[idx % defaultColors.length];
            return (
              <div key={item.topic || idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-inter">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${barColor}`}></span>
                    <span className="font-semibold text-[#1f1b18]">{item.topic}</span>
                  </div>
                  <span className="font-bold text-[#1f1b18]">{item.percentage}%</span>
                </div>
                <div className="w-full bg-[#F6ECE7] h-2 rounded-full overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-[#EFE4D6]/70 mt-4 flex items-center justify-between">
        <span className="text-xs font-inter text-[#7d7461]">
          Total {topics.length} recurring drivers
        </span>
        <Link
          to="/analytics"
          className="text-xs font-inter text-[#bb0028] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          Topic Explorer <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
