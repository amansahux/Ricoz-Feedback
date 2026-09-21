import { useAuth } from "../../features/auth/hook/useAuth.jsx";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return (
      <div className="relative min-h-screen">
        {/* Render children in background with blur effect */}
        <div className="filter blur-md pointer-events-none select-none opacity-60">
          {children}
        </div>

        {/* Warm, translucent backdrop overlay with premium spinner */}
        <div className="fixed inset-0 z-50 bg-[#FFFAF3]/60 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-white/80 border border-[#EFE4D6] shadow-xl backdrop-blur-lg flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-3 border-[#bb0028]/20 border-t-[#bb0028] rounded-full animate-spin" />
            <p className="text-xs font-inter font-semibold text-[#1f1b18] tracking-tight">
              Restoring your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}