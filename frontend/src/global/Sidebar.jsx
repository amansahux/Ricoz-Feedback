import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutGrid,
  ClipboardList,
  MessageSquare,
  Users,
  BarChart2,
  Settings,
  LogOut,
  X,
  Plus,
  Sparkles,
} from "lucide-react";
import useAuth from "../features/auth/hook/useAuth.jsx";
import LogoutModal from "../shared/components/LogoutModal.jsx";

const mainNavLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Surveys", href: "/surveys", icon: ClipboardList },
  { label: "Feedback", href: "/feedback", icon: MessageSquare, badge: "1 new" },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, organization, logout, isLoggingOut } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isSettingsActive = location.pathname.startsWith("/settings");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#1F1B18]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-white border-r border-[#EFE4D6] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } select-none`}
      >
        {/* Top Part: Brand + New Survey CTA + Nav */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 group"
            >
              {/* Recoz Red Badge */}
              <div className="w-9 h-9 rounded-xl bg-[#bb0028] flex items-center justify-center text-white font-epilogue font-bold text-base shadow-sm shadow-[#bb0028]/25 shrink-0 group-hover:scale-105 transition-transform">
                R
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-epilogue font-bold text-[17px] text-[#1f1b18] tracking-tight leading-none">
                    Recoz
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F9DFB9] text-[#746243] font-mono-tag uppercase leading-none">
                    FEEDBACK
                  </span>
                </div>
                <span className="text-[11px] text-[#7d7461] font-inter mt-1 truncate">
                  Enterprise Intelligence
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] lg:hidden transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Create Survey CTA */}
          <div className="px-3.5 pt-1 pb-3">
            <Link
              to="/surveys/create"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[5px] bg-[#e61337] hover:bg-[#bb0028] text-white text-xs font-semibold shadow-sm shadow-[#e61337]/25 transition-all duration-150 group"
            >
              <Plus size={15} className="group-hover:rotate-90 transition-transform duration-200" />
              <span>Create Survey</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {mainNavLinks.map(({ label, href, icon: Icon, badge }) => {
              const active =
                href === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  to={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-inter font-medium transition-all duration-150 relative ${
                    active
                      ? "bg-[#FBF2EC] text-[#bb0028] font-semibold"
                      : "text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#FBF2EC]/70"
                  }`}
                >
                  {active && (
                    <span className="w-1 h-5 bg-[#bb0028] rounded-full absolute left-1" />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.3 : 2}
                    className={active ? "text-[#bb0028]" : "text-[#7d7461]"}
                  />
                  <span>{label}</span>
                  {badge && (
                    <span className="ml-auto text-[10px] font-bold bg-[#FFDAD8] text-[#92001D] px-2 py-0.5 rounded-full font-inter">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Part: Settings, Organization & User Profile */}
        <div className="px-3 pb-4 flex flex-col gap-3">
          {/* Settings Link */}
          <div className="pt-2 border-t border-[#EFE4D6]/70">
            <Link
              to="/settings"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-inter font-medium transition-all duration-150 ${
                isSettingsActive
                  ? "bg-[#FBF2EC] text-[#bb0028] font-semibold"
                  : "text-[#5d3f3e] hover:text-[#1f1b18] hover:bg-[#FBF2EC]/70"
              }`}
            >
              <Settings
                size={18}
                strokeWidth={isSettingsActive ? 2.3 : 2}
                className={isSettingsActive ? "text-[#bb0028]" : "text-[#7d7461]"}
              />
              <span>Settings</span>
            </Link>
          </div>

          {/* User Profile Footer Card */}
          <div className="p-2.5 rounded-2xl bg-[#FBF2EC] border border-[#EFE4D6] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#EFE4D6] border border-[#D1C5B0] flex items-center justify-center text-xs font-bold text-[#5d3f3e] shrink-0 font-epilogue">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#1f1b18] truncate font-inter">
                  {user?.name || "Aman Sahu"}
                </span>
                <span className="text-[10px] text-[#7d7461] truncate font-inter">
                  {organization?.name || "DesignFloww"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              disabled={isLoggingOut}
              title="Sign out"
              className="p-1.5 rounded-lg text-[#7d7461] hover:text-[#bb0028] hover:bg-white transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          await logout();
          setShowLogoutModal(false);
        }}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}