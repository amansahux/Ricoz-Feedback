import React, { useRef } from "react";
import { Link } from "react-router";
import {
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  RotateCw,
  Clock,
} from "lucide-react";
import { useForgotPassword } from "../../hook/useForgotPassword";

export default function ForgotPassword() {
  const {
    currentStep,
    goToStep,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSubmittingEmail,
    isResettingPassword,
    isResendingOtp,
    error,
    clearError,
    resendStatus,
    countdown,
    handleSendOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
    calculateStrength,
  } = useForgotPassword();

  const otpInputsRef = useRef([]);

  const handleOtpChange = (index, value) => {
    // Only accept numeric characters
    const char = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    clearError();

    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d+$/.test(pasted)) {
      const chars = pasted.split("").slice(0, 6);
      const newOtp = [...otp];
      chars.forEach((c, idx) => {
        newOtp[idx] = c;
      });
      setOtp(newOtp);
      clearError();
      const nextFocus = Math.min(chars.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
    }
  };

  const strength = calculateStrength(newPassword);

  return (
    <main className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#FFFAF3] text-[#1f1b18] antialiased selection:bg-[#F62440] selection:text-white">
      {/* ========================================== */}
      {/* LEFT EDITORIAL BRAND PANEL (~46%)        */}
      {/* ========================================== */}
      <section className="hidden lg:flex lg:w-[46%] w-full h-full bg-[#121110] text-[#FFFAF3] relative flex-col justify-between p-8 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-[#262422] overflow-hidden charcoal-grid-bg dark-glow-grid dark-hairlines">
        {/* Atmospheric Ambient Glow & Grid */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F62440]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FFE5BF]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Block */}
        <div className="relative z-10">
          <Link to="/login" className="flex items-center gap-3.5 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-[#F62440] flex items-center justify-center shadow-lg shadow-[#F62440]/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-epilogue font-bold text-lg leading-none tracking-tight">R</span>
            </div>
            <div>
              <div className="font-poppins text-sm font-bold tracking-[0.14em] text-white flex items-center gap-2 uppercase leading-tight">
                RECOZ FEEDBACK
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F62440] animate-pulse" />
              </div>
              <div className="text-[10px] tracking-[0.08em] font-medium text-[#DAC1A2]/80 uppercase font-inter mt-0.5">
                Enterprise Intelligence
              </div>
            </div>
          </Link>

          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F62440] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider text-[#FFFAF3]/90 uppercase font-inter">
              Customer Voice, In One Place
            </span>
          </div>

          {/* Editorial Headline & Copy */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-epilogue font-semibold text-white tracking-tight leading-[1.22] mb-4 max-w-lg">
            Your feedback deserves a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFFAF3] to-[#FFE5BF]">
              secure place
            </span>{" "}
            to live.
          </h1>
          <p className="text-sm sm:text-base font-inter text-[#DAC1A2]/80 max-w-md leading-relaxed">
            Recover your Recoz workspace securely and get back to understanding your customers without operational friction.
          </p>

          {/* Security Features */}
          <div className="mt-8 space-y-3.5 max-w-md">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all hover:bg-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-[#F62440]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#F62440]">
                <KeyRound size={15} />
              </div>
              <div>
                <div className="text-white font-inter font-medium text-xs sm:text-sm">
                  6-digit one-time cryptographic verification
                </div>
                <div className="text-[#DAC1A2]/60 text-xs mt-0.5">
                  High-entropy time-gated tokens with automated 5-minute expiry.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all hover:bg-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-[#F62440]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#F62440]">
                <ShieldCheck size={15} />
              </div>
              <div>
                <div className="text-white font-inter font-medium text-xs sm:text-sm">
                  Zero-leak enumeration protection
                </div>
                <div className="text-[#DAC1A2]/60 text-xs mt-0.5">
                  Uniform server response timings protect account privacy completely.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all hover:bg-white/[0.05]">
              <div className="w-7 h-7 rounded-lg bg-[#F62440]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#F62440]">
                <RotateCw size={15} />
              </div>
              <div>
                <div className="text-white font-inter font-medium text-xs sm:text-sm">
                  Instant session re-authentication upon reset
                </div>
                <div className="text-[#DAC1A2]/60 text-xs mt-0.5">
                  Single-click immediate token invalidation across legacy sessions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Bottom Security Footer */}
        <div className="relative z-10 pt-6 mt-8 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#DAC1A2]/60">
          <span className="font-medium text-white/80">Recoz · Feedback that turns into action</span>
          <div className="flex items-center gap-1.5">
            <Lock size={13} className="text-emerald-400" />
            <span>256-bit TLS Encrypted</span>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* RIGHT RECOVERY FORM PANEL (~54%)          */}
      {/* ========================================== */}
      <section className="lg:w-[54%] w-full h-full overflow-y-auto flex flex-col justify-between bg-[#FFFAF3] p-6 sm:p-10 lg:p-14 relative scrollbar-none">
        {/* Top Progress Bar & Stepper Indicator */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Only Header Bar */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#EFE4D6]">
            <Link to="/login" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F62440] flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <span className="font-poppins text-xs font-semibold text-[#1f1b18]">
                RECOZ FEEDBACK
              </span>
            </Link>
            <span className="font-inter text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF2DB] text-[#746243] font-medium border border-[#E6D7C3]">
              Recovery
            </span>
          </div>

          {/* Stepper Navigation Indicator */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EFE4D6]">
            {/* Step 1 Node */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                  currentStep === 1
                    ? "bg-[#F62440] text-white"
                    : currentStep > 1
                    ? "bg-emerald-600 text-white"
                    : "bg-[#EAE1DB] text-[#5d3f3e]"
                }`}
              >
                {currentStep > 1 ? "✓" : "1"}
              </div>
              <span
                className={`text-xs ${
                  currentStep === 1
                    ? "font-semibold text-[#1f1b18]"
                    : currentStep > 1
                    ? "font-medium text-[#1f1b18]"
                    : "font-medium text-[#7d7461]"
                }`}
              >
                Email
              </span>
            </div>

            <div
              className={`w-10 h-[2px] transition-colors ${
                currentStep > 1 ? "bg-emerald-600" : "bg-[#EAE1DB]"
              }`}
            />

            {/* Step 2 Node */}
            <div className={`flex items-center gap-2 ${currentStep < 2 ? "opacity-50" : ""}`}>
              <div
                className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                  currentStep === 2
                    ? "bg-[#F62440] text-white"
                    : currentStep > 2
                    ? "bg-emerald-600 text-white"
                    : "bg-[#EAE1DB] text-[#5d3f3e]"
                }`}
              >
                {currentStep > 2 ? "✓" : "2"}
              </div>
              <span
                className={`text-xs ${
                  currentStep === 2
                    ? "font-semibold text-[#1f1b18]"
                    : currentStep > 2
                    ? "font-medium text-[#1f1b18]"
                    : "font-medium text-[#7d7461]"
                }`}
              >
                Verify
              </span>
            </div>

            <div
              className={`w-10 h-[2px] transition-colors ${
                currentStep > 2 ? "bg-emerald-600" : "bg-[#EAE1DB]"
              }`}
            />

            {/* Step 3 Node */}
            <div className={`flex items-center gap-2 ${currentStep < 3 ? "opacity-50" : ""}`}>
              <div
                className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                  currentStep === 3
                    ? "bg-[#F62440] text-white"
                    : currentStep > 3
                    ? "bg-emerald-600 text-white"
                    : "bg-[#EAE1DB] text-[#5d3f3e]"
                }`}
              >
                {currentStep > 3 ? "✓" : "3"}
              </div>
              <span
                className={`text-xs ${
                  currentStep === 3
                    ? "font-semibold text-[#1f1b18]"
                    : currentStep > 3
                    ? "font-medium text-[#1f1b18]"
                    : "font-medium text-[#7d7461]"
                }`}
              >
                Reset
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Multi-Step Flow */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-[#F62440]/30 text-red-950 flex items-start gap-3 transition-all shadow-sm">
              <AlertCircle className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-semibold text-[#bb0028] block">Error occurred</span>
                <span className="text-neutral-700 mt-0.5 block">{error}</span>
              </div>
            </div>
          )}

          {/* Resend Status Banner */}
          {resendStatus && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-xs font-inter transition-all shadow-sm ${
                resendStatus.type === "success"
                  ? "bg-emerald-50/90 border-emerald-300/60 text-emerald-950"
                  : "bg-red-50/90 border-red-300/60 text-red-950"
              }`}
            >
              {resendStatus.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#bb0028] shrink-0 mt-0.5" />
              )}
              <span>{resendStatus.text}</span>
            </div>
          )}

          {/* ========================================== */}
          {/* STEP 1: EMAIL IDENTIFICATION               */}
          {/* ========================================== */}
          {currentStep === 1 && (
            <section className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2DB] border border-[#E6D7C3] flex items-center justify-center mb-5 text-[#746243] shadow-xs">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight leading-tight">
                  Forgot your password?
                </h2>
                <p className="font-inter text-sm text-[#7d7461] mt-2 leading-relaxed">
                  Enter your account email and we'll send you a 6-digit verification code.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp();
                }}
                className="space-y-5"
                noValidate
              >
                <div className="space-y-2">
                  <label
                    htmlFor="recovery-email"
                    className="block font-inter text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                  >
                    WORK EMAIL
                  </label>
                  <div className="relative">
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      disabled={isSubmittingEmail}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                      }}
                      className="w-full h-[46px] px-4 rounded-xl bg-white border border-[#EFE4D6] text-[#1f1b18] font-inter text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all shadow-sm disabled:bg-neutral-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Security Assurance Note */}
                <div className="p-3.5 rounded-xl bg-[#FBF2EC] border border-[#EFE4D6]/70 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#F62440] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5d3f3e] leading-relaxed">
                    <span className="font-semibold text-[#1f1b18]">Zero-enumeration guarantee:</span> If an account matches this email, a code is dispatched immediately.
                  </p>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmittingEmail || !email.trim()}
                  className="w-full h-[46px] rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-white font-inter text-sm font-medium shadow-md shadow-[#F62440]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmittingEmail ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-sm font-inter text-[#7d7461]">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[#F62440] hover:text-[#D81B34] hover:underline ml-1"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </section>
          )}

          {/* ========================================== */}
          {/* STEP 2: OTP VERIFICATION                   */}
          {/* ========================================== */}
          {currentStep === 2 && (
            <section className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2DB] border border-[#E6D7C3] flex items-center justify-center mb-5 text-[#746243] shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight leading-tight">
                  Check your email
                </h2>
                <div className="mt-2 text-sm font-inter text-[#7d7461] leading-relaxed">
                  <span>Enter the 6-digit verification code sent to </span>
                  <span className="font-semibold text-[#1f1b18]">{email}</span>.
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="inline-flex items-center gap-1 text-[#F62440] text-xs font-semibold hover:underline ml-2 cursor-pointer"
                  >
                    ← Change email
                  </button>
                </div>
              </div>

              {/* 6-digit OTP Inputs Box */}
              <div className="space-y-3">
                <label className="block font-inter text-[11px] font-semibold tracking-wider text-neutral-700 uppercase">
                  ONE-TIME PASSCODE
                </label>
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-full aspect-square text-center font-mono text-xl sm:text-2xl font-bold bg-white border border-[#EFE4D6] rounded-xl focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 focus:outline-none transition-all shadow-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Timer and Resend Controls */}
              <div className="flex items-center justify-between text-xs font-inter text-[#7d7461] py-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {countdown > 0 ? (
                    <span>
                      Code expires in{" "}
                      <span className="font-mono font-semibold text-[#1f1b18]">
                        00:{countdown < 10 ? `0${countdown}` : countdown}
                      </span>
                    </span>
                  ) : (
                    <span className="text-[#bb0028] font-medium">Code expired</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResendingOtp}
                  className="text-xs font-semibold text-[#F62440] disabled:text-[#7d7461]/50 hover:underline disabled:no-underline disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {isResendingOtp ? "Sending..." : "Resend code"}
                </button>
              </div>

              {/* Verification CTA */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otp.join("").length < 6}
                className="w-full h-[46px] rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-white font-inter text-sm font-medium shadow-md shadow-[#F62440]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>Verify code</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Back link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-xs sm:text-sm font-inter text-[#7d7461] hover:text-[#1f1b18] inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to email address</span>
                </button>
              </div>
            </section>
          )}

          {/* ========================================== */}
          {/* STEP 3: RESET PASSWORD                    */}
          {/* ========================================== */}
          {currentStep === 3 && (
            <section className="space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF2DB] border border-[#E6D7C3] flex items-center justify-center mb-5 text-[#746243] shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight leading-tight">
                  Set a new password
                </h2>
                <p className="font-inter text-sm text-[#7d7461] mt-2 leading-relaxed">
                  Create a strong new password for your Recoz workspace.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
                className="space-y-5"
                noValidate
              >
                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="new-password"
                    className="block font-inter text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                  >
                    NEW PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        clearError();
                      }}
                      className="w-full h-[46px] pl-4 pr-11 bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] text-sm focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter bar */}
                  <div className="pt-1.5 space-y-1">
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-[#EAE1DB] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strength.score >= 1
                            ? strength.score === 1
                              ? "bg-red-500"
                              : strength.score === 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-[#EAE1DB]"
                        }`}
                      />
                      <div
                        className={`h-full transition-all ${
                          strength.score >= 2
                            ? strength.score === 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-[#EAE1DB]"
                        }`}
                      />
                      <div
                        className={`h-full transition-all ${
                          strength.score >= 3 ? "bg-emerald-500" : "bg-[#EAE1DB]"
                        }`}
                      />
                      <div
                        className={`h-full transition-all ${
                          strength.score >= 4 ? "bg-emerald-500" : "bg-[#EAE1DB]"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#7d7461] font-inter">
                      <span>Minimum 6 characters (letters & numbers)</span>
                      <span
                        className={`font-semibold ${
                          strength.score === 1
                            ? "text-red-600"
                            : strength.score === 2
                            ? "text-amber-600"
                            : strength.score >= 3
                            ? "text-emerald-600"
                            : "text-[#7d7461]"
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="block font-inter text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearError();
                      }}
                      className="w-full h-[46px] pl-4 pr-11 bg-white border border-[#EFE4D6] rounded-xl text-[#1f1b18] text-sm focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={
                    isResettingPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword.length < 6
                  }
                  className="w-full h-[46px] rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-white font-inter text-sm font-medium shadow-md shadow-[#F62440]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isResettingPassword ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-xs sm:text-sm font-inter text-[#7d7461] hover:text-[#1f1b18] inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to verification code</span>
                </button>
              </div>
            </section>
          )}

          {/* ========================================== */}
          {/* STEP 4: SUCCESS CONFIRMATION               */}
          {/* ========================================== */}
          {currentStep === 4 && (
            <section className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </div>

              <div>
                <h2 className="font-poppins text-2xl sm:text-3xl font-semibold text-[#1f1b18] tracking-tight leading-tight">
                  Password reset successfully.
                </h2>
                <p className="font-inter text-sm text-[#7d7461] mt-2 max-w-sm mx-auto leading-relaxed">
                  Your password has been securely updated. You can now sign in to your Recoz workspace.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#EFE4D6] shadow-sm max-w-xs mx-auto flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-inter">
                  <div className="font-semibold text-[#1f1b18]">Sessions Re-authenticated</div>
                  <div className="text-[#7d7461]">Active credentials updated</div>
                </div>
              </div>

              <div>
                <Link
                  to="/login"
                  className="w-full h-[46px] rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-white font-inter text-sm font-medium shadow-md shadow-[#F62440]/20 inline-flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue to sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Right Bottom Footer Details */}
        <div className="w-full max-w-md mx-auto pt-6 border-t border-[#EFE4D6] flex items-center justify-between text-xs text-[#7d7461]">
          <span>© 2025 Recoz Feedback Enterprise</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:underline hover:text-[#1f1b18]">
              Sign In
            </Link>
            <Link to="/register" className="hover:underline hover:text-[#1f1b18]">
              Register
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}