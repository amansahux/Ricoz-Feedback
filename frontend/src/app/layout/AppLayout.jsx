import { useState } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import Sidebar from "../../global/Sidebar.jsx";
import useAuth from "../../features/auth/hook/useAuth.jsx";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { organization } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Fixed Responsive Sidebar (240px wide) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px]">
        {/* Mobile Header with Hamburger */}
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-[#FFFAF3]/90 backdrop-blur-md border-b border-[#EFE4D6] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="p-1.5 -ml-1 rounded-xl text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC] focus:outline-none transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#bb0028] flex items-center justify-center text-white font-epilogue font-bold text-xs shadow-xs">
                R
              </div>
              <span className="font-epilogue font-bold text-sm text-[#1f1b18]">
                Recoz
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#7d7461] font-medium truncate block max-w-[150px]">
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
