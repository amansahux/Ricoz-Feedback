import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Login, Register, Logout, getMe } from "../state/auth.action";
import { clearAuthError } from "../state/auth.slice";
import Toast from "../../../shared/components/Toast";

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
          Toast.success("Signed in successfully!");
          navigate("/dashboard");
          return { success: true, data: resultAction.payload };
        } else {
          const message = resultAction.payload || "Sign in failed";
          Toast.error(message);
          return { success: false, error: message };
        }
      } catch (err) {
        const message = err.message || "An unexpected error occurred";
        Toast.error(message);
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
          Toast.success("Account created successfully!");
          navigate("/dashboard");
          return { success: true, data: resultAction.payload };
        } else {
          const message = resultAction.payload || "Registration failed";
          Toast.error(message);
          return { success: false, error: message };
        }
      } catch (err) {
        const message = err.message || "An unexpected error occurred";
        Toast.error(message);
        return { success: false, error: message };
      }
    },
    [dispatch, navigate],
  );

  const handleLogout = useCallback(async () => {
    try {
      const resultAction = await dispatch(Logout());
      if (Logout.fulfilled.match(resultAction)) {
        Toast.success("Logged out successfully");
      }
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
