import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Lock, AlertCircle, ArrowRight, CheckCircle2, Mail, RotateCw } from 'lucide-react';
import { loginSchema } from '../../validation/auth.schema';
import useAuth from '../../hook/useAuth';
import { resendVerificationEmail } from '../../api/auth.api';

export default function Login() {
  const { login, isLoggingIn, isAuthenticated, isHydrating, error, resetError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  // Verification states
  const isVerifiedSuccess = searchParams.get('verified') === 'true';
  const isGoogleFailed = searchParams.get('error') === 'google_auth_failed';

  // Unverified user resend state & countdown
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null); // { type: 'success' | 'error', text: string }

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  // Countdown timer for resend email
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  if (!isHydrating && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const isUnverifiedError =
    error && (error.toLowerCase().includes('not verified') || error.toLowerCase().includes('verify your email'));

  const onSubmit = async (data) => {
    resetError?.();
    setResendStatus(null);
    await login(data);
  };

  const handleResend = async () => {
    const email = getValues('email');
    if (!email) {
      setResendStatus({ type: 'error', text: 'Please enter your email above to resend verification link' });
      return;
    }
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setResendStatus(null);
    try {
      const res = await resendVerificationEmail(email);
      setResendStatus({
        type: 'success',
        text: res.message || 'Verification email resent! Please check your inbox.',
      });
      setCountdown(60);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend verification email';
      setResendStatus({ type: 'error', text: msg });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row bg-[#FFFAF3] text-[#1f1b18] antialiased selection:bg-[#F62440] selection:text-white">
      {/* LEFT PANEL: Editorial Storytelling Surface (Desktop ~46%, Hidden on Mobile) */}
      <section className="hidden lg:flex lg:w-[46%] w-full min-h-screen bg-[#121110] text-[#f9efe9] flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-hidden charcoal-grid-bg border-b lg:border-b-0 lg:border-r border-[#262321] dark-glow-grid dark-hairlines">
        {/* Atmospheric Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F62440]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FFE5BF]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Brand Anchor */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F62440] flex items-center justify-center shadow-lg shadow-[#F62440]/25 ring-1 ring-white/20">
            <span className="font-poppins text-lg text-white font-bold tracking-tight">R</span>
          </div>
          <div>
            <h1 className="font-poppins text-sm font-bold tracking-[0.14em] text-white uppercase leading-tight">
              RECOZ FEEDBACK
            </h1>
            <p className="font-inter text-[10px] tracking-[0.08em] text-[#f9dfb9]/80 uppercase font-medium mt-0.5">
              Enterprise Intelligence
            </p>
          </div>
        </div>

        {/* Center Narrative Cluster */}
        <div className="relative z-10 max-w-xl my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF2DB]/10 border border-[#FFF2DB]/20 text-[#FFE5BF] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F62440] animate-pulse" />
            <span className="font-inter text-[11px] tracking-widest uppercase font-semibold">
              CUSTOMER VOICE, IN ONE PLACE
            </span>
          </div>

          <h2 className="font-epilogue text-3xl xl:text-4xl font-semibold text-white tracking-tight leading-[1.25] mb-8">
            Turn every piece of customer feedback into a decision you can act on.
          </h2>

          {/* Translucent Glass Testimonial Card */}
          <div className="rounded-2xl p-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl relative">
            {/* 5 Stars in Warm Peach / Gold */}
            <div className="flex items-center gap-1 mb-3 text-[#f9dfb9]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-[#f9dfb9]" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <blockquote className="font-inter text-sm md:text-base text-neutral-200 mb-4 leading-relaxed italic">
              "We closed 43 support tickets in the first week. Recoz surfaces the noise we used to miss."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-[#f9dfb9] border border-white/15">
                NC
              </div>
              <div>
                <p className="font-inter text-xs text-neutral-300 font-medium">Head of CX, Northwind Coffee</p>
                <p className="font-inter text-[11px] text-neutral-500">Global Operations Customer Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Footer Anchor */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5 text-neutral-400">
          <p className="font-inter text-xs">Recoz · Feedback that turns into action</p>
          <span className="font-inter text-[11px] text-neutral-500">v3.1 Enterprise Core</span>
        </div>
      </section>

      {/* RIGHT PANEL: Authentication Surface (Warm White Canvas #FFFAF3) */}
      <section className="lg:w-[54%] w-full min-h-screen flex flex-col justify-between bg-[#FFFAF3] p-6 sm:p-12 lg:p-16 relative">
        {/* Mobile Only Top Brand Header Bar */}
        <div className="lg:hidden flex items-center justify-between pb-6 pt-2 border-b border-[#EFE4D6]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F62440] flex items-center justify-center shadow-md">
              <span className="font-poppins text-base text-white font-bold">R</span>
            </div>
            <div>
              <span className="font-poppins text-sm font-semibold tracking-tight text-[#1f1b18] block">
                RECOZ FEEDBACK
              </span>
              <span className="block font-inter text-[10px] text-neutral-500 uppercase tracking-wider">
                Enterprise Intelligence
              </span>
            </div>
          </div>
          <span className="font-inter text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF2DB] text-[#746243] font-medium border border-[#E6D7C3]/60">
            Sign In
          </span>
        </div>
        <div className="hidden lg:block" />

        {/* Centered Authentication Form Box */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Heading Block */}
          <div className="mb-8">
            <h2 className="font-poppins text-3xl font-semibold text-[#1f1b18] tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="font-inter text-sm text-neutral-600">
              Sign in to your Recoz workspace.
            </p>
          </div>

          {/* Email Verified Banner */}
          {isVerifiedSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50/90 border border-emerald-300/60 flex items-start gap-3 text-emerald-950 transition-all shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-inter text-xs font-semibold text-emerald-900">Email verified successfully!</h4>
                <p className="font-inter text-xs text-emerald-800 mt-0.5">
                  Your workspace is now active. Please sign in with your credentials below.
                </p>
              </div>
            </div>
          )}

          {/* Google Auth Failed Banner */}
          {isGoogleFailed && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-[#F62440]/30 flex items-start gap-3 text-red-950 transition-all shadow-sm">
              <AlertCircle className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-inter text-xs font-semibold text-[#bb0028]">Google Sign-in Failed</h4>
                <p className="font-inter text-xs text-neutral-700 mt-0.5">
                  Unable to sign in with Google. Please try again or use your password.
                </p>
              </div>
            </div>
          )}

          {/* Resend Status Banner */}
          {resendStatus && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-xs font-inter transition-all shadow-sm ${
                resendStatus.type === 'success'
                  ? 'bg-emerald-50/90 border-emerald-300/60 text-emerald-950'
                  : 'bg-red-50/90 border-red-300/60 text-red-950'
              }`}
            >
              {resendStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#bb0028] shrink-0 mt-0.5" />
              )}
              <span>{resendStatus.text}</span>
            </div>
          )}

          {/* Backend Error Banner */}
          {error && !isGoogleFailed && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/90 border border-[#F62440]/30 flex flex-col gap-3 text-red-950 transition-all shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-inter text-xs font-semibold text-[#bb0028]">Authentication failed</h4>
                  <p className="font-inter text-xs text-neutral-700 mt-0.5">{error}</p>
                </div>
              </div>

              {/* If user is unverified, offer inline resend verification button */}
              {isUnverifiedError && (
                <div className="pt-2 border-t border-red-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-600 font-inter">Need a new verification link?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={countdown > 0 || isResending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121110] hover:bg-[#262321] text-white text-xs font-medium transition-all cursor-pointer disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : countdown > 0 ? (
                      <span>Resend in {countdown}s</span>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Resend Email</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google OAuth Button */}
          <a
            href="http://localhost:5000/api/auth/google"
            className="w-full h-[46px] rounded-xl bg-white border border-[#EFE4D6] hover:bg-neutral-50 active:bg-neutral-100 text-[#1f1b18] font-inter text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </a>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-[#EFE4D6]"></div>
            <span className="flex-shrink mx-4 text-xs font-inter text-neutral-400 uppercase tracking-wider">or sign in with email</span>
            <div className="flex-grow border-t border-[#EFE4D6]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block font-inter text-[11px] font-semibold tracking-wider text-neutral-700 uppercase mb-2"
              >
                EMAIL
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  disabled={isLoggingIn}
                  className={`w-full h-[46px] px-4 rounded-xl bg-white border text-[#1f1b18] font-inter text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all shadow-sm disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                    errors.email ? 'border-[#bb0028] bg-rose-50/20 ring-1 ring-[#bb0028]/30' : 'border-[#EFE4D6]'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-[#bb0028] font-inter flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block font-inter text-[11px] font-semibold tracking-wider text-neutral-700 uppercase"
                >
                  PASSWORD
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  disabled={isLoggingIn}
                  className={`w-full h-[46px] pl-4 pr-11 rounded-xl bg-white border text-[#1f1b18] font-inter text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 transition-all shadow-sm disabled:bg-neutral-100 disabled:cursor-not-allowed ${
                    errors.password ? 'border-[#bb0028] bg-rose-50/20 ring-1 ring-[#bb0028]/30' : 'border-[#EFE4D6]'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 focus:outline-none p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-[#bb0028] font-inter flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Primary CTA Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-[46px] rounded-xl bg-[#F62440] hover:bg-[#D81B34] active:bg-[#BA1227] text-white font-inter text-sm font-medium tracking-wide shadow-md shadow-[#F62440]/20 hover:shadow-lg hover:shadow-[#F62440]/30 transition-all duration-150 ease-out flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-6"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secondary Action Link */}
          <div className="mt-8 text-center pt-2">
            <p className="font-inter text-sm text-neutral-600">
              New to Recoz?{' '}
              <Link
                to="/register"
                className="font-medium text-[#F62440] hover:text-[#D81B34] transition-colors underline-offset-4 hover:underline"
              >
                Create workspace
              </Link>
            </p>
          </div>
        </div>

        {/* Security / Trust Indicator Footnote */}
        <div className="pt-6 border-t border-[#EFE4D6]/60 flex items-center justify-between text-neutral-500 font-inter text-xs">
          <span className="flex items-center gap-1.5 text-neutral-600">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            256-bit TLS Encrypted
          </span>
          <span className="text-neutral-400">Recoz Feedback Enterprise</span>
        </div>
      </section>
    </main>
  );
}