import React, { useEffect } from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoggingOut) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoggingOut, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121110]/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={!isLoggingOut ? onClose : undefined} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-[#FFFAF3] border border-[#EFE4D6] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/20 text-[#1f1b18] animate-in zoom-in-95 duration-150 z-10">
        {/* Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoggingOut}
          aria-label="Close dialog"
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#EFE4D6]/50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Icon & Monogram */}
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-[#F62440]/20 flex items-center justify-center text-[#F62440] mb-4 shadow-sm">
          <LogOut size={22} className="ml-0.5" />
        </div>

        {/* Title & Body */}
        <h3 id="logout-modal-title" className="font-poppins text-xl font-semibold text-[#1f1b18] tracking-tight">
          Sign out of Recoz?
        </h3>
        <p className="mt-2 font-inter text-sm text-[#6e5c3e] leading-relaxed">
          Are you sure you want to end your current session? You'll need to sign back in to access your feedback surveys and analytics.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="w-full sm:w-auto px-4 h-10 rounded-xl bg-white border border-[#EFE4D6] hover:bg-neutral-50 text-[#1f1b18] font-inter text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="w-full sm:w-auto px-5 h-10 rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-white font-inter text-sm font-medium transition-all shadow-md shadow-[#F62440]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
