import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layout/RootLayout.jsx";
import AppLayout from "../layout/AppLayout.jsx";
import Login from "../../features/auth/ui/pages/Login.jsx";
import Register from "../../features/auth/ui/pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard.jsx";
import Setting from "../../features/setting/ui/pages/Setting.jsx";
import NotFound from "../../global/NotFound.jsx";

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
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "settings",
            element: <Setting />,
          },
          {
            path: "surveys",
            element: <div className="p-6 text-slate-300">Surveys</div>,
          },
          {
            path: "feedback",
            element: <div className="p-6 text-slate-300">Feedback</div>,
          },
          {
            path: "customers",
            element: <div className="p-6 text-slate-300">Customers</div>,
          },
          {
            path: "analytics",
            element: <div className="p-6 text-slate-300">Analytics</div>,
          },
        ],
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
