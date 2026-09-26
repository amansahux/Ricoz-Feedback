import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { forgotPassword, resendOtp, resetPassword } from "../api/auth.api";

export function useForgotPassword() {
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";

  // Multi-step navigation state: 1 (Email), 2 (OTP), 3 (New Password), 4 (Success)
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & status states
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Feedback states
  const [error, setError] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // Update email if query param changes
  useEffect(() => {
    if (prefilledEmail && !email) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  // Countdown timer effect
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const goToStep = useCallback((step) => {
    setError(null);
    setResendStatus(null);
    setCurrentStep(step);
  }, []);

  // Step 1: Send OTP to email
  const handleSendOtp = useCallback(
    async (targetEmail) => {
      const emailToUse = (targetEmail || email).trim();
      if (!emailToUse) {
        setError("Please enter your account email address");
        return { success: false, error: "Email required" };
      }

      setError(null);
      setResendStatus(null);
      setIsSubmittingEmail(true);

      try {
        const response = await forgotPassword(emailToUse);
        setEmail(emailToUse);
        setCountdown(60);
        setCurrentStep(2);
        return { success: true, message: response.message };
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Failed to send verification code";
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsSubmittingEmail(false);
      }
    },
    [email]
  );

  // Step 2: Resend OTP
  const handleResendOtp = useCallback(async () => {
    if (countdown > 0 || isResendingOtp) return;

    setError(null);
    setResendStatus(null);
    setIsResendingOtp(true);

    try {
      const response = await resendOtp(email);
      setResendStatus({
        type: "success",
        text: response.message || "New 6-digit code sent to your email.",
      });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      return { success: true, message: response.message };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to resend verification code";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsResendingOtp(false);
    }
  }, [email, countdown, isResendingOtp]);

  // Step 2: Validate OTP entered
  const handleVerifyOtp = useCallback(() => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code");
      return false;
    }
    setError(null);
    setCurrentStep(3);
    return true;
  }, [otp]);

  // Step 3: Reset password with OTP
  const handleResetPassword = useCallback(async () => {
    const fullOtp = otp.join("");

    if (!fullOtp || fullOtp.length < 6) {
      setError("Valid 6-digit verification code is required");
      setCurrentStep(2);
      return { success: false, error: "Invalid OTP" };
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return { success: false, error: "Password too short" };
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return { success: false, error: "Passwords do not match" };
    }

    setError(null);
    setIsResettingPassword(true);

    try {
      const response = await resetPassword({
        email,
        otp: fullOtp,
        newPassword,
        confirmPassword,
      });

      setCurrentStep(4);
      return { success: true, message: response.message };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to reset password";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsResettingPassword(false);
    }
  }, [email, otp, newPassword, confirmPassword]);

  // Calculate password strength
  const calculateStrength = useCallback((pwd) => {
    if (!pwd || pwd.length === 0) return { score: 0, label: "Too short", color: "neutral" };
    if (pwd.length < 6) return { score: 1, label: "Weak", color: "red" };
    
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score++;

    if (score <= 2) return { score: 2, label: "Medium", color: "yellow" };
    return { score: 3, label: "Strong", color: "emerald" };
  }, []);

  return {
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
    isVerifyingOtp,
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
  };
}

export default useForgotPassword;
