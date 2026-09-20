import React from "react";
import { Lock, ShieldCheck } from "lucide-react";

export const ProfileSection = ({
  name,
  email,
  onNameChange,
}) => {
  return (
    <section className="bg-white rounded-2xl border border-[#E1D8D3] p-6 lg:p-7 shadow-xs transition-all duration-200">
      <div className="flex items-start justify-between border-b border-[#E1D8D3] pb-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-epilogue text-[#1f1b18]">
            Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#7d7461] mt-0.5">
            Your personal account identity.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBF2EC] text-[#7d7461] text-xs font-medium border border-[#E1D8D3]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Verified Session
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name (Editable Input) */}
        <div className="space-y-1.5">
          <label
            htmlFor="userNameInput"
            className="block text-sm font-semibold text-[#1f1b18]"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              id="userNameInput"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Aman Kumar Sahu"
              className="w-full h-11 px-3.5 text-sm bg-white text-[#1f1b18] placeholder-[#7d7461]/60 border border-[#E1D8D3] rounded-xl shadow-xs focus:outline-none focus:border-[#bb0028] focus:ring-2 focus:ring-[#bb0028]/10 transition-colors"
            />
          </div>
          <p className="text-xs text-[#7d7461]">
            Displayed on internal audit logs and workspace comments.
          </p>
        </div>

        {/* Email (Read-only Input with SSO badge) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="userEmailInput"
              className="block text-sm font-semibold text-[#1f1b18]"
            >
              Work Email
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7d7461] bg-[#FBF2EC] px-2 py-0.5 rounded-md border border-[#E1D8D3]">
              <Lock size={12} className="text-[#7d7461]" />
              SSO Enforced
            </span>
          </div>
          <div className="relative">
            <input
              id="userEmailInput"
              type="email"
              value={email || ""}
              readOnly
              className="w-full h-11 px-3.5 text-sm bg-[#FBF2EC]/70 text-[#7d7461] border border-[#E1D8D3] rounded-xl cursor-not-allowed select-none focus:outline-none"
            />
          </div>
          <p className="text-xs text-[#7d7461]">
            Managed via single sign-on (SSO). Contact your IT administrator to update.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
