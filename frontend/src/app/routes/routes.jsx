import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layout/RootLayout.jsx";
import AppLayout from "../layout/AppLayout.jsx";
import Login from "../../features/auth/ui/pages/Login.jsx";
import Register from "../../features/auth/ui/pages/Register.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard.jsx";
import Setting from "../../features/setting/ui/pages/Setting.jsx";
import NotFound from "../../global/NotFound.jsx";
import Survey from "../../features/surveys/ui/pages/Survey.jsx";
import Feedback from "../../features/feedback/ui/pages/Feedback.jsx";
import Customer from "../../features/customers/ui/pages/Customer.jsx";
import Analytics from "../../features/analytics/ui/pages/Analytics.jsx";
import CreateSurvey from "../../features/surveys/ui/pages/CreateSurvey.jsx";
import PublishSurvey from "../../features/surveys/ui/pages/PublishSurvey.jsx";
import LandingPage from "../../features/Landing/ui/pages/LandingPage.jsx";
import GiveFeedback from "../../features/customers/ui/pages/giveFeedback.jsx";
import FeedbackDetails from "../../features/feedback/ui/pages/FeedbackDetails.jsx";
import CustomerDetail from "../../features/customers/ui/pages/CustomerDetail.jsx";


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
        path:"",
        element:<LandingPage/>
      },
      {
        path:"f/:organizationSlug/:surveySlug",
        element:<GiveFeedback/>
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
            element: <Survey/>,
          },
          {
            path: "surveys/create",
            element: <CreateSurvey/>,
          },
          {
            path: "surveys/publish",
            element: <PublishSurvey/>,
          },
          {
            path: "feedback",
            element:<Feedback/>,
          },
          {
            path: "feedback/:feedbackId",
            element:<FeedbackDetails/>,
          },
          {
            path: "customers",
            element: <Customer/>,
          },
          {
            path: "customers/:customerId",
            element: <CustomerDetail/>,
          },
          {
            path: "analytics",
            element: <Analytics/>,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
