import React, { useState } from "react";
import { X, Send, AlertTriangle, Shield, Check, Trash2, Eye } from "lucide-react";

/**
 * 1. Invite Member Modal
 */
export function InviteMemberModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("support_agent");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await onSubmit({ email: email.trim(), role });
    setEmail("");
    setRole("support_agent");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-2xl border border-[#eae1db] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#eae1db] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1f1b18]">
              Invite a team member
            </h3>
            <p className="text-xs text-[#5d3f3e] mt-0.5">
              Send an email invitation link to join your Recoz Feedback workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#f6ece7] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1f1b18]">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="h-10 px-3.5 bg-[#fff8f5] border border-[#eae1db] rounded-lg text-sm text-[#1f1b18] focus:outline-none focus:border-[#bb0028] focus:ring-1 focus:ring-[#bb0028] placeholder:text-[#926e6d]"
            />
          </div>

          {/* Role Selector */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1f1b18]">
              Role & Permissions
            </span>

            {/* Admin Option */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                role === "admin"
                  ? "border-[#bb0028] bg-[#fff8f5] shadow-xs"
                  : "border-[#eae1db] hover:bg-[#fbf2ec]/50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
                className="mt-1 text-[#bb0028] focus:ring-[#bb0028]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1f1b18]">
                  Admin
                </span>
                <span className="text-xs text-[#5d3f3e] mt-0.5">
                  Can create surveys, invite team members, manage surveys, and export reports.
                </span>
              </div>
            </label>

            {/* Support Agent Option */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                role === "support_agent"
                  ? "border-[#bb0028] bg-[#fff8f5] shadow-xs"
                  : "border-[#eae1db] hover:bg-[#fbf2ec]/50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="support_agent"
                checked={role === "support_agent"}
                onChange={() => setRole("support_agent")}
                className="mt-1 text-[#bb0028] focus:ring-[#bb0028]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1f1b18]">
                  Support Agent
                </span>
                <span className="text-xs text-[#5d3f3e] mt-0.5">
                  Can view customer feedback verbatims, tag issues, and respond to customers.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eae1db] mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#1f1b18] hover:bg-[#f6ece7] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send size={13} />
              <span>{isLoading ? "Sending..." : "Send invitation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * 2. Change Role Modal
 */
export function ChangeRoleModal({
  member,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) {
  const [selectedRole, setSelectedRole] = useState(
    member?.role || "support_agent"
  );

  if (!isOpen || !member) return null;

  const handleSubmit = async () => {
    await onSubmit({ memberId: member.id, role: selectedRole });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-2xl border border-[#eae1db] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-[#eae1db] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1f1b18]">Change role</h3>
            <p className="text-xs text-[#5d3f3e] mt-0.5">
              Modifying access tier for{" "}
              <span className="font-semibold text-[#1f1b18]">
                {member.name || member.email}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#f6ece7] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-3.5">
          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
              selectedRole === "admin"
                ? "border-[#bb0028] bg-[#fff8f5]"
                : "border-[#eae1db] hover:bg-[#fbf2ec]/50"
            }`}
          >
            <input
              type="radio"
              name="change-role"
              value="admin"
              checked={selectedRole === "admin"}
              onChange={() => setSelectedRole("admin")}
              className="mt-1 text-[#bb0028] focus:ring-[#bb0028]"
            />
            <div>
              <div className="text-xs font-semibold text-[#1f1b18]">Admin</div>
              <div className="text-[11px] text-[#5d3f3e]">
                Full operational control and member management.
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
              selectedRole === "support_agent"
                ? "border-[#bb0028] bg-[#fff8f5]"
                : "border-[#eae1db] hover:bg-[#fbf2ec]/50"
            }`}
          >
            <input
              type="radio"
              name="change-role"
              value="support_agent"
              checked={selectedRole === "support_agent"}
              onChange={() => setSelectedRole("support_agent")}
              className="mt-1 text-[#bb0028] focus:ring-[#bb0028]"
            />
            <div>
              <div className="text-xs font-semibold text-[#1f1b18]">
                Support Agent
              </div>
              <div className="text-[11px] text-[#5d3f3e]">
                Read and reply access to customer feedback inquiries.
              </div>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eae1db] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#1f1b18] hover:bg-[#f6ece7] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-[#bb0028] text-white text-xs font-semibold rounded-lg hover:bg-[#e61337] shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. Deactivate / Activate Confirmation Modal
 */
export function DeactivateMemberModal({
  member,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) {
  if (!isOpen || !member) return null;

  const isActive = (member.status || "").toLowerCase() === "active";
  const newStatus = isActive ? "inactive" : "active";

  const handleConfirm = async () => {
    await onSubmit({ memberId: member.id, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-2xl border border-[#eae1db] shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isActive ? "bg-red-50 text-[#bb0028]" : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isActive ? <AlertTriangle size={24} /> : <Check size={24} />}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1f1b18]">
            {isActive ? "Deactivate operator?" : "Reactivate operator?"}
          </h3>
          <p className="text-xs text-[#5d3f3e] mt-1.5 leading-relaxed">
            {isActive ? (
              <>
                Are you sure you want to deactivate{" "}
                <strong className="text-[#1f1b18]">{member.name || member.email}</strong>?
                They will instantly lose access to all feedback and customer consoles until reactivated.
              </>
            ) : (
              <>
                Restore workspace access for{" "}
                <strong className="text-[#1f1b18]">{member.name || member.email}</strong>?
                They will be able to log in and collaborate again.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#1f1b18] hover:bg-[#f6ece7] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-sm text-white ${
              isActive
                ? "bg-[#bb0028] hover:bg-[#e61337]"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading
              ? "Updating..."
              : isActive
              ? "Deactivate operator"
              : "Reactivate operator"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 4. Remove Member Confirmation Modal
 */
export function RemoveMemberModal({
  member,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) {
  if (!isOpen || !member) return null;

  const handleConfirm = async () => {
    await onSubmit(member.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-2xl border border-[#eae1db] shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-full bg-red-50 text-[#bb0028] flex items-center justify-center">
          <Trash2 size={24} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1f1b18]">
            Remove team member?
          </h3>
          <p className="text-xs text-[#5d3f3e] mt-1.5 leading-relaxed">
            Are you sure you want to permanently remove{" "}
            <strong className="text-[#1f1b18]">{member.name || member.email}</strong> from this organization?
            All their assigned permissions will be revoked immediately.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#1f1b18] hover:bg-[#f6ece7] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-[#bb0028] hover:bg-[#e61337] text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            {isLoading ? "Removing..." : "Remove member"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 5. Member Details View Modal
 */
export function MemberDetailsModal({
  member,
  isOpen,
  onClose,
}) {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-2xl border border-[#eae1db] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-[#eae1db] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-[#bb0028]" />
            <h3 className="text-base font-semibold text-[#1f1b18]">
              Team Member Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#f6ece7] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f6ece7]">
            <div className="w-12 h-12 rounded-full bg-[#f9dfb9] text-[#261903] flex items-center justify-center text-sm font-bold">
              {(member.name || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1f1b18]">{member.name || "Unnamed"}</h4>
              <p className="text-xs text-[#5d3f3e]">{member.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#eae1db]/60">
              <span className="text-[10px] uppercase font-semibold text-[#926e6d]">Role</span>
              <p className="font-semibold text-[#1f1b18] capitalize mt-0.5">{member.role?.replace("_", " ")}</p>
            </div>
            <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#eae1db]/60">
              <span className="text-[10px] uppercase font-semibold text-[#926e6d]">Status</span>
              <p className="font-semibold text-emerald-700 capitalize mt-0.5">{member.status}</p>
            </div>
            <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#eae1db]/60">
              <span className="text-[10px] uppercase font-semibold text-[#926e6d]">Joined Date</span>
              <p className="font-medium text-[#1f1b18] mt-0.5">
                {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "—"}
              </p>
            </div>
            <div className="bg-[#fff8f5] p-3 rounded-lg border border-[#eae1db]/60">
              <span className="text-[10px] uppercase font-semibold text-[#926e6d]">Email Verified</span>
              <p className="font-medium text-[#1f1b18] mt-0.5">{member.verified ? "Yes" : "Pending"}</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#f6ece7] hover:bg-[#eae1db] text-[#1f1b18] text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
