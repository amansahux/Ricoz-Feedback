import React from "react";
import { Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router";

export const SecuritySection = ({
  passwordData,
  passwordError,
  showVisibility,
  isChangingPassword,
  onPasswordChange,
  onToggleVisibility,
  onSubmit,
}) => {
  return (
    <section
      id="securitySection"
      className="bg-white rounded-2xl border border-[#E1D8D3] p-6 lg:p-7 shadow-xs transition-all duration-200"
    >
      <div className="border-b border-[#E1D8D3] pb-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold font-epilogue text-[#1f1b18]">
          Security
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7461] mt-0.5">
          Keep your Recoz account secure.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[#1f1b18]">
            Change password
          </h3>
          <p className="text-xs sm:text-sm text-[#7d7461] mt-0.5">
            Update your password by confirming your current password first.
          </p>
        </div>

        {/* Inline Error Alert */}
        {passwordError && (
          <div className="p-3.5 rounded-xl bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={18} className="text-[#ba1a1a] shrink-0" />
            <span className="font-medium">{passwordError}</span>
          </div>
        )}

        {/* Password Form Fields */}
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="currentPasswordInput"
              className="block text-xs font-semibold uppercase tracking-wider text-[#7d7461]"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPasswordInput"
                type={showVisibility.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => onPasswordChange("currentPassword", e.target.value)}
                placeholder="Enter current password"
                className="w-full h-11 px-3.5 pr-11 text-sm bg-white text-[#1f1b18] placeholder-[#7d7461]/60 border border-[#E1D8D3] rounded-xl shadow-xs focus:outline-none focus:border-[#bb0028] focus:ring-2 focus:ring-[#bb0028]/10 transition-colors"
              />
              <button
                type="button"
                aria-label="Toggle current password visibility"
                onClick={() => onToggleVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7d7461] hover:text-[#1f1b18] transition-colors cursor-pointer"
              >
                {showVisibility.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="newPasswordInput"
              className="block text-xs font-semibold uppercase tracking-wider text-[#7d7461]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPasswordInput"
                type={showVisibility.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => onPasswordChange("newPassword", e.target.value)}
                placeholder="Enter new password"
                className="w-full h-11 px-3.5 pr-11 text-sm bg-white text-[#1f1b18] placeholder-[#7d7461]/60 border border-[#E1D8D3] rounded-xl shadow-xs focus:outline-none focus:border-[#bb0028] focus:ring-2 focus:ring-[#bb0028]/10 transition-colors"
              />
              <button
                type="button"
                aria-label="Toggle new password visibility"
                onClick={() => onToggleVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7d7461] hover:text-[#1f1b18] transition-colors cursor-pointer"
              >
                {showVisibility.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-[#7d7461]">
              Minimum 8 characters. Must contain letters and numbers.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPasswordInput"
              className="block text-xs font-semibold uppercase tracking-wider text-[#7d7461]"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPasswordInput"
                type={showVisibility.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordChange("confirmPassword", e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-11 px-3.5 pr-11 text-sm bg-white text-[#1f1b18] placeholder-[#7d7461]/60 border border-[#E1D8D3] rounded-xl shadow-xs focus:outline-none focus:border-[#bb0028] focus:ring-2 focus:ring-[#bb0028]/10 transition-colors"
              />
              <button
                type="button"
                aria-label="Toggle confirm password visibility"
                onClick={() => onToggleVisibility("confirm")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7d7461] hover:text-[#1f1b18] transition-colors cursor-pointer"
              >
                {showVisibility.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Change Password Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="py-2.5 px-6 rounded-xl bg-[#bb0028] text-white text-sm font-semibold hover:bg-[#92001d] active:scale-98 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isChangingPassword && <Loader2 size={16} className="animate-spin" />}
              <span>{isChangingPassword ? "Changing password..." : "Change password"}</span>
            </button>
          </div>
        </form>

        {/* Forgot Password Link Section */}
        <div className="border-t border-[#E1D8D3]/60 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-[#1f1b18]">
              Forgot your password?
            </h4>
            <p className="text-xs sm:text-sm text-[#7d7461] mt-0.5">
              You can reset your password using your account email.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="text-xs sm:text-sm font-semibold text-[#bb0028] hover:underline inline-flex items-center gap-1.5 shrink-0 group"
          >
            <span>Reset your password</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
