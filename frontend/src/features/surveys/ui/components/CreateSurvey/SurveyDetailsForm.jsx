import React from "react";
import { ClipboardList } from "lucide-react";

export default function SurveyDetailsForm({
  title,
  setTitle,
  description,
  setDescription,
  hasError = false,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFE4D6] shadow-xs flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-[#EFE4D6]/60 pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={20} className="text-[#bb0028]" />
          <h2 className="text-base sm:text-lg font-epilogue font-semibold text-[#1f1b18]">
            Survey Details
          </h2>
        </div>
        <span className="text-xs text-[#7d7461] font-medium font-inter">
          Primary Settings
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Survey Title Input */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] mb-1.5 font-inter">
            Survey Title <span className="text-[#bb0028]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Customer Satisfaction Pulse"
            className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-[#1f1b18] font-inter focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] focus:outline-none transition ${
              hasError && !title.trim()
                ? "border-[#bb0028] ring-1 ring-[#bb0028]"
                : "border-[#EFE4D6]"
            }`}
          />
          {hasError && !title.trim() && (
            <span className="text-xs text-[#bb0028] mt-1 block">
              Please provide a survey title.
            </span>
          )}
        </div>

        {/* Survey Description Input */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] mb-1.5 font-inter">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell your customers what this feedback will be used for..."
            className="w-full p-3 rounded-xl border border-[#EFE4D6] bg-white text-sm text-[#1f1b18] font-inter focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] focus:outline-none transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}
