import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes/routes.jsx";
import useAuth from "../features/auth/hook/useAuth.jsx";

export default function App() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Hydrate user session on initial load or refresh
    refreshUser();
  }, [refreshUser]);

  return <RouterProvider router={router} />;
}
