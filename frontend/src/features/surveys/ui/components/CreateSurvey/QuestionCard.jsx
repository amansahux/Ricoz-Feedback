import React from "react";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Plus,
  X,
  Smile,
  Gauge,
  CheckSquare,
  FileText,
  Star,
  Zap,
} from "lucide-react";

export default function QuestionCard({
  question,
  index,
  totalQuestions,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) {
  const qNum = String(index + 1).padStart(2, "0");

  const handlePromptChange = (val) => {
    onUpdate({ ...question, question: val });
  };

  const handleTypeChange = (newType) => {
    let updated = { ...question, type: newType };
    if (newType === "multiple-choice" && (!question.options || question.options.length === 0)) {
      updated.options = ["Product Quality", "Pricing & Value", "Fast Shipping", "Customer Service"];
    } else if (newType === "yes-no" && (!question.options || question.options.length === 0)) {
      updated.options = ["Yes", "No"];
    }
    onUpdate(updated);
  };

  const handleRequiredToggle = (checked) => {
    onUpdate({ ...question, required: checked });
  };

  const handleOptionChange = (optIdx, val) => {
    const nextOptions = [...(question.options || [])];
    nextOptions[optIdx] = val;
    onUpdate({ ...question, options: nextOptions });
  };

  const handleAddOption = () => {
    const nextOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    onUpdate({ ...question, options: nextOptions });
  };

  const handleRemoveOption = (optIdx) => {
    const nextOptions = (question.options || []).filter((_, i) => i !== optIdx);
    onUpdate({ ...question, options: nextOptions });
  };

  // Render type label with badge icon
  const renderTypeSelector = () => {
    const types = [
      { key: "csat", label: "CSAT (1–5)", icon: Smile },
      { key: "nps", label: "NPS (0–10)", icon: Gauge },
      { key: "rating", label: "Rating (1–5 Stars)", icon: Star },
      { key: "ces", label: "CES (Effort Score)", icon: Zap },
      { key: "multiple-choice", label: "Multiple Choice", icon: CheckSquare },
      { key: "textarea", label: "Long Text", icon: FileText },
      { key: "text", label: "Short Text", icon: FileText },
      { key: "yes-no", label: "Yes / No", icon: CheckSquare },
    ];

    return (
      <select
        value={question.type || "csat"}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="px-2.5 py-1 rounded-md bg-[#FFF2DB] border border-[#E6D7C3] text-[#1f1b18] text-xs font-medium cursor-pointer focus:outline-none focus:border-[#bb0028]"
      >
        {types.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFE4D6] shadow-xs hover:border-[#d1c5b0] transition-all">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-[#EFE4D6]/60 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FBF2EC] text-[#1f1b18] font-epilogue text-xs font-bold border border-[#EFE4D6]">
            {qNum}
          </span>
          {renderTypeSelector()}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-[#7d7461]">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
            className="p-1.5 rounded-lg hover:bg-[#FBF2EC] hover:text-[#1f1b18] transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalQuestions - 1}
            title="Move down"
            className="p-1.5 rounded-lg hover:bg-[#FBF2EC] hover:text-[#1f1b18] transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowDown size={16} />
          </button>
          <button
            onClick={onDuplicate}
            title="Duplicate question"
            className="p-1.5 rounded-lg hover:bg-[#FBF2EC] hover:text-[#1f1b18] transition cursor-pointer"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={onDelete}
            title="Delete question"
            className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-[#bb0028] transition cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Question Form Content */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] mb-1 font-inter">
            Question prompt
          </label>
          <input
            type="text"
            value={question.question || ""}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="Type your question prompt here..."
            className="w-full h-10 px-3.5 rounded-xl border border-[#EFE4D6] text-sm text-[#1f1b18] font-inter focus:border-[#bb0028] focus:outline-none"
          />
        </div>

        {/* Dynamic Type-specific visual scale representations */}
        {question.type === "csat" && (
          <div>
            <label className="block text-xs text-[#7d7461] mb-2 font-inter">
              Scale Format: 5-point sentiment emojis
            </label>
            <div className="p-3 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6] flex items-center justify-between overflow-x-auto gap-2">
              <span className="flex items-center gap-1.5 text-xs text-[#5d3f3e] font-medium whitespace-nowrap">
                <span className="text-xl">😡</span> 1 - Very Dissatisfied
              </span>
              <span className="flex items-center gap-1 text-xs text-[#5d3f3e] font-medium">
                <span className="text-xl">🙁</span> 2
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5d3f3e] font-medium whitespace-nowrap">
                <span className="text-xl">😐</span> 3 - Neutral
              </span>
              <span className="flex items-center gap-1 text-xs text-[#5d3f3e] font-medium">
                <span className="text-xl">🙂</span> 4
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5d3f3e] font-medium whitespace-nowrap">
                <span className="text-xl">😍</span> 5 - Very Satisfied
              </span>
            </div>
          </div>
        )}

        {question.type === "nps" && (
          <div className="p-3 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6]">
            <div className="flex justify-between text-xs text-[#7d7461] mb-2 font-inter">
              <span className="text-[#bb0028] font-semibold">0 = Not at all likely</span>
              <span>Neutral</span>
              <span className="text-emerald-700 font-semibold">10 = Extremely likely</span>
            </div>
            <div className="grid grid-cols-11 gap-1 text-center">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={num}
                  className={`py-1.5 rounded-lg bg-white border border-[#EFE4D6] text-xs font-bold ${
                    num <= 6
                      ? "text-[#bb0028]"
                      : num <= 8
                      ? "text-amber-700"
                      : "text-emerald-700"
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === "rating" && (
          <div className="p-3 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] flex items-center justify-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-2xl text-amber-400">
                ★
              </span>
            ))}
          </div>
        )}

        {question.type === "ces" && (
          <div className="p-3 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] flex items-center justify-between text-xs text-[#5d3f3e]">
            <span>1 - Very Difficult</span>
            <span>4 - Neutral</span>
            <span>7 - Very Easy</span>
          </div>
        )}

        {(question.type === "multiple-choice" || question.type === "yes-no") && (
          <div className="flex flex-col gap-2.5">
            <label className="block text-xs text-[#7d7461] font-inter">
              Choices ({question.type === "yes-no" ? "Binary choice" : "Single response"})
            </label>
            {(question.options || []).map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <span className="text-xs text-[#7d7461] font-mono w-4">
                  {optIdx + 1}.
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                  className="flex-1 h-9 px-3 rounded-xl border border-[#EFE4D6] text-xs sm:text-sm text-[#1f1b18] focus:border-[#bb0028] focus:outline-none bg-white font-inter"
                />
                {question.type === "multiple-choice" && (
                  <button
                    onClick={() => handleRemoveOption(optIdx)}
                    className="p-1.5 text-[#7d7461] hover:text-[#bb0028] transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {question.type === "multiple-choice" && (
              <button
                onClick={handleAddOption}
                className="self-start mt-1 flex items-center gap-1.5 text-xs text-[#bb0028] hover:text-[#a10022] font-semibold px-2 py-1 rounded transition cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add option</span>
              </button>
            )}
          </div>
        )}

        {(question.type === "text" || question.type === "textarea") && (
          <div>
            <label className="block text-xs text-[#7d7461] mb-1 font-inter">
              Placeholder preview
            </label>
            <input
              type="text"
              readOnly
              value="Tell us more about your thoughts..."
              className="w-full h-9 px-3 rounded-xl border border-[#EFE4D6] text-xs text-[#7d7461] bg-[#FBF2EC] focus:outline-none"
            />
          </div>
        )}

        {/* Footer Setting */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EFE4D6]/50 text-xs font-inter">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required || false}
              onChange={(e) => handleRequiredToggle(e.target.checked)}
              className="rounded border-[#d1c5b0] text-[#bb0028] focus:ring-[#bb0028] h-4 w-4"
            />
            <span className="text-[#1f1b18] font-medium">Required question</span>
          </label>
          <span className="text-[#7d7461] text-[11px]">
            Type: {question.type?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
