import React from "react";
import { AlertTriangle, X } from "lucide-react";

export const DiscardModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E1D8D3] transition-all transform animate-scaleUp">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#FBF2EC] text-[#bb0028] flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7d7461] hover:text-[#1f1b18] p-1 rounded-lg hover:bg-[#FBF2EC] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="text-lg font-bold font-epilogue text-[#1f1b18]">
          Discard unsaved changes?
        </h3>
        <p className="text-sm text-[#7d7461] mt-2 leading-relaxed">
          You have modified your branding and workspace profile. If you discard now, these alterations will be reverted to the last saved state.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] transition-colors cursor-pointer"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4.5 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-sm font-semibold hover:bg-[#93000a] transition-colors shadow-xs cursor-pointer active:scale-98"
          >
            Yes, Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscardModal;
