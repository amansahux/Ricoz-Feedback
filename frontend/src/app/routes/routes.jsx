import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout.jsx";
import Login from "../../features/auth/ui/pages/Login.jsx";
import Register from "../../features/auth/ui/pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard.jsx";
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
        element: <NotFound />,
      },
    ],
  },
]);
