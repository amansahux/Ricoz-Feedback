import React from "react";
import { useSetting } from "../../hooks/useSetting";
import {
  ProfileSection,
  SecuritySection,
  OrganizationSection,
  BrandingSection,
  SaveActionBar,
  DiscardModal,
  ToastNotification,
} from "../components";

const Setting = () => {
  const {
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
    isSaving,
    isChangingPassword,
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
  } = useSetting();

  if (isHydrating) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse py-4">
        <div className="h-8 bg-[#E1D8D3]/50 rounded-lg w-1/3 mb-2" />
        <div className="h-4 bg-[#E1D8D3]/40 rounded-lg w-2/3 mb-8" />
        <div className="p-6 rounded-2xl bg-white border border-[#E1D8D3] space-y-4">
          <div className="h-6 bg-[#E1D8D3]/50 rounded w-1/4" />
          <div className="h-10 bg-[#FBF2EC] rounded-xl" />
        </div>
        <div className="p-6 rounded-2xl bg-white border border-[#E1D8D3] space-y-4">
          <div className="h-6 bg-[#E1D8D3]/50 rounded w-1/4" />
          <div className="h-10 bg-[#FBF2EC] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-32">
      {/* Workspace Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#f9dfb9]/60 text-[#bb0028] border border-[#e7bcbb]/40 text-xs font-bold uppercase tracking-wider mb-2 font-epilogue">
          <span>Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-epilogue text-[#1f1b18] tracking-tight">
          Your workspace
        </h1>
        <p className="text-sm sm:text-base text-[#7d7461] mt-1">
          Manage your profile, account security, organization, and public feedback experience.
        </p>
      </div>

      {/* Main Settings Sections Container */}
      <div className="space-y-8">
        {/* Section 1: Profile */}
        <ProfileSection
          name={formData.name}
          email={user?.email}
          onNameChange={(val) => handleFieldChange("name", val)}
        />

        {/* Section 2: Security & Change Password */}
        <SecuritySection
          passwordData={passwordData}
          passwordError={passwordError}
          showVisibility={showPasswordVisibility}
          isChangingPassword={isChangingPassword}
          onPasswordChange={handlePasswordChange}
          onToggleVisibility={togglePasswordVisibility}
          onSubmit={handleChangePassword}
        />

        {/* Section 3: Organization */}
        <OrganizationSection
          organizationName={formData.organizationName}
          slug={organization?.slug}
          copiedSlug={copiedSlug}
          onNameChange={(val) => handleFieldChange("organizationName", val)}
          onCopySlug={copySlug}
        />

        {/* Section 4: Branding & Live Feedback Preview */}
        <BrandingSection
          logoUrl={formData.logoUrl}
          primaryColor={formData.primaryColor}
          organizationName={formData.organizationName}
          previewRating={previewRating}
          onLogoChange={(val) => handleFieldChange("logoUrl", val)}
          onColorChange={handleColorChange}
          onRatingSelect={setPreviewRating}
        />
      </div>

      {/* Bottom Save Action Bar */}
      <SaveActionBar
        isDirty={isDirty}
        isSaving={isSaving}
        onDiscard={() => setShowDiscardModal(true)}
        onSave={handleSaveProfile}
      />

      {/* Confirmation Modal when Discarding Changes */}
      <DiscardModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleDiscard}
      />

      {/* Toast Feedback Notification */}
      <ToastNotification toast={toast} onClose={hideToast} />
    </div>
  );
};

export default Setting;