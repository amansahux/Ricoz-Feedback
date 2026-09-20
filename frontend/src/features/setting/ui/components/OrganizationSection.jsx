import React from "react";
import { Copy, Check } from "lucide-react";

export const OrganizationSection = ({
  organizationName,
  slug,
  copiedSlug,
  onNameChange,
  onCopySlug,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-[#E1D8D3] p-6 lg:p-7 shadow-xs transition-all duration-200">
      <div className="border-b border-[#E1D8D3] pb-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold font-epilogue text-[#1f1b18]">
          Organization
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7461] mt-0.5">
          Workspace identity displayed on public feedback pages and invitation emails.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="orgNameInput"
            className="block text-sm font-semibold text-[#1f1b18]"
          >
            Organization Name
          </label>
          <input
            id="orgNameInput"
            type="text"
            value={organizationName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. DesignFlow"
            className="w-full h-11 px-3.5 text-sm bg-white text-[#1f1b18] placeholder-[#7d7461]/60 border border-[#E1D8D3] rounded-xl shadow-xs focus:outline-none focus:border-[#bb0028] focus:ring-2 focus:ring-[#bb0028]/10 transition-colors"
          />
          <p className="text-xs text-[#7d7461]">
            Visible to customers as the sender in survey campaigns.
          </p>
        </div>

        {/* Workspace Slug */}
        <div className="space-y-1.5">
          <label
            htmlFor="orgSlugInput"
            className="block text-sm font-semibold text-[#1f1b18]"
          >
            Workspace Slug
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d7461] font-mono text-xs sm:text-sm select-none">
                recoz.io/f/
              </div>
              <input
                id="orgSlugInput"
                type="text"
                value={slug || "workspace"}
                readOnly
                className="w-full h-11 pl-24 sm:pl-26 pr-3.5 text-xs sm:text-sm font-mono bg-[#FBF2EC]/70 text-[#7d7461] border border-[#E1D8D3] rounded-xl cursor-not-allowed select-none focus:outline-none"
              />
            </div>
            <button
              type="button"
              id="copySlugBtn"
              onClick={onCopySlug}
              className="h-11 px-4 rounded-xl bg-[#FBF2EC] border border-[#E1D8D3] text-[#1f1b18] text-xs sm:text-sm font-medium hover:bg-[#eae1db] active:scale-98 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {copiedSlug ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="text-[#7d7461]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#7d7461]">
            Slug is fixed to prevent breaking live survey URLs and active webhooks.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OrganizationSection;
