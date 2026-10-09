import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useTeam } from "../../hooks/useTeam.jsx";
import { useAuth } from "../../../auth/hook/useAuth.jsx";
import ToastNotification from "../../../surveys/ui/components/shared/ToastNotification.jsx";
import {
  Shield,
  CheckCircle2,
  Clock,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowUpRight,
  AlertCircle,
  Users,
  AlertTriangle,
  RefreshCw,
  Building,
} from "lucide-react";

export default function AcceptInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    invitationDetails,
    isLoadingInvitation,
    invitationError,
    acceptInvitation,
    isAcceptingInvitation,
    currentUser,
    toast,
    showToast,
    hideToast,
  } = useTeam({ invitationToken: token });

  // Form states
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Form Submission
  const handleAccept = async (e) => {
    e.preventDefault();

    if (!invitationDetails?.userExists && password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      await acceptInvitation({
        token,
        name: fullName || invitationDetails?.email?.split("@")[0],
        email: invitationDetails?.email,
        password: password || undefined,
      });

      setIsSuccess(true);
      showToast("Invitation accepted! Welcome to the team.", "success");

      // Redirect to dashboard after 2.5 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2500);
    } catch (err) {
      // Error handled inside useTeam hook
    }
  };

  // 1. Loading Skeleton State
  if (isLoadingInvitation) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between items-center px-4 py-8">
        <div className="w-full max-w-[580px] bg-white rounded-2xl border border-[#eae1db] p-8 shadow-sm animate-pulse space-y-6">
          <div className="h-5 bg-[#f6ece7] rounded w-1/3" />
          <div className="h-8 bg-[#f6ece7] rounded w-2/3" />
          <div className="h-20 bg-[#f6ece7] rounded-xl" />
          <div className="space-y-3 pt-4">
            <div className="h-10 bg-[#f6ece7] rounded-lg" />
            <div className="h-10 bg-[#f6ece7] rounded-lg" />
            <div className="h-11 bg-[#f6ece7] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Expired / Invalid Invitation State
  if (invitationError || !invitationDetails) {
    const errorMsg =
      invitationError?.response?.data?.message ||
      invitationError?.message ||
      "Invalid or expired invitation link.";

    return (
      <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between items-center px-4 py-8">
        {/* Header */}
        <header className="w-full max-w-[580px] flex items-center justify-between pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#bb0028] flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="font-semibold text-base text-[#1f1b18]">Recoz Feedback</span>
          </div>
          <Link
            to="/"
            className="text-xs text-[#5d3f3e] hover:text-[#1f1b18] flex items-center gap-1"
          >
            <span>Back to home</span>
            <ArrowUpRight size={13} />
          </Link>
        </header>

        {/* Error Card */}
        <div className="w-full max-w-[580px] bg-white rounded-2xl border border-[#eae1db] shadow-xl p-8 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-[#bb0028] flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1f1b18]">Invitation Unavailable</h2>
            <p className="text-xs sm:text-sm text-[#5d3f3e] max-w-sm mx-auto mt-1.5 leading-relaxed">
              {errorMsg}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#fbf2ec] border border-[#eae1db] text-left text-xs text-[#5d3f3e]">
            Please contact your organization administrator or team lead to generate a fresh invitation link.
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Sign in to Recoz
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-[580px] text-center text-xs text-[#926e6d] pt-6">
          © 2026 Recoz Feedback Intelligence Inc.
        </footer>
      </div>
    );
  }

  const {
    email,
    role,
    organization,
    expiresAt,
    userExists,
  } = invitationDetails;

  const orgName = organization?.name || "Workspace";
  const orgInitials = orgName.slice(0, 2).toUpperCase();
  const roleName = role === "admin" ? "Workspace Admin" : "Support Agent";

  const expiresFormatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Soon";

  // Check email mismatch if currently logged in
  const isEmailMismatch =
    currentUser &&
    currentUser.email &&
    currentUser.email.toLowerCase() !== email.toLowerCase();

  return (
    <div className="min-h-screen bg-[#fff8f5] flex flex-col justify-between items-center px-4 py-8 selection:bg-[#f9dfb9]">
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Top Bar Header */}
      <header className="w-full max-w-[580px] flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#bb0028] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base text-[#1f1b18] tracking-tight">
              Recoz Feedback
            </span>
            <span className="text-[10px] text-[#926e6d] uppercase tracking-wider">
              Enterprise Intelligence
            </span>
          </div>
        </div>
        <Link
          to="/"
          className="text-xs text-[#5d3f3e] hover:text-[#1f1b18] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#f6ece7] transition-colors"
        >
          <span>Homepage</span>
          <ArrowUpRight size={13} />
        </Link>
      </header>

      {/* Main Card Container */}
      <main className="w-full max-w-[580px] bg-white rounded-2xl border border-[#eae1db] shadow-xl overflow-hidden">
        {/* 1. Hero Invitation Context Header */}
        <div className="p-6 sm:p-7 border-b border-[#eae1db] bg-gradient-to-b from-[#fbf2ec]/50 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f9dfb9]/60 border border-[#dbc39f] text-[#554428] text-[10px] font-semibold tracking-wider uppercase">
              <CheckCircle2 size={12} className="text-[#6e5c3e]" />
              <span>OFFICIAL INVITATION</span>
            </div>
            <span className="text-[11px] text-[#926e6d] flex items-center gap-1">
              <Clock size={12} />
              <span>Expires {expiresFormatted}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-[#1f1b18] tracking-tight mb-4">
            You&apos;re invited
          </h1>

          {/* Organization Context Banner */}
          <div className="p-4 rounded-xl bg-[#fff8f5] border border-[#eae1db] flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[#eae1db] border border-[#f0e6e1] flex items-center justify-center text-[#bb0028] font-bold text-base shrink-0 shadow-xs">
              {orgInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-[#1f1b18] truncate">
                  {orgName}
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-[#f9dfb9] text-[#261903]">
                  {roleName}
                </span>
              </div>
              <p className="text-xs text-[#5d3f3e] mt-0.5">
                Join this workspace to manage customer feedback and surveys.
              </p>
            </div>
          </div>

          {/* Locked Target Email Badge */}
          <div className="mt-3.5 pt-3.5 border-t border-[#eae1db]/60 flex items-center gap-2 text-xs text-[#5d3f3e]">
            <Lock size={13} className="text-[#926e6d] shrink-0" />
            <span>
              Invitation bound to <strong className="text-[#1f1b18]">{email}</strong>
            </span>
          </div>
        </div>

        {/* 2. Success State */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
                <span>INVITATION ACCEPTED</span>
              </div>
              <h2 className="text-xl font-bold text-[#1f1b18]">
                Welcome to {orgName}!
              </h2>
              <p className="text-xs text-[#5d3f3e] max-w-sm mx-auto mt-1.5">
                You are now an active member with the <strong>{roleName}</strong> role.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/dashboard"
                className="w-full h-11 rounded-lg bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Launch Recoz Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : isEmailMismatch ? (
          /* 3. Logged-in Email Mismatch Warning State */
          <div className="p-6 sm:p-7 space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-[#854d0e] flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-sm text-amber-900">
                  Different Account Signed In
                </h4>
                <p className="text-[#1f1b18]">
                  This invitation was sent to <strong className="text-[#bb0028]">{email}</strong>.
                </p>
                <p className="text-[#5d3f3e]">
                  You are currently signed in as <strong>{currentUser.email}</strong>. Please sign out of this account to accept the invitation.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await logout({ redirectTo: false });
                  } catch (e) {
                    // ignore
                  }
                }}
                className="w-full h-10 rounded-lg bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign out & accept as {email}
              </button>
            </div>
          </div>
        ) : (
          /* 4. Accept / Register Form */
          <form onSubmit={handleAccept} className="p-6 sm:p-7 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#1f1b18]">
                {userExists ? "Confirm Account & Join" : "Create your account"}
              </h2>
              <p className="text-xs text-[#5d3f3e] mt-0.5">
                {userExists
                  ? "Your account will be linked to this organization with the assigned permissions."
                  : "Set your password to finish setting up your Recoz account."}
              </p>
            </div>

            {/* Name Input (New user only) */}
            {!userExists && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#1f1b18]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-10 px-3.5 bg-[#fff8f5] border border-[#eae1db] rounded-lg text-xs text-[#1f1b18] focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] outline-none"
                />
              </div>
            )}

            {/* Locked Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#1f1b18]">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                disabled
                value={email}
                className="w-full h-10 px-3.5 bg-[#f6ece7] border border-[#eae1db] rounded-lg text-xs text-[#5d3f3e] cursor-not-allowed select-none outline-none font-medium"
              />
            </div>

            {/* Password Input (New user only) */}
            {!userExists && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1f1b18]">
                    Set Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 px-3.5 pr-10 bg-[#fff8f5] border border-[#eae1db] rounded-lg text-xs text-[#1f1b18] focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#926e6d] hover:text-[#1f1b18]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#926e6d]">
                    Minimum 6 characters
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1f1b18]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 px-3.5 pr-10 bg-[#fff8f5] border border-[#eae1db] rounded-lg text-xs text-[#1f1b18] focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#926e6d] hover:text-[#1f1b18]"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Primary Submit CTA */}
            <button
              type="submit"
              disabled={isAcceptingInvitation}
              className="w-full h-11 mt-2 rounded-lg bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isAcceptingInvitation ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Joining workspace...</span>
                </>
              ) : (
                <>
                  <span>
                    {userExists
                      ? "Accept invitation & join workspace"
                      : "Create account & join workspace"}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Security note */}
            <div className="pt-2 text-center">
              <p className="text-[10px] text-[#926e6d]">
                By joining, you agree to Recoz Terms of Service & Privacy Policy.
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#926e6d]">
                <Shield size={11} className="text-[#6e5c3e]" />
                <span>256-bit encrypted invitation session</span>
              </div>
            </div>
          </form>
        )}

        {/* Card Footer Single-use Verification Token Badge */}
        <div className="px-6 py-3 bg-[#fbf2ec]/50 border-t border-[#eae1db] text-center text-[10px] text-[#926e6d]">
          Single-use verified token: <strong>tok_{String(token).slice(0, 8)}...</strong>
        </div>
      </main>

      {/* Minimal Public Footer */}
      <footer className="w-full max-w-[580px] text-center text-xs text-[#926e6d] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Recoz Feedback Intelligence Inc.</span>
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:text-[#1f1b18] transition-colors">
            Privacy Notice
          </Link>
          <span>•</span>
          <Link to="/" className="hover:text-[#1f1b18] transition-colors">
            Security
          </Link>
        </div>
      </footer>
    </div>
  );
}