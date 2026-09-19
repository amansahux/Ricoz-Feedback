import apiClient from "../../../../config/axiosInsstance";

export const updateUser = async (data) => {
  return apiClient.patch("/user/update", data);
};
