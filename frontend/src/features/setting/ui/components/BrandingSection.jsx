import React, { useState } from "react";
import { Eye, ArrowRight } from "lucide-react";

const PRESET_COLORS = [
  { name: "Recoz Crimson", hex: "#F62440" },
  { name: "Midnight Slate", hex: "#0F172A" },
  { name: "Royal Indigo", hex: "#4F46E5" },
  { name: "Forest Green", hex: "#059669" },
  { name: "Warm Ochre", hex: "#D97706" },
];

export const BrandingSection = ({
  logoUrl,
  primaryColor,
  organizationName,
  previewRating,
  onLogoChange,
  onColorChange,
  onRatingSelect,
}) => {
  const [imgError, setImgError] = useState(false);

  const orgInitials = (organizationName || "Recoz")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogoInputChange = (val) => {
    setImgError(false);
    onLogoChange(val);
  };

  return (
    <section className="bg-white rounded-2xl border border-[#E1D8D3] p-6 lg:p-7 shadow-xs transition-all duration-200">
      <div className="border-b border-[#E1D8D3] pb-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold font-epilogue text-[#1f1b18]">
          Branding
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7461] mt-0.5">
          Applied to public customer feedback pages and embedded survey widgets.
        </p>
      </div>

      <div className="space-y-6">
        {/* Logo URL Control */}
        <div className="space-y-2">
          <label
            htmlFor="logoUrlInput"
            className="block text-sm font-semibold text-[#1f1b18]"
          >
            Logo URL
          </label>
          <div className="flex items-center gap-3">
            {/* Logo Preview Square */}
            <div className="w-12 h-12 rounded-xl border border-[#E1D8D3] bg-[#FBF2EC] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {logoUrl && !imgError ? (
                <img
                  src={logoUrl}
                  alt="Organization Logo"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-bold text-sm text-white transition-colors"
                  style={{ backgroundColor: primaryColor || "#F62440" }}
                >
                  {orgInitials}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex-1">
              <input
                id="logoUrlInput"
                type="url"
                value={logoUrl}
                onChange={(e) => handleLogoInputChange(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full h-11 px-3.5 text-sm bg-white text-[#1f1b18] placeholder-[#7d7461]/60 border border-[#E1D8D3] rounded-xl shadow-xs focus:outline-none focus:border-[#bb0028] focus:ring-2 focus:ring-[#bb0028]/10 transition-colors"
              />
            </div>
          </div>
          <p className="text-xs text-[#7d7461]">
            Recommended: SVG or high-resolution PNG on a transparent background (120x120px min).
          </p>
        </div>

        {/* Primary Accent Color Controls */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-semibold text-[#1f1b18]">
            Primary Accent Color
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {/* Swatch & Hex Picker */}
            <div className="flex items-center gap-2.5 p-1.5 rounded-xl border border-[#E1D8D3] bg-white shadow-xs">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/10 cursor-pointer">
                <input
                  type="color"
                  value={primaryColor || "#F62440"}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div
                  className="w-full h-full rounded-lg"
                  style={{ backgroundColor: primaryColor || "#F62440" }}
                />
              </div>
              <input
                type="text"
                maxLength={7}
                value={primaryColor || "#F62440"}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-22 h-8 px-2 font-mono text-xs uppercase bg-transparent text-[#1f1b18] border-0 focus:ring-0 focus:outline-none font-semibold"
              />
            </div>

            {/* Quick Palette Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7d7461] font-medium">Presets:</span>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((preset) => {
                  const isSelected =
                    primaryColor?.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      title={preset.name}
                      onClick={() => onColorChange(preset.hex)}
                      className={`w-7 h-7 rounded-full transition-transform hover:scale-110 active:scale-95 border-2 border-white shadow-xs cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-[#bb0028] scale-110"
                          : "ring-1 ring-black/10"
                      }`}
                      style={{ backgroundColor: preset.hex }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Public Feedback Live Preview Panel */}
        <div className="mt-8 pt-6 border-t border-[#E1D8D3]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-[#7d7461]" />
              <h3 className="text-sm font-semibold text-[#1f1b18]">
                Customer Feedback Preview
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#7d7461] bg-[#FBF2EC] px-2.5 py-1 rounded-full border border-[#E1D8D3]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Preview • Updates instantly
            </span>
          </div>

          {/* Preview Canvas Frame */}
          <div className="rounded-2xl bg-[#FBF2EC]/80 p-5 sm:p-8 border border-[#E1D8D3] flex justify-center items-center">
            {/* Simulated Customer Widget Card */}
            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-[#E1D8D3] transition-all">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#FBF2EC] border border-[#E1D8D3] overflow-hidden flex items-center justify-center shrink-0">
                  {logoUrl && !imgError ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-xs font-bold text-white w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor || "#F62440" }}
                    >
                      {orgInitials}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1f1b18] leading-snug">
                    {organizationName || "Organization"} Experience
                  </h4>
                  <p className="text-xs text-[#7d7461]">Verified Consumer Pulse</p>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <p className="text-base font-semibold font-epilogue text-[#1f1b18]">
                  How was your experience with {organizationName || "our team"} today?
                </p>

                {/* Rating Scale (1 to 5) */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isSelected = previewRating === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onRatingSelect(val)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "text-white shadow-xs scale-105"
                            : "border border-[#E1D8D3] text-[#7d7461] hover:bg-[#FBF2EC]"
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: primaryColor || "#F62440",
                                borderColor: primaryColor || "#F62440",
                              }
                            : {}
                        }
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs text-[#7d7461] px-0.5">
                  <span>Poor</span>
                  <span>Exceptional</span>
                </div>

                {/* Submit Feedback CTA */}
                <button
                  type="button"
                  className="w-full mt-3 py-3 px-4 rounded-xl text-white text-sm font-semibold shadow-xs transition-all hover:opacity-95 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primaryColor || "#F62440" }}
                >
                  <span>Submit feedback</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandingSection;
