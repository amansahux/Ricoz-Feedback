import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateUser, changePassword } from "../apis/setting.api";
import { setUser } from "../../auth/state/auth.slice";

export const useSetting = () => {
  const dispatch = useDispatch();
  const { user, organization, isHydrating } = useSelector((state) => state.auth);

  // Initial State derived from Redux auth
  const initialValues = useMemo(() => ({
    name: user?.name || "",
    organizationName: organization?.name || "",
    logoUrl: organization?.logo || organization?.logoUrl || "",
    primaryColor: organization?.primaryColor || "#F62440",
  }), [user?.name, organization?.name, organization?.logo, organization?.logoUrl, organization?.primaryColor]);

  // Form State
  const [formData, setFormData] = useState(initialValues);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showPasswordVisibility, setShowPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // UI States
  const [previewRating, setPreviewRating] = useState(5);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync formData when initial auth data hydrates or updates
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // Calculate if form is dirty
  const isDirty = useMemo(() => {
    return (
      formData.name.trim() !== initialValues.name.trim() ||
      formData.organizationName.trim() !== initialValues.organizationName.trim() ||
      formData.logoUrl.trim() !== initialValues.logoUrl.trim() ||
      formData.primaryColor.toLowerCase() !== initialValues.primaryColor.toLowerCase()
    );
  }, [formData, initialValues]);

  // Toast Helper
  const showToast = useCallback((title, message, type = "success") => {
    setToast({ title, message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Update Profile / Org Mutation
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      if (data?.data?.user && data?.data?.organization) {
        dispatch(
          setUser({
            user: data.data.user,
            organization: data.data.organization,
          })
        );
      }
      showToast("Workspace Updated", "Organization settings and branding saved successfully.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error.message || "Failed to update settings";
      showToast("Update Failed", message, "error");
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
      showToast("Password Changed", "Your account credentials have been updated.");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || error.message || "Failed to change password";
      setPasswordError(message);
    },
  });

  // Field change handlers
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordError("");
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleColorChange = (color) => {
    if (!color) return;
    let hex = color.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;
    handleFieldChange("primaryColor", hex);
  };

  // Discard Changes
  const handleDiscard = () => {
    setFormData(initialValues);
    setShowDiscardModal(false);
  };

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!isDirty || updateUserMutation.isPending) return;

    updateUserMutation.mutate({
      name: formData.name.trim(),
      organizationName: formData.organizationName.trim(),
      primaryColor: formData.primaryColor,
      logoUrl: formData.logoUrl.trim(),
    });
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    setPasswordError("");

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  // Copy Workspace Slug
  const copySlug = () => {
    const slug = organization?.slug || "workspace";
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(true);
    setTimeout(() => {
      setCopiedSlug(false);
    }, 2500);
  };

  return {
    user,
    organization,
    isHydrating,
    formData,
    passwordData,
    passwordError,
    showPasswordVisibility,
    isDirty,
    previewRating,
    copiedSlug,
    showDiscardModal,
    toast,
    isSaving: updateUserMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    handleFieldChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleColorChange,
    handleDiscard,
    handleSaveProfile,
    handleChangePassword,
    copySlug,
    setPreviewRating,
    setShowDiscardModal,
    hideToast,
  };
};
