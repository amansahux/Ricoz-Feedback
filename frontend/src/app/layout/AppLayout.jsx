import { useState } from "react";
import { Outlet } from "react-router";
import { Menu, Sparkles } from "lucide-react";
import Sidebar from "../../global/Sidebar.jsx";
import useAuth from "../../features/auth/hook/useAuth.jsx";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { organization } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Fixed Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on large screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile & Tablet Header with Hamburger Button */}
        <header className="lg:hidden sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="p-2 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
              <span className="font-poppins font-bold text-base text-white">
                RECOZ
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium truncate block max-w-[120px] sm:max-w-[200px]">
              {organization?.name || "Workspace"}
            </span>
          </div>
        </header>

        {/* Dynamic Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
