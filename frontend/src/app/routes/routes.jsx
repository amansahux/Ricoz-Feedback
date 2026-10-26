import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout.jsx";
import AppLayout from "../layout/AppLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PermissionRoute from "./PermissionRoute.jsx";
import PageLoader from "../../shared/components/PageLoader.jsx";

// Route-level Code Splitting (Lazy-loaded chunks)
const Login = lazy(() => import("../../features/auth/ui/pages/Login.jsx"));
const Register = lazy(() => import("../../features/auth/ui/pages/Register.jsx"));
const VerifyEmail = lazy(() => import("../../features/auth/ui/pages/VerifyEmail.jsx"));
const ForgotPassword = lazy(() => import("../../features/auth/ui/pages/ForgotPassword.jsx"));
const LandingPage = lazy(() => import("../../features/Landing/ui/pages/LandingPage.jsx"));
const GiveFeedback = lazy(() => import("../../features/customers/ui/pages/giveFeedback.jsx"));
const Dashboard = lazy(() => import("../../features/dashboard/ui/pages/Dashboard.jsx"));
const Setting = lazy(() => import("../../features/setting/ui/pages/Setting.jsx"));
const Survey = lazy(() => import("../../features/surveys/ui/pages/Survey.jsx"));
const CreateSurvey = lazy(() => import("../../features/surveys/ui/pages/CreateSurvey.jsx"));
const PublishSurvey = lazy(() => import("../../features/surveys/ui/pages/PublishSurvey.jsx"));
const Feedback = lazy(() => import("../../features/feedback/ui/pages/Feedback.jsx"));
const FeedbackDetails = lazy(() => import("../../features/feedback/ui/pages/FeedbackDetails.jsx"));
const Customer = lazy(() => import("../../features/customers/ui/pages/Customer.jsx"));
const CustomerDetail = lazy(() => import("../../features/customers/ui/pages/CustomerDetail.jsx"));
const Analytics = lazy(() => import("../../features/analytics/ui/pages/Analytics.jsx"));
const NotFound = lazy(() => import("../../global/NotFound.jsx"));
const Team = lazy(() => import("../../features/team/ui/pages/Team.jsx"));
const MemberDetail = lazy(() => import("../../features/team/ui/pages/MemberDetail.jsx"));
const AcceptInvitation = lazy(() => import("../../features/team/ui/pages/AcceptInvitation.jsx"));

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: withSuspense(Login),
      },
      {
        path: "register",
        element: withSuspense(Register),
      },
      {
        path: "verify-email",
        element: withSuspense(VerifyEmail),
      },
      {
        path: "",
        element: withSuspense(LandingPage),
      },
      {
        path: "f/:organizationSlug/:surveySlug",
        element: withSuspense(GiveFeedback),
      },
      {
        path: "forgot-password",
        element: withSuspense(ForgotPassword),
      },
      {
        path: "invitations/:token",
        element: withSuspense(AcceptInvitation),
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
            element: (
              <PermissionRoute allowedRoles={["owner", "admin"]}>
                {withSuspense(Dashboard)}
              </PermissionRoute>
            ),
          },
          {
            path: "team",
            element: (
              <PermissionRoute allowedRoles={["owner"]}>
                {withSuspense(Team)}
              </PermissionRoute>
            ),
          },
          {
            path: "team/:memberId",
            element: (
              <PermissionRoute allowedRoles={["owner"]}>
                {withSuspense(MemberDetail)}
              </PermissionRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <PermissionRoute allowedRoles={["owner", "admin","support_agent"]}>
                {withSuspense(Setting)}
              </PermissionRoute>
            ),
          },
          {
            path: "surveys",
            element: (
              <PermissionRoute allowedRoles={["owner", "admin"]}>
                {withSuspense(Survey)}
              </PermissionRoute>
            ),
          },
          {
            path: "surveys/create",
            element: (
              <PermissionRoute allowedRoles={["owner", "admin"]}>
                {withSuspense(CreateSurvey)}
              </PermissionRoute>
            ),
          },
          {
            path: "surveys/publish",
            element: (
              <PermissionRoute allowedRoles={["owner", "admin"]}>
                {withSuspense(PublishSurvey)}
              </PermissionRoute>
            ),
          },
          {
            path: "feedback",
            element: withSuspense(Feedback),
          },
          {
            path: "feedback/:feedbackId",
            element: withSuspense(FeedbackDetails),
          },
          {
            path: "customers",
            element: withSuspense(Customer),
          },
          {
            path: "customers/:customerId",
            element: withSuspense(CustomerDetail),
          },
          {
            path: "analytics",
            element: (
              <PermissionRoute allowedRoles={["owner"]}>
                {withSuspense(Analytics)}
              </PermissionRoute>
            ),
          },
        ],
      },
      {
        path: "*",
        element: withSuspense(NotFound),
      },
    ],
  },
]);

