import React from "react";
import { Plus } from "lucide-react";

export default function QuestionTypeSelector({ onAddQuestion }) {
  const quickTypes = [
    { type: "rating", label: "Rating" },
    { type: "nps", label: "NPS" },
    { type: "csat", label: "CSAT" },
    { type: "ces", label: "CES" },
    { type: "text", label: "Short Text" },
    { type: "textarea", label: "Long Text" },
    { type: "multiple-choice", label: "Multiple Choice" },
    { type: "yes-no", label: "Yes / No" },
  ];

  return (
    <div className="p-6 rounded-2xl border-2 border-dashed border-[#EFE4D6] hover:border-[#bb0028]/50 bg-white/70 flex flex-col items-center justify-center gap-4 transition-all">
      <button
        onClick={() => onAddQuestion("csat")}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
      >
        <Plus size={18} />
        <span>+ Add new question</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
        <span className="text-xs text-[#7d7461] mr-1 font-inter">
          Quick insert:
        </span>
        {quickTypes.map((q) => (
          <button
            key={q.type}
            onClick={() => onAddQuestion(q.type)}
            className="px-2.5 py-1 rounded-full bg-white border border-[#EFE4D6] hover:border-[#bb0028] text-xs font-inter text-[#1f1b18] hover:text-[#bb0028] transition cursor-pointer shadow-2xs"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
