import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Login, Register, Logout, getMe } from "../state/auth.action";
import { clearAuthError } from "../state/auth.slice";
import { resendVerificationEmail } from "../api/auth.api";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    organization,
    isHydrating,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    error,
  } = useSelector((state) => state.auth);

  const isAuthenticated = Boolean(user);
  const isLoading = isLoggingIn || isRegistering || isLoggingOut;

  // Verification & Countdown State
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null); // { type: 'success' | 'error', text: string }

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

  const resetError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleLogin = useCallback(
    async (formData) => {
      resetError?.();
      setResendStatus(null);
      try {
        const resultAction = await dispatch(Login(formData));
        if (Login.fulfilled.match(resultAction)) {
          navigate("/dashboard");
          return { success: true, data: resultAction.payload };
        } else {
          const message = resultAction.payload || "Sign in failed";
          return { success: false, error: message };
        }
      } catch (err) {
        const message = err.message || "An unexpected error occurred";
        return { success: false, error: message };
      }
    },
    [dispatch, navigate, resetError],
  );

  const handleRegister = useCallback(
    async (formData) => {
      resetError?.();
      setResendStatus(null);
      try {
        const resultAction = await dispatch(Register(formData));
        if (Register.fulfilled.match(resultAction)) {
          setRegisteredEmail(formData.email);
          setVerificationSent(true);
          setCountdown(60);
          return { success: true, data: resultAction.payload };
        } else {
          const message = resultAction.payload || "Registration failed";
          return { success: false, error: message };
        }
      } catch (err) {
        const message = err.message || "An unexpected error occurred";
        return { success: false, error: message };
      }
    },
    [dispatch, resetError],
  );

  const handleResendVerification = useCallback(
    async (email) => {
      const targetEmail = email || registeredEmail;
      if (!targetEmail) {
        setResendStatus({
          type: "error",
          text: "Please enter your email address to resend the verification link",
        });
        return { success: false, error: "Email required" };
      }

      if (countdown > 0 || isResending) return;

      setIsResending(true);
      setResendStatus(null);

      try {
        const res = await resendVerificationEmail(targetEmail);
        setResendStatus({
          type: "success",
          text: res.message || "Verification email sent! Please check your inbox.",
        });
        setCountdown(60);
        return { success: true, message: res.message };
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Failed to resend verification email";
        setResendStatus({ type: "error", text: msg });
        return { success: false, error: msg };
      } finally {
        setIsResending(false);
      }
    },
    [registeredEmail, countdown, isResending],
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(Logout());
    } catch {
      // ignore
    } finally {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  const refreshUser = useCallback(() => {
    return dispatch(getMe());
  }, [dispatch]);

  const clearResendStatus = useCallback(() => {
    setResendStatus(null);
  }, []);

  return {
    user,
    organization,
    isAuthenticated,
    isHydrating,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    isLoading,
    error,
    verificationSent,
    setVerificationSent,
    registeredEmail,
    setRegisteredEmail,
    countdown,
    isResending,
    resendStatus,
    setResendStatus,
    clearResendStatus,
    login: handleLogin,
    register: handleRegister,
    resendVerification: handleResendVerification,
    logout: handleLogout,
    refreshUser,
    resetError,
  };
}

export default useAuth;
