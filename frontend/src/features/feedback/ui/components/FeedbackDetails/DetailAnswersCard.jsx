import React from "react";
import { Brain, Flag } from "lucide-react";
import { Stars, NpsBar } from "./DetailHelpers.jsx";

export default function DetailAnswersCard({ answers = [], surveyTitle, topics = [], sentiment = "neutral" }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_2px_8px_-2px_rgba(94,88,81,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EFE4D6]/60 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-epilogue font-semibold text-[#1f1b18]">
            Customer Answers
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0e6e1] text-[#1f1b18]">
            {answers.length} Questions Answered
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#7d7461] bg-[#FBF2EC] px-3 py-1.5 rounded-lg border border-[#EFE4D6] font-inter">
          Origin:{" "}
          <strong className="text-[#1f1b18] font-medium">{surveyTitle}</strong>
        </div>
      </div>

      {/* Answers list */}
      <div className="flex flex-col divide-y divide-[#EFE4D6]/50">
        {answers.map((answer, idx) => (
          <div
            key={answer.questionId || idx}
            className="py-6 flex flex-col gap-2.5"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
              QUESTION {idx + 1}
            </span>
            <h3 className="text-sm sm:text-base font-medium text-[#1f1b18] font-inter">
              {answer.questionText || "Question"}
            </h3>

            {/* Render based on answer type */}
            {answer.type === "rating" && (
              <div className="mt-1 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6] text-lg font-epilogue font-semibold text-[#1f1b18]">
                  <span>{answer.value} / 5</span>
                  <Stars rating={answer.value} max={5} size={16} />
                </div>
                <span className="text-xs text-[#7d7461] font-inter">
                  Rating Scale: 1 (Poor) to 5 (Excellent)
                </span>
              </div>
            )}

            {answer.type === "nps" && (
              <div className="mt-1 flex items-center gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6]">
                  <span className="text-lg font-epilogue font-bold text-[#1f1b18]">
                    {answer.value}
                  </span>
                  <span className="text-xs text-[#7d7461] font-inter">
                    / 10 (Score: {answer.value})
                  </span>
                </div>
                <NpsBar score={answer.value} />
              </div>
            )}

            {(answer.type === "textarea" || answer.type === "text") && (
              <div className="mt-1 p-5 rounded-xl bg-[#fff8f5] border-l-4 border-[#bb0028] border-t border-r border-b border-[#EFE4D6] shadow-xs">
                <p className="text-sm sm:text-base text-[#1f1b18] italic leading-relaxed font-inter">
                  "{answer.value}"
                </p>
              </div>
            )}

            {/* Default fallback */}
            {!["rating", "nps", "textarea", "text"].includes(answer.type) && (
              <div className="mt-1 px-3 py-2 rounded-lg bg-[#FBF2EC] border border-[#EFE4D6] text-sm text-[#1f1b18] font-inter">
                {String(answer.value)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom: Topics & Sentiment Intel */}
      {topics.length > 0 && (
        <div className="mt-4 pt-6 border-t border-[#EFE4D6]/50 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-[#bb0028]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#926e6d] font-inter">
              DETECTED TOPICS & SENTIMENT INTEL
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {topics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#f6ece7] text-[#1f1b18] border border-[#EFE4D6]"
              >
                {topic}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-2 text-xs text-[#7d7461] bg-[#FBF2EC]/70 p-3 rounded-lg border border-[#EFE4D6] mt-1">
            <Flag size={14} className="text-[#bb0028] mt-0.5 shrink-0" />
            <span>
              <strong>AI Key Insight:</strong> Detected {sentiment} sentiment
              across {topics.length} topic{topics.length > 1 ? "s" : ""}. Review
              customer verbatim for operational action items.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
