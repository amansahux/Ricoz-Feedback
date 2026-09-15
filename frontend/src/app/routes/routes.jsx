import { createBrowserRouter } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../routes/ProtectedRoute';
import PublicFeedbackForm from '../features/surveys/pages/PublicFeedbackForm';
import ThankYou from '../features/surveys/pages/ThankYou';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/f/:organizationSlug/:surveySlug',
    element: <PublicFeedbackForm />,
  },
  {
    path: '/f/:organizationSlug/:surveySlug/thank-you',
    element: <ThankYou />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <div className="flex items-center justify-center h-screen text-gray-600">Page not found</div>,
  },
]);