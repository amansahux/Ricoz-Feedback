import apiClient from "../../../../config/axiosInsstance";

export const resendVerificationEmail = async (email) => {
  const response = await apiClient.post("/auth/resend-verification", { email });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await apiClient.post("/auth/verify-email", { token });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resendOtp = async (email) => {
  const response = await apiClient.post("/auth/resend-otp", { email });
  return response.data;
};

export const invalidateOtp = async (email) => {
  const response = await apiClient.post("/auth/invalidate-otp", { email });
  return response.data;
};

export const resetPassword = async ({ email, otp, newPassword, confirmPassword }) => {
  const response = await apiClient.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

