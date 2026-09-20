import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed bottom-20 right-6 z-50 animate-bounce-short flex items-center gap-3 bg-[#342f2c] text-[#f9efe9] px-4.5 py-3.5 rounded-2xl shadow-2xl border border-white/10 max-w-sm">
      {isSuccess ? (
        <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle size={22} className="text-[#ffb3b1] shrink-0" />
      )}
      <div className="flex-1 min-w-0 pr-1">
        <h5 className="text-sm font-semibold text-white leading-tight">
          {toast.title}
        </h5>
        <p className="text-xs text-[#f9efe9]/80 mt-0.5 leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastNotification;
