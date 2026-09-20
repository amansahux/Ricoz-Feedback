import { useMutation } from "@tanstack/react-query";
import { updateUser, changePassword } from "../apis/setting.api";

export const useSetting = () => {
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
  });

  return {
    updateUserMutation,
    changePasswordMutation,
  };
};
