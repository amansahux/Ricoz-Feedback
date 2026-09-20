import apiClient from "../../../../config/axiosInsstance";

export const updateUser = async (data) => {
  const res = await apiClient.patch("/auth/update-profile", data);
  return res?.data;
};
export const changePassword = async (data) => {
  const res = await apiClient.patch("/auth/change-password", data);
  return res?.data;
};
