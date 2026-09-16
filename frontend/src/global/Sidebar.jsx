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
} from "lucide-react";
import useAuth from "../features/auth/hook/useAuth.jsx";

const mainNavLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Surveys", href: "/surveys", icon: ClipboardList },
  { label: "Feedback", href: "/feedback", icon: MessageSquare },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, organization, logout, isLoggingOut } = useAuth();

  const isSettingsActive = location.pathname.startsWith("/settings");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#0c0d10] border-r border-[#1a1b1f] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } select-none`}
      >
        {/* Top Part: Brand + Nav */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="px-5 pt-6 pb-6 flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 group"
            >
              {/* Recoz Red Badge with Chat bubble icon */}
              <div className="w-[34px] h-[34px] rounded-[7px] bg-[#e11d48] flex items-center justify-center text-white shadow-sm shadow-red-500/20">
                <svg
                  className="w-4 h-4 fill-none stroke-current stroke-[2.2]"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 9h8" strokeLinecap="round" />
                  <path d="M8 13h5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-poppins font-bold text-[17px] text-white tracking-tight leading-none mb-1">
                  Recoz
                </span>
                <span className="font-mono-tag text-[9px] tracking-[0.16em] text-[#8e909a] font-semibold uppercase leading-none">
                  FEEDBACK
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="p-1 text-[#8e909a] hover:text-white lg:hidden transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 pt-2 space-y-1">
            {mainNavLinks.map(({ label, href, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  to={href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[13.5px] font-inter font-medium transition-all duration-150 ${
                    active
                      ? "bg-[#17181c] text-white"
                      : "text-[#8e909a] hover:text-[#e4e5eb] hover:bg-[#141518]"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={2}
                    className={active ? "text-white" : "text-[#7b7d87]"}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Part: Settings & User Section */}
        <div className="px-3 pb-5 flex flex-col">
          {/* Settings Button */}
          <Link
            to="/settings"
            onClick={onClose}
            className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[13.5px] font-inter font-medium mb-5 transition-all duration-150 ${
              isSettingsActive
                ? "bg-[#18191e] text-white"
                : "text-[#8e909a] hover:text-[#e4e5eb] hover:bg-[#141518]"
            }`}
          >
            <Settings
              size={17}
              strokeWidth={2}
              className={isSettingsActive ? "text-white" : "text-[#7b7d87]"}
            />
            <span>Settings</span>
          </Link>

          {/* Signed In Header */}
          <div className="px-3">
            <span className="font-mono-tag text-[10px] tracking-[0.18em] text-[#3f729b] font-bold uppercase block mb-1">
              SIGNED IN
            </span>

            {/* User Name & Organization */}
            <p className="font-inter text-[13.5px] font-semibold text-white truncate leading-tight">
              {user?.name || "Aman Kumar Sahu"}
            </p>
            <p className="font-inter text-[12px] text-[#6b6d77] truncate mt-0.5 leading-tight">
              {organization?.name || "DesignFloww"}
            </p>

            {/* Sign out button */}
            <button
              onClick={logout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 mt-4 text-[13px] font-inter font-medium text-[#8e909a] hover:text-white transition-colors cursor-pointer group disabled:opacity-50"
            >
              <LogOut
                size={15}
                strokeWidth={2}
                className="text-[#7b7d87] group-hover:text-white transition-colors"
              />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}