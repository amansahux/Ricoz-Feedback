import React, { useState } from "react";
import { Smartphone, Monitor, ArrowRight } from "lucide-react";

export default function LivePreviewPhone({ title, description, questions = [] }) {
  const [deviceMode, setDeviceMode] = useState("mobile"); // 'mobile' | 'desktop'
  const [activeAnswers, setActiveAnswers] = useState({});

  const handleSelectAnswer = (qId, val) => {
    setActiveAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  return (
    <div className="sticky top-24 flex flex-col gap-3">
      {/* Top indicator & Device Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d3f3e] font-mono-tag">
            Live Preview
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#FBF2EC] px-2 py-1 rounded-xl border border-[#EFE4D6]">
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-white shadow-2xs text-[#bb0028]"
                : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
            title="Mobile preview"
          >
            <Smartphone size={15} />
          </button>
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-white shadow-2xs text-[#bb0028]"
                : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
            title="Desktop preview"
          >
            <Monitor size={15} />
          </button>
        </div>
      </div>

      {/* SMARTPHONE MOCKUP FRAME */}
      <div className="w-full max-w-[360px] mx-auto bg-[#342F2C] p-3 rounded-[38px] shadow-2xl border-4 border-[#1F1B18]">
        {/* Notch */}
        <div className="w-full flex justify-center pb-2">
          <div className="w-24 h-4 bg-[#1F1B18] rounded-full flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          </div>
        </div>

        {/* Mobile Screen Canvas */}
        <div className="bg-[#FFFAF3] rounded-[28px] overflow-hidden flex flex-col h-[620px] border border-[#EFE4D6] shadow-inner">
          {/* Screen Header Bar */}
          <div className="px-5 py-3.5 bg-white border-b border-[#EFE4D6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#bb0028] text-white flex items-center justify-center text-[11px] font-bold">
                R
              </div>
              <span className="text-xs font-bold text-[#1f1b18]">Acme Co.</span>
            </div>
            <span className="text-[10px] text-[#7d7461] font-mono-tag">
              Recoz Powered
            </span>
          </div>

          {/* Screen Scrollable Form Body */}
          <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 text-left custom-scrollbar">
            {/* Dynamic Header in Preview */}
            <div className="flex flex-col gap-1.5 border-b border-[#EFE4D6] pb-3">
              <h3 className="text-base font-epilogue font-bold text-[#1f1b18] leading-tight">
                {title || "Untitled Survey"}
              </h3>
              <p className="text-xs text-[#7d7461] leading-normal font-inter">
                {description ||
                  "We'd love to hear your thoughts. Takes less than 1 minute."}
              </p>
            </div>

            {/* Render questions in phone canvas */}
            {questions.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#7d7461] italic">
                Add questions on the left to see live preview
              </div>
            ) : (
              questions.map((q, qIndex) => {
                const qKey = q._id || `q_${qIndex}`;
                return (
                  <div key={qKey} className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-[#1f1b18] font-inter">
                      {qIndex + 1}. {q.question || "Untitled Question"}
                      {q.required && <span className="text-[#bb0028] ml-0.5">*</span>}
                    </span>

                    {/* CSAT Emoji format */}
                    {q.type === "csat" && (
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        {[
                          { emoji: "😡", val: 1 },
                          { emoji: "🙁", val: 2 },
                          { emoji: "😐", val: 3 },
                          { emoji: "🙂", val: 4 },
                          { emoji: "😍", val: 5 },
                        ].map((item) => {
                          const isSel = activeAnswers[qKey] === item.val;
                          return (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => handleSelectAnswer(qKey, item.val)}
                              className={`py-2 rounded-xl text-lg transition-all cursor-pointer ${
                                isSel
                                  ? "bg-[#FFF2DB] border-2 border-[#bb0028] scale-105"
                                  : "bg-white border border-[#EFE4D6] hover:border-[#bb0028]"
                              }`}
                            >
                              {item.emoji}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* NPS strip */}
                    {q.type === "nps" && (
                      <div className="grid grid-cols-6 gap-1 text-center">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                          const isSel = activeAnswers[qKey] === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleSelectAnswer(qKey, num)}
                              className={`py-1.5 text-xs rounded-lg transition-all cursor-pointer font-bold ${
                                isSel
                                  ? "bg-[#FFF2DB] text-[#bb0028] border-2 border-[#bb0028]"
                                  : "bg-white border border-[#EFE4D6] text-[#1f1b18] hover:border-[#bb0028]"
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Rating Stars */}
                    {q.type === "rating" && (
                      <div className="flex items-center justify-center gap-2 py-1 bg-white rounded-xl border border-[#EFE4D6]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleSelectAnswer(qKey, star)}
                            className={`text-2xl transition cursor-pointer ${
                              (activeAnswers[qKey] || 0) >= star
                                ? "text-amber-400 scale-110"
                                : "text-neutral-300 hover:text-amber-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Multiple Choice Options */}
                    {(q.type === "multiple-choice" || q.type === "yes-no") && (
                      <div className="flex flex-col gap-1.5">
                        {(q.options || ["Option 1", "Option 2"]).map((opt, oIdx) => {
                          const isSel = activeAnswers[qKey] === opt;
                          return (
                            <label
                              key={oIdx}
                              onClick={() => handleSelectAnswer(qKey, opt)}
                              className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs text-[#1f1b18] cursor-pointer transition ${
                                isSel
                                  ? "bg-[#FFF2DB] border-[#bb0028] font-semibold"
                                  : "bg-white border-[#EFE4D6] hover:bg-[#FBF2EC]"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`preview_${qKey}`}
                                checked={isSel}
                                onChange={() => {}}
                                className="text-[#bb0028] focus:ring-[#bb0028] h-3.5 w-3.5"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* Text Inputs */}
                    {(q.type === "text" || q.type === "textarea" || q.type === "ces") && (
                      <textarea
                        rows={2}
                        readOnly
                        placeholder="Tell us more about your thoughts..."
                        className="w-full p-2.5 text-xs rounded-xl border border-[#EFE4D6] bg-white resize-none"
                      />
                    )}
                  </div>
                );
              })
            )}

            {/* Customer Submit CTA in preview */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-[#bb0028] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Submit Feedback</span>
                <ArrowRight size={14} />
              </button>
              <span className="block text-center text-[9px] text-[#7d7461] mt-2 font-inter">
                Zero spam. Protected by Recoz Trust Shield.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
