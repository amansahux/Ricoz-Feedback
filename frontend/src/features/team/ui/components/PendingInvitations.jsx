import React from "react";
import { Mail, Plus, Send, Clock, CheckCircle2 } from "lucide-react";

export default function PendingInvitations({
  pendingInvitations = [],
  onOpenInvite,
  onResendInvite,
  isResending,
  isOwner = true,
}) {
  return (
    <section className="bg-white rounded-xl border border-[#eae1db] shadow-sm p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#eae1db]">
        <div>
          <h2 className="text-base font-semibold text-[#1f1b18]">
            Pending invitations
          </h2>
          <p className="text-xs text-[#5d3f3e]">
            Invitations that have not been accepted yet.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={onOpenInvite}
            className="text-xs font-semibold text-[#bb0028] hover:text-[#e61337] flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <Plus size={14} />
            <span>Invite new person</span>
          </button>
        )}
      </div>

      {pendingInvitations.length === 0 ? (
        /* Empty Pending Invites State */
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 size={22} />
          </div>
          <p className="text-sm font-semibold text-[#1f1b18]">
            All invites accepted
          </p>
          <p className="text-xs text-[#5d3f3e] max-w-sm mt-0.5">
            There are no pending invitation links awaiting acceptance.
          </p>
        </div>
      ) : (
        /* Pending Invitations List */
        <div className="flex flex-col divide-y divide-[#f6ece7]">
          {pendingInvitations.map((invitation) => {
            const roleName =
              invitation.role === "admin"
                ? "Admin"
                : invitation.role === "support_agent"
                ? "Support Agent"
                : invitation.role;

            const expiresFormatted = invitation.expiresAt
              ? new Date(invitation.expiresAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "24 hours";

            return (
              <div
                key={invitation.id || invitation.email}
                className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f9dfb9]/40 text-[#554428] flex items-center justify-center shrink-0 border border-[#dbc39f]/50">
                    <Mail size={16} className="text-[#926e6d]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#1f1b18]">
                        {invitation.email}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#eee1cb] text-[#4e4635]">
                        {roleName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#5d3f3e] mt-0.5 flex items-center gap-1">
                      <span>
                        Invited by {invitation.invitedBy || "Team Lead"} ·
                      </span>
                      <span className="text-[#bb0028] font-medium inline-flex items-center gap-1">
                        <Clock size={11} />
                        Expires {expiresFormatted}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {isOwner && (
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => onResendInvite?.(invitation)}
                      disabled={isResending}
                      className="px-3 py-1.5 text-xs font-semibold text-[#1f1b18] bg-[#f6ece7] hover:bg-[#eae1db] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Send size={12} className="text-[#926e6d]" />
                      <span>Resend</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
