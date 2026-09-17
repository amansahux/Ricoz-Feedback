import React, { useState } from "react";
import { Copy, Check, MessageSquare, X, Send } from "lucide-react";

export default function TabWidgetContent({ surveyId = "srv_acme_post_purchase", onCopySuccess }) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🤩");

  const snippet = `<!-- Recoz Feedback Widget -->
<script async 
  src="https://cdn.recoz.app/v1/widget.js" 
  data-survey-id="${surveyId}" 
  data-position="bottom-right" 
  data-accent="#bb0028">
</script>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    onCopySuccess?.("Widget snippet copied to clipboard!");
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  const handleSimulateSubmit = () => {
    setIsWidgetModalOpen(false);
    onCopySuccess?.("Response captured in simulator preview!");
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7461] font-mono-tag">
          EMBED ON YOUR SITE
        </span>
        <h2 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18]">
          Embed lightweight floating feedback
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7461] max-w-2xl font-inter leading-relaxed">
          Add this lightweight Recoz widget script to your website to let visitors share feedback without leaving the page.
        </p>
      </div>

      {/* Two-Column Developer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Code Editor View (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-[#121110] rounded-2xl overflow-hidden shadow-xl border border-[#262321]">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1e1c1a] border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="ml-2 text-xs font-mono text-neutral-400">HTML Snippet</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                Asynchronous
              </span>
            </div>

            {/* Code Pre Block */}
            <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-200">
              <span className="text-neutral-500">&lt;!-- Recoz Feedback Widget --&gt;</span>
              <br />
              <span className="text-pink-400">&lt;script</span>{" "}
              <span className="text-amber-300">async</span>
              <br />
              &nbsp;&nbsp;<span className="text-sky-300">src</span>=
              <span className="text-emerald-300">"https://cdn.recoz.app/v1/widget.js"</span>
              <br />
              &nbsp;&nbsp;<span className="text-sky-300">data-survey-id</span>=
              <span className="text-emerald-300">"{surveyId}"</span>
              <br />
              &nbsp;&nbsp;<span className="text-sky-300">data-position</span>=
              <span className="text-emerald-300">"bottom-right"</span>
              <br />
              &nbsp;&nbsp;<span className="text-sky-300">data-accent</span>=
              <span className="text-emerald-300">"#bb0028"</span>&gt;
              <br />
              <span className="text-pink-400">&lt;/script&gt;</span>
            </div>
          </div>

          {/* Action Bar Below Code */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleCopySnippet}
              className="px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              {copiedSnippet ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedSnippet ? "Copied" : "Copy snippet"}</span>
            </button>
            <span className="text-xs text-[#7d7461] font-mono">Payload: ~2.4kb gzipped</span>
          </div>
        </div>

        {/* Right Column: Interactive Mini Preview Sandbox (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EFE4D6] p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
            <span className="text-xs sm:text-sm font-bold text-[#1f1b18] font-inter">
              Widget preview
            </span>
            <span className="text-xs text-emerald-700 font-medium">Live simulator</span>
          </div>

          {/* Mini Webpage Simulation Window */}
          <div className="mt-4 relative bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] h-80 flex flex-col overflow-hidden">
            {/* Browser Bar */}
            <div className="px-3 py-2 bg-[#F6ECE7] border-b border-[#EFE4D6] flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#d1c5b0]"></span>
                <span className="w-2 h-2 rounded-full bg-[#d1c5b0]"></span>
              </div>
              <div className="flex-1 bg-white rounded px-2 py-0.5 text-[10px] text-[#7d7461] truncate font-mono">
                https://acme-clothing.com/checkout/success
              </div>
            </div>

            {/* Page Content Simulation Dummy */}
            <div className="p-4 flex-1 flex flex-col gap-2.5 opacity-40 select-none">
              <div className="w-24 h-3 bg-[#d1c5b0] rounded"></div>
              <div className="w-3/4 h-2 bg-[#d1c5b0] rounded"></div>
              <div className="w-1/2 h-2 bg-[#d1c5b0] rounded"></div>
            </div>

            {/* Interactive Floating Launcher Pill */}
            <div className="absolute bottom-4 right-4 z-20">
              <button
                onClick={() => setIsWidgetModalOpen((prev) => !prev)}
                className="px-3.5 py-2 rounded-full bg-[#bb0028] text-white shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Feedback</span>
              </button>
            </div>

            {/* Expanded Modal Preview */}
            <div
              className={`absolute inset-x-4 bottom-14 z-30 bg-white rounded-2xl p-4 shadow-2xl border border-[#EFE4D6] flex flex-col gap-3 transition-all duration-200 ${
                isWidgetModalOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1f1b18] font-inter">
                  How was your checkout?
                </span>
                <button
                  onClick={() => setIsWidgetModalOpen(false)}
                  className="text-[#7d7461] hover:text-[#1f1b18] text-xs p-1"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Emoji Scale in Simulator */}
              <div className="flex justify-between text-lg py-1 border-y border-[#EFE4D6]">
                {["😡", "😕", "😐", "🙂", "🤩"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`hover:scale-125 transition-transform cursor-pointer ${
                      selectedEmoji === emoji ? "scale-125" : "opacity-80"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                placeholder="Tell us more about your experience..."
                className="w-full text-xs p-2 bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl resize-none focus:outline-none focus:border-[#bb0028] font-inter"
              />

              <button
                onClick={handleSimulateSubmit}
                className="w-full py-1.5 bg-[#bb0028] text-white rounded-xl text-xs font-semibold hover:bg-[#a10022] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Submit</span>
                <Send size={12} />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#7d7461] text-center mt-3 font-inter">
            Click the 'Feedback' launcher button above to test modal trigger interaction.
          </p>
        </div>
      </div>
    </section>
  );
}
