import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Login, Register, Logout, getMe } from "../state/auth.action";
import { clearAuthError } from "../state/auth.slice";

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

  const handleLogin = useCallback(
    async (formData) => {
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
    [dispatch, navigate],
  );

  const handleRegister = useCallback(
    async (formData) => {
      try {
        const resultAction = await dispatch(Register(formData));
        if (Register.fulfilled.match(resultAction)) {
          // Do not navigate directly on register as email verification is required
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
    [dispatch],
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

  const resetError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

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
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
    resetError,
  };
}

export default useAuth;
