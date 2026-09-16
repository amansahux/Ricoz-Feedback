import { createBrowserRouter } from "react-router";
import Login from "../../features/auth/ui/pages/Login.jsx";
import Register from "../../features/auth/ui/pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // {
  //   path: '/f/:organizationSlug/:surveySlug',
  //   element: <PublicFeedbackForm />,
  // },
  // {
  //   path: '/f/:organizationSlug/:surveySlug/thank-you',
  //   element: <ThankYou />,
  // },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Page not found
      </div>
    ),
  },
]);
