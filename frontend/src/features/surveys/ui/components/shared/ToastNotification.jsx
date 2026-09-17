import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastNotification({ toast, onClose }) {
  if (!toast || !toast.visible) return null;

  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 ease-out"
      role="alert"
    >
      <div className="flex items-center gap-3 px-5 py-3.5 bg-[#1F1B18] text-[#F9EFE9] rounded-xl shadow-2xl border border-white/10 text-sm font-medium">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-[#F62440] shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="text-xs sm:text-sm">{toast.message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white ml-2 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
