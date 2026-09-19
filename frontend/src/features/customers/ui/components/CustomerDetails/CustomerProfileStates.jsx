import React from "react";
import { Link } from "react-router";
import { AlertCircle, RefreshCw, UserX, ArrowLeft } from "lucide-react";

export const CustomerProfileSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-4 w-32 bg-[#f0e6e1] rounded"></div>
    <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#f0e6e1]"></div>
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#f0e6e1] rounded"></div>
          <div className="h-7 w-48 bg-[#f0e6e1] rounded"></div>
          <div className="h-3 w-64 bg-[#f0e6e1] rounded"></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-2xl bg-white border border-[#EFE4D6] space-y-4">
          <div className="h-3 w-24 bg-[#f0e6e1] rounded"></div>
          <div className="h-8 w-20 bg-[#f0e6e1] rounded"></div>
          <div className="h-3 w-32 bg-[#f0e6e1] rounded"></div>
        </div>
      ))}
    </div>
    <div className="p-6 rounded-2xl bg-white border border-[#EFE4D6] space-y-4">
      <div className="h-6 w-40 bg-[#f0e6e1] rounded"></div>
      <div className="h-32 w-full bg-[#f0e6e1] rounded-xl"></div>
    </div>
  </div>
);

export const CustomerProfileNotFound = ({ customerId }) => (
  <div className="p-16 rounded-2xl bg-white border border-[#EFE4D6] shadow-xs text-center flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-[#FBF2EC] flex items-center justify-center mb-4 border border-[#EFE4D6]">
      <UserX size={30} className="text-[#7d7461]" />
    </div>
    <h3 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-1.5">
      Customer Not Found
    </h3>
    <p className="text-xs sm:text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      No customer profile was found matching identifier <strong>{customerId}</strong>. The record may have been removed or does not exist.
    </p>
    <Link
      to="/customers"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs font-semibold transition shadow-sm"
    >
      <ArrowLeft size={16} />
      <span>Return to Customers directory</span>
    </Link>
  </div>
);

export const CustomerProfileError = ({ error, onRetry }) => (
  <div className="p-16 rounded-2xl bg-white border border-[#EFE4D6] shadow-xs text-center flex flex-col items-center justify-center">
    <div className="w-16 h-16 rounded-2xl bg-[#ffdad6]/50 flex items-center justify-center mb-4 border border-[#bb0028]/20">
      <AlertCircle size={30} className="text-[#bb0028]" />
    </div>
    <h3 className="text-xl font-epilogue font-semibold text-[#1f1b18] mb-1.5">
      Error loading customer record
    </h3>
    <p className="text-xs sm:text-sm text-[#7d7461] font-inter max-w-md mb-6 leading-relaxed">
      {error?.message || "There was a problem retrieving customer feedback telemetry."}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EFE4D6] hover:bg-[#FBF2EC] text-[#1f1b18] text-xs font-semibold transition cursor-pointer shadow-xs"
    >
      <RefreshCw size={14} />
      <span>Try again</span>
    </button>
  </div>
);
