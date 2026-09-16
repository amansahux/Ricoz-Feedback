import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout.jsx";
import Login from "../../features/auth/ui/pages/Login.jsx";
import Register from "../../features/auth/ui/pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-screen text-gray-400 bg-slate-950">
            Page not found
          </div>
        ),
      },
    ],
  },
]);
