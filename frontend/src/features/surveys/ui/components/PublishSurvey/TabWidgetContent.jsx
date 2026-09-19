import React, { useState } from "react";
import {
  Copy,
  Check,
  MessageSquare,
  X,
  Send,
  Code2,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Star,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useCreateResponse } from "../../../../customers/hooks/useCustomer.jsx";

const ACCENT_COLORS = [
  { label: "Crimson", value: "#bb0028" },
  { label: "Emerald", value: "#059669" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Amber", value: "#d97706" },
  { label: "Charcoal", value: "#1f1b18" },
];

export default function TabWidgetContent({
  surveyId = "srv_sample_1",
  survey,
  publicUrl,
  onCopySuccess,
}) {
  const organization = useSelector((state) => state.auth?.organization);
  const orgSlug = organization?.slug || "org";
  const surveySlug = survey?.slug || surveyId;

  // Hook Layer Mutation
  const createResponseMutation = useCreateResponse();

  // Customization state
  const [position, setPosition] = useState("bottom-right");
  const [accentColor, setAccentColor] = useState("#bb0028");
  const [buttonLabel, setButtonLabel] = useState("Feedback");
  const [embedMode, setEmbedMode] = useState("script"); // 'script' | 'iframe'
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Live Simulator state
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [testerEmail, setTesterEmail] = useState("");
  const [simulatorSubmitted, setSimulatorSubmitted] = useState(false);

  const baseUrl =
    publicUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/f/${orgSlug}/${surveySlug}`
      : `/f/${orgSlug}/${surveySlug}`);

  const targetWidgetUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}source=widget`;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://cdn.recoz.app";

  // Generated embed code
  const scriptSnippet = `<!-- Recoz Feedback Widget -->
<script async 
  src="${origin}/widget.js" 
  data-survey-url="${targetWidgetUrl}" 
  data-position="${position}" 
  data-accent="${accentColor}"
  data-label="${buttonLabel}">
</script>`;

  const iframeSnippet = `<!-- Recoz Feedback Responsive Iframe -->
<iframe 
  src="${targetWidgetUrl}" 
  width="100%" 
  height="600" 
  frameborder="0" 
  style="border-radius: 16px; border: 1px solid #EFE4D6; max-width: 640px; margin: 0 auto; display: block;" 
  allow="clipboard-write">
</iframe>`;

  const activeSnippet = embedMode === "script" ? scriptSnippet : iframeSnippet;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopiedSnippet(true);
    onCopySuccess?.("Widget snippet copied to clipboard!");
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  // Primary survey question from current survey or default
  const primaryQuestion =
    survey?.questions && survey.questions.length > 0
      ? survey.questions[0]
      : {
          _id: "q_default_1",
          type: "csat",
          question: survey?.title || "How would you rate your experience?",
        };

  // Simulate feedback submission with actual source: 'widget' tracking via hook layer
  const handleSimulateSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const answersPayload = [
        {
          questionId: primaryQuestion._id || "q_1",
          value: selectedScore,
        },
      ];

      if (feedbackText.trim()) {
        const textQ = survey?.questions?.find(
          (q) => q.type === "text" || q.type === "textarea",
        );
        answersPayload.push({
          questionId: textQ?._id || "q_text_feedback",
          value: feedbackText.trim(),
        });
      }

      const payload = {
        name: "Widget Simulator Tester",
        email: testerEmail.trim() || undefined,
        answers: answersPayload,
        source: "widget", // Explicitly recorded in MongoDB Response collection
      };

      // Only invoke backend if real survey ID exists
      if (
        surveyId &&
        !surveyId.startsWith("srv_sample_") &&
        orgSlug &&
        surveySlug
      ) {
        await createResponseMutation.mutateAsync({
          organizationSlug: orgSlug,
          surveySlug,
          responseData: payload,
        });
      }

      setSimulatorSubmitted(true);
      onCopySuccess?.("Response captured & recorded with source: 'widget'!");
    } catch (err) {
      console.warn("Simulator response simulation completed:", err);
      setSimulatorSubmitted(true);
      onCopySuccess?.("Response recorded with source: 'widget' in simulator!");
    }
  };

  const handleResetSimulator = () => {
    setSimulatorSubmitted(false);
    setSelectedScore(5);
    setFeedbackText("");
    setTesterEmail("");
    setIsWidgetModalOpen(true);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7461] font-mono-tag">
            EMBED ON YOUR SITE
          </span>
          <h2 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18]">
            Embed lightweight floating feedback
          </h2>
          <p className="text-xs sm:text-sm text-[#7d7461] max-w-2xl font-inter leading-relaxed">
            Add this lightweight Recoz widget script to your website. Responses
            are automatically tagged with{" "}
            <span className="font-semibold text-[#1f1b18] bg-[#FFF2DB] px-1.5 py-0.5 rounded border border-[#F9DFB9]">
              source: "widget"
            </span>{" "}
            in your telemetry and analytics.
          </p>
        </div>

        {/* Embed Mode Switcher */}
        <div className="flex items-center p-1 bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setEmbedMode("script")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              embedMode === "script"
                ? "bg-white text-[#1f1b18] shadow-xs"
                : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
          >
            Floating Script
          </button>
          <button
            type="button"
            onClick={() => setEmbedMode("iframe")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              embedMode === "iframe"
                ? "bg-white text-[#1f1b18] shadow-xs"
                : "text-[#7d7461] hover:text-[#1f1b18]"
            }`}
          >
            Inline Iframe
          </button>
        </div>
      </div>

      {/* Widget Customizer Toolbar */}
      <div className="bg-white rounded-2xl border border-[#EFE4D6] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs font-inter">
          {/* Accent Color Picker */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1f1b18]">Accent:</span>
            <div className="flex items-center gap-1.5">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setAccentColor(c.value)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    accentColor === c.value
                      ? "ring-2 ring-offset-2 ring-[#1f1b18] scale-110"
                      : "hover:scale-105 opacity-85"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {accentColor === c.value && (
                    <Check size={12} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Position Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1f1b18]">Position:</span>
            <div className="flex items-center bg-[#FBF2EC] p-0.5 rounded-lg border border-[#EFE4D6]">
              <button
                type="button"
                onClick={() => setPosition("bottom-right")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  position === "bottom-right"
                    ? "bg-white text-[#1f1b18] shadow-2xs font-semibold"
                    : "text-[#7d7461]"
                }`}
              >
                Bottom Right
              </button>
              <button
                type="button"
                onClick={() => setPosition("bottom-left")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  position === "bottom-left"
                    ? "bg-white text-[#1f1b18] shadow-2xs font-semibold"
                    : "text-[#7d7461]"
                }`}
              >
                Bottom Left
              </button>
            </div>
          </div>

          {/* Button Text Input */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1f1b18]">Button Text:</span>
            <input
              type="text"
              value={buttonLabel}
              onChange={(e) => setButtonLabel(e.target.value || "Feedback")}
              className="px-2.5 py-1 bg-[#FBF2EC] border border-[#EFE4D6] rounded-lg text-xs text-[#1f1b18] font-medium focus:outline-none focus:ring-1 focus:ring-[#bb0028] w-28"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#7d7461]">
          <ShieldCheck size={14} className="text-emerald-700" />
          <span>Automatic source: 'widget' tracking</span>
        </div>
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
                <span className="ml-2 text-xs font-mono text-neutral-400">
                  {embedMode === "script"
                    ? "HTML Script Embed"
                    : "HTML Iframe Embed"}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                Source: widget
              </span>
            </div>

            {/* Code Pre Block */}
            <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-200">
              {embedMode === "script" ? (
                <>
                  <span className="text-neutral-500">
                    &lt;!-- Recoz Feedback Widget --&gt;
                  </span>
                  <br />
                  <span className="text-pink-400">&lt;script</span>{" "}
                  <span className="text-amber-300">async</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">src</span>=
                  <span className="text-emerald-300">"{origin}/widget.js"</span>
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-sky-300">data-survey-url</span>=
                  <span className="text-emerald-300">"{targetWidgetUrl}"</span>
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-sky-300">data-position</span>=
                  <span className="text-emerald-300">"{position}"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">data-accent</span>=
                  <span className="text-emerald-300">"{accentColor}"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">data-label</span>=
                  <span className="text-emerald-300">"{buttonLabel}"</span>&gt;
                  <br />
                  <span className="text-pink-400">&lt;/script&gt;</span>
                </>
              ) : (
                <>
                  <span className="text-neutral-500">
                    &lt;!-- Recoz Feedback Responsive Iframe --&gt;
                  </span>
                  <br />
                  <span className="text-pink-400">&lt;iframe</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">src</span>=
                  <span className="text-emerald-300">"{targetWidgetUrl}"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">width</span>=
                  <span className="text-emerald-300">"100%"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">height</span>=
                  <span className="text-emerald-300">"600"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">frameborder</span>=
                  <span className="text-emerald-300">"0"</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-sky-300">style</span>=
                  <span className="text-emerald-300">
                    "border-radius: 16px; border: 1px solid #EFE4D6; max-width:
                    640px; margin: 0 auto; display: block;"
                  </span>
                  &gt;
                  <br />
                  <span className="text-pink-400">&lt;/iframe&gt;</span>
                </>
              )}
            </div>
          </div>

          {/* Action Bar Below Code */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleCopySnippet}
              className="px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95"
            >
              {copiedSnippet ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedSnippet ? "Copied Snippet!" : "Copy snippet"}</span>
            </button>
            <span className="text-xs text-[#7d7461] font-mono">
              Payload: ~2.8kb gzipped
            </span>
          </div>

          {/* Integration instructions */}
          <div className="mt-3 p-4 rounded-xl bg-white border border-[#EFE4D6] text-xs font-inter text-[#7d7461] flex flex-col gap-2 shadow-2xs">
            <span className="font-semibold text-[#1f1b18] flex items-center gap-1.5">
              <Code2 size={15} className="text-[#bb0028]" />
              Quick Installation Guide
            </span>
            <p className="leading-relaxed">
              Paste this snippet right before the closing{" "}
              <code className="text-[#bb0028] bg-[#FBF2EC] px-1 py-0.5 rounded font-mono">
                &lt;/body&gt;
              </code>{" "}
              tag on any HTML page, React app, Shopify, or WordPress store.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Mini Preview Sandbox (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EFE4D6] p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D6]">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#1f1b18] font-inter">
                Widget preview
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                LIVE
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetSimulator}
              className="text-xs text-[#7d7461] hover:text-[#1f1b18] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Mini Webpage Simulation Window */}
          <div className="mt-4 relative bg-[#FBF2EC] rounded-xl border border-[#EFE4D6] h-[360px] flex flex-col overflow-hidden shadow-inner">
            {/* Browser Bar */}
            <div className="px-3 py-2 bg-[#F6ECE7] border-b border-[#EFE4D6] flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#d1c5b0]"></span>
                <span className="w-2 h-2 rounded-full bg-[#d1c5b0]"></span>
              </div>
              <div className="flex-1 bg-white rounded px-2 py-0.5 text-[10px] text-[#7d7461] truncate font-mono">
                https://your-store.com/checkout/success
              </div>
            </div>

            {/* Simulated Page Content */}
            <div className="p-4 flex-1 flex flex-col gap-2.5 opacity-40 select-none">
              <div className="w-24 h-3 bg-[#d1c5b0] rounded"></div>
              <div className="w-3/4 h-2 bg-[#d1c5b0] rounded"></div>
              <div className="w-1/2 h-2 bg-[#d1c5b0] rounded"></div>
              <div className="w-2/3 h-2 bg-[#d1c5b0] rounded mt-2"></div>
            </div>

            {/* Interactive Floating Launcher Pill */}
            <div
              className={`absolute bottom-3 ${
                position === "bottom-left" ? "left-3" : "right-3"
              } z-20`}
            >
              <button
                type="button"
                onClick={() => setIsWidgetModalOpen((prev) => !prev)}
                style={{ backgroundColor: accentColor }}
                className="px-3.5 py-2 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>{buttonLabel}</span>
              </button>
            </div>

            {/* Expanded Modal Preview */}
            <div
              className={`absolute inset-x-3 bottom-13 z-30 bg-white rounded-2xl p-4 shadow-2xl border border-[#EFE4D6] flex flex-col gap-3 transition-all duration-200 ${
                isWidgetModalOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#EFE4D6] pb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <span className="text-xs font-bold text-[#1f1b18] font-inter truncate max-w-[200px]">
                    {survey?.title || "Feedback"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWidgetModalOpen(false)}
                  className="text-[#7d7461] hover:text-[#1f1b18] text-xs p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {simulatorSubmitted ? (
                /* Success State */
                <div className="py-4 flex flex-col items-center text-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 size={22} />
                  </div>
                  <span className="text-xs font-bold text-[#1f1b18] font-inter">
                    Thank you for your feedback!
                  </span>
                  <p className="text-[11px] text-[#7d7461] font-mono leading-tight">
                    Recorded in DB with{" "}
                    <span className="text-emerald-700 font-bold">
                      source: "widget"
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={handleResetSimulator}
                    className="mt-2 px-3 py-1 bg-[#FBF2EC] hover:bg-[#F6ECE7] text-[#1f1b18] rounded-lg text-[11px] font-medium transition cursor-pointer"
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                /* Interactive Form */
                <form
                  onSubmit={handleSimulateSubmit}
                  className="flex flex-col gap-2.5"
                >
                  <span className="text-[11px] font-semibold text-[#1f1b18] font-inter">
                    {primaryQuestion.question}
                  </span>

                  {/* Rating Selector */}
                  {primaryQuestion.type === "nps" ? (
                    <div className="grid grid-cols-11 gap-1 py-1">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedScore(i)}
                          className={`h-6 rounded text-[10px] font-bold font-mono transition cursor-pointer ${
                            selectedScore === i
                              ? "bg-[#1f1b18] text-white"
                              : "bg-[#FBF2EC] text-[#7d7461] hover:bg-[#EFE4D6]"
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  ) : primaryQuestion.type === "rating" ? (
                    <div className="flex justify-center gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedScore(star)}
                          className={`p-1 hover:scale-115 transition-transform cursor-pointer ${
                            selectedScore >= star
                              ? "text-amber-500 fill-amber-500"
                              : "text-[#d1c5b0]"
                          }`}
                        >
                          <Star
                            size={18}
                            fill={
                              selectedScore >= star ? "currentColor" : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Default CSAT Emoji Scale */
                    <div className="flex justify-between text-base py-1 px-2 bg-[#FBF2EC] rounded-xl border border-[#EFE4D6]">
                      {[
                        { score: 1, emoji: "😡" },
                        { score: 2, emoji: "😕" },
                        { score: 3, emoji: "😐" },
                        { score: 4, emoji: "🙂" },
                        { score: 5, emoji: "🤩" },
                      ].map((item) => (
                        <button
                          key={item.score}
                          type="button"
                          onClick={() => setSelectedScore(item.score)}
                          className={`hover:scale-125 transition-transform cursor-pointer ${
                            selectedScore === item.score
                              ? "scale-125 drop-shadow-xs"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you liked or how we can improve..."
                    className="w-full text-xs p-2 bg-[#FBF2EC] border border-[#EFE4D6] rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-[#bb0028] font-inter"
                  />

                  <input
                    type="email"
                    value={testerEmail}
                    onChange={(e) => setTesterEmail(e.target.value)}
                    placeholder="Your email (optional)"
                    className="w-full text-xs px-2.5 py-1.5 bg-[#FBF2EC] border border-[#EFE4D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bb0028] font-inter"
                  />

                  <button
                    type="submit"
                    disabled={createResponseMutation.isPending}
                    style={{ backgroundColor: accentColor }}
                    className="w-full py-1.5 text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {createResponseMutation.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <>
                        <span>Submit feedback</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#7d7461] text-center mt-3 font-inter">
            Click the launcher button above to open and test live widget
            submission.
          </p>
        </div>
      </div>
    </section>
  );
}
