import React from "react";

export default function PageLoader() {
  return (
    <div className="min-h-[100vh] w-full flex flex-col items-center justify-center p-6 bg-[#FFFAF3]/40 backdrop-blur-xl">
      <div className="relative flex flex-col items-center justify-center px-10 py-8 rounded-3xl bg-white/60 border border-[#EFE4D6]/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
        {/* Soft decorative ambient glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#bb0028]/10 via-[#dbc39f]/15 to-transparent rounded-[32px] blur-2xl -z-10" />

        {/* Dual-ring spinner */}
        <div className="relative w-10 h-10 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#EFE4D6]/70" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#bb0028] border-r-[#bb0028]/60 animate-spin" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#bb0028]" />
        </div>

        {/* Loading text with subtle typography */}
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-xs font-epilogue font-semibold text-[#1f1b18] tracking-tight">
            Loading...
          </p>
          <span className="text-[11px] font-inter text-[#7d7461] font-medium">
            Please wait a moment
          </span>
        </div>
      </div>
    </div>
  );
}

