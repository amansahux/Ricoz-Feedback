import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

/**
 * Question Renderer: Renders question based on question type (rating, nps, csat, ces, multiple-choice, yes-no, text, textarea)
 */
export const QuestionRenderer = ({
  organization,
  question,
  index,
  value,
  onChange,
  error,
}) => {
  const { _id, type, question: titleText, required, options } = question;
  const qId = _id || `q_${index}`;
  const primaryColor = organization?.primaryColor || "#F62440";

  return (
    <fieldset
      id={`question-group-${qId}`}
      className={`transition-all duration-200 ${
        index > 0 ? "pt-6 border-t border-[#EFE4D6]" : ""
      }`}
    >
      {/* Label and Required indicator */}
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={`input-${qId}`}
          className="text-sm sm:text-base font-semibold text-[#1E1A17] flex items-center gap-1.5"
        >
          <span>
            {index + 1}. {titleText}
          </span>
          {required && (
            <span style={{ color: primaryColor }} className="font-bold" title="Required">
              *
            </span>
          )}
        </label>
      </div>

      {/* Render Specific Input according to question type */}
      {renderControlByType(type, qId, value, onChange, options, primaryColor)}

      {/* Inline Validation Error */}
      {error && (
        <p
          id={`error-${qId}`}
          className="text-xs text-[#BA1A1A] font-medium mt-2 flex items-center gap-1.5 animate-fadeIn"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
};

const renderControlByType = (type, qId, value, onChange, options = [], primaryColor = "#F62440") => {
  switch (type) {
    // 1. CSAT / Rating (1 to 5 scale)
    case "csat":
    case "rating":
      return (
        <div className="mt-2">
          <p className="text-xs text-[#5E5851] mb-2.5">
            Reflecting on your overall satisfaction and experience.
          </p>
          <div
            aria-label="CSAT Satisfaction rating from 1 to 5"
            className="grid grid-cols-5 gap-2 sm:gap-2.5"
            role="radiogroup"
          >
            {[1, 2, 3, 4, 5].map((score) => {
              const isSelected = Number(value) === score;
              return (
                <label
                  key={score}
                  style={
                    isSelected
                      ? {
                          borderColor: primaryColor,
                          boxShadow: `0 0 0 1px ${primaryColor}`,
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor,
                        }
                      : {}
                  }
                  className={`relative flex flex-col items-center justify-center min-h-[50px] p-2 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? "shadow-xs font-bold"
                      : "border-[#E8DFD5] bg-[#FFFFFF] hover:border-[#DAC1A2] hover:bg-[#FFF2DB]/40 text-[#1E1A17]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${qId}`}
                    className="sr-only"
                    value={score}
                    checked={isSelected}
                    onChange={() => onChange(score)}
                  />
                  <span className="text-lg font-semibold">{score}</span>
                  {score === 1 && (
                    <span className="text-[10px] text-[#8C847B] font-medium mt-0.5 sm:hidden">
                      Poor
                    </span>
                  )}
                  {score === 5 && (
                    <span className="text-[10px] text-[#8C847B] font-medium mt-0.5 sm:hidden">
                      Best
                    </span>
                  )}
                </label>
              );
            })}
          </div>
          <div className="flex justify-between items-center px-1 mt-2 text-xs text-[#8C847B]">
            <span>Very dissatisfied</span>
            <span className="hidden sm:inline text-center text-[#5E5851] font-medium">
              Neutral
            </span>
            <span>Very satisfied</span>
          </div>
        </div>
      );

    // 2. NPS (0 to 10 scale)
    case "nps":
      return (
        <div className="mt-2">
          <p className="text-xs text-[#5E5851] mb-2.5">
            On a scale from 0 (Not at all likely) to 10 (Extremely likely).
          </p>
          <div
            aria-label="NPS Score 0 to 10"
            className="grid grid-cols-6 sm:grid-cols-11 gap-1.5"
            role="radiogroup"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
              const isSelected =
                value !== undefined &&
                value !== null &&
                value !== "" &&
                Number(value) === score;
              return (
                <label
                  key={score}
                  style={
                    isSelected
                      ? {
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                          color: "#FFFFFF",
                        }
                      : {}
                  }
                  className={`flex flex-col items-center justify-center h-11 rounded-lg border cursor-pointer transition-all duration-150 select-none ${
                    score === 10 ? "col-span-2 sm:col-span-1" : ""
                  } ${
                    isSelected
                      ? "shadow-sm font-bold scale-[1.03]"
                      : "border-[#E8DFD5] bg-[#FFFFFF] hover:border-[#DAC1A2] hover:bg-[#FFF2DB]/40 text-[#1E1A17] font-semibold"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${qId}`}
                    className="sr-only"
                    value={score}
                    checked={isSelected}
                    onChange={() => onChange(score)}
                  />
                  <span className="text-sm font-semibold">{score}</span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-between items-center px-1 mt-2 text-xs text-[#8C847B]">
            <span>0 = Not at all likely</span>
            <span>10 = Extremely likely</span>
          </div>
        </div>
      );

    // 3. CES (Customer Effort Scale 1 to 7)
    case "ces":
      return (
        <div className="mt-2">
          <p className="text-xs text-[#5E5851] mb-2.5">
            1 = Very difficult · 7 = Very easy
          </p>
          <div
            aria-label="Customer Effort Scale 1 to 7"
            className="grid grid-cols-7 gap-1.5 sm:gap-2"
            role="radiogroup"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((score) => {
              const isSelected = Number(value) === score;
              return (
                <label
                  key={score}
                  style={
                    isSelected
                      ? {
                          borderColor: primaryColor,
                          boxShadow: `0 0 0 1px ${primaryColor}`,
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor,
                        }
                      : {}
                  }
                  className={`flex flex-col items-center justify-center h-11 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? "font-bold"
                      : "border-[#E8DFD5] bg-[#FFFFFF] hover:border-[#DAC1A2] hover:bg-[#FFF2DB]/40 text-[#1E1A17] font-semibold"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${qId}`}
                    className="sr-only"
                    value={score}
                    checked={isSelected}
                    onChange={() => onChange(score)}
                  />
                  <span className="text-sm font-semibold">{score}</span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-between items-center px-1 mt-2 text-xs text-[#8C847B]">
            <span>Very difficult</span>
            <span>Very easy</span>
          </div>
        </div>
      );

    // 4. Multiple Choice (Radio choices)
    case "multiple-choice":
      const choices =
        options && options.length > 0
          ? options
          : ["Option A", "Option B", "Option C"];
      return (
        <div className="mt-2">
          <p className="text-xs text-[#5E5851] mb-2.5">
            Select the single primary option.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {choices.map((opt, i) => {
              const isSelected = value === opt;
              return (
                <label
                  key={i}
                  style={
                    isSelected
                      ? {
                          borderColor: primaryColor,
                          backgroundColor: `${primaryColor}10`,
                        }
                      : {}
                  }
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? "shadow-xs"
                      : "border-[#E8DFD5] bg-[#FFFFFF] hover:border-[#DAC1A2] hover:bg-[#FFF2DB]/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${qId}`}
                    style={{ accentColor: primaryColor }}
                    className="w-4 h-4 border-[#DAC1A2]"
                    value={opt}
                    checked={isSelected}
                    onChange={() => onChange(opt)}
                  />
                  <span className="text-sm text-[#1E1A17] font-medium">
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      );

    // 5. Yes / No Toggle
    case "yes-no":
      return (
        <div className="mt-2">
          <p className="text-xs text-[#5E5851] mb-2.5">Select yes or no.</p>
          <div className="flex gap-3">
            {[
              { val: "yes", label: "Yes, definitely", icon: "check" },
              { val: "no", label: "No, had issues", icon: "cross" },
            ].map(({ val, label, icon }) => {
              const isSelected = value === val;
              return (
                <label
                  key={val}
                  style={
                    isSelected
                      ? {
                          borderColor: primaryColor,
                          boxShadow: `0 0 0 1px ${primaryColor}`,
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor,
                        }
                      : {}
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                    isSelected
                      ? "font-semibold"
                      : "border-[#E8DFD5] bg-[#FFFFFF] hover:border-[#DAC1A2] hover:bg-[#FFF2DB]/30 text-[#1E1A17]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${qId}`}
                    className="sr-only"
                    value={val}
                    checked={isSelected}
                    onChange={() => onChange(val)}
                  />
                  {icon === "check" ? (
                    <CheckCircle2
                      style={isSelected ? { color: primaryColor } : {}}
                      className={`w-4 h-4 ${isSelected ? "" : "text-[#5E5851]"}`}
                    />
                  ) : (
                    <X
                      style={isSelected ? { color: primaryColor } : {}}
                      className={`w-4 h-4 ${isSelected ? "" : "text-[#5E5851]"}`}
                    />
                  )}
                  <span className="text-sm font-semibold">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    // 6. Short Text
    case "text": {
      const textVal = value || "";
      const charCount = textVal.length;
      const wordCount =
        textVal.trim() === ""
          ? 0
          : textVal.trim().split(/\s+/).filter(Boolean).length;
      return (
        <div className="mt-2 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-[#5E5851]">
            <p className="text-[11px] sm:text-xs">
              A brief highlight or praise for the team.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C847B] ml-auto shrink-0 bg-[#FBF2EC] px-2 py-0.5 rounded-md border border-[#EFE4D6]">
              <span className="font-semibold text-[#1E1A17]">{wordCount}</span>
              <span>{wordCount === 1 ? "word" : "words"}</span>
              <span className="text-[#DAC1A2]">•</span>
              <span>{charCount}/150</span>
            </div>
          </div>
          <input
            id={`input-${qId}`}
            type="text"
            maxLength={150}
            onFocus={(e) => {
              e.target.style.borderColor = primaryColor;
              e.target.style.boxShadow = `0 0 0 2px ${primaryColor}25`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E8DFD5";
              e.target.style.boxShadow = "none";
            }}
            className="w-full h-[42px] px-3.5 text-sm rounded-xl border border-[#E8DFD5] bg-[#FFFFFF] text-[#1E1A17] placeholder:text-[#8C847B] outline-none transition-all"
            placeholder="e.g. Fabric softness, instant delivery updates, seamless returns"
            value={textVal}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }

    // 7. Textarea (Long text)
    case "textarea":
    default: {
      const textVal = value || "";
      const charCount = textVal.length;
      const wordCount =
        textVal.trim() === ""
          ? 0
          : textVal.trim().split(/\s+/).filter(Boolean).length;
      return (
        <div className="mt-2 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-[#5E5851]">
            <p className="text-[11px] sm:text-xs">
              Constructive feedback is shared directly with our team.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C847B] ml-auto shrink-0 bg-[#FBF2EC] px-2 py-0.5 rounded-md border border-[#EFE4D6]">
              <span className="font-semibold text-[#1E1A17]">{wordCount}</span>
              <span>{wordCount === 1 ? "word" : "words"}</span>
              <span className="text-[#DAC1A2]">•</span>
              <span>{charCount}/500</span>
            </div>
          </div>
          <textarea
            id={`input-${qId}`}
            rows={3}
            maxLength={500}
            onFocus={(e) => {
              e.target.style.borderColor = primaryColor;
              e.target.style.boxShadow = `0 0 0 2px ${primaryColor}25`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E8DFD5";
              e.target.style.boxShadow = "none";
            }}
            className="w-full p-3.5 text-sm rounded-xl border border-[#E8DFD5] bg-[#FFFFFF] text-[#1E1A17] placeholder:text-[#8C847B] outline-none transition-all resize-none leading-relaxed"
            placeholder="Be candid — whether it was website sizing, packaging, or tracking updates..."
            value={textVal}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }
  }
};

export default QuestionRenderer;
