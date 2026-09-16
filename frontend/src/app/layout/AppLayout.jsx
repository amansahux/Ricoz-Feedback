import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import Sidebar from "../../global/Sidebar.jsx";
import useAuth from "../../features/auth/hook/useAuth.jsx";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { organization } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#e1e2e6] flex">
      {/* Fixed Responsive Sidebar (240px wide) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px]">
        {/* Mobile Header with Hamburger */}
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-[#0c0d10]/90 backdrop-blur-md border-b border-[#1a1b1f] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="p-1.5 -ml-1 rounded-lg text-[#8e909a] hover:text-white hover:bg-[#18191e] focus:outline-none transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[5px] bg-[#e11d48] flex items-center justify-center text-white">
                <svg
                  className="w-3 h-3 fill-none stroke-current stroke-[2.2]"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="font-poppins font-bold text-sm text-white">
                Recoz
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#8e909a] font-medium truncate block max-w-[150px]">
              {organization?.name || "Workspace"}
            </span>
          </div>
        </header>

        {/* Dynamic Page Content Outlet */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
