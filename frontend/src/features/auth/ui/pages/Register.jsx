import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Mail,
  CheckCircle2,
  RotateCw,
} from "lucide-react";
import { registerSchema } from "../../validation/auth.schema";
import useAuth from "../../hook/useAuth";

export default function Register() {
  const {
    register: registerUser,
    isRegistering,
    isAuthenticated,
    isHydrating,
    error,
    verificationSent,
    registeredEmail,
    countdown,
    isResending,
    resendStatus,
    resendVerification,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      organizationName: "",
      password: "",
    },
    mode: "onTouched",
  });

  if (!isHydrating && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    await registerUser(data);
  };

  const handleResend = async () => {
    await resendVerification(registeredEmail);
  };

  return (
    <main className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#FFFAF3] text-[#1f1b18] antialiased selection:bg-[#F62440] selection:text-white">
      {/* LEFT PANEL: Dark Editorial Luxury Canvas (~46% desktop width) */}
      <section className="hidden lg:flex lg:w-[46%] w-full h-full bg-[#121110] text-[#f9efe9] relative flex-col justify-between p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#262321] dark-glow-grid dark-hairlines overflow-hidden">
        {/* Subtle atmospheric lighting overlay */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F62440]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#FFE5BF]/5 blur-3xl pointer-events-none" />

        {/* Top: Brand Lockup & Monogram */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#F62440] flex items-center justify-center shadow-lg shadow-[#F62440]/25 ring-1 ring-white/15">
              <span className="font-poppins font-bold text-white text-xl tracking-tight">
                R
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-poppins text-sm tracking-[0.14em] font-bold text-[#ffffff] uppercase leading-tight">
                RECOZ FEEDBACK
              </span>
              <span className="font-inter text-[10px] text-[#d1c5b0] tracking-[0.08em] uppercase font-medium mt-0.5">
                Enterprise Intelligence
              </span>
            </div>
          </div>

          {/* Eyebrow Pill */}
          <div className="mt-10 sm:mt-12 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F62440] animate-pulse" />
            <span className="font-inter text-[11px] font-semibold tracking-wider text-[#eee1cb] uppercase">
              Launch in minutes
            </span>
          </div>

          {/* Main Editorial Display Headline */}
          <h1 className="mt-6 font-poppins text-3xl sm:text-4xl lg:text-[38px] xl:text-[40px] font-semibold leading-[1.22] text-white tracking-tight">
            Create your workspace,
            <br className="hidden sm:inline" />
            publish a survey, and
            <br className="hidden sm:inline" />
            start hearing your
            <br className="hidden sm:inline" />
            customers today.
          </h1>

          {/* Value Propositions with Crimson Diamonds */}
          <div className="mt-10 space-y-4 max-w-lg">
            <div className="flex items-start gap-3.5">
              <span className="text-[#F62440] text-sm mt-0.5 select-none font-bold">
                ◆
              </span>
              <p className="font-inter text-sm text-[#e1d8d3] font-normal leading-snug">
                Public URL, QR code, and embeddable widget out of the box
              </p>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="text-[#F62440] text-sm mt-0.5 select-none font-bold">
                ◆
              </span>
              <p className="font-inter text-sm text-[#e1d8d3] font-normal leading-snug">
                Automatic NPS, CSAT, and CES computation
              </p>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="text-[#F62440] text-sm mt-0.5 select-none font-bold">
                ◆
              </span>
              <p className="font-inter text-sm text-[#e1d8d3] font-normal leading-snug">
                Sentiment and topic analysis on every response
              </p>
            </div>
          </div>
        </div>

        {/* Left Panel Footer: Reassurance */}
        <div className="relative z-10 pt-10 lg:pt-16 border-t border-white/10 mt-10 flex items-center justify-between text-xs text-[#a3978d]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F62440]" />
            <span className="font-inter tracking-normal text-[#d1c5b0]">
              No credit card required · Instant setup
            </span>
          </div>
          <span className="font-inter text-[10px] sm:text-[11px] text-[#7d7461] tracking-wider uppercase font-semibold">
            SOC2 TYPE II READY
          </span>
        </div>
      </section>

      {/* RIGHT PANEL: Light Luxury Form Canvas (~54% desktop width) */}
      <section className="lg:w-[54%] w-full h-full overflow-y-auto flex items-center justify-center p-6 sm:p-10 lg:p-12 relative scrollbar-none">
        <div className="w-full max-w-[440px] mx-auto my-auto py-6">
          {/* STATE 1: VERIFICATION EMAIL SENT SCREEN */}
          {verificationSent ? (
            <div className="w-full animate-in fade-in zoom-in-95 duration-200">
              {/* Icon badge */}
              <div className="w-16 h-16 rounded-2xl bg-[#F62440]/10 text-[#F62440] border border-[#F62440]/20 flex items-center justify-center mb-6 shadow-sm">
                <Mail className="w-8 h-8" />
              </div>

              {/* Title & details */}
              <h2 className="font-poppins text-3xl font-semibold text-[#1f1b18] tracking-tight leading-tight">
                Verify your email
              </h2>
              <p className="mt-3 font-inter text-sm text-[#6e5c3e] leading-relaxed">
                We've sent a verification link to{" "}
                <span className="font-semibold text-[#1f1b18] break-all">
                  {registeredEmail}
                </span>
                . Please check your inbox and click the link to activate your
                workspace.
              </p>

              {/* Status alerts */}
              {resendStatus && (
                <div
                  className={`mt-5 p-4 rounded-xl border flex items-start gap-3 text-xs font-inter transition-all shadow-sm ${
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

              {/* Action Box */}
              <div className="mt-8 p-5 bg-white border border-[#EFE4D6] rounded-xl space-y-4 shadow-sm">
                <p className="text-xs text-[#7d7461] font-inter leading-normal">
                  Didn't receive the email? Check your spam folder or request a
                  new verification email below:
                </p>

                {/* Resend button with countdown */}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isResending}
                  className={`w-full h-11 rounded-lg font-inter text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
                    countdown > 0 || isResending
                      ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                      : "bg-[#121110] hover:bg-[#262321] text-white cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
                  }`}
                >
                  {isResending ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Sending email...</span>
                    </>
                  ) : countdown > 0 ? (
                    <span>Resend email in {countdown}s</span>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Resend verification email</span>
                    </>
                  )}
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="mt-8 text-center pt-2">
                <p className="font-inter text-sm text-neutral-600">
                  Already verified your account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[#F62440] hover:text-[#D81B34] transition-colors underline-offset-4 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* STATE 2: REGISTRATION FORM */
            <>
              {/* Header Section */}
              <header className="mb-8">
                <h2 className="font-poppins text-3xl font-semibold text-[#1f1b18] tracking-tight leading-tight">
                  Create your workspace
                </h2>
                <p className="mt-2 font-inter text-sm text-[#6e5c3e] leading-relaxed">
                  One account, one organization, endless customer insights.
                </p>
              </header>

              {/* Backend Error Alert */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-[#F62440]/30 flex items-start gap-3 text-red-950 transition-all shadow-sm">
                  <AlertCircle className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-inter text-xs font-semibold text-[#bb0028]">
                      Registration failed
                    </h4>
                    <p className="font-inter text-xs text-neutral-700 mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Google OAuth Button */}
              <a
                href={
                  import.meta.env.PROD
                    ? "https://ricoz-feedback-production.up.railway.app/api/auth/google"
                    : `http://localhost:5000/api/auth/google`
                }
                className="w-full h-[44px] rounded-lg bg-white border border-[#e5e0db] hover:bg-neutral-50 active:bg-neutral-100 text-[#1f1b18] font-inter text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer mb-5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </a>

              {/* Divider */}
              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-[#e5e0db]"></div>
                <span className="flex-shrink mx-4 text-xs font-inter text-[#7d7461] uppercase tracking-wider">
                  or continue with email
                </span>
                <div className="flex-grow border-t border-[#e5e0db]"></div>
              </div>

              {/* Registration Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Field 1: Your Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] font-inter mb-1.5"
                  >
                    YOUR NAME
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Aman Sahu"
                      disabled={isRegistering}
                      className={`w-full h-[42px] px-3.5 bg-white border rounded-lg text-sm text-[#1f1b18] placeholder-[#926e6d]/60 font-inter focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all duration-150 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                        errors.name
                          ? "border-[#bb0028] bg-rose-50/20 ring-1 ring-[#bb0028]/30"
                          : "border-[#e5e0db]"
                      }`}
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-[#bb0028] font-inter flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                {/* Field 2: Organization Name */}
                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] font-inter mb-1.5"
                  >
                    ORGANIZATION NAME
                  </label>
                  <div className="relative">
                    <input
                      id="organizationName"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Studio"
                      disabled={isRegistering}
                      className={`w-full h-[42px] px-3.5 bg-white border rounded-lg text-sm text-[#1f1b18] placeholder-[#926e6d]/60 font-inter focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all duration-150 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                        errors.organizationName
                          ? "border-[#bb0028] bg-rose-50/20 ring-1 ring-[#bb0028]/30"
                          : "border-[#e5e0db]"
                      }`}
                      {...register("organizationName")}
                    />
                  </div>
                  {errors.organizationName ? (
                    <p className="mt-1 text-xs text-[#bb0028] font-inter flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.organizationName.message}</span>
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-[#7d7461] font-inter leading-normal">
                      This name will appear on your public feedback pages.
                    </p>
                  )}
                </div>

                {/* Field 3: Work Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] font-inter mb-1.5"
                  >
                    WORK EMAIL
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      disabled={isRegistering}
                      className={`w-full h-[42px] px-3.5 bg-white border rounded-lg text-sm text-[#1f1b18] placeholder-[#926e6d]/60 font-inter focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all duration-150 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                        errors.email
                          ? "border-[#bb0028] bg-rose-50/20 ring-1 ring-[#bb0028]/30"
                          : "border-[#e5e0db]"
                      }`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#bb0028] font-inter flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* Field 4: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-[#5d3f3e] font-inter"
                    >
                      PASSWORD
                    </label>
                    <span className="text-[11px] text-[#7d7461] font-inter">
                      Minimum 6 characters
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      disabled={isRegistering}
                      className={`w-full h-[42px] pl-3.5 pr-10 bg-white border rounded-lg text-sm text-[#1f1b18] placeholder-[#926e6d]/60 font-inter focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all duration-150 disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                        errors.password
                          ? "border-[#bb0028] bg-rose-50/20 ring-1 ring-[#bb0028]/30"
                          : "border-[#e5e0db]"
                      }`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7d7461] hover:text-[#1f1b18] transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-[#bb0028] font-inter flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.password.message}</span>
                    </p>
                  )}
                </div>

                {/* Terms notice */}
                <div className="pt-1">
                  <p className="text-[11px] text-[#7d7461] font-inter leading-relaxed">
                    By creating a workspace, you agree to our{" "}
                    <span className="underline text-[#5d3f3e] cursor-pointer hover:text-[#bb0028]">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="underline text-[#5d3f3e] cursor-pointer hover:text-[#bb0028]">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>

                {/* Primary Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full h-12 bg-[#F62440] text-white font-poppins font-medium text-sm rounded-lg shadow-sm hover:bg-[#d91d35] active:bg-[#BA1227] transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group shadow-md shadow-[#F62440]/20"
                  >
                    {isRegistering ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Creating workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Create workspace</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Secondary Action Link */}
              <div className="mt-8 text-center">
                <p className="text-sm font-inter text-[#6e5c3e]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#F62440] font-medium hover:underline ml-1 inline-flex items-center"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Trust Note at Bottom */}
          <div className="mt-10 pt-6 border-t border-[#efe4d6] flex items-center justify-center gap-2 text-[#7d7461]">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-inter text-xs tracking-normal">
              256-bit TLS Encrypted · Enterprise Grade Security
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
