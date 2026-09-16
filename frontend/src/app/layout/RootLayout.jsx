import { useEffect } from "react";
import { Outlet } from "react-router";
import useAuth from "../../features/auth/hook/useAuth.jsx";

export default function RootLayout() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Hydrate user session on app load / refresh
    refreshUser();
  }, [refreshUser]);

  return <Outlet />;
}
